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
    .order("created_at", { ascending: false })
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
  const dayAgo = new Date(Date.now() - 24 * 60 * 60_000).toISOString();

  const [
    pendingReviews,
    expiringDocuments,
    expiredDocuments,
    exhaustedRuns,
    unmatchedLeads,
    staleAssignments,
    failedNotifications,
    failedWorkers,
    latestRuns,
  ] = await Promise.all([
    supabase.from("professionals").select("id", { count: "exact", head: true }).eq("onboarding_status", "submitted").lte("submitted_for_review_at", slaCutoff),
    supabase.from("professional_documents").select("id", { count: "exact", head: true }).is("archived_at", null).in("verification_status", ["pending", "approved"]).gt("expires_at", new Date().toISOString()).lte("expires_at", documentCutoff),
    supabase.from("professional_documents").select("id", { count: "exact", head: true }).is("archived_at", null).eq("verification_status", "expired"),
    supabase.from("lead_distribution_runs").select("id", { count: "exact", head: true }).eq("status", "exhausted"),
    supabase.from("professional_notification_events").select("id", { count: "exact", head: true }).eq("event_type", "unmatched_lead").eq("channel_type", "system").eq("status", "delivered"),
    supabase.from("lead_assignments").select("id", { count: "exact", head: true }).in("progress_status", ["new", "contacted", "appointment_scheduled", "quote_sent"]).lte("assigned_at", assignmentCutoff),
    supabase.from("professional_notification_events").select("id", { count: "exact", head: true }).eq("status", "failed"),
    supabase.from("operational_worker_runs").select("id", { count: "exact", head: true }).in("status", ["failed", "partial"]).gte("started_at", dayAgo),
    supabase.from("operational_worker_runs").select("id, worker_type, started_at, finished_at, status, claimed_count, processed_count, failed_count, error_summary").order("started_at", { ascending: false }).limit(10),
  ]);

  const counts = {
    pendingReviews: pendingReviews.count ?? 0,
    expiringDocuments: expiringDocuments.count ?? 0,
    expiredDocuments: expiredDocuments.count ?? 0,
    exhaustedRuns: exhaustedRuns.count ?? 0,
    unmatchedLeads: unmatchedLeads.count ?? 0,
    staleAssignments: staleAssignments.count ?? 0,
    failedNotifications: failedNotifications.count ?? 0,
    failedWorkers: failedWorkers.count ?? 0,
  };
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  const health = counts.failedWorkers > 0 || counts.failedNotifications > 0 ? "critical" : total > 0 ? "attention" : "healthy";

  return {
    counts,
    health,
    latestRuns: latestRuns.data ?? [],
  };
}
