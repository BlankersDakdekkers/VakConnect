import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { calculateDistributionScore, evaluateDistributionEligibility } from "../lib/distribution/scoring.ts";

const migrationPath =
  "/home/runner/work/VakConnect/VakConnect/supabase/migrations/20260910160000_phase6_lead_distribution_engine.sql";
const migrationSql = readFileSync(migrationPath, "utf8");
const enginePath = "/home/runner/work/VakConnect/VakConnect/lib/distribution/engine.ts";
const engineSource = readFileSync(enginePath, "utf8");


test("phase6 migration adds distribution schema, capacity settings and idempotency constraints", () => {
  assert.match(migrationSql, /create table if not exists public\.lead_distribution_runs/);
  assert.match(migrationSql, /create table if not exists public\.lead_distribution_candidates/);
  assert.match(migrationSql, /create table if not exists public\.professional_distribution_settings/);
  assert.match(migrationSql, /create unique index if not exists lead_distribution_one_active_run_idx/);
  assert.match(migrationSql, /unique \(distribution_run_id, professional_id\)/);
  assert.match(migrationSql, /create unique index if not exists lead_distribution_no_duplicate_live_offer_idx/);
});

test("phase6 migration enforces privacy and secure purchase gating", () => {
  assert.doesNotMatch(migrationSql, /first_name|last_name|email|phone/);
  assert.match(migrationSql, /raise exception 'LEAD_OFFER_NOT_ACTIVE'/);
  assert.match(migrationSql, /create trigger enforce_active_offer_for_purchase_on_update/);
  assert.match(migrationSql, /create trigger sync_distribution_after_purchase_on_update/);
  assert.match(migrationSql, /for update/);
  assert.match(migrationSql, /create policy "professionals read own distribution candidates"/);
  assert.match(migrationSql, /create policy "admins manage distribution candidates"/);
});

test("phase6 migration adds auditable distribution activity enum values", () => {
  assert.match(migrationSql, /distribution_started/);
  assert.match(migrationSql, /candidate_offered/);
  assert.match(migrationSql, /candidate_declined/);
  assert.match(migrationSql, /candidate_expired/);
  assert.match(migrationSql, /distribution_exhausted/);
  assert.match(migrationSql, /distribution_admin_override/);
});

test("ranking score favors better performance and fairness boost without hidden behavior", () => {
  const topFit = calculateDistributionScore({
    verification: "verified",
    acceptRate: 0.95,
    winRate: 0.8,
    avgResponseHours: 1,
    workloadRatio: 0.1,
    fairness: 4,
  });
  const lowFit = calculateDistributionScore({
    verification: "unverified",
    acceptRate: 0.2,
    winRate: 0.1,
    avgResponseHours: 40,
    workloadRatio: 0.95,
    fairness: -5,
  });

  assert.ok(topFit.score > lowFit.score);
  assert.ok(topFit.score <= 100);
  assert.ok(lowFit.score >= 0);
});

test("eligibility blocks wrong service/area, inactive, paused and open-offer overflow", () => {
  const eligible = evaluateDistributionEligibility({
    professionalActive: true,
    verificationAllowed: true,
    serviceActive: true,
    areaMatch: true,
    paused: false,
    alreadyPurchased: false,
    leadCommerciallyAvailable: true,
    openOffers: 2,
    maxOpenOffers: 5,
  });
  assert.equal(eligible.eligible, true);

  const base = {
    professionalActive: true,
    verificationAllowed: true,
    serviceActive: true,
    areaMatch: true,
    paused: false,
    alreadyPurchased: false,
    leadCommerciallyAvailable: true,
    openOffers: 2,
    maxOpenOffers: 5,
  };
  assert.equal(evaluateDistributionEligibility({ ...base, professionalActive: false }).eligible, false);
  assert.equal(evaluateDistributionEligibility({ ...base, serviceActive: false }).eligible, false);
  assert.equal(evaluateDistributionEligibility({ ...base, areaMatch: false }).eligible, false);
  assert.equal(evaluateDistributionEligibility({ ...base, paused: true }).eligible, false);
  assert.equal(evaluateDistributionEligibility({ ...base, openOffers: 5 }).eligible, false);
  assert.equal(evaluateDistributionEligibility({ ...base, verificationAllowed: false }).eligible, false);
  assert.equal(evaluateDistributionEligibility({ ...base, alreadyPurchased: true }).eligible, false);
  assert.equal(evaluateDistributionEligibility({ ...base, leadCommerciallyAvailable: false }).eligible, false);
});

test("cold-start scoring stays neutral and fairness can boost underexposed professionals", () => {
  const neutral = calculateDistributionScore({
    verification: "pending",
    acceptRate: 0.5,
    winRate: 0.5,
    avgResponseHours: 12,
    workloadRatio: 0.5,
    fairness: 0,
  });
  const boosted = calculateDistributionScore({
    verification: "pending",
    acceptRate: 0.5,
    winRate: 0.5,
    avgResponseHours: 12,
    workloadRatio: 0.5,
    fairness: 8,
  });

  assert.ok(neutral.score > 0);
  assert.ok(boosted.score > neutral.score);
});

test("scoring breakdown blijft uitlegbaar per component", () => {
  const result = calculateDistributionScore({
    verification: "verified",
    acceptRate: 0.8,
    winRate: 0.6,
    avgResponseHours: 4,
    workloadRatio: 0.3,
    fairness: 2,
  });

  assert.deepEqual(Object.keys(result.breakdown), [
    "service",
    "regio",
    "verificatie",
    "response_performance",
    "win_rate",
    "response_time",
    "workload",
    "fairness",
  ]);
  assert.ok(result.score >= 0 && result.score <= 100);
  const extreme = calculateDistributionScore({
    verification: "verified",
    acceptRate: 1,
    winRate: 1,
    avgResponseHours: 0,
    workloadRatio: 0,
    fairness: 999,
  });
  assert.ok(extreme.breakdown.fairness <= 10);
});

test("engine bevat centrale offer lifecycle activatie voor exclusive/shared/sold-out/exhausted", () => {
  assert.match(engineSource, /function determineDistributionActivation/);
  assert.match(engineSource, /action: "close_sold_out"/);
  assert.match(engineSource, /action: "offer_exclusive"/);
  assert.match(engineSource, /action: "offer_shared"/);
  assert.match(engineSource, /action: "exhausted"/);
  assert.match(engineSource, /const activation = determineDistributionActivation/);
});

test("engine blokkeert admin requeue voor purchased kandidaten", () => {
  assert.match(engineSource, /function canAdminRequeueCandidate/);
  assert.match(engineSource, /status !== "purchased"/);
  assert.match(engineSource, /Handmatige override is niet toegestaan voor een reeds gekochte kandidaat/);
});

test("engine voorkomt verlopen offer-view en activeert alleen queued kandidaten", () => {
  assert.match(engineSource, /offer_expires_at/);
  assert.match(engineSource, /candidate\.offer_expires_at[\s\S]*Date\.now\(\)/);
  assert.match(engineSource, /\.eq\("status", "queued"\)/);
  assert.doesNotMatch(engineSource, /upsert\(\s*toOffer\.map/);
});

test("engine gebruikt unique-index conflict als idempotente bron voor run-start", () => {
  assert.match(engineSource, /runError\?\.code !== "23505"/);
  assert.match(engineSource, /return concurrentRun\.id/);
});
