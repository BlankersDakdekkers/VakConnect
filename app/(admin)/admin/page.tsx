import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { buttonClassName } from "@/components/ui/button";
import { formatDate, formatPostalCode } from "@/lib/utils";
import { getAdminDashboardStats, getAdminLeads } from "@/lib/leads/queries";

export default async function AdminDashboardPage() {
  const [stats, recentLeads] = await Promise.all([getAdminDashboardStats(), getAdminLeads(undefined, undefined)]);

  return (
    <div className="space-y-6">
      <PageHeader title="Overzicht" description="Actuele status van leads en actieve vakmannen op basis van echte database-data." />
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="space-y-2">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-4xl font-semibold tracking-tight">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.description}</p>
          </Card>
        ))}
      </div>
      <Card className="space-y-4">
        <PageHeader
          title="Recente leads"
          description="Direct inzicht in de nieuwste aanvragen"
          actions={
            <Link href="/admin/leads" className={buttonClassName({ variant: "secondary", size: "sm" })}>
              Alle leads bekijken
            </Link>
          }
        />
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="py-3">Referentie</th>
                <th className="py-3">Dienst</th>
                <th className="py-3">Locatie</th>
                <th className="py-3">Status</th>
                <th className="py-3">Datum</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.slice(0, 5).map((lead) => (
                <tr key={lead.id} className="border-t">
                  <td className="py-4">
                    <Link href={`/admin/leads/${lead.id}`} className="font-medium text-primary hover:underline">
                      {lead.public_reference}
                    </Link>
                  </td>
                  <td className="py-4">{lead.service?.name ?? "Onbekend"}</td>
                  <td className="py-4">{lead.city ?? formatPostalCode(lead.postal_code)}</td>
                  <td className="py-4"><StatusBadge value={lead.status} /></td>
                  <td className="py-4 text-muted-foreground">{formatDate(lead.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
