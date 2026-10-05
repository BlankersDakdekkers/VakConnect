import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
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

const ownerId = "d4d61d77-382e-4d73-90a6-cb3c86b7cbf1";
const storedAssignment = {
  id: "3f3c27c3-a66a-4fd2-bc1a-eef75d9bce30", professional_id: ownerId, status: "accepted",
  progress_status: "quote_sent", reachability: "reached" as string | null, appointment_status: "completed",
  loss_reason: null, mismatch_reason: "other" as string | null, feedback_note: "Eerder besproken." as string | null,
};

function loadProgressAction(assignment = storedAssignment) {
  const compiledModule = { exports: {} as Record<string, (formData: FormData) => Promise<never>> };
  const require = createRequire(new URL("../lib/leads/actions.ts", import.meta.url));
  const rpcCalls: { name: string; payload: Record<string, unknown> }[] = [];
  const ownerFilters: string[] = [];
  const query = {
    select: () => query,
    eq: (column: string, value: string) => {
      if (column === "professional_id") ownerFilters.push(value);
      return query;
    },
    maybeSingle: async () => ({ data: assignment, error: null }),
  };
  const client = {
    from: (table: string) => {
      assert.equal(table, "lead_assignments");
      return query;
    },
    rpc: async (name: string, payload: Record<string, unknown>) => {
      rpcCalls.push({ name, payload });
      return { error: null };
    },
  };
  const compiled = ts.transpileModule(readFileSync(new URL("../lib/leads/actions.ts", import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  runInNewContext(compiled, {
    module: compiledModule, exports: compiledModule.exports, URLSearchParams,
    require: (specifier: string) => {
      switch (specifier) {
        case "next/cache": return { revalidatePath: () => {} };
        case "next/navigation": return { redirect: (url: string) => { throw new Error(`REDIRECT:${url}`); } };
        case "@/lib/auth/helpers": return { requireProfessionalUser: async () => ({ id: ownerId, professional: { id: ownerId } }) };
        case "@/lib/supabase/server": return { createServerSupabaseClient: async () => client };
        case "@/lib/supabase/admin": return { createAdminSupabaseClient: () => { throw new Error("Unexpected elevated client"); } };
        case "@/lib/validation/leads": return require("../validation/leads.ts");
        case "@/lib/leads/activity": return { addLeadActivity: () => { throw new Error("Unexpected application audit write"); } };
        case "@/lib/auth/ownership": return require("../auth/ownership.ts");
        case "@/lib/leads/progress": return require("./progress.ts");
        case "@/lib/leads/quality-taxonomy": return require("./quality-taxonomy.ts");
        default: throw new Error(`Unexpected import ${specifier}`);
      }
    },
  });
  return { action: compiledModule.exports.updateLeadProgressAction, rpcCalls, ownerFilters };
}

function progressForm(progress: string) {
  const form = new FormData();
  form.set("lead_id", valid.leadId);
  form.set("progress_status", progress);
  form.set("expected_updated_at", valid.expectedUpdatedAt);
  form.set("redirect_to", valid.redirectTo);
  return form;
}

test("Prompt 28 actual server action preserves omitted stored quality fields when winning", async () => {
  const { action, rpcCalls, ownerFilters } = loadProgressAction();
  await assert.rejects(action(progressForm("won")), /REDIRECT:.*success=/);
  assert.deepEqual(ownerFilters, [ownerId]);
  assert.equal(rpcCalls.length, 1);
  assert.equal(rpcCalls[0].name, "update_assignment_quality");
  assert.equal(rpcCalls[0].payload.p_expected_updated_at, valid.expectedUpdatedAt);
  assert.equal(rpcCalls[0].payload.p_reachability, "reached");
  assert.equal(rpcCalls[0].payload.p_appointment_status, "completed");
  assert.equal(rpcCalls[0].payload.p_mismatch_reason, "other");
  assert.equal(rpcCalls[0].payload.p_feedback_note, "Eerder besproken.");
});

test("Prompt 28 actual server action saves question-free first contact and optional early loss", async () => {
  for (const [from, to] of [["new", "contacted"], ["contacted", "lost"]]) {
    const { action, rpcCalls } = loadProgressAction({
      ...storedAssignment, progress_status: from, reachability: null, appointment_status: "not_scheduled",
      mismatch_reason: null, feedback_note: null,
    });
    await assert.rejects(action(progressForm(to)), /REDIRECT:.*success=/);
    assert.equal(rpcCalls.length, 1);
    assert.equal(rpcCalls[0].payload.p_reachability, null);
    assert.equal(rpcCalls[0].payload.p_appointment_status, "not_scheduled");
    assert.equal(rpcCalls[0].payload.p_loss_reason, null);
  }
});

test("Prompt 28 actual server action never merges another professional's data or invents reached", async () => {
  const foreign = loadProgressAction({ ...storedAssignment, professional_id: valid.leadId });
  await assert.rejects(foreign.action(progressForm("won")), /REDIRECT:.*error=/);
  assert.equal(foreign.rpcCalls.length, 0);
  const historical = loadProgressAction({ ...storedAssignment, reachability: null });
  await assert.rejects(historical.action(progressForm("won")), /REDIRECT:.*error=/);
  assert.equal(historical.rpcCalls.length, 0);
});
