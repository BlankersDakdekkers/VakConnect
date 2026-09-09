export const funnelEventNames = {
  leadFunnelStarted: "lead_funnel_started",
  serviceSelected: "service_selected",
  locationCompleted: "location_completed",
  dynamicQuestionsCompleted: "dynamic_questions_completed",
  mediaStepCompleted: "media_step_completed",
  contactCompleted: "contact_completed",
  leadSubmitted: "lead_submitted",
} as const;

export type FunnelEventName = (typeof funnelEventNames)[keyof typeof funnelEventNames];

export const allowedFunnelEventNames = new Set<FunnelEventName>(Object.values(funnelEventNames));
