import "server-only";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function toNumber(value: unknown) {
  return typeof value === "number" ? value : Number(value ?? 0);
}

export interface DistributionRunListItem {
  id: string;
  leadId: string;
  leadReference: string;
  serviceName: string | null;
  commercialType: string;
  status: string;
  strategyVersion: string;
  startedAt: string;
  completedAt: string | null;
  candidateCount: number;
  offeredCount: number;
  purchasedCount: number;
}

export interface DistributionCandidateView {
  id: string;
  professionalId: string;
  companyName: string;
  rankPosition: number;
  rankingScore: number;
  scoreBreakdown: Record<string, unknown>;
  eligibilityReason: Record<string, unknown>;
  status: string;
  offeredAt: string | null;
  offerExpiresAt: string | null;
  viewedAt: string | null;
  declinedAt: string | null;
  purchasedAt: string | null;
  declineReason: string | null;
}

export interface LeadDistributionDetail {
  run: {
    id: string;
    status: string;
    strategyVersion: string;
    startedAt: string;
    completedAt: string | null;
    commercialType: string;
  } | null;
  candidates: DistributionCandidateView[];
}

export interface DistributionPerformanceStats {
  offersSent: number;
  offersViewed: number;
  offersDeclined: number;
  offersExpired: number;
  purchases: number;
  viewRate: number;
  declineRate: number;
  expiryRate: number;
  purchaseRate: number;
  avgHoursToPurchase: number;
  exhaustedLeads: number;
}

export async function getAdminDistributionRuns(filters: {
  status?: string;
  leadType?: string;
  serviceId?: string;
  fromDate?: string;
}) {
  const supabase = createAdminSupabaseClient();

  let query = supabase
    .from("lead_distribution_runs")
    .select("id, lead_id, commercial_type, status, strategy_version, started_at, completed_at, lead:leads(public_reference, service_id, service:services(name))")
    .order("started_at", { ascending: false })
    .limit(100);

  if (filters.status) {
    query = query.eq("status", filters.status);
  }
  if (filters.leadType) {
    query = query.eq("commercial_type", filters.leadType);
  }
  if (filters.fromDate) {
    query = query.gte("started_at", `${filters.fromDate}T00:00:00.000Z`);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error("Distributieruns konden niet worden geladen.");
  }

  const rows = (data ?? []) as Array<Record<string, unknown>>;
  const runIds = rows.map((row) => String(row.id));

  const { data: candidateRows } = runIds.length
    ? await supabase.from("lead_distribution_candidates").select("distribution_run_id, status").in("distribution_run_id", runIds)
    : { data: [] };

  const candidateMap = new Map<string, { total: number; offered: number; purchased: number }>();
  for (const row of (candidateRows ?? [])) {
    const key = String(row.distribution_run_id);
    const stats = candidateMap.get(key) ?? { total: 0, offered: 0, purchased: 0 };
    stats.total += 1;
    if (["offered", "viewed"].includes(String(row.status))) {
      stats.offered += 1;
    }
    if (String(row.status) === "purchased") {
      stats.purchased += 1;
    }
    candidateMap.set(key, stats);
  }

  return rows.filter((row) => {
    if (!filters.serviceId) {
      return true;
    }
    const lead = (Array.isArray(row.lead) ? row.lead[0] : row.lead) as { service_id?: string } | null;
    return lead?.service_id === filters.serviceId;
  }).map((row) => {
    const lead = (Array.isArray(row.lead) ? row.lead[0] : row.lead) as Record<string, unknown> | null;
    const service = lead && (Array.isArray(lead.service) ? lead.service[0] : lead.service) as Record<string, unknown> | null;
    const stats = candidateMap.get(String(row.id)) ?? { total: 0, offered: 0, purchased: 0 };
    return {
      id: String(row.id),
      leadId: String(row.lead_id),
      leadReference: String(lead?.public_reference ?? "Onbekend"),
      serviceName: (service?.name as string | undefined) ?? null,
      commercialType: String(row.commercial_type),
      status: String(row.status),
      strategyVersion: String(row.strategy_version),
      startedAt: String(row.started_at),
      completedAt: (row.completed_at as string | null) ?? null,
      candidateCount: stats.total,
      offeredCount: stats.offered,
      purchasedCount: stats.purchased,
    } satisfies DistributionRunListItem;
  });
}

export async function getLeadDistributionDetail(leadId: string): Promise<LeadDistributionDetail> {
  const supabase = createAdminSupabaseClient();
  const { data: run } = await supabase
    .from("lead_distribution_runs")
    .select("id, status, strategy_version, started_at, completed_at, commercial_type")
    .eq("lead_id", leadId)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!run) {
    return { run: null, candidates: [] };
  }

  const { data: candidates } = await supabase
    .from("lead_distribution_candidates")
    .select("id, professional_id, rank_position, ranking_score, score_breakdown, eligibility_reason, status, offered_at, offer_expires_at, viewed_at, declined_at, purchased_at, decline_reason, professional:professionals(company_name)")
    .eq("distribution_run_id", run.id)
    .order("rank_position", { ascending: true });

  return {
    run: {
      id: String(run.id),
      status: String(run.status),
      strategyVersion: String(run.strategy_version),
      startedAt: String(run.started_at),
      completedAt: (run.completed_at as string | null) ?? null,
      commercialType: String(run.commercial_type),
    },
    candidates: ((candidates ?? []) as Array<Record<string, unknown>>).map((row) => {
      const professional = (Array.isArray(row.professional) ? row.professional[0] : row.professional) as { company_name?: string } | null;
      return {
        id: String(row.id),
        professionalId: String(row.professional_id),
        companyName: professional?.company_name ?? "Onbekend",
        rankPosition: toNumber(row.rank_position),
        rankingScore: toNumber(row.ranking_score),
        scoreBreakdown: (row.score_breakdown as Record<string, unknown>) ?? {},
        eligibilityReason: (row.eligibility_reason as Record<string, unknown>) ?? {},
        status: String(row.status),
        offeredAt: (row.offered_at as string | null) ?? null,
        offerExpiresAt: (row.offer_expires_at as string | null) ?? null,
        viewedAt: (row.viewed_at as string | null) ?? null,
        declinedAt: (row.declined_at as string | null) ?? null,
        purchasedAt: (row.purchased_at as string | null) ?? null,
        declineReason: (row.decline_reason as string | null) ?? null,
      } satisfies DistributionCandidateView;
    }),
  };
}

export async function getProfessionalDistributionOffer(professionalId: string, leadId: string) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("lead_distribution_candidates")
    .select("id, status, offer_expires_at, offered_at")
    .eq("professional_id", professionalId)
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) {
    return null;
  }

  return {
    id: String(data.id),
    status: String(data.status),
    offerExpiresAt: (data.offer_expires_at as string | null) ?? null,
    offeredAt: (data.offered_at as string | null) ?? null,
  };
}

export async function getDistributionPerformanceStats(): Promise<DistributionPerformanceStats> {
  const supabase = createAdminSupabaseClient();
  const since = new Date(Date.now() - (90 * 24 * 60 * 60 * 1000)).toISOString();
  const [{ data: candidateRows }, { data: purchaseRows }, { count: exhaustedCount }] = await Promise.all([
    supabase.from("lead_distribution_candidates").select("lead_id, status, offered_at, purchased_at").gte("created_at", since),
    supabase.from("lead_purchases").select("purchased_at, lead_id").eq("status", "purchased").gte("purchased_at", since),
    supabase.from("lead_distribution_runs").select("id", { count: "exact", head: true }).eq("status", "exhausted").gte("created_at", since),
  ]);

  const rows = (candidateRows ?? []) as Array<Record<string, unknown>>;
  const offersSent = rows.filter((row) => ["offered", "viewed", "declined", "expired", "purchased"].includes(String(row.status))).length;
  const offersViewed = rows.filter((row) => String(row.status) === "viewed").length;
  const offersDeclined = rows.filter((row) => String(row.status) === "declined").length;
  const offersExpired = rows.filter((row) => String(row.status) === "expired").length;
  const purchases = rows.filter((row) => String(row.status) === "purchased").length;

  const durations = ((purchaseRows ?? []) as Array<Record<string, unknown>>)
    .map((row) => ({
      purchasedAt: row.purchased_at ? new Date(String(row.purchased_at)).getTime() : 0,
      leadId: String(row.lead_id),
    }))
    .filter((row) => row.purchasedAt > 0)
    .map((row) => {
      const offer = rows.find((candidate) => String(candidate.status) === "purchased" && String((candidate as { lead_id?: string }).lead_id) === row.leadId);
      const offeredAt = offer?.offered_at ? new Date(String(offer.offered_at)).getTime() : 0;
      return offeredAt > 0 ? (row.purchasedAt - offeredAt) / (1000 * 60 * 60) : null;
    })
    .filter((value): value is number => value !== null && Number.isFinite(value) && value >= 0);

  return {
    offersSent,
    offersViewed,
    offersDeclined,
    offersExpired,
    purchases,
    viewRate: offersSent > 0 ? Number(((offersViewed / offersSent) * 100).toFixed(1)) : 0,
    declineRate: offersSent > 0 ? Number(((offersDeclined / offersSent) * 100).toFixed(1)) : 0,
    expiryRate: offersSent > 0 ? Number(((offersExpired / offersSent) * 100).toFixed(1)) : 0,
    purchaseRate: offersSent > 0 ? Number(((purchases / offersSent) * 100).toFixed(1)) : 0,
    avgHoursToPurchase: durations.length ? Number((durations.reduce((sum, value) => sum + value, 0) / durations.length).toFixed(1)) : 0,
    exhaustedLeads: exhaustedCount ?? 0,
  };
}
