import { z } from "zod";
import { leadLossReasonValues, leadProgressStatusValues } from "../validation/constants.ts";

export const leadReachabilityValues = ["reached", "no_answer", "invalid_phone", "invalid_email", "unreachable_other"] as const;
export const leadAppointmentStatusValues = ["not_scheduled", "scheduled", "completed", "cancelled"] as const;
export const leadQualityLossReasonValues = [
  ...leadLossReasonValues, "duplicate", "already_completed", "wrong_service", "wrong_region", "invalid_contact",
] as const;
export const leadMismatchReasonValues = [
  "wrong_service", "wrong_region", "incorrect_information", "already_completed", "duplicate",
  "unreachable", "invalid_contact", "profile_mismatch", "other",
] as const;

export const leadReachabilityLabels: Record<(typeof leadReachabilityValues)[number], string> = {
  reached: "Klant bereikt", no_answer: "Geen antwoord", invalid_phone: "Ongeldig telefoonnummer",
  invalid_email: "Ongeldig e-mailadres", unreachable_other: "Niet bereikbaar",
};
export const leadAppointmentStatusLabels: Record<(typeof leadAppointmentStatusValues)[number], string> = {
  not_scheduled: "Niet gepland", scheduled: "Gepland", completed: "Uitgevoerd", cancelled: "Geannuleerd",
};
export const leadQualityLossReasonLabels: Record<(typeof leadQualityLossReasonValues)[number], string> = {
  prijs: "Prijs", klant_niet_bereikbaar: "Klant niet bereikbaar", klant_koos_andere_partij: "Klant koos een andere partij",
  klus_uitgesteld: "Klus uitgesteld", buiten_scope: "Buiten scope", anders: "Anders",
  duplicate: "Dubbele aanvraag", already_completed: "Klus al uitgevoerd", wrong_service: "Verkeerde dienst",
  wrong_region: "Verkeerde regio", invalid_contact: "Ongeldige contactgegevens",
};
export const leadMismatchReasonLabels: Record<(typeof leadMismatchReasonValues)[number], string> = {
  wrong_service: "Verkeerde dienst", wrong_region: "Verkeerde regio", incorrect_information: "Onjuiste informatie",
  already_completed: "Klus al uitgevoerd", duplicate: "Dubbele aanvraag", unreachable: "Klant niet bereikbaar",
  invalid_contact: "Ongeldige contactgegevens", profile_mismatch: "Past niet bij mijn profiel", other: "Anders",
};

const nullableSelection = <T extends readonly [string, ...string[]]>(values: T) =>
  z.preprocess((value) => value === "" || value === undefined ? null : value, z.enum(values).nullable());

export const assignmentQualityIdentitySchema = z.object({
  leadId: z.string().uuid(),
  progressStatus: z.enum(leadProgressStatusValues),
  expectedUpdatedAt: z.iso.datetime({ offset: true }),
  redirectTo: z.string().regex(/^\/vakman(?:\/|$)/).refine((value) => !value.includes("\\") && !value.includes("//")),
});

export const assignmentQualityUpdateSchema = assignmentQualityIdentitySchema.extend({
  reachability: nullableSelection(leadReachabilityValues),
  appointmentStatus: z.enum(leadAppointmentStatusValues),
  lossReason: nullableSelection(leadQualityLossReasonValues),
  mismatchReason: nullableSelection(leadMismatchReasonValues),
  feedbackNote: z.preprocess((value) => typeof value === "string" ? value.trim() || null : value ?? null, z.string().max(500).nullable()),
}).superRefine((value, context) => {
  if (value.progressStatus !== "lost" && value.lossReason !== null) {
    context.addIssue({ code: "custom", path: ["lossReason"], message: "Kies een verliesreden alleen bij een verloren aanvraag." });
  }
  if (value.feedbackNote && value.lossReason !== "anders" && value.mismatchReason !== "other") {
    context.addIssue({ code: "custom", path: ["feedbackNote"], message: "Een toelichting is alleen toegestaan bij Anders." });
  }
  if ((["scheduled", "completed"].includes(value.appointmentStatus) || ["quote_sent", "won"].includes(value.progressStatus))
    && value.reachability !== "reached") {
    context.addIssue({ code: "custom", path: ["reachability"], message: "Voor een afspraak of offerte moet de klant bereikt zijn." });
  }
  if ((value.progressStatus === "appointment_scheduled" && value.appointmentStatus === "not_scheduled")
    || (value.progressStatus === "new" && (value.reachability !== null || value.appointmentStatus !== "not_scheduled"))) {
    context.addIssue({ code: "custom", path: ["appointmentStatus"], message: "Afspraak en voortgang spreken elkaar tegen." });
  }
});

export const assignmentRejectionFeedbackSchema = z.object({
  mismatchReason: nullableSelection(leadMismatchReasonValues),
  feedbackNote: z.preprocess((value) => typeof value === "string" ? value.trim() || null : value ?? null, z.string().max(500).nullable()),
}).refine((value) => !value.feedbackNote || value.mismatchReason === "other", {
  message: "Een toelichting is alleen toegestaan bij Anders.", path: ["feedbackNote"],
});
