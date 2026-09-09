export const professionalStatusValues = ["pending", "active", "paused", "suspended"] as const;
export const professionalVerificationStatusValues = ["unverified", "pending", "verified", "rejected"] as const;
export const leadStatusValues = [
  "new",
  "qualified",
  "matched",
  "assigned",
  "accepted",
  "rejected",
  "won",
  "lost",
  "closed",
] as const;
export const leadUrgencyValues = ["normal", "urgent"] as const;
export const preferredTimingValues = ["asap", "few_weeks", "one_to_three_months", "later", "unknown"] as const;
export const assignmentStatusValues = ["pending", "viewed", "accepted", "rejected"] as const;
export const leadProgressStatusValues = ["new", "contacted", "appointment_scheduled", "quote_sent", "won", "lost"] as const;
export const leadLossReasonValues = ["prijs", "klant_niet_bereikbaar", "klant_koos_andere_partij", "klus_uitgesteld", "buiten_scope", "anders"] as const;
export const serviceQuestionTypeValues = ["text", "textarea", "select", "multiselect", "radio", "boolean", "number"] as const;
export const allowedLeadImageTypes = ["image/jpeg", "image/png", "image/webp"] as const;
export const maxLeadImageSizeBytes = 5 * 1024 * 1024;
export const maxLeadImageCount = 5;
export const contactReasonValues = ["consument", "vakman", "algemeen"] as const;
export const contactSubmissionStatusValues = ["new", "read", "handled", "spam"] as const;
