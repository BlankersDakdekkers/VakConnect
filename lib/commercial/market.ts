import type { LeadCommercialType, LeadPurchaseStatus, LeadSalesStatus } from "@/types/database";

export type ProfessionalLeadMarketState = "available" | "purchased" | "closed";

export function getLeadMarketState(input: {
  purchaseStatus?: LeadPurchaseStatus | null;
  salesStatus: LeadSalesStatus;
  commercialType: LeadCommercialType;
  buyersCount: number;
  maxBuyers: number;
}) {
  if (input.purchaseStatus === "purchased") {
    return "purchased" satisfies ProfessionalLeadMarketState;
  }

  if (
    input.salesStatus === "closed"
    || input.salesStatus === "unavailable"
    || input.salesStatus === "sold_out"
    || (input.commercialType === "exclusive" && input.buyersCount >= 1)
    || (input.commercialType === "shared" && input.buyersCount >= input.maxBuyers)
  ) {
    return "closed" satisfies ProfessionalLeadMarketState;
  }

  return "available" satisfies ProfessionalLeadMarketState;
}
