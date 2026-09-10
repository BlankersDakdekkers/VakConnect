import "server-only";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { distributionConfig, distributionStrategyVersion, getOfferWindowMinutes } from "@/lib/distribution/config";
import type { Json, LeadCommercialType, LeadStatus, ProfessionalVerificationStatus } from "@/types/database";

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
  const acceptRateDenominator = candidate.stats.offersDeclined + candidate.stats.purchases;
  const acceptRate = acceptRateDenominator > 0
    ? candidate.stats.purchases / acceptRateDenominator
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

  const verification = candidate.verificationStatus === "verified"
    ? distributionConfig.weights.verification
    : candidate.verificationStatus === "pending"
      ? Math.round(distributionConfig.weights.verification * 0.7)
      : Math.round(distributionConfig.weights.verification * 0.4);

  const responsePerformance = Math.round(acceptRate * distributionConfig.weights.responsePerformance);
  const winRatePoints = Math.round(winRate * distributionConfig.weights.winRate);
  const responseTimePoints = Math.round(normalizedResponseTime * distributionConfig.weights.responseTime);
  const workloadPoints = Math.round((1 - workloadUtilization) * distributionConfig.weights.workload);
  const fairnessPoints = getFairnessPoints(candidate, averageRecentOffers);

  const breakdown = {
    service: distributionConfig.weights.serviceMatch,
    regio: distributionConfig.weights.geoMatch,
    verificatie: verification,
    response_performance: responsePerformance,
    win_rate: winRatePoints,
    response_time: responseTimePoints,
    workload: workloadPoints,
    fairness: fairnessPoints,
  };

  const score = clamp(
    breakdown.service
      + breakdown.regio
      + breakdown.verificatie
      + breakdown.response_performance
      + breakdown.win_rate
      + breakdown.response_time
      + breakdown.workload
      + breakdown.fairness,
    0,
    100,
  );

  return { score, breakdown };
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

  if (!distributionConfig.eligibleLeadStatuses.includes(lead.status as LeadStatus) || !["available", "partially_sold"].includes(String(lead.sales_status))) {
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
        existing.avgResponseHours = existing.avgResponseHours === null
          ? responseHours
          : (existing.avgResponseHours + responseHours) / 2;
      }
    }
    if (offeredTs && (!existing.lastOfferAt || offeredTs > new Date(existing.lastOfferAt).getTime())) {
      existing.lastOfferAt = new Date(offeredTs).toISOString();
    }
    offerStats.set(key, existing);
  }

  for (const row of openOfferRows) {
    const key = String(row.professional_id);
    const existing = offerStats.get(key);
    if (existing) {
      existing.openOffers += 1;
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
  if (slotsLeft <= 0) {
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

  if (run.commercial_type === "exclusive") {
    if (live.length === 0 && queued.length > 0) {
      const next = queued[0];
      await supabase.from("lead_distribution_candidates").update({ status: "offered", offered_at: now.toISOString(), offer_expires_at: expiryIso }).eq("id", next.id);
      await appendDistributionActivity(String(next.lead_id), "candidate_offered", String(next.professional_id), { candidate_id: next.id, run_id: runId });
      await supabase.from("lead_distribution_runs").update({ status: "active" }).eq("id", runId);
      return;
    }
  } else {
    const targetLive = Math.min(distributionConfig.sharedBatchSize, slotsLeft);
    const required = Math.max(0, targetLive - live.length);
    if (required > 0) {
      const toOffer = queued.slice(0, required);
      if (toOffer.length > 0) {
        await supabase.from("lead_distribution_candidates").upsert(
          toOffer.map((candidate) => ({
            id: candidate.id,
            status: "offered",
            offered_at: now.toISOString(),
            offer_expires_at: expiryIso,
          })),
        );
        for (const candidate of toOffer) {
          await appendDistributionActivity(String(candidate.lead_id), "candidate_offered", String(candidate.professional_id), { candidate_id: candidate.id, run_id: runId });
        }
        await supabase.from("lead_distribution_runs").update({ status: "active" }).eq("id", runId);
        return;
      }
    }
  }

  if (live.length === 0 && queued.length === 0) {
    await supabase.from("lead_distribution_runs").update({ status: "exhausted", completed_at: new Date().toISOString() }).eq("id", runId);
    await appendDistributionActivity(String(run.lead_id), "distribution_exhausted", null, { run_id: runId });
  }
}

export async function startLeadDistribution(leadId: string, actorUserId?: string | null) {
  const supabase = createAdminSupabaseClient();

  const { data: existingRun } = await supabase
    .from("lead_distribution_runs")
    .select("id")
    .eq("lead_id", leadId)
    .in("status", ["pending", "active"])
    .maybeSingle();

  if (existingRun) {
    return existingRun.id;
  }

  const { lead, baseCandidates } = await loadEligiblePool(leadId);
  const now = new Date();
  const averageRecentOffers = average(baseCandidates.map((candidate) => candidate.stats.offersReceived));

  const eligibleCandidates = baseCandidates
    .filter((candidate) => !candidate.alreadyPurchased)
    .filter((candidate) => {
      if (candidate.settings.paused) {
        const pauseUntilTs = candidate.settings.pauseUntil ? new Date(candidate.settings.pauseUntil).getTime() : 0;
        return pauseUntilTs > 0 && pauseUntilTs < Date.now();
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

  if (runError || !run) {
    throw new Error("Distributierun kon niet worden gestart.");
  }

  if (eligibleCandidates.length) {
    await supabase.from("lead_distribution_candidates").insert(
      eligibleCandidates.map((entry, index) => ({
        distribution_run_id: run.id,
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
    );
  }

  await appendDistributionActivity(leadId, "distribution_started", null, {
    run_id: run.id,
    strategy_version: distributionStrategyVersion,
    candidate_count: eligibleCandidates.length,
    actor_user_id: actorUserId ?? null,
  });

  if (eligibleCandidates.length) {
    await activateOffersForRun(run.id);
  } else {
    await appendDistributionActivity(leadId, "distribution_exhausted", null, { run_id: run.id });
  }

  return run.id;
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
      .update({ status: "expired", skipped_at: now })
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
  const supabase = createAdminSupabaseClient();
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

  if (candidate.offer_expires_at && new Date(String(candidate.offer_expires_at)).getTime() < Date.now()) {
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
  const supabase = createAdminSupabaseClient();
  const { data: candidate } = await supabase
    .from("lead_distribution_candidates")
    .select("id, lead_id, professional_id, status")
    .eq("id", candidateId)
    .eq("professional_id", professionalId)
    .maybeSingle();

  if (!candidate || candidate.status !== "offered") {
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

  await supabase.from("lead_distribution_candidates").upsert({
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
    status: "offered",
    offered_at: new Date().toISOString(),
    offer_expires_at: new Date(Date.now() + getOfferWindowMinutes("exclusive") * 60_000).toISOString(),
  }, { onConflict: "distribution_run_id,professional_id" });

  await appendDistributionActivity(leadId, "distribution_admin_override", professionalId, {
    action: "manual_offer",
    actor_user_id: actorUserId ?? null,
  });
}
