import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import {
  addProfessionalAreaAction,
  addProfessionalServiceAction,
  createProfessionalReviewFeedbackAction,
  removeProfessionalAreaAction,
  reviewProfessionalDocumentAction,
  reviewProfessionalVerificationAction,
  toggleProfessionalServiceAction,
  updateProfessionalAdminProfileAction,
  updateProfessionalStatusAction,
  updateProfessionalVerificationStatusAction,
} from "@/lib/professionals/actions";
import { getAdminProfessionalDetail } from "@/lib/professionals/queries";
import { getAdminServices } from "@/lib/services/queries";
import { professionalDocumentVerificationStatusValues, professionalReviewFeedbackStatusValues, professionalReviewSectionValues, professionalStatusValues, professionalVerificationStatusValues } from "@/lib/validation";
import { formatDate } from "@/lib/utils";

const professionalVerificationDecisionValues = ["verify", "changes_requested", "reject", "suspend"] as const;

export default async function AdminProfessionalDetailPage({ params, searchParams }: Readonly<{ params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>>; }>) {
  const { id } = await params;
  const query = await searchParams;
  const success = typeof query.success === "string" ? query.success : undefined;
  const error = typeof query.error === "string" ? query.error : undefined;
  const [professional, services] = await Promise.all([getAdminProfessionalDetail(id), getAdminServices()]);
  if (!professional) notFound();

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={professional.company_name} title="Vakman detail" description="Volledige onboarding-, verificatie-, document- en auditreview." />
      {success ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-success">{success}</p> : null}
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-danger">{error}</p> : null}
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Profiel & onboarding</h2>
          <div className="flex flex-wrap gap-3">
            <StatusBadge value={professional.status} />
            <StatusBadge value={professional.onboarding_status} />
            <StatusBadge value={professional.verification_status} />
            <p className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium">Kwaliteit {professional.quality_score}/100 ({professional.qualityLabel})</p>
          </div>
          <form action={updateProfessionalAdminProfileAction} className="space-y-4">
            <input type="hidden" name="professional_id" value={professional.id} />
            <input type="hidden" name="redirect_to" value={`/admin/vakmannen/${professional.id}`} />
            <div className="grid gap-4 md:grid-cols-2">
              <FormField id="company_name" label="Bedrijfsnaam"><Input id="company_name" name="company_name" defaultValue={professional.company_name} required /></FormField>
              <FormField id="trade_name" label="Handelsnaam"><Input id="trade_name" name="trade_name" defaultValue={professional.trade_name ?? ""} /></FormField>
              <FormField id="contact_name" label="Contactpersoon"><Input id="contact_name" name="contact_name" defaultValue={professional.contact_name} required /></FormField>
              <FormField id="email" label="E-mailadres"><Input id="email" name="email" type="email" defaultValue={professional.email} required /></FormField>
              <FormField id="phone" label="Telefoonnummer"><Input id="phone" name="phone" defaultValue={professional.phone} required /></FormField>
              <FormField id="kvk_number" label="KvK-nummer"><Input id="kvk_number" name="kvk_number" defaultValue={professional.kvk_number ?? ""} /></FormField>
              <FormField id="website" label="Website"><Input id="website" name="website" type="url" defaultValue={professional.website ?? ""} /></FormField>
              <FormField id="postal_code" label="Postcode"><Input id="postal_code" name="postal_code" defaultValue={professional.postal_code ?? ""} /></FormField>
            </div>
            <FormField id="description" label="Omschrijving"><Textarea id="description" name="description" defaultValue={professional.description ?? ""} /></FormField>
            <SubmitButton pendingLabel="Opslaan...">Profiel opslaan</SubmitButton>
          </form>
        </Card>
        <div className="space-y-6">
          <Card className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Admin-status</h2>
            <form action={updateProfessionalStatusAction} className="space-y-4">
              <input type="hidden" name="professional_id" value={professional.id} />
              <input type="hidden" name="redirect_to" value={`/admin/vakmannen/${professional.id}`} />
              <Select name="status" defaultValue={professional.status}>{professionalStatusValues.map((value) => <option key={value} value={value}>{value}</option>)}</Select>
              <SubmitButton pendingLabel="Opslaan...">Status opslaan</SubmitButton>
            </form>
            <form action={updateProfessionalVerificationStatusAction} className="space-y-4">
              <input type="hidden" name="professional_id" value={professional.id} />
              <input type="hidden" name="redirect_to" value={`/admin/vakmannen/${professional.id}`} />
              <Select name="verification_status" defaultValue={professional.verification_status}>{professionalVerificationStatusValues.map((value) => <option key={value} value={value}>{value}</option>)}</Select>
              <SubmitButton pendingLabel="Opslaan...">Verificatie opslaan</SubmitButton>
            </form>
          </Card>
          <Card className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Verificatiebesluit</h2>
            <form action={reviewProfessionalVerificationAction} className="space-y-4">
              <input type="hidden" name="professional_id" value={professional.id} />
              <input type="hidden" name="redirect_to" value={`/admin/vakmannen/${professional.id}`} />
              <Select name="decision" defaultValue="verify">{professionalVerificationDecisionValues.map((value) => <option key={value} value={value}>{value}</option>)}</Select>
              <Textarea name="reason" placeholder="Verplicht voor changes requested, reject of suspend" />
              <SubmitButton pendingLabel="Verwerken...">Besluit opslaan</SubmitButton>
            </form>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Diensten</h2>
          <form action={addProfessionalServiceAction} className="grid gap-3 md:grid-cols-[1fr_auto]">
            <input type="hidden" name="professional_id" value={professional.id} />
            <input type="hidden" name="redirect_to" value={`/admin/vakmannen/${professional.id}`} />
            <Select name="service_id" defaultValue=""><option value="">Kies dienst</option>{services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}</Select>
            <SubmitButton pendingLabel="Toevoegen...">Toevoegen</SubmitButton>
          </form>
          <div className="space-y-2">{professional.serviceLinks.map((serviceLink) => <div key={serviceLink.id} className="flex items-center justify-between rounded-2xl bg-surface-muted px-4 py-3 text-sm"><div><p className="font-medium">{serviceLink.service.name}</p><p className="text-muted-foreground">{serviceLink.active ? "Actief" : "Inactief"} · {serviceLink.yearsExperience} jaar</p></div><form action={toggleProfessionalServiceAction}><input type="hidden" name="professional_service_id" value={serviceLink.id} /><input type="hidden" name="professional_id" value={professional.id} /><input type="hidden" name="redirect_to" value={`/admin/vakmannen/${professional.id}`} /><input type="hidden" name="active" value={String(!serviceLink.active)} /><SubmitButton variant="secondary" pendingLabel="...">{serviceLink.active ? "Deactiveer" : "Activeer"}</SubmitButton></form></div>)}</div>
        </Card>
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Werkgebieden & capaciteit</h2>
          <form action={addProfessionalAreaAction} className="grid gap-3 md:grid-cols-[1fr_auto]">
            <input type="hidden" name="professional_id" value={professional.id} />
            <input type="hidden" name="redirect_to" value={`/admin/vakmannen/${professional.id}`} />
            <Input name="postal_code_prefix" placeholder="4811" pattern="[1-9][0-9]{3}" required />
            <SubmitButton pendingLabel="Toevoegen...">Toevoegen</SubmitButton>
          </form>
          <div className="flex flex-wrap gap-2">{professional.areaLinks.map((area) => <form key={area.id} action={removeProfessionalAreaAction} className="inline-flex items-center gap-2 rounded-full bg-surface-muted px-3 py-2 text-sm"><input type="hidden" name="area_id" value={area.id} /><input type="hidden" name="professional_id" value={professional.id} /><input type="hidden" name="redirect_to" value={`/admin/vakmannen/${professional.id}`} /><span>{area.postalCodePrefix}</span><SubmitButton variant="ghost" pendingLabel="...">×</SubmitButton></form>)}</div>
          <div className="grid gap-3 text-sm md:grid-cols-2">
            <p>Beschikbaarheid: <strong>{professional.distributionSettings?.availability_status ?? "available"}</strong></p>
            <p>Paused: <strong>{professional.distributionSettings?.paused ? "ja" : "nee"}</strong></p>
            <p>Max open offers: <strong>{professional.distributionSettings?.max_open_offers ?? 0}</strong></p>
            <p>Max actieve opdrachten: <strong>{professional.distributionSettings?.max_active_assignments ?? 0}</strong></p>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Documenten</h2>
          <div className="space-y-3">
            {professional.documents.map((document) => (
              <div key={document.id} className="rounded-2xl border px-4 py-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2"><StatusBadge value={document.verification_status} /><span className="font-medium">{document.document_type}</span></div>
                    <p className="text-muted-foreground">{document.original_filename} · {formatDate(document.uploaded_at)}</p>
                    {document.signedUrl ? <a className="text-primary hover:underline" href={document.signedUrl} target="_blank" rel="noreferrer">Bekijk document</a> : null}
                  </div>
                  <form action={reviewProfessionalDocumentAction} className="space-y-2">
                    <input type="hidden" name="document_id" value={document.id} />
                    <input type="hidden" name="professional_id" value={professional.id} />
                    <input type="hidden" name="redirect_to" value={`/admin/vakmannen/${professional.id}`} />
                    <Select name="verification_status" defaultValue={document.verification_status}>{professionalDocumentVerificationStatusValues.map((value) => <option key={value} value={value}>{value}</option>)}</Select>
                    <Input name="rejection_reason" placeholder="Reden bij reject/expired" defaultValue={document.rejection_reason ?? ""} />
                    <SubmitButton variant="secondary" pendingLabel="...">Review opslaan</SubmitButton>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Checklist, feedback & audit</h2>
          <div className="rounded-2xl bg-surface-muted p-4 text-sm"><p className="font-medium">Ontbrekende stappen</p><p className="text-muted-foreground">{professional.missingSteps.join(", ") || "Geen"}</p></div>
          <form action={createProfessionalReviewFeedbackAction} className="space-y-4">
            <input type="hidden" name="professional_id" value={professional.id} />
            <input type="hidden" name="redirect_to" value={`/admin/vakmannen/${professional.id}`} />
            <Select name="section" defaultValue="company">{professionalReviewSectionValues.map((value) => <option key={value} value={value}>{value}</option>)}</Select>
            <Select name="status" defaultValue="open">{professionalReviewFeedbackStatusValues.map((value) => <option key={value} value={value}>{value}</option>)}</Select>
            <Textarea name="message" placeholder="Feedback per sectie" required />
            <SubmitButton pendingLabel="Opslaan...">Feedback toevoegen</SubmitButton>
          </form>
          <div className="space-y-3 text-sm">{professional.reviewFeedback.map((feedback) => <div key={feedback.id} className="rounded-2xl border px-4 py-3"><div className="flex items-center gap-2"><StatusBadge value={feedback.status} /><span className="font-medium">{feedback.section}</span></div><p className="mt-2">{feedback.message}</p><p className="mt-2 text-xs text-muted-foreground">{formatDate(feedback.created_at)}</p></div>)}</div>
          <div className="space-y-3 text-sm">{professional.auditEntries.map((entry) => <div key={entry.id} className="rounded-2xl border px-4 py-3"><p className="font-medium">{entry.event_type}</p><p className="text-xs text-muted-foreground">{formatDate(entry.created_at)}</p></div>)}</div>
        </Card>
      </div>
    </div>
  );
}
