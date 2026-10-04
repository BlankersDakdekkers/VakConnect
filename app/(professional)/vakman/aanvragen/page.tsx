import Link from "next/link";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCredits, getCommercialTypeLabel } from "@/lib/commercial/labels";
import { requireProfessionalUser } from "@/lib/auth/helpers";
import { getProfessionalLeadMarketplace } from "@/lib/commercial/queries";
import { formatDate } from "@/lib/utils";

const offerStateLabels: Record<string, string> = {
  nieuw_aanbod: "Nieuw aanbod",
  bekeken: "Bekeken",
  verloopt_bijna: "Verloopt binnenkort",
  gesloten: "Gesloten of verlopen",
  gekocht: "Gekocht",
};

const leadStateLabels: Record<string, string> = {
  available: "Beschikbaar",
  partially_sold: "Nog beschikbaar",
  sold_out: "Niet meer beschikbaar",
  purchased: "Gekocht",
  assigned: "Toegewezen",
  closed: "Gesloten",
};

function offerGroup(lead: Awaited<ReturnType<typeof getProfessionalLeadMarketplace>>[number]) {
  if (lead.offerState === "gekocht" || lead.purchaseStatus === "purchased" || lead.assignmentStatus === "accepted") return "Gekocht of toegewezen";
  if (lead.offerState === "gesloten") return "Gesloten of verlopen";
  if (lead.offerState === "verloopt_bijna") return "Verloopt binnenkort";
  return "Nieuw aanbod";
}

function expiryTime(value: string) {
  return new Intl.DateTimeFormat("nl-NL", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export default async function ProfessionalAssignmentsPage() {
  const user = await requireProfessionalUser();
  const leads = await getProfessionalLeadMarketplace(user.professional.id);
  const groups = ["Nieuw aanbod", "Verloopt binnenkort", "Gekocht of toegewezen", "Gesloten of verlopen"]
    .map((title) => ({ title, items: leads.filter((lead) => offerGroup(lead) === title) }))
    .filter((group) => group.items.length);

  return (
    <div className="space-y-6">
      <PageHeader title="Aanvragen" description="Bekijk nieuwe aanbiedingen, je lopende aanvragen en gesloten aanbod." />
      {leads.length ? groups.map((group) => (
        <section key={group.title} aria-labelledby={`offers-${group.title.replaceAll(" ", "-")}`} className="space-y-3">
          <h2 id={`offers-${group.title.replaceAll(" ", "-")}`} className="text-lg font-semibold tracking-tight">{group.title}</h2>
          <ul className="grid min-w-0 gap-3 xl:grid-cols-2">
            {group.items.map((lead) => (
              <li key={lead.leadId} className="min-w-0">
                <Card className="h-full space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-muted-foreground">{lead.publicReference}</p>
                      <h3 className="mt-1 font-semibold">{lead.serviceName}</h3>
                    </div>
                    <StatusBadge value={lead.offerStatus ?? lead.state} label={offerStateLabels[lead.offerState] ?? leadStateLabels[lead.state] ?? "Status bijgewerkt"} />
                  </div>
                  <p className="text-sm text-muted-foreground">{lead.city ?? `Postcodegebied ${lead.postalCodePrefix}`}</p>
                  <p className="line-clamp-3 text-sm leading-6">{lead.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge value={lead.commercialType} label={getCommercialTypeLabel(lead.commercialType)} />
                    {lead.purchaseStatus ? <StatusBadge value={lead.purchaseStatus} label={lead.purchaseStatus === "purchased" ? "Gekocht" : lead.purchaseStatus.replaceAll("_", " ")} /> : null}
                    {lead.assignmentStatus ? <StatusBadge value={lead.assignmentStatus} label={lead.assignmentStatus.replaceAll("_", " ")} /> : null}
                  </div>
                  <dl className="grid grid-cols-2 gap-3 border-t pt-3 text-sm">
                    <div><dt className="text-muted-foreground">Prijs</dt><dd className="font-semibold">{formatCredits(lead.priceCredits)}</dd></div>
                    <div><dt className="text-muted-foreground">Resterende plekken</dt><dd>{lead.commercialType === "exclusive" ? (lead.state === "available" ? "1" : "0") : `${lead.remainingSlots}/${lead.maxBuyers}`}</dd></div>
                    <div><dt className="text-muted-foreground">Status</dt><dd>{leadStateLabels[lead.state] ?? "Status bijgewerkt"}</dd></div>
                    <div><dt className="text-muted-foreground">Aangemaakt</dt><dd>{formatDate(lead.createdAt)}</dd></div>
                  </dl>
                  {lead.offerExpiresAt && ["nieuw_aanbod", "bekeken", "verloopt_bijna"].includes(lead.offerState) ? (
                    <p className={`text-sm font-medium ${lead.offerState === "verloopt_bijna" ? "text-amber-800" : "text-muted-foreground"}`}>
                      Beschikbaar tot {expiryTime(lead.offerExpiresAt)} · {formatDate(lead.offerExpiresAt)}
                    </p>
                  ) : null}
                  <Link href={`/vakman/aanvragen/${lead.leadId}`} className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                    Bekijk aanvraag
                  </Link>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      )) : (
        <EmptyState title="Er zijn nu geen passende aanvragen beschikbaar." description="Nieuwe aanbiedingen verschijnen hier wanneer ze passen bij je diensten, werkgebied en beschikbaarheid." />
      )}
      <p className="text-sm text-muted-foreground">Niet elke aanvraag leidt tot een opdracht. Contactgegevens blijven verborgen totdat de bestaande aankoop- of toewijzingsvoorwaarden zijn vervuld.</p>
    </div>
  );
}
