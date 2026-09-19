import type { LeadCommercialType } from "@/types/database";
import { minimumProfessionalQualityScore } from "@/lib/professionals/onboarding";

export const distributionStrategyVersion = "v2" as const;

export const distributionConfig = {
  maxCandidates: 40,
  sharedBatchSize: 3,
  exclusiveOfferWindowMinutes: 15,
  sharedOfferWindowMinutes: 20,
  performanceLookbackDays: 90,
  fairnessLookbackDays: 30,
  defaultMaxOpenOffers: 5,
  defaultMaxActiveAssignments: 12,
  minProfessionalQualityScore: minimumProfessionalQualityScore,
  coldStart: {
    purchaseRate: 0.35,
    winRate: 0.5,
    avgResponseHours: 12,
  },
  weights: {
    serviceMatch: 25,
    geoMatch: 20,
    verification: 10,
    responsePerformance: 15,
    winRate: 10,
    responseTime: 10,
    workload: 10,
    fairness: 10,
  },
  eligibleLeadStatuses: ["new", "qualified", "matched", "assigned", "accepted"] as const,
  allowedVerification: ["verified"] as const,
};

export function getOfferWindowMinutes(type: LeadCommercialType) {
  return type === "exclusive" ? distributionConfig.exclusiveOfferWindowMinutes : distributionConfig.sharedOfferWindowMinutes;
}
