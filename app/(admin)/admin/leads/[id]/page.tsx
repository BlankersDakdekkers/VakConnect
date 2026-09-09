import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { FormField } from "@/components/ui/form-field";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { SubmitButton } from "@/components/ui/submit-button";
import { assignLeadAction, updateLeadStatusAction } from "@/lib/leads/actions";
import { getAdminLeadDetail } from "@/lib/leads/queries";
import { findEligibleProfessionalsForLead } from "@/lib/matching";
import { getActiveAssignableProfessionals } from "@/lib/professionals/queries";
import { leadStatusValues } from "@/lib/validation";
import { formatDate, formatFileSize, formatPostalCode } from "@/lib/utils";

export default async function AdminLeadDetailPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const lead = await getAdminLeadDetail(id);

  if (!lead) {
    notFound();
  }

  const [eligibleProfessionals, assignableProfessionals] = await Promise.all([
    findEligibleProfessionalsForLead({ leadId: lead.id, serviceId: lead.service?.id ?? "", postalCode: lead.postal_code }),
    lead.service ? getActiveAssignableProfessionals(lead.service.id) : Promise.resolve([]),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={lead.public_reference}
        title="Lead detail"
        description="Bekijk klantgegevens, status en assignment history."
      />
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <Card className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Aanvraaggegevens</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Klant</p>
                <p className="mt-1 font-medium">{lead.first_name} {lead.last_name}</p>
                <p className="text-sm text-muted-foreground">{lead.email}</p>
                <p className="text-sm text-muted-foreground">{lead.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dienst</p>
                <p className="mt-1 font-medium">{lead.service?.name ?? "Onbekend"}</p>
                <p className="text-sm text-muted-foreground">{formatPostalCode(lead.postal_code)} {lead.house_number}{lead.house_number_addition ? ` ${lead.house_number_addition}` : ""}</p>
                <p className="text-sm text-muted-foreground">Aangemaakt op {formatDate(lead.created_at)}</p>
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
            <h2 className="text-lg font-semibold tracking-tight">Foto's</h2>
            {lead.images.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {lead.images.map((image) => (
                  <a key={image.path} href={image.url ?? "#"} target="_blank" rel="noreferrer" className="overflow-hidden rounded-3xl border bg-surface-muted">
                    {image.url ? (
                      <img src={image.url} alt="Lead upload" className="h-56 w-full object-cover" />
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

          <Card className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Assignment history</h2>
            {lead.assignments.length ? (
              <div className="space-y-3">
                {lead.assignments.map((assignment) => (
                  <div key={assignment.id} className="rounded-3xl bg-surface-muted p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">{assignment.professional?.company_name ?? "Onbekende vakman"}</p>
                        <p className="text-sm text-muted-foreground">Toegewezen op {formatDate(assignment.assigned_at)}</p>
                      </div>
                      <StatusBadge value={assignment.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="Nog geen toewijzingen" description="Deze lead is nog niet gekoppeld aan een vakman." />
            )}
          </Card>
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
            {eligibleProfessionals.length ? (
              <div className="space-y-3 rounded-3xl bg-surface-muted p-4 text-sm">
                <p className="font-medium text-foreground">Geschikte professionals op basis van regio-match</p>
                <ul className="space-y-2 text-muted-foreground">
                  {eligibleProfessionals.map((professional) => (
                    <li key={professional.id}>
                      {professional.companyName} · gebieden {professional.postalCodePrefixes.join(", ")}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Er is nog geen actieve professional gevonden met een passend werkgebied.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
