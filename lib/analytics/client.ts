"use client";

import { getStoredAttributionSnapshot } from "@/lib/analytics/attribution";
import { type FunnelEventName } from "@/lib/analytics/events";
import { getOrCreateAnonymousSessionId } from "@/lib/analytics/session";

export function getClientAttributionSnapshot() {
  return getStoredAttributionSnapshot();
}

export async function trackFunnelEvent(eventName: FunnelEventName, metadata?: Record<string, unknown>) {
  const anonymousSessionId = getOrCreateAnonymousSessionId();

  await fetch("/api/analytics/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      eventName,
      anonymousSessionId,
      metadata: metadata ?? null,
    }),
    keepalive: true,
  }).catch(() => null);
}
