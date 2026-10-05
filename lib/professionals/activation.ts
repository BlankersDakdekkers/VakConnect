import type {
  Professional,
  ProfessionalDistributionSettings,
  ProfessionalNotificationEventType,
  ProfessionalOnboardingStep,
  ProfessionalReviewFeedback,
  ProfessionalReviewSection,
} from "../../types/database.ts";
import { isDistributionPauseActive } from "../distribution/scoring.ts";
import { professionalOnboardingSteps } from "./onboarding.ts";

const reviewSectionStep: Record<ProfessionalReviewSection, ProfessionalOnboardingStep> = {
  company: "company",
  contact: "contact",
  services: "services",
  areas: "areas",
  experience: "experience",
  capacity: "capacity",
  documents: "documents",
  review: "review",
  verification: "review",
};

export function getProfessionalReviewFeedbackHref(section: ProfessionalReviewSection) {
  return `/vakman/onboarding?step=${reviewSectionStep[section]}`;
}

export type ProfessionalActivationStage =
  | "account_created"
  | "profile_started"
  | "profile_complete"
  | "verification_ready"
  | "distribution_ready"
  | "first_offer_seen"
  | "active_professional";

type ActivationProfile = Pick<
  Professional,
  "status" | "onboarding_status" | "verification_status" | "verification_status_reason"
> & {
  missingSteps: string[];
  canSubmit: boolean;
  distributionSettings: Pick<ProfessionalDistributionSettings, "paused" | "pause_until" | "availability_status"> | null;
  distributionReadiness: {
    eligible: boolean;
    reasons: string[];
    activeOffers: number;
    maxOpenOffers: number;
    activeAssignments: number;
    maxActiveAssignments: number;
  };
  stats: {
    offersReceived: number;
    offersPurchased: number;
    assignmentsAccepted: number;
    activeOffers: number;
  };
  reviewFeedback: Array<Pick<ProfessionalReviewFeedback, "status" | "section" | "message">>;
};

export function getProfessionalActivationStage(professional: ActivationProfile): {
  key: ProfessionalActivationStage;
  label: string;
} {
  if (professional.stats.offersPurchased > 0 || professional.stats.assignmentsAccepted > 0) {
    return { key: "active_professional", label: "Actief professional" };
  }
  if (professional.stats.offersReceived > 0) {
    return { key: "first_offer_seen", label: "Eerste aanvraag zichtbaar" };
  }
  if (professional.distributionReadiness.eligible) {
    return { key: "distribution_ready", label: "Klaar voor passende aanvragen" };
  }
  if (professional.onboarding_status === "submitted"
    || professional.verification_status === "pending"
    || professional.verification_status === "verified") {
    return { key: "verification_ready", label: "Profiel ter beoordeling" };
  }
  if (professional.canSubmit) {
    return { key: "profile_complete", label: "Profiel compleet" };
  }
  if (professional.onboarding_status !== "not_started" || professional.missingSteps.length > 0) {
    return { key: "profile_started", label: "Profiel gestart" };
  }
  return { key: "account_created", label: "Account aangemaakt" };
}

export function getProfessionalBlockerRecovery(reason: string) {
  if (reason.includes("Activeer minimaal één dienst")) {
    return { label: "Diensten beheren", href: "/vakman/onboarding?step=services" };
  }
  if (reason.includes("werkgebied")) {
    return { label: "Werkgebieden beheren", href: "/vakman/onboarding?step=areas" };
  }
  if (reason.includes("beschikbaarheid") || reason.includes("gepauzeerd") || reason.includes("maximum aantal")) {
    return { label: "Beschikbaarheid en capaciteit bekijken", href: "/vakman/onboarding?step=capacity" };
  }
  if (reason.includes("document")) {
    return { label: "Documenten beheren", href: "/vakman/onboarding?step=documents" };
  }
  if (reason.includes("profielkwaliteit")) {
    return { label: "Profielkwaliteit bekijken", href: "/vakman/profiel" };
  }
  return { label: "Profielstatus bekijken", href: "/vakman/profiel" };
}

export function getProfessionalNextBestAction(professional: ActivationProfile) {
  const feedback = professional.reviewFeedback.find((item) => item.status === "open");
  if (feedback && (professional.onboarding_status === "changes_requested" || professional.verification_status === "changes_requested")) {
    return {
      label: "Pas gevraagde wijzigingen aan",
      href: getProfessionalReviewFeedbackHref(feedback.section),
      description: feedback.message,
    };
  }

  const missingStep = professional.missingSteps[0] as ProfessionalOnboardingStep | undefined;
  if (missingStep) {
    const step = professionalOnboardingSteps.find((item) => item.key === missingStep);
    return {
      label: missingStep === "documents" ? "Werk je documenten bij" : "Rond je profiel af",
      href: `/vakman/onboarding?step=${step?.key ?? "review"}`,
      description: step ? `Nog nodig: ${step.title.toLowerCase()}.` : "Vul de ontbrekende profielinformatie aan.",
    };
  }

  if (professional.onboarding_status === "submitted" || professional.verification_status === "pending") {
    return {
      label: "Bekijk de beoordelingsstatus",
      href: "/vakman/profiel",
      description: professional.verification_status_reason ?? "Je profiel wacht op beoordeling.",
    };
  }

  if (!professional.distributionReadiness.eligible) {
    const reason = professional.distributionReadiness.reasons[0];
    const recovery = reason ? getProfessionalBlockerRecovery(reason) : { label: "Bekijk je profielstatus", href: "/vakman/profiel" };
    return {
      label: recovery.label,
      href: recovery.href,
      description: reason ?? professional.verification_status_reason ?? "Bekijk je profielstatus om te zien wat nog nodig is.",
    };
  }

  if (professional.stats.activeOffers > 0) {
    return {
      label: "Bekijk nieuwe aanvragen",
      href: "/vakman/aanvragen",
      description: "Controleer de aanvraag en de prijs in credits voordat je beslist.",
    };
  }

  return {
    label: "Bekijk aanvragen",
    href: "/vakman/aanvragen",
    description: "Je profiel is gereed. Er staat nu geen open aanbod voor je klaar.",
  };
}

export type ActivationChecklistItem = {
  label: string;
  status: "complete" | "action" | "blocked" | "optional";
  description: string;
  href?: string;
};

export function getProfessionalActivationChecklist(professional: ActivationProfile, now = new Date()): ActivationChecklistItem[] {
  const missingStep = professional.missingSteps[0] as ProfessionalOnboardingStep | undefined;
  const missingInfo = professionalOnboardingSteps.find((step) => step.key === missingStep);
  const reviewPending = professional.onboarding_status === "submitted"
    || professional.verification_status === "pending";
  const reviewBlocked = professional.onboarding_status === "changes_requested"
    || professional.verification_status === "changes_requested"
    || professional.onboarding_status === "rejected"
    || professional.verification_status === "rejected"
    || professional.verification_status === "suspended";
  const pauseActive = isDistributionPauseActive(
    professional.distributionSettings?.paused ?? false,
    professional.distributionSettings?.pause_until ?? null,
    now,
  );
  const capacityReached = professional.distributionReadiness.activeOffers >= professional.distributionReadiness.maxOpenOffers
    || professional.distributionReadiness.activeAssignments >= professional.distributionReadiness.maxActiveAssignments;
  const availabilityBlocked = pauseActive
    || professional.distributionSettings?.availability_status === "limited"
    || professional.distributionSettings?.availability_status === "unavailable"
    || capacityReached;
  const firstReason = professional.distributionReadiness.reasons[0];

  return [
    {
      label: "Profiel",
      status: professional.canSubmit ? "complete" : "action",
      description: professional.canSubmit ? "De onderdelen voor indiening zijn ingevuld." : missingInfo ? `Nog nodig: ${missingInfo.title.toLowerCase()}.` : "Vul de ontbrekende onderdelen aan.",
      href: professional.canSubmit ? undefined : `/vakman/onboarding?step=${missingInfo?.key ?? "review"}`,
    },
    {
      label: "Documenten",
      status: professional.missingSteps.includes("documents") ? "action" : "complete",
      description: professional.missingSteps.includes("documents") ? "Een vereist document ontbreekt of moet worden vervangen." : "De vereiste documenten zijn aangeleverd.",
      href: professional.missingSteps.includes("documents") ? "/vakman/onboarding?step=documents" : undefined,
    },
    {
      label: "Beoordeling",
      status: reviewBlocked ? "action" : reviewPending ? "blocked" : professional.verification_status === "verified" ? "complete" : "optional",
      description: reviewBlocked
        ? professional.verification_status_reason ?? "Bekijk de feedback en werk de gevraagde onderdelen bij."
        : reviewPending
          ? "Je profiel wacht op beoordeling; je hoeft nu niets opnieuw in te dienen."
          : professional.verification_status === "verified"
            ? "Je verificatie is afgerond."
            : "Dien je profiel in zodra de vereiste onderdelen compleet zijn.",
      href: reviewBlocked ? "/vakman/onboarding?step=review" : reviewPending ? "/vakman/profiel" : professional.verification_status === "verified" ? undefined : "/vakman/onboarding?step=review",
    },
    {
      label: "Beschikbaarheid en capaciteit",
      status: availabilityBlocked ? "action" : "complete",
      description: availabilityBlocked
        ? firstReason ?? "Controleer je beschikbaarheid en capaciteit."
        : "Je beschikbaarheid en capaciteit laten nieuwe aanbiedingen toe.",
      href: availabilityBlocked ? "/vakman/onboarding?step=capacity" : undefined,
    },
    {
      label: "Klaar voor passende aanvragen",
      status: professional.distributionReadiness.eligible ? "complete" : "blocked",
      description: professional.distributionReadiness.eligible ? "Je profiel voldoet aan de huidige distributievoorwaarden." : firstReason ?? "Er is nog een voorwaarde die aandacht vraagt.",
      href: professional.distributionReadiness.eligible ? undefined : firstReason ? getProfessionalBlockerRecovery(firstReason).href : "/vakman/profiel",
    },
    {
      label: "Eerste aanvraag",
      status: professional.stats.offersReceived > 0 ? "complete" : "optional",
      description: professional.stats.offersReceived > 0
        ? "Je hebt een passend aanbod ontvangen."
        : "Aanbod hangt af van dienst, regio, beschikbaarheid, capaciteit en bestaande distributieregels.",
      href: professional.stats.offersReceived > 0 ? "/vakman/aanvragen" : undefined,
    },
  ];
}

export const highPriorityNotificationTypes: ReadonlySet<ProfessionalNotificationEventType> = new Set([
  "lead_offer_received",
  "lead_offer_expiring",
  "changes_requested",
  "verification_rejected",
  "verification_suspended",
  "verification_sla_breached",
  "document_expiring",
  "document_expired",
  "document_rejected",
  "document_expiry_attention",
]);

export function getProfessionalNotificationPriority(eventType: ProfessionalNotificationEventType) {
  return highPriorityNotificationTypes.has(eventType) ? "Hoog" : "Normaal";
}
