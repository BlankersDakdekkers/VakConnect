import "server-only";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export type OperationalSettings = {
  verificationSlaHours: { first: number; breach: number };
  changesRequestedReminderHours: number;
  documentExpiryReminderDays: number[];
  offerReminderOffsetMinutes: number;
  staleLeadThresholds: {
    noDistributionMinutes: number;
    distributedNoPurchaseHours: number;
    assignmentProgressDays: number;
  };
  progressReminderDelayDays: number;
  notificationMaxAttempts: number;
  notificationRetryBaseMinutes: number;
};

const defaults: OperationalSettings = {
  verificationSlaHours: { first: 24, breach: 48 },
  changesRequestedReminderHours: 72,
  documentExpiryReminderDays: [30, 7],
  offerReminderOffsetMinutes: 60,
  staleLeadThresholds: {
    noDistributionMinutes: 15,
    distributedNoPurchaseHours: 24,
    assignmentProgressDays: 3,
  },
  progressReminderDelayDays: 3,
  notificationMaxAttempts: 5,
  notificationRetryBaseMinutes: 2,
};

function asNumber(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export async function getOperationalSettings(): Promise<OperationalSettings> {
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase.from("operational_settings").select("setting_key, setting_value");
  const settings = new Map((data ?? []).map((row) => [String(row.setting_key), row.setting_value as unknown]));
  const sla = settings.get("verification_sla_hours") as Record<string, unknown> | undefined;
  const stale = settings.get("stale_lead_thresholds") as Record<string, unknown> | undefined;
  const reminderDays = settings.get("document_expiry_reminder_days");

  return {
    verificationSlaHours: {
      first: asNumber(sla?.first, defaults.verificationSlaHours.first),
      breach: asNumber(sla?.breach, defaults.verificationSlaHours.breach),
    },
    changesRequestedReminderHours: asNumber(settings.get("changes_requested_reminder_hours"), defaults.changesRequestedReminderHours),
    documentExpiryReminderDays: Array.isArray(reminderDays)
      ? reminderDays.map((value) => asNumber(value, 0)).filter((value) => value >= 0)
      : defaults.documentExpiryReminderDays,
    offerReminderOffsetMinutes: asNumber(settings.get("offer_reminder_offset_minutes"), defaults.offerReminderOffsetMinutes),
    staleLeadThresholds: {
      noDistributionMinutes: asNumber(stale?.no_distribution_minutes, defaults.staleLeadThresholds.noDistributionMinutes),
      distributedNoPurchaseHours: asNumber(stale?.distributed_no_purchase_hours, defaults.staleLeadThresholds.distributedNoPurchaseHours),
      assignmentProgressDays: asNumber(stale?.assignment_progress_days, defaults.staleLeadThresholds.assignmentProgressDays),
    },
    progressReminderDelayDays: asNumber(settings.get("progress_reminder_delay_days"), defaults.progressReminderDelayDays),
    notificationMaxAttempts: asNumber(settings.get("notification_max_attempts"), defaults.notificationMaxAttempts),
    notificationRetryBaseMinutes: asNumber(settings.get("notification_retry_base_minutes"), defaults.notificationRetryBaseMinutes),
  };
}
