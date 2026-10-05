import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import test from "node:test";
import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import * as taxonomy from "../lib/leads/review-taxonomy.ts";

const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const leadId = "11111111-1111-4111-8111-111111111111";
const updatedAt = "2026-10-05T12:34:56.123456+00:00";
function load(path: string, mocks: Record<string, unknown> = {}): Record<string, unknown> {
  const compiledModule = { exports: {} };
  const require = createRequire(new URL(`../${path}`, import.meta.url));
  const compiled = ts.transpileModule(source(path), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
    fileName: path,
  }).outputText;
  runInNewContext(compiled, {
    module: compiledModule, exports: compiledModule.exports, URLSearchParams, Object, Date,
    require: (specifier: string) => {
      if (Object.hasOwn(mocks, specifier)) return mocks[specifier];
      if (specifier === "server-only") return {};
      if (specifier === "@/lib/leads/review-taxonomy") return taxonomy;
      if (specifier === "next/link") return { default: ({ href, children, ...props }: { href: string; children: unknown }) => createElement("a", { href, ...props }, children as React.ReactNode) };
      if (specifier.startsWith("@/")) return load(`${specifier.slice(2)}.ts`, mocks);
      return require(specifier);
    },
  });
  return compiledModule.exports;
}
function actionHarness({ unauthorized = false, error = null as null | { message: string } } = {}) {
  const calls: Array<{ name: string; args: Record<string, unknown> }> = [];
  const paths: string[] = [];
  const action = load("lib/leads/review-actions.ts", {
    "@/lib/auth/helpers": { requireAdminUser: async () => { if (unauthorized) throw new Error("Unauthorized"); return { id: "trusted-admin" }; } },
    "@/lib/supabase/server": { createServerSupabaseClient: async () => ({ rpc: async (name: string, args: Record<string, unknown>) => { calls.push({ name, args }); return { data: leadId, error }; } }) },
    "next/cache": { revalidatePath: (path: string) => paths.push(path) },
    "next/navigation": { redirect: (path: string) => { throw new Error(`REDIRECT:${path}`); } },
  }).updateLeadQualityReviewAction as (data: FormData) => Promise<void>;
  return { action, calls, paths };
}
function form(overrides: Record<string, string> = {}) {
  const result = new FormData();
  for (const [key, value] of Object.entries({
    lead_id: leadId, expected_updated_at: updatedAt, status: "in_review", resolution: "", note: "Onderzoek gestart", ...overrides,
  })) result.set(key, value);
  return result;
}
test("review filters reject hostile values, arrays, PII and unbounded pagination", () => {
  const defaults = taxonomy.parseReviewFilters({});
  assert.equal(defaults.days, 28);
  assert.equal(defaults.status, "open");
  for (const value of ["constructor", "__proto__", "<script>", "customer@example.com", ["7", "90"]]) {
    const parsed = taxonomy.parseReviewFilters(Object.fromEntries(["days", "status", "signal", "service", "source", "type", "sort", "search", "page"].map((key) => [key, value])));
    assert.deepEqual(parsed, defaults);
  }
  assert.equal(taxonomy.parseReviewFilters({ page: "-1" }).page, 1);
  assert.equal(taxonomy.parseReviewFilters({ page: "1.2" }).page, 1);
  assert.equal(taxonomy.parseReviewFilters({ page: "999999" }).page, 10000);
  assert.equal(taxonomy.parseReviewFilters({ page: "999999999999999" }).page, 1);
  assert.equal(taxonomy.parseReviewFilters({ search: leadId }).search, leadId);
  assert.equal(taxonomy.parseReviewFilters({ search: "VC-ABC12345" }).search, "VC-ABC12345");
  assert.equal(taxonomy.parseReviewFilters({ refund: "on" }).refund, false);
  assert.equal(taxonomy.parseReviewFilters({ refund: "true", status: "all", days: "90", service: leadId }).service, leadId);
  assert.ok(taxonomy.reviewPageHref(defaults, 2).startsWith("/admin/leadkwaliteit/review?"));
});
test("closure requires reason, appended note and explicit administrative confirmation", () => {
  const base = { leadId, expectedUpdatedAt: updatedAt, status: "resolved", resolution: "valid_lead", note: "Geen fout vastgesteld", confirmed: true };
  assert.equal(taxonomy.reviewMutationSchema.safeParse(base).success, true);
  for (const override of [{ note: "" }, { resolution: null }, { confirmed: false }, { note: "a".repeat(2001) }, { expectedUpdatedAt: "yesterday" }, { leadId: "../credits" }]) {
    assert.equal(taxonomy.reviewMutationSchema.safeParse({ ...base, ...override }).success, false);
  }
  assert.equal(taxonomy.reviewMutationSchema.safeParse({ ...base, status: "open", resolution: null, note: null, expectedUpdatedAt: null, confirmed: false }).success, true);
  assert.equal(taxonomy.reviewMutationSchema.safeParse({ ...base, status: "open" }).success, false);
});
test("resolution timestamp derives only from audited closing transitions, not later notes or updated_at", () => {
  assert.equal(taxonomy.lastReviewResolutionAt([]), null);
  const resolved = { action: "status_changed", from_status: "in_review", to_status: "resolved", created_at: "2026-10-05T10:00:00Z" };
  const note = { action: "note_added", from_status: "resolved", to_status: "resolved", created_at: "2026-10-05T11:00:00Z" };
  const reopened = { action: "reopened", from_status: "resolved", to_status: "open", created_at: "2026-10-05T12:00:00Z" };
  assert.equal(taxonomy.lastReviewResolutionAt([note, reopened, resolved]), resolved.created_at);
  const dismissed = { action: "status_changed", from_status: "open", to_status: "dismissed", created_at: "2026-10-05T13:00:00Z" };
  assert.equal(taxonomy.lastReviewResolutionAt([dismissed, note, resolved]), dismissed.created_at);
  assert.equal(taxonomy.lastReviewResolutionAt([{ ...resolved, created_at: "unknown" }, note]), null);
  assert.equal(taxonomy.lastReviewResolutionAt([{ ...resolved, action: "created", from_status: null }]), resolved.created_at);
});
test("action denies unauthenticated/non-admin requests before RPC and invalid IDs never reach SQL", async () => {
  const denied = actionHarness({ unauthorized: true });
  await assert.rejects(denied.action(form()), /Unauthorized/);
  assert.equal(denied.calls.length, 0);
  const invalid = actionHarness();
  await assert.rejects(invalid.action(form({ lead_id: "../credits", redirect_to: "https://evil.example" })), /REDIRECT:\/admin\/leadkwaliteit\/review\?/);
  assert.equal(invalid.calls.length, 0);
  await assert.rejects(invalid.action(form({ status: "resolved", resolution: "valid_lead", confirmed: "" })), /REDIRECT:/);
  assert.equal(invalid.calls.length, 0);
});
test("action passes microsecond CAS unchanged, trusts no actor or redirect and only calls audited RPC", async () => {
  const harness = actionHarness();
  await assert.rejects(harness.action(form({ actor_user_id: "spoofed", professional_id: "someone-else", redirect_to: "//evil.example" })), /REDIRECT:\/admin\/leadkwaliteit\/review\/11111111-/);
  assert.equal(harness.calls.length, 1);
  assert.equal(harness.calls[0].name, "admin_update_lead_quality_review");
  assert.deepEqual({ ...harness.calls[0].args }, {
    p_lead_id: leadId, p_expected_updated_at: updatedAt, p_status: "in_review", p_resolution: null, p_note: "Onderzoek gestart",
  });
  assert.ok(harness.paths.includes("/admin/leadkwaliteit/review"));
  const create = actionHarness();
  await assert.rejects(create.action(form({ expected_updated_at: "" })), /REDIRECT:/);
  assert.equal(create.calls[0].args.p_expected_updated_at, null);
});
test("stale and inaccessible lead responses show human errors and never pretend success", async () => {
  for (const message of ["QUALITY_REVIEW_STALE_WRITE", "LEAD_NOT_FOUND", "permission denied"]) {
    const harness = actionHarness({ error: { message } });
    let redirected = "";
    try { await harness.action(form()); } catch (error) { redirected = String(error); }
    const decoded = decodeURIComponent(redirected.replaceAll("+", " "));
    assert.match(decoded, /error=/);
    assert.doesNotMatch(decoded, /success=/);
    assert.equal(harness.paths.length, 0);
    if (message.includes("STALE")) assert.match(decoded, /Vernieuw de pagina/);
    else if (message.includes("NOT_FOUND")) assert.match(decoded, /niet beschikbaar/);
    else assert.match(decoded, /Controleer je invoer/);
    assert.doesNotMatch(decoded, /permission denied|QUALITY_REVIEW_STALE_WRITE|LEAD_NOT_FOUND/);
  }
});
test("queries enforce admin auth and session RLS; invalid detail UUID has no RPC", async () => {
  const calls: Array<Record<string, unknown>> = [];
  let denied = true;
  const query = load("lib/leads/review-queries.ts", {
    "@/lib/auth/helpers": { requireAdminUser: async () => { if (denied) throw new Error("Unauthorized"); } },
    "@/lib/supabase/server": { createServerSupabaseClient: async () => ({ rpc: async (name: string, args: Record<string, unknown>) => { calls.push({ name, args }); return { data: name.includes("queue") ? { items: [] } : null, error: null }; } }) },
  });
  const queue = query.getAdminLeadQualityQueue as (filters: taxonomy.ReviewFilters) => Promise<unknown>;
  const detail = query.getAdminLeadQualityDetail as (id: string) => Promise<unknown>;
  await assert.rejects(queue(taxonomy.parseReviewFilters({})), /Unauthorized/);
  await assert.rejects(detail(leadId), /Unauthorized/);
  assert.equal(calls.length, 0);
  denied = false;
  assert.equal(await detail("../leads"), null);
  assert.equal(calls.length, 0);
  await queue({ ...taxonomy.parseReviewFilters({}), source: "customer@example.com", search: "0612345678" });
  assert.equal((calls[0].args as Record<string, unknown>).p_source, "");
  assert.equal((calls[0].args as Record<string, unknown>).p_search, "");
  assert.equal(await detail(leadId), null);
  assert.equal(calls[1].name, "admin_lead_quality_detail");
  assert.deepEqual({ ...calls[1].args as Record<string, unknown> }, { p_lead_id: leadId });
});
test("rendered review form exposes safe identity/CAS, bounded optional note and no actor/financial mutation", () => {
  const Form = load("components/admin/quality-review-form.tsx").QualityReviewForm as ComponentType<Record<string, unknown>>;
  const markup = renderToStaticMarkup(createElement(Form, { leadId, updatedAt, currentStatus: "open", action: async () => {} }));
  assert.match(markup, /name="expected_updated_at" value="2026-10-05T12:34:56.123456\+00:00"/);
  assert.match(markup, /maxLength="2000"/);
  assert.doesNotMatch(markup, /name="actor|name="professional|name="redirect|name="amount|name="purchase_id"/);
  const closed = renderToStaticMarkup(createElement(Form, { leadId, updatedAt, currentStatus: "resolved", action: async () => {} }));
  assert.match(closed, /<input\b(?=[^>]*name="confirmed")(?=[^>]*required="")[^>]*>/);
  assert.match(closed, /administratieve afhandeling/);
  assert.match(closed, /name="resolution"/);
  assert.match(closed, /geen refund/);
});
test("rendered dossier keeps independent outcomes, honest timestamps and intentional purchase links", () => {
  const loaded = load("components/admin/quality-review-evidence.tsx");
  const Evidence = loaded.QualityReviewEvidence as ComponentType<Record<string, unknown>>;
  const timestamp = loaded.reviewTimestamp as (value: string | null) => string;
  assert.equal(timestamp(null), "Niet vastgelegd / onbekend");
  assert.equal(timestamp("not-a-date"), "Niet vastgelegd / onbekend");
  const assignment = {
    id: "assignment-1", professional_id: "professional-1", status: "accepted", progress_status: "won",
    loss_reason: "someone@example.com", mismatch_reason: null, reachability: null, appointment_status: null,
    assigned_at: updatedAt, contacted_at: null, reached_at: null, appointment_scheduled_at: null,
    outcome_at: null, quality_updated_at: updatedAt,
  };
  const markup = renderToStaticMarkup(createElement(Evidence, { detail: {
    item: { lead_id: leadId },
    assignments: [assignment, { ...assignment, id: "assignment-2", professional_id: "professional-2", progress_status: "lost", loss_reason: "duplicate" }],
    purchases: [{ id: "purchase-1", professional_id: "professional-1", status: "refunded", price_credits: 15, purchased_at: updatedAt, refunded_at: null }],
    corrections: [], notes: [], audit: [], timeline: [],
    ledger: [{ id: "ledger-1", professional_id: "professional-1", lead_id: leadId, lead_assignment_id: "assignment-1", type: "refund", amount: 15, balance_after: 40, created_at: updatedAt, created_by_admin_id: null, description: "private customer text" }],
    financial_audit: [{ id: "financial-1", entity_type: "lead_purchase", entity_id: "purchase-1", action: "refund", actor_user_id: "admin-1", actor_professional_id: null, created_at: updatedAt, metadata: { email: "private@example.com" } }],
  } }));
  assert.match(markup, /professional-1/);
  assert.match(markup, /professional-2/);
  assert.match(markup, /Gewonnen/);
  assert.match(markup, /Verloren/);
  assert.match(markup, /Niet vastgelegd \/ onbekend/);
  assert.doesNotMatch(markup, /someone@example.com/);
  assert.match(markup, new RegExp(`/admin/leads/${leadId}#purchase-purchase-1`));
  assert.match(markup, /bevat klantgegevens/);
  assert.match(markup, /Refund uitgevoerd/);
  assert.match(markup, /Saldo na boeking: 40 credits/);
  assert.match(markup, /ledger-1/);
  assert.match(markup, /admin-1/);
  assert.doesNotMatch(markup, /private customer text|private@example.com/);
  assert.doesNotMatch(markup, /<form|name="amount"/);
});
test("signal rendering uses Dutch labels and visible text priority, never unknown dynamic keys", () => {
  const Signals = load("components/admin/quality-review-signals.tsx").QualityReviewSignals as ComponentType<Record<string, unknown>>;
  const markup = renderToStaticMarkup(createElement(Signals, { item: {
    priority: "high", signals: { financial_conflict: 1, conflicting_feedback: 2, refund: 1, "customer@example.com": 99 },
  } }));
  assert.match(markup, /Prioriteit: hoog/);
  assert.match(markup, /Financieel conflict: 1/);
  assert.match(markup, /Tegenstrijdige feedback: 2/);
  assert.doesNotMatch(markup, /customer@example.com/);
  assert.match(markup, /Hoog door een financieel conflict/);
  assert.match(taxonomy.reviewPriorityExplanation({ invalid_contact: 2 }, "high"), /minstens tweemaal/);
  assert.match(taxonomy.reviewPriorityExplanation({ refund: 1, duplicate: 1, unreachable: 1 }, "high"), /combinatie refund/);
  assert.match(taxonomy.reviewPriorityExplanation({ refund: 1 }, "low"), /uitsluitend financiële context/);
});
test("queue RPC and UI agree on every selectable signal and sorting value", () => {
  const migration = source("supabase/migrations/20261005180000_prompt29_admin_quality_operations.sql");
  const queue = migration.split("create function public.admin_lead_quality_queue(")[1].split("create function public.admin_lead_quality_detail(")[0];
  const signals = queue.match(/p_signal not in \(([\s\S]*?)\)/)?.[1] ?? "";
  const sorts = queue.match(/p_sort not in \(([\s\S]*?)\)/)?.[1] ?? "";
  for (const value of taxonomy.reviewSignals) assert.ok(signals.includes(`'${value}'`), `RPC must support signal ${value}`);
  for (const value of taxonomy.reviewSorts) assert.ok(sorts.includes(`'${value}'`), `RPC must support sort ${value}`);
});
test("operations source contracts preserve privacy, explain evidence and use existing financial paths", () => {
  const paths = ["lib/leads/review-queries.ts", "lib/leads/review-actions.ts"];
  for (const path of paths) {
    const text = source(path);
    assert.match(text, /requireAdminUser/);
    assert.match(text, /createServerSupabaseClient/);
    assert.doesNotMatch(text, /createAdminSupabaseClient|\.from\(|track|analytics|service_role/);
  }
  const detail = source("app/(admin)/admin/leadkwaliteit/review/[id]/page.tsx");
  assert.match(detail, /onvoldoende betrouwbare locatieherkomst/);
  assert.match(detail, /Gematchte dienst/);
  assert.match(detail, /contactgegevens en intake/);
  assert.match(detail, /href=\{`\/admin\/leads\/\$\{id\}`\}/);
  const evidence = source("components/admin/quality-review-evidence.tsx");
  assert.match(evidence, /#purchase-\$\{purchase.id\}/);
  assert.match(evidence, /href="\/admin\/credits"/);
  assert.match(evidence, /Vakman-ID/);
  assert.match(evidence, /Niet vastgelegd \/ onbekend/);
  assert.match(source("app/(admin)/admin/leadkwaliteit/review/error.tsx"), /role="alert"|Opnieuw proberen/);
  assert.match(source("app/(admin)/admin/leadkwaliteit/review/loading.tsx"), /role="status"/);
  assert.match(source("app/(admin)/admin/leadkwaliteit/page.tsx"), /QualityReviewSummary/);
});
