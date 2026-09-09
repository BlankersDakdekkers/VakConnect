import type { LeadCommercialType, LeadPricingRule, LeadSalesStatus } from "@/types/database";

export interface LeadPricingInput {
  serviceId?: string | null;
  serviceSlug?: string | null;
  subserviceSlug?: string | null;
  leadType: LeadCommercialType;
  leadScore?: number | null;
  priceOverrideCredits?: number | null;
  maxBuyers: number;
  buyersCount: number;
  salesStatus: LeadSalesStatus;
}

export interface ResolvedLeadPrice {
  priceCredits: number;
  priceSource: "lead_override" | "rule" | "default";
  pricingRuleId: string | null;
  maxBuyers: number;
}

export const defaultLeadPrices: Record<LeadCommercialType, number> = {
  shared: 12,
  exclusive: 20,
};

export function getEffectiveLeadCapacity(leadType: LeadCommercialType, configuredMaxBuyers: number) {
  return leadType === "exclusive" ? 1 : Math.max(configuredMaxBuyers, 1);
}

export function resolveLeadPrice(input: LeadPricingInput, rules: LeadPricingRule[]) {
  const maxBuyers = getEffectiveLeadCapacity(input.leadType, input.maxBuyers);

  if (input.priceOverrideCredits) {
    return {
      priceCredits: input.priceOverrideCredits,
      priceSource: "lead_override",
      pricingRuleId: null,
      maxBuyers,
    } satisfies ResolvedLeadPrice;
  }

  const rule = rules
    .filter((candidate) => candidate.active)
    .filter((candidate) => candidate.lead_type === input.leadType)
    .filter((candidate) => !candidate.service_id || candidate.service_id === input.serviceId)
    .filter((candidate) => !candidate.service_slug || candidate.service_slug === input.serviceSlug)
    .filter((candidate) => !candidate.subservice_slug || candidate.subservice_slug === input.subserviceSlug)
    .filter((candidate) => input.leadScore == null || candidate.min_score == null || input.leadScore >= candidate.min_score)
    .filter((candidate) => input.leadScore == null || candidate.max_score == null || input.leadScore <= candidate.max_score)
    .sort((left, right) => {
      const rank =
        Number(Boolean(right.subservice_slug)) - Number(Boolean(left.subservice_slug))
        || Number(Boolean(right.service_id)) - Number(Boolean(left.service_id))
        || Number(Boolean(right.service_slug)) - Number(Boolean(left.service_slug))
        || right.priority - left.priority;
      if (rank !== 0) {
        return rank;
      }
      return right.created_at.localeCompare(left.created_at);
    })[0];

  if (!rule) {
    return {
      priceCredits: defaultLeadPrices[input.leadType],
      priceSource: "default",
      pricingRuleId: null,
      maxBuyers,
    } satisfies ResolvedLeadPrice;
  }

  const multiplier = input.leadType === "exclusive"
    ? (rule.exclusive_multiplier ?? 1)
    : (rule.shared_multiplier ?? 1);

  return {
    priceCredits: Math.max(1, Math.round(rule.base_price_credits * multiplier)),
    priceSource: "rule",
    pricingRuleId: rule.id,
    maxBuyers,
  } satisfies ResolvedLeadPrice;
}
