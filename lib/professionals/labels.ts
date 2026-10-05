import type {
  ProfessionalAvailabilityStatus,
  ProfessionalDocumentType,
  ProfessionalDocumentVerificationStatus,
  ProfessionalOnboardingStatus,
  ProfessionalVerificationStatus,
} from "../../types/database.ts";

export const professionalOnboardingStatusLabels: Record<ProfessionalOnboardingStatus, string> = {
  not_started: "Niet gestart",
  in_progress: "In uitvoering",
  submitted: "In beoordeling",
  approved: "Goedgekeurd",
  changes_requested: "Aanpassingen gevraagd",
  rejected: "Afgewezen",
};

export const professionalVerificationStatusLabels: Record<ProfessionalVerificationStatus, string> = {
  unverified: "Niet gestart",
  pending: "In behandeling",
  verified: "Goedgekeurd",
  changes_requested: "Aanpassingen gevraagd",
  rejected: "Afgewezen",
  suspended: "Geschorst",
};

export const professionalAvailabilityStatusLabels: Record<ProfessionalAvailabilityStatus, string> = {
  available: "Beschikbaar",
  limited: "Beperkt beschikbaar",
  unavailable: "Niet beschikbaar",
};

export const professionalDocumentStatusLabels: Record<ProfessionalDocumentVerificationStatus, string> = {
  pending: "In beoordeling",
  approved: "Goedgekeurd",
  rejected: "Afgekeurd",
  expired: "Verlopen",
};

export const professionalDocumentTypeLabels: Record<ProfessionalDocumentType, string> = {
  kvk_extract: "KvK-uittreksel",
  liability_insurance: "Aansprakelijkheidsverzekering",
  certification: "Certificaat",
  identity_or_authority: "Identiteit of bevoegdheid",
  other: "Overig document",
};

export const professionalStatusDescriptions: Record<ProfessionalVerificationStatus, string> = {
  unverified: "Je profiel is nog niet ingediend voor beoordeling.",
  pending: "Je profiel wordt beoordeeld. We kunnen om aanpassingen vragen.",
  verified: "Je profiel is beoordeeld. Dit is geen garantie voor de kwaliteit of uitvoering van werk.",
  changes_requested: "Pas de feedback aan en dien je profiel opnieuw in.",
  rejected: "Je profiel is afgewezen. Bekijk de feedback of neem contact op met VakConnect.",
  suspended: "Je profiel is tijdelijk geschorst en ontvangt geen nieuwe aanvragen.",
};
