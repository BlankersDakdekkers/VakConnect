import Link from "next/link";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { SubmitButton } from "@/components/ui/submit-button";
import { pauseDistributionRunAction, processDistributionExpirationsAction, requeueLeadDistributionAction, startDistributionRunAction } from "@/lib/distribution/actions";
import { getAdminDistributionRuns, getDistributionPerformanceStats } from "@/lib/distribution/queries";
import { getAdminServices } from "@/lib/services/queries";
import { formatDate } from "@/lib/utils";

export default async function AdminDistributionPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : undefined;
  const leadType = typeof params.lead_type === "string" ? params.lead_type : undefined;
  const serviceId = typeof params.service_id === "string" ? params.service_id : undefined;
  const fromDate = typeof params.from_date === "string" ? params.from_date : undefined;
  const success = typeof params.success === "string" ? params.success : undefined;
  const error = typeof params.error === "string" ? params.error : undefined;

  const [runs, services, stats] = await Promise.all([
    getAdminDistributionRuns({ status, leadType, serviceId, fromDate }),
    getAdminServices(),
    getDistributionPerformanceStats(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Distributie" description="Automatische leadverdeling, fairness, offer windows en uitputtingsoverzicht." />
      {success ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-success">{success}</p> : null}
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-danger">{error}</p> : null}

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Performance (90 dagen)</h2>
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4 text-sm">
          <p>Offers gestuurd: <strong>{stats.offersSent}</strong></p>
          <p>View rate: <strong>{stats.viewRate}%</strong></p>
          <p>Decline rate: <strong>{stats.declineRate}%</strong></p>
          <p>Expiry rate: <strong>{stats.expiryRate}%</strong></p>
          <p>Purchase rate: <strong>{stats.purchaseRate}%</strong></p>
          <p>Gem. uren tot purchase: <strong>{stats.avgHoursToPurchase}</strong></p>
          <p>Exhausted leads: <strong>{stats.exhaustedLeads}</strong></p>
        </div>
      </Card>

      <Card className="space-y-4">
        <form className="grid gap-4 md:grid-cols-5">
          <Select name="status" defaultValue={status ?? ""}>
            <option value="">Alle statussen</option>
            <option value="pending">pending</option>
            <option value="active">active</option>
            <option value="completed">completed</option>
            <option value="cancelled">cancelled</option>
            <option value="exhausted">exhausted</option>
          </Select>
          <Select name="lead_type" defaultValue={leadType ?? ""}>
            <option value="">Alle types</option>
            <option value="shared">shared</option>
            <option value="exclusive">exclusive</option>
          </Select>
          <Select name="service_id" defaultValue={serviceId ?? ""}>
            <option value="">Alle diensten</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>{service.name}</option>
            ))}
          </Select>
          <Input type="date" name="from_date" defaultValue={fromDate ?? ""} />
          <button className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">Filter</button>
        </form>
        <form action={processDistributionExpirationsAction}>
          <SubmitButton variant="secondary" pendingLabel="Expiries verwerken...">Expiries verwerken</SubmitButton>
        </form>
      </Card>

      {runs.length ? (
        <Card className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="py-3">Lead</th>
                <th className="py-3">Dienst</th>
                <th className="py-3">Type</th>
                <th className="py-3">Status</th>
                <th className="py-3">Candidates</th>
                <th className="py-3">Gestart</th>
                <th className="py-3">Acties</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run) => (
                <tr key={run.id} className="border-t align-top">
                  <td className="py-4">
                    <Link href={`/admin/leads/${run.leadId}`} className="font-medium text-primary hover:underline">{run.leadReference}</Link>
                    <p className="text-xs text-muted-foreground">{run.strategyVersion}</p>
                  </td>
                  <td className="py-4">{run.serviceName ?? "Onbekend"}</td>
                  <td className="py-4"><StatusBadge value={run.commercialType} /></td>
                  <td className="py-4"><StatusBadge value={run.status} /></td>
                  <td className="py-4 text-muted-foreground">{run.candidateCount} (live {run.offeredCount}, gekocht {run.purchasedCount})</td>
                  <td className="py-4 text-muted-foreground">{formatDate(run.startedAt)}</td>
                  <td className="py-4 space-y-2">
                    <form action={pauseDistributionRunAction}>
                      <input type="hidden" name="run_id" value={run.id} />
                      <input type="hidden" name="redirect_to" value="/admin/distributie" />
                      <SubmitButton variant="ghost" pendingLabel="Pauzeren...">Pause</SubmitButton>
                    </form>
                    <form action={requeueLeadDistributionAction}>
                      <input type="hidden" name="lead_id" value={run.leadId} />
                      <input type="hidden" name="redirect_to" value="/admin/distributie" />
                      <SubmitButton variant="secondary" pendingLabel="Requeue...">Requeue</SubmitButton>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <EmptyState title="Geen distributieruns" description="Start distributie vanaf een leaddetail of wacht op nieuwe intake." />
      )}

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Handmatig run starten</h2>
        <form action={startDistributionRunAction} className="grid gap-3 md:grid-cols-[1fr_auto]">
          <Input name="lead_id" placeholder="Lead UUID" required />
          <input type="hidden" name="redirect_to" value="/admin/distributie" />
          <SubmitButton pendingLabel="Run starten...">Start run</SubmitButton>
        </form>
      </Card>
    </div>
  );
}
