import { leadQualityLossReasonValues, leadMismatchReasonValues } from "./quality-taxonomy.ts";
import { declineReasonValues } from "../validation/distribution.ts";

export const mismatchReasons = leadMismatchReasonValues;
export const declineReasons = declineReasonValues;
export const unknownRegion = "Onbekend";
const regions = ["Drenthe", "Flevoland", "Friesland", "Gelderland", "Groningen", "Limburg", "Noord-Brabant", "Noord-Holland", "Overijssel", "Utrecht", "Zeeland", "Zuid-Holland"];
const unreachableValues = ["no_answer", "invalid_phone", "invalid_email", "unreachable_other"];

export function safeQualitySource(value: string | null | undefined) {
  const source = value?.trim().toLowerCase();
  if (["google", "google_ads", "bing", "bing_ads"].includes(source ?? "")) return "Zoekmachines";
  if (["facebook", "instagram", "meta", "meta_ads", "linkedin", "tiktok"].includes(source ?? "")) return "Social";
  if (["email", "newsletter"].includes(source ?? "")) return "E-mail";
  if (source === "direct") return "Direct";
  if (["referral", "partner"].includes(source ?? "")) return "Verwijzing";
  return "Onbekend / overig";
}

function safeRegion(value?: string | null) {
  return regions.includes(value ?? "") ? value! : unknownRegion;
}

export type QualityFilters = {
  days: 7 | 28 | 90;
  service: string;
  region: string;
  type: "" | "shared" | "exclusive";
  outcome: "" | "won" | "lost" | "open";
  mismatch: string;
  sort: "newest" | "mostfeedback" | "mismatch" | "refunds";
  page: number;
};

export function parseQualityFilters(params: Record<string, string | string[] | undefined>): QualityFilters {
  const get = (key: string) => typeof params[key] === "string" ? params[key] as string : "";
  const days = Number(get("days"));
  const page = Number(get("page"));
  return {
    days: days === 7 || days === 90 ? days : 28,
    service: /^[a-f0-9-]{36}$/i.test(get("service")) ? get("service") : "",
    region: [...regions, unknownRegion].includes(get("region")) ? get("region") : "",
    type: get("type") === "shared" || get("type") === "exclusive" ? get("type") as QualityFilters["type"] : "",
    outcome: ["won", "lost", "open"].includes(get("outcome")) ? get("outcome") as QualityFilters["outcome"] : "",
    mismatch: [...mismatchReasons, "any"].includes(get("mismatch")) ? get("mismatch") : "",
    sort: ["mostfeedback", "mismatch", "refunds"].includes(get("sort")) ? get("sort") as QualityFilters["sort"] : "newest",
    page: Number.isSafeInteger(page) && page > 0 ? Math.min(page, 10000) : 1,
  };
}

export type QualityAssignment = {
  progressStatus?: string | null;
  contactedAt?: string | null;
  reachedAt?: string | null;
  appointmentScheduledAt?: string | null;
  outcomeAt?: string | null;
  reachability?: string | null;
  appointmentStatus?: string | null;
  mismatchReason?: string | null;
  lossReason?: string | null;
};

// These identifiers are for server-side joins only; the report never returns them.
export type QualityPurchase = {
  id: string;
  leadId: string;
  professionalId: string;
  status: string;
  purchasedAt: string;
  type: string;
  reference: string;
  serviceId: string;
  serviceName: string;
  region?: string | null;
  utmSource?: string | null;
  assignment?: QualityAssignment | null;
};
export type QualityCorrection = { id: string; leadId: string | null; professionalId: string; type: string; createdAt: string };
export type QualityOffer = { id: string; offeredAt: string | null; declinedAt?: string | null; declineReason?: string | null; serviceId: string; region?: string | null; type: string };

export type QualityMetric = { count: number; denominator: number; percent: number | null };
export type QualityTableRow = {
  reference: string; service: string; region: string; type: string;
  purchaseCount: number; contacted: number; won: number; lost: number; mismatch: number; refunds: number; corrections: number; feedback: number;
};

// Count verification detects API caps and concurrent changes instead of returning a partial report.
export async function collectQualityPages<T>(fetchPage: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: unknown; count: number | null }>): Promise<T[]> {
  const rows: T[] = [];
  let expected: number | null = null;
  do {
    const result = await fetchPage(rows.length, rows.length + 499);
    if (result.error || result.count === null || result.count > 50000) throw new Error("Kwaliteitsrapport niet beschikbaar. Kies een kortere periode of probeer opnieuw.");
    if (expected !== null && expected !== result.count) throw new Error("Het rapport is gewijzigd tijdens het laden. Probeer opnieuw.");
    expected = result.count;
    const page = result.data ?? [];
    if (!page.length && rows.length < expected) throw new Error("Het rapport kon niet volledig worden geladen.");
    rows.push(...page);
    if (rows.length > expected) throw new Error("Het rapport is gewijzigd tijdens het laden. Probeer opnieuw.");
  } while (rows.length < expected);
  return rows;
}

function metric(count: number, denominator: number): QualityMetric {
  return { count, denominator, percent: denominator >= 10 ? Math.round(count / denominator * 1000) / 10 : null };
}

function timestamp(value?: string | null) {
  const result = value ? Date.parse(value) : NaN;
  return Number.isFinite(result) ? result : null;
}

function eventTime(value: string | null | undefined, purchase: number) {
  const result = timestamp(value);
  return result !== null && result >= purchase ? result : null;
}

function outcome(purchase: QualityPurchase) {
  const status = purchase.assignment?.progressStatus;
  return status === "won" || status === "lost" ? status : "open";
}

function dimensionMatches(row: { serviceId: string; region?: string | null; type: string }, filters: QualityFilters) {
  return (!filters.service || row.serviceId === filters.service)
    && (!filters.region || safeRegion(row.region) === filters.region)
    && (!filters.type || row.type === filters.type);
}

function median(values: number[]) {
  if (!values.length) return { hours: null, sample: 0 };
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  const milliseconds = sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
  return { hours: Math.round(milliseconds / 360000) / 10, sample: values.length };
}

function groupBy<T>(rows: T[], key: (row: T) => string) {
  const groups = new Map<string, T[]>();
  for (const row of rows) {
    const label = key(row);
    const group = groups.get(label);
    if (group) group.push(row);
    else groups.set(label, [row]);
  }
  return groups;
}

export function buildQualityReport(
  input: { purchases: QualityPurchase[]; corrections?: QualityCorrection[]; offers?: QualityOffer[] },
  filters: QualityFilters,
  asOf = new Date(),
) {
  const end = asOf.getTime();
  const start = end - filters.days * 86400000;
  const cohort = [...new Map(input.purchases.map((purchase) => [purchase.id, purchase])).values()].filter((purchase) => {
    const time = timestamp(purchase.purchasedAt);
    return ["purchased", "refunded"].includes(purchase.status) && time !== null && time >= start && time <= end;
  });
  const purchases = cohort.filter((purchase) => dimensionMatches(purchase, filters)
    && (!filters.outcome || outcome(purchase) === filters.outcome)
    && (!filters.mismatch || (filters.mismatch === "any" ? mismatchReasons.includes(purchase.assignment?.mismatchReason as typeof mismatchReasons[number]) : purchase.assignment?.mismatchReason === filters.mismatch)));
  const correctionPairs = new Map<string, number>();
  for (const entry of new Map((input.corrections ?? []).map((entry) => [entry.id, entry])).values()) {
    const time = timestamp(entry.createdAt);
    if (entry.type !== "correction" || !entry.leadId || time === null || time > end) continue;
    const key = `${entry.leadId}:${entry.professionalId}`;
    correctionPairs.set(key, Math.max(correctionPairs.get(key) ?? -Infinity, time));
  }
  const observations = purchases.map((purchase) => {
    const purchased = timestamp(purchase.purchasedAt)!;
    const assignment = purchase.assignment;
    const validTime = (value?: string | null) => {
      const time = eventTime(value, purchased);
      return time !== null && time <= end ? time : null;
    };
    const contact = validTime(assignment?.contactedAt);
    const reached = validTime(assignment?.reachedAt);
    const appointment = validTime(assignment?.appointmentScheduledAt);
    const resolved = validTime(assignment?.outcomeAt);
    const funnelContact = contact !== null;
    const funnelReached = funnelContact && reached !== null && reached >= contact!;
    const funnelAppointment = funnelReached && appointment !== null && appointment >= reached!;
    return {
      purchase, contact, reached, appointment, resolved,
      contacted: contact !== null, reachedEvidence: reached !== null,
      unreachable: unreachableValues.includes(assignment?.reachability ?? ""),
      invalidPhone: assignment?.reachability === "invalid_phone",
      invalidEmail: assignment?.reachability === "invalid_email",
      invalidContact: assignment?.reachability === "invalid_phone" || assignment?.reachability === "invalid_email",
      appointmentEvidence: appointment !== null,
      won: outcome(purchase) === "won", lost: outcome(purchase) === "lost",
      mismatch: mismatchReasons.includes(assignment?.mismatchReason as typeof mismatchReasons[number]),
      refund: purchase.status === "refunded",
      correction: (correctionPairs.get(`${purchase.leadId}:${purchase.professionalId}`) ?? -Infinity) >= purchased,
      feedback: Boolean(assignment && (
        ["reached", ...unreachableValues].includes(assignment.reachability ?? "")
        || ["scheduled", "completed", "cancelled"].includes(assignment.appointmentStatus ?? "")
        || mismatchReasons.includes(assignment.mismatchReason as typeof mismatchReasons[number])
        || ["won", "lost"].includes(assignment.progressStatus ?? "")
        || contact !== null || reached !== null || appointment !== null
      )),
      funnelContact, funnelReached, funnelAppointment,
      funnelWon: funnelAppointment && outcome(purchase) === "won" && resolved !== null && resolved >= appointment!,
    };
  });
  type Observation = typeof observations[number];
  const count = (key: keyof Observation, rows = observations) => rows.filter((row) => row[key] === true).length;
  const denominator = purchases.length;
  const metrics = {
    contact: metric(count("contacted"), denominator),
    reached: metric(count("reachedEvidence"), denominator),
    unreachable: metric(count("unreachable"), denominator),
    invalidPhone: metric(count("invalidPhone"), denominator),
    invalidEmail: metric(count("invalidEmail"), denominator),
    invalidContact: metric(count("invalidContact"), denominator),
    appointment: metric(count("appointmentEvidence"), denominator),
    won: metric(count("won"), denominator),
    lost: metric(count("lost"), denominator),
    mismatch: metric(count("mismatch"), denominator),
    refund: metric(count("refund"), denominator),
    correction: metric(count("correction"), denominator),
  };
  const breakdown = (key: (purchase: QualityPurchase) => string) => {
    const groups = groupBy(observations, (row) => key(row.purchase));
    return [...groups].map(([label, rows]) => ({
      label, assignments: rows.length,
      contact: metric(count("contacted", rows), rows.length),
      unreachable: metric(count("unreachable", rows), rows.length),
      invalidContact: metric(count("invalidContact", rows), rows.length),
      appointment: metric(count("appointmentEvidence", rows), rows.length),
      won: metric(count("won", rows), rows.length),
      lost: metric(count("lost", rows), rows.length),
      mismatch: metric(count("mismatch", rows), rows.length),
      refund: metric(count("refund", rows), rows.length),
      correction: metric(count("correction", rows), rows.length),
    })).sort((a, b) => b.assignments - a.assignments || a.label.localeCompare(b.label));
  };
  const leadGroups = groupBy(observations, (row) => row.purchase.leadId);
  const table = [...leadGroups.values()].map((rows) => {
    const purchase = rows[0].purchase;
    const type = new Set(rows.map((row) => row.purchase.type)).size > 1 ? "Gemengd" : purchase.type === "exclusive" ? "Exclusief" : "Gedeeld";
    return {
      newest: Math.max(...rows.map((row) => timestamp(row.purchase.purchasedAt)!)),
      reference: /^VC-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{8}$/.test(purchase.reference) ? purchase.reference : "Referentie onbekend",
      service: purchase.serviceName, region: safeRegion(purchase.region), type,
      purchaseCount: rows.length, contacted: count("contacted", rows), won: count("won", rows), lost: count("lost", rows),
      mismatch: count("mismatch", rows), refunds: count("refund", rows), corrections: count("correction", rows), feedback: count("feedback", rows),
    };
  });
  table.sort((a, b) => {
    const key = filters.sort === "mostfeedback" ? "feedback" : filters.sort === "mismatch" ? "mismatch" : filters.sort === "refunds" ? "refunds" : "newest";
    return b[key] - a[key] || b.newest - a.newest || a.reference.localeCompare(b.reference);
  });
  const pages = Math.max(1, Math.ceil(table.length / 25));
  const page = Math.min(filters.page, pages);
  const offers = [...new Map((input.offers ?? []).map((offer) => [offer.id, offer])).values()].filter((offer) => {
    const time = timestamp(offer.offeredAt);
    return time !== null && time >= start && time <= end && dimensionMatches(offer, filters);
  });
  const declined = offers.filter((offer) => {
    const time = timestamp(offer.declinedAt);
    return time !== null && time >= timestamp(offer.offeredAt)! && time <= end;
  });
  const validDeclines = declined.filter((offer) => declineReasons.includes(offer.declineReason as typeof declineReasons[number]));
  return {
    uniqueLeads: leadGroups.size, purchasedAssignments: denominator,
    excludedCancelled: input.purchases.filter((purchase) => purchase.status === "cancelled" && (timestamp(purchase.purchasedAt) ?? 0) >= start && (timestamp(purchase.purchasedAt) ?? Infinity) <= end && dimensionMatches(purchase, filters)).length,
    metrics,
    funnel: { purchased: denominator, contacted: count("funnelContact"), reached: count("funnelReached"), appointment: count("funnelAppointment"), won: count("funnelWon") },
    funnelRates: {
      purchased: metric(denominator, denominator), contacted: metric(count("funnelContact"), denominator),
      reached: metric(count("funnelReached"), denominator), appointment: metric(count("funnelAppointment"), denominator),
      won: metric(count("funnelWon"), denominator),
    },
    feedbackAssignments: count("feedback"),
    contactSignalCohorts: [...groupBy(observations, (row) => new Date(timestamp(row.purchase.purchasedAt)!).toISOString().slice(0, 10))]
      .map(([date, rows]) => ({
        date, assignments: rows.length, invalidPhone: metric(count("invalidPhone", rows), rows.length),
        invalidEmail: metric(count("invalidEmail", rows), rows.length), invalidContact: metric(count("invalidContact", rows), rows.length),
      })).sort((a, b) => b.date.localeCompare(a.date)),
    missingEvidence: {
      contact: denominator - count("contacted"), reached: denominator - count("reachedEvidence"),
      appointment: denominator - count("appointmentEvidence"),
      outcome: observations.filter((row) => (row.won || row.lost) && row.resolved === null).length,
    },
    timing: {
      contact: median(observations.flatMap((row) => row.contact === null ? [] : [row.contact - timestamp(row.purchase.purchasedAt)!])),
      appointment: median(observations.flatMap((row) => row.appointment === null ? [] : [row.appointment - timestamp(row.purchase.purchasedAt)!])),
      outcome: median(observations.flatMap((row) => row.resolved === null || (!row.won && !row.lost) ? [] : [row.resolved - timestamp(row.purchase.purchasedAt)!])),
    },
    breakdowns: { service: breakdown((purchase) => purchase.serviceName), region: breakdown((purchase) => safeRegion(purchase.region)), source: breakdown((purchase) => safeQualitySource(purchase.utmSource)), type: breakdown((purchase) => purchase.type === "exclusive" ? "Exclusief" : "Gedeeld") },
    mismatchReasons: mismatchReasons.map((reason) => ({ reason, ...metric(purchases.filter((purchase) => purchase.assignment?.mismatchReason === reason).length, denominator) })),
    lossReasons: leadQualityLossReasonValues.map((reason) => ({ reason, ...metric(purchases.filter((purchase) => outcome(purchase) === "lost" && purchase.assignment?.lossReason === reason).length, denominator) })),
    unknownLossReason: metric(purchases.filter((purchase) => outcome(purchase) === "lost"
      && !leadQualityLossReasonValues.includes(purchase.assignment?.lossReason as typeof leadQualityLossReasonValues[number])).length, denominator),
    distribution: {
      offers: offers.length, declined: metric(declined.length, offers.length),
      unknownReason: declined.length - validDeclines.length,
      reasons: declineReasons.map((reason) => ({ reason, ...metric(validDeclines.filter((offer) => offer.declineReason === reason).length, offers.length) })),
    },
    options: {
      services: [...new Map(cohort.map((purchase) => [purchase.serviceId, { value: purchase.serviceId, label: purchase.serviceName }])).values()].sort((a, b) => a.label.localeCompare(b.label)),
      regions: [...new Set(cohort.map((purchase) => safeRegion(purchase.region)))].sort(),
    },
    table: table.slice((page - 1) * 25, page * 25).map((row): QualityTableRow => ({
      reference: row.reference, service: row.service, region: row.region, type: row.type,
      purchaseCount: row.purchaseCount, contacted: row.contacted, won: row.won, lost: row.lost,
      mismatch: row.mismatch, refunds: row.refunds, corrections: row.corrections, feedback: row.feedback,
    })),
    page, pages,
  };
}
