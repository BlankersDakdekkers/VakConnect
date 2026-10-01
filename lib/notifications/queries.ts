import "server-only";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getOperationalSettings } from "@/lib/operations/settings";
import type { ProfessionalNotificationEventType } from "@/types/database";

export type NotificationListItem = {
  id: string;
  event_type: ProfessionalNotificationEventType;
  payload: Record<string, unknown>;
  created_at: string;
  read_at: string | null;
  lead_id: string | null;
};

export async function getProfessionalNotifications(professionalId: string) {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("professional_notification_events")
    .select("id, event_type, payload, created_at, read_at, lead_id")
    .eq("professional_id", professionalId)
    .eq("status", "delivered")
    .eq("channel_type", "in_app")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error("Notificaties konden niet worden geladen.");
  return (data ?? []) as NotificationListItem[];
}

export async function getProfessionalUnreadNotificationCount(professionalId: string) {
  const supabase = createAdminSupabaseClient();
  const { count, error } = await supabase
    .from("professional_notification_events")
    .select("id", { count: "exact", head: true })
    .eq("professional_id", professionalId)
    .eq("status", "delivered")
    .eq("channel_type", "in_app")
    .is("read_at", null);
  if (error) return 0;
  return count ?? 0;
}

export async function getAdminNotifications() {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("professional_notification_events")
    .select("id, event_type, payload, created_at, read_at, lead_id")
    .is("professional_id", null)
    .eq("channel_type", "system")
    .eq("status", "delivered")
    .order("created_at", { ascending: true })
    .limit(100);
  if (error) throw new Error("Operationele meldingen konden niet worden geladen.");
  return (data ?? []) as NotificationListItem[];
}

export async function getOperationalDashboard() {
  const supabase = createAdminSupabaseClient();
  const settings = await getOperationalSettings();
  const slaCutoff = new Date(Date.now() - settings.verificationSlaHours.breach * 60 * 60_000).toISOString();
  const documentCutoff = new Date(Date.now() + Math.max(...settings.documentExpiryReminderDays, 0) * 24 * 60 * 60_000).toISOString();
  const assignmentCutoff = new Date(Date.now() - settings.staleLeadThresholds.assignmentProgressDays * 24 * 60 * 60_000).toISOString();
  const unmatchedCutoff = new Date(Date.now() - settings.staleLeadThresholds.noDistributionMinutes * 60_000).toISOString();
  const noPurchaseCutoff = new Date(Date.now() - settings.staleLeadThresholds.distributedNoPurchaseHours * 60 * 60_000).toISOString();
  const dayAgo = new Date(Date.now() - 24 * 60 * 60_000).toISOString();

  const [
    pendingReviews,
    expiringDocuments,
    expiredDocuments,
    exhaustedRuns,
    oldLeads,
    oldRuns,
    requirements,
    activeServices,
    staleAssignments,
    failedNotifications,
    failedWorkers,
    latestRuns,
  ] = await Promise.all([
    supabase.from("professionals").select("id", { count: "exact", head: true }).eq("onboarding_status", "submitted").lte("submitted_for_review_at", slaCutoff),
    supabase.from("professional_documents").select("id", { count: "exact", head: true }).is("archived_at", null).in("verification_status", ["pending", "approved"]).gt("expires_at", new Date().toISOString()).lte("expires_at", documentCutoff),
    supabase.from("professional_documents").select("id, professional_id, document_type").is("archived_at", null).eq("verification_status", "expired"),
    supabase.from("lead_distribution_runs").select("id", { count: "exact", head: true }).eq("status", "exhausted"),
    supabase.from("leads").select("id").in("status", ["new", "qualified", "matched"]).lte("created_at", unmatchedCutoff).limit(250),
    supabase.from("lead_distribution_runs").select("id, lead_id").in("status", ["active", "exhausted"]).lte("started_at", noPurchaseCutoff).limit(250),
    supabase.from("professional_document_requirements").select("document_type, service_id").eq("requirement_level", "required"),
    supabase.from("professional_services").select("professional_id, service_id").eq("active", true),
    supabase.from("lead_assignments").select("id", { count: "exact", head: true }).in("progress_status", ["new", "contacted", "appointment_scheduled", "quote_sent"]).lte("assigned_at", assignmentCutoff).or(`progress_updated_at.lte.${assignmentCutoff},progress_updated_at.is.null`),
    supabase.from("professional_notification_events").select("id", { count: "exact", head: true }).eq("status", "failed"),
    supabase.from("operational_worker_runs").select("id", { count: "exact", head: true }).in("status", ["failed", "partial"]).gte("started_at", dayAgo),
    supabase.from("operational_worker_runs").select("id, worker_type, started_at, finished_at, status, claimed_count, processed_count, failed_count, error_summary").order("started_at", { ascending: false }).limit(10),
  ]);

  const serviceIdsByProfessional = new Map<string, Set<string>>();
  for (const service of activeServices.data ?? []) {
    const professionalId = String(service.professional_id);
    const serviceIds = serviceIdsByProfessional.get(professionalId) ?? new Set<string>();
    serviceIds.add(String(service.service_id));
    serviceIdsByProfessional.set(professionalId, serviceIds);
  }
  const expiredRequiredCount = (expiredDocuments.data ?? []).filter((document) => (requirements.data ?? []).some((requirement) =>
    requirement.document_type === document.document_type
    && (requirement.service_id === null || serviceIdsByProfessional.get(String(document.professional_id))?.has(String(requirement.service_id))),
  )).length;

  let unmatchedLeadCount = 0;
  for (const lead of oldLeads.data ?? []) {
    const { count } = await supabase.from("lead_distribution_runs").select("id", { count: "exact", head: true }).eq("lead_id", String(lead.id));
    if (!count) unmatchedLeadCount += 1;
  }
  let noPurchaseLeadCount = 0;
  for (const run of oldRuns.data ?? []) {
    const { count } = await supabase.from("lead_purchases").select("id", { count: "exact", head: true }).eq("lead_id", String(run.lead_id)).eq("status", "purchased");
    if (!count) noPurchaseLeadCount += 1;
  }

  const counts = {
    pendingReviews: pendingReviews.count ?? 0,
    expiringDocuments: expiringDocuments.count ?? 0,
    expiredRequiredDocuments: expiredRequiredCount,
    exhaustedRuns: exhaustedRuns.count ?? 0,
    unmatchedLeads: unmatchedLeadCount,
    noPurchaseLeads: noPurchaseLeadCount,
    staleAssignments: staleAssignments.count ?? 0,
    failedNotifications: failedNotifications.count ?? 0,
    failedWorkers: failedWorkers.count ?? 0,
  };
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  const health: "healthy" | "attention" | "critical" =
    counts.failedWorkers > 0 || counts.failedNotifications > 0 ? "critical" : total > 0 ? "attention" : "healthy";

  return {
    counts,
    health,
    latestRuns: latestRuns.data ?? [],
  };
}
