import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { getProfessionalDistributionReadiness } from "../lib/professionals/readiness.ts";
import {
  professionalAvailabilityStatusLabels,
  professionalDocumentStatusLabels,
  professionalOnboardingStatusLabels,
  professionalVerificationStatusLabels,
} from "../lib/professionals/labels.ts";
import type { Professional, ProfessionalDistributionSettings } from "../types/database.ts";

const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const activeProfessional = {
  status: "active" as Professional["status"],
  onboarding_status: "approved" as Professional["onboarding_status"],
  verification_status: "verified" as Professional["verification_status"],
  quality_score: 100,
};
const availableSettings: Pick<ProfessionalDistributionSettings, "paused" | "pause_until" | "availability_status" | "max_open_offers" | "max_active_assignments"> = {
  paused: false,
  pause_until: null,
  availability_status: "available",
  max_open_offers: 5,
  max_active_assignments: 12,
};

test("professional status labels match existing backend statuses", () => {
  assert.equal(professionalOnboardingStatusLabels.not_started, "Niet gestart");
  assert.equal(professionalOnboardingStatusLabels.changes_requested, "Aanpassingen gevraagd");
  assert.equal(professionalVerificationStatusLabels.pending, "In behandeling");
  assert.equal(professionalVerificationStatusLabels.verified, "Goedgekeurd");
  assert.equal(professionalVerificationStatusLabels.suspended, "Geschorst");
  assert.equal(professionalAvailabilityStatusLabels.limited, "Beperkt beschikbaar");
  assert.equal(professionalDocumentStatusLabels.expired, "Verlopen");
});

test("distribution readiness uses the existing eligibility rules and explains blockers", () => {
  const ready = getProfessionalDistributionReadiness(activeProfessional, availableSettings, { activeOffers: 0, activeAssignments: 0 }, 1, 1);
  assert.equal(ready.eligible, true);
  assert.deepEqual(ready.reasons, []);

  const limited = getProfessionalDistributionReadiness(
    activeProfessional,
    { ...availableSettings, availability_status: "limited" },
    { activeOffers: 0, activeAssignments: 0 },
    1,
    1,
  );
  assert.equal(limited.eligible, false);
  assert.ok(limited.reasons.some((reason) => reason.includes("Beperkt beschikbaar")));

  const atCapacity = getProfessionalDistributionReadiness(activeProfessional, availableSettings, { activeOffers: 5, activeAssignments: 12 }, 1, 1);
  assert.equal(atCapacity.eligible, false);
  assert.ok(atCapacity.reasons.includes("Je maximum aantal open aanbiedingen is bereikt."));
  assert.ok(atCapacity.reasons.includes("Je maximum aantal actieve opdrachten is bereikt."));

  const changesRequested = getProfessionalDistributionReadiness(
    { ...activeProfessional, verification_status: "changes_requested", onboarding_status: "changes_requested" },
    availableSettings,
    { activeOffers: 0, activeAssignments: 0 },
    1,
    1,
  );
  assert.equal(changesRequested.eligible, false);
  assert.ok(changesRequested.reasons.includes("Je profiel is nog niet goedgekeurd."));
  assert.ok(changesRequested.reasons.includes("Je verificatie is nog niet goedgekeurd."));

  const missingServiceAndArea = getProfessionalDistributionReadiness(activeProfessional, availableSettings, { activeOffers: 0, activeAssignments: 0 }, 0, 0);
  assert.equal(missingServiceAndArea.eligible, false);
  assert.equal(missingServiceAndArea.reasons.length, 2);
});

test("dashboard prioritizes one action and presents profile quality and capacity", () => {
  const dashboard = source("app/(professional)/vakman/page.tsx");
  assert.match(dashboard, /Belangrijkste vervolgstap/);
  assert.match(dashboard, /href=\{nextAction\.href\}/);
  assert.match(dashboard, /ProfessionalQualitySummary/);
  assert.match(dashboard, /activeOffers/);
  assert.match(dashboard, /activeAssignments/);
  assert.match(dashboard, /actieve dienst, het werkgebied en de beschikbare capaciteit/);
});

test("onboarding retains server-side submit readiness and shows step/document guidance", () => {
  const onboarding = source("app/(professional)/vakman/onboarding/page.tsx");
  assert.match(onboarding, /disabled=\{!professional\.canSubmit\}/);
  assert.match(onboarding, /professionalOnboardingSteps\.map/);
  assert.match(onboarding, /aria-current/);
  assert.match(onboarding, /professionalDocumentStatusLabels/);
  assert.match(onboarding, /professional\.verification_status === "changes_requested"/);
  assert.match(onboarding, /PDF, JPG of PNG; maximaal 10 MB/);
  assert.match(onboarding, /niet openbaar zichtbaar/);
  assert.match(onboarding, /document\.verification_status === "expired"/);
});

test("requests use responsive cards without exposing ranking scores or pre-purchase contact data", () => {
  const requests = source("app/(professional)/vakman/aanvragen/page.tsx");
  const detail = source("app/(professional)/vakman/aanvragen/[id]/page.tsx");
  assert.doesNotMatch(requests, /<table|leadScore|Leadscore/);
  assert.match(requests, /Verloopt binnenkort/);
  assert.match(requests, /Er zijn nu geen passende aanvragen beschikbaar/);
  assert.match(detail, /marketLead\.mode === "unlocked" && marketLead\.detail/);
  assert.match(detail, /Contactgegevens blijven verborgen tot een geldige aankoop/);
  assert.doesNotMatch(detail, /preview\.leadScore|Leadscore/);
});

test("notifications and preferences stay in-app, categorized, and actionable", () => {
  const notifications = source("app/(professional)/vakman/notificaties/page.tsx");
  const settings = source("app/(professional)/vakman/instellingen/notificaties/page.tsx");
  assert.match(notifications, /categoryLabel/);
  assert.match(notifications, /fallbackHref/);
  assert.match(notifications, /Ongelezen/);
  assert.match(notifications, /aria-disabled/);
  assert.match(settings, /in_app_enabled/);
  assert.match(settings, /Alleen in-app notificaties zijn actief/);
  assert.doesNotMatch(settings, /type="checkbox" disabled/);
});

test("professional route loading and errors use non-technical copy", () => {
  assert.match(source("app/(professional)/vakman/loading.tsx"), /wordt geladen/);
  assert.match(source("app/(professional)/vakman/error.tsx"), /Deze pagina kon niet worden geladen/);
  assert.doesNotMatch(source("app/(professional)/vakman/error.tsx"), /error\.message|error\.digest/);
});
