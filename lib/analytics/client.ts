"use client";

import { getStoredAttributionSnapshot } from "@/lib/analytics/attribution";
import { type FunnelEventName } from "@/lib/analytics/events";
import { getOrCreateAnonymousSessionId } from "@/lib/analytics/session";
import { classifyPublicPage, type AnalyticsPageContext } from "@/lib/analytics/page-types";

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
    }),
    keepalive: true,
  }).catch(() => null);
}

export function trackPublicPageView(pathname: string, context: AnalyticsPageContext = {}) {
  const page = classifyPublicPage(pathname, context);
  if (!page.pageType) return;

  const eventName =
    page.pageType === "service" || page.pageType === "subservice"
      ? "service_page_view"
      : page.pageType === "service_city" || page.pageType === "subservice_city" || page.pageType === "province"
        ? "local_page_view"
        : "public_page_view";

  void trackFunnelEvent(eventName, undefined, { ...context, pageType: page.pageType });
}
