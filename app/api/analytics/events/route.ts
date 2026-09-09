import { NextResponse } from "next/server";
import { z } from "zod";
import { funnelEventNames } from "@/lib/analytics/events";
import { storeAnalyticsEvent } from "@/lib/analytics/server";

const eventSchema = z.object({
  eventName: z.enum([
    funnelEventNames.leadFunnelStarted,
    funnelEventNames.serviceSelected,
    funnelEventNames.locationCompleted,
    funnelEventNames.dynamicQuestionsCompleted,
    funnelEventNames.mediaStepCompleted,
    funnelEventNames.contactCompleted,
    funnelEventNames.leadSubmitted,
  ]),
  anonymousSessionId: z.string().trim().min(16).max(120),
  serviceId: z.string().uuid().optional(),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.array(z.union([z.string(), z.number(), z.boolean()]))])).nullable().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = eventSchema.safeParse(body);

    if (!payload.success) {
      return NextResponse.json({ error: "Ongeldig analytics event." }, { status: 400 });
    }

    await storeAnalyticsEvent({
      eventName: payload.data.eventName,
      anonymousSessionId: payload.data.anonymousSessionId,
      serviceId: payload.data.serviceId,
      metadata: payload.data.metadata,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Analytics event kon niet worden opgeslagen." }, { status: 500 });
  }
}
