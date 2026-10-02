import "server-only";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { allowedFunnelEventNames, type FunnelEventName } from "@/lib/analytics/events";
import { sanitizeAnalyticsMetadata } from "@/lib/analytics/privacy";
import { trackExternalAnalytics } from "@/lib/analytics/providers";

function normalizeSessionId(value: string | null | undefined) {
  const trimmed = (value ?? "").trim();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(trimmed) ? trimmed : null;
}

export async function storeAnalyticsEvent(input: {
  eventName: FunnelEventName;
  anonymousSessionId: string;
  leadId?: string | null;
  serviceId?: string | null;
  idempotencyKey?: string | null;
  metadata?: Record<string, unknown> | null;
}) {
  if (!allowedFunnelEventNames.has(input.eventName)) {
    throw new Error("Unsupported analytics event.");
  }

  const anonymousSessionId = normalizeSessionId(input.anonymousSessionId);
  if (!anonymousSessionId) {
    throw new Error("Anonymous session id ontbreekt.");
  }
  if (input.idempotencyKey && !/^[a-z0-9:_-]{1,160}$/i.test(input.idempotencyKey)) {
    throw new Error("Ongeldige analytics idempotency key.");
  }

  const metadata = sanitizeAnalyticsMetadata(input.metadata ?? null);
  const supabase = createAdminSupabaseClient();

  const event = {
    event_name: input.eventName,
    anonymous_session_id: anonymousSessionId,
    lead_id: input.leadId ?? null,
    service_id: input.serviceId ?? null,
    metadata,
    idempotency_key: input.idempotencyKey ?? null,
  };

  if (input.idempotencyKey) {
    const { data, error } = await supabase
      .from("analytics_events")
      .upsert({ ...event, idempotency_key: input.idempotencyKey }, { onConflict: "idempotency_key", ignoreDuplicates: true })
      .select("id")
      .maybeSingle();
    if (error) throw new Error("Analytics event kon niet worden opgeslagen.");
    if (!data) return;
  } else {
    const { error } = await supabase.from("analytics_events").insert(event);
    if (error) throw new Error("Analytics event kon niet worden opgeslagen.");
  }

  await trackExternalAnalytics(input.eventName, { anonymousSessionId, metadata });
}

export async function linkAnonymousAnalyticsEventsToLead(anonymousSessionId: string | null | undefined, leadId: string) {
  const normalizedSessionId = normalizeSessionId(anonymousSessionId);
  if (!normalizedSessionId) return;

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("analytics_events")
    .update({ lead_id: leadId })
    .eq("anonymous_session_id", normalizedSessionId)
    .is("lead_id", null);
  if (!error) return;

  const { data: legacyEvents, error: readError } = await supabase
    .from("analytics_events")
    .select("id, metadata")
    .eq("anonymous_session_id", normalizedSessionId)
    .is("lead_id", null)
    .limit(500);
  if (readError) throw new Error("Analytics events konden niet aan de aanvraag worden gekoppeld.");

  const updates = await Promise.all(
    (legacyEvents ?? []).map((event) =>
      supabase
        .from("analytics_events")
        .update({ lead_id: leadId, metadata: sanitizeAnalyticsMetadata(event.metadata) })
        .eq("id", event.id)
        .eq("anonymous_session_id", normalizedSessionId)
        .is("lead_id", null),
    ),
  );
  if (updates.some((result) => result.error)) {
    throw new Error("Analytics events konden niet aan de aanvraag worden gekoppeld.");
  }
}
