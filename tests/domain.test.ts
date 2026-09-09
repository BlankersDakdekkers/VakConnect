import assert from "node:assert/strict";
import test from "node:test";
import { scoreLead } from "../lib/leads/scoring/index.ts";
import { evaluateProfessionalMatch, isProfessionalEligibleForLead } from "../lib/matching/eligibility.ts";
import { validateDynamicAnswers } from "../lib/validation/dynamic.ts";
import { formatPostalCode, getPostalCodePrefix, normalizePostalCode } from "../lib/utils.ts";

const baseQuestion = {
  service_id: "11111111-1111-4111-8111-111111111111",
  created_at: "2026-09-09T00:00:00.000Z",
  updated_at: "2026-09-09T00:00:00.000Z",
  help_text: null,
  active: true,
};

test("normalizePostalCode removes spaces and uppercases", () => {
  assert.equal(normalizePostalCode("4811 ab"), "4811AB");
});

test("formatPostalCode formats Dutch postal code with space", () => {
  assert.equal(formatPostalCode("4811ab"), "4811 AB");
});

test("getPostalCodePrefix returns four-digit prefix", () => {
  assert.equal(getPostalCodePrefix("4811 AB"), "4811");
});

test("validateDynamicAnswers enforces required and option-backed questions", () => {
  const questions = [
    {
      ...baseQuestion,
      id: "22222222-2222-4222-8222-222222222222",
      question: "Wat voor dak heeft de woning?",
      slug: "daktype-woning",
      type: "radio" as const,
      required: true,
      sort_order: 10,
      options: [
        {
          id: "33333333-3333-4333-8333-333333333333",
          question_id: "22222222-2222-4222-8222-222222222222",
          label: "Plat dak",
          value: "plat-dak",
          sort_order: 10,
          active: true,
          created_at: "2026-09-09T00:00:00.000Z",
        },
      ],
    },
    {
      ...baseQuestion,
      id: "44444444-4444-4444-8444-444444444444",
      question: "Geschatte oppervlakte in m²",
      slug: "geschatte-oppervlakte",
      type: "number" as const,
      required: false,
      sort_order: 20,
      options: [],
    },
  ];

  const valid = validateDynamicAnswers(questions, {
    "22222222-2222-4222-8222-222222222222": "plat-dak",
    "44444444-4444-4444-8444-444444444444": "24.5",
  });
  assert.equal(valid.success, true);

  const missingRequired = validateDynamicAnswers(questions, {
    "22222222-2222-4222-8222-222222222222": "",
  });
  assert.equal(missingRequired.success, false);

  const invalidOption = validateDynamicAnswers(questions, {
    "22222222-2222-4222-8222-222222222222": "onbekend",
  });
  assert.equal(invalidOption.success, false);
});

test("scoreLead clamps between 0 and 100 and rewards completeness", () => {
  const complete = scoreLead({
    contactFieldsCompleted: 4,
    addressFieldsCompleted: 2,
    descriptionLength: 240,
    imageCount: 3,
    requiredQuestionsCount: 3,
    requiredQuestionsAnswered: 3,
    answeredQuestionCount: 4,
    totalQuestionCount: 4,
    preferredTimingProvided: true,
  });
  assert.equal(complete.score, 100);

  const minimal = scoreLead({
    contactFieldsCompleted: 0,
    addressFieldsCompleted: 0,
    descriptionLength: 0,
    imageCount: 0,
    requiredQuestionsCount: 2,
    requiredQuestionsAnswered: 0,
    answeredQuestionCount: 0,
    totalQuestionCount: 2,
    preferredTimingProvided: false,
  });
  assert.equal(minimal.score, 0);
});

test("matching eligibility requires active status, active service link and postcode prefix match", () => {
  const candidate = {
    professionalId: "55555555-5555-4555-8555-555555555555",
    companyName: "Dakdekker Breda",
    contactName: "Jan Jansen",
    email: "jan@example.com",
    phone: "0612345678",
    status: "active" as const,
    serviceLinks: [{ serviceId: "66666666-6666-4666-8666-666666666666", active: true }],
    postalCodePrefixes: ["4811", "4812"],
  };

  assert.equal(
    isProfessionalEligibleForLead(candidate, {
      leadId: "lead-1",
      serviceId: "66666666-6666-4666-8666-666666666666",
      postalCode: "4811 AB",
    }),
    true,
  );
  assert.equal(
    isProfessionalEligibleForLead({ ...candidate, status: "paused" }, {
      leadId: "lead-1",
      serviceId: "66666666-6666-4666-8666-666666666666",
      postalCode: "4811 AB",
    }),
    false,
  );
  assert.equal(
    isProfessionalEligibleForLead({ ...candidate, serviceLinks: [{ serviceId: "66666666-6666-4666-8666-666666666666", active: false }] }, {
      leadId: "lead-1",
      serviceId: "66666666-6666-4666-8666-666666666666",
      postalCode: "4811 AB",
    }),
    false,
  );
});

test("evaluateProfessionalMatch explains postcode mismatch", () => {
  const result = evaluateProfessionalMatch(
    {
      professionalId: "77777777-7777-4777-8777-777777777777",
      companyName: "Dakdekker Tilburg",
      contactName: "Piet Pieters",
      email: "piet@example.com",
      phone: "0687654321",
      status: "active",
      serviceLinks: [{ serviceId: "88888888-8888-4888-8888-888888888888", active: true }],
      postalCodePrefixes: ["5038"],
    },
    {
      serviceId: "88888888-8888-4888-8888-888888888888",
      postalCode: "4811 AB",
    },
  );

  assert.equal(result.eligible, false);
  assert.equal(result.matchScore, 75);
  assert.equal(result.reasons.find((reason) => reason.code === "postcode_prefix_match")?.passed, false);
});
