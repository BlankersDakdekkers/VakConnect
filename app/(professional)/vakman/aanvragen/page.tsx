import Link from "next/link";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCredits, getCommercialTypeLabel } from "@/lib/commercial/labels";
import { getCommercialExplanation } from "@/lib/commercial/presentation";
import { requireProfessionalUser } from "@/lib/auth/helpers";
import { getProfessionalLeadMarketplace } from "@/lib/commercial/queries";
import { getProfessionalBlockerRecovery } from "@/lib/professionals/activation";
import { getOwnProfessionalDetail } from "@/lib/professionals/queries";
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
  pending: "In behandeling",
  viewed: "Bekeken",
  accepted: "Geaccepteerd",
  rejected: "Geweigerd",
  declined: "Geweigerd",
  expired: "Verlopen",
  refunded: "Terugbetaald",
};

function offerGroup(lead: Awaited<ReturnType<typeof getProfessionalLeadMarketplace>>[number]) {
  if (lead.offerState === "gekocht" || lead.purchaseStatus === "purchased" || lead.assignmentStatus === "accepted") return "Gekocht of toegewezen";
  if (lead.offerStatus === "declined") return "Afgewezen";
  if (lead.offerStatus === "expired") return "Verlopen";
  if (lead.offerTermExpired) return "Gesloten of verlopen";
  if (lead.offerState === "gesloten") return "Gesloten of verlopen";
  if (lead.offerState === "verloopt_bijna") return "Verloopt binnenkort";
  return "Nieuw aanbod";
}

function expiryTime(value: string) {
  return new Intl.DateTimeFormat("nl-NL", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export default async function ProfessionalAssignmentsPage() {
  const user = await requireProfessionalUser();
  const [leads, professional] = await Promise.all([
    getProfessionalLeadMarketplace(user.professional.id),
    getOwnProfessionalDetail(user.professional.id),
  ]);
  const firstBlocker = professional?.distributionReadiness.reasons[0];
  const blockerRecovery = firstBlocker ? getProfessionalBlockerRecovery(firstBlocker) : null;
  const groups = ["Nieuw aanbod", "Verloopt binnenkort", "Gekocht of toegewezen", "Afgewezen", "Verlopen", "Gesloten of verlopen"]
    .map((title) => ({ title, items: leads.filter((lead) => offerGroup(lead) === title) }))
    .filter((group) => group.items.length);

  return (
    <div className="space-y-6">
      <PageHeader title="Aanvragen" description="Bekijk nieuwe aanbiedingen, je lopende aanvragen en gesloten aanbod." />
      {leads.length ? groups.map((group) => (
        <section key={group.title} aria-labelledby={`offers-${group.title.replaceAll(" ", "-")}`} className="space-y-3">
          <h2 id={`offers-${group.title.replaceAll(" ", "-")}`} className="text-lg font-semibold tracking-tight">{group.title}</h2>
          <ul className="grid min-w-0 gap-3 xl:grid-cols-2">
            {group.items.map((lead) => {
              const hasExpired = lead.offerTermExpired && lead.purchaseStatus !== "purchased" && lead.assignmentStatus !== "accepted";
              return (
                <li key={lead.leadId} className="min-w-0">
                  <Card className="h-full space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-muted-foreground">{lead.publicReference}</p>
                        <h3 className="mt-1 font-semibold">{lead.serviceName}</h3>
                      </div>
                      <StatusBadge value={lead.offerStatus ?? lead.state} label={hasExpired ? "Aanbodtermijn verstreken" : lead.state === "closed" ? "Niet meer beschikbaar" : offerStateLabels[lead.offerState] ?? leadStateLabels[lead.state] ?? "Status bijgewerkt"} />
                    </div>
                    <p className="text-sm text-muted-foreground">{lead.postalCodePrefix ? `Postcodegebied ${lead.postalCodePrefix}` : "Regio niet beschikbaar"}</p>
                    <ul className="space-y-1 text-sm">
                      <li>{lead.planning}</li>
                      <li>{lead.imageCount ? `${lead.imageCount} foto('s) toegevoegd · zichtbaar na ontgrendeling` : "Geen foto's toegevoegd"}</li>
                      <li>{lead.hasDescription ? "Klusomschrijving ingevuld · zichtbaar na ontgrendeling" : "Klusomschrijving ontbreekt"}</li>
                    </ul>
                    {lead.matchExplanation.length ? <p className="text-sm text-muted-foreground">{lead.matchExplanation.slice(0, 2).join(" ")} Dit is de opgeslagen match, niet een garantie op geschiktheid.</p> : null}
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge value={lead.commercialType} label={getCommercialTypeLabel(lead.commercialType)} />
                      {lead.offerStatus ? <StatusBadge value={lead.offerStatus} label={leadStateLabels[lead.offerStatus] ?? offerStateLabels[lead.offerState]} /> : null}
                      {lead.purchaseStatus ? <StatusBadge value={lead.purchaseStatus} label={leadStateLabels[lead.purchaseStatus] ?? "Status bijgewerkt"} /> : null}
                      {lead.assignmentStatus ? <StatusBadge value={lead.assignmentStatus} label={leadStateLabels[lead.assignmentStatus] ?? "Status bijgewerkt"} /> : null}
                    </div>
                    <dl className="grid grid-cols-2 gap-3 border-t pt-3 text-sm">
                      <div><dt className="text-muted-foreground">Actuele creditprijs</dt><dd className="text-lg font-semibold">{formatCredits(lead.priceCredits)}</dd></div>
                      <div><dt className="text-muted-foreground">Status</dt><dd>{leadStateLabels[lead.state] ?? "Status bijgewerkt"}</dd></div>
                      <div><dt className="text-muted-foreground">Aangemaakt</dt><dd>{formatDate(lead.createdAt)}</dd></div>
                    </dl>
                    <p className="text-sm text-muted-foreground">{getCommercialExplanation(lead.commercialType)}</p>
                    {lead.offerExpiresAt && !hasExpired && ["nieuw_aanbod", "bekeken", "verloopt_bijna"].includes(lead.offerState) ? (
                      <p className={`text-sm font-medium ${lead.offerState === "verloopt_bijna" ? "text-amber-800" : "text-muted-foreground"}`}>
                        Beschikbaar tot {expiryTime(lead.offerExpiresAt)} · {formatDate(lead.offerExpiresAt)}
                      </p>
                    ) : null}
                    <Link href={`/vakman/aanvragen/${lead.leadId}`} className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                      Bekijk aanvraag
                    </Link>
                  </Card>
                </li>
              );
            })}
          </ul>
        </section>
      )) : (
        firstBlocker ? (
          <EmptyState
            title="Je ontvangt nog geen passende aanvragen"
            description={`${firstBlocker} Los deze stap op om te voldoen aan de huidige voorwaarden voor distributie.`}
            action={blockerRecovery ? (
              <Link href={blockerRecovery.href} className="inline-flex min-h-11 items-center justify-center rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                {blockerRecovery.label}
              </Link>
            ) : undefined}
          />
        ) : (
          <EmptyState
            title="Er zijn nu geen passende aanvragen beschikbaar."
            description="Je profiel is actief. Aanbod hangt af van dienst, regio, beschikbaarheid, capaciteit en bestaande distributieregels. Er wordt geen volume gegarandeerd."
          />
        )
      )}
      <p className="text-sm text-muted-foreground">Niet elke aanvraag leidt tot een opdracht. Contactgegevens blijven verborgen totdat de bestaande aankoop- of toewijzingsvoorwaarden zijn vervuld.</p>
    </div>
  );
}
