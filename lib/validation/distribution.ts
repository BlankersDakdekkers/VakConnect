import { z } from "zod";

export const adminDistributionLeadSchema = z.object({
  leadId: z.string().uuid(),
  redirectTo: z.string().startsWith("/admin"),
});

export const adminDistributionRunSchema = z.object({
  candidateId: z.string().uuid(),
  redirectTo: z.string().startsWith("/admin"),
});

export const adminDistributionPauseSchema = z.object({
  runId: z.string().uuid(),
  redirectTo: z.string().startsWith("/admin"),
});

export const adminDistributionManualOfferSchema = z.object({
  leadId: z.string().uuid(),
  professionalId: z.string().uuid(),
  redirectTo: z.string().startsWith("/admin"),
});

export const declineReasonValues = [
  "te_ver",
  "geen_capaciteit",
  "klus_past_niet",
  "prijs_te_hoog",
  "timing_past_niet",
  "anders",
  "wrong_service",
  "wrong_region",
  "incorrect_information",
  "already_completed",
  "duplicate",
  "unreachable",
  "invalid_contact",
  "profile_mismatch",
] as const;

export const professionalOfferDeclineSchema = z.object({
  candidateId: z.string().uuid(),
  reason: z.preprocess((value) => value === "" || value == null ? undefined : value, z.enum(declineReasonValues).optional()),
  redirectTo: z.string().startsWith("/vakman"),
});

export const professionalOfferViewSchema = z.object({
  candidateId: z.string().uuid(),
  redirectTo: z.string().startsWith("/vakman"),
});
