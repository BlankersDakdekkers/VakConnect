import { NextResponse } from "next/server";
import { z } from "zod";
import { analyticsDeviceCategories, analyticsReferralChannels } from "@/lib/analytics/events";
import { classifyPublicPage } from "@/lib/analytics/page-types";
import { assignExperimentVariant } from "@/lib/experiments/server";

const requestSchema = z.strictObject({
  anonymousSessionId: z.string().uuid(),
  slot: z.string().regex(/^[a-z0-9_.]{3,100}$/),
  route: z.string().regex(/^\/[a-zA-Z0-9_./-]{0,200}$/).refine((route) => !route.includes("//") && route.replace(/\D/g, "").length < 7),
  serviceSlug: z.string().regex(/^[a-z0-9-]{1,80}$/).nullable(),
  citySlug: z.string().regex(/^[a-z0-9-]{1,80}$/).nullable(),
  deviceCategory: z.enum(analyticsDeviceCategories),
  referralChannel: z.enum(analyticsReferralChannels),
  pageType: z.enum(["homepage", "core_public", "service", "subservice", "service_city", "subservice_city", "province", "lead_funnel", "professional_landing", "contact", "costs"]),
  stepKey: z.string().regex(/^[a-z_]{2,40}$/).nullable().optional(),
});

export async function POST(request: Request) {
  try {
    const parsed = requestSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ assignment: null }, { status: 400, headers: { "Cache-Control": "no-store" } });

    const payload = parsed.data;
    const classifiedPage = classifyPublicPage(payload.route, {
      pageType: payload.pageType,
      serviceSlug: payload.serviceSlug,
      citySlug: payload.citySlug,
    });
    if (!classifiedPage.pageType) return NextResponse.json({ assignment: null }, { headers: { "Cache-Control": "no-store" } });

    const assignment = await assignExperimentVariant({
      anonymousSessionId: payload.anonymousSessionId,
      slot: payload.slot,
      context: {
        pageType: classifiedPage.pageType,
        route: classifiedPage.route,
        serviceSlug: classifiedPage.serviceSlug,
        citySlug: classifiedPage.citySlug,
        deviceCategory: payload.deviceCategory,
        referralChannel: payload.referralChannel,
        stepKey: payload.stepKey ?? null,
      },
    });

    return NextResponse.json({ assignment }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ assignment: null }, { headers: { "Cache-Control": "no-store" } });
  }
}
