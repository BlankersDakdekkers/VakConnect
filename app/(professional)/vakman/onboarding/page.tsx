import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { OnboardingAutosaveForm } from "@/components/forms/onboarding-autosave-form";
import { ProfessionalQualitySummary } from "@/components/professional/quality-summary";
import {
  deleteProfessionalDocumentAction,
  removeOwnProfessionalAreaAction,
  saveProfessionalOnboardingStepAction,
  submitProfessionalOnboardingAction,
  updateOwnProfessionalAreaAction,
  uploadProfessionalDocumentAction,
} from "@/lib/professionals/actions";
import { getOwnProfessionalDetail } from "@/lib/professionals/queries";
import { getPreviousOnboardingStep, professionalOnboardingSteps } from "@/lib/professionals/onboarding";
import { requireProfessionalUser } from "@/lib/auth/helpers";
import { getAdminServices } from "@/lib/services/queries";
import { professionalAvailabilityStatusValues, professionalDocumentTypeValues, professionalIdentityTypeValues, leadCommercialTypeValues } from "@/lib/validation";
import { formatDate, formatFileSize } from "@/lib/utils";
import { professionalAvailabilityStatusLabels, professionalDocumentStatusLabels, professionalDocumentTypeLabels, professionalOnboardingStatusLabels, professionalStatusDescriptions, professionalVerificationStatusLabels } from "@/lib/professionals/labels";
import type { ProfessionalReviewSection } from "@/types/database";

const reviewSectionStep: Record<ProfessionalReviewSection, string> = {
  company: "company",
  contact: "contact",
  services: "services",
  areas: "areas",
  experience: "experience",
  capacity: "capacity",
  documents: "documents",
  review: "review",
  verification: "review",
};

export default async function ProfessionalOnboardingPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const user = await requireProfessionalUser();
  const params = await searchParams;
  const selectedStep = typeof params.step === "string" ? params.step : undefined;
  const step = professionalOnboardingSteps.find((item) => item.key === selectedStep)?.key ?? "company";
  const success = typeof params.success === "string" ? params.success : undefined;
  const error = typeof params.error === "string" ? params.error : undefined;
  const [professional, services] = await Promise.all([getOwnProfessionalDetail(user.professional.id), getAdminServices()]);
  if (!professional) notFound();

  const activeServiceIds = new Set(professional.serviceLinks.filter((service) => service.active).map((service) => service.service.id));
  const availableServices = services.filter((service) => service.active);
  const previousStep = getPreviousOnboardingStep(step);
  const applicableDocumentRequirements = professional.documentRequirements.filter((requirement) => requirement.service_id === null || activeServiceIds.size > 0);
  const uploadedDocumentTypes = new Set(professional.documents
    .filter((document) => !document.archived_at && ["pending", "approved"].includes(document.verification_status))
    .map((document) => document.document_type));
  const documentRequirements = [...new Map(applicableDocumentRequirements
    .filter((requirement) => requirement.requirement_level === "required")
    .map((requirement) => [requirement.document_type, requirement])).values()];
  const missingRequiredDocuments = documentRequirements.filter((requirement) => !uploadedDocumentTypes.has(requirement.document_type));
  const recommendedDocuments = [...new Map(applicableDocumentRequirements
    .filter((requirement) => requirement.requirement_level === "recommended")
    .map((requirement) => [requirement.document_type, requirement])).values()]
    .filter((requirement) => !documentRequirements.some((required) => required.document_type === requirement.document_type));

  return (
    <div className="space-y-6">
      <PageHeader title="Onboarding vakman" description="Rond je profiel af voor verificatie, distributie en documentreview." />
      {success ? <p role="status" className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-success">{success}</p> : null}
      {error ? <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-danger">{error}</p> : null}
      {professional.verification_status === "changes_requested" || professional.onboarding_status === "changes_requested" ? (
        <Card role="alert" className="space-y-3 border-amber-300 bg-amber-50">
          <h2 className="font-semibold">Aanpassingen gevraagd</h2>
          <p className="text-sm">{professional.verification_status_reason ?? "Bekijk de feedback en pas de genoemde onderdelen aan."}</p>
          {professional.reviewFeedback.filter((feedback) => feedback.status === "open").map((feedback) => (
            <div key={feedback.id} className="flex flex-wrap items-start justify-between gap-3 border-t border-amber-200 pt-3">
              <p className="min-w-0 flex-1 text-sm"><strong>{feedback.section.replaceAll("_", " ")}:</strong> {feedback.message}</p>
              <Link href={`/vakman/onboarding?step=${reviewSectionStep[feedback.section]}`} className="text-sm font-medium text-primary underline underline-offset-4">Dit onderdeel aanpassen</Link>
            </div>
          ))}
        </Card>
      ) : null}

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge value={professional.onboarding_status} label={`Profiel: ${professionalOnboardingStatusLabels[professional.onboarding_status]}`} />
          <StatusBadge value={professional.verification_status} label={`Verificatie: ${professionalVerificationStatusLabels[professional.verification_status]}`} />
          <p className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium">Kwaliteit {professional.quality_score}/100 ({professional.qualityLabel})</p>
          <p className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium">Voortgang {professional.onboarding_completion}%</p>
        </div>
        <p className="text-sm text-muted-foreground">{professionalStatusDescriptions[professional.verification_status]}</p>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {professionalOnboardingSteps.map((item, index) => (
            <Link key={item.key} href={`/vakman/onboarding?step=${item.key}`} aria-current={item.key === step ? "step" : undefined} className={`min-w-0 rounded-2xl border px-4 py-3 text-sm ${item.key === step ? "border-primary bg-primary/5" : "border-border"}`}>
              <p className="font-medium">{index + 1}. {item.title}</p>
              <p className="text-muted-foreground">{item.description}</p>
              <p className={`mt-2 text-xs font-medium ${professional.missingSteps.includes(item.key) ? "text-amber-800" : "text-success"}`}>{professional.missingSteps.includes(item.key) ? "Nog nodig" : "Compleet"}</p>
            </Link>
          ))}
        </div>
        <div className="border-t pt-3">
          <p className="font-medium">Indienen voor beoordeling</p>
          {professional.missingSteps.length ? (
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {professional.missingSteps.map((missingStep) => {
                const missingStepInfo = professionalOnboardingSteps.find((item) => item.key === missingStep);
                return <li key={missingStep}><Link className="text-primary underline underline-offset-4" href={`/vakman/onboarding?step=${missingStep}`}>{missingStepInfo?.title ?? missingStep}: aanvullen</Link></li>;
              })}
            </ul>
          ) : <p className="mt-1 text-sm text-success">Alle onderdelen voor indiening zijn ingevuld.</p>}
        </div>
      </Card>

      {step === "company" ? (
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Bedrijfsgegevens</h2>
          <OnboardingAutosaveForm action={saveProfessionalOnboardingStepAction}>
            <input type="hidden" name="step" value="company" />
            <input type="hidden" name="next_step" value="contact" />
            <input type="hidden" name="autosave" value="true" />
            <div className="grid gap-4 md:grid-cols-2">
              <FormField id="company_name" label="Bedrijfsnaam"><Input id="company_name" name="company_name" defaultValue={professional.company_name} required /></FormField>
              <FormField id="trade_name" label="Handelsnaam"><Input id="trade_name" name="trade_name" defaultValue={professional.trade_name ?? ""} /></FormField>
              <FormField id="identity_type" label="Bedrijfstype"><Select id="identity_type" name="identity_type" defaultValue={professional.identity_type ?? "zzp"}>{professionalIdentityTypeValues.map((value) => <option key={value} value={value}>{value}</option>)}</Select></FormField>
              <FormField id="kvk_number" label="KvK-nummer"><Input id="kvk_number" name="kvk_number" defaultValue={professional.kvk_number ?? ""} required /></FormField>
              <FormField id="btw_number" label="Btw-nummer"><Input id="btw_number" name="btw_number" defaultValue={professional.btw_number ?? ""} /></FormField>
              <FormField id="address_line_1" label="Adres"><Input id="address_line_1" name="address_line_1" defaultValue={professional.address_line_1 ?? ""} required /></FormField>
              <FormField id="address_line_2" label="Adresregel 2"><Input id="address_line_2" name="address_line_2" defaultValue={professional.address_line_2 ?? ""} /></FormField>
              <FormField id="postal_code" label="Postcode"><Input id="postal_code" name="postal_code" defaultValue={professional.postal_code ?? ""} required /></FormField>
              <FormField id="city" label="Plaats"><Input id="city" name="city" defaultValue={professional.city ?? ""} required /></FormField>
              <FormField id="province" label="Provincie"><Input id="province" name="province" defaultValue={professional.province ?? ""} required /></FormField>
            </div>
            <div className="flex gap-3"><SubmitButton pendingLabel="Opslaan...">Opslaan en verder</SubmitButton></div>
          </OnboardingAutosaveForm>
        </Card>
      ) : null}

      {step === "contact" ? (
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Contact</h2>
          <OnboardingAutosaveForm action={saveProfessionalOnboardingStepAction}>
            <input type="hidden" name="step" value="contact" />
            <input type="hidden" name="next_step" value="services" />
            <input type="hidden" name="autosave" value="true" />
            <div className="grid gap-4 md:grid-cols-2">
              <FormField id="contact_name" label="Contactpersoon"><Input id="contact_name" name="contact_name" defaultValue={professional.contact_name} required /></FormField>
              <FormField id="phone" label="Telefoon"><Input id="phone" name="phone" defaultValue={professional.phone} required /></FormField>
              <FormField id="website" label="Website"><Input id="website" name="website" type="url" defaultValue={professional.website ?? ""} placeholder="https://" /></FormField>
              <FormField id="email_readonly" label="E-mail"><Input id="email_readonly" value={professional.email} disabled /></FormField>
            </div>
            <div className="flex gap-3"><Link href={`/vakman/onboarding?step=${previousStep}`} className="rounded-full border px-4 py-2 text-sm">Vorige</Link><SubmitButton pendingLabel="Opslaan...">Opslaan en verder</SubmitButton></div>
          </OnboardingAutosaveForm>
        </Card>
      ) : null}

      {step === "services" ? (
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Diensten</h2>
          <OnboardingAutosaveForm action={saveProfessionalOnboardingStepAction}>
            <input type="hidden" name="step" value="services" />
            <input type="hidden" name="next_step" value="areas" />
            <input type="hidden" name="autosave" value="true" />
            <div className="space-y-4">
              {availableServices.map((service) => {
                const current = professional.serviceLinks.find((item) => item.service.id === service.id);
                return (
                  <div key={service.id} className="rounded-2xl border p-4">
                    <label className="flex items-center gap-3 text-sm font-medium">
                      <input type="checkbox" name="service_id" value={service.id} defaultChecked={activeServiceIds.has(service.id)} />
                      <span>{service.name}</span>
                    </label>
                    <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      <FormField id={`service_years_${service.id}`} label="Jaren ervaring"><Input id={`service_years_${service.id}`} name={`service_years_${service.id}`} type="number" min={0} max={80} defaultValue={current?.yearsExperience ?? 0} /></FormField>
                      <FormField id={`service_lead_type_${service.id}`} label="Leadtype"><Select id={`service_lead_type_${service.id}`} name={`service_lead_type_${service.id}`} defaultValue={current?.preferredLeadType ?? ""}><option value="">Geen voorkeur</option>{leadCommercialTypeValues.map((value) => <option key={value} value={value}>{value}</option>)}</Select></FormField>
                      <FormField id={`service_specialization_${service.id}`} label="Specialisatie"><Input id={`service_specialization_${service.id}`} name={`service_specialization_${service.id}`} defaultValue={current?.specializationSummary ?? ""} maxLength={280} /></FormField>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-3"><Link href={`/vakman/onboarding?step=${previousStep}`} className="rounded-full border px-4 py-2 text-sm">Vorige</Link><SubmitButton pendingLabel="Opslaan...">Opslaan en verder</SubmitButton></div>
          </OnboardingAutosaveForm>
        </Card>
      ) : null}

      {step === "areas" ? (
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Werkgebieden</h2>
          <form action={updateOwnProfessionalAreaAction} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <input type="hidden" name="redirect_to" value="/vakman/onboarding?step=areas" />
            <FormField id="postal_code_prefix" label="Postcode4"><Input id="postal_code_prefix" name="postal_code_prefix" pattern="[1-9][0-9]{3}" required /></FormField>
            <FormField id="city" label="Stad"><Input id="city" name="city" /></FormField>
            <FormField id="province" label="Provincie"><Input id="province" name="province" /></FormField>
            <FormField id="radius_km" label="Straal km"><Input id="radius_km" name="radius_km" type="number" min={1} max={100} /></FormField>
            <div className="md:col-span-4"><SubmitButton pendingLabel="Werkgebied opslaan...">Werkgebied toevoegen</SubmitButton></div>
          </form>
          <div className="space-y-2">
            {professional.areaLinks.map((area) => (
              <form key={area.id} action={removeOwnProfessionalAreaAction} className="flex items-center justify-between rounded-2xl bg-surface-muted px-4 py-3 text-sm">
                <input type="hidden" name="area_id" value={area.id} />
                <input type="hidden" name="redirect_to" value="/vakman/onboarding?step=areas" />
                <span>{area.postalCodePrefix}{area.city ? ` · ${area.city}` : ""}{area.province ? ` · ${area.province}` : ""}{area.radiusKm ? ` · ${area.radiusKm} km` : ""}</span>
                <SubmitButton variant="ghost" pendingLabel="...">Verwijderen</SubmitButton>
              </form>
            ))}
            {!professional.areaLinks.length ? <p className="text-sm text-muted-foreground">Nog geen werkgebieden toegevoegd.</p> : null}
          </div>
          <div className="flex flex-wrap gap-3"><Link href={`/vakman/onboarding?step=${previousStep}`} className="rounded-full border px-4 py-2 text-sm">Vorige</Link><Link href="/vakman/onboarding?step=experience" className="rounded-full bg-primary px-4 py-2 text-sm text-white">Verder naar ervaring</Link></div>
        </Card>
      ) : null}

      {step === "experience" ? (
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Ervaring</h2>
          <OnboardingAutosaveForm action={saveProfessionalOnboardingStepAction}>
            <input type="hidden" name="step" value="experience" />
            <input type="hidden" name="next_step" value="capacity" />
            <input type="hidden" name="autosave" value="true" />
            <div className="grid gap-4 md:grid-cols-2">
              <FormField id="years_experience" label="Jaren ervaring"><Input id="years_experience" name="years_experience" type="number" min={0} max={80} defaultValue={professional.years_experience ?? 0} /></FormField>
              <FormField id="team_size" label="Teamgrootte"><Input id="team_size" name="team_size" type="number" min={1} max={500} defaultValue={professional.team_size ?? 1} /></FormField>
              <FormField id="specialties" label="Specialiteiten" description="Komma-gescheiden"><Input id="specialties" name="specialties" defaultValue={professional.specialties.join(", ")} /></FormField>
            </div>
            <FormField id="description" label="Omschrijving"><Textarea id="description" name="description" defaultValue={professional.description ?? ""} maxLength={2000} /></FormField>
            <div className="flex gap-3"><Link href={`/vakman/onboarding?step=${previousStep}`} className="rounded-full border px-4 py-2 text-sm">Vorige</Link><SubmitButton pendingLabel="Opslaan...">Opslaan en verder</SubmitButton></div>
          </OnboardingAutosaveForm>
        </Card>
      ) : null}

      {step === "capacity" ? (
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Beschikbaarheid & capaciteit</h2>
          <OnboardingAutosaveForm action={saveProfessionalOnboardingStepAction}>
            <input type="hidden" name="step" value="capacity" />
            <input type="hidden" name="next_step" value="documents" />
            <input type="hidden" name="autosave" value="true" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <FormField id="max_open_offers" label="Max open offers"><Input id="max_open_offers" name="max_open_offers" type="number" min={1} max={50} defaultValue={professional.distributionSettings?.max_open_offers ?? 5} /></FormField>
              <FormField id="max_active_assignments" label="Max actieve opdrachten"><Input id="max_active_assignments" name="max_active_assignments" type="number" min={1} max={200} defaultValue={professional.distributionSettings?.max_active_assignments ?? 12} /></FormField>
              <FormField id="availability_status" label="Beschikbaarheid"><Select id="availability_status" name="availability_status" defaultValue={professional.distributionSettings?.availability_status ?? "available"}>{professionalAvailabilityStatusValues.map((value) => <option key={value} value={value}>{professionalAvailabilityStatusLabels[value]}</option>)}</Select></FormField>
              <FormField id="available_from" label="Beschikbaar vanaf"><Input id="available_from" name="available_from" type="datetime-local" defaultValue={professional.distributionSettings?.available_from?.slice(0, 16) ?? ""} /></FormField>
              <FormField id="unavailable_until" label="Onbeschikbaar tot"><Input id="unavailable_until" name="unavailable_until" type="datetime-local" defaultValue={professional.distributionSettings?.unavailable_until?.slice(0, 16) ?? ""} /></FormField>
              <FormField id="pause_until" label="Pauze tot"><Input id="pause_until" name="pause_until" type="datetime-local" defaultValue={professional.distributionSettings?.pause_until?.slice(0, 16) ?? ""} /></FormField>
            </div>
            <label className="flex items-center gap-3 text-sm"><input type="checkbox" name="paused" defaultChecked={professional.distributionSettings?.paused ?? false} /> Tijdelijk pauzeren (je ontvangt dan geen nieuwe aanbiedingen)</label>
            <div className="space-y-2 text-sm">
              <p className="font-medium">Leadtypevoorkeur</p>
              <label className="flex items-center gap-2"><input type="checkbox" name="preferred_lead_types" value="shared" defaultChecked={(professional.distributionSettings?.preferred_lead_types ?? []).includes("shared")} /> Shared</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="preferred_lead_types" value="exclusive" defaultChecked={(professional.distributionSettings?.preferred_lead_types ?? []).includes("exclusive")} /> Exclusive</label>
            </div>
            <div className="flex gap-3"><Link href={`/vakman/onboarding?step=${previousStep}`} className="rounded-full border px-4 py-2 text-sm">Vorige</Link><SubmitButton pendingLabel="Opslaan...">Opslaan en verder</SubmitButton></div>
          </OnboardingAutosaveForm>
        </Card>
      ) : null}

      {step === "documents" ? (
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Documenten</h2>
          <div className="space-y-3 border-b pb-4">
            <h3 className="font-medium">Vereist voor indiening</h3>
            {missingRequiredDocuments.length ? (
              <ul className="space-y-2">
                {missingRequiredDocuments.map((requirement) => (
                  <li key={requirement.id} className="flex flex-wrap items-start justify-between gap-3 rounded-xl bg-amber-50 p-3 text-sm">
                    <div><p className="font-medium">{requirement.display_name || professionalDocumentTypeLabels[requirement.document_type]} · Nog nodig</p>{requirement.description ? <p className="text-muted-foreground">{requirement.description}</p> : null}</div>
                    <Link href="#document-upload" className="text-primary underline underline-offset-4">Document toevoegen</Link>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-success">Alle vereiste documenten zijn geüpload.</p>}
            {recommendedDocuments.filter((requirement) => !uploadedDocumentTypes.has(requirement.document_type)).length ? (
              <div>
                <p className="text-sm font-medium">Aanbevolen, niet verplicht</p>
                <ul className="mt-1 list-disc pl-5 text-sm text-muted-foreground">
                  {recommendedDocuments.filter((requirement) => !uploadedDocumentTypes.has(requirement.document_type)).map((requirement) => <li key={requirement.id}>{requirement.display_name || professionalDocumentTypeLabels[requirement.document_type]}</li>)}
                </ul>
              </div>
            ) : null}
          </div>
          <form id="document-upload" action={uploadProfessionalDocumentAction} className="grid gap-4 sm:grid-cols-2">
            <input type="hidden" name="redirect_to" value="/vakman/onboarding?step=documents" />
            <FormField id="document_type" label="Documenttype"><Select id="document_type" name="document_type" defaultValue="kvk_extract">{professionalDocumentTypeValues.map((value) => <option key={value} value={value}>{professionalDocumentTypeLabels[value]}</option>)}</Select></FormField>
            <FormField id="expires_at" label="Verloopt op" description="Vul dit alleen in als het document een vervaldatum heeft."><Input id="expires_at" name="expires_at" type="datetime-local" /></FormField>
            <FormField id="file" label="Bestand" description="PDF, JPG of PNG; maximaal 10 MB."><Input id="file" name="file" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" required /></FormField>
            <p className="text-sm text-muted-foreground sm:col-span-2">Documenten worden privé bewaard voor beoordeling en zijn niet openbaar zichtbaar.</p>
            <div className="sm:col-span-2"><SubmitButton pendingLabel="Uploaden...">Document uploaden</SubmitButton></div>
          </form>
          <div className="space-y-3">
            {professional.documents.map((document) => (
              <div key={document.id} className="rounded-2xl bg-surface-muted px-4 py-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2"><StatusBadge value={document.verification_status} label={professionalDocumentStatusLabels[document.verification_status]} /><span className="font-medium">{professionalDocumentTypeLabels[document.document_type]}</span><span className="text-xs text-muted-foreground">{professional.documentRequirements.some((requirement) => requirement.document_type === document.document_type && requirement.requirement_level === "required") ? "Vereist" : professional.documentRequirements.some((requirement) => requirement.document_type === document.document_type && requirement.requirement_level === "recommended") ? "Aanbevolen" : "Optioneel"}</span></div>
                    <p className="break-words text-muted-foreground">{document.original_filename} · {formatFileSize(document.file_size)} · Geüpload {formatDate(document.uploaded_at)}</p>
                    {document.expires_at ? <p className={`text-sm ${document.verification_status === "expired" ? "text-danger" : "text-muted-foreground"}`}>{document.verification_status === "expired" ? "Verlopen op" : "Verloopt op"} {formatDate(document.expires_at)}{document.verification_status === "expired" ? "; upload een nieuwe versie." : ""}</p> : null}
                    {document.rejection_reason ? <p className="text-danger">{document.rejection_reason}</p> : null}
                  </div>
                  {document.verification_status !== "approved" ? (
                    <form action={deleteProfessionalDocumentAction}>
                      <input type="hidden" name="document_id" value={document.id} />
                      <input type="hidden" name="redirect_to" value="/vakman/onboarding?step=documents" />
                      <SubmitButton variant="ghost" pendingLabel="...">Verwijderen</SubmitButton>
                    </form>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3"><Link href={`/vakman/onboarding?step=${previousStep}`} className="rounded-full border px-4 py-2 text-sm">Vorige</Link><Link href="/vakman/onboarding?step=review" className="rounded-full bg-primary px-4 py-2 text-sm text-white">Verder naar controle</Link></div>
        </Card>
      ) : null}

      {step === "review" ? (
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Controle & verzenden</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-surface-muted p-4 text-sm"><p className="font-medium">Onboarding</p><StatusBadge value={professional.onboarding_status} label={professionalOnboardingStatusLabels[professional.onboarding_status]} /></div>
            <div className="rounded-2xl bg-surface-muted p-4 text-sm"><p className="font-medium">Verificatie</p><StatusBadge value={professional.verification_status} label={professionalVerificationStatusLabels[professional.verification_status]} /></div>
            <div className="rounded-2xl bg-surface-muted p-4 text-sm"><p className="font-medium">Kwaliteit</p><p>{professional.quality_score}/100 ({professional.qualityLabel})</p></div>
            <div className="rounded-2xl bg-surface-muted p-4 text-sm"><p className="font-medium">Nieuwe aanvragen</p><p>{professional.distributionReadiness.eligible ? "Profiel gereed voor passende aanvragen" : "Voorwaarden nog niet vervuld"}</p></div>
          </div>
          <p className="text-sm text-muted-foreground">Je profiel wordt door VakConnect beoordeeld; er kunnen aanpassingen worden gevraagd. Beoordeling of verificatie is geen kwaliteitsgarantie.</p>
          <ProfessionalQualitySummary score={professional.quality_score} label={professional.qualityLabel} breakdown={professional.qualityBreakdown} missingSteps={professional.missingSteps} />
          <div>
            <p className="font-medium">Ontbrekende stappen</p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              {professional.missingSteps.length ? professional.missingSteps.map((missingStep) => <li key={missingStep}>{professionalOnboardingSteps.find((item) => item.key === missingStep)?.title ?? missingStep}</li>) : <li>Geen ontbrekende stappen.</li>}
            </ul>
          </div>
          {!!professional.reviewFeedback.length && (
            <div>
              <p className="font-medium">Reviewfeedback</p>
              <div className="space-y-2">{professional.reviewFeedback.map((feedback) => <div key={feedback.id} className="rounded-2xl border px-4 py-3 text-sm"><p className="font-medium">{feedback.section.replaceAll("_", " ")}</p><p>{feedback.message}</p></div>)}</div>
            </div>
          )}
          <form action={submitProfessionalOnboardingAction} className="flex gap-3">
            <input type="hidden" name="redirect_to" value="/vakman" />
            <Link href={`/vakman/onboarding?step=${previousStep}`} className="rounded-full border px-4 py-2 text-sm">Vorige</Link>
            <SubmitButton pendingLabel="Indienen..." disabled={!professional.canSubmit}>Profiel indienen voor beoordeling</SubmitButton>
          </form>
          <div className="rounded-xl bg-surface-muted p-3 text-sm text-muted-foreground">
            <p>VakConnect beoordeelt je profiel en kan om aanpassingen vragen. Verificatie bevestigt alleen de beoordeling van aangeleverde informatie en garandeert geen kwaliteit of opdracht.</p>
            {professional.distributionReadiness.reasons.length ? <ul className="mt-2 list-disc space-y-1 pl-5">{professional.distributionReadiness.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul> : null}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
