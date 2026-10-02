import assert from "node:assert/strict";
import test from "node:test";
import { clientTrackableEventNames, funnelEventNames } from "../lib/analytics/events.ts";
import { getStoredAttributionSnapshot } from "../lib/analytics/attribution.ts";
import { classifyPublicPage } from "../lib/analytics/page-types.ts";
import { sanitizeAnalyticsMetadata } from "../lib/analytics/privacy.ts";
import { buildAnalyticsReport, type AnalyticsReportEvent } from "../lib/analytics/reporting.ts";
import type { Service } from "../types/database.ts";

test("public route classification uses stable page types and strips query strings", () => {
  assert.equal(classifyPublicPage("/").pageType, "homepage");
  assert.equal(classifyPublicPage("/aanvraag?dienst=dakdekker").pageType, "lead_funnel");
  assert.equal(classifyPublicPage("/dakdekker").pageType, "service");
  assert.equal(classifyPublicPage("/dakdekker/daklekkage").pageType, "subservice");
  assert.equal(
    classifyPublicPage("/dakdekker/utrecht", { pageType: "service_city", citySlug: "utrecht" }).pageType,
    "service_city",
  );
  assert.equal(
    classifyPublicPage("/dakdekker/daklekkage/utrecht", {
      pageType: "subservice_city",
      subserviceSlug: "daklekkage",
      citySlug: "utrecht",
    }).citySlug,
    "utrecht",
  );
  assert.equal(classifyPublicPage("/regios/noord-brabant").pageType, "province");
  assert.equal(classifyPublicPage("/contact?email=person@example.com").route, "/contact");
});

test("analytics allowlist drops PII keys, PII-like values, query routes, and arbitrary properties", () => {
  const sanitized = sanitizeAnalyticsMetadata({
    schema_version: 1,
    route: "/contact?email=person@example.com",
    source_route: "/dakdekker/utrecht",
    page_type: "core_public",
    cta_id: "home_hero_request",
    cta_location: "hero",
    email: "person@example.com",
    phone: "0612345678",
    name: "Persoon",
    address: "Lange straat 1",
    description: "vrije tekst",
    free_text: "willekeurige inhoud",
    utm_source: "person@example.com",
    utm_campaign: "0612-345678",
    unknown_page_type: "unclassified",
    source_page_type: "not_known",
  });

  assert.deepEqual(sanitized, {
    schema_version: 1,
    source_route: "/dakdekker/utrecht",
    page_type: "core_public",
    cta_id: "home_hero_request",
    cta_location: "hero",
  });
});

test("server conversion events cannot be submitted as client events", () => {
  assert.equal((clientTrackableEventNames as readonly string[]).includes(funnelEventNames.leadSubmitted), false);
});

test("first-touch and current attribution survive internal route navigation without query or referrer paths", () => {
  const storage = new Map<string, string>();
  let href = "https://vakconnect.nl/dakdekker?utm_source=Google&utm_medium=organic&utm_campaign=Voorjaar";
  let referrer = "https://www.google.com/search?q=dakdekker";
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      location: {
        get href() { return href; },
        origin: "https://vakconnect.nl",
        hostname: "vakconnect.nl",
      },
      localStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
      },
    },
  });
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: { get referrer() { return referrer; } },
  });

  try {
    const firstPage = getStoredAttributionSnapshot();
    assert.equal(firstPage.landing_page, "/dakdekker");
    assert.equal(firstPage.referrer, "google.com");
    assert.equal(firstPage.first_touch_source, "google");

    href = "https://vakconnect.nl/aanvraag";
    referrer = "https://vakconnect.nl/dakdekker";
    const requestPage = getStoredAttributionSnapshot();
    assert.equal(requestPage.utm_source, "google");
    assert.equal(requestPage.utm_campaign, "voorjaar");
    assert.equal(requestPage.landing_page, "/dakdekker");
    assert.equal(requestPage.referrer, "google.com");
    assert.equal(requestPage.first_touch_source, "google");
  } finally {
    if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
    else Reflect.deleteProperty(globalThis, "window");
    if (originalDocument) Object.defineProperty(globalThis, "document", originalDocument);
    else Reflect.deleteProperty(globalThis, "document");
  }
});

test("analytics report reconciles events with saved leads and summarizes funnel/local/service dimensions", () => {
  const serviceId = "123e4567-e89b-42d3-a456-426614174000";
  const events: AnalyticsReportEvent[] = [
    {
      event_name: "service_page_view",
      anonymous_session_id: "123e4567-e89b-42d3-a456-426614174001",
      lead_id: null,
      service_id: null,
      metadata: { route: "/dakdekker", page_type: "service", service_slug: "dakdekker" },
      created_at: "2026-10-01T10:00:00.000Z",
    },
    {
      event_name: "local_page_view",
      anonymous_session_id: "123e4567-e89b-42d3-a456-426614174001",
      lead_id: null,
      service_id: null,
      metadata: {
        route: "/dakdekker/utrecht",
        page_type: "service_city",
        service_slug: "dakdekker",
        city_slug: "utrecht",
      },
      created_at: "2026-10-01T10:01:00.000Z",
    },
    {
      event_name: "public_cta_click",
      anonymous_session_id: "123e4567-e89b-42d3-a456-426614174001",
      lead_id: null,
      service_id: null,
      metadata: {
        route: "/dakdekker/utrecht",
        page_type: "service_city",
        service_slug: "dakdekker",
        city_slug: "utrecht",
        cta_location: "hero",
      },
      created_at: "2026-10-01T10:02:00.000Z",
    },
    {
      event_name: "lead_funnel_started",
      anonymous_session_id: "123e4567-e89b-42d3-a456-426614174001",
      lead_id: null,
      service_id: null,
      metadata: {
        route: "/aanvraag",
        source_route: "/dakdekker/utrecht",
        service_slug: "dakdekker",
        device_category: "mobile",
        referral_channel: "organic",
      },
      created_at: "2026-10-01T10:03:00.000Z",
    },
    {
      event_name: "lead_funnel_step_viewed",
      anonymous_session_id: "123e4567-e89b-42d3-a456-426614174001",
      lead_id: null,
      service_id: null,
      metadata: { step_key: "service" },
      created_at: "2026-10-01T10:03:01.000Z",
    },
    {
      event_name: "lead_funnel_step_completed",
      anonymous_session_id: "123e4567-e89b-42d3-a456-426614174001",
      lead_id: null,
      service_id: null,
      metadata: { step_key: "service", duration_bucket: "under_15s" },
      created_at: "2026-10-01T10:03:10.000Z",
    },
    {
      event_name: "lead_submitted",
      anonymous_session_id: "123e4567-e89b-42d3-a456-426614174001",
      lead_id: "lead-1",
      service_id: serviceId,
      metadata: { source_route: "/dakdekker/utrecht" },
      created_at: "2026-10-01T10:04:00.000Z",
    },
  ];
  const services: Pick<Service, "id" | "slug" | "name">[] = [{ id: serviceId, slug: "dakdekker", name: "Dakdekker" }];
  const report = buildAnalyticsReport({
    events,
    leads: [{ id: "lead-1", service_id: serviceId }],
    services,
  });

  assert.equal(report.pageViews, 2);
  assert.equal(report.ctaClicks, 1);
  assert.equal(report.funnelStarts, 1);
  assert.equal(report.convertedSessions, 1);
  assert.equal(report.storedLeads, 1);
  assert.equal(report.reconciliationDifference, 0);
  assert.deepEqual(report.localRows[0], {
    route: "/dakdekker/utrecht",
    city: "utrecht",
    service: "dakdekker",
    views: 1,
    ctaClicks: 1,
    starts: 1,
    submissions: 1,
  });
  assert.equal(report.serviceRows[0]?.submissions, 1);
  assert.equal(report.serviceRows[0]?.lowSample, true);
  assert.equal(report.funnelRows[0]?.completionRate, 100);
  assert.equal(report.funnelRows[0]?.dropOffRate, 0);
  assert.deepEqual(report.deviceRows, [{ device: "mobile", starts: 1, submissions: 1 }]);
  assert.deepEqual(report.channelRows, [{ channel: "organic", starts: 1, submissions: 1 }]);
});
