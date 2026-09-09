import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  addProfessionalAreaAction,
  addProfessionalServiceAction,
  removeProfessionalAreaAction,
  toggleProfessionalServiceAction,
  updateProfessionalAdminProfileAction,
  updateProfessionalStatusAction,
  updateProfessionalVerificationStatusAction,
} from "@/lib/professionals/actions";
import { getAdminProfessionalDetail } from "@/lib/professionals/queries";
import { getAdminServices } from "@/lib/services/queries";
import { professionalStatusValues, professionalVerificationStatusValues } from "@/lib/validation";
import { formatDate } from "@/lib/utils";

export default async function AdminProfessionalDetailPage({
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
  const [professional, services] = await Promise.all([getAdminProfessionalDetail(id), getAdminServices()]);

  if (!professional) {
    notFound();
  }

  const activeServiceIds = new Set(professional.serviceLinks.filter((serviceLink) => serviceLink.active).map((serviceLink) => serviceLink.service.id));

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={professional.company_name} title="Vakman detail" description="Beheer bedrijfsgegevens, status, verificatie, diensten, werkgebieden en statistieken." />
      {success ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-success">{success}</p> : null}
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-danger">{error}</p> : null}
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Bedrijfsgegevens</h2>
          <form action={updateProfessionalAdminProfileAction} className="space-y-4">
            <input type="hidden" name="professional_id" value={professional.id} />
            <input type="hidden" name="redirect_to" value={`/admin/vakmannen/${professional.id}`} />
            <div className="grid gap-4 md:grid-cols-2">
              <FormField id="company_name" label="Bedrijfsnaam"><Input id="company_name" name="company_name" defaultValue={professional.company_name} required /></FormField>
              <FormField id="contact_name" label="Contactpersoon"><Input id="contact_name" name="contact_name" defaultValue={professional.contact_name} required /></FormField>
              <FormField id="email" label="E-mailadres"><Input id="email" name="email" type="email" defaultValue={professional.email} required /></FormField>
              <FormField id="phone" label="Telefoonnummer"><Input id="phone" name="phone" defaultValue={professional.phone} required /></FormField>
              <FormField id="kvk_number" label="KvK-nummer"><Input id="kvk_number" name="kvk_number" defaultValue={professional.kvk_number ?? ""} /></FormField>
              <FormField id="website" label="Website"><Input id="website" name="website" type="url" defaultValue={professional.website ?? ""} placeholder="https://" /></FormField>
            </div>
            <FormField id="description" label="Bedrijfsomschrijving"><Input id="description" name="description" defaultValue={professional.description ?? ""} /></FormField>
            <SubmitButton pendingLabel="Bedrijfsgegevens worden opgeslagen...">Opslaan</SubmitButton>
          </form>
        </Card>

        <div className="space-y-6">
          <Card className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Accountstatus</h2>
            <div className="flex flex-wrap gap-3">
              <StatusBadge value={professional.status} />
              <p className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium">Aangemaakt: {formatDate(professional.created_at)}</p>
            </div>
            <form action={updateProfessionalStatusAction} className="space-y-4">
              <input type="hidden" name="professional_id" value={professional.id} />
              <input type="hidden" name="redirect_to" value={`/admin/vakmannen/${professional.id}`} />
              <Select name="status" defaultValue={professional.status}>
                {professionalStatusValues.map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </Select>
              <SubmitButton pendingLabel="Status wordt opgeslagen...">Status opslaan</SubmitButton>
            </form>
          </Card>

          <Card className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Verificatie</h2>
            <StatusBadge value={professional.verification_status} />
            <form action={updateProfessionalVerificationStatusAction} className="space-y-4">
              <input type="hidden" name="professional_id" value={professional.id} />
              <input type="hidden" name="redirect_to" value={`/admin/vakmannen/${professional.id}`} />
              <Select name="verification_status" defaultValue={professional.verification_status}>
                {professionalVerificationStatusValues.map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </Select>
              <SubmitButton pendingLabel="Verificatie wordt opgeslagen...">Verificatie opslaan</SubmitButton>
            </form>
          </Card>

          <Card className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Statistieken</h2>
            <div className="grid gap-3 text-sm">
              <p>Totaal assignments: <strong>{professional.stats.assignmentsTotal}</strong></p>
              <p>Geaccepteerd: <strong>{professional.stats.assignmentsAccepted}</strong></p>
              <p>Gewonnen: <strong>{professional.stats.assignmentsWon}</strong></p>
              <p>Verloren: <strong>{professional.stats.assignmentsLost}</strong></p>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Diensten</h2>
          <form action={addProfessionalServiceAction} className="grid gap-3 md:grid-cols-[1fr_auto]">
            <input type="hidden" name="professional_id" value={professional.id} />
            <input type="hidden" name="redirect_to" value={`/admin/vakmannen/${professional.id}`} />
            <Select name="service_id" defaultValue="">
              <option value="">Kies dienst</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>{service.name}</option>
              ))}
            </Select>
            <SubmitButton pendingLabel="Dienst wordt toegevoegd...">Toevoegen</SubmitButton>
          </form>
          <div className="space-y-2">
            {professional.serviceLinks.map((serviceLink) => (
              <div key={serviceLink.id} className="flex items-center justify-between gap-3 rounded-2xl bg-surface-muted px-4 py-3 text-sm">
                <div>
                  <p className="font-medium">{serviceLink.service.name}</p>
                  <p className="text-muted-foreground">{serviceLink.active ? "Actief" : "Inactief"}</p>
                </div>
                <form action={toggleProfessionalServiceAction}>
                  <input type="hidden" name="professional_service_id" value={serviceLink.id} />
                  <input type="hidden" name="professional_id" value={professional.id} />
                  <input type="hidden" name="redirect_to" value={`/admin/vakmannen/${professional.id}`} />
                  <input type="hidden" name="active" value={String(!serviceLink.active)} />
                  <SubmitButton variant="secondary" pendingLabel="Bezig...">{serviceLink.active ? "Deactiveer" : "Activeer"}</SubmitButton>
                </form>
              </div>
            ))}
            {!professional.serviceLinks.length ? <p className="text-sm text-muted-foreground">Nog geen diensten gekoppeld.</p> : null}
            {!services.some((service) => !activeServiceIds.has(service.id)) ? <p className="text-xs text-muted-foreground">Alle diensten zijn al gekoppeld.</p> : null}
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Werkgebieden</h2>
          <form action={addProfessionalAreaAction} className="grid gap-3 md:grid-cols-[1fr_auto]">
            <input type="hidden" name="professional_id" value={professional.id} />
            <input type="hidden" name="redirect_to" value={`/admin/vakmannen/${professional.id}`} />
            <Input name="postal_code_prefix" placeholder="Bijv. 4811" pattern="[1-9][0-9]{3}" required />
            <SubmitButton pendingLabel="Werkgebied wordt toegevoegd...">Toevoegen</SubmitButton>
          </form>
          <div className="flex flex-wrap gap-2">
            {professional.areaLinks.map((area) => (
              <form key={area.id} action={removeProfessionalAreaAction} className="inline-flex items-center gap-2 rounded-full bg-surface-muted px-3 py-2 text-sm">
                <input type="hidden" name="area_id" value={area.id} />
                <input type="hidden" name="professional_id" value={professional.id} />
                <input type="hidden" name="redirect_to" value={`/admin/vakmannen/${professional.id}`} />
                <span>{area.postalCodePrefix}</span>
                <SubmitButton variant="ghost" pendingLabel="...">×</SubmitButton>
              </form>
            ))}
            {!professional.areaLinks.length ? <p className="text-sm text-muted-foreground">Nog geen werkgebieden toegevoegd.</p> : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
