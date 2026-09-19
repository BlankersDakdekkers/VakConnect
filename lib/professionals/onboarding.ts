import type {
  LeadCommercialType,
  ProfessionalAvailabilityStatus,
  ProfessionalDocumentRequirementLevel,
  ProfessionalDocumentType,
  ProfessionalDocumentVerificationStatus,
  ProfessionalOnboardingStatus,
  ProfessionalOnboardingStep,
  ProfessionalReviewSection,
  ProfessionalVerificationStatus,
} from "@/types/database";
import { minimumProfessionalQualityScore as minimumQualityScoreConstant } from "@/lib/validation/constants";

export const professionalOnboardingSteps: Array<{
  key: ProfessionalOnboardingStep;
  title: string;
  description: string;
  section: ProfessionalReviewSection;
}> = [
  { key: "company", title: "Bedrijfsgegevens", description: "Bedrijfsnaam, type onderneming en vestigingsadres.", section: "company" },
  { key: "contact", title: "Contact", description: "Contactpersoon, telefoon en website.", section: "contact" },
  { key: "services", title: "Diensten", description: "Actieve diensten, ervaring en specialisaties.", section: "services" },
  { key: "areas", title: "Werkgebieden", description: "Matchbare postcode4-gebieden met optionele stad/provincie/straalcontext.", section: "areas" },
  { key: "experience", title: "Ervaring", description: "Jaren ervaring, teamgrootte, omschrijving en specialiteiten.", section: "experience" },
  { key: "capacity", title: "Beschikbaarheid & capaciteit", description: "Open offers, actieve opdrachten, pauze en beschikbaarheid.", section: "capacity" },
  { key: "documents", title: "Documenten", description: "Verplichte en optionele bedrijfsdocumenten in private storage.", section: "documents" },
  { key: "review", title: "Controle & verzenden", description: "Controleer ontbrekende punten en dien je profiel in voor review.", section: "review" },
];

export const minimumProfessionalQualityScore = minimumQualityScoreConstant;
export type ProfessionalQualityLabel = "incompleet" | "redelijk" | "goed" | "compleet";

export interface ProfessionalQualityInput {
  professional: {
    companyName: string;
    tradeName: string | null;
    contactName: string;
    email: string;
    phone: string;
    website: string | null;
    kvkNumber: string | null;
    btwNumber: string | null;
    identityType: string | null;
    addressLine1: string | null;
    postalCode: string | null;
    city: string | null;
    province: string | null;
    yearsExperience: number | null;
    teamSize: number | null;
    description: string | null;
    specialties: string[];
    onboardingStatus: ProfessionalOnboardingStatus;
    verificationStatus: ProfessionalVerificationStatus;
  };
  services: Array<{
    active: boolean;
    yearsExperience: number;
    specializationSummary: string | null;
    preferredLeadType: LeadCommercialType | null;
  }>;
  areas: Array<{
    postalCodePrefix: string;
    city: string | null;
    province: string | null;
    radiusKm: number | null;
  }>;
  settings: {
    maxOpenOffers: number;
    maxActiveAssignments: number;
    paused: boolean;
    pauseUntil: string | null;
    preferredLeadTypes: LeadCommercialType[];
    availabilityStatus: ProfessionalAvailabilityStatus;
    availableFrom: string | null;
    unavailableUntil: string | null;
  } | null;
  documents: Array<{
    documentType: ProfessionalDocumentType;
    verificationStatus: ProfessionalDocumentVerificationStatus;
    archivedAt: string | null;
    expiresAt: string | null;
  }>;
  requiredDocuments: Array<{
    documentType: ProfessionalDocumentType;
    requirementLevel: ProfessionalDocumentRequirementLevel;
    serviceId: string | null;
  }>;
}

export interface ProfessionalQualityResult {
  score: number;
  label: ProfessionalQualityLabel;
  breakdown: Record<string, {
    score: number;
    weight: number;
    complete: boolean;
    message: string;
  }>;
  missingSteps: ProfessionalOnboardingStep[];
  completedSteps: ProfessionalOnboardingStep[];
  completion: number;
  canSubmit: boolean;
  distributionEligible: boolean;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function hasValue(value: string | null | undefined) {
  return typeof value === "string" ? value.trim().length > 0 : false;
}

function uniqueDocumentRequirements(input: ProfessionalQualityInput) {
  const activeServiceCount = input.services.filter((service) => service.active).length;
  const requirements = input.requiredDocuments.filter((requirement) => requirement.serviceId === null || activeServiceCount > 0);
  const seen = new Set<string>();
  return requirements.filter((requirement) => {
    const key = `${requirement.serviceId ?? "global"}:${requirement.documentType}:${requirement.requirementLevel}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function latestDocumentStatus(input: ProfessionalQualityInput, type: ProfessionalDocumentType) {
  const candidates = input.documents.filter((document) => document.documentType === type && !document.archivedAt);
  return candidates[candidates.length - 1] ?? null;
}

export function getProfessionalQualityLabel(score: number): ProfessionalQualityLabel {
  if (score >= 90) return "compleet";
  if (score >= 75) return "goed";
  if (score >= 50) return "redelijk";
  return "incompleet";
}

export function getNextOnboardingStep(step: ProfessionalOnboardingStep) {
  const index = professionalOnboardingSteps.findIndex((item) => item.key === step);
  return professionalOnboardingSteps[Math.min(index + 1, professionalOnboardingSteps.length - 1)]?.key ?? "review";
}

export function getPreviousOnboardingStep(step: ProfessionalOnboardingStep) {
  const index = professionalOnboardingSteps.findIndex((item) => item.key === step);
  return professionalOnboardingSteps[Math.max(index - 1, 0)]?.key ?? "company";
}

export function calculateProfessionalQuality(input: ProfessionalQualityInput): ProfessionalQualityResult {
  const weights = {
    company: 18,
    contact: 14,
    services: 14,
    areas: 10,
    experience: 14,
    capacity: 12,
    documents: 12,
    verification: 6,
  } as const;

  const requiredDocuments = uniqueDocumentRequirements(input).filter((requirement) => requirement.requirementLevel === "required");
  const recommendedDocuments = uniqueDocumentRequirements(input).filter((requirement) => requirement.requirementLevel === "recommended");
  const approvedRequiredDocuments = requiredDocuments.filter((requirement) => latestDocumentStatus(input, requirement.documentType)?.verificationStatus === "approved");
  const uploadedRequiredDocuments = requiredDocuments.filter((requirement) => {
    const latest = latestDocumentStatus(input, requirement.documentType);
    return latest && ["pending", "approved"].includes(latest.verificationStatus);
  });

  const businessFields = [
    hasValue(input.professional.companyName),
    hasValue(input.professional.kvkNumber),
    hasValue(input.professional.identityType),
    hasValue(input.professional.addressLine1),
    hasValue(input.professional.postalCode),
    hasValue(input.professional.city),
    hasValue(input.professional.province),
  ];
  const contactFields = [
    hasValue(input.professional.contactName),
    hasValue(input.professional.email),
    hasValue(input.professional.phone),
    hasValue(input.professional.website),
  ];
  const activeServices = input.services.filter((service) => service.active);
  const serviceFieldsComplete = activeServices.length > 0 && activeServices.every((service) => service.yearsExperience >= 0);
  const areaFieldsComplete = input.areas.length > 0;
  const experienceFields = [
    typeof input.professional.yearsExperience === "number" && input.professional.yearsExperience >= 0,
    typeof input.professional.teamSize === "number" && input.professional.teamSize >= 1,
    hasValue(input.professional.description),
    input.professional.specialties.length > 0,
  ];
  const settings = input.settings;
  const capacityReady = settings
    ? settings.maxOpenOffers >= 1 && settings.maxActiveAssignments >= 1 && settings.availabilityStatus !== "unavailable"
    : false;
  const verificationWeight = input.professional.verificationStatus === "verified"
    ? weights.verification
    : input.professional.verificationStatus === "pending" || input.professional.verificationStatus === "changes_requested"
      ? Math.round(weights.verification / 2)
      : 0;

  const breakdown = {
    company: {
      score: Math.round((businessFields.filter(Boolean).length / businessFields.length) * weights.company),
      weight: weights.company,
      complete: businessFields.every(Boolean),
      message: businessFields.every(Boolean) ? "Bedrijfsgegevens compleet." : "Vul bedrijfsnaam, type, KvK en adres volledig in.",
    },
    contact: {
      score: Math.round((contactFields.filter(Boolean).length / contactFields.length) * weights.contact),
      weight: weights.contact,
      complete: contactFields.slice(0, 3).every(Boolean),
      message: contactFields.slice(0, 3).every(Boolean) ? "Contactgegevens compleet." : "Contactpersoon, e-mail en telefoon zijn vereist.",
    },
    services: {
      score: activeServices.length === 0 ? 0 : Math.min(weights.services, 8 + Math.min(6, activeServices.length * 2) + (serviceFieldsComplete ? 0 : -2)),
      weight: weights.services,
      complete: activeServices.length > 0,
      message: activeServices.length > 0 ? "Diensten gekoppeld." : "Selecteer minimaal één actieve dienst.",
    },
    areas: {
      score: areaFieldsComplete ? weights.areas : 0,
      weight: weights.areas,
      complete: areaFieldsComplete,
      message: areaFieldsComplete ? "Werkgebied aanwezig." : "Voeg minimaal één postcode4-werkgebied toe.",
    },
    experience: {
      score: Math.round((experienceFields.filter(Boolean).length / experienceFields.length) * weights.experience),
      weight: weights.experience,
      complete: experienceFields.every(Boolean),
      message: experienceFields.every(Boolean) ? "Ervaringssectie compleet." : "Vul ervaring, teamgrootte, omschrijving en specialiteiten aan.",
    },
    capacity: {
      score: capacityReady ? weights.capacity : input.settings ? Math.round(weights.capacity / 2) : 0,
      weight: weights.capacity,
      complete: capacityReady,
      message: capacityReady ? "Capaciteit en beschikbaarheid zijn ingevuld." : "Stel capaciteit en beschikbaarheid in.",
    },
    documents: {
      score: requiredDocuments.length === 0
        ? weights.documents
        : clamp(
          Math.round(((approvedRequiredDocuments.length * 1.0) + ((uploadedRequiredDocuments.length - approvedRequiredDocuments.length) * 0.5) + Math.min(recommendedDocuments.length, input.documents.filter((document) => !document.archivedAt && ["approved", "pending"].includes(document.verificationStatus)).length) * 0.1) / requiredDocuments.length * weights.documents),
          0,
          weights.documents,
        ),
      weight: weights.documents,
      complete: requiredDocuments.every((requirement) => approvedRequiredDocuments.some((approved) => approved.documentType === requirement.documentType)),
      message: uploadedRequiredDocuments.length >= requiredDocuments.length ? "Verplichte documenten geüpload." : "Upload alle verplichte documenten.",
    },
    verification: {
      score: verificationWeight,
      weight: weights.verification,
      complete: input.professional.verificationStatus === "verified",
      message: input.professional.verificationStatus === "verified" ? "Verificatie afgerond." : "Profiel wacht nog op adminverificatie.",
    },
  } satisfies ProfessionalQualityResult["breakdown"];

  const stepCompletion: Record<ProfessionalOnboardingStep, boolean> = {
    company: breakdown.company.complete,
    contact: breakdown.contact.complete,
    services: breakdown.services.complete,
    areas: breakdown.areas.complete,
    experience: breakdown.experience.complete,
    capacity: breakdown.capacity.complete,
    documents: uploadedRequiredDocuments.length >= requiredDocuments.length,
    review: false,
  };
  stepCompletion.review = Object.values(stepCompletion).slice(0, 7).every(Boolean);

  const completedSteps = professionalOnboardingSteps.filter((step) => stepCompletion[step.key]).map((step) => step.key);
  const missingSteps = professionalOnboardingSteps.filter((step) => !stepCompletion[step.key]).map((step) => step.key);
  const completion = clamp(Math.round((completedSteps.filter((step) => step !== "review").length / 7) * 100), 0, 100);
  const score = clamp(Object.values(breakdown).reduce((sum, section) => sum + section.score, 0), 0, 100);
  const canSubmit = stepCompletion.company && stepCompletion.contact && stepCompletion.services && stepCompletion.areas && stepCompletion.experience && stepCompletion.capacity && stepCompletion.documents;
  const distributionEligible = canSubmit
    && score >= minimumProfessionalQualityScore
    && input.professional.onboardingStatus === "approved"
    && input.professional.verificationStatus === "verified"
    && input.settings?.availabilityStatus !== "unavailable"
    && !input.settings?.paused;

  return {
    score,
    label: getProfessionalQualityLabel(score),
    breakdown,
    missingSteps,
    completedSteps,
    completion,
    canSubmit,
    distributionEligible,
  };
}
