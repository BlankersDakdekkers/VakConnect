export const funnelEventNames = {
  leadFunnelStarted: "lead_funnel_started",
  publicPageViewed: "public_page_view",
  servicePageViewed: "service_page_view",
  localPageViewed: "local_page_view",
  publicCtaClicked: "public_cta_click",
  serviceSelected: "service_selected",
  subserviceClicked: "subservice_clicked",
  relatedLocationClicked: "related_location_clicked",
  leadFunnelStepViewed: "lead_funnel_step_viewed",
  leadFunnelStepCompleted: "lead_funnel_step_completed",
  leadFunnelValidationError: "lead_funnel_validation_error",
  leadFunnelBack: "lead_funnel_back",
  faqOpened: "faq_opened",
  jumpLinkClicked: "jump_link_clicked",
  locationCompleted: "location_completed",
  dynamicQuestionsCompleted: "dynamic_questions_completed",
  mediaStepCompleted: "media_step_completed",
  contactCompleted: "contact_completed",
  leadSubmitted: "lead_submitted",
} as const;

export type FunnelEventName = (typeof funnelEventNames)[keyof typeof funnelEventNames];

export const allowedFunnelEventNames = new Set<FunnelEventName>(Object.values(funnelEventNames));
export const clientTrackableEventNames = [
  funnelEventNames.leadFunnelStarted,
  funnelEventNames.publicPageViewed,
  funnelEventNames.servicePageViewed,
  funnelEventNames.localPageViewed,
  funnelEventNames.publicCtaClicked,
  funnelEventNames.serviceSelected,
  funnelEventNames.subserviceClicked,
  funnelEventNames.relatedLocationClicked,
  funnelEventNames.leadFunnelStepViewed,
  funnelEventNames.leadFunnelStepCompleted,
  funnelEventNames.leadFunnelValidationError,
  funnelEventNames.leadFunnelBack,
  funnelEventNames.faqOpened,
  funnelEventNames.jumpLinkClicked,
  funnelEventNames.locationCompleted,
  funnelEventNames.dynamicQuestionsCompleted,
  funnelEventNames.mediaStepCompleted,
  funnelEventNames.contactCompleted,
] as const;

export const leadFunnelSteps = [
  "service",
  "questions",
  "location",
  "details",
  "photos",
  "contact",
  "review",
] as const;

export type LeadFunnelStep = (typeof leadFunnelSteps)[number];

export const analyticsPageTypes = [
  "homepage",
  "core_public",
  "service",
  "subservice",
  "service_city",
  "subservice_city",
  "province",
  "lead_funnel",
  "professional_landing",
  "contact",
  "costs",
] as const;

export type AnalyticsPageType = (typeof analyticsPageTypes)[number];

export const analyticsCtaLocations = [
  "hero",
  "mid_content",
  "sticky_mobile",
  "service_card",
  "faq_after",
  "final_cta",
  "header",
  "footer",
  "local_context",
] as const;

export type AnalyticsCtaLocation = (typeof analyticsCtaLocations)[number];

export const analyticsDestinationTypes = ["request", "service", "contact", "professional", "public"] as const;
export const analyticsDeviceCategories = ["mobile", "tablet", "desktop"] as const;
export const analyticsReferralChannels = ["organic", "paid", "direct", "referral", "unknown"] as const;
export const analyticsDurationBuckets = ["under_15s", "15_59s", "1_3m", "over_3m"] as const;

export const analyticsValidationErrorTypes = [
  "required_missing",
  "invalid_postcode",
  "invalid_phone_format",
  "invalid_email_format",
  "upload_failed",
  "file_too_large",
  "invalid_service",
  "other",
] as const;

export type AnalyticsValidationErrorType = (typeof analyticsValidationErrorTypes)[number];
