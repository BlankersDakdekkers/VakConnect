import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { markAllNotificationsReadAction, markNotificationReadAction } from "@/lib/notifications/actions";
import { getProfessionalNotifications, getProfessionalUnreadNotificationCount } from "@/lib/notifications/queries";
import { requireProfessionalUser } from "@/lib/auth/helpers";
import { formatDate } from "@/lib/utils";
import type { ProfessionalNotificationEventType } from "@/types/database";

const eventLabels: Record<ProfessionalNotificationEventType, string> = {
  onboarding_submitted: "Aanmelding ontvangen",
  verification_approved: "Verificatie goedgekeurd",
  changes_requested: "Aanpassingen gevraagd",
  verification_rejected: "Verificatie afgewezen",
  verification_suspended: "Verificatie opgeschort",
  document_expiring: "Document verloopt binnenkort",
  document_expired: "Document verlopen",
  document_rejected: "Document afgekeurd",
  lead_offer_received: "Nieuw lead offer",
  lead_offer_expiring: "Lead offer verloopt binnenkort",
  lead_offer_expired: "Lead offer verlopen",
  lead_assignment_created: "Nieuwe opdracht",
  lead_progress_reminder: "Werk de leadvoortgang bij",
  verification_sla_breached: "Verificatie vraagt aandacht",
  document_expiry_attention: "Document vraagt aandacht",
  distribution_exhausted: "Distributie uitgeput",
  distribution_worker_failed: "Worker mislukt",
  stale_lead: "Lead vraagt aandacht",
  unmatched_lead: "Lead zonder match",
  no_purchase_lead: "Lead zonder aankoop",
  operational_alert: "Operationele melding",
};

function payloadText(payload: Record<string, unknown>, key: string, fallback: string) {
  const value = payload[key];
  return typeof value === "string" ? value : fallback;
}

function safeInternalHref(value: unknown) {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value, "https://vakconnect.invalid");
    return url.origin === "https://vakconnect.invalid" && url.pathname.startsWith("/") ? `${url.pathname}${url.search}${url.hash}` : null;
  } catch {
    return null;
  }
}

export default async function ProfessionalNotificationsPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const user = await requireProfessionalUser();
  const params = await searchParams;
  const requestedPage = typeof params.page === "string" ? Number(params.page) : 1;
  const [notificationPage, unreadCount] = await Promise.all([
    getProfessionalNotifications(user.professional.id, requestedPage),
    getProfessionalUnreadNotificationCount(user.professional.id),
  ]);
  const notifications = notificationPage.items;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notificaties"
        description="Je in-app berichten over verificatie, documenten en leads."
        actions={unreadCount ? (
          <form action={markAllNotificationsReadAction}>
            <button className="rounded-full border px-4 py-2 text-sm font-medium hover:bg-surface-muted">Alles als gelezen markeren</button>
          </form>
        ) : undefined}
      />
      {!notifications.length ? (
        <Card><p className="text-sm text-muted-foreground">Je hebt nog geen notificaties.</p></Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const title = payloadText(notification.payload, "title", eventLabels[notification.event_type]);
            const description = payloadText(notification.payload, "description", "Er is een update voor je account.");
            const href = safeInternalHref(notification.payload.href);
            return (
              <Card key={notification.id} className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold">{title}</h2>
                    {!notification.read_at ? <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">Nieuw</span> : null}
                  </div>
                  <p className="text-sm text-muted-foreground">{description}</p>
                  <time className="block text-xs text-muted-foreground" dateTime={notification.created_at}>{formatDate(notification.created_at)}</time>
                  {href ? <Link href={href} className="inline-block text-sm font-medium text-primary hover:underline">Bekijk details</Link> : null}
                </div>
                {!notification.read_at ? (
                  <form action={markNotificationReadAction}>
                    <input type="hidden" name="notification_id" value={notification.id} />
                    <button className="rounded-full border px-3 py-2 text-sm hover:bg-surface-muted">Markeer als gelezen</button>
                  </form>
                ) : null}
              </Card>
            );
          })}
        </div>
      )}
      {notificationPage.pageCount > 1 ? (
        <nav aria-label="Paginering notificaties" className="flex items-center justify-between">
          <Link aria-disabled={notificationPage.page <= 1} className={`rounded-full border px-4 py-2 text-sm ${notificationPage.page <= 1 ? "pointer-events-none opacity-50" : "hover:bg-surface-muted"}`} href={`/vakman/notificaties?page=${notificationPage.page - 1}`}>Vorige</Link>
          <span className="text-sm text-muted-foreground">Pagina {notificationPage.page} van {notificationPage.pageCount}</span>
          <Link aria-disabled={notificationPage.page >= notificationPage.pageCount} className={`rounded-full border px-4 py-2 text-sm ${notificationPage.page >= notificationPage.pageCount ? "pointer-events-none opacity-50" : "hover:bg-surface-muted"}`} href={`/vakman/notificaties?page=${notificationPage.page + 1}`}>Volgende</Link>
        </nav>
      ) : null}
    </div>
  );
}
