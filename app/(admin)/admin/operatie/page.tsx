import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { getOperationalDashboard } from "@/lib/notifications/queries";
import { formatDate } from "@/lib/utils";

const healthLabels = {
  healthy: "Gezond",
  attention: "Aandacht nodig",
  critical: "Kritiek",
} as const;

const metricLinks = {
  pendingReviews: "/admin/verificatie?filter=submitted&sort=oldest",
  expiringDocuments: "/admin/vakmannen",
  expiredRequiredDocuments: "/admin/vakmannen",
  exhaustedRuns: "/admin/distributie?status=exhausted",
  unmatchedLeads: "/admin/leads?status=new",
  noPurchaseLeads: "/admin/leads",
  staleAssignments: "/admin/leads",
  failedNotifications: "/admin/notificaties",
  failedWorkers: "/admin/operatie",
} as const;

const metricLabels = {
  pendingReviews: "Verificaties boven SLA",
  expiringDocuments: "Binnenkort verlopende documenten",
  expiredRequiredDocuments: "Verlopen vereiste documenten",
  exhaustedRuns: "Uitgeputte distributieruns",
  unmatchedLeads: "Leads zonder distributierun",
  noPurchaseLeads: "Leads zonder aankoop",
  staleAssignments: "Assignments zonder voortgang",
  failedNotifications: "Mislukte notificaties",
  failedWorkers: "Mislukte worker runs",
} as const;

function runDuration(startedAt: string, finishedAt: string | null) {
  if (!finishedAt) return "Bezig";
  const seconds = Math.max(0, Math.round((new Date(finishedAt).getTime() - new Date(startedAt).getTime()) / 1000));
  return seconds < 60 ? `${seconds} sec` : `${Math.floor(seconds / 60)} min`;
}

export default async function AdminOperationsPage() {
  const dashboard = await getOperationalDashboard();
  return (
    <div className="space-y-6">
      <PageHeader title="Operationeel dashboard" description="SLA’s, documentverval, distributie en workerstatus." />
      <Card className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Operationele gezondheid</p>
          <p className={`text-2xl font-semibold ${dashboard.health === "critical" ? "text-red-700" : dashboard.health === "attention" ? "text-amber-700" : "text-green-700"}`}>
            {healthLabels[dashboard.health]}
          </p>
        </div>
        <Link href="/admin/notificaties" className="text-sm font-medium text-primary hover:underline">Operationele notificaties bekijken</Link>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Object.entries(dashboard.counts).map(([key, count]) => (
          <Card key={key} className="space-y-2">
            <p className="text-sm text-muted-foreground">{metricLabels[key as keyof typeof metricLabels]}</p>
            <p className="text-4xl font-semibold tracking-tight">{count}</p>
            <Link href={metricLinks[key as keyof typeof metricLinks]} className="text-sm font-medium text-primary hover:underline">Bekijk queue</Link>
          </Card>
        ))}
      </div>
      <Card className="space-y-4">
        <PageHeader title="Worker runs" description="Recente achtergrondruns, verwerking en veilige foutstatus." />
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="py-3">Worker</th><th className="py-3">Gestart</th><th className="py-3">Duur</th>
                <th className="py-3">Status</th><th className="py-3">Verwerkt</th><th className="py-3">Mislukt</th><th className="py-3">Fout</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.latestRuns.map((run) => (
                <tr key={run.id} className="border-t align-top">
                  <td className="py-3">{run.worker_type}</td>
                  <td className="py-3">{formatDate(run.started_at)}</td>
                  <td className="py-3">{runDuration(run.started_at, run.finished_at)}</td>
                  <td className="py-3">{run.status}</td>
                  <td className="py-3">{run.processed_count}</td>
                  <td className="py-3">{run.failed_count}</td>
                  <td className="py-3 text-muted-foreground">{run.error_summary ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!dashboard.latestRuns.length ? <p className="p-4 text-sm text-muted-foreground">Nog geen worker runs geregistreerd.</p> : null}
        </div>
      </Card>
    </div>
  );
}
