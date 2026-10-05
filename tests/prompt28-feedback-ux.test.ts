import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import test from "node:test";
import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { declineReasonValues, professionalOfferDeclineSchema } from "../lib/validation/distribution.ts";
import { assignmentQualityUpdateSchema } from "../lib/leads/quality-taxonomy.ts";

const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const page = source("app/(professional)/vakman/aanvragen/[id]/page.tsx");
const form = source("components/leads/quality-feedback-form.tsx");

function loadTsx(path: string, selectedProgress?: string): Record<string, unknown> {
  const compiledModule = { exports: {} };
  const require = createRequire(new URL(`../${path}`, import.meta.url));
  let stateIndex = 0;
  const compiled = ts.transpileModule(source(path), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
    fileName: path,
  }).outputText;
  runInNewContext(compiled, {
    module: compiledModule,
    exports: compiledModule.exports,
    require: (specifier: string) => {
      if (specifier === "react" && selectedProgress) {
        const react = require("react");
        return { ...react, useState: (initial: unknown) => react.useState(stateIndex++ === 0 ? selectedProgress : initial) };
      }
      if (!specifier.startsWith("@/")) return require(specifier);
      const target = specifier.slice(2);
      return loadTsx(existsSync(new URL(`../${target}.tsx`, import.meta.url)) ? `${target}.tsx` : `${target}.ts`);
    },
  });
  return compiledModule.exports;
}

const QualityFeedbackForm = loadTsx("components/leads/quality-feedback-form.tsx").QualityFeedbackForm as ComponentType<Record<string, unknown>>;
const renderForm = (props: Record<string, unknown>, selectedProgress?: string) => renderToStaticMarkup(createElement(
  selectedProgress ? loadTsx("components/leads/quality-feedback-form.tsx", selectedProgress).QualityFeedbackForm as ComponentType<Record<string, unknown>> : QualityFeedbackForm, {
  action: async () => {},
  mode: "progress",
  leadId: "11111111-1111-4111-8111-111111111111",
  expectedUpdatedAt: "2026-10-05T12:00:00.000Z",
  ...props,
}, createElement("select", { name: "progress_status", defaultValue: selectedProgress ?? props.currentProgress }, createElement("option", { value: (selectedProgress ?? props.currentProgress) as string }, "Voortgang"))));

function renderedFields(markup: string) {
  const fields = new Map<string, string>();
  const add = (name: string, value: string) => {
    assert.equal(fields.has(name), false, `Duplicate successful field ${name}`);
    fields.set(name, value);
  };
  for (const [tag] of markup.matchAll(/<input\b[^>]*>/g)) {
    if (!tag.includes('type="hidden"') && !tag.includes('checked=""')) continue;
    const name = tag.match(/name="([^"]+)"/)?.[1];
    if (name) add(name, tag.match(/value="([^"]*)"/)?.[1] ?? "");
  }
  for (const [, name, options] of markup.matchAll(/<select\b[^>]*name="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)) {
    const selected = [...options.matchAll(/<option\b[^>]*>/g)].find(([tag]) => tag.includes('selected=""'))?.[0];
    add(name, (selected ?? options).match(/value="([^"]*)"/)?.[1] ?? "");
  }
  for (const [, name, value] of markup.matchAll(/<textarea\b[^>]*name="([^"]+)"[^>]*>([\s\S]*?)<\/textarea>/g)) add(name, value);
  return fields;
}

const qualityPayload = (fields: Map<string, string>) => ({
  leadId: fields.get("lead_id"), progressStatus: fields.get("progress_status"),
  expectedUpdatedAt: fields.get("expected_updated_at"), reachability: fields.get("reachability"),
  appointmentStatus: fields.get("appointment_status"), lossReason: fields.get("loss_reason"),
  mismatchReason: fields.get("mismatch_reason"), feedbackNote: fields.get("feedback_note"),
  redirectTo: fields.get("redirect_to"),
});

test("rendered forms keep won/lost outcomes locked and a fresh lead question-free", () => {
  for (const currentProgress of ["won", "lost"]) {
    const markup = renderForm({ currentProgress });
    assert.match(markup, /Deze uitkomst is definitief/);
    assert.doesNotMatch(markup, /<form|<input|<textarea|<select|<button/);
  }
  const fresh = renderForm({ currentProgress: "new" });
  assert.doesNotMatch(fresh, /<fieldset|<textarea|id="mismatch-reason"/);
  assert.match(fresh, /name="expected_updated_at" value="2026-10-05T12:00:00.000Z"/);
});

test("rendered contact, appointment, loss and rejection fields preserve structured defaults", () => {
  const contacted = renderForm({ currentProgress: "contacted", reachability: "no_answer" });
  assert.match(contacted, /type="radio"[^>]*name="reachability"[^>]*checked=""[^>]*value="no_answer"/);
  assert.match(contacted, /type="hidden" name="appointment_status" value="not_scheduled"/);
  assert.match(contacted, /id="mismatch-reason"/);
  const appointment = renderForm({ currentProgress: "appointment_scheduled", appointmentStatus: "scheduled" });
  assert.match(appointment, /name="appointment_status"/);
  const rejection = renderForm({ mode: "rejection", mismatchReason: "other", feedbackNote: "Past niet." });
  assert.match(rejection, /name="mismatch_reason"/);
  assert.match(rejection, /name="feedback_note"/);
  assert.match(rejection, /Past niet\./);
  assert.doesNotMatch(rejection, /name="reachability"|name="appointment_status"/);
  assert.doesNotMatch(renderForm({ mode: "rejection", mismatchReason: "wrong_service" }), /<textarea/);
});

test("actual rendered normal contact form satisfies the backend quality contract without optional answers", () => {
  const fields = renderedFields(renderForm({ currentProgress: "new" }, "contacted"));
  assert.equal(fields.get("reachability"), "");
  assert.equal(fields.get("appointment_status"), "not_scheduled");
  assert.equal(assignmentQualityUpdateSchema.safeParse(qualityPayload(fields)).success, true);
  assert.ok(source("lib/leads/actions.ts").includes('formData.get("expected_updated_at")'), "Backend must read the same expected_updated_at field rendered by the UI");
});

test("actual rendered winning submission preserves stored quality without asking or duplicating fields", () => {
  const markup = renderForm({
    currentProgress: "quote_sent", reachability: "reached", appointmentStatus: "completed",
    mismatchReason: "other", feedbackNote: "Already discussed.",
  }, "won");
  const fields = renderedFields(markup);
  assert.equal(fields.get("reachability"), "reached");
  assert.equal(fields.get("appointment_status"), "completed");
  assert.equal(fields.get("mismatch_reason"), "other");
  assert.equal(fields.get("feedback_note"), "Already discussed.");
  assert.doesNotMatch(markup, /<fieldset|<textarea|<details/);
  assert.equal(assignmentQualityUpdateSchema.safeParse(qualityPayload(fields)).success, true);
});

test("appointment saving requires an explicit reached answer rather than silently inferring it", () => {
  const missing = renderForm({ currentProgress: "appointment_scheduled", appointmentStatus: "scheduled" });
  assert.match(missing, /Er wordt niets automatisch ingevuld/);
  assert.match(missing, /disabled=""/);
  assert.equal(assignmentQualityUpdateSchema.safeParse(qualityPayload(renderedFields(missing))).success, false);
  const complete = renderedFields(renderForm({ currentProgress: "appointment_scheduled", appointmentStatus: "scheduled", reachability: "reached" }));
  assert.equal(assignmentQualityUpdateSchema.safeParse(qualityPayload(complete)).success, true);
});

test("declining an offer never requires or invents a quality reason", () => {
  const input = { candidateId: "11111111-1111-4111-8111-111111111111", redirectTo: "/vakman/aanvragen/lead" };
  for (const reason of [undefined, "", null]) {
    const result = professionalOfferDeclineSchema.safeParse({ ...input, reason });
    assert.equal(result.success, true);
    if (result.success) assert.equal(result.data.reason, undefined);
  }
  for (const reason of declineReasonValues) {
    assert.equal(professionalOfferDeclineSchema.safeParse({ ...input, reason }).success, true);
  }
  for (const reason of ["free text", "customer@example.com", "constructor"]) {
    assert.equal(professionalOfferDeclineSchema.safeParse({ ...input, reason }).success, false);
  }
  assert.match(page, /id="decline-reason" name="reason" defaultValue=""/);
  assert.match(page, /Geen reden opgeven/);
});

test("all optional mismatch reasons are structured and legacy decline values remain accepted", () => {
  for (const reason of ["te_ver", "geen_capaciteit", "klus_past_niet", "prijs_te_hoog", "timing_past_niet", "anders", "wrong_service", "wrong_region", "incorrect_information", "already_completed", "duplicate", "unreachable", "invalid_contact", "profile_mismatch"]) {
    assert.ok((declineReasonValues as readonly string[]).includes(reason));
  }
  assert.match(form, /@\/lib\/leads\/quality-taxonomy/);
  assert.match(form, /mismatchReasonValues\.map/);
  const engine = source("lib/distribution/engine.ts").split("export async function declineDistributionOffer")[1].split("export async function markDistributionOfferViewed")[0];
  assert.match(engine, /decline_reason: reason \?\? null/);
  assert.match(engine, /\.eq\("id", candidateId\)/);
  assert.match(engine, /\.eq\("professional_id", professionalId\)/);
  assert.match(engine, /\.eq\("status", candidate\.status\)/);
  assert.match(engine, /if \(error \|\| !declined\)/);
  assert.equal((engine.match(/activateOffersForRun/g) ?? []).length, 1);
});

test("quality questions are conditional, optional and terminal outcomes are read-only", () => {
  assert.match(form, /const showContact = .* \["contacted", "appointment_scheduled", "quote_sent", "lost"\]\.includes\(progress\)/);
  assert.match(form, /const showLoss = .*progress === "lost"/);
  assert.match(form, /\{showLoss \? lossReasonField : null\}/);
  assert.match(form, /\{showContact \?/);
  assert.match(form, /if \(terminal\)/);
  assert.match(page, /\["won", "lost"\]\.includes\(marketLead\.detail\.assignmentProgressStatus\) \? \(/);
  assert.match(page, /Voortgang afgerond/);
  assert.doesNotMatch(form, /\brequired[=\s>]/);
  assert.match(form, /name="expected_updated_at"/);
  assert.match(page, /expectedUpdatedAt=\{marketLead\.detail\.qualityUpdatedAt\}/);
  assert.match(page, /expectedUpdatedAt=\{marketLead\.assignment\.qualityUpdatedAt\}/);
});

test("free text only appears for other reasons and is privacy-limited", () => {
  assert.match(form, /mismatch === "other" \|\| \(showLoss && loss === "anders"\)/);
  assert.match(form, /\{showNote \?/);
  assert.match(form, /name="feedback_note".*maxLength=\{500\}/);
  assert.match(form, /Vermeld geen contactgegevens of andere persoonsgegevens/);
  assert.match(form, /geen refundverzoek/);
  assert.match(form, /verandert niets aan je credits of aankooprecht/);
  assert.doesNotMatch(form, /dialog|window\.confirm|createPortal/);
});

test("feedback stays accessible and narrow-screen friendly while contact and purchase safeguards remain", () => {
  assert.match(form, /<fieldset className="min-w-0/);
  assert.match(form, /<legend/);
  assert.match(form, /type="radio".*name=\{name\}/);
  assert.match(form, /min-h-11/);
  assert.match(form, /break-words/);
  assert.match(form, /focus-within:outline/);
  assert.match(form, /aria-describedby="feedback-note-help"/);
  assert.match(page, /marketLead\.mode === "unlocked" && marketLead\.detail/);
  assert.match(page, /!marketLead\.distributionOffer\.offerTermExpired/);
  assert.match(page, /disabled=\{marketLead\.state !== "available" \|\| marketLead\.commercial\.balanceAfterPurchase < 0 \|\| !canPurchaseFromOffer\}/);
  assert.match(page, /htmlFor="progress-status"/);
  assert.match(page, /htmlFor="loss-reason"/);
  assert.match(page, /Jouw opvolging/);
});

test("milestones and concurrency token are read from the owner's assignment", () => {
  const query = source("lib/leads/queries.ts").split("export async function getProfessionalLeadDetail")[1];
  for (const column of ["quality_updated_at", "reachability", "appointment_status", "mismatch_reason", "feedback_note", "contacted_at", "reached_at", "appointment_scheduled_at", "outcome_at"]) {
    assert.ok(query.includes(column));
  }
  assert.match(query, /\.eq\("professional_id", professionalId\)/);
  assert.match(source("lib/commercial/queries.ts"), /select\("id, status, lead_purchase_id, quality_updated_at"\)\.eq\("lead_id", leadId\)\.eq\("professional_id", professionalId\)/);
  assert.doesNotMatch(page, /event\.metadata|feedbackNote\}<\/p>/);
});
