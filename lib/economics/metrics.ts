import { safeQualitySource, mismatchReasons, type QualityAssignment } from "../leads/quality-reporting.ts";

export const economicsDefinitions = {
  minimumSample: 10,
  maturityDays: 28,
  denominator: "Alle aankopen met status purchased of refunded in het aankoopcohort, inclusief refunds.",
  creditsPerOutcome: "Net behouden cohortcredits / aantal vastgelegde uitkomsten; geen ROI.",
  maturity: "Minstens 28 dagen sinds aankoop; voorlopige observatiegrens, geen voorspelling.",
} as const;

export function parseEconomicsDays(value: string | string[] | undefined): 7 | 28 | 90 {
  return value === "7" ? 7 : value === "90" ? 90 : 28;
}

export type EconomicsPurchase = {
  id: string; leadId: string; professionalId: string; assignmentId: string | null;
  price: number; type: string; status: string; purchasedAt: string;
  debitId: string; refundId: string | null; refundedAt: string | null;
  serviceId: string; serviceName: string; subservice: string | null; source: string | null;
  leadExists: boolean; professionalExists: boolean;
  assignment: (QualityAssignment & { id: string; leadId: string; professionalId: string }) | null;
};
export type EconomicsTransaction = {
  id: string; walletId: string; professionalId: string; leadId: string | null;
  assignmentId: string | null; type: string; amount: number; createdAt: string;
};
export type EconomicsWallet = { id: string; professionalId: string; balance: number; updatedAt: string };
export type EconomicsOffer = {
  id: string; leadId: string; offeredAt: string; expiresAt: string | null;
  purchasedAt: string | null; type: string; serviceId: string; serviceName: string;
};
export type EconomicsInput = {
  purchases: EconomicsPurchase[]; transactions: EconomicsTransaction[];
  wallets: EconomicsWallet[]; offers: EconomicsOffer[];
  distributedPurchasedLeadIds?: string[];
  purchaseLinks?: Array<Pick<EconomicsPurchase, "id" | "debitId" | "refundId" | "price" | "status">>;
};
export type EconomicsRate = { count: number; denominator: number; percent: number | null };
export type EconomicsFinance = {
  gross: number; refunded: number; corrections: number; extraCharges: number; net: number;
  average: number | null; creditsPerReached: number | null;
  creditsPerAppointment: number | null; creditsPerWon: number | null;
};
export type EconomicsSummary = {
  purchases: number; uniqueLeads: number; open: number; lost: number;
  refund: EconomicsRate; partialCorrection: EconomicsRate;
  reached: EconomicsRate; appointment: EconomicsRate; won: EconomicsRate; mismatch: EconomicsRate;
  quality: Record<string, EconomicsRate>; sufficientData: boolean; finance: EconomicsFinance | null;
};
export type EconomicsRow = EconomicsSummary & { label: string };

const day = 86400000;
const time = (value: string | null | undefined) => value ? Date.parse(value) : NaN;
const divide = (value: number, denominator: number) => denominator > 0 ? value / denominator : null;
function rate(count: number, denominator: number): EconomicsRate {
  return { count, denominator, percent: denominator >= economicsDefinitions.minimumSample ? count / denominator * 100 : null };
}
function quantile(sorted: number[], fraction: number) {
  if (!sorted.length) return null;
  const position = (sorted.length - 1) * fraction;
  const lower = Math.floor(position);
  return sorted[lower] + (sorted[Math.ceil(position)] - sorted[lower]) * (position - lower);
}

export function buildEconomicsReport(input: EconomicsInput, days: 7 | 28 | 90, asOf = new Date()) {
  const end = asOf.getTime();
  const start = end - days * day;
  const issues = new Map<string, number>();
  const attention = (label: string) => issues.set(label, (issues.get(label) ?? 0) + 1);
  function unique<T extends { id: string }>(rows: T[], label: string) {
    const result = new Map<string, T>();
    for (const row of rows) {
      if (!row.id || result.has(row.id)) attention(label);
      else result.set(row.id, row);
    }
    return [...result.values()];
  }
  const transactions = unique(input.transactions, "Dubbele of ontbrekende ledgeridentificatie");
  const wallets = unique(input.wallets, "Dubbele of ontbrekende walletidentificatie");
  const rawPurchases = unique(input.purchases, "Dubbele of ontbrekende aankoopidentificatie");
  const offers = unique(input.offers, "Dubbele of ontbrekende aanbodidentificatie");
  const ledger = new Map(transactions.map((entry) => [entry.id, entry]));
  if (input.purchaseLinks) {
    const links = unique(input.purchaseLinks, "Dubbele financiële aankoopkoppeling");
    const debits = new Map<string, string>();
    const refunds = new Set<string>();
    for (const link of links) {
      const debit = ledger.get(link.debitId);
      if (link.status === "cancelled" && !debit && !link.refundId) continue;
      if (debits.has(link.debitId) || !debit || debit.type !== "lead_purchase"
        || debit.amount !== -link.price || link.status === "cancelled") attention("Globale aankoop/debit-reconciliatie wijkt af");
      debits.set(link.debitId, link.id);
      if (link.refundId) {
        const refund = ledger.get(link.refundId);
        if (refunds.has(link.refundId) || !refund || refund.type !== "refund"
          || refund.amount !== link.price || link.status !== "refunded") attention("Globale aankoop/refund-reconciliatie wijkt af");
        refunds.add(link.refundId);
      } else if (link.status === "refunded") attention("Globale refundkoppeling ontbreekt");
    }
    for (const entry of transactions) {
      if (entry.type === "lead_purchase" && !debits.has(entry.id)) attention("Ledgerdebit zonder bestaande aankoop");
      if (entry.type === "refund" && !refunds.has(entry.id)) attention("Ledgerrefund zonder bestaande aankoop");
    }
  }
  const walletMap = new Map(wallets.map((wallet) => [wallet.id, wallet]));
  const balances = new Map<string, number>();
  for (const entry of transactions) {
    const wallet = walletMap.get(entry.walletId);
    const positive = ["credit_purchase", "refund", "admin_credit", "promotional_credit"].includes(entry.type);
    const negative = ["lead_purchase", "admin_debit"].includes(entry.type);
    if (!wallet || wallet.professionalId !== entry.professionalId
      || !Number.isSafeInteger(entry.amount) || entry.amount === 0
      || (!positive && !negative && entry.type !== "correction")
      || (positive && entry.amount < 0) || (negative && entry.amount > 0)
      || !Number.isFinite(time(entry.createdAt)) || time(entry.createdAt) > end) {
      attention("Ongeldige ledgertransactie of walletkoppeling");
    }
    balances.set(entry.walletId, (balances.get(entry.walletId) ?? 0) + entry.amount);
  }
  for (const wallet of wallets) {
    if (!Number.isSafeInteger(wallet.balance) || wallet.balance < 0
      || wallet.balance !== (balances.get(wallet.id) ?? 0)
      || !Number.isFinite(time(wallet.updatedAt)) || time(wallet.updatedAt) > end) {
      attention("Walletvoorraad wijkt af van ledger of wijzigde tijdens laden");
    }
  }
  const pairs = new Set<string>();
  const usedDebits = new Set<string>();
  const usedRefunds = new Set<string>();
  const cohort = rawPurchases.filter((purchase) => {
    const purchased = time(purchase.purchasedAt);
    if (!Number.isFinite(purchased)) {
      attention("Aankoop zonder geldig aankoopmoment");
      return false;
    }
    return purchased >= start && purchased <= end;
  });
  const purchases = cohort.filter((purchase) => ["purchased", "refunded"].includes(purchase.status));
  for (const purchase of cohort) {
    if (!["purchased", "refunded", "cancelled"].includes(purchase.status)) attention("Onbekende aankoopstatus");
    if (purchase.status === "cancelled") {
      if (ledger.has(purchase.debitId)) attention("Geannuleerde aankoop met financiële boeking");
      continue;
    }
    const key = `${purchase.leadId}:${purchase.professionalId}`;
    if (pairs.has(key)) attention("Meerdere aankopen voor dezelfde lead en professional");
    pairs.add(key);
    if (!purchase.leadExists || !purchase.professionalExists || !purchase.serviceId
      || !Number.isSafeInteger(purchase.price) || purchase.price <= 0
      || !["shared", "exclusive"].includes(purchase.type)) attention("Onvolledige aankoop of ongeldige prijs/type");
    const assignment = purchase.assignment;
    if (!assignment || assignment.id !== purchase.assignmentId || assignment.leadId !== purchase.leadId
      || assignment.professionalId !== purchase.professionalId) attention("Ontbrekende of afwijkende assignmentkoppeling");
    const debit = ledger.get(purchase.debitId);
    if (!debit || debit.type !== "lead_purchase" || debit.amount !== -purchase.price
      || debit.leadId !== purchase.leadId || debit.professionalId !== purchase.professionalId
      || debit.assignmentId !== purchase.assignmentId || time(debit.createdAt) !== time(purchase.purchasedAt)
      || usedDebits.has(purchase.debitId)) attention("Aankoopprijs wijkt af van gekoppelde ledgerdebit");
    usedDebits.add(purchase.debitId);
    if (purchase.status === "refunded") {
      const refund = purchase.refundId ? ledger.get(purchase.refundId) : null;
      if (!refund || refund.type !== "refund" || refund.amount !== purchase.price
        || refund.leadId !== purchase.leadId || refund.professionalId !== purchase.professionalId
        || refund.assignmentId !== purchase.assignmentId
        || time(refund.createdAt) !== time(purchase.refundedAt) || time(refund.createdAt) < time(purchase.purchasedAt)
        || usedRefunds.has(refund.id)) attention("Refundstatus wijkt af van werkelijk teruggeboekte credits");
      if (refund) usedRefunds.add(refund.id);
    } else if (purchase.refundId || purchase.refundedAt) attention("Refundkoppeling zonder refundstatus");
  }
  const scopedLeads = new Set(cohort.map((purchase) => purchase.leadId));
  for (const entry of transactions) {
    if (!entry.leadId || !scopedLeads.has(entry.leadId) || time(entry.createdAt) < start) continue;
    if (entry.type === "lead_purchase" && !usedDebits.has(entry.id)) attention("Ongekoppelde aankoopdebit in cohort");
    // A refund for an older purchase of the same shared lead is outside this cohort.
    if (entry.type === "refund" && pairs.has(`${entry.leadId}:${entry.professionalId}`) && !usedRefunds.has(entry.id)) {
      attention("Ongekoppelde refund bij cohortaankoop");
    }
  }
  const correctionsByPair = new Map<string, EconomicsTransaction[]>();
  for (const entry of transactions) {
    if (entry.type !== "correction" || !entry.leadId) continue;
    const key = `${entry.leadId}:${entry.professionalId}`;
    const rows = correctionsByPair.get(key) ?? [];
    rows.push(entry);
    correctionsByPair.set(key, rows);
  }
  const observations = purchases.map((purchase) => {
    const purchased = time(purchase.purchasedAt);
    const assignment = purchase.assignment;
    const validEvent = (value: string | null | undefined) => Number.isFinite(time(value)) && time(value) >= purchased && time(value) <= end;
    const contact = validEvent(assignment?.contactedAt);
    const reached = validEvent(assignment?.reachedAt);
    const appointment = validEvent(assignment?.appointmentScheduledAt);
    const won = assignment?.progressStatus === "won";
    const lost = assignment?.progressStatus === "lost";
    for (const value of [assignment?.contactedAt, assignment?.reachedAt, assignment?.appointmentScheduledAt, assignment?.outcomeAt]) {
      if (value && !validEvent(value)) attention("Onmogelijk mijlpaaltijdstip");
    }
    const corrections = (correctionsByPair.get(`${purchase.leadId}:${purchase.professionalId}`) ?? []).filter((entry) => time(entry.createdAt) >= purchased);
    if (corrections.some((entry) => entry.assignmentId && entry.assignmentId !== purchase.assignmentId)) attention("Ambigue correctiekoppeling");
    const refunded = purchase.refundId ? ledger.get(purchase.refundId)?.amount ?? 0 : 0;
    const corrected = corrections.reduce((sum, entry) => sum + Math.max(0, entry.amount), 0);
    const extra = corrections.reduce((sum, entry) => sum + Math.max(0, -entry.amount), 0);
    const net = purchase.price - refunded - corrected + extra;
    if (net < 0) attention("Terugboekingen overschrijden aankoopcredits");
    const funnelReached = contact && reached && time(assignment?.reachedAt) >= time(assignment?.contactedAt);
    const funnelAppointment = funnelReached && appointment && time(assignment?.appointmentScheduledAt) >= time(assignment?.reachedAt);
    const funnelWon = funnelAppointment && won && validEvent(assignment?.outcomeAt) && time(assignment?.outcomeAt) >= time(assignment?.appointmentScheduledAt);
    return { purchase, reached, appointment, won, lost, funnelReached, funnelAppointment, funnelWon,
      refunded, corrected, extra, net, matured: purchased <= end - economicsDefinitions.maturityDays * day,
      mismatch: mismatchReasons.includes(assignment?.mismatchReason as typeof mismatchReasons[number]) };
  });
  const consistent = issues.size === 0;
  type Observation = typeof observations[number];
  function summary(rows: Observation[]): EconomicsSummary {
    const n = rows.length;
    const count = (predicate: (row: Observation) => boolean) => rows.filter(predicate).length;
    const reached = count((row) => row.reached), appointment = count((row) => row.appointment), won = count((row) => row.won);
    const gross = rows.reduce((sum, row) => sum + row.purchase.price, 0);
    const refunded = rows.reduce((sum, row) => sum + row.refunded, 0);
    const corrections = rows.reduce((sum, row) => sum + row.corrected, 0);
    const extraCharges = rows.reduce((sum, row) => sum + row.extra, 0);
    const net = gross - refunded - corrections + extraCharges;
    const quality: Record<string, EconomicsRate> = {};
    for (const reason of ["wrong_service", "invalid_contact", "unreachable", "duplicate", "already_completed"]) {
      quality[reason] = rate(count((row) => row.purchase.assignment?.mismatchReason === reason
        || (reason === "invalid_contact" && ["invalid_phone", "invalid_email"].includes(row.purchase.assignment?.reachability ?? ""))
        || (reason === "unreachable" && ["no_answer", "invalid_phone", "invalid_email", "unreachable_other"].includes(row.purchase.assignment?.reachability ?? ""))), n);
    }
    return {
      purchases: n, uniqueLeads: new Set(rows.map((row) => row.purchase.leadId)).size,
      open: count((row) => !row.won && !row.lost), lost: count((row) => row.lost),
      refund: rate(count((row) => row.purchase.status === "refunded"), n),
      partialCorrection: rate(count((row) => row.corrected > 0 && row.corrected < row.purchase.price && row.refunded === 0), n),
      reached: rate(reached, n), appointment: rate(appointment, n), won: rate(won, n),
      mismatch: rate(count((row) => row.mismatch), n), quality,
      sufficientData: n >= economicsDefinitions.minimumSample,
      finance: consistent ? { gross, refunded, corrections, extraCharges, net, average: divide(gross, n),
        creditsPerReached: divide(net, reached), creditsPerAppointment: divide(net, appointment), creditsPerWon: divide(net, won) } : null,
    };
  }
  function breakdown(key: (row: Observation) => string, label: (row: Observation) => string): EconomicsRow[] {
    const groups = new Map<string, Observation[]>();
    for (const row of observations) {
      const value = key(row);
      const rows = groups.get(value) ?? [];
      rows.push(row); groups.set(value, rows);
    }
    return [...groups.values()].map((rows) => ({ label: label(rows[0]), ...summary(rows) })).sort((a, b) => a.label.localeCompare(b.label));
  }
  const all = summary(observations);
  const prices = purchases.map((purchase) => purchase.price).sort((a, b) => a - b);
  const p25 = quantile(prices, .25), p75 = quantile(prices, .75);
  const iqr = p25 !== null && p75 !== null ? p75 - p25 : 0;
  const priceDistribution = consistent ? { min: prices[0] ?? null, p25, median: quantile(prices, .5), p75,
    max: prices.at(-1) ?? null,
    outliers: prices.length >= economicsDefinitions.minimumSample && p25 !== null && p75 !== null
      ? prices.filter((price) => price < p25 - 1.5 * iqr || price > p75 + 1.5 * iqr).length : null } : null;
  const offered = offers.filter((offer) => time(offer.offeredAt) >= start && time(offer.offeredAt) <= end);
  const offerPurchased = (offer: EconomicsOffer) => time(offer.purchasedAt) >= time(offer.offeredAt) && time(offer.purchasedAt) <= end;
  const soldLeadIds = new Set(input.distributedPurchasedLeadIds ?? rawPurchases.filter((purchase) =>
    ["purchased", "refunded"].includes(purchase.status) && time(purchase.purchasedAt) <= end).map((purchase) => purchase.leadId));
  const offerGroups = (key: (offer: EconomicsOffer) => string, label: (offer: EconomicsOffer) => string) => {
    const groups = new Map<string, EconomicsOffer[]>();
    for (const offer of offered) { const rows = groups.get(key(offer)) ?? []; rows.push(offer); groups.set(key(offer), rows); }
    return [...groups.values()].map((rows) => ({ label: label(rows[0]), offers: rows.length,
      purchases: rate(rows.filter(offerPurchased).length, rows.length) }));
  };
  const strict = [observations.length, observations.filter((row) => row.funnelReached).length,
    observations.filter((row) => row.funnelAppointment).length, observations.filter((row) => row.funnelWon).length];
  const shared = observations.filter((row) => row.purchase.type === "shared");
  const sharedLeads = new Set(shared.map((row) => row.purchase.leadId)).size;
  return {
    days, asOf: asOf.toISOString(), all,
    matured: summary(observations.filter((row) => row.matured)),
    recent: summary(observations.filter((row) => !row.matured)),
    reconciliation: { consistent, issues: [...issues].map(([label, count]) => ({ label, count })) },
    walletStock: consistent ? wallets.reduce((sum, wallet) => sum + wallet.balance, 0) : null,
    breakdowns: {
      service: breakdown((row) => row.purchase.serviceId, (row) => row.purchase.serviceName),
      type: breakdown((row) => row.purchase.type, (row) => row.purchase.type === "exclusive" ? "Exclusief" : "Gedeeld"),
      source: breakdown((row) => safeQualitySource(row.purchase.source), (row) => safeQualitySource(row.purchase.source)),
      subservice: [] as EconomicsRow[],
    },
    trend: breakdown((row) => row.purchase.purchasedAt.slice(0, 10), (row) => row.purchase.purchasedAt.slice(0, 10)),
    funnel: strict.map((count, index) => ({ label: ["Aankoop", "Bereikt", "Afspraak", "Gewonnen"][index],
      ...rate(count, purchases.length), creditsPerOutcome: consistent ? divide(all.finance!.net, count) : null })),
    priceDistribution, sharedPurchasesPerLead: divide(shared.length, sharedLeads),
    distribution: {
      offers: offered.length,
      converted: rate(offered.filter(offerPurchased).length, offered.length),
      expired: offered.filter((offer) => time(offer.expiresAt) <= end && !offerPurchased(offer)).length,
      open: offered.filter((offer) => time(offer.expiresAt) > end && !offerPurchased(offer)).length,
      unsoldLeads: [...new Set(offered.map((offer) => offer.leadId))].filter((id) => !soldLeadIds.has(id)).length,
      byType: offerGroups((offer) => offer.type, (offer) => offer.type === "exclusive" ? "Exclusief" : offer.type === "shared" ? "Gedeeld" : "Onbekend"),
      byService: offerGroups((offer) => offer.serviceId, (offer) => offer.serviceName),
    },
  };
}

export type EconomicsReport = ReturnType<typeof buildEconomicsReport>;
