export const professionalStatusValues = ["pending", "active", "paused", "suspended"] as const;
export const professionalVerificationStatusValues = ["unverified", "pending", "verified", "changes_requested", "rejected", "suspended"] as const;
export const professionalOnboardingStatusValues = ["not_started", "in_progress", "submitted", "approved", "changes_requested", "rejected"] as const;
export const professionalOnboardingStepValues = ["company", "contact", "services", "areas", "experience", "capacity", "documents", "review"] as const;
export const professionalIdentityTypeValues = ["zzp", "eenmanszaak", "vof", "bv", "overig"] as const;
export const professionalAvailabilityStatusValues = ["available", "limited", "unavailable"] as const;
export const professionalDocumentTypeValues = ["kvk_extract", "liability_insurance", "certification", "identity_or_authority", "other"] as const;
export const professionalDocumentVerificationStatusValues = ["pending", "approved", "rejected", "expired"] as const;
export const professionalDocumentRequirementLevelValues = ["required", "recommended", "optional"] as const;
export const professionalReviewSectionValues = ["company", "contact", "services", "areas", "experience", "capacity", "documents", "review", "verification"] as const;
export const professionalReviewFeedbackStatusValues = ["open", "resolved"] as const;
export const professionalNotificationEventTypeValues = ["onboarding_submitted", "verification_approved", "changes_requested", "verification_rejected"] as const;
export const professionalAuditEventTypeValues = [
  "onboarding_started",
  "step_completed",
  "onboarding_submitted",
  "document_uploaded",
  "document_removed",
  "document_reviewed",
  "verification_approved",
  "changes_requested",
  "verification_rejected",
  "verification_suspended",
  "critical_profile_change",
] as const;
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
export const leadCommercialTypeValues = ["shared", "exclusive"] as const;
export const leadSalesStatusValues = ["unavailable", "available", "partially_sold", "sold_out", "closed"] as const;
export const leadPurchaseStatusValues = ["purchased", "refunded", "cancelled"] as const;
export const walletTransactionTypeValues = [
  "credit_purchase",
  "lead_purchase",
  "refund",
  "admin_credit",
  "admin_debit",
  "promotional_credit",
  "correction",
] as const;
export const serviceQuestionTypeValues = ["text", "textarea", "select", "multiselect", "radio", "boolean", "number"] as const;
export const allowedLeadImageTypes = ["image/jpeg", "image/png", "image/webp"] as const;
export const maxLeadImageSizeBytes = 5 * 1024 * 1024;
export const maxLeadImageCount = 5;
export const contactReasonValues = ["consument", "vakman", "algemeen"] as const;
export const contactSubmissionStatusValues = ["new", "read", "handled", "spam"] as const;
export const allowedProfessionalDocumentTypes = ["application/pdf", "image/jpeg", "image/png"] as const;
export const maxProfessionalDocumentSizeBytes = 10 * 1024 * 1024;
export const minimumProfessionalQualityScore = 75;
export const maxProfessionalOpenOffers = 50;
export const maxProfessionalActiveAssignments = 200;
