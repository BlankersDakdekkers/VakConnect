import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { canProfessionalViewLeadContact, getSafeIntakeAnswers, getSafeLeadPreview } from "../lib/commercial/privacy.ts";
import { getCommercialExplanation, getMatchExplanation } from "../lib/commercial/presentation.ts";
import { isValidLeadProgressTransition } from "../lib/leads/progress.ts";

const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const queries = source("lib/commercial/queries.ts");
const detail = source("app/(professional)/vakman/aanvragen/[id]/page.tsx");
const cards = source("app/(professional)/vakman/aanvragen/page.tsx");

test("preview payload withholds all free text, full postcodes and private image metadata", () => {
  const preview = getSafeLeadPreview({
    description: "Ik ben Jan Jansen, bel 0612345678 of mail jan@example.com. Adres: Kerkstraat 12.",
    postalCode: "1234 ab",
    preferredTiming: "Bel Jan op 0612345678",
    images: [{ id: "image", storage_path: "private/jan@example.com.jpg", url: "https://private.invalid", original_filename: "Jan.jpg" }],
  });
  assert.equal(preview.postalCodePrefix, "1234");
  assert.equal(preview.planning, "Planning niet ingevuld");
  assert.equal(preview.imageCount, 1);
  assert.equal(preview.hasDescription, true);
  assert.doesNotMatch(JSON.stringify(preview), /Jan|0612345678|jan@example|Kerkstraat|1234AB|private\/|https:/);
  assert.match(preview.summary, /contactgegevens kunnen bevatten/);
});

test("planning and location are validated rather than echoed", () => {
  for (const value of [null, "", "constructor", "toString", "unknown-city", "0612345678"]) {
    const preview = getSafeLeadPreview({ description: "", postalCode: value, preferredTiming: value, images: null });
    assert.equal(preview.postalCodePrefix, null);
    assert.equal(preview.planning, "Planning niet ingevuld");
    assert.equal(preview.imageCount, 0);
    assert.equal(preview.hasDescription, false);
  }
  const labels = { asap: "Zo snel mogelijk", few_weeks: "Binnen enkele weken", one_to_three_months: "Binnen 1 tot 3 maanden", later: "Later", unknown: "Planning nog niet zeker" };
  for (const [value, label] of Object.entries(labels)) {
    assert.equal(getSafeLeadPreview({ description: "", postalCode: "1234AB", preferredTiming: value, images: [] }).planning, label);
  }
});

test("only configured choice labels can cross the pre-purchase intake boundary", () => {
  const question = { question: "Type dak", type: "select", service_question_options: [{ value: "flat", label: "Plat dak" }, { value: "pitched", label: "Schuin dak" }] };
  assert.deepEqual(getSafeIntakeAnswers([
    { question, answer_text: "flat" },
    { question: { ...question, type: "multiselect" }, answer_json: ["flat", "pitched"] },
    { question: { ...question, type: "textarea" }, answer_text: "Bel Jan: 0612345678" },
    { question: { ...question, type: "text" }, answer_text: "jan@example.com" },
    { question: { ...question, type: "number" }, answer_number: 612345678 },
    { question, answer_text: "jan@example.com" },
    { question: { ...question, type: "multiselect" }, answer_json: ["flat", "jan@example.com"] },
    null,
  ]), [
    { question: "Type dak", answer: "Plat dak" },
    { question: "Type dak", answer: "Plat dak, Schuin dak" },
  ]);
});

test("fit explanations use passed stored criteria, never labels or internal weights", () => {
  const explanations = getMatchExplanation([
    { code: "service_link_active", passed: true, points: 35, label: "jan@example.com" },
    { code: "postcode_prefix_match", passed: true },
    { code: "professional_active", passed: false },
    { code: "quality_score", passed: true, points: 100 },
    { code: "service_link_active", passed: true },
    { code: "constructor", passed: true },
    { code: "professional_active", passed: "true" },
    null,
  ]);
  assert.deepEqual(explanations, ["Past bij een dienst die je aanbiedt.", "Het postcodegebied valt binnen je ingestelde werkgebied."]);
  assert.deepEqual(getMatchExplanation(null), []);
  assert.doesNotMatch(JSON.stringify(explanations), /35|100|jan@example|Perfecte/);
});

test("shared/exclusive copy explains enforced buyer slots without promising sole access or work", () => {
  assert.match(getCommercialExplanation("exclusive"), /maximaal één koperslot/);
  assert.match(getCommercialExplanation("exclusive"), /geen opdracht/);
  assert.match(getCommercialExplanation("shared"), /meerdere passende vakmannen/);
  assert.doesNotMatch(getCommercialExplanation("exclusive"), /Jij bent de enige/);
});

test("contact unlock still requires a purchase or accepted direct assignment", () => {
  for (const purchaseStatus of ["refunded", "cancelled", null] as const) {
    assert.equal(canProfessionalViewLeadContact({ purchaseStatus, assignmentStatus: "accepted", assignmentPurchaseLinked: true }), false);
  }
  assert.equal(canProfessionalViewLeadContact({ purchaseStatus: "purchased", assignmentPurchaseLinked: true }), true);
  assert.equal(canProfessionalViewLeadContact({ assignmentStatus: "pending" }), false);
  assert.equal(canProfessionalViewLeadContact({ assignmentStatus: "accepted", assignmentPurchaseLinked: false }), true);
});

test("list and detail reuse pricing, safe preview, owner-scoped matches and latest offers", () => {
  assert.equal((queries.match(/getSafeLeadPreview\(\{/g) ?? []).length, 2);
  assert.match(queries, /getSafeIntakeAnswers\(leadRow\.lead_answers\)/);
  assert.doesNotMatch(queries, /summarizeLeadDescription\(String/);
  assert.match(queries, /if \(!candidateMap\.has\(String\(row\.lead_id\)\)\)/);
  assert.match(queries, /if \(!match && !assignment && !purchase && !offer\)/);
  assert.match(queries, /paidCredits: purchase\?\.status === "purchased" \? toNumber\(purchase\.price_credits\) : null/);
  assert.match(cards, /formatCredits\(lead\.priceCredits\)/);
  assert.match(detail, /Ontgrendel voor \{formatCredits\(marketLead\.commercial\.priceCredits\)\}/);
  assert.doesNotMatch(`${cards}${detail}`, /preview\.leadScore|Score \d|Resterende plekken|Hot lead|Veel interesse/);
});

test("purchase stays authoritative, pending-disabled, and refreshes errors as well as success", () => {
  const action = source("lib/commercial/actions.ts").split("export async function applyAdminWalletMutationAction")[0];
  assert.match(action, /await requireProfessionalUser\(\)/);
  assert.match(action, /supabase\.rpc\("purchase_lead"/);
  assert.doesNotMatch(action, /formData\.get\("price|wallet_transactions.*insert/);
  assert.match(action, /if \(error\) \{\s*revalidatePath\("\/vakman\/aanvragen"\)/);
  assert.match(action, /LEAD_OFFER_NOT_ACTIVE/);
  assert.match(detail, /!marketLead\.distributionOffer\.offerTermExpired/);
  assert.match(detail, /marketLead\.mode === "preview" && marketLead\.commercial\.balanceAfterPurchase >= 0/);
  assert.match(source("components/ui/submit-button.tsx"), /disabled=\{pending \|\| disabled\}/);
});

test("post-purchase next step, contact links, labels and existing progress transitions are explicit", () => {
  assert.match(detail, /href="#contactgegevens"/);
  assert.match(detail, /href=\{`tel:/);
  assert.match(detail, /href=\{`mailto:/);
  assert.match(detail, /htmlFor="progress-status"/);
  assert.match(detail, /htmlFor="loss-reason"/);
  assert.match(detail, /isValidLeadProgressTransition/);
  assert.equal(isValidLeadProgressTransition("new", "contacted"), true);
  assert.equal(isValidLeadProgressTransition("new", "won"), false);
  assert.equal(isValidLeadProgressTransition("quote_sent", "lost"), true);
  assert.equal(isValidLeadProgressTransition("lost", "contacted"), false);
});

test("dashboard notifications link to the request and expired historical offers retain a closed page", () => {
  assert.match(source("app/(professional)/vakman/page.tsx"), /if \(eventType\.startsWith\("lead_"\) && leadId\) return `\/vakman\/aanvragen\/\$\{leadId\}`/);
  assert.match(source("app/(professional)/vakman/notificaties/page.tsx"), /notification\.lead_id.*\/vakman\/aanvragen\/\$\{notification\.lead_id\}/);
  assert.match(queries, /hasActiveOffer \? "preview" : "closed"/);
  assert.match(detail, /Dit aanbod is gesloten of verlopen/);
});
