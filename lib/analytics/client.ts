"use client";

import { getStoredAttributionSnapshot } from "@/lib/analytics/attribution";
import { funnelEventNames, type FunnelEventName } from "@/lib/analytics/events";
import { getOrCreateAnonymousSessionId } from "@/lib/analytics/session";
import { classifyPublicPage, type AnalyticsPageContext } from "@/lib/analytics/page-types";
import {
  beginAnalyticsPageView,
  ctaImpressionIdempotencyKey,
  getAnalyticsPageViewId,
  shouldRecordCtaImpression,
} from "@/lib/analytics/impressions";

export type ClientExperimentAssignment = {
  experimentId: string;
  experimentKey: string;
  slot: string;
  variantId: string;
  variantKey: string;
  variantLabel: string;
};

const submittedExposureContexts = new Set<string>();

export function getClientAttributionSnapshot() {
  return getStoredAttributionSnapshot();
}

function getDeviceCategory(): "mobile" | "tablet" | "desktop" {
  const width = window.innerWidth;
  return width < 768 ? "mobile" : width < 1024 ? "tablet" : "desktop";
}

function getReferralChannel(attribution: ReturnType<typeof getStoredAttributionSnapshot>) {
  const medium = attribution.utm_medium?.toLowerCase() ?? "";
  if (attribution.gclid || attribution.fbclid || /cpc|ppc|paid|display|social_paid/.test(medium)) return "paid";
  if (attribution.utm_source || attribution.referrer) {
    if (/organic/.test(medium) || /google|bing|duckduckgo|yahoo|ecosia|brave/.test(attribution.referrer ?? "")) return "organic";
    return "referral";
  }
  if (attribution.first_touch_source === "direct") return "direct";
  return "unknown";
}

export async function trackFunnelEvent(
  eventName: FunnelEventName,
  metadata?: Record<string, unknown>,
  pageContext?: AnalyticsPageContext,
  idempotencyKey?: string,
) {
  const anonymousSessionId = getOrCreateAnonymousSessionId();
  const attribution = getStoredAttributionSnapshot();
  const page = classifyPublicPage(window.location.pathname, pageContext);
  const sourcePage = classifyPublicPage(attribution.landing_page ?? "/");
  const deviceCategory = getDeviceCategory();
  const safeMetadata = {
    schema_version: 1,
    route: page.route,
    page_type: page.pageType,
    ...(page.serviceSlug ?? sourcePage.serviceSlug ? { service_slug: page.serviceSlug ?? sourcePage.serviceSlug } : {}),
    ...(page.subserviceSlug ?? sourcePage.subserviceSlug ? { subservice_slug: page.subserviceSlug ?? sourcePage.subserviceSlug } : {}),
    ...(page.citySlug ? { city_slug: page.citySlug } : {}),
    ...(page.provinceSlug ? { province_slug: page.provinceSlug } : {}),
    device_category: deviceCategory,
    viewport_bucket: deviceCategory,
    referral_channel: getReferralChannel(attribution),
    ...(attribution.utm_source ? { utm_source: attribution.utm_source } : {}),
    ...(attribution.utm_medium ? { utm_medium: attribution.utm_medium } : {}),
    ...(attribution.utm_campaign ? { utm_campaign: attribution.utm_campaign } : {}),
    ...(attribution.first_touch_source ? { first_touch_source: attribution.first_touch_source } : {}),
    ...(attribution.landing_page ? { source_route: attribution.landing_page } : {}),
    ...metadata,
  };

  await fetch("/api/analytics/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      eventName,
      anonymousSessionId,
      metadata: safeMetadata,
      ...(idempotencyKey ? { idempotencyKey } : {}),
    }),
    keepalive: true,
  }).catch(() => null);
}

export function trackCtaImpression(input: {
  ctaId: string;
  ctaLocation: string;
  destinationType: string;
  pageContext?: AnalyticsPageContext;
  assignment?: ClientExperimentAssignment | null;
}) {
  const sessionId = getOrCreateAnonymousSessionId();
  const firstImpression = shouldRecordCtaImpression(input.ctaId, input.ctaLocation);
  const pageViewId = getAnalyticsPageViewId();

  const experimentMetadata = input.assignment
    ? {
        experiment_id: input.assignment.experimentId,
        experiment_key: input.assignment.experimentKey,
        variant_id: input.assignment.variantId,
        variant_key: input.assignment.variantKey,
        experiment_slot: input.assignment.slot,
      }
    : {};
  if (firstImpression) {
    void trackFunnelEvent(funnelEventNames.ctaImpression, {
      cta_id: input.ctaId,
      cta_location: input.ctaLocation,
      destination_type: input.destinationType,
      ...experimentMetadata,
    }, input.pageContext, ctaImpressionIdempotencyKey(sessionId, pageViewId, input.ctaId, input.ctaLocation));
  }

  if (input.assignment) {
    void trackExperimentExposure(input.assignment, input.pageContext);
  }
}

export function trackExperimentExposure(
  assignment: ClientExperimentAssignment,
  pageContext?: AnalyticsPageContext,
  stepKey?: string,
) {
  const anonymousSessionId = getOrCreateAnonymousSessionId();
  const attribution = getStoredAttributionSnapshot();
  const page = classifyPublicPage(window.location.pathname, pageContext);
  if (!anonymousSessionId || !page.pageType) return;

  const deviceCategory = getDeviceCategory();
  const referralChannel = getReferralChannel(attribution);
  const contextKey = [
    anonymousSessionId,
    assignment.experimentId,
    assignment.variantId,
    page.route,
    deviceCategory,
    referralChannel,
    stepKey ?? "",
  ].join(":");
  if (submittedExposureContexts.has(contextKey)) return;
  submittedExposureContexts.add(contextKey);

  void fetch("/api/experiments/exposure", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({
      anonymousSessionId,
      experimentId: assignment.experimentId,
      variantId: assignment.variantId,
      route: page.route,
      pageType: page.pageType,
      serviceSlug: page.serviceSlug,
      citySlug: page.citySlug,
      deviceCategory,
      referralChannel,
      ...(stepKey ? { stepKey } : {}),
    }),
  }).then(async (response) => {
    const payload = (await response.json().catch(() => null)) as { ok?: boolean } | null;
    if (!response.ok || !payload?.ok) submittedExposureContexts.delete(contextKey);
  }).catch(() => submittedExposureContexts.delete(contextKey));
}

export async function requestExperimentAssignment(
  slot: string,
  pageContext?: AnalyticsPageContext,
  stepKey?: string,
): Promise<ClientExperimentAssignment | null> {
  const anonymousSessionId = getOrCreateAnonymousSessionId();
  if (!anonymousSessionId) return null;

  const attribution = getStoredAttributionSnapshot();
  const page = classifyPublicPage(window.location.pathname, pageContext);
  if (!page.pageType) return null;

  try {
    const response = await fetch("/api/experiments/assignment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        anonymousSessionId,
        slot,
        route: page.route,
        pageType: page.pageType,
        serviceSlug: page.serviceSlug,
        citySlug: page.citySlug,
        deviceCategory: getDeviceCategory(),
        referralChannel: getReferralChannel(attribution),
        ...(stepKey ? { stepKey } : {}),
      }),
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as { assignment?: ClientExperimentAssignment | null };
    return payload.assignment ?? null;
  } catch {
    return null;
  }
}

export function trackPublicPageView(pathname: string, context: AnalyticsPageContext = {}) {
  const page = classifyPublicPage(pathname, context);
  if (!page.pageType) return;
  beginAnalyticsPageView();

  const eventName =
    page.pageType === "service" || page.pageType === "subservice"
      ? "service_page_view"
      : page.pageType === "service_city" || page.pageType === "subservice_city" || page.pageType === "province"
        ? "local_page_view"
        : "public_page_view";

  void trackFunnelEvent(eventName, undefined, { ...context, pageType: page.pageType });
}
