import "server-only";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type {
  Json,
  NotificationChannelType,
  ProfessionalNotificationEventType,
} from "@/types/database";
import { professionalNotificationEventTypes } from "@/types/database";

type NotificationCategory = "lead_offer_notifications" | "verification_notifications" | "document_notifications" | "progress_reminders";

function safePayload(input: Record<string, Json | undefined>): Record<string, Json> {
  const title = input.title;
  const description = input.description;
  const href = input.href;
  if (typeof title !== "string" || title.length > 120 || typeof description !== "string" || description.length > 240) {
    throw new Error("Notificatie-inhoud is ongeldig.");
  }
  const payload: Record<string, Json> = { title: title.trim(), description: description.trim() };
  if (typeof href === "string") {
    try {
      const url = new URL(href, "https://vakconnect.invalid");
      if (url.origin !== "https://vakconnect.invalid" || !url.pathname.startsWith("/")) {
        throw new Error("Notificatie-link is ongeldig.");
      }
      payload.href = `${url.pathname}${url.search}${url.hash}`;
    } catch {
      throw new Error("Notificatie-link is ongeldig.");
    }
  }
  return payload;
}

const categoryByEvent: Partial<Record<ProfessionalNotificationEventType, NotificationCategory>> = {
  lead_offer_received: "lead_offer_notifications",
  lead_offer_expiring: "lead_offer_notifications",
  lead_offer_expired: "lead_offer_notifications",
  lead_assignment_created: "lead_offer_notifications",
  lead_progress_reminder: "progress_reminders",
  onboarding_submitted: "verification_notifications",
  verification_approved: "verification_notifications",
  changes_requested: "verification_notifications",
  verification_rejected: "verification_notifications",
  verification_suspended: "verification_notifications",
  verification_sla_breached: "verification_notifications",
  document_expiring: "document_notifications",
  document_expired: "document_notifications",
  document_rejected: "document_notifications",
};

export async function createNotificationEvent(input: {
  professionalId?: string | null;
  leadId?: string | null;
  eventType: ProfessionalNotificationEventType;
  channelType: Extract<NotificationChannelType, "in_app" | "system">;
  payload: Record<string, Json | undefined>;
  deduplicationKey: string;
  scheduledFor?: string | null;
  critical?: boolean;
}) {
  if (!professionalNotificationEventTypes.includes(input.eventType)
    || (input.channelType !== "in_app" && input.channelType !== "system")
    || !input.deduplicationKey.trim()
    || input.deduplicationKey.length > 240) {
    throw new Error("Notificatie-invoer is ongeldig.");
  }
  const supabase = createAdminSupabaseClient();
  const category = categoryByEvent[input.eventType];
  const payload = safePayload(input.payload);

  if (input.professionalId && category && !input.critical && input.channelType === "in_app") {
    const { data: preference } = await supabase
      .from("professional_notification_preferences")
      .select(`in_app_enabled, ${category}`)
      .eq("professional_id", input.professionalId)
      .maybeSingle();
    const enabled = preference ? (preference as Record<string, unknown>)[category] : undefined;
    if (preference && (preference.in_app_enabled === false || enabled === false)) {
      return { id: null, created: false };
    }
  }

  const scheduledFor = input.scheduledFor ?? null;
  const { data, error } = await supabase
    .from("professional_notification_events")
    .insert({
      professional_id: input.professionalId ?? null,
      lead_id: input.leadId ?? null,
      event_type: input.eventType,
      channel_type: input.channelType,
      payload,
      status: scheduledFor ? "pending" : "delivered",
      scheduled_for: scheduledFor,
      processed_at: scheduledFor ? null : new Date().toISOString(),
      deduplication_key: input.deduplicationKey,
    })
    .select("id")
    .single();

  if (!error && data) {
    return { id: String(data.id), created: true };
  }

  if (error?.code === "23505") {
    const { data: existing } = await supabase
      .from("professional_notification_events")
      .select("id")
      .eq("deduplication_key", input.deduplicationKey)
      .maybeSingle();
    if (existing) {
      return { id: String(existing.id), created: false };
    }
  }

  throw new Error("Notificatie kon niet veilig worden opgeslagen.");
}
