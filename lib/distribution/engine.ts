import "server-only";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { distributionConfig, distributionStrategyVersion, getOfferWindowMinutes } from "@/lib/distribution/config";
import { calculateDistributionScore } from "@/lib/distribution/scoring";
import type { Json, LeadCommercialType, ProfessionalVerificationStatus } from "@/types/database";

interface DistributionCandidateInput {
  professionalId: string;
  companyName: string;
  verificationStatus: ProfessionalVerificationStatus;
  settings: {
    maxOpenOffers: number;
    maxActiveAssignments: number;
    paused: boolean;
    pauseUntil: string | null;
  };
  stats: {
    openOffers: number;
    activeAssignments: number;
    offersReceived: number;
    offersViewed: number;
    offersDeclined: number;
    offersExpired: number;
    purchases: number;
    won: number;
    lost: number;
    avgResponseHours: number | null;
    lastOfferAt: string | null;
  };
}

export type DistributionActivationAction = "close_sold_out" | "offer_exclusive" | "offer_shared" | "exhausted" | "noop";

export function determineDistributionActivation(params: {
  commercialType: LeadCommercialType;
  slotsLeft: number;
  liveCount: number;
  queuedCount: number;
  sharedBatchSize: number;
}) {
  const { commercialType, slotsLeft, liveCount, queuedCount, sharedBatchSize } = params;
  if (slotsLeft <= 0) {
    return { action: "close_sold_out" as DistributionActivationAction, offerCount: 0 };
  }
  if (commercialType === "exclusive") {
    if (liveCount === 0 && queuedCount > 0) {
      return { action: "offer_exclusive" as DistributionActivationAction, offerCount: 1 };
    }
  } else {
    const targetLive = Math.min(sharedBatchSize, slotsLeft);
    const required = Math.max(0, targetLive - liveCount);
    if (required > 0 && queuedCount > 0) {
      return { action: "offer_shared" as DistributionActivationAction, offerCount: Math.min(required, queuedCount) };
    }
  }
  if (liveCount === 0 && queuedCount === 0) {
    return { action: "exhausted" as DistributionActivationAction, offerCount: 0 };
  }
  return { action: "noop" as DistributionActivationAction, offerCount: 0 };
}

export function canAdminRequeueCandidate(status: string) {
  return status !== "purchased";
}

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === "number") {
    return value;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function daysAgo(days: number) {
  return new Date(Date.now() - (days * 24 * 60 * 60 * 1000)).toISOString();
}

function average(values: number[]) {
  if (!values.length) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getFairnessPoints(candidate: DistributionCandidateInput, averageRecentOffers: number) {
  const offers = candidate.stats.offersReceived;
  const purchases = candidate.stats.purchases;
  const lastOfferTs = candidate.stats.lastOfferAt ? new Date(candidate.stats.lastOfferAt).getTime() : 0;
  const daysSinceLastOffer = lastOfferTs ? Math.floor((Date.now() - lastOfferTs) / (24 * 60 * 60 * 1000)) : 999;

  let fairness = 0;
  if (offers > averageRecentOffers + 4) {
    fairness -= 5;
  } else if (offers <= Math.max(2, Math.floor(averageRecentOffers / 2))) {
    fairness += 4;
  }

  if (purchases >= 5) {
    fairness -= 3;
  }

  if (daysSinceLastOffer >= 30) {
    fairness += 6;
  }

  return clamp(fairness, -distributionConfig.weights.fairness, distributionConfig.weights.fairness);
}

function buildScore(candidate: DistributionCandidateInput, averageRecentOffers: number) {
  const acceptRateDenominator = candidate.stats.offersReceived;
  const acceptRate = acceptRateDenominator > 0
    ? (candidate.stats.offersViewed + candidate.stats.purchases) / acceptRateDenominator
    : distributionConfig.coldStart.acceptRate;
  const winRateDenominator = candidate.stats.won + candidate.stats.lost;
  const winRate = winRateDenominator > 0
    ? candidate.stats.won / winRateDenominator
    : distributionConfig.coldStart.winRate;
  const responseHours = candidate.stats.avgResponseHours ?? distributionConfig.coldStart.avgResponseHours;
  const normalizedResponseTime = clamp(1 - (responseHours / 48), 0, 1);
  const workloadUtilization = candidate.settings.maxActiveAssignments > 0
    ? clamp(candidate.stats.activeAssignments / candidate.settings.maxActiveAssignments, 0, 1)
    : 1;

  const fairnessPoints = getFairnessPoints(candidate, averageRecentOffers);

  return calculateDistributionScore({
    verification: candidate.verificationStatus === "verified" ? "verified" : candidate.verificationStatus === "pending" ? "pending" : "unverified",
    acceptRate,
    winRate,
    avgResponseHours: Math.max(0, (1 - normalizedResponseTime) * 48),
    workloadRatio: workloadUtilization,
    fairness: fairnessPoints,
  });
}

export async function ensureDistributionSettingsForProfessional(professionalId: string) {
  const supabase = createAdminSupabaseClient();
  await supabase.from("professional_distribution_settings").upsert({
    professional_id: professionalId,
    max_open_offers: distributionConfig.defaultMaxOpenOffers,
    max_active_assignments: distributionConfig.defaultMaxActiveAssignments,
  }, { onConflict: "professional_id" });
}

async function loadEligiblePool(leadId: string) {
  const supabase = createAdminSupabaseClient();
  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("id, service_id, postal_code, status, commercial_type, sales_status, max_buyers, buyers_count")
    .eq("id", leadId)
    .maybeSingle();

  if (leadError || !lead) {
    throw new Error("Lead kon niet worden geladen voor distributie.");
  }

  if (!distributionConfig.eligibleLeadStatuses.includes(String(lead.status) as (typeof distributionConfig.eligibleLeadStatuses)[number]) || !["available", "partially_sold"].includes(String(lead.sales_status))) {
    throw new Error("Lead is commercieel niet beschikbaar voor distributie.");
  }

  const [{ data: professionals, error: professionalsError }, { data: purchasedRows }, { data: offerRows }, { data: assignmentRows }] = await Promise.all([
    supabase
      .from("professionals")
      .select(`
        id,
        company_name,
        status,
        verification_status,
        professional_services!inner(service_id, active),
        professional_service_areas!inner(postal_code_prefix),
        professional_distribution_settings(max_open_offers, max_active_assignments, paused, pause_until)
      `)
      .eq("status", "active")
      .in("verification_status", [...distributionConfig.allowedVerification])
      .eq("professional_services.service_id", String(lead.service_id))
      .eq("professional_services.active", true)
      .eq("professional_service_areas.postal_code_prefix", String(lead.postal_code).slice(0, 4)),
    supabase.from("lead_purchases").select("professional_id").eq("lead_id", leadId).eq("status", "purchased"),
    supabase
      .from("lead_distribution_candidates")
      .select("professional_id, status, offered_at, viewed_at, declined_at, purchased_at, offer_expires_at, created_at")
      .gte("created_at", daysAgo(distributionConfig.performanceLookbackDays)),
    supabase
      .from("lead_assignments")
      .select("professional_id, status, progress_status, assigned_at")
      .gte("assigned_at", daysAgo(distributionConfig.performanceLookbackDays)),
  ]);

  if (professionalsError) {
    throw new Error("Vakmannen konden niet worden geladen voor distributie.");
  }

  const purchasedSet = new Set((purchasedRows ?? []).map((row) => String(row.professional_id)));
  const openOfferRows = (offerRows ?? []).filter((row) => ["offered", "viewed"].includes(String(row.status))
    && (!row.offer_expires_at || new Date(String(row.offer_expires_at)).getTime() > Date.now()));
  const responseAggregates = new Map<string, { totalHours: number; count: number }>();

  const offerStats = new Map<string, DistributionCandidateInput["stats"]>();
  for (const row of (offerRows ?? [])) {
    const key = String(row.professional_id);
    const existing = offerStats.get(key) ?? {
      openOffers: 0,
      activeAssignments: 0,
      offersReceived: 0,
      offersViewed: 0,
      offersDeclined: 0,
      offersExpired: 0,
      purchases: 0,
      won: 0,
      lost: 0,
      avgResponseHours: null,
      lastOfferAt: null,
    };

    existing.offersReceived += 1;
    if (row.status === "viewed") {
      existing.offersViewed += 1;
    }
    if (row.status === "declined") {
      existing.offersDeclined += 1;
    }
    if (row.status === "expired") {
      existing.offersExpired += 1;
    }
    if (row.status === "purchased") {
      existing.purchases += 1;
    }
    const offeredTs = row.offered_at ? new Date(String(row.offered_at)).getTime() : 0;
    const responseTs = row.viewed_at || row.declined_at || row.purchased_at;
    if (offeredTs && responseTs) {
      const responseHours = (new Date(String(responseTs)).getTime() - offeredTs) / (1000 * 60 * 60);
      if (responseHours >= 0) {
        const aggregate = responseAggregates.get(key) ?? { totalHours: 0, count: 0 };
        aggregate.totalHours += responseHours;
        aggregate.count += 1;
        responseAggregates.set(key, aggregate);
      }
    }
    if (offeredTs && (!existing.lastOfferAt || offeredTs > new Date(existing.lastOfferAt).getTime())) {
      existing.lastOfferAt = new Date(offeredTs).toISOString();
    }
    offerStats.set(key, existing);
  }

  for (const row of openOfferRows) {
    const key = String(row.professional_id);
    const existing = offerStats.get(key) ?? {
      openOffers: 0,
      activeAssignments: 0,
      offersReceived: 0,
      offersViewed: 0,
      offersDeclined: 0,
      offersExpired: 0,
      purchases: 0,
      won: 0,
      lost: 0,
      avgResponseHours: null,
      lastOfferAt: null,
    };
    existing.openOffers += 1;
    offerStats.set(key, existing);
  }

  for (const [professionalId, aggregate] of responseAggregates) {
    const existing = offerStats.get(professionalId);
    if (existing && aggregate.count > 0) {
      existing.avgResponseHours = aggregate.totalHours / aggregate.count;
    }
  }

  for (const row of (assignmentRows ?? [])) {
    const key = String(row.professional_id);
    const existing = offerStats.get(key) ?? {
      openOffers: 0,
      activeAssignments: 0,
      offersReceived: 0,
      offersViewed: 0,
      offersDeclined: 0,
      offersExpired: 0,
      purchases: 0,
      won: 0,
      lost: 0,
      avgResponseHours: null,
      lastOfferAt: null,
    };
    if (["accepted", "viewed", "pending"].includes(String(row.status)) && !["won", "lost"].includes(String(row.progress_status))) {
      existing.activeAssignments += 1;
    }
    if (row.progress_status === "won") {
      existing.won += 1;
    }
    if (row.progress_status === "lost") {
      existing.lost += 1;
    }
    offerStats.set(key, existing);
  }

  const baseCandidates = ((professionals ?? []) as Array<Record<string, unknown>>).map((row) => {
    const settings = (Array.isArray(row.professional_distribution_settings) ? row.professional_distribution_settings[0] : row.professional_distribution_settings) as Record<string, unknown> | null;
    const maxOpenOffers = toNumber(settings?.max_open_offers, distributionConfig.defaultMaxOpenOffers);
    const maxActiveAssignments = toNumber(settings?.max_active_assignments, distributionConfig.defaultMaxActiveAssignments);
    const stats = offerStats.get(String(row.id)) ?? {
      openOffers: 0,
      activeAssignments: 0,
      offersReceived: 0,
      offersViewed: 0,
      offersDeclined: 0,
      offersExpired: 0,
      purchases: 0,
      won: 0,
      lost: 0,
      avgResponseHours: null,
      lastOfferAt: null,
    };

    return {
      professionalId: String(row.id),
      companyName: String(row.company_name),
      verificationStatus: row.verification_status as ProfessionalVerificationStatus,
      settings: {
        maxOpenOffers,
        maxActiveAssignments,
        paused: Boolean(settings?.paused),
        pauseUntil: (settings?.pause_until as string | null) ?? null,
      },
      stats,
      alreadyPurchased: purchasedSet.has(String(row.id)),
    };
  });

  return { lead, baseCandidates };
}

async function appendDistributionActivity(leadId: string, activityType: string, professionalId?: string | null, metadata?: Json) {
  const supabase = createAdminSupabaseClient();
  await supabase.from("lead_activity").insert({
    lead_id: leadId,
    professional_id: professionalId ?? null,
    activity_type: activityType,
    metadata: (metadata ?? {}) as Json,
  });
}

export async function activateOffersForRun(runId: string) {
  const supabase = createAdminSupabaseClient();
  const [{ data: run, error: runError }, { data: candidates, error: candidatesError }] = await Promise.all([
    supabase
      .from("lead_distribution_runs")
      .select("id, lead_id, commercial_type, status")
      .eq("id", runId)
      .maybeSingle(),
    supabase
      .from("lead_distribution_candidates")
      .select("id, lead_id, professional_id, rank_position, status")
      .eq("distribution_run_id", runId)
      .order("rank_position", { ascending: true }),
  ]);

  if (runError || !run || candidatesError) {
    throw new Error("Distributierun kon niet worden geactiveerd.");
  }

  const live = (candidates ?? []).filter((candidate) => ["offered", "viewed"].includes(String(candidate.status)));
  const queued = (candidates ?? []).filter((candidate) => candidate.status === "queued");

  const { data: lead } = await supabase
    .from("leads")
    .select("commercial_type, max_buyers")
    .eq("id", run.lead_id)
    .maybeSingle();

  const { count: purchasedCount } = await supabase
    .from("lead_purchases")
    .select("id", { count: "exact", head: true })
    .eq("lead_id", run.lead_id)
    .eq("status", "purchased");

  const maxBuyers = toNumber(lead?.max_buyers, 1);
  const slotsLeft = Math.max(0, maxBuyers - (purchasedCount ?? 0));
  const activation = determineDistributionActivation({
    commercialType: run.commercial_type as LeadCommercialType,
    slotsLeft,
    liveCount: live.length,
    queuedCount: queued.length,
    sharedBatchSize: distributionConfig.sharedBatchSize,
  });
  if (activation.action === "close_sold_out") {
    await supabase
      .from("lead_distribution_candidates")
      .update({ status: "skipped", skipped_at: new Date().toISOString() })
      .eq("distribution_run_id", runId)
      .in("status", ["queued", "offered", "viewed"]);
    await supabase.from("lead_distribution_runs").update({ status: "completed", completed_at: new Date().toISOString() }).eq("id", runId);
    return;
  }

  const now = new Date();
  const expiryIso = new Date(now.getTime() + getOfferWindowMinutes(run.commercial_type as LeadCommercialType) * 60_000).toISOString();

  if (activation.action === "offer_exclusive") {
    const next = queued[0];
    await supabase.from("lead_distribution_candidates").update({ status: "offered", offered_at: now.toISOString(), offer_expires_at: expiryIso }).eq("id", next.id);
    await appendDistributionActivity(String(next.lead_id), "candidate_offered", String(next.professional_id), { candidate_id: next.id, run_id: runId });
    await supabase.from("lead_distribution_runs").update({ status: "active" }).eq("id", runId);
    return;
  }

  if (activation.action === "offer_shared") {
    const toOffer = queued.slice(0, activation.offerCount);
    if (toOffer.length > 0) {
      for (const candidate of toOffer) {
        await supabase
          .from("lead_distribution_candidates")
          .update({
            status: "offered",
            offered_at: now.toISOString(),
            offer_expires_at: expiryIso,
            viewed_at: null,
          })
          .eq("id", candidate.id)
          .eq("status", "queued");
      }
      for (const candidate of toOffer) {
        await appendDistributionActivity(String(candidate.lead_id), "candidate_offered", String(candidate.professional_id), { candidate_id: candidate.id, run_id: runId });
      }
      await supabase.from("lead_distribution_runs").update({ status: "active" }).eq("id", runId);
      return;
    }
  }

  if (activation.action === "exhausted") {
    await supabase.from("lead_distribution_runs").update({ status: "exhausted", completed_at: new Date().toISOString() }).eq("id", runId);
    await appendDistributionActivity(String(run.lead_id), "distribution_exhausted", null, { run_id: runId });
  }
}

export async function startLeadDistribution(leadId: string, actorUserId?: string | null) {
  const supabase = createAdminSupabaseClient();
  const { lead, baseCandidates } = await loadEligiblePool(leadId);
  const now = new Date();
  const averageRecentOffers = average(baseCandidates.map((candidate) => candidate.stats.offersReceived));

  const eligibleCandidates = baseCandidates
    .filter((candidate) => !candidate.alreadyPurchased)
    .filter((candidate) => {
      if (candidate.settings.paused) {
        const pauseUntilTs = candidate.settings.pauseUntil ? new Date(candidate.settings.pauseUntil).getTime() : 0;
        if (pauseUntilTs === 0) {
          return false;
        }
        return pauseUntilTs < Date.now();
      }
      return true;
    })
    .filter((candidate) => candidate.stats.openOffers < candidate.settings.maxOpenOffers)
    .filter((candidate) => candidate.stats.activeAssignments < candidate.settings.maxActiveAssignments)
    .map((candidate) => ({
      candidate,
      scored: buildScore(candidate, averageRecentOffers),
    }))
    .sort((left, right) => right.scored.score - left.scored.score || left.candidate.companyName.localeCompare(right.candidate.companyName))
    .slice(0, distributionConfig.maxCandidates);

  const runStatus = eligibleCandidates.length > 0 ? "pending" : "exhausted";

  const { data: run, error: runError } = await supabase
    .from("lead_distribution_runs")
    .insert({
      lead_id: leadId,
      commercial_type: lead.commercial_type,
      status: runStatus,
      strategy_version: distributionStrategyVersion,
      started_at: now.toISOString(),
      completed_at: runStatus === "exhausted" ? now.toISOString() : null,
    })
    .select("id")
    .single();

  const insertedRunId = run?.id ?? null;
  const resolvedRunId = insertedRunId;

  if (runError || !resolvedRunId) {
    if (runError?.code !== "23505") {
      throw new Error("Distributierun kon niet worden gestart.");
    }

    const { data: concurrentRun } = await supabase
      .from("lead_distribution_runs")
      .select("id")
      .eq("lead_id", leadId)
      .in("status", ["pending", "active"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!concurrentRun) {
      throw new Error("Distributierun kon niet worden gestart.");
    }

    return concurrentRun.id;
  }

  if (!resolvedRunId) {
    throw new Error("Distributierun kon niet worden gestart.");
  }

  if (eligibleCandidates.length) {
    await supabase.from("lead_distribution_candidates").upsert(
      eligibleCandidates.map((entry, index) => ({
        distribution_run_id: resolvedRunId,
        lead_id: leadId,
        professional_id: entry.candidate.professionalId,
        rank_position: index + 1,
        ranking_score: entry.scored.score,
        score_breakdown: entry.scored.breakdown,
        eligibility_reason: {
          open_offers: entry.candidate.stats.openOffers,
          max_open_offers: entry.candidate.settings.maxOpenOffers,
          active_assignments: entry.candidate.stats.activeAssignments,
          max_active_assignments: entry.candidate.settings.maxActiveAssignments,
          paused: entry.candidate.settings.paused,
          already_purchased: false,
        },
      })),
      { onConflict: "distribution_run_id,professional_id", ignoreDuplicates: true },
    );
  }

  if (insertedRunId) {
    await appendDistributionActivity(leadId, "distribution_started", null, {
      run_id: resolvedRunId,
      strategy_version: distributionStrategyVersion,
      candidate_count: eligibleCandidates.length,
      actor_user_id: actorUserId ?? null,
    });
  }

  if (eligibleCandidates.length) {
    await activateOffersForRun(resolvedRunId);
  } else {
    await appendDistributionActivity(leadId, "distribution_exhausted", null, { run_id: resolvedRunId });
  }

  return resolvedRunId;
}

export async function processDistributionExpirations() {
  const supabase = createAdminSupabaseClient();
  const now = new Date().toISOString();
  const { data: expired } = await supabase
    .from("lead_distribution_candidates")
    .select("id, lead_id, professional_id, distribution_run_id")
    .in("status", ["offered", "viewed"])
    .lte("offer_expires_at", now)
    .limit(200);

  if (!expired?.length) {
    return 0;
  }

  const runIds = new Set<string>();
  for (const candidate of expired) {
    await supabase
      .from("lead_distribution_candidates")
      .update({ status: "expired", expired_at: now })
      .eq("id", candidate.id)
      .in("status", ["offered", "viewed"]);
    runIds.add(String(candidate.distribution_run_id));
    await appendDistributionActivity(String(candidate.lead_id), "candidate_expired", String(candidate.professional_id), { candidate_id: candidate.id });
  }

  for (const runId of runIds) {
    await activateOffersForRun(runId);
  }

  return expired.length;
}

export async function declineDistributionOffer(candidateId: string, professionalId: string, reason: string) {
  const supabase = await createServerSupabaseClient();
  const now = new Date().toISOString();
  const { data: candidate } = await supabase
    .from("lead_distribution_candidates")
    .select("id, lead_id, professional_id, distribution_run_id, status, offer_expires_at")
    .eq("id", candidateId)
    .eq("professional_id", professionalId)
    .maybeSingle();

  if (!candidate) {
    throw new Error("Offer niet gevonden.");
  }

  if (!["offered", "viewed"].includes(String(candidate.status))) {
    throw new Error("Offer kan niet meer worden geweigerd.");
  }

  if (candidate.offer_expires_at && new Date(String(candidate.offer_expires_at)).getTime() <= Date.now()) {
    throw new Error("Offer is verlopen.");
  }

  const { error } = await supabase
    .from("lead_distribution_candidates")
    .update({ status: "declined", decline_reason: reason, declined_at: now })
    .eq("id", candidateId)
    .eq("professional_id", professionalId)
    .in("status", ["offered", "viewed"]);

  if (error) {
    throw new Error("Offer kon niet worden geweigerd.");
  }

  await appendDistributionActivity(String(candidate.lead_id), "candidate_declined", professionalId, { candidate_id: candidateId, reason });
  await activateOffersForRun(String(candidate.distribution_run_id));
}

export async function markDistributionOfferViewed(candidateId: string, professionalId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: candidate } = await supabase
    .from("lead_distribution_candidates")
    .select("id, lead_id, professional_id, status, offer_expires_at")
    .eq("id", candidateId)
    .eq("professional_id", professionalId)
    .maybeSingle();

  if (!candidate || candidate.status !== "offered") {
    return;
  }
  if (candidate.offer_expires_at && new Date(String(candidate.offer_expires_at)).getTime() <= Date.now()) {
    return;
  }

  await supabase.from("lead_distribution_candidates").update({ status: "viewed", viewed_at: new Date().toISOString() }).eq("id", candidateId);
}

export async function adminSkipDistributionCandidate(candidateId: string, actorUserId?: string | null) {
  const supabase = createAdminSupabaseClient();
  const { data: candidate } = await supabase
    .from("lead_distribution_candidates")
    .select("id, lead_id, professional_id, distribution_run_id, status")
    .eq("id", candidateId)
    .maybeSingle();

  if (!candidate || ["declined", "expired", "purchased", "skipped"].includes(String(candidate.status))) {
    return;
  }

  await supabase.from("lead_distribution_candidates").update({ status: "skipped", skipped_at: new Date().toISOString() }).eq("id", candidateId);
  await appendDistributionActivity(String(candidate.lead_id), "candidate_skipped", String(candidate.professional_id), {
    candidate_id: candidate.id,
    actor_user_id: actorUserId ?? null,
  });
  await activateOffersForRun(String(candidate.distribution_run_id));
}

export async function adminRequeueLeadDistribution(leadId: string, actorUserId?: string | null) {
  const supabase = createAdminSupabaseClient();
  await supabase
    .from("lead_distribution_runs")
    .update({ status: "cancelled", completed_at: new Date().toISOString() })
    .eq("lead_id", leadId)
    .in("status", ["pending", "active"]);

  await appendDistributionActivity(leadId, "distribution_admin_override", null, {
    action: "requeue",
    actor_user_id: actorUserId ?? null,
  });

  return startLeadDistribution(leadId, actorUserId);
}

export async function adminPauseDistributionRun(runId: string, actorUserId?: string | null) {
  const supabase = createAdminSupabaseClient();
  const { data: run } = await supabase
    .from("lead_distribution_runs")
    .select("id, lead_id")
    .eq("id", runId)
    .maybeSingle();

  if (!run) {
    return;
  }

  await supabase.from("lead_distribution_runs").update({ status: "cancelled", completed_at: new Date().toISOString() }).eq("id", runId);
  await supabase.from("lead_distribution_candidates").update({ status: "skipped", skipped_at: new Date().toISOString() }).eq("distribution_run_id", runId).in("status", ["queued", "offered", "viewed"]);

  await appendDistributionActivity(String(run.lead_id), "distribution_admin_override", null, {
    action: "pause_run",
    run_id: runId,
    actor_user_id: actorUserId ?? null,
  });
}

export async function adminAddManualOffer(leadId: string, professionalId: string, actorUserId?: string | null) {
  const supabase = createAdminSupabaseClient();
  const { data: run } = await supabase
    .from("lead_distribution_runs")
    .select("id")
    .eq("lead_id", leadId)
    .in("status", ["pending", "active"])
    .maybeSingle();

  const runId = run?.id ?? await startLeadDistribution(leadId, actorUserId);

  await ensureDistributionSettingsForProfessional(professionalId);

  const { data: existingCandidate } = await supabase
    .from("lead_distribution_candidates")
    .select("id, status")
    .eq("distribution_run_id", runId)
    .eq("professional_id", professionalId)
    .maybeSingle();

  if (existingCandidate && !canAdminRequeueCandidate(String(existingCandidate.status))) {
    throw new Error("Handmatige override is niet toegestaan voor een reeds gekochte kandidaat.");
  }

  await supabase.from("lead_distribution_candidates").upsert({
    id: existingCandidate?.id,
    distribution_run_id: runId,
    lead_id: leadId,
    professional_id: professionalId,
    rank_position: 1,
    ranking_score: 100,
    score_breakdown: {
      service: distributionConfig.weights.serviceMatch,
      regio: distributionConfig.weights.geoMatch,
      verificatie: distributionConfig.weights.verification,
      response_performance: distributionConfig.weights.responsePerformance,
      win_rate: distributionConfig.weights.winRate,
      response_time: distributionConfig.weights.responseTime,
      workload: distributionConfig.weights.workload,
      fairness: distributionConfig.weights.fairness,
      admin_override: true,
    },
    eligibility_reason: { manual_override: true },
    status: "queued",
    offered_at: null,
    offer_expires_at: null,
    viewed_at: null,
    skipped_at: null,
    declined_at: null,
    expired_at: null,
    purchased_at: null,
    decline_reason: null,
  }, { onConflict: "distribution_run_id,professional_id" });

  await appendDistributionActivity(leadId, "distribution_admin_override", professionalId, {
    action: "manual_offer",
    actor_user_id: actorUserId ?? null,
  });

  await activateOffersForRun(runId);
}
