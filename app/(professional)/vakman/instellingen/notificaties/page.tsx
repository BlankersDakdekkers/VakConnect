import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { requireProfessionalUser } from "@/lib/auth/helpers";
import { saveNotificationPreferencesAction } from "@/lib/notifications/actions";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const preferenceOptions = [
  { name: "lead_offer_notifications", label: "Lead offers" },
  { name: "verification_notifications", label: "Verificatie en onboarding" },
  { name: "document_notifications", label: "Documenten" },
  { name: "progress_reminders", label: "Voortgangsherinneringen" },
] as const;

export default async function ProfessionalNotificationPreferencesPage() {
  const user = await requireProfessionalUser();
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase
    .from("professional_notification_preferences")
    .select("in_app_enabled, lead_offer_notifications, verification_notifications, document_notifications, progress_reminders")
    .eq("professional_id", user.professional.id)
    .maybeSingle();
  const preferences = data ?? {
    in_app_enabled: true,
    lead_offer_notifications: true,
    verification_notifications: true,
    document_notifications: true,
    progress_reminders: true,
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Notificatie-instellingen" description="Kies welke in-app berichten je wilt ontvangen." />
      <Card>
        <form action={saveNotificationPreferencesAction} className="space-y-5">
          <label className="flex min-h-11 items-start gap-3">
            <input type="checkbox" name="in_app_enabled" defaultChecked={preferences.in_app_enabled} className="mt-1" />
            <span><span className="block font-medium">In-app notificaties</span><span className="text-sm text-muted-foreground">Schakel niet-kritieke berichten in of uit.</span></span>
          </label>
          <div className="space-y-3 border-t pt-5">
            {preferenceOptions.map((option) => (
              <label key={option.name} className="flex min-h-11 items-center gap-3">
                <input type="checkbox" name={option.name} defaultChecked={preferences[option.name]} />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
          <div className="space-y-2 border-t pt-5">
            <p className="font-medium">Externe kanalen</p>
            <p className="text-sm text-muted-foreground">Alleen in-app notificaties zijn actief. Externe berichten worden niet verstuurd.</p>
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              {["E-mail", "Sms", "WhatsApp"].map((channel) => <span key={channel} className="rounded-full border px-3 py-1.5">{channel} · niet beschikbaar</span>)}
            </div>
          </div>
          <button className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-white hover:bg-primary/90">Instellingen opslaan</button>
        </form>
      </Card>
    </div>
  );
}
