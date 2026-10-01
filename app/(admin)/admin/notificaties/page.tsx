import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { getAdminNotifications } from "@/lib/notifications/queries";
import { markAdminNotificationReadAction } from "@/lib/notifications/actions";
import { formatDate } from "@/lib/utils";

function message(payload: Record<string, unknown>, key: string, fallback: string) {
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

export default async function AdminNotificationsPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const params = await searchParams;
  const requestedPage = typeof params.page === "string" ? Number(params.page) : 1;
  const notificationPage = await getAdminNotifications(requestedPage);
  const notifications = notificationPage.items;
  return (
    <div className="space-y-6">
      <PageHeader title="Operationele notificaties" description="Systemmeldingen en alerts voor het beheerteam." />
      {!notifications.length ? (
        <Card><p className="text-sm text-muted-foreground">Er zijn geen operationele meldingen.</p></Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const href = safeInternalHref(notification.payload.href);
            return (
              <Card key={notification.id} className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold">{message(notification.payload, "title", notification.event_type)}</h2>
                    {!notification.read_at ? <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">Nieuw</span> : null}
                  </div>
                  <p className="text-sm text-muted-foreground">{message(notification.payload, "description", "Er is een operationele melding.")}</p>
                  <time className="block text-xs text-muted-foreground" dateTime={notification.created_at}>{formatDate(notification.created_at)}</time>
                  {href ? <Link href={href} className="inline-block text-sm font-medium text-primary hover:underline">Open record</Link> : null}
                </div>
                {!notification.read_at ? (
                  <form action={markAdminNotificationReadAction}>
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
        <nav aria-label="Paginering operationele notificaties" className="flex items-center justify-between">
          <Link aria-disabled={notificationPage.page <= 1} className={`rounded-full border px-4 py-2 text-sm ${notificationPage.page <= 1 ? "pointer-events-none opacity-50" : "hover:bg-surface-muted"}`} href={`/admin/notificaties?page=${notificationPage.page - 1}`}>Vorige</Link>
          <span className="text-sm text-muted-foreground">Pagina {notificationPage.page} van {notificationPage.pageCount}</span>
          <Link aria-disabled={notificationPage.page >= notificationPage.pageCount} className={`rounded-full border px-4 py-2 text-sm ${notificationPage.page >= notificationPage.pageCount ? "pointer-events-none opacity-50" : "hover:bg-surface-muted"}`} href={`/admin/notificaties?page=${notificationPage.page + 1}`}>Volgende</Link>
        </nav>
      ) : null}
    </div>
  );
}
