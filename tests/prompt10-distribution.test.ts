import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { calculateDistributionScore, evaluateDistributionEligibility } from "../lib/distribution/scoring.ts";

const migrationPath =
  "/home/runner/work/VakConnect/VakConnect/supabase/migrations/20260910160000_phase6_lead_distribution_engine.sql";
const migrationSql = readFileSync(migrationPath, "utf8");
const enginePath = "/home/runner/work/VakConnect/VakConnect/lib/distribution/engine.ts";
const engineSource = readFileSync(enginePath, "utf8");
const workerRouteSource = readFileSync("/home/runner/work/VakConnect/VakConnect/app/api/internal/distribution/process/route.ts", "utf8");


test("phase6 migration adds distribution schema, capacity settings and idempotency constraints", () => {
  assert.match(migrationSql, /create table if not exists public\.lead_distribution_runs/);
  assert.match(migrationSql, /create table if not exists public\.lead_distribution_candidates/);
  assert.match(migrationSql, /create table if not exists public\.professional_distribution_settings/);
  assert.match(migrationSql, /create unique index if not exists lead_distribution_one_active_run_idx/);
  assert.match(migrationSql, /unique \(distribution_run_id, professional_id\)/);
  assert.match(migrationSql, /create unique index if not exists lead_distribution_no_duplicate_live_offer_idx/);
  assert.match(migrationSql, /ranking_score integer check \(ranking_score between 0 and 100\)/);
});

test("phase6 migration enforces privacy and secure purchase gating", () => {
  assert.doesNotMatch(migrationSql, /first_name|last_name|email|phone/);
  assert.match(migrationSql, /raise exception 'LEAD_OFFER_NOT_ACTIVE'/);
  assert.match(migrationSql, /create trigger enforce_active_offer_for_purchase_on_update/);
  assert.match(migrationSql, /create trigger sync_distribution_after_purchase_on_update/);
  assert.match(migrationSql, /for update/);
  assert.match(migrationSql, /for update skip locked/);
  assert.match(migrationSql, /create or replace function public\.claim_expired_distribution_candidates/);
  assert.match(migrationSql, /create or replace function public\.activate_lead_distribution_run/);
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
    purchaseRate: 0.95,
    winRate: 0.8,
    avgResponseHours: 1,
    workloadRatio: 0.1,
    fairness: 4,
  });
  const lowFit = calculateDistributionScore({
    verification: "unverified",
    purchaseRate: 0.2,
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
    purchaseRate: 0.5,
    winRate: 0.5,
    avgResponseHours: 12,
    workloadRatio: 0.5,
    fairness: 0,
  });
  const boosted = calculateDistributionScore({
    verification: "pending",
    purchaseRate: 0.5,
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
    purchaseRate: 0.8,
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
    purchaseRate: 1,
    winRate: 1,
    avgResponseHours: 0,
    workloadRatio: 0,
    fairness: 999,
  });
  assert.ok(extreme.breakdown.fairness <= 10);
});

test("engine gebruikt DB-level claim en run-activatie RPC voor concurrency-safe expiry/fallback", () => {
  assert.match(engineSource, /claim_expired_distribution_candidates/);
  assert.match(engineSource, /activate_lead_distribution_run/);
  assert.match(engineSource, /const runIds = new Set<string>\(\)/);
});

test("engine blokkeert admin requeue voor purchased kandidaten", () => {
  assert.match(engineSource, /function canAdminRequeueCandidate/);
  assert.match(engineSource, /status !== "purchased"/);
  assert.match(engineSource, /Handmatige override is niet toegestaan voor een reeds gekochte kandidaat/);
});

test("engine voorkomt verlopen offer-view en gebruikt idempotente run-start conflict afhandeling", () => {
  assert.match(engineSource, /offer_expires_at/);
  assert.match(engineSource, /candidate\.offer_expires_at[\s\S]*Date\.now\(\)/);
  assert.match(engineSource, /runError\?\.code !== "23505"/);
  assert.match(engineSource, /return concurrentRun\.id/);
});

test("manual override markeert kandidaat zonder fake score 100", () => {
  assert.match(engineSource, /ranking_score: existingCandidate\?\.ranking_score \?\? null/);
  assert.match(engineSource, /admin_override: true/);
  assert.doesNotMatch(engineSource, /ranking_score:\s*100/);
});

test("response performance gebruikt purchase rate, niet view rate", () => {
  assert.match(engineSource, /const purchaseRate = offersReceivedDenominator > 0/);
  assert.match(engineSource, /\? candidate\.stats\.purchases \/ offersReceivedDenominator/);
  assert.match(engineSource, /distributionConfig\.coldStart\.purchaseRate/);
});

test("viewed zonder purchase geeft geen kunstmatig hoge response performance", () => {
  const viewedOnly = calculateDistributionScore({
    verification: "verified",
    purchaseRate: 0,
    winRate: 0.5,
    avgResponseHours: 2,
    workloadRatio: 0.2,
    fairness: 0,
  });
  const purchased = calculateDistributionScore({
    verification: "verified",
    purchaseRate: 1,
    winRate: 0.5,
    avgResponseHours: 2,
    workloadRatio: 0.2,
    fairness: 0,
  });
  assert.ok(viewedOnly.breakdown.response_performance < purchased.breakdown.response_performance);
});

test("worker endpoint blijft POST-only en deny-by-default zonder secret", () => {
  assert.match(workerRouteSource, /export async function POST/);
  assert.doesNotMatch(workerRouteSource, /export async function GET/);
  assert.match(workerRouteSource, /if \(!secret\) \{\s*return false;\s*\}/);
  assert.match(workerRouteSource, /error: "unauthorized"/);
  assert.match(workerRouteSource, /return NextResponse\.json\(\{ processed \}\)/);
});
