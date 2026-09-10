import { distributionConfig } from "@/lib/distribution/config";

export interface DistributionEligibilityInput {
  professionalActive: boolean;
  verificationAllowed: boolean;
  serviceActive: boolean;
  areaMatch: boolean;
  paused: boolean;
  alreadyPurchased: boolean;
  leadCommerciallyAvailable: boolean;
  openOffers: number;
  maxOpenOffers: number;
}

export interface DistributionScoreInput {
  verification: "verified" | "pending" | "unverified";
  acceptRate: number;
  winRate: number;
  avgResponseHours: number;
  workloadRatio: number;
  fairness: number;
}

export function evaluateDistributionEligibility(input: DistributionEligibilityInput) {
  const reasons: Record<string, boolean | number> = {
    professional_active: input.professionalActive,
    verification_allowed: input.verificationAllowed,
    service_active: input.serviceActive,
    area_match: input.areaMatch,
    paused: input.paused,
    already_purchased: input.alreadyPurchased,
    lead_commercially_available: input.leadCommerciallyAvailable,
    open_offers: input.openOffers,
    max_open_offers: input.maxOpenOffers,
  };

  const eligible = input.professionalActive
    && input.verificationAllowed
    && input.serviceActive
    && input.areaMatch
    && !input.paused
    && !input.alreadyPurchased
    && input.leadCommerciallyAvailable
    && input.openOffers < input.maxOpenOffers;

  return { eligible, reasons };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function calculateDistributionScore(input: DistributionScoreInput) {
  const verification = input.verification === "verified"
    ? distributionConfig.weights.verification
    : input.verification === "pending"
      ? Math.round(distributionConfig.weights.verification * 0.7)
      : Math.round(distributionConfig.weights.verification * 0.4);

  const breakdown = {
    service: distributionConfig.weights.serviceMatch,
    regio: distributionConfig.weights.geoMatch,
    verificatie: verification,
    response_performance: Math.round(clamp(input.acceptRate, 0, 1) * distributionConfig.weights.responsePerformance),
    win_rate: Math.round(clamp(input.winRate, 0, 1) * distributionConfig.weights.winRate),
    response_time: Math.round(clamp(1 - (Math.max(input.avgResponseHours, 0) / 48), 0, 1) * distributionConfig.weights.responseTime),
    workload: Math.round((1 - clamp(input.workloadRatio, 0, 1)) * distributionConfig.weights.workload),
    fairness: clamp(Math.round(input.fairness), -distributionConfig.weights.fairness, distributionConfig.weights.fairness),
  };

  const score = clamp(
    breakdown.service
      + breakdown.regio
      + breakdown.verificatie
      + breakdown.response_performance
      + breakdown.win_rate
      + breakdown.response_time
      + breakdown.workload
      + breakdown.fairness,
    0,
    100,
  );

  return { score, breakdown };
}
