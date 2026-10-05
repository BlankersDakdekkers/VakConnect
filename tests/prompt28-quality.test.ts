import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import {
  assignmentQualityUpdateSchema,
  assignmentRejectionFeedbackSchema,
  leadAppointmentStatusLabels,
  leadAppointmentStatusValues,
  leadMismatchReasonLabels,
  leadMismatchReasonValues,
  leadQualityLossReasonLabels,
  leadQualityLossReasonValues,
  leadReachabilityLabels,
  leadReachabilityValues,
} from "../lib/leads/quality-taxonomy.ts";
import { leadLossReasonValues } from "../lib/validation/constants.ts";

const valid = {
  leadId: "cd3ae68f-287e-4f3b-a7b9-c98231d4aaff",
  expectedUpdatedAt: "2026-10-05T17:00:00.123456+00:00",
  progressStatus: "contacted",
  reachability: "no_answer",
  appointmentStatus: "not_scheduled",
  lossReason: null,
  mismatchReason: null,
  feedbackNote: null,
  redirectTo: "/vakman/aanvragen",
};

test("Prompt 28 taxonomies preserve Dutch loss reasons and label every structured value", () => {
  for (const value of leadLossReasonValues) assert.ok(leadQualityLossReasonValues.includes(value));
  assert.equal(leadQualityLossReasonValues.filter((value) => String(value) === "other").length, 0);
  for (const [values, labels] of [
    [leadReachabilityValues, leadReachabilityLabels],
    [leadAppointmentStatusValues, leadAppointmentStatusLabels],
    [leadQualityLossReasonValues, leadQualityLossReasonLabels],
    [leadMismatchReasonValues, leadMismatchReasonLabels],
  ] as const) {
    assert.equal(new Set(values).size, values.length);
    for (const value of values) assert.ok((labels as Record<string, string>)[value]);
  }
});

test("Prompt 28 validates expected version, structured reasons and safe redirects", () => {
  assert.ok(assignmentQualityUpdateSchema.safeParse(valid).success);
  for (const change of [
    { expectedUpdatedAt: null }, { expectedUpdatedAt: "yesterday" }, { reachability: "unknown" },
    { appointmentStatus: "unknown" }, { lossReason: "other" }, { mismatchReason: "unknown" },
    { redirectTo: "//example.org" }, { redirectTo: "/vakman//example.org" }, { redirectTo: "/vakman\\example.org" },
    { redirectTo: "/vakman-evil" },
  ]) assert.equal(assignmentQualityUpdateSchema.safeParse({ ...valid, ...change }).success, false);
  assert.ok(assignmentQualityUpdateSchema.safeParse({ ...valid, progressStatus: "lost", lossReason: "wrong_region" }).success);
  assert.ok(assignmentQualityUpdateSchema.safeParse({ ...valid, progressStatus: "lost", lossReason: null }).success);
});

test("Prompt 28 free text is short and only accompanies Anders", () => {
  assert.equal(assignmentQualityUpdateSchema.safeParse({ ...valid, feedbackNote: "Een toelichting" }).success, false);
  assert.ok(assignmentQualityUpdateSchema.safeParse({ ...valid, mismatchReason: "other", feedbackNote: "a".repeat(500) }).success);
  assert.equal(assignmentQualityUpdateSchema.safeParse({ ...valid, mismatchReason: "other", feedbackNote: "a".repeat(501) }).success, false);
  assert.ok(assignmentQualityUpdateSchema.safeParse({ ...valid, progressStatus: "lost", lossReason: "anders", feedbackNote: "Anders" }).success);
  assert.equal(assignmentRejectionFeedbackSchema.safeParse({ mismatchReason: "wrong_region", feedbackNote: "tekst" }).success, false);
  assert.ok(assignmentRejectionFeedbackSchema.safeParse({ mismatchReason: "other", feedbackNote: "tekst" }).success);
  assert.equal(assignmentQualityUpdateSchema.parse({ ...valid, feedbackNote: "  " }).feedbackNote, null);
});

test("Prompt 28 rejects contradictory contact and appointment outcomes", () => {
  for (const change of [
    { appointmentStatus: "scheduled" }, { appointmentStatus: "completed" },
    { progressStatus: "quote_sent" }, { progressStatus: "won" },
    { progressStatus: "appointment_scheduled", reachability: "reached" },
    { progressStatus: "new" },
  ]) assert.equal(assignmentQualityUpdateSchema.safeParse({ ...valid, ...change }).success, false);
  assert.ok(assignmentQualityUpdateSchema.safeParse({
    ...valid, progressStatus: "appointment_scheduled", reachability: "reached", appointmentStatus: "scheduled",
  }).success);
  assert.ok(assignmentQualityUpdateSchema.safeParse({
    ...valid, progressStatus: "won", reachability: "reached", appointmentStatus: "completed",
  }).success);
});

test("Prompt 28 progress action uses invoker RPC, not global lead outcomes or client audit writes", () => {
  const source = readFileSync(new URL("../lib/leads/actions.ts", import.meta.url), "utf8")
    .split("export async function updateLeadProgressAction")[1];
  assert.ok(source.includes('rpc("update_assignment_quality"'));
  assert.ok(source.includes('formData.get("expected_updated_at")'));
  assert.equal(source.includes('.from("leads")'), false);
  assert.equal(source.includes("addLeadActivity"), false);
  assert.equal(source.includes('.from("lead_assignments")\n    .update'), false);
});
