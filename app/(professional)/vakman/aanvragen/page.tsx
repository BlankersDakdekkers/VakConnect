import Link from "next/link";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCredits, getCommercialTypeLabel } from "@/lib/commercial/labels";
import { requireProfessionalUser } from "@/lib/auth/helpers";
import { getProfessionalLeadMarketplace } from "@/lib/commercial/queries";
import { formatDate } from "@/lib/utils";

export default async function ProfessionalAssignmentsPage() {
  const user = await requireProfessionalUser();
  const leads = await getProfessionalLeadMarketplace(user.professional.id);

  return (
    <div className="space-y-6">
      <PageHeader title="Aanvragen" description="Beschikbaar, gekocht en gesloten leadaanbod met server-side prijsbepaling en veilige contactunlock." />
      {leads.length ? (
        <Card className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="py-3">Referentie</th>
                <th className="py-3">Dienst</th>
                <th className="py-3">Regio</th>
                <th className="py-3">Score</th>
                <th className="py-3">Prijs</th>
                <th className="py-3">Type</th>
                <th className="py-3">Status</th>
                <th className="py-3">Offer</th>
                <th className="py-3">Resterende plekken</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.leadId} className="border-t align-top">
                  <td className="py-4">
                    <Link href={`/vakman/aanvragen/${lead.leadId}`} className="font-medium text-primary hover:underline">
                      {lead.publicReference}
                    </Link>
                    <p className="mt-1 max-w-md text-xs text-muted-foreground">{lead.summary}</p>
                  </td>
                  <td className="py-4">{lead.serviceName}</td>
                  <td className="py-4">{lead.city ?? `Postcodegebied ${lead.postalCodePrefix}`}</td>
                  <td className="py-4">{lead.leadScore ?? "—"}</td>
                  <td className="py-4 font-medium">{formatCredits(lead.priceCredits)}</td>
                  <td className="py-4"><StatusBadge value={lead.commercialType} /><span className="sr-only">{getCommercialTypeLabel(lead.commercialType)}</span></td>
                  <td className="py-4">
                    <div className="space-y-2">
                      <StatusBadge value={lead.state} />
                      {lead.purchaseStatus ? <StatusBadge value={lead.purchaseStatus} /> : null}
                      {lead.assignmentStatus ? <StatusBadge value={lead.assignmentStatus} /> : null}
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="space-y-1">
                      {lead.offerStatus ? <StatusBadge value={lead.offerStatus} /> : <span className="text-muted-foreground">gesloten</span>}
                      <p className="text-xs text-muted-foreground">{lead.offerState.replaceAll("_", " ")}</p>
                      {lead.offerExpiresAt ? <p className="text-xs text-muted-foreground">tot {formatDate(lead.offerExpiresAt)}</p> : null}
                    </div>
                  </td>
                  <td className="py-4 text-muted-foreground">
                    {lead.commercialType === "exclusive" ? (lead.state === "available" ? "1 vrij" : "0 vrij") : `${lead.remainingSlots}/${lead.maxBuyers}`}
                    <div className="mt-1 text-xs">{lead.purchasedAt ? `gekocht op ${formatDate(lead.purchasedAt)}` : formatDate(lead.createdAt)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <EmptyState title="Nog geen leads in je markt" description="Nieuwe matches, gekochte leads en gesloten aanvragen verschijnen hier zodra je account in aanmerking komt." />
      )}
    </div>
  );
}
