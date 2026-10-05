import Link from "next/link";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { markAllNotificationsReadAction, markNotificationReadAction } from "@/lib/notifications/actions";
import { getProfessionalNotifications, getProfessionalUnreadNotificationCount } from "@/lib/notifications/queries";
import { getProfessionalNotificationPriority, highPriorityNotificationTypes } from "@/lib/professionals/activation";
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

function categoryLabel(eventType: ProfessionalNotificationEventType) {
  if (eventType.startsWith("lead_") || ["stale_lead", "unmatched_lead", "no_purchase_lead"].includes(eventType)) return "Aanvragen";
  if (eventType.startsWith("document")) return "Documenten";
  if (eventType.startsWith("verification") || eventType === "onboarding_submitted" || eventType === "changes_requested") return "Profiel en verificatie";
  return "Accountmelding";
}

function fallbackHref(notification: Awaited<ReturnType<typeof getProfessionalNotifications>>["items"][number]) {
  if (notification.lead_id && notification.event_type.startsWith("lead_")) return `/vakman/aanvragen/${notification.lead_id}`;
  if (notification.event_type.startsWith("lead_") || ["stale_lead", "unmatched_lead", "no_purchase_lead"].includes(notification.event_type)) return "/vakman/aanvragen";
  if (notification.event_type.startsWith("document")) return "/vakman/onboarding?step=documents";
  if (notification.event_type === "changes_requested" || notification.event_type.startsWith("verification")) return "/vakman/onboarding?step=review";
  if (notification.event_type === "onboarding_submitted") return "/vakman/profiel";
  return "/vakman";
}

function actionLabel(eventType: ProfessionalNotificationEventType) {
  if (eventType === "lead_progress_reminder") return "Werk voortgang bij";
  if (eventType.startsWith("lead_") || ["stale_lead", "unmatched_lead", "no_purchase_lead"].includes(eventType)) return "Bekijk aanvraag";
  if (eventType.startsWith("document")) return "Documenten beheren";
  if (eventType === "changes_requested" || eventType.startsWith("verification") || eventType === "onboarding_submitted") return "Bekijk profielstatus";
  return "Bekijk overzicht";
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
  const notifications = [...notificationPage.items].sort((left, right) => {
    const priorityDifference = Number(highPriorityNotificationTypes.has(right.event_type)) - Number(highPriorityNotificationTypes.has(left.event_type));
    if (priorityDifference !== 0) return priorityDifference;
    const unreadDifference = Number(!right.read_at) - Number(!left.read_at);
    return unreadDifference || right.created_at.localeCompare(left.created_at);
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notificaties"
        description="In-app updates over aanvragen, documenten, profielbeoordeling en accountacties."
        actions={unreadCount ? (
          <form action={markAllNotificationsReadAction}>
            <button className="rounded-full border px-4 py-2 text-sm font-medium hover:bg-surface-muted">Alles als gelezen markeren</button>
          </form>
        ) : undefined}
      />
      {!notifications.length ? (
        <EmptyState title="Je hebt nog geen notificaties." description="Nieuwe aanvragen, documentupdates en profielbeoordelingen verschijnen hier." />
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const title = payloadText(notification.payload, "title", eventLabels[notification.event_type]);
            const description = payloadText(notification.payload, "description", "Er is een update voor je account.");
            const href = safeInternalHref(notification.payload.href) ?? fallbackHref(notification);
            return (
            <Card key={notification.id} className={`flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between ${!notification.read_at ? "border-primary/30" : ""}`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                  <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs text-muted-foreground">{categoryLabel(notification.event_type)}</span>
                  <h2 className="font-semibold">{title}</h2>
                  <span className="rounded-full border px-2 py-0.5 text-xs">{getProfessionalNotificationPriority(notification.event_type)} prioriteit</span>
                  {!notification.read_at ? <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Ongelezen</span> : null}
                  </div>
                  <p className="text-sm text-muted-foreground">{description}</p>
                  <time className="block text-xs text-muted-foreground" dateTime={notification.created_at}>{formatDate(notification.created_at)}</time>
                  <Link href={href ?? "/vakman"} className="inline-block min-h-11 py-2 text-sm font-medium text-primary underline underline-offset-4">{actionLabel(notification.event_type)}</Link>
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
          <Link aria-disabled={notificationPage.page <= 1} tabIndex={notificationPage.page <= 1 ? -1 : undefined} className={`rounded-full border px-4 py-2 text-sm ${notificationPage.page <= 1 ? "pointer-events-none opacity-50" : "hover:bg-surface-muted"}`} href={`/vakman/notificaties?page=${notificationPage.page - 1}`}>Vorige</Link>
          <span className="text-sm text-muted-foreground">Pagina {notificationPage.page} van {notificationPage.pageCount}</span>
          <Link aria-disabled={notificationPage.page >= notificationPage.pageCount} tabIndex={notificationPage.page >= notificationPage.pageCount ? -1 : undefined} className={`rounded-full border px-4 py-2 text-sm ${notificationPage.page >= notificationPage.pageCount ? "pointer-events-none opacity-50" : "hover:bg-surface-muted"}`} href={`/vakman/notificaties?page=${notificationPage.page + 1}`}>Volgende</Link>
        </nav>
      ) : null}
      <Link href="/vakman/instellingen/notificaties" className="inline-block text-sm font-medium text-primary underline underline-offset-4">Notificatievoorkeuren beheren</Link>
    </div>
  );
}
