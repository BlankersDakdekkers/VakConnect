import "server-only";

import { refreshProfessionalDerivedState } from "@/lib/professionals/derived";
import { activateOffersForRun } from "@/lib/distribution/engine";
import { addLeadActivity } from "@/lib/leads/activity";
import { createNotificationEvent } from "@/lib/notifications/events";
import { finishWorkerRun, startWorkerRun } from "@/lib/notifications/worker";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getOperationalSettings } from "@/lib/operations/settings";

const dayMs = 24 * 60 * 60 * 1000;

function isoBefore(milliseconds: number) {
  return new Date(Date.now() - milliseconds).toISOString();
}

function safeRow(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

async function runTracked(workerType: string, work: () => Promise<{ processed: number; failed: number; metadata?: Record<string, unknown> }>) {
  const runId = await startWorkerRun(workerType);
  try {
    const result = await work();
    await finishWorkerRun({
      id: runId,
      status: result.failed ? "partial" : "completed",
      claimedCount: result.processed + result.failed,
      processedCount: result.processed,
      failedCount: result.failed,
      metadata: result.metadata,
    });
    return { processed: result.processed, failed: result.failed, status: result.failed ? "partial" as const : "completed" as const };
  } catch {
    await finishWorkerRun({
      id: runId,
      status: "failed",
      claimedCount: 0,
      processedCount: 0,
      failedCount: 1,
      errorSummary: `${workerType}_failed`,
    });
    return { processed: 0, failed: 1, status: "failed" as const };
  }
}

async function isRequiredDocument(professionalId: string, documentType: string) {
  const supabase = createAdminSupabaseClient();
  const [requirements, services] = await Promise.all([
    supabase.from("professional_document_requirements").select("service_id").eq("document_type", documentType).eq("requirement_level", "required"),
    supabase.from("professional_services").select("service_id").eq("professional_id", professionalId).eq("active", true),
  ]);
  if (requirements.error || services.error) {
    throw new Error("Documentvereisten konden niet worden gecontroleerd.");
  }
  const activeServiceIds = new Set((services.data ?? []).map((row) => String(row.service_id)));
  return (requirements.data ?? []).some((row) => row.service_id === null || activeServiceIds.has(String(row.service_id)));
}

export async function processDocumentExpiry() {
  return runTracked("document_expiry", async () => {
    const supabase = createAdminSupabaseClient();
    const settings = await getOperationalSettings();
    const maxDays = Math.max(...settings.documentExpiryReminderDays, 0);
    const now = new Date();
    const [reminderResult, expiryResult] = await Promise.all([
      supabase
        .from("professional_documents")
        .select("id, professional_id, document_type, expires_at, verification_status, expiry_processed_at, expiry_processing_started_at")
        .is("archived_at", null)
        .not("expires_at", "is", null)
        .gt("expires_at", now.toISOString())
        .lte("expires_at", new Date(now.getTime() + maxDays * dayMs).toISOString())
        .in("verification_status", ["pending", "approved"])
        .order("expires_at", { ascending: true })
        .limit(500),
      supabase.rpc("claim_expired_professional_documents", { max_count: 200 }),
    ]);
    if (reminderResult.error || expiryResult.error) {
      throw new Error("Documentvervaldata kon niet worden geladen.");
    }
    const documents = [
      ...(reminderResult.data ?? []),
      ...((expiryResult.data ?? []) as Array<Record<string, unknown>>),
    ];

    let processed = 0;
    let failed = 0;
    for (const row of documents ?? []) {
      try {
        const document = safeRow(row);
        const id = String(document.id);
        const professionalId = String(document.professional_id);
        const expiresAt = new Date(String(document.expires_at)).getTime();
        const expiresAtIso = new Date(expiresAt).toISOString();
        const daysRemaining = Math.ceil((expiresAt - Date.now()) / dayMs);
        const expiryLease = typeof document.expiry_processing_started_at === "string" ? document.expiry_processing_started_at : null;
        const required = await isRequiredDocument(professionalId, String(document.document_type));

        if (daysRemaining <= 0) {
          if (!expiryLease) continue;
          if (document.verification_status !== "expired") {
            const { error: expireError } = await supabase
              .from("professional_documents")
              .update({ verification_status: "expired" })
              .eq("id", id)
              .in("verification_status", ["pending", "approved"]);
            if (expireError) throw new Error("Documentstatus kon niet worden bijgewerkt.");
          }

          await createNotificationEvent({
            professionalId,
            eventType: "document_expired",
            channelType: "in_app",
            critical: required,
            deduplicationKey: `document-expired:${id}`,
            payload: {
              title: "Document verlopen",
              description: required ? "Een vereist document is verlopen. Werk je profiel bij om verificatie te herstellen." : "Een document is verlopen. Bekijk of vervanging nodig is.",
              href: "/vakman/profiel",
            },
          });

          if (required) {
            await createNotificationEvent({
              eventType: "document_expiry_attention",
              channelType: "system",
              deduplicationKey: `document-expiry-attention:${id}`,
              critical: true,
              payload: {
                title: "Vereist document verlopen",
                description: "Een vereist professioneel document is verlopen.",
                href: `/admin/vakmannen/${professionalId}`,
              },
            });
            const { data: skippedCandidates, error: candidateError } = await supabase
              .from("lead_distribution_candidates")
              .update({ status: "skipped", skipped_at: new Date().toISOString() })
              .eq("professional_id", professionalId)
              .in("status", ["offered", "viewed"])
              .select("id, lead_id, distribution_run_id");
            if (candidateError) throw new Error("Lead offers konden niet opnieuw worden beoordeeld.");
            const affectedRuns = new Set((skippedCandidates ?? []).map((candidate) => String(candidate.distribution_run_id)));
            for (const candidate of skippedCandidates ?? []) {
              await addLeadActivity({
                leadId: String(candidate.lead_id),
                professionalId,
                activityType: "candidate_skipped",
                metadata: { candidate_id: String(candidate.id), reason: "required_document_expired" },
              });
            }
            const { data: previouslySkipped, error: skippedError } = await supabase
              .from("lead_distribution_candidates")
              .select("distribution_run_id")
              .eq("professional_id", professionalId)
              .eq("status", "skipped")
              .gte("skipped_at", expiresAtIso);
            if (skippedError) throw new Error("Distributieruns konden niet opnieuw worden beoordeeld.");
            for (const candidate of previouslySkipped ?? []) affectedRuns.add(String(candidate.distribution_run_id));

            await refreshProfessionalDerivedState(professionalId);
            for (const runId of affectedRuns) await activateOffersForRun(runId);
          }

          const { data: completed, error: processedError } = await supabase
            .from("professional_documents")
            .update({
              expiry_processed_at: new Date().toISOString(),
              expiry_processing_started_at: null,
            })
            .eq("id", id)
            .eq("expiry_processing_started_at", expiryLease)
            .is("expiry_processed_at", null)
            .select("id");
          if (processedError) throw new Error("Documentvervalverwerking kon niet worden afgerond.");
          if (completed?.length) processed += 1;
          else failed += 1;
        } else {
          for (const reminderDays of settings.documentExpiryReminderDays) {
            if (daysRemaining <= reminderDays) {
              await createNotificationEvent({
                professionalId,
                eventType: "document_expiring",
                channelType: "in_app",
                deduplicationKey: `document-expiry:${id}:${reminderDays}d`,
                payload: {
                  title: "Document verloopt binnenkort",
                  description: `Een document verloopt over ongeveer ${daysRemaining} dagen.`,
                  href: "/vakman/profiel",
                },
              });
              processed += 1;
            }
          }
        }
      } catch {
        failed += 1;
      }
    }
    return { processed, failed, metadata: { checkedDocumentCount: documents?.length ?? 0 } };
  });
}

export async function processReminderChecks() {
  return runTracked("reminders", async () => {
    const supabase = createAdminSupabaseClient();
    const settings = await getOperationalSettings();
    let processed = 0;
    let failed = 0;

    const pendingCutoff = isoBefore(settings.verificationSlaHours.first * 60 * 60 * 1000);
    const { data: pendingReviews, error: reviewError } = await supabase
      .from("professionals")
      .select("id, submitted_for_review_at")
      .eq("onboarding_status", "submitted")
      .not("submitted_for_review_at", "is", null)
      .lte("submitted_for_review_at", pendingCutoff)
      .limit(500);
    if (reviewError) throw new Error("Verificatiestatus kon niet worden gecontroleerd.");
    for (const row of pendingReviews ?? []) {
      const proId = String(row.id);
      const submittedAt = String(row.submitted_for_review_at);
      const hours = Date.now() - new Date(submittedAt).getTime() >= settings.verificationSlaHours.breach * 60 * 60 * 1000;
      try {
        await createNotificationEvent({
          eventType: hours ? "verification_sla_breached" : "operational_alert",
          channelType: "system",
          critical: true,
          deduplicationKey: `verification-sla:${proId}:${hours ? "breach" : "first"}`,
          payload: {
            title: hours ? "Verificatie wacht langer dan de SLA" : "Verificatie vraagt aandacht",
            description: hours ? "Een onboardingreview wacht langer dan de interne SLA." : "Een onboardingreview nadert de interne SLA.",
            href: `/admin/vakmannen/${proId}`,
          },
        });
        processed += 1;
      } catch {
        failed += 1;
      }
    }

    const changesCutoff = isoBefore(settings.changesRequestedReminderHours * 60 * 60 * 1000);
    const { data: feedback, error: feedbackError } = await supabase
      .from("professional_review_feedback")
      .select("id, professional_id, created_at")
      .eq("status", "open")
      .lte("created_at", changesCutoff)
      .limit(500);
    if (feedbackError) throw new Error("Openstaande reviewfeedback kon niet worden gecontroleerd.");
    for (const row of feedback ?? []) {
      try {
        await createNotificationEvent({
          professionalId: String(row.professional_id),
          eventType: "changes_requested",
          channelType: "in_app",
          deduplicationKey: `verification-reminder:${String(row.professional_id)}:${String(row.id)}:${settings.changesRequestedReminderHours}h`,
          payload: {
            title: "Aanpassingen gevraagd",
            description: "Je hebt openstaande feedback bij je verificatie. Werk je profiel bij.",
            href: "/vakman/onboarding",
          },
        });
        processed += 1;
      } catch {
        failed += 1;
      }
    }

    const offerCutoff = new Date(Date.now() + settings.offerReminderOffsetMinutes * 60_000).toISOString();
    const { data: offers, error: offersError } = await supabase
      .from("lead_distribution_candidates")
      .select("id, lead_id, professional_id, offer_expires_at")
      .in("status", ["offered", "viewed"])
      .not("offer_expires_at", "is", null)
      .gt("offer_expires_at", new Date().toISOString())
      .lte("offer_expires_at", offerCutoff)
      .limit(500);
    if (offersError) throw new Error("Lead offers konden niet worden gecontroleerd.");
    for (const row of offers ?? []) {
      try {
        await createNotificationEvent({
          professionalId: String(row.professional_id),
          leadId: String(row.lead_id),
          eventType: "lead_offer_expiring",
          channelType: "in_app",
          deduplicationKey: `lead-offer-expiry:${String(row.id)}`,
          payload: {
            title: "Lead offer verloopt binnenkort",
            description: "Bekijk het aanbod voordat de reactietermijn afloopt.",
            href: "/vakman/aanvragen",
          },
        });
        processed += 1;
      } catch {
        failed += 1;
      }
    }

    const recentlyExpiredSince = isoBefore(dayMs);
    const { data: expiredOffers, error: expiredOfferError } = await supabase
      .from("lead_distribution_candidates")
      .select("id, lead_id, professional_id")
      .eq("status", "expired")
      .gte("expired_at", recentlyExpiredSince)
      .limit(500);
    if (expiredOfferError) throw new Error("Verlopen lead offers konden niet worden gecontroleerd.");
    for (const row of expiredOffers ?? []) {
      try {
        await createNotificationEvent({
          professionalId: String(row.professional_id),
          leadId: String(row.lead_id),
          eventType: "lead_offer_expired",
          channelType: "in_app",
          deduplicationKey: `lead-offer-expired:${String(row.id)}`,
          payload: {
            title: "Lead offer verlopen",
            description: "De reactietermijn voor dit aanbod is verstreken.",
            href: "/vakman/aanvragen",
          },
        });
        processed += 1;
      } catch {
        failed += 1;
      }
    }

    const assignmentsCreatedSince = isoBefore(dayMs);
    const { data: newAssignments, error: newAssignmentsError } = await supabase
      .from("lead_assignments")
      .select("id, lead_id, professional_id")
      .in("status", ["accepted", "pending", "viewed"])
      .gte("assigned_at", assignmentsCreatedSince)
      .limit(500);
    if (newAssignmentsError) throw new Error("Nieuwe opdrachten konden niet worden gecontroleerd.");
    for (const row of newAssignments ?? []) {
      try {
        await createNotificationEvent({
          professionalId: String(row.professional_id),
          leadId: String(row.lead_id),
          eventType: "lead_assignment_created",
          channelType: "in_app",
          deduplicationKey: `lead-assignment-created:${String(row.id)}`,
          payload: {
            title: "Nieuwe opdracht",
            description: "Er staat een nieuwe leadopdracht voor je klaar.",
            href: `/vakman/aanvragen/${String(row.lead_id)}`,
          },
        });
        processed += 1;
      } catch {
        failed += 1;
      }
    }

    const assignmentCutoff = isoBefore(settings.progressReminderDelayDays * dayMs);
    const { data: assignments, error: assignmentError } = await supabase
      .from("lead_assignments")
      .select("id, lead_id, professional_id, progress_status, progress_updated_at, assigned_at")
      .in("status", ["accepted", "pending", "viewed"])
      .lte("assigned_at", assignmentCutoff)
      .or(`progress_updated_at.lt.${assignmentCutoff},progress_updated_at.is.null`)
      .limit(500);
    if (assignmentError) throw new Error("Leadvoortgang kon niet worden gecontroleerd.");
    for (const row of assignments ?? []) {
      try {
        const status = String(row.progress_status);
        await createNotificationEvent({
          professionalId: String(row.professional_id),
          leadId: String(row.lead_id),
          eventType: "lead_progress_reminder",
          channelType: "in_app",
          deduplicationKey: `lead-progress:${String(row.id)}:${status}`,
          payload: {
            title: "Werk de leadvoortgang bij",
            description: status === "new" ? "Leg vast of je contact hebt opgenomen met de klant." : "Werk de actuele status van je opdracht bij.",
            href: `/vakman/aanvragen/${String(row.lead_id)}`,
          },
        });
        processed += 1;
      } catch {
        failed += 1;
      }
    }

    const noDistributionCutoff = isoBefore(settings.staleLeadThresholds.noDistributionMinutes * 60_000);
    const { data: unprocessedLeads, error: leadsError } = await supabase
      .from("leads")
      .select("id, created_at")
      .in("status", ["new", "qualified", "matched"])
      .lte("created_at", noDistributionCutoff)
      .order("created_at", { ascending: true })
      .limit(250);
    if (leadsError) throw new Error("Onverdeelde leads konden niet worden gecontroleerd.");
    for (const lead of unprocessedLeads ?? []) {
      const { count } = await supabase.from("lead_distribution_runs").select("id", { count: "exact", head: true }).eq("lead_id", String(lead.id));
      if (count) continue;
      try {
        await createNotificationEvent({
          eventType: "unmatched_lead",
          channelType: "system",
          critical: true,
          leadId: String(lead.id),
          deduplicationKey: `stale-no-distribution:${String(lead.id)}`,
          payload: {
            title: "Lead zonder distributierun",
            description: "Een lead heeft nog geen distributierun.",
            href: `/admin/leads/${String(lead.id)}`,
          },
        });
        processed += 1;
      } catch {
        failed += 1;
      }
    }

    const staleRunCutoff = isoBefore(settings.staleLeadThresholds.distributedNoPurchaseHours * 60 * 60 * 1000);
    const { data: staleRuns, error: staleRunsError } = await supabase
      .from("lead_distribution_runs")
      .select("id, lead_id, status")
      .in("status", ["active", "exhausted"])
      .lte("started_at", staleRunCutoff)
      .limit(250);
    if (staleRunsError) throw new Error("Distributieruns konden niet worden gecontroleerd.");
    for (const run of staleRuns ?? []) {
      const { count } = await supabase
        .from("lead_purchases")
        .select("id", { count: "exact", head: true })
        .eq("lead_id", String(run.lead_id))
        .eq("status", "purchased");
      if (count) continue;
      const exhausted = run.status === "exhausted";
      try {
        await createNotificationEvent({
          eventType: exhausted ? "distribution_exhausted" : "no_purchase_lead",
          channelType: "system",
          critical: true,
          leadId: String(run.lead_id),
          deduplicationKey: `${exhausted ? "distribution-exhausted" : "no-purchase"}:${String(run.lead_id)}:${String(run.id)}`,
          payload: {
            title: exhausted ? "Distributie uitgeput" : "Lead zonder aankoop",
            description: exhausted ? "De distributierun is uitgeput zonder aankoop of assignment." : "Een lead is gedistribueerd maar heeft nog geen aankoop.",
            href: `/admin/leads/${String(run.lead_id)}`,
          },
        });
        processed += 1;
      } catch {
        failed += 1;
      }
    }

    return { processed, failed, metadata: { checkedReviews: pendingReviews?.length ?? 0 } };
  });
}

export async function processOperationsHealthCheck() {
  return runTracked("operations", async () => {
    const supabase = createAdminSupabaseClient();
    const settings = await getOperationalSettings();
    let processed = 0;
    let failed = 0;

    const failedSince = isoBefore(dayMs);
    const { data: workerRuns, error: runsError } = await supabase
      .from("operational_worker_runs")
      .select("id, worker_type, status, finished_at")
      .in("status", ["failed", "partial"])
      .gte("started_at", failedSince)
      .order("started_at", { ascending: false })
      .limit(100);
    if (runsError) throw new Error("Workerstatus kon niet worden gecontroleerd.");
    const failuresByWorker = new Map<string, typeof workerRuns>();
    for (const run of workerRuns ?? []) {
      const workerType = String(run.worker_type);
      const existing = failuresByWorker.get(workerType) ?? [];
      existing.push(run);
      failuresByWorker.set(workerType, existing);
    }
    for (const [workerType, runs] of failuresByWorker) {
      if (runs.length < 3) continue;
      try {
        await createNotificationEvent({
          eventType: workerType === "distribution" ? "distribution_worker_failed" : "operational_alert",
          channelType: "system",
          critical: true,
          deduplicationKey: `worker-failure:${workerType}:${new Date().toISOString().slice(0, 10)}`,
          payload: {
            title: "Worker herhaaldelijk mislukt",
            description: "Een operationele worker heeft meerdere runs met fouten.",
            href: "/admin/operatie",
          },
        });
        processed += 1;
      } catch {
        failed += 1;
      }
    }

    const assignmentCutoff = isoBefore(settings.staleLeadThresholds.assignmentProgressDays * dayMs);
    const { data: noProgress, error: noProgressError } = await supabase
      .from("lead_assignments")
      .select("id")
      .in("progress_status", ["new", "contacted", "appointment_scheduled", "quote_sent"])
      .lte("progress_updated_at", assignmentCutoff)
      .limit(500);
    if (noProgressError) throw new Error("Openstaande assignments konden niet worden geteld.");

    return {
      processed,
      failed,
      metadata: { failedWorkerTypes: failuresByWorker.size, assignmentsWithoutProgress: noProgress?.length ?? 0 },
    };
  });
}
