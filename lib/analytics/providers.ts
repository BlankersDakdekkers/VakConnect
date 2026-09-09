import type { FunnelEventName } from "@/lib/analytics/events";

export interface AnalyticsProvider {
  name: string;
  track(eventName: FunnelEventName, payload: { anonymousSessionId: string; metadata?: Record<string, unknown> | null }): Promise<void>;
}

export class NoopAnalyticsProvider implements AnalyticsProvider {
  name = "noop";

  async track() {
    return;
  }
}

const providers: AnalyticsProvider[] = [new NoopAnalyticsProvider()];

export async function trackExternalAnalytics(eventName: FunnelEventName, payload: { anonymousSessionId: string; metadata?: Record<string, unknown> | null }) {
  await Promise.allSettled(providers.map((provider) => provider.track(eventName, payload)));
}
