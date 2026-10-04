import { distributionConfig } from "../distribution/config.ts";
import { evaluateDistributionCandidateEligibility } from "../distribution/scoring.ts";
import type { Professional, ProfessionalDistributionSettings } from "../../types/database.ts";
import { professionalAvailabilityStatusLabels } from "./labels.ts";

export function getProfessionalDistributionReadiness(
  professional: Pick<Professional, "status" | "onboarding_status" | "verification_status" | "quality_score">,
  settings: Pick<ProfessionalDistributionSettings, "paused" | "pause_until" | "availability_status" | "max_open_offers" | "max_active_assignments"> | null,
  stats: { activeOffers: number; activeAssignments: number },
  activeServiceCount: number,
  areaCount: number,
) {
  const effectiveSettings = {
    paused: settings?.paused ?? false,
    pauseUntil: settings?.pause_until ?? null,
    availabilityStatus: settings?.availability_status ?? "available",
    maxOpenOffers: settings?.max_open_offers ?? distributionConfig.defaultMaxOpenOffers,
    maxActiveAssignments: settings?.max_active_assignments ?? distributionConfig.defaultMaxActiveAssignments,
  };
  const evaluation = evaluateDistributionCandidateEligibility({
    professionalStatus: professional.status,
    onboardingStatus: professional.onboarding_status,
    verificationStatus: professional.verification_status,
    qualityScore: professional.quality_score,
    alreadyPurchased: false,
    settings: effectiveSettings,
    stats: { openOffers: stats.activeOffers, activeAssignments: stats.activeAssignments },
  });
  const pauseUntil = effectiveSettings.pauseUntil ? new Date(effectiveSettings.pauseUntil) : null;
  const checks: Array<[string, string]> = [
    ["professional_active", "Je profiel is niet actief."],
    ["onboarding_complete", "Je profiel is nog niet goedgekeurd."],
    ["verification_allowed", "Je verificatie is nog niet goedgekeurd."],
    ["active_service", "Activeer minimaal één dienst om voor passende aanvragen mee te tellen."],
    ["work_area", "Voeg minimaal één werkgebied toe om voor passende aanvragen mee te tellen."],
    ["paused", pauseUntil && Number.isFinite(pauseUntil.getTime())
      ? `Je profiel is gepauzeerd tot ${pauseUntil.toLocaleString("nl-NL")}.`
      : "Je profiel staat tijdelijk gepauzeerd."],
    ["availability_available", `Je beschikbaarheid staat op ‘${professionalAvailabilityStatusLabels[effectiveSettings.availabilityStatus as keyof typeof professionalAvailabilityStatusLabels]}’; alleen ‘beschikbaar’ ontvangt nieuwe aanbiedingen.`],
    ["open_offers", "Je maximum aantal open aanbiedingen is bereikt."],
    ["active_assignments", "Je maximum aantal actieve opdrachten is bereikt."],
    ["quality_score", "Je profielkwaliteit voldoet nog niet aan de bestaande distributievoorwaarde."],
  ];
  const reasons = checks
    .filter(([key]) => key === "open_offers"
      ? Number(evaluation.reasons.open_offers) >= Number(evaluation.reasons.max_open_offers)
      : key === "active_assignments"
        ? Number(evaluation.reasons.active_assignments) >= Number(evaluation.reasons.max_active_assignments)
        : key === "quality_score"
          ? Number(evaluation.reasons.quality_score) < Number(evaluation.reasons.minimum_quality_score)
            : key === "paused"
              ? Boolean(evaluation.reasons.paused)
            : key === "active_service"
              ? activeServiceCount === 0
            : key === "work_area"
              ? areaCount === 0
            : !evaluation.reasons[key])
    .map(([, message]) => message);

  return {
    eligible: evaluation.eligible && activeServiceCount > 0 && areaCount > 0,
    reasons,
    activeOffers: stats.activeOffers,
    maxOpenOffers: effectiveSettings.maxOpenOffers,
    activeAssignments: stats.activeAssignments,
    maxActiveAssignments: effectiveSettings.maxActiveAssignments,
  };
}
