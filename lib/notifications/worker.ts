import "server-only";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getOperationalSettings } from "@/lib/operations/settings";
import type { NotificationChannelType, ProfessionalNotificationEventType } from "@/types/database";

type ClaimedNotification = {
  id: string;
  professional_id: string | null;
  lead_id: string | null;
  event_type: ProfessionalNotificationEventType;
  channel_type: NotificationChannelType;
  payload: Record<string, unknown>;
  attempt_count: number;
  max_attempts: number;
};

export async function startWorkerRun(workerType: string) {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("operational_worker_runs")
    .insert({ worker_type: workerType })
    .select("id")
    .single();
  if (error || !data) {
    throw new Error("Worker run kon niet worden gestart.");
  }
  return String(data.id);
}

export async function finishWorkerRun(input: {
  id: string;
  status: "completed" | "failed" | "partial";
  claimedCount: number;
  processedCount: number;
  failedCount: number;
  metadata?: Record<string, unknown>;
  errorSummary?: string | null;
}) {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("operational_worker_runs").update({
    status: input.status,
    claimed_count: input.claimedCount,
    processed_count: input.processedCount,
    failed_count: input.failedCount,
    metadata: input.metadata ?? {},
    error_summary: input.errorSummary ?? null,
    finished_at: new Date().toISOString(),
  }).eq("id", input.id);
  if (error) {
    throw new Error("Worker run kon niet worden afgerond.");
  }
}

function retryAt(baseMinutes: number, attemptCount: number) {
  const delayMinutes = Math.min(60, baseMinutes * (2 ** Math.max(0, attemptCount - 1)));
  return new Date(Date.now() + delayMinutes * 60_000).toISOString();
}

async function recordFailure(event: ClaimedNotification, baseMinutes: number, maxAttempts: number) {
  const terminal = event.attempt_count >= Math.min(event.max_attempts, maxAttempts);
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("professional_notification_events")
    .update({
      status: terminal ? "failed" : "pending",
      failed_at: terminal ? new Date().toISOString() : null,
      scheduled_for: terminal ? null : retryAt(baseMinutes, event.attempt_count),
      processing_started_at: null,
      last_error: "delivery_failed",
    })
    .eq("id", event.id)
    .eq("status", "processing");
  if (error) {
    throw new Error("Notificatieverwerking kon niet veilig worden bijgewerkt.");
  }
}

export async function processPendingNotifications(batchSize = 100) {
  const runId = await startWorkerRun("notifications");
  const supabase = createAdminSupabaseClient();
  let claimed: ClaimedNotification[] = [];
  let processed = 0;
  let failed = 0;

  try {
    const [claimResult, settings] = await Promise.all([
      supabase.rpc("claim_pending_notification_events", { max_count: batchSize }),
      getOperationalSettings(),
    ]);
    if (claimResult.error) {
      throw new Error("Notificaties konden niet veilig worden geclaimd.");
    }
    claimed = (claimResult.data ?? []) as ClaimedNotification[];

    for (const event of claimed) {
      if (event.channel_type !== "in_app" && event.channel_type !== "system") {
        await recordFailure(event, settings.notificationRetryBaseMinutes, settings.notificationMaxAttempts);
        failed += 1;
        continue;
      }
      const { error } = await supabase
        .from("professional_notification_events")
        .update({
          status: "delivered",
          processed_at: new Date().toISOString(),
          processing_started_at: null,
          failed_at: null,
          last_error: null,
        })
        .eq("id", event.id)
        .eq("status", "processing");
      if (error) {
        await recordFailure(event, settings.notificationRetryBaseMinutes, settings.notificationMaxAttempts);
        failed += 1;
      } else {
        processed += 1;
      }
    }

    await finishWorkerRun({
      id: runId,
      status: failed ? "partial" : "completed",
      claimedCount: claimed.length,
      processedCount: processed,
      failedCount: failed,
    });
    return { processed, failed, status: failed ? "partial" as const : "completed" as const };
  } catch {
    await finishWorkerRun({
      id: runId,
      status: "failed",
      claimedCount: claimed.length,
      processedCount: processed,
      failedCount: failed + 1,
      errorSummary: "notification_worker_failed",
    });
    return { processed, failed: failed + 1, status: "failed" as const };
  }
}
