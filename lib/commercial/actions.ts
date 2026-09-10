"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser, requireProfessionalUser } from "@/lib/auth/helpers";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  leadCommercialSettingsSchema,
  leadPricingRuleMutationSchema,
  leadPricingRuleToggleSchema,
  leadPurchaseSchema,
  leadRefundSchema,
  walletAdminMutationSchema,
} from "@/lib/validation";

function redirectWithMessage(path: string, key: "error" | "success", message: string): never {
  const params = new URLSearchParams({ [key]: message });
  redirect(`${path}?${params.toString()}`);
}

function parseOptionalNumber(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length ? Number(text) : undefined;
}

export async function purchaseLeadAction(formData: FormData) {
  await requireProfessionalUser();
  const payload = leadPurchaseSchema.safeParse({
    leadId: formData.get("lead_id"),
    idempotencyKey: formData.get("idempotency_key"),
    redirectTo: formData.get("redirect_to"),
  });

  if (!payload.success) {
    redirectWithMessage("/vakman/aanvragen", "error", "De leadaankoop kon niet worden gestart.");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.rpc("purchase_lead", {
    target_lead_id: payload.data.leadId,
    purchase_idempotency_key: payload.data.idempotencyKey || null,
  });

  if (error) {
    const message = error.message.includes("INSUFFICIENT_BALANCE")
      ? "Onvoldoende credits. Credits kopen wordt binnenkort beschikbaar."
        : error.message.includes("IDEMPOTENCY_KEY_CONFLICT")
          ? "Deze aankoopbevestiging hoort bij een andere lead. Vernieuw de pagina en probeer opnieuw."
          : error.message.includes("LEAD_PURCHASE_REFUNDED")
            ? "Deze lead is eerder terugbetaald en kan in deze fase niet opnieuw worden gekocht."
        : error.message.includes("LEAD_SOLD_OUT") || error.message.includes("LEAD_NOT_AVAILABLE")
          ? "Deze lead is niet meer beschikbaar."
        : error.message.includes("LEAD_MATCH_REQUIRED")
          ? "Je account komt niet in aanmerking voor deze lead."
          : "De leadaankoop kon niet worden afgerond.";
    redirectWithMessage(payload.data.redirectTo, "error", message);
  }

  revalidatePath("/vakman");
  revalidatePath("/vakman/aanvragen");
  revalidatePath("/vakman/credits");
  revalidatePath(`/vakman/aanvragen/${payload.data.leadId}`);
  revalidatePath("/admin");
  revalidatePath(`/admin/leads/${payload.data.leadId}`);
  redirectWithMessage(`/vakman/aanvragen/${payload.data.leadId}`, "success", "Lead succesvol gekocht en contactgegevens zijn vrijgegeven.");
}

export async function applyAdminWalletMutationAction(formData: FormData) {
  await requireAdminUser();
  const payload = walletAdminMutationSchema.safeParse({
    professionalId: formData.get("professional_id"),
    type: formData.get("type"),
    amount: formData.get("amount"),
    reason: formData.get("reason"),
    reference: formData.get("reference"),
    redirectTo: formData.get("redirect_to"),
  });

  if (!payload.success) {
    redirectWithMessage("/admin/credits", "error", payload.error.issues[0]?.message ?? "De walletmutatie is ongeldig.");
  }

  const signedAmount = payload.data.type === "admin_debit" ? -payload.data.amount : payload.data.amount;
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.rpc("apply_wallet_transaction", {
    target_professional_id: payload.data.professionalId,
    transaction_type: payload.data.type,
    transaction_amount: signedAmount,
    transaction_reference: payload.data.reference || null,
    transaction_description: payload.data.reason,
    transaction_metadata: { source: "admin_credits" },
  });

  if (error) {
    const message = error.message.includes("INSUFFICIENT_BALANCE")
      ? "Afboeking geblokkeerd: onvoldoende saldo."
      : error.message.includes("INVALID_TRANSACTION_AMOUNT_SIGN")
        ? "Type en teken van de walletmutatie komen niet overeen."
      : "De walletmutatie kon niet worden opgeslagen.";
    redirectWithMessage(payload.data.redirectTo, "error", message);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/credits");
  revalidatePath(`/admin/vakmannen/${payload.data.professionalId}`);
  revalidatePath("/vakman/credits");
  redirectWithMessage(payload.data.redirectTo, "success", "Wallettransactie opgeslagen in het ledger.");
}

export async function upsertLeadPricingRuleAction(formData: FormData) {
  const user = await requireAdminUser();
  const payload = leadPricingRuleMutationSchema.safeParse({
    ruleId: formData.get("rule_id"),
    serviceId: formData.get("service_id"),
    subserviceSlug: formData.get("subservice_slug"),
    leadType: formData.get("lead_type"),
    basePriceCredits: formData.get("base_price_credits"),
    exclusiveMultiplier: parseOptionalNumber(formData.get("exclusive_multiplier")),
    sharedMultiplier: parseOptionalNumber(formData.get("shared_multiplier")),
    minScore: parseOptionalNumber(formData.get("min_score")),
    maxScore: parseOptionalNumber(formData.get("max_score")),
    active: formData.get("active") === "on",
    priority: formData.get("priority"),
    redirectTo: formData.get("redirect_to"),
  });

  if (!payload.success) {
    redirectWithMessage("/admin/lead-prijzen", "error", payload.error.issues[0]?.message ?? "Prijsregel is ongeldig.");
  }

  const supabase = await createServerSupabaseClient();
  const serviceId = payload.data.serviceId || null;
  const { data: service } = serviceId
    ? await supabase.from("services").select("slug").eq("id", serviceId).maybeSingle()
    : { data: null };

  const values = {
    service_id: serviceId,
    service_slug: service?.slug ?? null,
    subservice_slug: payload.data.subserviceSlug || null,
    lead_type: payload.data.leadType,
    base_price_credits: payload.data.basePriceCredits,
    exclusive_multiplier: payload.data.exclusiveMultiplier ?? null,
    shared_multiplier: payload.data.sharedMultiplier ?? null,
    min_score: payload.data.minScore ?? null,
    max_score: payload.data.maxScore ?? null,
    active: payload.data.active,
    priority: payload.data.priority,
    updated_at: new Date().toISOString(),
  };

  const response = payload.data.ruleId
    ? await supabase.from("lead_pricing_rules").update(values).eq("id", payload.data.ruleId).select("id").single()
    : await supabase.from("lead_pricing_rules").insert(values).select("id").single();

  if (response.error || !response.data) {
    redirectWithMessage(payload.data.redirectTo, "error", "Prijsregel kon niet worden opgeslagen.");
  }

  await supabase.from("commercial_audit_log").insert({
    actor_user_id: user.id,
    entity_type: "lead_pricing_rule",
    entity_id: response.data.id,
    action: "pricing_change",
    metadata: { lead_type: payload.data.leadType, service_id: serviceId, subservice_slug: payload.data.subserviceSlug || null },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/lead-prijzen");
  revalidatePath("/vakman/aanvragen");
  redirectWithMessage(payload.data.redirectTo, "success", payload.data.ruleId ? "Prijsregel bijgewerkt." : "Prijsregel toegevoegd.");
}

export async function toggleLeadPricingRuleAction(formData: FormData) {
  await requireAdminUser();
  const payload = leadPricingRuleToggleSchema.safeParse({
    ruleId: formData.get("rule_id"),
    active: formData.get("active") === "true",
    redirectTo: formData.get("redirect_to"),
  });

  if (!payload.success) {
    redirectWithMessage("/admin/lead-prijzen", "error", "Prijsregel kon niet worden bijgewerkt.");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("lead_pricing_rules").update({ active: payload.data.active }).eq("id", payload.data.ruleId);

  if (error) {
    redirectWithMessage(payload.data.redirectTo, "error", "Prijsregel kon niet worden bijgewerkt.");
  }

  revalidatePath("/admin/lead-prijzen");
  redirectWithMessage(payload.data.redirectTo, "success", "Prijsregelstatus bijgewerkt.");
}

export async function updateLeadCommercialSettingsAction(formData: FormData) {
  const user = await requireAdminUser();
  const payload = leadCommercialSettingsSchema.safeParse({
    leadId: formData.get("lead_id"),
    subserviceSlug: formData.get("subservice_slug"),
    commercialType: formData.get("commercial_type"),
    priceCredits: String(formData.get("price_credits") ?? ""),
    maxBuyers: formData.get("max_buyers"),
    salesStatus: formData.get("sales_status"),
    redirectTo: formData.get("redirect_to"),
  });

  if (!payload.success) {
    redirectWithMessage("/admin/leads", "error", payload.error.issues[0]?.message ?? "Commerciële instellingen zijn ongeldig.");
  }

  const supabase = await createServerSupabaseClient();
  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("buyers_count, commercial_type")
    .eq("id", payload.data.leadId)
    .maybeSingle();

  if (leadError || !lead) {
    redirectWithMessage(payload.data.redirectTo, "error", "Lead kon niet worden geladen.");
  }

  if (payload.data.maxBuyers < (lead.buyers_count ?? 0)) {
    redirectWithMessage(payload.data.redirectTo, "error", "Max buyers kan niet lager zijn dan het huidige aantal kopers.");
  }

  const { error } = await supabase
    .from("leads")
    .update({
      subservice_slug: payload.data.subserviceSlug || null,
      commercial_type: payload.data.commercialType,
      price_credits: payload.data.priceCredits,
      max_buyers: payload.data.maxBuyers,
      sales_status: payload.data.salesStatus,
      locked_at: payload.data.salesStatus === "sold_out" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", payload.data.leadId);

  if (error) {
    redirectWithMessage(payload.data.redirectTo, "error", "Commerciële instellingen konden niet worden opgeslagen.");
  }

  await createAdminSupabaseClient().rpc("refresh_lead_sales_state", { target_lead_id: payload.data.leadId });
  await supabase.from("commercial_audit_log").insert({
    actor_user_id: user.id,
    entity_type: "lead",
    entity_id: payload.data.leadId,
    action: lead.commercial_type === payload.data.commercialType ? "pricing_change" : "commercial_type_change",
    metadata: {
      commercial_type: payload.data.commercialType,
      price_credits: payload.data.priceCredits,
      max_buyers: payload.data.maxBuyers,
      sales_status: payload.data.salesStatus,
      subservice_slug: payload.data.subserviceSlug || null,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${payload.data.leadId}`);
  revalidatePath("/vakman/aanvragen");
  redirectWithMessage(payload.data.redirectTo, "success", "Commerciële leadinstellingen bijgewerkt.");
}

export async function refundLeadPurchaseAction(formData: FormData) {
  await requireAdminUser();
  const payload = leadRefundSchema.safeParse({
    purchaseId: formData.get("purchase_id"),
    reason: formData.get("reason"),
    redirectTo: formData.get("redirect_to"),
  });

  if (!payload.success) {
    redirectWithMessage("/admin/leads", "error", payload.error.issues[0]?.message ?? "Refund kon niet worden verwerkt.");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.rpc("refund_lead_purchase", {
    target_purchase_id: payload.data.purchaseId,
    refund_reason: payload.data.reason,
  });

  if (error) {
    const message = error.message.includes("PURCHASE_ALREADY_REFUNDED")
      ? "Deze aankoop is al terugbetaald."
      : "Refund kon niet worden verwerkt.";
    redirectWithMessage(payload.data.redirectTo, "error", message);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/credits");
  revalidatePath(payload.data.redirectTo);
  revalidatePath("/vakman/aanvragen");
  revalidatePath("/vakman/credits");
  redirectWithMessage(payload.data.redirectTo, "success", "Refund als nieuwe ledgertransactie verwerkt.");
}
