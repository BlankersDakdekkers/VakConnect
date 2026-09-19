import { z } from "zod";
import {
  leadCommercialTypeValues,
  maxProfessionalActiveAssignments,
  maxProfessionalOpenOffers,
  professionalAvailabilityStatusValues,
  professionalDocumentTypeValues,
  professionalDocumentVerificationStatusValues,
  professionalIdentityTypeValues,
  professionalOnboardingStepValues,
  professionalReviewFeedbackStatusValues,
  professionalReviewSectionValues,
  professionalStatusValues,
  professionalVerificationStatusValues,
} from "./constants.ts";

const kvkRegex = /^[0-9]{8}$/;
const phoneRegex = /^[+()0-9\-\s]{8,30}$/;
const postalCodeRegex = /^[1-9][0-9]{3}\s?[A-Za-z]{2}$/;
const postalPrefixRegex = /^[1-9][0-9]{3}$/;

const optionalTrimmedText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));
const optionalUrl = z.url("Gebruik een volledige URL inclusief https://").optional().or(z.literal(""));
const optionalDate = z.iso.datetime().optional().or(z.literal(""));
const optionalNumber = (min: number, max: number) => z.union([z.literal(""), z.coerce.number().int().min(min).max(max)]).optional();

export function parseSpecialties(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export const professionalCreationSchema = z.object({
  companyName: z.string().trim().min(2, "Bedrijfsnaam is verplicht.").max(120),
  contactName: z.string().trim().min(2, "Contactpersoon is verplicht.").max(120),
  email: z.email("Vul een geldig e-mailadres in."),
  phone: z.string().trim().regex(phoneRegex, "Gebruik een geldig telefoonnummer."),
  password: z.string().min(10, "Gebruik minimaal 10 tekens voor het tijdelijke wachtwoord."),
  kvkNumber: z.string().trim().regex(kvkRegex, "Gebruik een geldig 8-cijferig KvK-nummer.").optional().or(z.literal("")),
  website: optionalUrl,
  description: optionalTrimmedText(2000),
  status: z.enum(professionalStatusValues),
  verificationStatus: z.enum(professionalVerificationStatusValues).default("unverified"),
  serviceIds: z.array(z.string().uuid()).min(1, "Selecteer minimaal één dienst."),
  postalCodePrefixes: z.array(z.string().regex(postalPrefixRegex)).min(1, "Voeg minimaal één postcodegebied toe."),
});

export const professionalStatusUpdateSchema = z.object({
  professionalId: z.string().uuid(),
  status: z.enum(professionalStatusValues),
  redirectTo: z.string().startsWith("/admin"),
});

export const professionalVerificationStatusUpdateSchema = z.object({
  professionalId: z.string().uuid(),
  verificationStatus: z.enum(professionalVerificationStatusValues),
  redirectTo: z.string().startsWith("/admin"),
});

export const professionalAdminProfileUpdateSchema = z.object({
  professionalId: z.string().uuid(),
  companyName: z.string().trim().min(2).max(120),
  tradeName: optionalTrimmedText(120),
  identityType: z.enum(professionalIdentityTypeValues).optional().or(z.literal("")),
  contactName: z.string().trim().min(2).max(120),
  email: z.email(),
  phone: z.string().trim().regex(phoneRegex),
  kvkNumber: z.string().trim().regex(kvkRegex, "Gebruik een geldig 8-cijferig KvK-nummer.").optional().or(z.literal("")),
  btwNumber: optionalTrimmedText(32),
  website: optionalUrl,
  addressLine1: optionalTrimmedText(160),
  addressLine2: optionalTrimmedText(120),
  postalCode: z.string().trim().regex(postalCodeRegex, "Gebruik een geldige postcode.").optional().or(z.literal("")),
  city: optionalTrimmedText(120),
  province: optionalTrimmedText(120),
  yearsExperience: optionalNumber(0, 80),
  teamSize: optionalNumber(1, 500),
  specialties: z.array(z.string().trim().min(2).max(40)).max(10).default([]),
  description: optionalTrimmedText(2000),
  redirectTo: z.string().startsWith("/admin"),
});

export const professionalProfileUpdateSchema = z.object({
  companyName: z.string().trim().min(2, "Bedrijfsnaam is verplicht.").max(120),
  tradeName: optionalTrimmedText(120),
  identityType: z.enum(professionalIdentityTypeValues, "Kies een geldig bedrijfstype.").optional().or(z.literal("")),
  contactName: z.string().trim().min(2, "Contactpersoon is verplicht.").max(120),
  phone: z.string().trim().regex(phoneRegex, "Gebruik een geldig telefoonnummer."),
  kvkNumber: z.string().trim().regex(kvkRegex, "Gebruik een geldig 8-cijferig KvK-nummer.").optional().or(z.literal("")),
  btwNumber: optionalTrimmedText(32),
  website: optionalUrl,
  addressLine1: optionalTrimmedText(160),
  addressLine2: optionalTrimmedText(120),
  postalCode: z.string().trim().regex(postalCodeRegex, "Gebruik een geldige postcode.").optional().or(z.literal("")),
  city: optionalTrimmedText(120),
  province: optionalTrimmedText(120),
  yearsExperience: z.coerce.number().int().min(0, "Jaren ervaring moet 0 of hoger zijn.").max(80, "Jaren ervaring is te hoog.").optional(),
  teamSize: z.coerce.number().int().min(1, "Teamgrootte moet minimaal 1 zijn.").max(500, "Teamgrootte is te hoog.").optional(),
  specialties: z.array(z.string().trim().min(2).max(40)).max(10).default([]),
  description: optionalTrimmedText(2000),
});

export const professionalOnboardingStepMutationSchema = z.object({
  professionalId: z.string().uuid().optional(),
  step: z.enum(professionalOnboardingStepValues),
  nextStep: z.enum(professionalOnboardingStepValues).optional(),
  autosave: z.union([z.literal("true"), z.literal("false")]).optional(),
});

export const professionalCompanyOnboardingSchema = z.object({
  companyName: z.string().trim().min(2, "Bedrijfsnaam is verplicht.").max(120),
  tradeName: optionalTrimmedText(120),
  identityType: z.enum(professionalIdentityTypeValues, "Kies een geldig bedrijfstype."),
  kvkNumber: z.string().trim().regex(kvkRegex, "Gebruik een geldig 8-cijferig KvK-nummer."),
  btwNumber: optionalTrimmedText(32),
  addressLine1: z.string().trim().min(2, "Adres is verplicht.").max(160),
  addressLine2: optionalTrimmedText(120),
  postalCode: z.string().trim().regex(postalCodeRegex, "Gebruik een geldige postcode."),
  city: z.string().trim().min(2, "Plaats is verplicht.").max(120),
  province: z.string().trim().min(2, "Provincie is verplicht.").max(120),
});

export const professionalContactOnboardingSchema = z.object({
  contactName: z.string().trim().min(2, "Contactpersoon is verplicht.").max(120),
  phone: z.string().trim().regex(phoneRegex, "Gebruik een geldig telefoonnummer."),
  website: optionalUrl,
});

export const professionalExperienceOnboardingSchema = z.object({
  yearsExperience: z.coerce.number().int().min(0).max(80),
  teamSize: z.coerce.number().int().min(1).max(500),
  specialties: z.array(z.string().trim().min(2).max(40)).max(10).min(1, "Voeg minimaal één specialiteit toe."),
  description: z.string().trim().min(20, "Omschrijf kort je ervaring.").max(2000),
});

export const professionalCapacityOnboardingSchema = z.object({
  maxOpenOffers: z.coerce.number().int().min(1).max(maxProfessionalOpenOffers),
  maxActiveAssignments: z.coerce.number().int().min(1).max(maxProfessionalActiveAssignments),
  paused: z.boolean().default(false),
  pauseUntil: optionalDate,
  preferredLeadTypes: z.array(z.enum(leadCommercialTypeValues)).default([]),
  availabilityStatus: z.enum(professionalAvailabilityStatusValues),
  availableFrom: optionalDate,
  unavailableUntil: optionalDate,
});

export const professionalServiceSelectionSchema = z.object({
  serviceId: z.string().uuid(),
  active: z.boolean(),
  yearsExperience: z.coerce.number().int().min(0).max(80),
  specializationSummary: optionalTrimmedText(280),
  preferredLeadType: z.enum(leadCommercialTypeValues).optional().or(z.literal("")),
});

export const professionalServiceSelectionListSchema = z.array(professionalServiceSelectionSchema).min(1, "Selecteer minimaal één dienst.");

export const professionalServiceMutationSchema = z.object({
  professionalId: z.string().uuid(),
  serviceId: z.string().uuid(),
  redirectTo: z.string().startsWith("/admin"),
});

export const professionalServiceToggleSchema = z.object({
  professionalServiceId: z.string().uuid(),
  active: z.enum(["true", "false"]).transform((value) => value === "true"),
  professionalId: z.string().uuid(),
  redirectTo: z.string().startsWith("/admin"),
});

export const professionalAreaMutationSchema = z.object({
  professionalId: z.string().uuid().optional(),
  postalCodePrefix: z.string().trim().regex(postalPrefixRegex, "Gebruik een geldige postcode4."),
  city: optionalTrimmedText(120),
  province: optionalTrimmedText(120),
  radiusKm: z.coerce.number().int().min(1).max(100).optional(),
  redirectTo: z.string().startsWith("/").optional(),
});

export const professionalAreaDeleteSchema = z.object({
  areaId: z.string().uuid(),
  professionalId: z.string().uuid().optional(),
  redirectTo: z.string().startsWith("/").optional(),
});

export const professionalDocumentUploadSchema = z.object({
  professionalId: z.string().uuid().optional(),
  documentType: z.enum(professionalDocumentTypeValues),
  expiresAt: optionalDate,
  redirectTo: z.string().startsWith("/").optional(),
});

export const professionalDocumentDeleteSchema = z.object({
  documentId: z.string().uuid(),
  redirectTo: z.string().startsWith("/").optional(),
});

export const professionalDocumentReviewSchema = z.object({
  documentId: z.string().uuid(),
  professionalId: z.string().uuid(),
  verificationStatus: z.enum(professionalDocumentVerificationStatusValues),
  rejectionReason: optionalTrimmedText(500),
  redirectTo: z.string().startsWith("/admin"),
}).superRefine((value, ctx) => {
  if (["rejected", "expired"].includes(value.verificationStatus) && !value.rejectionReason) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["rejectionReason"], message: "Een reden is verplicht voor rejected of expired documenten." });
  }
});

export const professionalReviewFeedbackCreateSchema = z.object({
  professionalId: z.string().uuid(),
  section: z.enum(professionalReviewSectionValues),
  message: z.string().trim().min(3).max(1000),
  status: z.enum(professionalReviewFeedbackStatusValues).default("open"),
  redirectTo: z.string().startsWith("/admin"),
});

export const professionalVerificationDecisionSchema = z.object({
  professionalId: z.string().uuid(),
  action: z.enum(["verify", "changes_requested", "reject", "suspend"]),
  reason: optionalTrimmedText(500),
  redirectTo: z.string().startsWith("/admin"),
}).superRefine((value, ctx) => {
  if (value.action !== "verify" && !value.reason) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["reason"], message: "Een reden is verplicht voor deze verificatieactie." });
  }
});

export const professionalOnboardingSubmitSchema = z.object({
  professionalId: z.string().uuid().optional(),
  redirectTo: z.string().startsWith("/").optional(),
});
