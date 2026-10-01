import { distributionConfig } from "./config.ts";

export interface DistributionEligibilityInput {
  professionalActive: boolean;
  onboardingComplete: boolean;
  verificationAllowed: boolean;
  serviceActive: boolean;
  areaMatch: boolean;
  paused: boolean;
  availabilityAvailable: boolean;
  alreadyPurchased: boolean;
  leadCommerciallyAvailable: boolean;
  openOffers: number;
  maxOpenOffers: number;
  activeAssignments: number;
  maxActiveAssignments: number;
  qualityScore: number;
  minimumQualityScore: number;
}

export interface DistributionScoreInput {
  verification: "verified" | "pending" | "unverified" | "changes_requested" | "rejected" | "suspended";
  purchaseRate: number;
  winRate: number;
  avgResponseHours: number;
  workloadRatio: number;
  fairness: number;
}

export function evaluateDistributionEligibility(input: DistributionEligibilityInput) {
  const reasons: Record<string, boolean | number> = {
    professional_active: input.professionalActive,
    onboarding_complete: input.onboardingComplete,
    verification_allowed: input.verificationAllowed,
    service_active: input.serviceActive,
    area_match: input.areaMatch,
    paused: input.paused,
    availability_available: input.availabilityAvailable,
    already_purchased: input.alreadyPurchased,
    lead_commercially_available: input.leadCommerciallyAvailable,
    open_offers: input.openOffers,
    max_open_offers: input.maxOpenOffers,
    active_assignments: input.activeAssignments,
    max_active_assignments: input.maxActiveAssignments,
    quality_score: input.qualityScore,
    minimum_quality_score: input.minimumQualityScore,
  };

  const eligible = input.professionalActive
    && input.onboardingComplete
    && input.verificationAllowed
    && input.serviceActive
    && input.areaMatch
    && !input.paused
    && input.availabilityAvailable
    && !input.alreadyPurchased
    && input.leadCommerciallyAvailable
    && input.openOffers < input.maxOpenOffers
    && input.activeAssignments < input.maxActiveAssignments
    && input.qualityScore >= input.minimumQualityScore;

  return { eligible, reasons };
}

export interface DistributionCandidateEligibilityInput {
  professionalStatus: string;
  onboardingStatus: string;
  verificationStatus: string;
  qualityScore: number;
  alreadyPurchased: boolean;
  settings: {
    paused: boolean;
    pauseUntil: string | null;
    availabilityStatus: string;
    maxOpenOffers: number;
    maxActiveAssignments: number;
  };
  stats: {
    openOffers: number;
    activeAssignments: number;
  };
}

export function isDistributionPauseActive(paused: boolean, pauseUntil: string | null, now: Date = new Date()) {
  if (!paused) {
    return false;
  }
  if (!pauseUntil) {
    return true;
  }
  const pauseUntilTime = new Date(pauseUntil).getTime();
  return Number.isNaN(pauseUntilTime) || pauseUntilTime > now.getTime();
}

export function evaluateDistributionCandidateEligibility(
  candidate: DistributionCandidateEligibilityInput,
  now: Date = new Date(),
) {
  return evaluateDistributionEligibility({
    professionalActive: candidate.professionalStatus === "active",
    onboardingComplete: candidate.onboardingStatus === "approved",
    verificationAllowed: distributionConfig.allowedVerification.includes(candidate.verificationStatus),
    serviceActive: true,
    areaMatch: true,
    paused: isDistributionPauseActive(candidate.settings.paused, candidate.settings.pauseUntil, now),
    availabilityAvailable: candidate.settings.availabilityStatus === "available",
    alreadyPurchased: candidate.alreadyPurchased,
    leadCommerciallyAvailable: true,
    openOffers: candidate.stats.openOffers,
    maxOpenOffers: candidate.settings.maxOpenOffers,
    activeAssignments: candidate.stats.activeAssignments,
    maxActiveAssignments: candidate.settings.maxActiveAssignments,
    qualityScore: candidate.qualityScore,
    minimumQualityScore: distributionConfig.minProfessionalQualityScore,
  });
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
    response_performance: Math.round(clamp(input.purchaseRate, 0, 1) * distributionConfig.weights.responsePerformance),
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
