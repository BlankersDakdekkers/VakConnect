import assert from "node:assert/strict";
import test from "node:test";
import {
  genericLeadSubmissionErrorMessage,
  LeadSubmissionError,
  resolveLeadSubmissionError,
} from "../lib/leads/errors.ts";

test("resolveLeadSubmissionError keeps validation messages for public errors", () => {
  const result = resolveLeadSubmissionError(new LeadSubmissionError("Ongeldige invoer.", 400));
  assert.equal(result.statusCode, 400);
  assert.equal(result.message, "Ongeldige invoer.");
});

test("resolveLeadSubmissionError hides internal details for server errors", () => {
  const known = resolveLeadSubmissionError(new LeadSubmissionError("Database exploded", 500));
  assert.equal(known.statusCode, 500);
  assert.equal(known.message, genericLeadSubmissionErrorMessage);

  const unknown = resolveLeadSubmissionError(new Error("Sensitive details"));
  assert.equal(unknown.statusCode, 500);
  assert.equal(unknown.message, genericLeadSubmissionErrorMessage);
});
