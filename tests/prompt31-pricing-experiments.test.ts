import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { pricingExperimentDraftSchema } from "../lib/validation/pricing-experiments.ts";

test("pricing draft schema allows only bounded, non-personal segment identifiers", () => {
  const serviceId = randomUUID();
  const professionalId = randomUUID();
  const result = pricingExperimentDraftSchema.safeParse({
    name: "Gedeelde dakleads",
    description: "Beperkte prijsproef voor gedeelde dakleads.",
    serviceIds: serviceId,
    commercialTypes: "shared",
    controlPriceMin: 10,
    controlPriceMax: 20,
    pilotProfessionalIds: professionalId,
    primaryMetric: "offer_to_purchase_rate",
    controlWeight: 60,
    variantWeight: 40,
    variantPriceCredits: 15,
  });

  assert.equal(result.success, true);
  if (!result.success) return;
  assert.deepEqual(result.data.config, {
    segment: {
      service_ids: [serviceId],
      commercial_types: ["shared"],
      control_price_min: 10,
      control_price_max: 20,
    },
    max_delta_percent: 25,
    pilot_mode: true,
    pilot_professional_ids: [professionalId],
  });
});

test("pricing drafts reject excessive prices, unsafe allowlist values, duplicate IDs and invalid allocations", () => {
  const serviceId = randomUUID();
  const valid = {
    name: "Prijsproef",
    description: "Een gecontroleerde prijsproef.",
    serviceIds: serviceId,
    commercialTypes: "all",
    controlPriceMin: "",
    controlPriceMax: "",
    pilotProfessionalIds: "",
    primaryMetric: "net_credits_per_offer",
    controlWeight: 50,
    variantWeight: 50,
    variantPriceCredits: 20,
  };

  assert.equal(pricingExperimentDraftSchema.safeParse({ ...valid, variantPriceCredits: 101 }).success, false);
  assert.equal(pricingExperimentDraftSchema.safeParse({ ...valid, variantWeight: 40 }).success, false);
  assert.equal(pricingExperimentDraftSchema.safeParse({ ...valid, pilotProfessionalIds: "person@example.com" }).success, false);
  assert.equal(pricingExperimentDraftSchema.safeParse({ ...valid, serviceIds: `${serviceId},${serviceId}` }).success, false);
});

test("Prompt 31 migration reuses Prompt 20 and preserves server-authoritative, draft-only pricing safeguards", () => {
  const migration = readFileSync(new URL("../supabase/migrations/20261017100000_prompt31_controlled_pricing_experiments.sql", import.meta.url), "utf8");
  assert.match(migration, /experiment_type text not null default 'cro'/);
  assert.match(migration, /create table public\.pricing_experiment_assignments/);
  assert.match(migration, /unique \(lead_id, professional_id\)/);
  assert.match(migration, /on conflict \(lead_id, professional_id\) do nothing/);
  assert.match(migration, /max_delta_percent/);
  assert.match(migration, /PRICING_EXPERIMENT_CONFIGURATION_IMMUTABLE/);
  assert.match(migration, /PRICING_ASSIGNMENT_PRICE_MISMATCH/);
  assert.match(migration, /pricing_experiment_id/);
  assert.match(migration, /'draft', 'pricing'/);
  assert.doesNotMatch(migration, /insert into public\.experiments[\s\S]{0,500}'active'/i);
});

test("professional purchase action accepts no client price or experiment identifiers", () => {
  const actionSource = readFileSync(new URL("../lib/commercial/actions.ts", import.meta.url), "utf8");
  const purchaseAction = actionSource.match(/export async function purchaseLeadAction[\s\S]*?(?=export async function applyAdminWalletMutationAction)/)?.[0];
  assert.ok(purchaseAction);
  assert.match(purchaseAction, /leadId: formData\.get\("lead_id"\)/);
  assert.match(purchaseAction, /purchase_idempotency_key: payload\.data\.idempotencyKey/);
  assert.doesNotMatch(purchaseAction, /price_credits|priceCredits|variant_id|experiment_id/);
});
