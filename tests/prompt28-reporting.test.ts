import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  buildQualityReport, collectQualityPages, parseQualityFilters, safeQualitySource,
  type QualityPurchase, type QualityCorrection, type QualityOffer,
} from "../lib/leads/quality-reporting.ts";

const now = new Date("2026-10-05T12:00:00Z");
const bought = "2026-10-04T10:00:00Z";
const filters = parseQualityFilters({});
const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
function purchase(id: string, patch: Partial<QualityPurchase> = {}): QualityPurchase {
  return {
    id, leadId: `lead-${id}`, professionalId: `professional-${id}`, status: "purchased",
    purchasedAt: bought, type: "shared", reference: "VC-ABCDEFGH",
    serviceId: "00000000-0000-0000-0000-000000000001", serviceName: "Dakwerk",
    ...patch,
  };
}
const evidence = {
  contactedAt: "2026-10-04T11:00:00Z", reachedAt: "2026-10-04T12:00:00Z",
  appointmentScheduledAt: "2026-10-04T13:00:00Z", outcomeAt: "2026-10-04T14:00:00Z",
  progressStatus: "won", reachability: "reached", appointmentStatus: "scheduled",
};
const report = (purchases: QualityPurchase[], extra: { corrections?: QualityCorrection[]; offers?: QualityOffer[] } = {}) =>
  buildQualityReport({ purchases, ...extra }, filters, now);

test("acquisition denominator includes refunds, excludes cancelled and duplicates, counts unique leads", () => {
  const rows = Array.from({ length: 10 }, (_, i) => purchase(String(i), {
    leadId: "shared-lead", status: i === 9 ? "refunded" : "purchased",
    assignment: i < 5 ? evidence : { progressStatus: "lost", reachability: "no_answer" },
  }));
  const result = report([...rows, rows[0], purchase("cancelled", { status: "cancelled" })]);
  assert.equal(result.uniqueLeads, 1);
  assert.equal(result.purchasedAssignments, 10);
  assert.equal(result.excludedCancelled, 1);
  assert.deepEqual(result.metrics.contact, { count: 5, denominator: 10, percent: 50 });
  assert.deepEqual(result.metrics.refund, { count: 1, denominator: 10, percent: 10 });
  assert.deepEqual(result.metrics.unreachable, { count: 5, denominator: 10, percent: 50 });
  for (const value of Object.values(result.metrics)) assert.equal(value.denominator, 10);
});

test("strict funnel never infers contact from won or appointment, intersects chronological prerequisites", () => {
  const result = report([
    purchase("full", { assignment: evidence }),
    purchase("historic", { assignment: { progressStatus: "won" } }),
    purchase("skipped", { assignment: { ...evidence, contactedAt: null } }),
    purchase("reversed", { assignment: { ...evidence, reachedAt: "2026-10-04T10:30:00Z" } }),
    purchase("missing-outcome", { assignment: { ...evidence, outcomeAt: null } }),
  ]);
  assert.deepEqual(result.funnel, { purchased: 5, contacted: 3, reached: 2, appointment: 2, won: 1 });
  assert.equal(result.metrics.won.count, 5);
  assert.equal(result.missingEvidence.contact, 2);
  assert.equal(result.missingEvidence.outcome, 2);
});

test("funnel percentages always use the full purchase base and suppress low samples", () => {
  const result = report(Array.from({ length: 10 }, (_, i) => purchase(String(i), { assignment: i < 3 ? evidence : null })));
  assert.deepEqual(result.funnelRates.purchased, { count: 10, denominator: 10, percent: 100 });
  assert.deepEqual(result.funnelRates.won, { count: 3, denominator: 10, percent: 30 });
  for (const value of Object.values(result.funnelRates)) assert.equal(value.denominator, 10);
  for (const value of Object.values(report([purchase("one")]).funnelRates)) assert.equal(value.percent, null);
});

test("empty feedback is explicit even with purchases and invalid contact signals retain exact denominators", () => {
  const empty = report([purchase("no-feedback")]);
  assert.equal(empty.feedbackAssignments, 0);
  const rows = Array.from({ length: 10 }, (_, i) => purchase(String(i), {
    status: i === 9 ? "refunded" : "purchased",
    assignment: { reachability: i < 2 ? "invalid_phone" : i === 2 ? "invalid_email" : i === 3 ? "no_answer" : null },
  }));
  const result = report(rows);
  assert.equal(result.feedbackAssignments, 4);
  assert.deepEqual(result.metrics.invalidPhone, { count: 2, denominator: 10, percent: 20 });
  assert.deepEqual(result.metrics.invalidEmail, { count: 1, denominator: 10, percent: 10 });
  assert.deepEqual(result.metrics.invalidContact, { count: 3, denominator: 10, percent: 30 });
  assert.equal(result.contactSignalCohorts[0].date, "2026-10-04");
  assert.equal(result.contactSignalCohorts[0].invalidContact.count, 3);
  assert.equal(result.contactSignalCohorts[0].invalidPhone.denominator, 10);
  assert.match(source("app/(admin)/admin/leadkwaliteit/page.tsx"), /Er is nog onvoldoende feedback voor deze periode\./);
});

test("shared purchases preserve independent won and lost outcomes and assignment filters", () => {
  const rows = [
    purchase("one", { leadId: "same", assignment: evidence }),
    purchase("two", { leadId: "same", status: "refunded", assignment: { ...evidence, progressStatus: "lost", mismatchReason: "wrong_service", lossReason: "buiten_scope" } }),
  ];
  const result = report(rows);
  assert.equal(result.table[0].purchaseCount, 2);
  assert.equal(result.table[0].won, 1);
  assert.equal(result.table[0].lost, 1);
  assert.equal(result.table[0].refunds, 1);
  assert.equal(result.table[0].mismatch, 1);
  const filtered = buildQualityReport({ purchases: rows }, { ...filters, outcome: "lost", mismatch: "wrong_service" }, now);
  assert.equal(filtered.purchasedAssignments, 1);
  assert.equal(filtered.metrics.won.count, 0);
  assert.equal(filtered.lossReasons.find((row) => row.reason === "buiten_scope")?.count, 1);
});

test("loss reason reporting follows the extended backend taxonomy without interpreting free text", () => {
  const reasons = ["duplicate", "already_completed", "wrong_service", "wrong_region", "invalid_contact"];
  const result = report(reasons.map((lossReason) => purchase(lossReason, { assignment: { progressStatus: "lost", lossReason } })));
  for (const reason of reasons) assert.equal(result.lossReasons.find((row) => row.reason === reason)?.count, 1);
  assert.equal(result.metrics.lost.count, 5);
});

test("missing and arbitrary historic loss reasons use an unknown bucket without exposing their text", () => {
  const result = report([
    purchase("legacy", { assignment: { progressStatus: "lost", lossReason: "Jan@example.com bel 0612345678" } }),
    purchase("empty", { assignment: { progressStatus: "lost", lossReason: null } }),
    purchase("known", { assignment: { progressStatus: "lost", lossReason: "anders" } }),
  ]);
  assert.deepEqual(result.unknownLossReason, { count: 2, denominator: 3, percent: null });
  assert.equal(result.lossReasons.find((row) => row.reason === "anders")?.count, 1);
  assert.doesNotMatch(JSON.stringify(result), /Jan@example|0612345678/);
});

test("no arbitrary UTM, unreliable geography, notes, professional IDs or invalid references escape", () => {
  const row = {
    ...purchase("private-professional-id"), reference: "jan@example.com", region: "Kerkstraat 12",
    utmSource: "jan@example.com", feedback_note: "Bel Jan op 0612345678",
    email: "jan@example.com", professional_name: "Jan Jansen",
    assignment: { ...evidence, mismatchReason: "jan@example.com", lossReason: "Bel 0612345678" },
  };
  const serialized = JSON.stringify(report([row]));
  assert.doesNotMatch(serialized, /jan@example|0612345678|Kerkstraat|Jan Jansen|private-professional-id|feedback_note|professionalId|leadId|purchasedAt/);
  assert.equal(report([row]).table[0].region, "Onbekend");
  assert.equal(report([row]).metrics.mismatch.count, 0);
  assert.equal(safeQualitySource(" GOOGLE_ADS "), "Zoekmachines");
  assert.equal(safeQualitySource("instagram"), "Social");
  assert.equal(safeQualitySource("newsletter"), "E-mail");
  for (const value of [null, "", "constructor", "https://google.com/user", "custom campaign"]) assert.equal(safeQualitySource(value), "Onbekend / overig");
});

test("small samples suppress percentages in every group; refund alone does not imply mismatch", () => {
  const result = report([purchase("one", { status: "refunded", assignment: evidence })]);
  for (const value of Object.values(result.metrics)) assert.equal(value.percent, null);
  assert.equal(result.breakdowns.type[0].won.percent, null);
  assert.equal(result.breakdowns.source[0].refund.percent, null);
  assert.equal(result.metrics.mismatch.count, 0);
  assert.equal(result.metrics.refund.count, 1);
  const mixed = report(Array.from({ length: 10 }, (_, i) => purchase(String(i), { type: i ? "shared" : "exclusive", assignment: evidence })));
  assert.equal(mixed.metrics.won.percent, 100);
  assert.equal(mixed.breakdowns.type.find((row) => row.label === "Exclusief")?.won.percent, null);
});

test("corrections require explicit lead/professional links, valid timing and count distinct affected purchases", () => {
  const one = purchase("one", { leadId: "shared" });
  const two = purchase("two", { leadId: "shared" });
  const entry = { id: "entry", leadId: one.leadId, professionalId: one.professionalId, type: "correction", createdAt: "2026-10-04T15:00:00Z" };
  const result = report([one, two], { corrections: [
    entry, entry, { ...entry, id: "second" },
    { ...entry, id: "other-professional", professionalId: "someone-else" },
    { ...entry, id: "unlinked", leadId: null },
    { ...entry, id: "refund", professionalId: two.professionalId, type: "refund" },
    { ...entry, id: "early", professionalId: two.professionalId, createdAt: "2026-10-04T09:00:00Z" },
    { ...entry, id: "future", professionalId: two.professionalId, createdAt: "2026-11-04T09:00:00Z" },
  ] });
  assert.equal(result.metrics.correction.count, 1);
  assert.equal(result.table[0].corrections, 1);
  assert.equal(result.metrics.refund.count, 0);
  assert.equal(result.metrics.mismatch.count, 0);
});

test("timings use valid first evidence >= purchase and <= as-of, never snapshot status", () => {
  const result = report([
    purchase("one", { assignment: evidence }),
    purchase("two", { assignment: { ...evidence, contactedAt: "2026-10-04T13:00:00Z" } }),
    purchase("early", { assignment: { ...evidence, contactedAt: "2026-10-04T09:00:00Z", appointmentScheduledAt: "invalid", outcomeAt: "2026-11-04T13:00:00Z" } }),
  ]);
  assert.deepEqual(result.timing.contact, { hours: 2, sample: 2 });
  assert.deepEqual(result.timing.appointment, { hours: 3, sample: 2 });
  assert.deepEqual(result.timing.outcome, { hours: 4, sample: 2 });
  assert.equal(report([purchase("old", { assignment: { progressStatus: "won" } })]).timing.outcome.hours, null);
});

test("offer decline denominator is distinct offered cohort, never purchases or arbitrary reason text", () => {
  const offers = Array.from({ length: 12 }, (_, i): QualityOffer => ({
    id: String(i), offeredAt: bought, declinedAt: i < 4 ? "2026-10-04T15:00:00Z" : null,
    declineReason: i < 3 ? "geen_capaciteit" : "Jan@example.com: geen capaciteit",
    serviceId: "service", type: "shared",
  }));
  const result = report([purchase("one")], { offers: [...offers, offers[0], { ...offers[0], id: "not-offered", offeredAt: null }] });
  assert.equal(result.distribution.offers, 12);
  assert.deepEqual(result.distribution.declined, { count: 4, denominator: 12, percent: 33.3 });
  assert.deepEqual(result.distribution.reasons.find((row) => row.reason === "geen_capaciteit"), { reason: "geen_capaciteit", count: 3, denominator: 12, percent: 25 });
  assert.equal(result.distribution.unknownReason, 1);
  assert.doesNotMatch(JSON.stringify(result), /Jan@example/);
});

test("extended structured offer mismatch reasons use the shared decline taxonomy", () => {
  const result = report([], { offers: [
    { id: "one", offeredAt: bought, declinedAt: "2026-10-04T15:00:00Z", declineReason: "wrong_service", serviceId: "service", type: "shared" },
    { id: "two", offeredAt: bought, declinedAt: "2026-10-04T15:00:00Z", declineReason: "invalid_contact", serviceId: "service", type: "shared" },
  ] });
  assert.equal(result.distribution.unknownReason, 0);
  assert.equal(result.distribution.reasons.find((row) => row.reason === "wrong_service")?.count, 1);
  assert.equal(result.distribution.reasons.find((row) => row.reason === "invalid_contact")?.count, 1);
});

test("cohort bounds are purchase timestamps, filters validate allowlists and table pagination is deterministic", () => {
  const result = report([
    ...Array.from({ length: 30 }, (_, i) => purchase(String(i))),
    purchase("outside", { purchasedAt: "2026-08-01T12:00:00Z" }),
    purchase("future", { purchasedAt: "2026-10-06T12:00:00Z" }),
    purchase("invalid", { purchasedAt: "invalid" }),
  ]);
  assert.equal(result.purchasedAssignments, 30);
  assert.equal(result.table.length, 25);
  assert.equal(result.pages, 2);
  const parsed = parseQualityFilters({ days: "1000", region: "jan@example.com", mismatch: "raw", outcome: "other", page: "-3", service: "private", sort: "raw" });
  assert.deepEqual(parsed, filters);
  const second = buildQualityReport({ purchases: Array.from({ length: 30 }, (_, i) => purchase(String(i))) }, { ...filters, page: 999 }, now);
  assert.equal(second.page, 2);
  assert.equal(second.table.length, 5);
});

test("service, reliable region, commercial type and time windows filter independent purchases", () => {
  const rows = [
    purchase("selected", { region: "Utrecht", type: "exclusive", assignment: evidence }),
    purchase("type", { region: "Utrecht", type: "shared" }),
    purchase("region", { region: "Gelderland", type: "exclusive" }),
    purchase("service", { serviceId: "00000000-0000-0000-0000-000000000002", region: "Utrecht", type: "exclusive" }),
    purchase("historic", { region: "Utrecht", type: "exclusive", purchasedAt: "2026-09-20T12:00:00Z" }),
  ];
  const selected = buildQualityReport({ purchases: rows }, { ...filters, days: 7, service: rows[0].serviceId, region: "Utrecht", type: "exclusive" }, now);
  assert.equal(selected.purchasedAssignments, 1);
  assert.equal(selected.metrics.contact.denominator, 1);
  assert.equal(selected.table[0].region, "Utrecht");
  assert.equal(buildQualityReport({ purchases: rows }, { ...filters, days: 90 }, now).purchasedAssignments, 5);
});

test("sorting uses independent feedback/mismatch/refund counts and purchases, not global lead outcomes", () => {
  const rows = [
    purchase("recent", { reference: "VC-ABCDEFG2", purchasedAt: "2026-10-05T10:00:00Z" }),
    purchase("feedback", { reference: "VC-ABCDEFG3", assignment: evidence }),
    purchase("feedback-second", { leadId: "lead-feedback", reference: "VC-ABCDEFG3", assignment: evidence }),
    purchase("mismatch", { reference: "VC-ABCDEFG4", assignment: { mismatchReason: "wrong_service" } }),
    purchase("refund", { reference: "VC-ABCDEFG5", status: "refunded" }),
  ];
  assert.equal(buildQualityReport({ purchases: rows }, filters, now).table[0].reference, "VC-ABCDEFG2");
  assert.equal(buildQualityReport({ purchases: rows }, { ...filters, sort: "mostfeedback" }, now).table[0].reference, "VC-ABCDEFG3");
  assert.equal(buildQualityReport({ purchases: rows }, { ...filters, sort: "mismatch" }, now).table[0].reference, "VC-ABCDEFG4");
  assert.equal(buildQualityReport({ purchases: rows }, { ...filters, sort: "refunds" }, now).table[0].reference, "VC-ABCDEFG5");
});

test("reporting pagination exceeds Supabase's 1000-row cap, handles smaller caps and never silently truncates", async () => {
  const data = Array.from({ length: 1205 }, (_, i) => i);
  const calls: Array<[number, number]> = [];
  const all = await collectQualityPages<number>(async (from, to) => {
    calls.push([from, to]);
    return { data: data.slice(from, Math.min(to + 1, from + 200)), count: data.length, error: null };
  });
  assert.equal(all.length, 1205);
  assert.deepEqual(calls[0], [0, 499]);
  assert.deepEqual(calls[1], [200, 699]);
  await assert.rejects(collectQualityPages(async () => ({ data: [], count: 1, error: null })), /volledig/);
  await assert.rejects(collectQualityPages(async () => ({ data: [], count: 50001, error: null })), /kortere periode/);
  await assert.rejects(collectQualityPages(async () => ({ data: [], count: null, error: null })), /niet beschikbaar/);
  await assert.rejects(collectQualityPages(async () => ({ data: [], count: 0, error: { message: "db" } })), /niet beschikbaar/);
  await assert.rejects(collectQualityPages(async (from) => ({ data: [from], count: from === 0 ? 2 : 3, error: null })), /gewijzigd/);
});

test("query and page guard admin access and explicit selects exclude all private/free-text fields", () => {
  const query = source("lib/leads/quality-queries.ts");
  const page = source("app/(admin)/admin/leadkwaliteit/page.tsx");
  assert.match(query, /import "server-only"/);
  assert.ok(query.indexOf("await requireAdminUser()") < query.indexOf("const supabase = createAdminSupabaseClient()"));
  assert.ok(page.indexOf("await requireAdminUser()") < page.indexOf("await getAdminLeadQualityReport"));
  assert.match(query, /lead_purchases_assignment_fk/);
  assert.match(query, /\.eq\("type", "correction"\)/);
  assert.match(query, /\.range\(from, to\)/);
  assert.doesNotMatch(query, /select\("\*"|feedback_note|first_name|last_name|email|phone|postal_code|house_number|description|metadata/);
  assert.doesNotMatch(query, /\.eq\("status", "purchased"\)/);
  assert.match(page, /Beperkte steekproef/);
  assert.match(source("app/(admin)/admin/leadkwaliteit/error.tsx"), /retry/);
});
