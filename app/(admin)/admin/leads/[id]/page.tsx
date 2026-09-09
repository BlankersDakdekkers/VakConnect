import Image from "next/image";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { FormField } from "@/components/ui/form-field";
import { PageHeader } from "@/components/ui/page-header";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { SubmitButton } from "@/components/ui/submit-button";
import { formatCredits } from "@/lib/commercial/labels";
import { getAdminLeadCommercialDetail } from "@/lib/commercial/queries";
import { refundLeadPurchaseAction, updateLeadCommercialSettingsAction } from "@/lib/commercial/actions";
import { assignLeadAction, updateLeadStatusAction } from "@/lib/leads/actions";
import { getAdminLeadDetail } from "@/lib/leads/queries";
import { findEligibleProfessionalsForLead } from "@/lib/matching";
import { getActiveAssignableProfessionals } from "@/lib/professionals/queries";
import { leadStatusValues } from "@/lib/validation";
import { formatDate, formatFileSize, formatPostalCode } from "@/lib/utils";

function renderJsonReasons(reasons: unknown) {
  if (!Array.isArray(reasons)) {
    return null;
  }

  return reasons
    .filter((reason): reason is Record<string, unknown> => typeof reason === "object" && reason !== null)
    .map((reason, index) => (
      <li key={`${reason.key ?? "reason"}-${index}`} className="rounded-2xl bg-surface-muted px-4 py-3">
        <p className="font-medium">{String(reason.label ?? reason.code ?? "Reden")}</p>
        {"awarded" in reason && "max" in reason ? (
          <p className="text-muted-foreground">
            {String(reason.awarded)}/{String(reason.max)}
          </p>
        ) : null}
        {"summary" in reason ? <p className="text-muted-foreground">{String(reason.summary)}</p> : null}
        {"passed" in reason ? <p className="text-muted-foreground">{reason.passed ? "Voorwaarde behaald" : "Voorwaarde niet behaald"}</p> : null}
      </li>
    ));
}

export default async function AdminLeadDetailPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const { id } = await params;
  const query = await searchParams;
  const success = typeof query.success === "string" ? query.success : undefined;
  const error = typeof query.error === "string" ? query.error : undefined;
  const [lead, commercial] = await Promise.all([getAdminLeadDetail(id), getAdminLeadCommercialDetail(id)]);

  if (!lead) {
    notFound();
  }

  const [fallbackMatches, assignableProfessionals] = await Promise.all([
    lead.service && lead.matches.length === 0
      ? findEligibleProfessionalsForLead({ leadId: lead.id, serviceId: lead.service.id, postalCode: lead.postal_code })
      : Promise.resolve([]),
    lead.service ? getActiveAssignableProfessionals(lead.service.id) : Promise.resolve([]),
  ]);
  const matches = lead.matches.length
    ? lead.matches
    : fallbackMatches.map((match) => ({
      id: `fallback-${match.professionalId}`,
      professionalId: match.professionalId,
      companyName: match.companyName,
      contactName: match.contactName,
      email: match.email,
      phone: match.phone,
      status: "active",
      matchScore: match.matchScore,
      reasons: match.reasons,
    }));
  const scoreReasons = renderJsonReasons(lead.score_reasons);

  return (
    <div className="space-y-6">
      {success ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-success">{success}</p> : null}
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-danger">{error}</p> : null}
      <PageHeader
        eyebrow={lead.public_reference}
        title="Lead detail"
        description="Leadinformatie, intake, score, attribution, matching, assignment en activity timeline."
      />
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <Card className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Leadinformatie</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Dienst</p>
                <p className="mt-1 font-medium">{lead.service?.name ?? "Onbekend"}</p>
                <p className="text-sm text-muted-foreground">{formatPostalCode(lead.postal_code)} {lead.house_number}{lead.house_number_addition ? ` ${lead.house_number_addition}` : ""}</p>
                <p className="text-sm text-muted-foreground">Aangemaakt op {formatDate(lead.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Klant</p>
                <p className="mt-1 font-medium">{lead.first_name} {lead.last_name}</p>
                <p className="text-sm text-muted-foreground">{lead.phone}</p>
                <p className="text-sm text-muted-foreground">{lead.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <StatusBadge value={lead.status} />
              <StatusBadge value={lead.urgency} />
              {lead.preferred_timing ? <StatusBadge value={lead.preferred_timing} /> : null}
            </div>
            <p className="text-sm leading-7 text-muted-foreground">{lead.description}</p>
          </Card>

          <Card className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Intake</h2>
            {lead.answers.length ? (
              <div className="space-y-3">
                {lead.answers.map((answer) => (
                  <div key={answer.id} className="rounded-3xl bg-surface-muted p-4">
                    <p className="font-medium">{answer.question.question}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{answer.displayValue}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="Geen extra intake-antwoorden" description="Voor deze lead zijn geen dynamische dienstvragen opgeslagen." />
            )}
          </Card>

          <Card className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Score</h2>
            <p className="text-3xl font-semibold">{lead.lead_score ?? "—"}</p>
            {scoreReasons?.length ? <ul className="space-y-3 text-sm">{scoreReasons}</ul> : <EmptyState title="Geen scoringsuitleg" description="Voor deze lead zijn nog geen score reasons opgeslagen." />}
          </Card>

          <Card className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Attribution</h2>
            <dl className="grid gap-3 text-sm md:grid-cols-2">
              <div><dt className="text-muted-foreground">Source</dt><dd>{lead.utm_source ?? lead.source ?? "direct"}</dd></div>
              <div><dt className="text-muted-foreground">Medium</dt><dd>{lead.utm_medium ?? "—"}</dd></div>
              <div><dt className="text-muted-foreground">Campaign</dt><dd>{lead.utm_campaign ?? "—"}</dd></div>
              <div><dt className="text-muted-foreground">Term</dt><dd>{lead.utm_term ?? "—"}</dd></div>
              <div><dt className="text-muted-foreground">Content</dt><dd>{lead.utm_content ?? "—"}</dd></div>
              <div><dt className="text-muted-foreground">Landing page</dt><dd>{lead.landing_page ?? "—"}</dd></div>
              <div><dt className="text-muted-foreground">Referrer</dt><dd>{lead.referrer ?? "—"}</dd></div>
              <div><dt className="text-muted-foreground">GCLID / FBCLID</dt><dd>{lead.gclid ?? lead.fbclid ?? "—"}</dd></div>
              <div><dt className="text-muted-foreground">First touch source</dt><dd>{lead.first_touch_source ?? "—"}</dd></div>
              <div><dt className="text-muted-foreground">First touch time</dt><dd>{lead.first_touch_timestamp ? formatDate(lead.first_touch_timestamp) : "—"}</dd></div>
            </dl>
          </Card>

          <Card className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Matching</h2>
            {matches.length ? (
              <div className="space-y-3">
                {matches.map((match) => (
                  <div key={match.id} className="rounded-3xl bg-surface-muted p-4 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-foreground">{match.companyName}</p>
                        <p className="text-muted-foreground">{match.contactName} · {match.email}</p>
                      </div>
                      <p className="text-base font-semibold">{match.matchScore}/100</p>
                    </div>
                    {renderJsonReasons(match.reasons)?.length ? <ul className="mt-3 space-y-2">{renderJsonReasons(match.reasons)}</ul> : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Er is nog geen actieve professional gevonden met een passend werkgebied.</p>
            )}
          </Card>

          <Card className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Assignment</h2>
            {lead.assignments.length ? (
              <div className="space-y-3">
                {lead.assignments.map((assignment) => (
                  <div key={assignment.id} className="rounded-3xl bg-surface-muted p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">{assignment.professional?.company_name ?? "Onbekende vakman"}</p>
                        <p className="text-sm text-muted-foreground">Toegewezen op {formatDate(assignment.assigned_at)}</p>
                        {assignment.loss_reason ? <p className="text-sm text-muted-foreground">Verliesreden: {assignment.loss_reason}</p> : null}
                      </div>
                      <div className="flex gap-2">
                        <StatusBadge value={assignment.status} />
                        <StatusBadge value={assignment.progress_status} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="Nog geen toewijzingen" description="Deze lead is nog niet gekoppeld aan een vakman." />
            )}
          </Card>

          <Card className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Activity timeline</h2>
            {lead.activity.length ? (
              <div className="space-y-3">
                {lead.activity.map((event) => (
                  <div key={event.id} className="rounded-3xl bg-surface-muted p-4 text-sm">
                    <p className="font-medium">{event.activityType}</p>
                    <p className="text-muted-foreground">{formatDate(event.createdAt)}</p>
                    {event.professional?.company_name ? <p className="text-muted-foreground">Vakman: {event.professional.company_name}</p> : null}
                    {event.fromStatus || event.toStatus ? <p className="text-muted-foreground">{event.fromStatus ?? "—"} → {event.toStatus ?? "—"}</p> : null}
                  </div>
                ))}
              </div>
            ) : <EmptyState title="Nog geen activiteiten" description="Belangrijke leadacties verschijnen hier met timestamp." />}
          </Card>

          <Card className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Foto’s</h2>
            {lead.images.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {lead.images.map((image) => (
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
              <EmptyState title="Geen foto's toegevoegd" description="De consument heeft geen afbeeldingen meegestuurd." />
            )}
          </Card>

          {commercial ? (
            <Card className="space-y-4">
              <h2 className="text-lg font-semibold tracking-tight">Commerciële aankopen</h2>
              <div className="flex flex-wrap gap-3">
                <StatusBadge value={commercial.commercialType} />
                <StatusBadge value={commercial.salesStatus} />
                <p className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium">
                  Resolved prijs: {formatCredits(commercial.resolvedPriceCredits)}
                </p>
              </div>
              {commercial.purchases.length ? (
                <div className="space-y-4">
                  {commercial.purchases.map((purchase) => (
                    <div key={purchase.id} className="rounded-3xl bg-surface-muted p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-medium">{purchase.companyName}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatCredits(purchase.priceCredits)} · {formatDate(purchase.purchasedAt)}
                          </p>
                          {purchase.refundedAt ? <p className="text-sm text-muted-foreground">Refunded op {formatDate(purchase.refundedAt)}</p> : null}
                        </div>
                        <StatusBadge value={purchase.status} />
                      </div>
                      {purchase.status === "purchased" ? (
                        <form action={refundLeadPurchaseAction} className="mt-3 space-y-3">
                          <input type="hidden" name="purchase_id" value={purchase.id} />
                          <input type="hidden" name="redirect_to" value={`/admin/leads/${lead.id}`} />
                          <Input name="reason" placeholder="Refundreden" required />
                          <SubmitButton variant="secondary" pendingLabel="Refund wordt verwerkt...">Volledige refund</SubmitButton>
                        </form>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="Nog geen purchases" description="Commerciële aankopen en refunds verschijnen hier zodra een vakman een lead koopt." />
              )}
            </Card>
          ) : null}
        </div>

        <div className="space-y-6">
          <Card className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Leadstatus wijzigen</h2>
            <form action={updateLeadStatusAction} className="space-y-4">
              <input type="hidden" name="lead_id" value={lead.id} />
              <input type="hidden" name="redirect_to" value={`/admin/leads/${lead.id}`} />
              <FormField id="status" label="Status">
                <Select id="status" name="status" defaultValue={lead.status}>
                  {leadStatusValues.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </Select>
              </FormField>
              <SubmitButton pendingLabel="Status wordt opgeslagen...">Status opslaan</SubmitButton>
            </form>
          </Card>

          <Card className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Lead handmatig toewijzen</h2>
            <form action={assignLeadAction} className="space-y-4">
              <input type="hidden" name="lead_id" value={lead.id} />
              <input type="hidden" name="redirect_to" value={`/admin/leads/${lead.id}`} />
              <FormField id="professional_id" label="Actieve vakman">
                <Select id="professional_id" name="professional_id" defaultValue="">
                  <option value="">Selecteer een vakman</option>
                  {assignableProfessionals.map((professional) => (
                    <option key={professional.id} value={professional.id}>
                      {professional.company_name}
                    </option>
                  ))}
                </Select>
              </FormField>
              <SubmitButton pendingLabel="Lead wordt toegewezen...">Toewijzen</SubmitButton>
            </form>
          </Card>

          {commercial ? (
            <Card className="space-y-4">
              <h2 className="text-lg font-semibold tracking-tight">Commerciële instellingen</h2>
              <form action={updateLeadCommercialSettingsAction} className="space-y-4">
                <input type="hidden" name="lead_id" value={lead.id} />
                <input type="hidden" name="redirect_to" value={`/admin/leads/${lead.id}`} />
                <FormField id="subservice_slug" label="Subdienst slug">
                  <Input id="subservice_slug" name="subservice_slug" defaultValue={commercial.subserviceSlug ?? ""} />
                </FormField>
                <FormField id="commercial_type" label="Commercial type">
                  <Select id="commercial_type" name="commercial_type" defaultValue={commercial.commercialType}>
                    <option value="shared">shared</option>
                    <option value="exclusive">exclusive</option>
                  </Select>
                </FormField>
                <FormField id="price_credits" label="Prijs override in credits">
                  <Input id="price_credits" name="price_credits" type="number" min="1" defaultValue={commercial.priceCredits ?? ""} />
                </FormField>
                <FormField id="max_buyers" label="Max kopers">
                  <Input id="max_buyers" name="max_buyers" type="number" min="1" defaultValue={commercial.maxBuyers} required />
                </FormField>
                <FormField id="sales_status" label="Sales status">
                  <Select id="sales_status" name="sales_status" defaultValue={commercial.salesStatus}>
                    <option value="available">available</option>
                    <option value="partially_sold">partially_sold</option>
                    <option value="sold_out">sold_out</option>
                    <option value="unavailable">unavailable</option>
                    <option value="closed">closed</option>
                  </Select>
                </FormField>
                <p className="text-sm text-muted-foreground">Huidige kopers: {commercial.buyersCount}. Verlaag max buyers nooit onder dit aantal.</p>
                <SubmitButton pendingLabel="Commerciële instellingen worden opgeslagen...">Opslaan</SubmitButton>
              </form>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
