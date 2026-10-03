import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { clientTrackableEventNames, funnelEventNames } from "../lib/analytics/events.ts";
import { sanitizeAnalyticsMetadata } from "../lib/analytics/privacy.ts";
import { buildAnalyticsReport } from "../lib/analytics/reporting.ts";
import { beginAnalyticsPageView, shouldRecordCtaImpression } from "../lib/analytics/impressions.ts";
import { buildExperimentPerformance } from "../lib/experiments/reporting.ts";
import {
  chooseExperimentVariant,
  isValidExperimentConfiguration,
  matchesExperimentTarget,
  type ExperimentVariant,
} from "../lib/experiments/targeting.ts";

const variants: ExperimentVariant[] = [
  { id: "control-id", key: "control", label: "Control", weight: 50, is_control: true },
  { id: "variant-id", key: "variant_b", label: "Variant", weight: 50, is_control: false },
];

test("experiment assignment is deterministic and distributes 50/50 without fingerprinting", () => {
  const sessionId = randomUUID();
  const first = chooseExperimentVariant(sessionId, "homepage_cta_copy", variants);
  assert.equal(chooseExperimentVariant(sessionId, "homepage_cta_copy", variants)?.id, first?.id);

  let controlCount = 0;
  for (let index = 0; index < 1000; index += 1) {
    if (chooseExperimentVariant(randomUUID(), "homepage_cta_copy", variants)?.is_control) controlCount += 1;
  }
  assert.ok(controlCount > 450 && controlCount < 550, `control allocation was ${controlCount}/1000`);
});

test("invalid experiment allocation fails closed to control", () => {
  const invalid = variants.map((variant) => ({ ...variant, weight: variant.is_control ? 40 : 50 }));
  assert.equal(chooseExperimentVariant(randomUUID(), "homepage_cta_copy", invalid)?.key, "control");
  assert.equal(isValidExperimentConfiguration({
    targetType: "homepage",
    slot: "homepage.hero.cta",
    targetRules: { page_type: "homepage", route: "/" },
    goalEvent: "lead_funnel_started",
    variants: invalid,
  }), false);
});

test("experiment target rules constrain route, page type, service, and device", () => {
  const rules = { page_type: "service", route: "/dakdekker", service_slug: "dakdekker", device_category: "mobile" } as const;
  const context = {
    pageType: "service" as const,
    route: "/dakdekker",
    serviceSlug: "dakdekker",
    citySlug: null,
    deviceCategory: "mobile" as const,
    referralChannel: "organic" as const,
  };
  assert.equal(matchesExperimentTarget(rules, context), true);
  assert.equal(matchesExperimentTarget(rules, { ...context, route: "/dakdekker/utrecht" }), false);
  assert.equal(matchesExperimentTarget(rules, { ...context, deviceCategory: "desktop" }), false);
});

test("experiment dashboard joins visible exposures to clicks, starts, and server lead conversions", () => {
  const experimentId = "123e4567-e89b-42d3-a456-426614174000";
  const controlId = "123e4567-e89b-42d3-a456-426614174001";
  const variantId = "123e4567-e89b-42d3-a456-426614174002";
  const events = [
    {
      event_name: "experiment_exposed",
      anonymous_session_id: "control-session",
      lead_id: null,
      metadata: { experiment_id: experimentId, variant_id: controlId, device_category: "desktop" },
      created_at: "2026-10-02T10:00:00.000Z",
    },
    {
      event_name: "lead_funnel_started",
      anonymous_session_id: "control-session",
      lead_id: null,
      metadata: {},
      created_at: "2026-10-02T10:01:00.000Z",
    },
    {
      event_name: "lead_submitted",
      anonymous_session_id: "control-session",
      lead_id: "lead-control",
      metadata: {},
      created_at: "2026-10-02T10:02:00.000Z",
    },
    {
      event_name: "experiment_exposed",
      anonymous_session_id: "variant-session",
      lead_id: null,
      metadata: { experiment_id: experimentId, variant_id: variantId, device_category: "mobile" },
      created_at: "2026-10-02T10:00:00.000Z",
    },
    {
      event_name: "public_cta_click",
      anonymous_session_id: "variant-session",
      lead_id: null,
      metadata: { experiment_id: experimentId, variant_id: variantId },
      created_at: "2026-10-02T10:01:00.000Z",
    },
    {
      event_name: "lead_funnel_started",
      anonymous_session_id: "variant-session",
      lead_id: null,
      metadata: {},
      created_at: "2026-10-02T09:59:30.000Z",
    },
  ];
  const report = buildExperimentPerformance({
    experimentId,
    goalEvent: "lead_submitted",
    variants: [
      { id: controlId, key: "control", label: "Control", weight: 50, is_control: true },
      { id: variantId, key: "variant_b", label: "Variant", weight: 50, is_control: false },
    ],
    events,
  });

  assert.equal(report.rows[0]?.exposures, 1);
  assert.equal(report.rows[0]?.leads, 1);
  assert.equal(report.rows[0]?.goalRate, 100);
  assert.equal(report.rows[1]?.ctaClicks, 1);
  assert.equal(report.rows[1]?.funnelStarts, 1);
  assert.equal(report.rows[1]?.goalRate, 0);
  assert.ok(report.rows[0]?.warnings.includes("Minder dan 50 exposures"));
  assert.equal(report.rows[1]?.deviceRows[0]?.device, "mobile");
});

test("CTA impressions produce CTR and funnel inactivity is only an inference", () => {
  const session = "123e4567-e89b-42d3-a456-426614174000";
  const report = buildAnalyticsReport({
    events: [
      { event_name: "cta_impression", anonymous_session_id: session, lead_id: null, service_id: null, metadata: { cta_id: "home_hero_request", cta_location: "hero" }, created_at: "2026-10-02T10:00:00.000Z" },
      { event_name: "public_cta_click", anonymous_session_id: session, lead_id: null, service_id: null, metadata: { cta_id: "home_hero_request", cta_location: "hero" }, created_at: "2026-10-02T10:01:00.000Z" },
      { event_name: "lead_funnel_started", anonymous_session_id: session, lead_id: null, service_id: null, metadata: {}, created_at: "2026-10-02T10:02:00.000Z" },
      { event_name: "lead_funnel_step_viewed", anonymous_session_id: session, lead_id: null, service_id: null, metadata: { step_key: "location" }, created_at: "2026-10-02T10:03:00.000Z" },
      { event_name: "lead_funnel_validation_error", anonymous_session_id: session, lead_id: null, service_id: null, metadata: { step_key: "location", error_type: "invalid_postcode" }, created_at: "2026-10-02T10:04:00.000Z" },
      { event_name: "lead_funnel_back", anonymous_session_id: session, lead_id: null, service_id: null, metadata: { step_key: "location" }, created_at: "2026-10-02T10:05:00.000Z" },
      { event_name: "lead_funnel_started", anonymous_session_id: "linked-session", lead_id: "already-linked-lead", service_id: null, metadata: {}, created_at: "2026-10-02T10:05:00.000Z" },
    ],
    leads: [],
    services: [],
    now: new Date("2026-10-02T11:00:00.000Z"),
    abandonmentThresholdMinutes: 30,
  });

  test("a CTA slot emits no more than one impression per page view", () => {
    beginAnalyticsPageView();
    assert.equal(shouldRecordCtaImpression("home_hero_request", "hero"), true);
    assert.equal(shouldRecordCtaImpression("home_hero_request", "hero"), false);
    assert.equal(shouldRecordCtaImpression("home_hero_request", "final_cta"), true);
    beginAnalyticsPageView();
    assert.equal(shouldRecordCtaImpression("home_hero_request", "hero"), true);
  });

  assert.equal(report.ctaRows[0]?.impressions, 1);
  assert.equal(report.ctaRows[0]?.ctr, 100);
  assert.equal(report.funnelRows.find((row) => row.step === "location")?.errors, 1);
  assert.equal(report.funnelRows.find((row) => row.step === "location")?.backs, 1);
  assert.equal(report.funnelRows.find((row) => row.step === "location")?.validationErrorRate, 100);
  assert.equal(report.funnelAbandonment.inferredAbandoned, 1);
  assert.equal(report.funnelAbandonment.started, 2);
  assert.equal(report.funnelRows.find((row) => row.step === "location")?.abandoned, 1);
});

test("experiment metadata allowlist keeps safe identifiers and rejects personal fields", () => {
  assert.deepEqual(sanitizeAnalyticsMetadata({
    experiment_id: "123e4567-e89b-42d3-a456-426614174000",
    experiment_key: "homepage_cta_copy",
    variant_id: "123e4567-e89b-42d3-a456-426614174001",
    variant_key: "variant_b",
    experiment_slot: "homepage.hero.cta",
    email: "person@example.com",
    free_text: "hello",
  }), {
    experiment_id: "123e4567-e89b-42d3-a456-426614174000",
    experiment_key: "homepage_cta_copy",
    variant_id: "123e4567-e89b-42d3-a456-426614174001",
    variant_key: "variant_b",
    experiment_slot: "homepage.hero.cta",
  });
});

test("experiment exposure is emitted only by the verified server path, not the public event endpoint", () => {
  assert.equal((clientTrackableEventNames as readonly string[]).includes(funnelEventNames.experimentExposed), false);
});

test("Prompt 20 migration creates private assignments, atomic activation, and draft-only seed experiments", () => {
  const migration = readFileSync(new URL("../supabase/migrations/20261002220000_prompt20_cro_experiments.sql", import.meta.url), "utf8");
  assert.match(migration, /create table public\.experiments/);
  assert.match(migration, /create table public\.experiment_assignments/);
  assert.match(migration, /enable row level security/);
  assert.match(migration, /one_active_per_slot/);
  assert.match(migration, /transition_experiment_status/);
  assert.match(migration, /status text not null default 'draft'/);
  assert.match(migration, /'homepage_cta_copy'/);
  assert.match(migration, /'funnel_progress_copy'/);
  assert.match(migration, /'service_mid_cta_copy'/);
});
