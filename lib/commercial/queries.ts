import "server-only";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getLeadMarketState } from "@/lib/commercial/market";
import { canProfessionalViewLeadContact, summarizeLeadDescription } from "@/lib/commercial/privacy";
import { resolveLeadPrice } from "@/lib/commercial/pricing";
import { getProfessionalLeadDetail } from "@/lib/leads/queries";
import type {
  LeadCommercialType,
  LeadPricingRule,
  LeadPurchaseStatus,
  LeadSalesStatus,
  Professional,
  Service,
  WalletTransactionType,
} from "@/types/database";

function firstOf<T>(value: T | T[] | null | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function toNumber(value: unknown) {
  return typeof value === "number" ? value : Number(value ?? 0);
}

export interface ProfessionalWalletOverview {
  walletId: string | null;
  cachedBalance: number;
  totals: {
    spentOnLeads: number;
    refunds: number;
    adminCredits: number;
    debits: number;
  };
  transactions: Array<{
    id: string;
    type: WalletTransactionType;
    amount: number;
    balanceAfter: number;
    description: string | null;
    reference: string | null;
    leadId: string | null;
    createdAt: string;
  }>;
  purchases: Array<{
    id: string;
    leadId: string;
    publicReference: string;
    priceCredits: number;
    status: LeadPurchaseStatus;
    purchasedAt: string;
    refundedAt: string | null;
  }>;
}

export interface ProfessionalLeadMarketListItem {
  leadId: string;
  publicReference: string;
  serviceName: string;
  serviceSlug: string;
  city: string | null;
  postalCodePrefix: string;
  urgency: string;
  leadScore: number | null;
  summary: string;
  commercialType: LeadCommercialType;
  priceCredits: number;
  salesStatus: LeadSalesStatus;
  buyersCount: number;
  maxBuyers: number;
  remainingSlots: number;
  state: "available" | "purchased" | "closed";
  assignmentStatus: string | null;
  purchaseStatus: LeadPurchaseStatus | null;
  purchasedAt: string | null;
  createdAt: string;
}

export interface ProfessionalLeadMarketDetail {
  mode: "preview" | "assigned-preview" | "unlocked";
  state: "available" | "purchased" | "closed";
  commercial: {
    commercialType: LeadCommercialType;
    priceCredits: number;
    salesStatus: LeadSalesStatus;
    buyersCount: number;
    maxBuyers: number;
    remainingSlots: number;
    currentBalance: number;
    balanceAfterPurchase: number;
    isPurchased: boolean;
  };
  preview: {
    leadId: string;
    publicReference: string;
    serviceName: string;
    serviceSlug: string;
    city: string | null;
    postalCodePrefix: string;
    urgency: string;
    leadScore: number | null;
    summary: string;
    createdAt: string;
  };
  assignment: {
    id: string | null;
    status: string | null;
  };
  detail: Awaited<ReturnType<typeof getProfessionalLeadDetail>> | null;
}

export interface AdminWalletRow {
  professionalId: string;
  companyName: string;
  contactName: string;
  status: Professional["status"];
  walletId: string | null;
  cachedBalance: number;
  ledgerBalance: number;
  isConsistent: boolean;
  totalIn: number;
  totalOut: number;
  lastTransactionAt: string | null;
}

export interface LeadPricingRuleView {
  id: string;
  serviceId: string | null;
  serviceName: string | null;
  serviceSlug: string | null;
  subserviceSlug: string | null;
  leadType: LeadCommercialType;
  basePriceCredits: number;
  exclusiveMultiplier: number | null;
  sharedMultiplier: number | null;
  minScore: number | null;
  maxScore: number | null;
  active: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCommercialStats {
  purchases: number;
  creditsSpent: number;
  refunds: number;
  averageLeadPrice: number;
  sharedPurchases: number;
  exclusivePurchases: number;
}

export interface AdminLeadCommercialDetail {
  leadId: string;
  publicReference: string;
  subserviceSlug: string | null;
  commercialType: LeadCommercialType;
  priceCredits: number | null;
  resolvedPriceCredits: number;
  salesStatus: LeadSalesStatus;
  buyersCount: number;
  maxBuyers: number;
  purchases: Array<{
    id: string;
    professionalId: string;
    companyName: string;
    priceCredits: number;
    commercialType: LeadCommercialType;
    status: LeadPurchaseStatus;
    purchasedAt: string;
    refundedAt: string | null;
  }>;
  audit: Array<{
    id: string;
    action: string;
    createdAt: string;
  }>;
}

async function getActivePricingRules() {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("lead_pricing_rules")
    .select("id, service_id, service_slug, subservice_slug, lead_type, base_price_credits, exclusive_multiplier, shared_multiplier, min_score, max_score, active, priority, created_at, updated_at")
    .eq("active", true)
    .order("priority", { ascending: false });

  if (error) {
    throw new Error("Prijsregels konden niet worden geladen.");
  }

  return ((data ?? []) as LeadPricingRule[]);
}

export async function getProfessionalWalletOverview(professionalId: string) {
  const supabase = await createServerSupabaseClient();
  const [{ data: wallet }, { data: transactionRows, error: transactionsError }, { data: purchaseRows, error: purchasesError }] = await Promise.all([
    supabase.from("professional_wallets").select("id, cached_balance").eq("professional_id", professionalId).maybeSingle(),
    supabase
      .from("wallet_transactions")
      .select("id, type, amount, balance_after, description, reference, lead_id, created_at")
      .eq("professional_id", professionalId)
      .order("created_at", { ascending: false })
      .limit(25),
    supabase
      .from("lead_purchases")
      .select("id, lead_id, price_credits, status, purchased_at, refunded_at, lead:leads(public_reference)")
      .eq("professional_id", professionalId)
      .order("purchased_at", { ascending: false })
      .limit(25),
  ]);

  if (transactionsError) {
    throw new Error("Wallettransacties konden niet worden geladen.");
  }

  if (purchasesError) {
    throw new Error("Aankoopgeschiedenis kon niet worden geladen.");
  }

  const transactions = ((transactionRows ?? []) as Array<Record<string, unknown>>).map((row) => ({
    id: String(row.id),
    type: row.type as WalletTransactionType,
    amount: toNumber(row.amount),
    balanceAfter: toNumber(row.balance_after),
    description: (row.description as string | null) ?? null,
    reference: (row.reference as string | null) ?? null,
    leadId: (row.lead_id as string | null) ?? null,
    createdAt: String(row.created_at),
  }));

  return {
    walletId: wallet?.id ?? null,
    cachedBalance: wallet?.cached_balance ?? 0,
    totals: {
      spentOnLeads: transactions.filter((row) => row.type === "lead_purchase").reduce((sum, row) => sum + Math.abs(row.amount), 0),
      refunds: transactions.filter((row) => row.type === "refund").reduce((sum, row) => sum + row.amount, 0),
      adminCredits: transactions.filter((row) => row.amount > 0 && row.type !== "refund").reduce((sum, row) => sum + row.amount, 0),
      debits: transactions.filter((row) => row.amount < 0).reduce((sum, row) => sum + Math.abs(row.amount), 0),
    },
    transactions,
    purchases: ((purchaseRows ?? []) as Array<Record<string, unknown>>).map((row) => ({
      id: String(row.id),
      leadId: String(row.lead_id),
      publicReference: String(firstOf(row.lead as { public_reference: string } | Array<{ public_reference: string }>)?.public_reference ?? "Onbekend"),
      priceCredits: toNumber(row.price_credits),
      status: row.status as LeadPurchaseStatus,
      purchasedAt: String(row.purchased_at),
      refundedAt: (row.refunded_at as string | null) ?? null,
    })),
  } satisfies ProfessionalWalletOverview;
}

export async function getProfessionalLeadMarketplace(professionalId: string) {
  const supabase = createAdminSupabaseClient();
  const rules = await getActivePricingRules();
  const [{ data: matchRows, error: matchError }, { data: assignmentRows, error: assignmentError }, { data: purchaseRows, error: purchaseError }] = await Promise.all([
    supabase.from("lead_matches").select("lead_id").eq("professional_id", professionalId),
    supabase.from("lead_assignments").select("id, lead_id, status, lead_purchase_id").eq("professional_id", professionalId),
    supabase.from("lead_purchases").select("id, lead_id, status, purchased_at").eq("professional_id", professionalId),
  ]);

  if (matchError || assignmentError || purchaseError) {
    throw new Error("De leadmarkt kon niet worden geladen.");
  }

  const leadIds = Array.from(new Set([
    ...((matchRows ?? []) as Array<{ lead_id: string }>).map((row) => row.lead_id),
    ...((assignmentRows ?? []) as Array<{ lead_id: string }>).map((row) => row.lead_id),
    ...((purchaseRows ?? []) as Array<{ lead_id: string }>).map((row) => row.lead_id),
  ]));

  if (leadIds.length === 0) {
    return [] as ProfessionalLeadMarketListItem[];
  }

  const { data: leadRows, error: leadError } = await supabase
    .from("leads")
    .select("id, public_reference, description, urgency, lead_score, city, postal_code, service_id, subservice_slug, created_at, commercial_type, price_credits, max_buyers, buyers_count, sales_status, service:services(name, slug)")
    .in("id", leadIds)
    .order("created_at", { ascending: false });

  if (leadError) {
    throw new Error("Leads konden niet worden geladen.");
  }

  const assignmentMap = new Map(((assignmentRows ?? []) as Array<Record<string, unknown>>).map((row) => [String(row.lead_id), row]));
  const purchaseMap = new Map(((purchaseRows ?? []) as Array<Record<string, unknown>>).map((row) => [String(row.lead_id), row]));

  return ((leadRows ?? []) as Array<Record<string, unknown>>).map((row) => {
    const service = firstOf(row.service as Pick<Service, "name" | "slug"> | Array<Pick<Service, "name" | "slug">>);
    const purchase = purchaseMap.get(String(row.id));
    const resolvedPrice = resolveLeadPrice({
      serviceId: String(row.service_id),
      serviceSlug: service?.slug ?? null,
      subserviceSlug: (row.subservice_slug as string | null) ?? null,
      leadType: row.commercial_type as LeadCommercialType,
      leadScore: typeof row.lead_score === "number" ? row.lead_score : row.lead_score === null ? null : Number(row.lead_score),
      priceOverrideCredits: row.price_credits as number | null,
      maxBuyers: toNumber(row.max_buyers),
      buyersCount: toNumber(row.buyers_count),
      salesStatus: row.sales_status as LeadSalesStatus,
    }, rules);
    const remainingSlots = Math.max(0, resolvedPrice.maxBuyers - toNumber(row.buyers_count));

    return {
      leadId: String(row.id),
      publicReference: String(row.public_reference),
      serviceName: service?.name ?? "Onbekend",
      serviceSlug: service?.slug ?? "onbekend",
      city: (row.city as string | null) ?? null,
      postalCodePrefix: String(row.postal_code).slice(0, 4),
      urgency: String(row.urgency),
      leadScore: typeof row.lead_score === "number" ? row.lead_score : row.lead_score === null ? null : Number(row.lead_score),
      summary: summarizeLeadDescription(String(row.description)),
      commercialType: row.commercial_type as LeadCommercialType,
      priceCredits: resolvedPrice.priceCredits,
      salesStatus: row.sales_status as LeadSalesStatus,
      buyersCount: toNumber(row.buyers_count),
      maxBuyers: resolvedPrice.maxBuyers,
      remainingSlots,
      state: getLeadMarketState({
        purchaseStatus: (purchase?.status as LeadPurchaseStatus | undefined) ?? null,
        salesStatus: row.sales_status as LeadSalesStatus,
        commercialType: row.commercial_type as LeadCommercialType,
        buyersCount: toNumber(row.buyers_count),
        maxBuyers: resolvedPrice.maxBuyers,
      }),
      assignmentStatus: (assignmentMap.get(String(row.id))?.status as string | undefined) ?? null,
      purchaseStatus: (purchase?.status as LeadPurchaseStatus | undefined) ?? null,
      purchasedAt: (purchase?.purchased_at as string | undefined) ?? null,
      createdAt: String(row.created_at),
    };
  }).sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function getProfessionalLeadMarketDetail(leadId: string, professionalId: string, actorUserId?: string) {
  const supabase = createAdminSupabaseClient();
  const rules = await getActivePricingRules();
  const [{ data: leadRow, error: leadError }, { data: assignment }, { data: purchase }, { data: wallet }] = await Promise.all([
    supabase
      .from("leads")
      .select("id, public_reference, description, urgency, lead_score, city, postal_code, service_id, subservice_slug, created_at, commercial_type, price_credits, max_buyers, buyers_count, sales_status, service:services(name, slug)")
      .eq("id", leadId)
      .maybeSingle(),
    supabase.from("lead_assignments").select("id, status, lead_purchase_id").eq("lead_id", leadId).eq("professional_id", professionalId).maybeSingle(),
    supabase.from("lead_purchases").select("id, status, purchased_at").eq("lead_id", leadId).eq("professional_id", professionalId).maybeSingle(),
    supabase.from("professional_wallets").select("cached_balance").eq("professional_id", professionalId).maybeSingle(),
  ]);

  if (leadError) {
    throw new Error("Lead kon niet worden geladen.");
  }

  if (!leadRow) {
    return null;
  }

  const { data: match } = await supabase.from("lead_matches").select("id").eq("lead_id", leadId).eq("professional_id", professionalId).maybeSingle();
  if (!match && !assignment && !purchase) {
    return null;
  }

  const service = firstOf(leadRow.service as Pick<Service, "name" | "slug"> | Array<Pick<Service, "name" | "slug">>);
  const resolvedPrice = resolveLeadPrice({
    serviceId: String(leadRow.service_id),
    serviceSlug: service?.slug ?? null,
    subserviceSlug: (leadRow.subservice_slug as string | null) ?? null,
    leadType: leadRow.commercial_type as LeadCommercialType,
    leadScore: typeof leadRow.lead_score === "number" ? leadRow.lead_score : leadRow.lead_score === null ? null : Number(leadRow.lead_score),
    priceOverrideCredits: leadRow.price_credits as number | null,
    maxBuyers: toNumber(leadRow.max_buyers),
    buyersCount: toNumber(leadRow.buyers_count),
    salesStatus: leadRow.sales_status as LeadSalesStatus,
  }, rules);
  const canViewContact = canProfessionalViewLeadContact({
    purchaseStatus: (purchase?.status as LeadPurchaseStatus | undefined) ?? null,
    assignmentStatus: (assignment?.status as "pending" | "viewed" | "accepted" | "rejected" | undefined) ?? null,
    assignmentPurchaseLinked: Boolean(assignment?.lead_purchase_id),
  });
  const state = getLeadMarketState({
    purchaseStatus: (purchase?.status as LeadPurchaseStatus | undefined) ?? null,
    salesStatus: leadRow.sales_status as LeadSalesStatus,
    commercialType: leadRow.commercial_type as LeadCommercialType,
    buyersCount: toNumber(leadRow.buyers_count),
    maxBuyers: resolvedPrice.maxBuyers,
  });
  const remainingSlots = Math.max(0, resolvedPrice.maxBuyers - toNumber(leadRow.buyers_count));
  const detail = canViewContact ? await getProfessionalLeadDetail(leadId, professionalId, actorUserId) : null;

  return {
    mode: canViewContact ? "unlocked" : assignment ? "assigned-preview" : "preview",
    state,
    commercial: {
      commercialType: leadRow.commercial_type as LeadCommercialType,
      priceCredits: resolvedPrice.priceCredits,
      salesStatus: leadRow.sales_status as LeadSalesStatus,
      buyersCount: toNumber(leadRow.buyers_count),
      maxBuyers: resolvedPrice.maxBuyers,
      remainingSlots,
      currentBalance: wallet?.cached_balance ?? 0,
      balanceAfterPurchase: (wallet?.cached_balance ?? 0) - resolvedPrice.priceCredits,
      isPurchased: purchase?.status === "purchased",
    },
    preview: {
      leadId: String(leadRow.id),
      publicReference: String(leadRow.public_reference),
      serviceName: service?.name ?? "Onbekend",
      serviceSlug: service?.slug ?? "onbekend",
      city: (leadRow.city as string | null) ?? null,
      postalCodePrefix: String(leadRow.postal_code).slice(0, 4),
      urgency: String(leadRow.urgency),
      leadScore: typeof leadRow.lead_score === "number" ? leadRow.lead_score : leadRow.lead_score === null ? null : Number(leadRow.lead_score),
      summary: summarizeLeadDescription(String(leadRow.description), 260),
      createdAt: String(leadRow.created_at),
    },
    assignment: {
      id: assignment?.id ?? null,
      status: assignment?.status ?? null,
    },
    detail,
  } satisfies ProfessionalLeadMarketDetail;
}

export async function getAdminWalletOverview() {
  const supabase = createAdminSupabaseClient();
  const [{ data: professionals, error: professionalsError }, { data: wallets, error: walletsError }, { data: transactions, error: transactionsError }] = await Promise.all([
    supabase.from("professionals").select("id, company_name, contact_name, status").order("company_name"),
    supabase.from("professional_wallets").select("id, professional_id, cached_balance"),
    supabase.from("wallet_transactions").select("professional_id, amount, created_at").order("created_at", { ascending: false }),
  ]);

  if (professionalsError || walletsError || transactionsError) {
    throw new Error("Walletoverzicht kon niet worden geladen.");
  }

  const walletMap = new Map(((wallets ?? []) as Array<Record<string, unknown>>).map((row) => [String(row.professional_id), row]));
  const transactionMap = new Map<string, Array<{ amount: number; created_at: string }>>();
  for (const row of ((transactions ?? []) as Array<Record<string, unknown>>)) {
    const key = String(row.professional_id);
    const list = transactionMap.get(key) ?? [];
    list.push({ amount: toNumber(row.amount), created_at: String(row.created_at) });
    transactionMap.set(key, list);
  }

  return ((professionals ?? []) as Array<Record<string, unknown>>).map((row) => {
    const professionalTransactions = transactionMap.get(String(row.id)) ?? [];
    const wallet = walletMap.get(String(row.id));
    return {
      professionalId: String(row.id),
      companyName: String(row.company_name),
      contactName: String(row.contact_name),
      status: row.status as Professional["status"],
      walletId: wallet ? String(wallet.id) : null,
      cachedBalance: wallet ? toNumber(wallet.cached_balance) : 0,
      ledgerBalance: professionalTransactions.reduce((sum, item) => sum + item.amount, 0),
      isConsistent: (wallet ? toNumber(wallet.cached_balance) : 0) === professionalTransactions.reduce((sum, item) => sum + item.amount, 0),
      totalIn: professionalTransactions.filter((item) => item.amount > 0).reduce((sum, item) => sum + item.amount, 0),
      totalOut: professionalTransactions.filter((item) => item.amount < 0).reduce((sum, item) => sum + Math.abs(item.amount), 0),
      lastTransactionAt: professionalTransactions[0]?.created_at ?? null,
    } satisfies AdminWalletRow;
  });
}

export async function getAdminLeadPricingRules() {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("lead_pricing_rules")
    .select("id, service_id, service_slug, subservice_slug, lead_type, base_price_credits, exclusive_multiplier, shared_multiplier, min_score, max_score, active, priority, created_at, updated_at, service:services(name)")
    .order("priority", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Prijsregels konden niet worden geladen.");
  }

  return ((data ?? []) as Array<Record<string, unknown>>).map((row) => ({
    id: String(row.id),
    serviceId: (row.service_id as string | null) ?? null,
    serviceName: firstOf(row.service as { name: string } | Array<{ name: string }>)?.name ?? null,
    serviceSlug: (row.service_slug as string | null) ?? null,
    subserviceSlug: (row.subservice_slug as string | null) ?? null,
    leadType: row.lead_type as LeadCommercialType,
    basePriceCredits: toNumber(row.base_price_credits),
    exclusiveMultiplier: row.exclusive_multiplier === null ? null : Number(row.exclusive_multiplier),
    sharedMultiplier: row.shared_multiplier === null ? null : Number(row.shared_multiplier),
    minScore: row.min_score === null ? null : toNumber(row.min_score),
    maxScore: row.max_score === null ? null : toNumber(row.max_score),
    active: Boolean(row.active),
    priority: toNumber(row.priority),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  } satisfies LeadPricingRuleView));
}

export async function getAdminCommercialStats() {
  const supabase = createAdminSupabaseClient();
  const [{ count: purchasesCount }, { data: spentRows }, { count: refundsCount }, { data: sharedRows }, { data: exclusiveRows }] = await Promise.all([
    supabase.from("lead_purchases").select("id", { count: "exact", head: true }).eq("status", "purchased"),
    supabase.from("wallet_transactions").select("amount, type").eq("type", "lead_purchase"),
    supabase.from("lead_purchases").select("id", { count: "exact", head: true }).eq("status", "refunded"),
    supabase.from("lead_purchases").select("price_credits").eq("status", "purchased").eq("commercial_type", "shared"),
    supabase.from("lead_purchases").select("price_credits").eq("status", "purchased").eq("commercial_type", "exclusive"),
  ]);

  const spent = ((spentRows ?? []) as Array<{ amount: number }>).reduce((sum, row) => sum + Math.abs(toNumber(row.amount)), 0);
  const purchasedPrices = [
    ...((sharedRows ?? []) as Array<{ price_credits: number }>),
    ...((exclusiveRows ?? []) as Array<{ price_credits: number }>),
  ].map((row) => toNumber(row.price_credits));

  return {
    purchases: purchasesCount ?? 0,
    creditsSpent: spent,
    refunds: refundsCount ?? 0,
    averageLeadPrice: purchasedPrices.length ? Number((purchasedPrices.reduce((sum, value) => sum + value, 0) / purchasedPrices.length).toFixed(1)) : 0,
    sharedPurchases: (sharedRows ?? []).length,
    exclusivePurchases: (exclusiveRows ?? []).length,
  } satisfies AdminCommercialStats;
}

export async function getAdminLeadCommercialDetail(leadId: string) {
  const supabase = createAdminSupabaseClient();
  const rules = await getActivePricingRules();
  const [{ data: lead, error: leadError }, { data: purchases, error: purchasesError }, { data: audit, error: auditError }] = await Promise.all([
    supabase
      .from("leads")
      .select("id, public_reference, service_id, subservice_slug, lead_score, commercial_type, price_credits, buyers_count, max_buyers, sales_status, service:services(slug)")
      .eq("id", leadId)
      .maybeSingle(),
    supabase
      .from("lead_purchases")
      .select("id, professional_id, price_credits, commercial_type, status, purchased_at, refunded_at, professional:professionals(company_name)")
      .eq("lead_id", leadId)
      .order("purchased_at", { ascending: false }),
    supabase
      .from("commercial_audit_log")
      .select("id, action, created_at")
      .eq("entity_id", leadId)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  if (leadError || purchasesError || auditError) {
    throw new Error("Commerciële leaddata kon niet worden geladen.");
  }

  if (!lead) {
    return null;
  }

  const service = firstOf(lead.service as { slug: string } | Array<{ slug: string }>);
  const resolved = resolveLeadPrice({
    serviceId: String(lead.service_id),
    serviceSlug: service?.slug ?? null,
    subserviceSlug: (lead.subservice_slug as string | null) ?? null,
    leadType: lead.commercial_type as LeadCommercialType,
    leadScore: lead.lead_score === null ? null : toNumber(lead.lead_score),
    priceOverrideCredits: lead.price_credits as number | null,
    maxBuyers: toNumber(lead.max_buyers),
    buyersCount: toNumber(lead.buyers_count),
    salesStatus: lead.sales_status as LeadSalesStatus,
  }, rules);

  return {
    leadId: String(lead.id),
    publicReference: String(lead.public_reference),
    subserviceSlug: (lead.subservice_slug as string | null) ?? null,
    commercialType: lead.commercial_type as LeadCommercialType,
    priceCredits: lead.price_credits === null ? null : toNumber(lead.price_credits),
    resolvedPriceCredits: resolved.priceCredits,
    salesStatus: lead.sales_status as LeadSalesStatus,
    buyersCount: toNumber(lead.buyers_count),
    maxBuyers: toNumber(lead.max_buyers),
    purchases: ((purchases ?? []) as Array<Record<string, unknown>>).map((row) => ({
      id: String(row.id),
      professionalId: String(row.professional_id),
      companyName: String(firstOf(row.professional as { company_name: string } | Array<{ company_name: string }>)?.company_name ?? "Onbekend"),
      priceCredits: toNumber(row.price_credits),
      commercialType: row.commercial_type as LeadCommercialType,
      status: row.status as LeadPurchaseStatus,
      purchasedAt: String(row.purchased_at),
      refundedAt: (row.refunded_at as string | null) ?? null,
    })),
    audit: ((audit ?? []) as Array<Record<string, unknown>>).map((row) => ({
      id: String(row.id),
      action: String(row.action),
      createdAt: String(row.created_at),
    })),
  } satisfies AdminLeadCommercialDetail;
}
