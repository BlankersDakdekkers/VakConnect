import "server-only";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { allowedFunnelEventNames, type FunnelEventName } from "@/lib/analytics/events";
import { sanitizeAnalyticsMetadata } from "@/lib/analytics/privacy";
import { trackExternalAnalytics } from "@/lib/analytics/providers";

function normalizeSessionId(value: string | null | undefined) {
  const trimmed = (value ?? "").trim();
  return trimmed.length >= 16 ? trimmed.slice(0, 120) : null;
}

export async function storeAnalyticsEvent(input: {
  eventName: FunnelEventName;
  anonymousSessionId: string;
  leadId?: string | null;
  serviceId?: string | null;
  metadata?: Record<string, unknown> | null;
}) {
  if (!allowedFunnelEventNames.has(input.eventName)) {
    throw new Error("Unsupported analytics event.");
  }

  const anonymousSessionId = normalizeSessionId(input.anonymousSessionId);
  if (!anonymousSessionId) {
    throw new Error("Anonymous session id ontbreekt.");
  }

  const metadata = sanitizeAnalyticsMetadata(input.metadata ?? null);
  const supabase = createAdminSupabaseClient();

  const { error } = await supabase.from("analytics_events").insert({
    event_name: input.eventName,
    anonymous_session_id: anonymousSessionId,
    lead_id: input.leadId ?? null,
    service_id: input.serviceId ?? null,
    metadata,
  });

  if (error) {
    throw new Error("Analytics event kon niet worden opgeslagen.");
  }

  await trackExternalAnalytics(input.eventName, { anonymousSessionId, metadata });
}

export async function linkAnonymousAnalyticsEventsToLead(anonymousSessionId: string | null | undefined, leadId: string) {
  const normalizedSessionId = normalizeSessionId(anonymousSessionId);
  if (!normalizedSessionId) return;

  const supabase = createAdminSupabaseClient();
  await supabase
    .from("analytics_events")
    .update({ lead_id: leadId })
    .eq("anonymous_session_id", normalizedSessionId)
    .is("lead_id", null);
}
