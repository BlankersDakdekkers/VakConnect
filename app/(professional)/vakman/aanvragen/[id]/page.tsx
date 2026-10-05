import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { SubmitButton } from "@/components/ui/submit-button";
import { formatCredits, getCommercialTypeLabel } from "@/lib/commercial/labels";
import { purchaseLeadAction } from "@/lib/commercial/actions";
import { declineDistributionOfferAction, viewDistributionOfferAction } from "@/lib/distribution/actions";
import { getProfessionalLeadMarketDetail } from "@/lib/commercial/queries";
import { requireProfessionalUser } from "@/lib/auth/helpers";
import { respondToAssignmentAction, updateLeadProgressAction } from "@/lib/leads/actions";
import { formatDate, formatFileSize, formatPostalCode } from "@/lib/utils";
import { declineReasonValues, leadLossReasonValues, leadProgressStatusValues } from "@/lib/validation";

const declineReasonLabels: Record<(typeof declineReasonValues)[number], string> = {
  te_ver: "Te ver",
  geen_capaciteit: "Geen capaciteit",
  klus_past_niet: "Klus past niet",
  prijs_te_hoog: "Prijs te hoog",
  timing_past_niet: "Timing past niet",
  anders: "Anders",
};

const statusLabels: Record<string, string> = {
  available: "Beschikbaar",
  unavailable: "Niet beschikbaar",
  partially_sold: "Gedeeltelijk verkocht",
  sold_out: "Uitverkocht",
  purchased: "Gekocht",
  closed: "Gesloten",
  offered: "Nieuw aanbod",
  viewed: "Bekeken",
  declined: "Geweigerd",
  expired: "Verlopen",
  accepted: "Geaccepteerd",
  pending: "In behandeling",
  assigned: "Toegewezen",
  urgent: "Urgent",
  normal: "Normaal",
  new: "Nieuw",
  contacted: "Contact opgenomen",
  appointment_scheduled: "Afspraak gepland",
  quote_sent: "Offerte verstuurd",
  won: "Opdracht gewonnen",
  lost: "Opdracht niet gewonnen",
};

const progressLabels: Record<(typeof leadProgressStatusValues)[number], string> = {
  new: "Nieuw",
  contacted: "Contact opgenomen",
  appointment_scheduled: "Afspraak gepland",
  quote_sent: "Offerte verstuurd",
  won: "Opdracht gewonnen",
  lost: "Opdracht niet gewonnen",
};

const lossReasonLabels: Record<(typeof leadLossReasonValues)[number], string> = {
  prijs: "Prijs",
  klant_niet_bereikbaar: "Klant niet bereikbaar",
  klant_koos_andere_partij: "Klant koos een andere partij",
  klus_uitgesteld: "Klus uitgesteld",
  buiten_scope: "Buiten scope",
  anders: "Anders",
};

function expiryTime(value: string) {
  return new Intl.DateTimeFormat("nl-NL", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default async function ProfessionalLeadDetailPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const user = await requireProfessionalUser();
  const { id } = await params;
  const query = await searchParams;
  const success = typeof query.success === "string" ? query.success : undefined;
  const error = typeof query.error === "string" ? query.error : undefined;
  const marketLead = await getProfessionalLeadMarketDetail(id, user.professional.id, user.id);

  if (!marketLead) {
    notFound();
  }
  const canPurchaseFromOffer = !marketLead.distributionOffer.id
    || (marketLead.mode === "preview" && ["offered", "viewed"].includes(marketLead.distributionOffer.status ?? ""));

  const confirmationToken = crypto.randomUUID();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={marketLead.preview.publicReference}
        title="Aanvraagdetail"
        description={marketLead.mode === "unlocked" ? "Contactgegevens zijn veilig vrijgegeven na geldige toegang." : "Je ziet nu alleen pre-purchase leadinformatie zonder gevoelige contactdata."}
      />
      {success ? <p role="status" className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-success">{success}</p> : null}
      {error ? <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-danger">{error}</p> : null}
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <StatusBadge value={marketLead.state} label={statusLabels[marketLead.state] ?? "Status bijgewerkt"} />
              <StatusBadge value={marketLead.commercial.commercialType} label={getCommercialTypeLabel(marketLead.commercial.commercialType)} />
              <StatusBadge value={marketLead.commercial.salesStatus} label={statusLabels[marketLead.commercial.salesStatus] ?? "Status bijgewerkt"} />
              <StatusBadge value={marketLead.preview.urgency} label={statusLabels[marketLead.preview.urgency] ?? "Urgentie bijgewerkt"} />
              {marketLead.assignment.status ? <StatusBadge value={marketLead.assignment.status} label={statusLabels[marketLead.assignment.status] ?? "Toewijzing bijgewerkt"} /> : null}
              {marketLead.distributionOffer.status ? <StatusBadge value={marketLead.distributionOffer.status} label={statusLabels[marketLead.distributionOffer.status] ?? "Aanbod bijgewerkt"} /> : null}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Dienst</p>
                <p className="mt-1 font-medium">{marketLead.preview.serviceName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Regio</p>
                <p className="mt-1 font-medium">{marketLead.preview.city ?? `Postcodegebied ${marketLead.preview.postalCodePrefix}`}</p>
                <p className="text-sm text-muted-foreground">Ingediend op {formatDate(marketLead.preview.createdAt)}</p>
                {marketLead.distributionOffer.offerExpiresAt ? <p className="text-sm text-muted-foreground">{marketLead.distributionOffer.offerTermExpired ? "De eindtijd van dit aanbod is verstreken." : `Beschikbaar tot ${expiryTime(marketLead.distributionOffer.offerExpiresAt)}`}</p> : null}
              </div>
            </div>
            <p className="text-sm leading-7 text-muted-foreground">{marketLead.preview.summary}</p>
            {marketLead.mode === "unlocked" && marketLead.detail ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Klant: {marketLead.detail.lead.first_name} {marketLead.detail.lead.last_name} · {marketLead.detail.lead.phone} · {marketLead.detail.lead.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  Adres: {formatPostalCode(marketLead.detail.lead.postal_code)} {marketLead.detail.lead.house_number}
                  {marketLead.detail.lead.house_number_addition ? ` ${marketLead.detail.lead.house_number_addition}` : ""}
                </p>
              </>
            ) : (
              <p className="rounded-2xl bg-surface-muted px-4 py-3 text-sm text-muted-foreground">
                Contactgegevens blijven verborgen tot een geldige aankoop of geaccepteerde directe toewijzing.
              </p>
            )}
          </Card>

          {marketLead.mode === "unlocked" && marketLead.detail ? (
            <>
              <Card className="space-y-4">
                <h2 className="text-lg font-semibold tracking-tight">Intake-antwoorden</h2>
                {marketLead.detail.lead.answers.length ? (
                  <div className="space-y-3">
                    {marketLead.detail.lead.answers.map((answer) => (
                      <div key={answer.id} className="rounded-3xl bg-surface-muted p-4">
                        <p className="font-medium">{answer.question.question}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{answer.displayValue}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState title="Geen extra intake-antwoorden" description="Voor deze lead zijn geen dynamische intake-antwoorden opgeslagen." />
                )}
              </Card>

              <Card className="space-y-4">
                <h2 className="text-lg font-semibold tracking-tight">Foto’s</h2>
                {marketLead.detail.lead.images.length ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {marketLead.detail.lead.images.map((image) => (
                      <a key={image.path} href={image.url ?? "#"} target="_blank" rel="noreferrer" className="overflow-hidden rounded-3xl border bg-surface-muted">
                        {image.url ? (
                          <Image src={image.url} alt="Lead upload" width={960} height={720} unoptimized className="h-56 w-full object-cover" />
                        ) : (
                          <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">Geen preview beschikbaar</div>
                        )}
                        <div className="px-4 py-3 text-sm text-muted-foreground">
                          {image.mimeType ?? "bestand"} · {image.fileSize ? formatFileSize(image.fileSize) : "onbekend"}
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <EmptyState title="Geen foto's toegevoegd" description="Voor deze lead zijn geen foto's geüpload." />
                )}
              </Card>

              <Card className="space-y-4">
                <h2 className="text-lg font-semibold tracking-tight">Activiteiten</h2>
                {marketLead.detail.lead.activity.length ? (
                  <div className="space-y-3">
                    {marketLead.detail.lead.activity.map((event) => (
                      <div key={event.id} className="rounded-3xl bg-surface-muted p-4 text-sm">
                        <p className="font-medium">{event.activityType}</p>
                        <p className="text-muted-foreground">{formatDate(event.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                ) : <EmptyState title="Nog geen activiteiten" description="Voortgang verschijnt hier zodra updates worden gedaan." />}
              </Card>
            </>
          ) : null}
        </div>
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Commerciële status</h2>
          <div className="grid gap-3 text-sm">
            <p>Type: <strong>{getCommercialTypeLabel(marketLead.commercial.commercialType)}</strong></p>
            <p>Prijs: <strong>{formatCredits(marketLead.commercial.priceCredits)}</strong></p>
            <p>Saldo: <strong>{formatCredits(marketLead.commercial.currentBalance)}</strong></p>
            <p>Saldo na aankoop: <strong>{formatCredits(Math.max(0, marketLead.commercial.balanceAfterPurchase))}</strong></p>
            <p>Resterende plekken: <strong>{marketLead.commercial.commercialType === "exclusive" ? marketLead.state === "available" ? "1" : "0" : marketLead.commercial.remainingSlots}</strong></p>
          </div>
          <p className="text-sm text-muted-foreground">
            {marketLead.commercial.commercialType === "exclusive"
              ? "Exclusief: volgens de huidige regels is er maximaal één koperslot. Dat garandeert geen opdracht."
              : "Shared: meerdere vakmannen kunnen volgens de resterende plekken toegang krijgen."}
          </p>
          <p className="text-sm text-muted-foreground">Credits gebruik je om geselecteerde aanvragen te ontgrendelen. Een aankoop is geen garantie op een opdracht.</p>

          {marketLead.mode === "preview" ? (
            <>
            {marketLead.distributionOffer.id && marketLead.distributionOffer.status === "offered" ? (
              <form action={viewDistributionOfferAction} className="space-y-3">
                <input type="hidden" name="candidate_id" value={marketLead.distributionOffer.id} />
                <input type="hidden" name="redirect_to" value={`/vakman/aanvragen/${marketLead.preview.leadId}`} />
                <SubmitButton variant="secondary" className="w-full" pendingLabel="Offer openen...">
                  Markeer als bekeken
                </SubmitButton>
              </form>
            ) : null}
            <form action={purchaseLeadAction} className="space-y-3">
              <input type="hidden" name="lead_id" value={marketLead.preview.leadId} />
              <input type="hidden" name="idempotency_key" value={confirmationToken} />
              <input type="hidden" name="redirect_to" value={`/vakman/aanvragen/${marketLead.preview.leadId}`} />
              <p id="purchase-guidance" className="rounded-2xl bg-surface-muted px-4 py-3 text-sm text-muted-foreground">
                Controleer wat je ontgrendelt, de getoonde prijs en je saldo. Na geldige aankoop worden contactgegevens vrijgegeven; de aankoop garandeert geen opdracht. De prijs en je aankooprecht worden bij bevestiging opnieuw server-side gecontroleerd.
              </p>
              <SubmitButton className="w-full" aria-describedby="purchase-guidance purchase-block-reason" disabled={marketLead.state !== "available" || marketLead.commercial.balanceAfterPurchase < 0 || !canPurchaseFromOffer} pendingLabel="Aankoop wordt verwerkt...">
                Bevestig aankoop
              </SubmitButton>
              {marketLead.state !== "available" || !canPurchaseFromOffer || marketLead.commercial.balanceAfterPurchase < 0 ? (
                <div id="purchase-block-reason" className="space-y-1 text-sm">
                  {marketLead.state !== "available" ? <p className="text-muted-foreground">Deze aanvraag is niet meer beschikbaar voor aankoop.</p> : null}
                  {!canPurchaseFromOffer ? <p className="text-muted-foreground">Dit aanbod kan niet meer worden gekocht. Controleer de actuele status.</p> : null}
                  {marketLead.commercial.balanceAfterPurchase < 0 ? <p className="text-danger">Je hebt {formatCredits(marketLead.commercial.currentBalance)}. Voor deze aanvraag zijn {formatCredits(marketLead.commercial.priceCredits)} nodig; je komt {formatCredits(marketLead.commercial.priceCredits - marketLead.commercial.currentBalance)} tekort. Credits kopen is op dit moment niet beschikbaar. Bekijk je saldo en transacties bij <Link href="/vakman/credits" className="underline">Credits</Link>.</p> : null}
                </div>
              ) : null}
            </form>
            </>
          ) : null}

          {(marketLead.mode === "preview" && marketLead.distributionOffer.id && ["offered", "viewed"].includes(marketLead.distributionOffer.status ?? "")) ? (
            <form action={declineDistributionOfferAction} className="space-y-3">
              <input type="hidden" name="candidate_id" value={marketLead.distributionOffer.id} />
              <input type="hidden" name="redirect_to" value={`/vakman/aanvragen/${marketLead.preview.leadId}`} />
              <label className="block text-sm font-medium text-foreground" htmlFor="decline-reason">Reden van weigeren</label>
              <Select id="decline-reason" name="reason" defaultValue="te_ver" aria-label="Kies weigerreden voor dit aanbod">
                {declineReasonValues.map((value) => (
                  <option key={value} value={value}>{declineReasonLabels[value]}</option>
                ))}
              </Select>
              <SubmitButton className="w-full" variant="secondary" pendingLabel="Aanbod wordt geweigerd...">
                Aanbod weigeren
              </SubmitButton>
            </form>
          ) : null}

          {marketLead.mode === "assigned-preview" ? (
            <div className="space-y-3">
              <p className="rounded-2xl bg-surface-muted px-4 py-3 text-sm text-muted-foreground">Deze lead is direct aan jou toegewezen. Contact unlockt zodra je de assignment accepteert.</p>
              <form action={respondToAssignmentAction}>
                <input type="hidden" name="lead_id" value={marketLead.preview.leadId} />
                <input type="hidden" name="decision" value="accepted" />
                <input type="hidden" name="redirect_to" value={`/vakman/aanvragen/${marketLead.preview.leadId}`} />
                <SubmitButton className="w-full" pendingLabel="Assignment wordt geaccepteerd...">Assignment accepteren</SubmitButton>
              </form>
              <form action={respondToAssignmentAction}>
                <input type="hidden" name="lead_id" value={marketLead.preview.leadId} />
                <input type="hidden" name="decision" value="rejected" />
                <input type="hidden" name="redirect_to" value={`/vakman/aanvragen/${marketLead.preview.leadId}`} />
                <SubmitButton className="w-full" variant="secondary" pendingLabel="Assignment wordt geweigerd...">Weigeren</SubmitButton>
              </form>
            </div>
          ) : null}

          {marketLead.mode === "unlocked" && marketLead.detail ? (
            <form action={updateLeadProgressAction} className="space-y-3">
              <input type="hidden" name="lead_id" value={marketLead.detail.lead.id} />
              <input type="hidden" name="redirect_to" value={`/vakman/aanvragen/${marketLead.detail.lead.id}`} />
              <Select name="progress_status" aria-label="Voortgangsstatus" defaultValue={marketLead.detail.assignmentProgressStatus}>
                {leadProgressStatusValues.map((value) => (
                  <option key={value} value={value}>{progressLabels[value]}</option>
                ))}
              </Select>
              <Select name="loss_reason" aria-label="Reden waarom de opdracht niet is gewonnen" defaultValue={marketLead.detail.lossReason ?? ""}>
                <option value="">Geen verliesreden</option>
                {leadLossReasonValues.map((value) => (
                  <option key={value} value={value}>{lossReasonLabels[value]}</option>
                ))}
              </Select>
              <SubmitButton className="w-full" variant="secondary" pendingLabel="Voortgang wordt bijgewerkt...">Voortgang bijwerken</SubmitButton>
            </form>
          ) : null}
          {marketLead.mode === "closed" ? (
            <p className="rounded-2xl bg-surface-muted px-4 py-3 text-sm text-muted-foreground">
              Dit aanbod is gesloten of verlopen. Nieuwe offers verschijnen op je aanvragenoverzicht.
            </p>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
