import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { canProfessionalViewLeadContact, summarizeLeadDescription } from "../lib/commercial/privacy.ts";
import { getEffectiveLeadCapacity, resolveLeadPrice } from "../lib/commercial/pricing.ts";
import type { LeadPricingRule } from "../types/database.ts";

const migrationPath =
  "/home/runner/work/VakConnect/VakConnect/supabase/migrations/20260909222000_phase5_commercial_lead_wallet.sql";
const sql = readFileSync(migrationPath, "utf8");

const sampleRules: LeadPricingRule[] = [
  {
    id: "rule-general-shared",
    service_id: null,
    service_slug: null,
    subservice_slug: null,
    lead_type: "shared",
    base_price_credits: 12,
    exclusive_multiplier: 1.25,
    shared_multiplier: 1,
    min_score: null,
    max_score: null,
    active: true,
    priority: 0,
    created_at: "2026-09-09T00:00:00.000Z",
    updated_at: "2026-09-09T00:00:00.000Z",
  },
  {
    id: "rule-service-exclusive",
    service_id: "service-1",
    service_slug: "dakdekker",
    subservice_slug: "daklekkage",
    lead_type: "exclusive",
    base_price_credits: 18,
    exclusive_multiplier: 1.5,
    shared_multiplier: 1,
    min_score: 80,
    max_score: null,
    active: true,
    priority: 20,
    created_at: "2026-09-09T00:00:00.000Z",
    updated_at: "2026-09-09T00:00:00.000Z",
  },
];

test("phase5 migration creates wallets, ledger transactions and purchases with RLS", () => {
  assert.match(sql, /create table if not exists public\.professional_wallets/);
  assert.match(sql, /create table if not exists public\.wallet_transactions/);
  assert.match(sql, /create table if not exists public\.lead_purchases/);
  assert.match(sql, /alter table public\.professional_wallets enable row level security;/);
  assert.match(sql, /create policy "professionals can read own wallet"/);
  assert.match(sql, /create policy "professionals can read own wallet transactions"/);
  assert.match(sql, /create policy "professionals can read own lead purchases"/);
});

test("phase5 migration enforces immutable ledger and atomic purchase functions", () => {
  assert.match(sql, /create or replace function public\.apply_wallet_transaction/);
  assert.match(sql, /for update;/);
  assert.match(sql, /if next_balance < 0 then/);
  assert.match(sql, /create trigger prevent_wallet_transactions_update/);
  assert.match(sql, /create or replace function public\.purchase_lead/);
  assert.match(sql, /purchase_idempotency_key text default null/);
  assert.match(sql, /transaction_type = 'lead_purchase'/);
  assert.match(sql, /raise exception 'LEAD_SOLD_OUT'/);
  assert.match(sql, /raise exception 'INSUFFICIENT_BALANCE'/);
});

test("phase5 migration tightens lead privacy and refund flow", () => {
  assert.match(sql, /create or replace function public\.can_professional_view_lead_contact/);
  assert.match(sql, /drop policy if exists "professionals can read assigned leads" on public\.leads;/);
  assert.match(sql, /create policy "professionals can read unlocked leads"/);
  assert.match(sql, /create or replace function public\.refund_lead_purchase/);
  assert.match(sql, /raise exception 'PURCHASE_ALREADY_REFUNDED'/);
  assert.match(sql, /create table if not exists public\.commercial_audit_log/);
});

test("contact unlock helper only returns true after purchased access or accepted legacy assignment", () => {
  assert.equal(canProfessionalViewLeadContact({ purchaseStatus: "purchased" }), true);
  assert.equal(canProfessionalViewLeadContact({ assignmentStatus: "accepted", assignmentPurchaseLinked: false }), true);
  assert.equal(canProfessionalViewLeadContact({ assignmentStatus: "accepted", assignmentPurchaseLinked: true, purchaseStatus: "refunded" }), false);
  assert.equal(canProfessionalViewLeadContact({ assignmentStatus: "pending" }), false);
});

test("lead pricing resolver prefers override, specific rules and integer credit pricing", () => {
  assert.equal(getEffectiveLeadCapacity("exclusive", 5), 1);
  assert.equal(getEffectiveLeadCapacity("shared", 3), 3);

  const override = resolveLeadPrice({
    serviceId: "service-1",
    serviceSlug: "dakdekker",
    subserviceSlug: "daklekkage",
    leadType: "exclusive",
    leadScore: 95,
    priceOverrideCredits: 22,
    maxBuyers: 1,
    buyersCount: 0,
    salesStatus: "available",
  }, sampleRules);
  assert.equal(override.priceCredits, 22);
  assert.equal(override.priceSource, "lead_override");

  const resolved = resolveLeadPrice({
    serviceId: "service-1",
    serviceSlug: "dakdekker",
    subserviceSlug: "daklekkage",
    leadType: "exclusive",
    leadScore: 95,
    priceOverrideCredits: null,
    maxBuyers: 1,
    buyersCount: 0,
    salesStatus: "available",
  }, sampleRules);
  assert.equal(resolved.pricingRuleId, "rule-service-exclusive");
  assert.equal(resolved.priceCredits, 27);

  const fallback = resolveLeadPrice({
    serviceId: "service-2",
    serviceSlug: "schilder",
    subserviceSlug: null,
    leadType: "shared",
    leadScore: 20,
    priceOverrideCredits: null,
    maxBuyers: 3,
    buyersCount: 0,
    salesStatus: "available",
  }, []);
  assert.equal(fallback.priceCredits, 12);
  assert.equal(fallback.priceSource, "default");
});

test("preview descriptions are shortened without leaking full free-text walls", () => {
  const summary = summarizeLeadDescription("Dit is een uitgebreide omschrijving met veel woorden en extra context over een lekkage die dringend aandacht vraagt.", 60);
  assert.ok(summary.endsWith("…"));
  assert.ok(summary.length <= 60);
});
