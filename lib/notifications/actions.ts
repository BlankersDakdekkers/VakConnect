"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser, requireProfessionalUser } from "@/lib/auth/helpers";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function markNotificationReadAction(formData: FormData) {
  const user = await requireProfessionalUser();
  const notificationId = String(formData.get("notification_id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(notificationId)) return;
  const supabase = await createServerSupabaseClient();
  await supabase
    .from("professional_notification_events")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId)
    .eq("professional_id", user.professional.id)
    .eq("status", "delivered")
    .is("read_at", null);
  revalidatePath("/vakman");
  revalidatePath("/vakman/notificaties");
}

export async function markAllNotificationsReadAction() {
  const user = await requireProfessionalUser();
  const supabase = await createServerSupabaseClient();
  await supabase
    .from("professional_notification_events")
    .update({ read_at: new Date().toISOString() })
    .eq("professional_id", user.professional.id)
    .eq("channel_type", "in_app")
    .eq("status", "delivered")
    .is("read_at", null);
  revalidatePath("/vakman");
  revalidatePath("/vakman/notificaties");
}

export async function markAdminNotificationReadAction(formData: FormData) {
  await requireAdminUser();
  const notificationId = String(formData.get("notification_id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(notificationId)) return;
  const supabase = await createServerSupabaseClient();
  await supabase
    .from("professional_notification_events")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId)
    .is("professional_id", null)
    .eq("channel_type", "system")
    .eq("status", "delivered")
    .is("read_at", null);
  revalidatePath("/admin/notificaties");
  revalidatePath("/admin/operatie");
}

export async function saveNotificationPreferencesAction(formData: FormData) {
  const user = await requireProfessionalUser();
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("professional_notification_preferences").upsert({
    professional_id: user.professional.id,
    in_app_enabled: formData.get("in_app_enabled") === "on",
    email_enabled: false,
    sms_enabled: false,
    whatsapp_enabled: false,
    lead_offer_notifications: formData.get("lead_offer_notifications") === "on",
    verification_notifications: formData.get("verification_notifications") === "on",
    document_notifications: formData.get("document_notifications") === "on",
    progress_reminders: formData.get("progress_reminders") === "on",
    updated_at: new Date().toISOString(),
  }, { onConflict: "professional_id" });
  if (!error) {
    revalidatePath("/vakman/instellingen/notificaties");
    revalidatePath("/vakman");
  }
}
