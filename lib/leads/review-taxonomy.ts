import { z } from "zod";

export const reviewStatuses = ["open", "in_review", "resolved", "dismissed"] as const;
export const reviewStatusLabels = { open: "Open", in_review: "In onderzoek", resolved: "Afgehandeld", dismissed: "Gesloten zonder vervolg" };
export const reviewSignals = [
  "wrong_service", "wrong_region", "incorrect_information", "already_completed", "duplicate", "unreachable",
  "invalid_contact", "profile_mismatch", "other", "refund", "correction", "repeated_complaint",
  "negative_outcomes", "stale_open", "conflicting_feedback", "financial_conflict", "data_issue",
] as const;
export const reviewSignalLabels: Record<string, string> = {
  wrong_service: "Verkeerde dienst", wrong_region: "Verkeerde regio", incorrect_information: "Onjuiste informatie",
  already_completed: "Al uitgevoerd", duplicate: "Dubbel", unreachable: "Niet bereikbaar", invalid_contact: "Ongeldig contact",
  profile_mismatch: "Profielmismatch", other: "Overige mismatch", refund: "Refund", correction: "Walletcorrectie",
  repeated_complaint: "Herhaalde klachten", negative_outcomes: "Meerdere negatieve uitkomsten", stale_open: "Lang open",
  conflicting_feedback: "Tegenstrijdige feedback", financial_conflict: "Financieel conflict", data_issue: "Ontbrekend of tegenstrijdig bewijs",
};
export const reviewResolutions = [
  "valid_lead", "incorrect_contact", "duplicate", "wrong_service", "wrong_region", "already_completed",
  "refund_approved", "refund_not_applicable", "insufficient_evidence", "data_issue", "other",
] as const;
export const reviewResolutionLabels: Record<(typeof reviewResolutions)[number], string> = {
  valid_lead: "Geldige lead", incorrect_contact: "Onjuiste contactgegevens", duplicate: "Dubbele lead",
  wrong_service: "Verkeerde dienst", wrong_region: "Verkeerde regio", already_completed: "Al uitgevoerd",
  refund_approved: "Refund goedgekeurd (apart uitvoeren)", refund_not_applicable: "Refund niet van toepassing",
  insufficient_evidence: "Onvoldoende bewijs", data_issue: "Dataprobleem", other: "Anders",
};
export const reviewSources = ["Zoekmachines", "Social", "E-mail", "Direct", "Verwijzing", "Onbekend / overig"] as const;
export const reviewSorts = ["priority", "newest", "oldest", "most_signals", "refund"] as const;
export const reviewUuidSchema = z.string().uuid();
const nullableText = z.preprocess((value) => typeof value === "string" ? value.trim() || null : value, z.string().max(2000).nullable());
export const reviewMutationSchema = z.object({
  leadId: reviewUuidSchema,
  expectedUpdatedAt: z.preprocess((value) => value === "" || value === undefined ? null : value, z.iso.datetime({ offset: true }).nullable()),
  status: z.enum(reviewStatuses),
  resolution: z.preprocess((value) => value === "" || value === undefined ? null : value, z.enum(reviewResolutions).nullable()),
  note: nullableText,
  confirmed: z.boolean(),
}).superRefine((value, context) => {
  if (["resolved", "dismissed"].includes(value.status) && (!value.resolution || !value.note || !value.confirmed)) {
    context.addIssue({ code: "custom", message: "Kies een reden, voeg een notitie toe en bevestig de administratieve afhandeling." });
  }
  if (["open", "in_review"].includes(value.status) && value.resolution) {
    context.addIssue({ code: "custom", message: "Een afhandelreden hoort alleen bij afsluiten." });
  }
});

export type ReviewFilters = {
  days: 7 | 28 | 90; status: (typeof reviewStatuses)[number] | "all"; signal: string; service: string;
  source: string; type: "" | "shared" | "exclusive"; refund: boolean; search: string; sort: (typeof reviewSorts)[number]; page: number;
};
export function parseReviewFilters(input: Record<string, string | string[] | undefined>): ReviewFilters {
  const single = (key: string) => typeof input[key] === "string" ? input[key].trim() : "";
  const choice = <T extends string>(key: string, values: readonly T[], fallback: T): T => {
    const value = single(key);
    return values.includes(value as T) ? value as T : fallback;
  };
  const days = single("days");
  const page = single("page");
  const search = single("search");
  return {
    days: days === "7" ? 7 : days === "90" ? 90 : 28,
    status: choice("status", [...reviewStatuses, "all"], "open"), signal: choice("signal", ["", ...reviewSignals], ""),
    service: reviewUuidSchema.safeParse(single("service")).success ? single("service") : "",
    source: choice("source", ["", ...reviewSources], ""), type: choice("type", ["", "shared", "exclusive"], ""),
    refund: single("refund") === "true",
    search: reviewUuidSchema.safeParse(search).success || /^VC-[A-Z0-9]{1,32}$/i.test(search) ? search : "",
    sort: choice("sort", reviewSorts, "priority"), page: /^[1-9]\d{0,5}$/.test(page) ? Math.min(Number(page), 100000) : 1,
  };
}
export function reviewPageHref(filters: ReviewFilters, page: number) {
  return `/admin/leadkwaliteit/review?${new URLSearchParams(Object.entries({ ...filters, page }).map(([key, value]) => [key, String(value)]))}`;
}
export function reviewErrorMessage(message: string) {
  if (message.includes("QUALITY_REVIEW_STALE_WRITE")) return "Deze review is intussen gewijzigd. Vernieuw de pagina en controleer de nieuwste notities voordat je opnieuw opslaat.";
  if (message.includes("QUALITY_REVIEW_NOT_FOUND") || message.includes("LEAD_NOT_FOUND")) return "Deze lead is niet beschikbaar. Ga terug naar de werklijst.";
  return "De review kon niet worden opgeslagen. Controleer je invoer en probeer opnieuw.";
}
