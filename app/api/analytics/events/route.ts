import { NextResponse } from "next/server";
import { z } from "zod";
import { clientTrackableEventNames } from "@/lib/analytics/events";
import { storeAnalyticsEvent } from "@/lib/analytics/server";

const eventSchema = z.strictObject({
  eventName: z.enum(clientTrackableEventNames),
  anonymousSessionId: z.string().uuid(),
  serviceId: z.string().uuid().optional(),
  metadata: z
    .record(
      z.string().max(80),
      z.union([z.string().max(120), z.number().finite(), z.boolean(), z.array(z.union([z.string().max(120), z.number().finite(), z.boolean()])).max(10)]),
    )
    .refine((metadata) => Object.keys(metadata).length <= 40, "Te veel analytics-eigenschappen.")
    .nullable()
    .optional(),
});

export async function POST(request: Request) {
  try {
    const bodyText = await request.text();
    if (new TextEncoder().encode(bodyText).byteLength > 8192) {
      return NextResponse.json({ error: "Analytics event is te groot." }, { status: 413 });
    }
    const body = JSON.parse(bodyText);
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
