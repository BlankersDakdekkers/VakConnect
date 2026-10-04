import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { funnelEventNames, leadFunnelSteps } from "../lib/analytics/events.ts";
import { leadSubmissionSchema } from "../lib/validation/leads.ts";

const formSource = readFileSync(new URL("../components/forms/lead-request-form.tsx", import.meta.url), "utf8");
const confirmationSource = readFileSync(new URL("../app/(public)/aanvraag/bedankt/page.tsx", import.meta.url), "utf8");

test("Prompt 22 keeps the seven analytics step identifiers and funnel events stable", () => {
  assert.deepEqual(leadFunnelSteps, ["service", "questions", "location", "details", "photos", "contact", "review"]);
  assert.equal(funnelEventNames.leadFunnelStarted, "lead_funnel_started");
  assert.equal(funnelEventNames.leadFunnelStepViewed, "lead_funnel_step_viewed");
  assert.equal(funnelEventNames.leadFunnelStepCompleted, "lead_funnel_step_completed");
  assert.equal(funnelEventNames.leadFunnelValidationError, "lead_funnel_validation_error");
  assert.equal(funnelEventNames.leadFunnelBack, "lead_funnel_back");
  assert.match(formSource, /requestExperimentAssignment\("lead\.progress\.copy"/);
});

test("invalid postcodes receive a clear example without changing accepted formats", () => {
  const result = leadSubmissionSchema.safeParse({
    serviceId: "123e4567-e89b-42d3-a456-426614174000",
    postalCode: "ongeldig",
    houseNumber: "1",
    houseNumberAddition: "",
    description: "Ik wil graag een lekkage laten onderzoeken.",
    urgency: "normal",
    preferredTiming: "unknown",
    firstName: "Sam",
    lastName: "Test",
    phone: "0612345678",
    email: "sam@example.com",
  });

  assert.equal(result.success, false);
  if (!result.success) {
    assert.equal(result.error.issues.find((issue) => issue.path[0] === "postalCode")?.message, "Vul een geldige postcode in, bijvoorbeeld 1234 AB.");
  }
  assert.equal(leadSubmissionSchema.safeParse({
    serviceId: "123e4567-e89b-42d3-a456-426614174000",
    postalCode: "1234 AB",
    houseNumber: "1",
    houseNumberAddition: "",
    description: "Ik wil graag een lekkage laten onderzoeken.",
    urgency: "normal",
    preferredTiming: "unknown",
    firstName: "Sam",
    lastName: "Test",
    phone: "0612345678",
    email: "sam@example.com",
  }).success, true);
});

test("the review step allows editing, prevents duplicate submission, and announces progress", () => {
  for (const copy of ["Wijzig dienst", "Wijzig antwoorden", "Wijzig locatie", "Wijzig klus", "Wijzig foto&apos;s", "Wijzig contact"]) {
    assert.ok(formSource.includes(copy), `Expected review edit action: ${copy}`);
  }
  assert.match(formSource, /if \(submittingRef\.current\) return/);
  assert.match(formSource, /Aanvraag wordt verstuurd…/);
  assert.match(formSource, /aria-valuetext=\{`Stap \$\{currentStep \+ 1\} van \$\{stepTitles\.length\}: \$\{stepTitles\[currentStep\]\}`\}/);
});

test("the confirmation explains conditional follow-up without promising a response time", () => {
  assert.match(confirmationSource, /Publieke aanvraagreferentie/);
  assert.match(confirmationSource, /hangt af van de dienst, regio en beschikbaarheid/);
  assert.match(confirmationSource, /Terug naar homepage/);
  assert.doesNotMatch(confirmationSource, /binnen 24 uur|vandaag nog contact/i);
});
