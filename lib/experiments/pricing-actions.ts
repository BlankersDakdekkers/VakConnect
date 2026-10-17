"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/auth/helpers";
import { experimentStatusValues } from "@/lib/experiments/targeting";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  pricingDecisionSchema,
  pricingExperimentDraftSchema,
} from "@/lib/validation";

const idPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const pricingPath = "/admin/experimenten/pricing";

function redirectPricing(key: "success" | "error", message: string): never {
  redirect(`${pricingPath}?${new URLSearchParams({ [key]: message }).toString()}`);
}

export async function createPricingExperimentAction(formData: FormData) {
  const admin = await requireAdminUser();
  const payload = pricingExperimentDraftSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    serviceIds: formData.getAll("service_ids").filter((value): value is string => typeof value === "string").join(","),
    commercialTypes: String(formData.get("commercial_types") ?? ""),
    controlPriceMin: String(formData.get("control_price_min") ?? ""),
    controlPriceMax: String(formData.get("control_price_max") ?? ""),
    pilotProfessionalIds: String(formData.get("pilot_professional_ids") ?? ""),
    primaryMetric: String(formData.get("primary_metric") ?? ""),
    controlWeight: String(formData.get("control_weight") ?? ""),
    variantWeight: String(formData.get("variant_weight") ?? ""),
    variantPriceCredits: String(formData.get("variant_price_credits") ?? ""),
  });
  if (!payload.success) redirectPricing("error", payload.error.issues[0]?.message ?? "Controleer de experimentinstellingen.");

  const { data, error } = await createAdminSupabaseClient().rpc("create_pricing_experiment", {
    input_name: payload.data.name,
    input_description: payload.data.description,
    input_config: payload.data.config,
    input_primary_metric: payload.data.primaryMetric,
    input_control_weight: payload.data.controlWeight,
    input_variant_price: payload.data.variantPriceCredits,
    input_variant_weight: payload.data.variantWeight,
    input_actor_user_id: admin.id,
  });
  if (error || !data) {
    const message = error?.message.includes("SERVICE_INVALID")
      ? "Selecteer alleen bestaande actieve diensten."
      : "Concept kon niet worden aangemaakt. Controleer de prijzen, segmenten en allocatie.";
    redirectPricing("error", message);
  }
  revalidatePath(pricingPath);
  revalidatePath("/admin/experimenten");
  redirectPricing("success", "Pricingexperiment als concept aangemaakt. Het staat niet live.");
}

export async function transitionPricingExperimentAction(formData: FormData) {
  const admin = await requireAdminUser();
  const experimentId = String(formData.get("experiment_id") ?? "");
  const nextStatus = String(formData.get("next_status") ?? "");
  if (!idPattern.test(experimentId) || !experimentStatusValues.includes(nextStatus as (typeof experimentStatusValues)[number]) || nextStatus === "draft") {
    redirectPricing("error", "Ongeldige statusovergang.");
  }

  const { error } = await createAdminSupabaseClient().rpc("transition_experiment_status", {
    input_experiment_id: experimentId,
    input_next_status: nextStatus,
    input_actor_user_id: admin.id,
  });
  if (error) redirectPricing("error", "Status niet gewijzigd. Controleer status, control, prijzen, allocatie en segment.");
  revalidatePath(pricingPath);
  revalidatePath(`/admin/experimenten/${experimentId}`);
  redirectPricing("success", "Pricingexperimentstatus bijgewerkt.");
}

export async function recordPricingExperimentDecisionAction(formData: FormData) {
  const admin = await requireAdminUser();
  const payload = pricingDecisionSchema.safeParse({
    experimentId: formData.get("experiment_id"),
    decision: formData.get("decision"),
    note: formData.get("note"),
  });
  if (!payload.success) redirectPricing("error", payload.error.issues[0]?.message ?? "Beslisnotitie is ongeldig.");

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.rpc("record_pricing_experiment_decision", {
    target_experiment_id: payload.data.experimentId,
    input_decision: payload.data.decision,
    input_note: payload.data.note,
    input_actor_user_id: admin.id,
  });
  if (error) redirectPricing("error", "Beslissing niet opgeslagen. Pauzeer of voltooi het experiment eerst.");
  revalidatePath(pricingPath);
  redirectPricing("success", "Handmatige beslissing vastgelegd. De basisprijs is niet gewijzigd.");
}
