import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  getProfessionalActivationChecklist,
  getProfessionalActivationStage,
  getProfessionalNextBestAction,
  getProfessionalNotificationPriority,
  type ActivationChecklistItem,
} from "../lib/professionals/activation.ts";

const dashboardSource = readFileSync(new URL("../app/(professional)/vakman/page.tsx", import.meta.url), "utf8");
const requestsSource = readFileSync(new URL("../app/(professional)/vakman/aanvragen/page.tsx", import.meta.url), "utf8");
const detailSource = readFileSync(new URL("../app/(professional)/vakman/aanvragen/[id]/page.tsx", import.meta.url), "utf8");
const creditsSource = readFileSync(new URL("../app/(professional)/vakman/credits/page.tsx", import.meta.url), "utf8");
const notificationsSource = readFileSync(new URL("../app/(professional)/vakman/notificaties/page.tsx", import.meta.url), "utf8");
const purchaseActionSource = readFileSync(new URL("../lib/commercial/actions.ts", import.meta.url), "utf8");

const professional = {
  status: "active" as const,
  onboarding_status: "in_progress" as const,
  verification_status: "unverified" as const,
  verification_status_reason: null,
  missingSteps: ["company"],
  canSubmit: false,
  distributionSettings: { paused: false, pause_until: null, availability_status: "available" as const },
  distributionReadiness: {
    eligible: false,
    reasons: ["Je profiel is nog niet goedgekeurd."],
    activeOffers: 0,
    maxOpenOffers: 5,
    activeAssignments: 0,
    maxActiveAssignments: 12,
  },
  stats: { offersReceived: 0, offersPurchased: 0, assignmentsAccepted: 0, activeOffers: 0 },
  reviewFeedback: [],
};

test("new professionals get a profile completion action using existing onboarding data", () => {
  assert.equal(getProfessionalActivationStage(professional).key, "profile_started");
  assert.equal(getProfessionalNextBestAction(professional).href, "/vakman/onboarding?step=company");
  const profileStep = getProfessionalActivationChecklist(professional).find((item) => item.label === "Profiel");
  assert.equal(profileStep?.status, "action");
});

test("requested changes route directly to their existing onboarding section", () => {
  const changesRequested = {
    ...professional,
    onboarding_status: "changes_requested" as const,
    verification_status: "changes_requested" as const,
    missingSteps: [],
    reviewFeedback: [{ section: "services" as const, status: "open" as const, message: "Selecteer de juiste dienst." }],
  };
  assert.deepEqual(getProfessionalNextBestAction(changesRequested), {
    label: "Pas gevraagde wijzigingen aan",
    href: "/vakman/onboarding?step=services",
    description: "Selecteer de juiste dienst.",
  });
});

test("ready professionals distinguish an empty offer queue from a first offer", () => {
  const ready = {
    ...professional,
    onboarding_status: "approved" as const,
    verification_status: "verified" as const,
    missingSteps: [],
    canSubmit: true,
    distributionReadiness: { ...professional.distributionReadiness, eligible: true, reasons: [] },
  };
  assert.equal(getProfessionalActivationStage(ready).key, "distribution_ready");
  assert.match(getProfessionalNextBestAction(ready).description, /geen open aanbod/);

  const withOffer = { ...ready, stats: { ...ready.stats, offersReceived: 1 } };
  assert.equal(getProfessionalActivationStage(withOffer).key, "first_offer_seen");
  assert.equal(getProfessionalActivationChecklist(withOffer).find((item) => item.label === "Eerste aanvraag")?.status, "complete");
});

test("readiness blockers have specific recovery links and paused capacity remains visible", () => {
  assert.deepEqual(
    getProfessionalNextBestAction({
      ...professional,
      missingSteps: [],
      distributionReadiness: { ...professional.distributionReadiness, reasons: ["Voeg minimaal één werkgebied toe om voor passende aanvragen mee te tellen."] },
    }),
    {
      label: "Werkgebieden beheren",
      href: "/vakman/onboarding?step=areas",
      description: "Voeg minimaal één werkgebied toe om voor passende aanvragen mee te tellen.",
    },
  );
  const paused = {
    ...professional,
    distributionSettings: { paused: true, pause_until: "2026-10-06T12:00:00.000Z", availability_status: "available" as const },
    distributionReadiness: { ...professional.distributionReadiness, reasons: ["Je profiel is gepauzeerd tot morgen."] },
  };
  const capacityItem = getProfessionalActivationChecklist(paused, new Date("2026-10-05T12:00:00.000Z"))
    .find((item: ActivationChecklistItem) => item.label === "Beschikbaarheid en capaciteit");
  assert.equal(capacityItem?.status, "action");
  assert.equal(capacityItem?.href, "/vakman/onboarding?step=capacity");
});

test("activation and professional pages preserve the existing safe readiness and purchase flows", () => {
  assert.match(dashboardSource, /Waarom ontvang ik nog geen aanvragen\?/);
  assert.match(dashboardSource, /getProfessionalActivationChecklist/);
  assert.match(requestsSource, /Je ontvangt nog geen passende aanvragen/);
  assert.match(requestsSource, /Er zijn nu geen passende aanvragen beschikbaar/);
  assert.match(requestsSource, /Je profiel is actief/);
  assert.match(detailSource, /je komt \{formatCredits\(marketLead\.commercial\.priceCredits - marketLead\.commercial\.currentBalance\)\} tekort/);
  assert.match(detailSource, /Een aankoop is geen garantie op een opdracht/);
  assert.match(detailSource, /marketLead\.mode === "unlocked" && marketLead\.detail/);
  assert.match(creditsSource, /geen actieve betaalprovider/);
  assert.match(notificationsSource, /getProfessionalNotificationPriority/);
  assert.match(notificationsSource, /getProfessionalUnreadNotificationCount/);
  assert.match(purchaseActionSource, /purchase_lead/);
  assert.match(purchaseActionSource, /Aankoop bevestigd\. Credits zijn verwerkt/);
});

test("notification urgency uses existing event types and names the next action", () => {
  assert.equal(getProfessionalNotificationPriority("lead_offer_expiring"), "Hoog");
  assert.equal(getProfessionalNotificationPriority("document_expired"), "Hoog");
  assert.equal(getProfessionalNotificationPriority("verification_approved"), "Normaal");
  assert.match(notificationsSource, /Werk voortgang bij/);
  assert.match(notificationsSource, /Documenten beheren/);
});
