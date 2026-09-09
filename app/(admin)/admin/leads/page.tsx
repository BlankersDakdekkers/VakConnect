import Link from "next/link";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { leadStatusValues } from "@/lib/validation";
import { formatDate, formatPostalCode } from "@/lib/utils";
import { getAdminLeads } from "@/lib/leads/queries";

export default async function AdminLeadsPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const status = typeof params.status === "string" ? params.status : undefined;
  const success = typeof params.success === "string" ? params.success : undefined;
  const error = typeof params.error === "string" ? params.error : undefined;
  const leads = await getAdminLeads(q, status);

  return (
    <div className="space-y-6">
      <PageHeader title="Leads" description="Zoek, filter en open leads voor statusbeheer en handmatige matching." />
      {success ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-success">{success}</p> : null}
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-danger">{error}</p> : null}
      <Card className="space-y-4">
        <form className="grid gap-4 md:grid-cols-[1fr_14rem_auto]">
          <Input name="q" defaultValue={q} placeholder="Zoek op referentie, naam, e-mail of postcode" />
          <Select name="status" defaultValue={status ?? ""}>
            <option value="">Alle statussen</option>
            {leadStatusValues.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>
          <button className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">Filter</button>
        </form>
      </Card>
      {leads.length ? (
        <Card className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="py-3">Referentie</th>
                <th className="py-3">Klant</th>
                <th className="py-3">Dienst</th>
                <th className="py-3">Locatie</th>
                <th className="py-3">Urgentie</th>
                <th className="py-3">Status</th>
                <th className="py-3">Datum</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-t">
                  <td className="py-4">
                    <Link href={`/admin/leads/${lead.id}`} className="font-medium text-primary hover:underline">
                      {lead.public_reference}
                    </Link>
                  </td>
                  <td className="py-4">{lead.first_name} {lead.last_name}</td>
                  <td className="py-4">{lead.service?.name ?? "Onbekend"}</td>
                  <td className="py-4">{lead.city ?? formatPostalCode(lead.postal_code)}</td>
                  <td className="py-4"><StatusBadge value={lead.urgency} /></td>
                  <td className="py-4"><StatusBadge value={lead.status} /></td>
                  <td className="py-4 text-muted-foreground">{formatDate(lead.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <EmptyState title="Geen leads gevonden" description="Pas je filters aan of wacht op nieuwe aanvragen." />
      )}
    </div>
  );
}
