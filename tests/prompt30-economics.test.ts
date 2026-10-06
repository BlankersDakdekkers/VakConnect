import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { collectQualityPages } from "../lib/leads/quality-reporting.ts";
import {
  buildEconomicsReport, parseEconomicsDays,
  type EconomicsInput, type EconomicsOffer, type EconomicsPurchase,
  type EconomicsReport, type EconomicsSummary, type EconomicsTransaction,
} from "../lib/economics/metrics.ts";

const now = new Date("2026-10-06T12:00:00.000Z");
const bought = "2026-10-05T10:00:00.000Z";
const day = 86400000;
const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const ago = (days: number, offset = 0) => new Date(now.getTime() - days * day + offset).toISOString();
const after = (value: string, hours: number) => new Date(Date.parse(value) + hours * 3600000).toISOString();

function purchase(id: string, patch: Partial<EconomicsPurchase> = {}): EconomicsPurchase {
  const row: EconomicsPurchase = {
    id, leadId: `lead-${id}`, professionalId: `professional-${id}`, assignmentId: `assignment-${id}`,
    price: 100, type: "shared", status: "purchased", purchasedAt: bought,
    debitId: `debit-${id}`, refundId: null, refundedAt: null,
    serviceId: "roofing", serviceName: "Dakwerk", subservice: "dakreparatie", source: "google_ads",
    leadExists: true, professionalExists: true, assignment: null, ...patch,
  };
  if (!Object.hasOwn(patch, "assignment")) {
    row.assignment = { id: row.assignmentId ?? `assignment-${id}`, leadId: row.leadId, professionalId: row.professionalId };
  }
  if (row.status === "refunded") {
    if (!Object.hasOwn(patch, "refundId")) row.refundId = `refund-${id}`;
    if (!Object.hasOwn(patch, "refundedAt")) row.refundedAt = after(row.purchasedAt, 1);
  }
  return row;
}

function evidence(row: EconomicsPurchase, patch: Partial<NonNullable<EconomicsPurchase["assignment"]>> = {}) {
  return {
    id: row.assignmentId!, leadId: row.leadId, professionalId: row.professionalId,
    contactedAt: after(row.purchasedAt, 1), reachedAt: after(row.purchasedAt, 2),
    appointmentScheduledAt: after(row.purchasedAt, 3), outcomeAt: after(row.purchasedAt, 4),
    progressStatus: "won", ...patch,
  };
}

function linked(row: EconomicsPurchase, id: string, amount: number, type = "correction"): EconomicsTransaction {
  return {
    id, walletId: `wallet-${row.professionalId}`, professionalId: row.professionalId,
    leadId: row.leadId, assignmentId: row.assignmentId, type, amount,
    createdAt: after(row.purchasedAt, 1),
  };
}

function fixture(purchases: EconomicsPurchase[] = [], extras: EconomicsTransaction[] = [], offers: EconomicsOffer[] = []): EconomicsInput {
  const professionals = [...new Set(purchases.map((row) => row.professionalId))];
  const transactions: EconomicsTransaction[] = professionals.map((professionalId) => ({
    id: `fund-${professionalId}`, walletId: `wallet-${professionalId}`, professionalId,
    leadId: null, assignmentId: null, type: "credit_purchase", amount: 10000, createdAt: ago(100),
  }));
  for (const row of purchases) {
    if (row.status === "cancelled") continue;
    transactions.push({ ...linked(row, row.debitId, -row.price, "lead_purchase"), createdAt: row.purchasedAt });
    if (row.status === "refunded" && row.refundId) {
      transactions.push({ ...linked(row, row.refundId, row.price, "refund"), createdAt: row.refundedAt! });
    }
  }
  transactions.push(...extras);
  const wallets = professionals.map((professionalId) => ({
    id: `wallet-${professionalId}`, professionalId, balance: 0, updatedAt: now.toISOString(),
  }));
  const input = { purchases, transactions, wallets, offers };
  rebalance(input);
  return input;
}

function rebalance(input: EconomicsInput) {
  for (const wallet of input.wallets) {
    wallet.balance = [...new Map(input.transactions.map((row) => [row.id, row])).values()]
      .filter((row) => row.walletId === wallet.id).reduce((sum, row) => sum + row.amount, 0);
  }
}

const report = (input: EconomicsInput, days: 7 | 28 | 90 = 28) => buildEconomicsReport(input, days, now);
const summaries = (result: EconomicsReport): EconomicsSummary[] => [
  result.all, result.matured, result.recent, ...Object.values(result.breakdowns).flat(), ...result.trend,
];
function failClosed(input: EconomicsInput, reason: RegExp) {
  const result = report(input);
  assert.equal(result.reconciliation.consistent, false);
  assert.match(result.reconciliation.issues.map((row) => row.label).join("\n"), reason);
  for (const row of summaries(result)) assert.equal(row.finance, null);
  for (const row of result.funnel) assert.equal(row.creditsPerOutcome, null);
  assert.equal(result.walletStock, null);
  assert.equal(result.priceDistribution, null);
  return result;
}
function freeze(value: unknown) {
  if (value && typeof value === "object") {
    for (const child of Object.values(value)) freeze(child);
    Object.freeze(value);
  }
}

test("balanced immutable ledger reconciles gross, actual full refund and retained net without changing status", () => {
  const retained = purchase("retained", { price: 120 });
  const refunded = purchase("refunded", { price: 80, status: "refunded" });
  const input = fixture([retained, refunded]);
  const before = structuredClone(input);
  freeze(input);
  const result = report(input);
  assert.deepEqual(input, before);
  assert.equal(result.reconciliation.consistent, true);
  assert.deepEqual(result.reconciliation.issues, []);
  assert.deepEqual(result.all.finance, {
    gross: 200, refunded: 80, corrections: 0, extraCharges: 0, net: 120,
    average: 100, creditsPerReached: null, creditsPerAppointment: null, creditsPerWon: null,
  });
  assert.deepEqual(result.all.refund, { count: 1, denominator: 2, percent: null });
  assert.equal(result.walletStock, 19880);
  assert.equal(input.purchases[1].status, "refunded");
});

test("positive partial corrections reduce net, negative corrections are separate extra charges", () => {
  const row = purchase("corrected");
  const result = report(fixture([row], [linked(row, "partial", 20), linked(row, "charge", -7)]));
  assert.equal(result.reconciliation.consistent, true);
  assert.equal(result.all.finance?.gross, 100);
  assert.equal(result.all.finance?.refunded, 0);
  assert.equal(result.all.finance?.corrections, 20);
  assert.equal(result.all.finance?.extraCharges, 7);
  assert.equal(result.all.finance?.net, 87);
  assert.deepEqual(result.all.partialCorrection, { count: 1, denominator: 1, percent: null });
  assert.equal(result.all.refund.count, 0);
});

test("distinct corrections aggregate once per affected purchase; repeated ledger ID fails closed", () => {
  const row = purchase("multiple");
  const first = linked(row, "first-correction", 10);
  const second = linked(row, "second-correction", 15);
  const input = fixture([row], [first, second]);
  assert.equal(report(input).all.finance?.corrections, 25);
  assert.equal(report(input).all.partialCorrection.count, 1);
  input.transactions.push({ ...first });
  assert.equal(failClosed(input, /ledgeridentificatie/).all.purchases, 1);
});

test("an additional full refund is not silently counted as another legitimate purchase refund", () => {
  const row = purchase("double-refund", { status: "refunded" });
  failClosed(fixture([row], [linked(row, "extra-refund", row.price, "refund")]), /Ongekoppelde refund/);
});

test("shared purchases are independent professional acquisitions, exclusive purchases keep their own cohort", () => {
  const first = purchase("first", { leadId: "same-lead" });
  const second = purchase("second", { leadId: "same-lead", status: "refunded" });
  first.assignment = evidence(first);
  second.assignment = evidence(second, { progressStatus: "lost" });
  const exclusive = purchase("exclusive", { type: "exclusive" });
  const result = report(fixture([first, second, exclusive]));
  assert.equal(result.reconciliation.consistent, true);
  assert.equal(result.all.purchases, 3);
  assert.equal(result.all.uniqueLeads, 2);
  assert.equal(result.sharedPurchasesPerLead, 2);
  assert.equal(result.breakdowns.type.find((row) => row.label === "Gedeeld")?.purchases, 2);
  assert.equal(result.breakdowns.type.find((row) => row.label === "Exclusief")?.purchases, 1);
  assert.equal(result.all.won.count, 1);
  assert.equal(result.all.lost, 1);
  assert.equal(result.all.open, 1);
});

test("all purchases including refunded purchases are rate denominators and credits per outcome are net credits", () => {
  const rows = Array.from({ length: 10 }, (_, i) => purchase(String(i), { status: i === 9 ? "refunded" : "purchased" }));
  rows.forEach((row, i) => {
    row.assignment = evidence(row, {
      reachedAt: i < 5 ? after(bought, 2) : null,
      appointmentScheduledAt: i < 3 ? after(bought, 3) : null,
      outcomeAt: i < 2 ? after(bought, 4) : null, progressStatus: i < 2 ? "won" : "open",
    });
  });
  const result = report(fixture(rows));
  assert.equal(result.all.sufficientData, true);
  assert.deepEqual(result.all.reached, { count: 5, denominator: 10, percent: 50 });
  assert.deepEqual(result.all.appointment, { count: 3, denominator: 10, percent: 30 });
  assert.deepEqual(result.all.won, { count: 2, denominator: 10, percent: 20 });
  assert.deepEqual(result.all.refund, { count: 1, denominator: 10, percent: 10 });
  assert.equal(result.all.finance?.net, 900);
  assert.equal(result.all.finance?.creditsPerReached, 180);
  assert.equal(result.all.finance?.creditsPerAppointment, 300);
  assert.equal(result.all.finance?.creditsPerWon, 450);
  for (const row of result.funnel) assert.equal(row.denominator, 10);
  for (const row of Object.values(result.all.quality)) assert.equal(row.denominator, 10);
});

test("zero recorded outcomes have null credit ratios; a recorded outcome with zero net has zero ratio", () => {
  const open = report(fixture([purchase("open")]));
  assert.equal(open.all.finance?.creditsPerReached, null);
  assert.equal(open.all.finance?.creditsPerAppointment, null);
  assert.equal(open.all.finance?.creditsPerWon, null);
  const row = purchase("free", { status: "refunded" });
  row.assignment = evidence(row);
  const result = report(fixture([row]));
  assert.equal(result.all.finance?.creditsPerWon, 0);
  assert.equal(result.funnel[3].creditsPerOutcome, 0);
});

test("every rate suppresses percentages below ten, even for groups inside a sufficient overall cohort", () => {
  const rows = Array.from({ length: 10 }, (_, i) => purchase(String(i), { type: i === 0 ? "exclusive" : "shared" }));
  const result = report(fixture(rows));
  assert.equal(result.all.refund.percent, 0);
  const small = report(fixture(rows.slice(0, 9)));
  for (const row of summaries(small)) {
    assert.equal(row.sufficientData, false);
    for (const rate of [row.refund, row.partialCorrection, row.reached, row.appointment, row.won, row.mismatch, ...Object.values(row.quality)]) {
      assert.equal(rate.percent, null);
    }
  }
  for (const row of small.funnel) assert.equal(row.percent, null);
  for (const row of result.breakdowns.type) assert.equal(row.won.percent, null);
});

test("purchase cohorts use inclusive 7/28/90-day timestamp bounds and maturity is exactly 28 days", () => {
  const rows = [
    purchase("now", { purchasedAt: now.toISOString() }),
    purchase("seven", { purchasedAt: ago(7) }),
    purchase("just-before-seven", { purchasedAt: ago(7, -1) }),
    purchase("just-recent", { purchasedAt: ago(28, 1) }),
    purchase("mature-boundary", { purchasedAt: ago(28) }),
    purchase("older", { purchasedAt: ago(28, -1) }),
    purchase("ninety", { purchasedAt: ago(90) }),
    purchase("outside", { purchasedAt: ago(90, -1) }),
  ];
  const input = fixture(rows);
  const seven = report(input, 7), twentyEight = report(input, 28), ninety = report(input, 90);
  for (const result of [seven, twentyEight, ninety]) assert.equal(result.reconciliation.consistent, true);
  assert.equal(seven.all.purchases, 2);
  assert.equal(seven.matured.purchases, 0);
  assert.equal(twentyEight.all.purchases, 5);
  assert.equal(twentyEight.matured.purchases, 1);
  assert.equal(twentyEight.recent.purchases, 4);
  assert.equal(ninety.all.purchases, 7);
  assert.equal(ninety.matured.purchases, 3);
  assert.equal(ninety.recent.purchases, 4);
});

test("open acquisitions and refunded acquisitions are never automatically classified as lost", () => {
  const refunded = purchase("refunded", { status: "refunded" });
  const lost = purchase("lost");
  lost.assignment = evidence(lost, { progressStatus: "lost" });
  const result = report(fixture([purchase("open"), refunded, lost]));
  assert.equal(result.all.open, 2);
  assert.equal(result.all.lost, 1);
  assert.equal(result.all.refund.count, 1);
});

test("strict chronological funnel excludes standalone won, missing prerequisites and reversed evidence", () => {
  const rows = ["full", "standalone", "missing-contact", "reverse-reached", "reverse-appointment", "reverse-outcome", "missing-outcome"].map((id) => purchase(id));
  rows[0].assignment = evidence(rows[0]);
  rows[1].assignment!.progressStatus = "won";
  rows[2].assignment = evidence(rows[2], { contactedAt: null });
  rows[3].assignment = evidence(rows[3], { reachedAt: after(bought, .5) });
  rows[4].assignment = evidence(rows[4], { appointmentScheduledAt: after(bought, 1.5) });
  rows[5].assignment = evidence(rows[5], { outcomeAt: after(bought, 2.5) });
  rows[6].assignment = evidence(rows[6], { outcomeAt: null });
  const result = report(fixture(rows));
  assert.equal(result.reconciliation.consistent, true);
  assert.equal(result.all.won.count, 7);
  assert.equal(result.all.reached.count, 6);
  assert.equal(result.all.appointment.count, 6);
  assert.deepEqual(result.funnel.map((row) => row.count), [7, 4, 3, 1]);
});

test("invalid, pre-purchase and future milestone evidence fails reconciliation rather than inventing outcomes", () => {
  for (const value of ["invalid", after(bought, -1), after(now.toISOString(), 1)]) {
    const row = purchase(value);
    row.assignment = evidence(row, { reachedAt: value });
    const result = failClosed(fixture([row]), /mijlpaaltijdstip/);
    assert.equal(result.all.reached.count, 0);
    assert.equal(result.funnel[3].count, 0);
  }
});

test("price distribution interpolates quartiles and detects only prices outside 1.5 IQR at n >= 10", () => {
  const prices = [10, 11, 12, 13, 14, 15, 16, 17, 18, 100];
  const result = report(fixture(prices.map((price, i) => purchase(String(i), { price }))));
  assert.deepEqual(result.priceDistribution, { min: 10, p25: 12.25, median: 14.5, p75: 16.75, max: 100, outliers: 1 });
  assert.equal(report(fixture([purchase("one", { price: 40 })])).priceDistribution?.outliers, null);
  assert.deepEqual(report(fixture([purchase("one", { price: 40 })])).priceDistribution, {
    min: 40, p25: 40, median: 40, p75: 40, max: 40, outliers: null,
  });
  assert.equal(report(fixture(Array.from({ length: 10 }, (_, i) => purchase(String(i))))).priceDistribution?.outliers, 0);
});

test("source/subservice labels are safe buckets; report contains no raw PII or internal join identifiers", () => {
  const pii = "Jan@example.com bel 0612345678";
  const rows = [" GOOGLE_ADS ", "instagram", "newsletter", "direct", "partner", pii].map((source, i) => {
    const row = purchase(`private-purchase-${i}`, { source, subservice: i === 5 ? "jan-jansen-0612345678" : "dakreparatie" });
    row.assignment = { ...row.assignment!, mismatchReason: pii, lossReason: pii };
    return { ...row, email: pii, phone: pii, feedback_note: pii, professional_name: "Jan Jansen" };
  });
  const result = report(fixture(rows));
  assert.deepEqual(result.breakdowns.source.map((row) => row.label).sort(), [
    "Direct", "E-mail", "Onbekend / overig", "Social", "Verwijzing", "Zoekmachines",
  ].sort());
  assert.equal(result.all.mismatch.count, 0);
  assert.deepEqual(result.breakdowns.subservice, []);
  assert.doesNotMatch(JSON.stringify(result), /Jan@example|0612345678|jan-jansen|Jan Jansen|private-purchase|professionalId|leadId|assignmentId|debitId|refundId|feedback_note/);
});

test("empty valid report has zero finance and counts but no averages, outcomes or price distribution observations", () => {
  const result = report(fixture());
  assert.equal(result.reconciliation.consistent, true);
  assert.equal(result.all.purchases, 0);
  assert.equal(result.all.uniqueLeads, 0);
  assert.equal(result.all.open, 0);
  assert.equal(result.all.lost, 0);
  assert.equal(result.walletStock, 0);
  assert.equal(result.sharedPurchasesPerLead, null);
  assert.deepEqual(result.all.finance, {
    gross: 0, refunded: 0, corrections: 0, extraCharges: 0, net: 0, average: null,
    creditsPerReached: null, creditsPerAppointment: null, creditsPerWon: null,
  });
  assert.deepEqual(result.priceDistribution, { min: null, p25: null, median: null, p75: null, max: null, outliers: null });
  assert.deepEqual(result.distribution.converted, { count: 0, denominator: 0, percent: null });
  assert.equal(result.distribution.expired, 0);
  assert.equal(result.distribution.open, 0);
  assert.deepEqual(result.trend, []);
});

test("a debit amount mismatch hides finances globally, including unrelated valid services and cohorts", () => {
  const input = fixture([purchase("bad"), purchase("good", { serviceId: "painting", serviceName: "Schilderwerk", purchasedAt: ago(28) })]);
  input.transactions.find((row) => row.id === "debit-bad")!.amount = -99;
  rebalance(input);
  const result = failClosed(input, /ledgerdebit/);
  assert.equal(result.all.purchases, 2);
  assert.equal(result.matured.purchases, 1);
  assert.equal(result.breakdowns.service.length, 2);
});

test("debit ID, type, exact links and timestamp must agree with the original acquisition", () => {
  const changes: Partial<EconomicsTransaction>[] = [
    { id: "unlinked-debit" }, { type: "admin_debit" }, { leadId: "wrong-lead" },
    { professionalId: "wrong-professional" }, { assignmentId: "wrong-assignment" },
    { createdAt: after(bought, .001) },
  ];
  for (const change of changes) {
    const input = fixture([purchase("one")]);
    Object.assign(input.transactions.find((row) => row.id === "debit-one")!, change);
    failClosed(input, /ledgerdebit/);
  }
});

test("missing lead, professional and assignment references fail closed", () => {
  for (const patch of [
    { leadExists: false }, { professionalExists: false }, { serviceId: "" }, { assignment: null },
    { assignmentId: null }, { assignment: { id: "wrong", leadId: "lead-one", professionalId: "professional-one" } },
    { assignment: { id: "assignment-one", leadId: "wrong", professionalId: "professional-one" } },
    { assignment: { id: "assignment-one", leadId: "lead-one", professionalId: "wrong" } },
  ] satisfies Partial<EconomicsPurchase>[]) {
    failClosed(fixture([purchase("one", patch)]), /Onvolledige aankoop|assignmentkoppeling/);
  }
});

test("wallet totals, ownership, presence, timestamps and ledger transaction shape are independently checked", () => {
  const mutations: Array<(input: EconomicsInput) => void> = [
    (input) => { input.wallets[0].balance++; },
    (input) => { input.wallets[0].balance = -1; },
    (input) => { input.wallets[0].balance = 1.5; },
    (input) => { input.wallets[0].professionalId = "wrong"; },
    (input) => { input.wallets = []; },
    (input) => { input.wallets[0].updatedAt = after(now.toISOString(), 1); },
    (input) => { input.wallets[0].updatedAt = "invalid"; },
    (input) => { input.transactions[0].amount = 0; },
    (input) => { input.transactions[0].amount = -10000; },
    (input) => { input.transactions[0].amount = 1.5; },
    (input) => { input.transactions[0].type = "unknown"; },
    (input) => { input.transactions[0].createdAt = after(now.toISOString(), 1); },
    (input) => { input.transactions[0].createdAt = "invalid"; },
  ];
  for (const mutate of mutations) {
    const input = fixture([purchase("one")]);
    mutate(input);
    failClosed(input, /Walletvoorraad|ledgertransactie/);
  }
});

test("null, nonnumeric, fractional and nonpositive prices and invalid commercial types fail closed", () => {
  for (const price of [null, "100", NaN, Infinity, 0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
    failClosed(fixture([purchase("invalid-price", { price: price as number })]), /ongeldige prijs\/type/);
  }
  for (const type of [null, "", "other"]) {
    failClosed(fixture([purchase("invalid-type", { type: type as string })]), /ongeldige prijs\/type/);
  }
});

test("duplicate lead/professional pairs and purchase, wallet, offer and ledger IDs fail closed", () => {
  failClosed(fixture([
    purchase("first", { leadId: "same", professionalId: "same" }),
    purchase("second", { leadId: "same", professionalId: "same" }),
  ]), /dezelfde lead en professional/);
  for (const collection of ["purchases", "transactions", "wallets"] as const) {
    const input = fixture([purchase("one")]);
    if (collection === "purchases") input.purchases.push({ ...input.purchases[0] });
    if (collection === "transactions") input.transactions.push({ ...input.transactions[0] });
    if (collection === "wallets") input.wallets.push({ ...input.wallets[0] });
    failClosed(input, /identificatie/);
  }
  const offer = makeOffer("duplicate");
  failClosed(fixture([], [], [offer, { ...offer }]), /aanbodidentificatie/);
});

test("extra orphan purchase debit on a cohort lead is detected even when the wallet remains balanced", () => {
  const row = purchase("one");
  failClosed(fixture([row], [linked(row, "orphan-debit", -100, "lead_purchase")]), /Ongekoppelde aankoopdebit/);
});

test("full purchase link reconciliation detects completely orphan debits and refunds outside cohort leads", () => {
  for (const type of ["lead_purchase", "refund"]) {
    const row = purchase("one");
    const input = fixture([row], [{
      ...linked(row, "completely-orphan", type === "refund" ? 100 : -100, type),
      leadId: "not-in-purchase-cohort", assignmentId: "orphan-assignment",
    }]);
    input.purchaseLinks = input.purchases.map(({ id, debitId, refundId, price, status }) => ({ id, debitId, refundId, price, status }));
    failClosed(input, /zonder bestaande aankoop/);
  }
});

test("empty global purchase links reject balanced orphan ledger entries even with no purchase cohort", () => {
  for (const status of ["purchased", "refunded"]) {
    const input = fixture([purchase("orphan", { status, purchasedAt: ago(40) })]);
    input.purchases = [];
    input.purchaseLinks = [];
    failClosed(input, /zonder bestaande aankoop/);
  }
});

test("global purchase links reconcile older purchased/refunded ledger without adding old acquisitions to cohort", () => {
  const input = fixture([
    purchase("older", { purchasedAt: ago(40) }),
    purchase("older-refund", { purchasedAt: ago(50), status: "refunded" }),
  ]);
  input.purchaseLinks = input.purchases.map(({ id, debitId, refundId, price, status }) => ({ id, debitId, refundId, price, status }));
  input.purchases = [];
  const result = report(input);
  assert.equal(result.reconciliation.consistent, true);
  assert.equal(result.all.purchases, 0);
  assert.equal(result.all.finance?.net, 0);
  assert.equal(result.walletStock, 19900);
});

test("global link reconciliation permits legitimate older purchases and cancelled acquisitions with no financial booking", () => {
  const input = fixture([purchase("old", { purchasedAt: ago(40) }), purchase("cancelled", { status: "cancelled" })]);
  input.purchaseLinks = input.purchases.map(({ id, debitId, refundId, price, status }) => ({ id, debitId, refundId, price, status }));
  const result = report(input);
  assert.equal(result.reconciliation.consistent, true);
  assert.equal(result.all.purchases, 0);
  assert.equal(result.all.finance?.gross, 0);
});

test("refund status, actual refund value, links and exact timestamp must match without rewriting purchase status", () => {
  const changes: Partial<EconomicsTransaction>[] = [
    { id: "wrong-refund" }, { type: "correction" }, { amount: 99 }, { leadId: "wrong" },
    { professionalId: "wrong" }, { assignmentId: "wrong" },
    { createdAt: after(bought, 2) }, { createdAt: after(bought, -1) },
  ];
  for (const change of changes) {
    const input = fixture([purchase("one", { status: "refunded" })]);
    Object.assign(input.transactions.find((row) => row.id === "refund-one")!, change);
    rebalance(input);
    failClosed(input, /Refundstatus/);
    assert.equal(input.purchases[0].status, "refunded");
  }
  failClosed(fixture([purchase("missing", { status: "refunded", refundId: null })]), /Refundstatus/);
  const input = fixture([purchase("one", { status: "refunded" })]);
  input.purchases[0].status = "purchased";
  failClosed(input, /zonder refundstatus/);
  failClosed(fixture([purchase("timestamp-only", { refundedAt: after(bought, 1) })]), /zonder refundstatus/);
});

test("corrections with conflicting assignment IDs and credits greater than the price fail closed", () => {
  const row = purchase("one");
  failClosed(fixture([row], [{ ...linked(row, "ambiguous", 20), assignmentId: "someone-else" }]), /Ambigue correctiekoppeling/);
  failClosed(fixture([row], [linked(row, "over-refund", 101)]), /overschrijden aankoopcredits/);
  const refunded = purchase("refunded", { status: "refunded" });
  failClosed(fixture([refunded], [linked(refunded, "over-refund", 1)]), /overschrijden aankoopcredits/);
  const fullCorrection = report(fixture([row], [linked(row, "full-correction", 100)]));
  assert.equal(fullCorrection.reconciliation.consistent, true);
  assert.equal(fullCorrection.all.finance?.net, 0);
  assert.equal(fullCorrection.all.partialCorrection.count, 0);
});

test("corrections before acquisition or for another professional do not reduce cohort purchase credits", () => {
  const row = purchase("one");
  const other = purchase("other", { leadId: row.leadId, purchasedAt: ago(40) });
  const input = fixture([row, other], [
    { ...linked(row, "before-purchase", 20), createdAt: after(bought, -1) },
    linked(other, "other-professional", 30),
    { ...linked(row, "unscoped", 15), leadId: null, assignmentId: null },
  ]);
  const result = report(input);
  assert.equal(result.reconciliation.consistent, true);
  assert.equal(result.all.finance?.net, 100);
  assert.equal(result.all.partialCorrection.count, 0);
});

test("cancelled acquisitions with no debit are excluded, but cancellation cannot hide a financial booking", () => {
  const cancelled = purchase("cancelled", { status: "cancelled" });
  assert.equal(report(fixture([cancelled])).all.purchases, 0);
  failClosed(fixture([cancelled], [{ ...linked(cancelled, cancelled.debitId, -100, "lead_purchase"), createdAt: bought }]), /Geannuleerde aankoop/);
  failClosed(fixture([purchase("unknown", { status: "unexpected" })]), /Onbekende aankoopstatus/);
  failClosed(fixture([purchase("invalid-time", { purchasedAt: "invalid", status: "cancelled" })]), /geldig aankoopmoment/);
});

function makeOffer(id: string, patch: Partial<EconomicsOffer> = {}): EconomicsOffer {
  return {
    id, leadId: `offered-lead-${id}`, offeredAt: bought, expiresAt: after(bought, 48),
    purchasedAt: null, type: "shared", serviceId: "roofing", serviceName: "Dakwerk", ...patch,
  };
}

test("offer conversion uses offered cohort rather than acquisition denominator and actual expiry timestamps", () => {
  const offers = Array.from({ length: 10 }, (_, i) => makeOffer(String(i), {
    purchasedAt: i < 3 ? after(bought, 1) : null,
    expiresAt: i >= 3 && i < 6 ? now.toISOString() : i === 6 ? after(now.toISOString(), 1) : i >= 7 ? null : after(bought, 2),
    type: i < 5 ? "exclusive" : "shared",
  }));
  const input = fixture([purchase("unrelated")], [], [
    ...offers, makeOffer("outside", { offeredAt: ago(29) }), makeOffer("future", { offeredAt: after(now.toISOString(), 1) }),
  ]);
  input.distributedPurchasedLeadIds = offers.slice(0, 3).map((row) => row.leadId);
  const result = report(input);
  assert.equal(result.distribution.offers, 10);
  assert.deepEqual(result.distribution.converted, { count: 3, denominator: 10, percent: 30 });
  assert.equal(result.distribution.expired, 3);
  assert.equal(result.distribution.open, 1);
  assert.equal(result.distribution.unsoldLeads, 7);
  assert.equal(result.all.purchases, 1);
  assert.equal(result.distribution.byType.find((row) => row.label === "Exclusief")?.purchases.count, 3);
  for (const group of result.distribution.byType) assert.equal(group.purchases.percent, null);
  assert.deepEqual(result.distribution.byService[0].purchases, { count: 3, denominator: 10, percent: 30 });
});

test("offer conversions require timestamps on or after offer and not beyond as-of; cohort bounds are inclusive", () => {
  const result = report(fixture([], [], [
    makeOffer("start", { offeredAt: ago(28), purchasedAt: ago(28), expiresAt: null }),
    makeOffer("end", { offeredAt: now.toISOString(), purchasedAt: now.toISOString(), expiresAt: null }),
    makeOffer("before", { purchasedAt: after(bought, -1) }),
    makeOffer("future", { purchasedAt: after(now.toISOString(), 1) }),
    makeOffer("invalid", { purchasedAt: "invalid" }),
    makeOffer("too-old", { offeredAt: ago(28, -1) }),
  ]));
  assert.equal(result.distribution.offers, 5);
  assert.deepEqual(result.distribution.converted, { count: 2, denominator: 5, percent: null });
});

test("unsold distribution deduplicates offered leads and excludes historically sold and refunded leads", () => {
  const input = fixture([], [], [
    makeOffer("first", { leadId: "shared-unsold" }), makeOffer("second", { leadId: "shared-unsold" }),
    makeOffer("historic", { leadId: "historically-sold" }), makeOffer("refunded", { leadId: "refunded-lead" }),
  ]);
  input.distributedPurchasedLeadIds = ["historically-sold", "refunded-lead"];
  const result = report(input);
  assert.equal(result.distribution.offers, 4);
  assert.equal(result.distribution.unsoldLeads, 1);
  assert.equal(result.distribution.converted.count, 0);
  assert.equal(result.all.purchases, 0);
});

test("window parser only permits 7/28/90 and defaults untrusted scalar or array values to 28", () => {
  assert.equal(parseEconomicsDays("7"), 7);
  assert.equal(parseEconomicsDays("28"), 28);
  assert.equal(parseEconomicsDays("90"), 90);
  for (const value of [undefined, "", "0", "365", "-7", "7.0", ["7"], ["90", "7"]]) {
    assert.equal(parseEconomicsDays(value), 28);
  }
});

function loadQuery(mocks: Record<string, unknown>) {
  const compiled = { exports: {} as Record<string, unknown> };
  const require = createRequire(import.meta.url);
  runInNewContext(ts.transpileModule(source("lib/economics/queries.ts"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, {
    module: compiled, exports: compiled.exports, Date, console,
    require: (name: string) => name === "server-only" ? {} : Object.hasOwn(mocks, name) ? mocks[name] : require(name),
  });
  return compiled.exports.getAdminEconomicsReport as (days: 7 | 28 | 90) => Promise<unknown>;
}

type QueryReply = { data: Record<string, unknown>[] | null; error: unknown; count: number | null };
type QueryCall = { table: string; method: string; args: unknown[] };
function queryHarness(
  reply: (table: string, from: number, to: number, calls: QueryCall[]) => QueryReply = () => ({ data: [], count: 0, error: null }),
  denied?: string,
) {
  let clients = 0;
  let guards = 0;
  const calls: QueryCall[] = [];
  const captured: Array<{ input: EconomicsInput; days: number; asOf: Date }> = [];
  const run = loadQuery({
    "@/lib/auth/helpers": { requireAdminUser: async () => {
      guards++;
      if (denied) throw new Error(`REDIRECT:${denied}`);
      return { id: "admin" };
    } },
    "@/lib/supabase/admin": { createAdminSupabaseClient: () => {
      assert.equal(guards, 1, "authorization must finish before service-role client construction");
      clients++;
      return { from: (table: string) => {
        const query: Record<string, (...args: unknown[]) => unknown> = {};
        for (const method of ["select", "gte", "lte", "order", "in", "eq"]) {
          query[method] = (...args) => { calls.push({ table, method, args }); return query; };
        }
        query.range = (from: unknown, to: unknown) => {
          calls.push({ table, method: "range", args: [from, to] });
          return Promise.resolve(reply(table, from as number, to as number, calls));
        };
        for (const method of ["insert", "upsert", "update", "delete", "rpc"]) {
          query[method] = () => { assert.fail(`economics query must never ${method}`); };
        }
        return query;
      }, rpc: () => { assert.fail("economics query must never call RPC"); } };
    } },
    "@/lib/leads/quality-reporting": { collectQualityPages },
    "@/lib/economics/metrics": { buildEconomicsReport: (input: EconomicsInput, days: number, asOf: Date) => {
      captured.push({ input, days, asOf });
      return buildEconomicsReport(input, days as 7 | 28 | 90, asOf);
    } },
  });
  return { run, calls, captured, clients: () => clients, guards: () => guards };
}

test("economics query denies public and professional access before any service-role client or database read", async () => {
  for (const role of ["public", "professional"]) {
    const harness = queryHarness(undefined, `/login?denied=${role}`);
    await assert.rejects(harness.run(28), /REDIRECT:\/login/);
    assert.equal(harness.guards(), 1);
    assert.equal(harness.clients(), 0);
    assert.deepEqual(harness.calls, []);
    assert.deepEqual(harness.captured, []);
  }
});

test("authorized query performs static read-only exact-count paged selects with no private fields", async () => {
  const harness = queryHarness();
  const result = await harness.run(7) as EconomicsReport;
  assert.equal(result.reconciliation.consistent, true);
  assert.equal(result.all.purchases, 0);
  assert.equal(result.all.finance?.net, 0);
  assert.equal(result.walletStock, 0);
  assert.equal(harness.clients(), 1);
  assert.equal(harness.captured.length, 1);
  assert.equal(harness.captured[0].days, 7);
  const tables = ["lead_purchases", "wallet_transactions", "professional_wallets", "lead_distribution_candidates"];
  assert.deepEqual([...new Set(harness.calls.filter((call) => call.method === "select").map((call) => call.table))].sort(), tables.sort());
  for (const call of harness.calls.filter((call) => call.method === "select")) {
    assert.equal(typeof call.args[0], "string");
    assert.equal((call.args[1] as { count: string }).count, "exact");
    assert.doesNotMatch(call.args[0] as string, /\*|feedback_note|first_name|last_name|email|phone|postal_code|house_number|description|metadata|reference/);
  }
  for (const table of tables) {
    const ranges = harness.calls.filter((call) => call.table === table && call.method === "range");
    assert.ok(ranges.length >= 1);
    for (const range of ranges) assert.deepEqual(range.args, [0, 499]);
  }
  const asOf = harness.captured[0].asOf.toISOString();
  assert.ok(harness.calls.some((call) => call.table === "wallet_transactions" && call.method === "lte" && call.args[0] === "created_at" && call.args[1] === asOf));
  assert.ok(!harness.calls.some((call) => call.table === "wallet_transactions" && ["gte", "eq", "in"].includes(call.method)));
  assert.ok(harness.calls.some((call) => call.table === "lead_purchases" && call.method === "gte" && call.args[0] === "purchased_at"));
  const query = source("lib/economics/queries.ts");
  assert.match(query, /import "server-only"/);
  assert.ok(query.indexOf("await requireAdminUser()") < query.indexOf("createAdminSupabaseClient()"));
  assert.match(query, /Promise\.all/);
  assert.doesNotMatch(query, /\.(insert|upsert|update|delete|rpc)\s*\(/);
  assert.doesNotMatch(query, /\.eq\("status", "purchased"\)/);
});

test("query pagination includes all ledger rows beyond API caps before calculating financial aggregates", async () => {
  const ledger = Array.from({ length: 1205 }, (_, i) => ({
    id: `ledger-${i}`, wallet_id: "wallet", professional_id: "professional", lead_id: null,
    lead_assignment_id: null, type: "credit_purchase", amount: 1, created_at: bought,
  }));
  const harness = queryHarness((table, from, to) => ({
    data: table === "wallet_transactions" ? ledger.slice(from, Math.min(to + 1, from + 200)) : [],
    count: table === "wallet_transactions" ? ledger.length : 0, error: null,
  }));
  await harness.run(90);
  assert.equal(harness.captured[0].input.transactions.length, 1205);
  assert.deepEqual(harness.calls.filter((call) => call.table === "wallet_transactions" && call.method === "range").map((call) => call.args), [
    [0, 499], [200, 699], [400, 899], [600, 1099], [800, 1299], [1000, 1499], [1200, 1699],
  ]);
  assert.equal(harness.captured[0].input.transactions.at(-1)?.id, "ledger-1204");
});

test("query count limits, database errors, missing counts and incomplete pages reject rather than publish partial finance", async () => {
  const failures: QueryReply[] = [
    { data: [], count: 50001, error: null },
    { data: [], count: null, error: null },
    { data: [], count: 0, error: { message: "private-database-detail" } },
    { data: [], count: 1, error: null },
    { data: [{ id: "unexpected" }], count: 0, error: null },
  ];
  for (const table of ["lead_purchases", "wallet_transactions", "professional_wallets", "lead_distribution_candidates"]) {
    for (const failure of failures) {
      const harness = queryHarness((name) => name === table ? failure : { data: [], count: 0, error: null });
      await assert.rejects(harness.run(28), (error: Error) => {
        assert.doesNotMatch(error.message, /private-database-detail/);
        return /niet beschikbaar|volledig|gewijzigd/.test(error.message);
      });
      assert.deepEqual(harness.captured, []);
    }
  }
});

test("query detects count changes during pagination instead of returning a moving partial ledger", async () => {
  const harness = queryHarness((table, from) => table === "wallet_transactions"
    ? { data: [{ id: `row-${from}` }], count: from === 0 ? 2 : 3, error: null }
    : { data: [], count: 0, error: null });
  await assert.rejects(harness.run(28), /gewijzigd/);
  assert.deepEqual(harness.captured, []);
});

test("query maps exact ledger links and numeric fields without coercing null or string prices into credits", async () => {
  const raw = {
    id: "purchase", lead_id: "lead", professional_id: "professional", lead_assignment_id: "assignment",
    price_credits: 100, commercial_type: "shared", status: "refunded", purchased_at: bought,
    wallet_transaction_id: "debit", refund_transaction_id: "refund", refunded_at: after(bought, 1),
    lead: { id: "lead", service_id: "roofing", subservice_slug: "dakreparatie", utm_source: "google", service: { name: "Dakwerk" } },
    professional: [{ id: "professional" }],
    assignment: { id: "assignment", lead_id: "lead", professional_id: "professional", progress_status: "won", reached_at: after(bought, 2) },
  };
  for (const price of [100, null, "100"]) {
    const harness = queryHarness((table) => table === "lead_purchases"
      ? { data: [{ ...raw, price_credits: price }], count: 1, error: null }
      : { data: [], count: 0, error: null });
    await harness.run(28);
    const row = harness.captured[0].input.purchases[0];
    assert.equal(row.status, "refunded");
    assert.equal(row.debitId, "debit");
    assert.equal(row.refundId, "refund");
    assert.equal(row.refundedAt, after(bought, 1));
    assert.equal(row.assignment?.id, "assignment");
    assert.equal(row.assignment?.professionalId, "professional");
    assert.equal(row.professionalExists, true);
    assert.equal(row.leadExists, true);
    assert.equal(row.serviceName, "Dakwerk");
    if (price === 100) assert.equal(row.price, 100);
    else assert.equal(Number.isNaN(row.price), true);
  }
});

test("query checks historical sold offered leads using minimal paged existence reads including refunded status", async () => {
  const harness = queryHarness((table, _from, _to, calls) => {
    if (table === "lead_distribution_candidates") return {
      data: [
        { id: "offer-one", lead_id: "shared-lead", offered_at: bought, offer_expires_at: after(bought, 48), purchased_at: null,
          run: { commercial_type: "shared" }, lead: { service_id: "roofing", service: { name: "Dakwerk" } } },
        { id: "offer-two", lead_id: "shared-lead", offered_at: bought, offer_expires_at: after(bought, 48), purchased_at: null,
          run: { commercial_type: "shared" }, lead: { service_id: "roofing", service: { name: "Dakwerk" } } },
      ], count: 2, error: null,
    };
    const latestSelect = calls.filter((call) => call.table === table && call.method === "select").at(-1);
    if (table === "lead_purchases" && latestSelect?.args[0] === "id,lead_id") {
      return { data: [{ id: "historic-refunded", lead_id: "shared-lead" }], count: 1, error: null };
    }
    return { data: [], count: 0, error: null };
  });
  await harness.run(28);
  assert.deepEqual(Array.from(harness.captured[0].input.distributedPurchasedLeadIds!), ["shared-lead"]);
  assert.equal(harness.captured[0].input.offers.length, 2);
  const historySelect = harness.calls.find((call) => call.table === "lead_purchases" && call.method === "select" && call.args[0] === "id,lead_id");
  assert.ok(historySelect);
  assert.equal((historySelect.args[1] as { count: string }).count, "exact");
  const leadFilter = harness.calls.find((call) => call.table === "lead_purchases" && call.method === "in" && call.args[0] === "lead_id");
  assert.deepEqual(Array.from(leadFilter!.args[1] as string[]), ["shared-lead"]);
  const statuses = harness.calls.find((call) => call.table === "lead_purchases" && call.method === "in" && call.args[0] === "status");
  assert.deepEqual(Array.from(statuses!.args[1] as string[]), ["purchased", "refunded"]);
});

test("authorized query maps realistic Supabase nested rows into a balanced fully refunded economics report", async () => {
  const assignment = {
    id: "assignment", lead_id: "lead", professional_id: "professional",
    progress_status: "won", contacted_at: after(bought, 1), reached_at: after(bought, 2),
    appointment_scheduled_at: after(bought, 3), outcome_at: after(bought, 4),
    reachability: "reached", appointment_status: "scheduled", mismatch_reason: null,
  };
  const rawPurchase = {
    id: "purchase", lead_id: "lead", professional_id: "professional", lead_assignment_id: "assignment",
    price_credits: 100, commercial_type: "exclusive", status: "refunded", purchased_at: bought,
    wallet_transaction_id: "debit", refund_transaction_id: "refund", refunded_at: after(bought, 1),
    lead: [{ id: "lead", service_id: "roofing", subservice_slug: "dakreparatie", utm_source: "google_ads", service: [{ name: "Dakwerk" }] }],
    professional: { id: "professional" }, assignment: [assignment],
  };
  const transaction = {
    wallet_id: "wallet", professional_id: "professional", lead_id: "lead", lead_assignment_id: "assignment",
  };
  const datasets: Record<string, Record<string, unknown>[]> = {
    lead_purchases: [rawPurchase],
    wallet_transactions: [
      { ...transaction, id: "seed", lead_id: null, lead_assignment_id: null, type: "credit_purchase", amount: 10000, created_at: ago(100) },
      { ...transaction, id: "debit", type: "lead_purchase", amount: -100, created_at: bought },
      { ...transaction, id: "refund", type: "refund", amount: 100, created_at: after(bought, 1) },
    ],
    professional_wallets: [{ id: "wallet", professional_id: "professional", cached_balance: 10000, updated_at: now.toISOString() }],
    lead_distribution_candidates: [{
      id: "offer", lead_id: "lead", offered_at: after(bought, -1), offer_expires_at: after(bought, 48),
      purchased_at: bought, run: [{ commercial_type: "exclusive" }],
      lead: { service_id: "roofing", service: { name: "Dakwerk" } },
    }],
  };
  const harness = queryHarness((table, from, to, calls) => {
    const selected = calls.filter((call) => call.table === table && call.method === "select").at(-1)?.args[0];
    const rows = table === "lead_purchases" && selected === "id,lead_id"
      ? [{ id: rawPurchase.id, lead_id: rawPurchase.lead_id }]
      : table === "lead_purchases" && selected === "id,wallet_transaction_id,refund_transaction_id,price_credits,status"
        ? [{
          id: rawPurchase.id, wallet_transaction_id: rawPurchase.wallet_transaction_id,
          refund_transaction_id: rawPurchase.refund_transaction_id, price_credits: rawPurchase.price_credits,
          status: rawPurchase.status,
        }]
        : datasets[table] ?? [];
    return { data: rows.slice(from, to + 1), count: rows.length, error: null };
  });
  const result = await harness.run(28) as EconomicsReport;
  assert.equal(result.reconciliation.consistent, true);
  assert.deepEqual(result.reconciliation.issues, []);
  assert.equal(result.all.purchases, 1);
  assert.equal(result.all.refund.count, 1);
  assert.equal(result.all.finance?.gross, 100);
  assert.equal(result.all.finance?.refunded, 100);
  assert.equal(result.all.finance?.net, 0);
  assert.equal(result.all.finance?.creditsPerWon, 0);
  assert.equal(result.walletStock, 10000);
  assert.equal(result.all.won.count, 1);
  assert.deepEqual(result.funnel.map((row) => row.count), [1, 1, 1, 1]);
  assert.equal(result.breakdowns.service[0].label, "Dakwerk");
  assert.equal(result.breakdowns.type[0].label, "Exclusief");
  assert.equal(result.breakdowns.source[0].label, "Zoekmachines");
  assert.equal(result.distribution.converted.count, 1);
  assert.equal(result.distribution.unsoldLeads, 0);
  const input = harness.captured[0].input;
  assert.deepEqual(Array.from(input.purchaseLinks!, (row) => ({
    id: row.id, debitId: row.debitId, refundId: row.refundId, price: row.price, status: row.status,
  })), [{ id: "purchase", debitId: "debit", refundId: "refund", price: 100, status: "refunded" }]);
  assert.equal(input.wallets[0].balance, 10000);
  assert.equal(input.transactions.find((row) => row.id === "debit")?.assignmentId, "assignment");
  assert.equal(input.offers[0].expiresAt, after(bought, 48));
  assert.equal(input.purchases[0].assignment?.outcomeAt, after(bought, 4));
  assert.equal(input.purchases[0].subservice, null);
});
