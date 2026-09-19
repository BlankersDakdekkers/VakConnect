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

  return (
    <div className="space-y-6">
      <PageHeader title="Onboarding vakman" description="Rond je profiel af voor verificatie, distributie en documentreview." />
      {success ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-success">{success}</p> : null}
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-danger">{error}</p> : null}

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge value={professional.onboarding_status} />
          <StatusBadge value={professional.verification_status} />
          <p className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium">Kwaliteit {professional.quality_score}/100 ({professional.qualityLabel})</p>
          <p className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium">Voortgang {professional.onboarding_completion}%</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {professionalOnboardingSteps.map((item, index) => (
            <Link key={item.key} href={`/vakman/onboarding?step=${item.key}`} className={`rounded-2xl border px-4 py-3 text-sm ${item.key === step ? "border-primary bg-primary/5" : "border-border"}`}>
              <p className="font-medium">{index + 1}. {item.title}</p>
              <p className="text-muted-foreground">{item.description}</p>
            </Link>
          ))}
        </div>
        {professional.missingSteps.length ? <p className="text-sm text-muted-foreground">Ontbrekende stappen: {professional.missingSteps.join(", ")}</p> : null}
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
                    <div className="mt-3 grid gap-4 md:grid-cols-3">
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
          <form action={updateOwnProfessionalAreaAction} className="grid gap-4 md:grid-cols-4">
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
          <div className="flex gap-3"><Link href={`/vakman/onboarding?step=${previousStep}`} className="rounded-full border px-4 py-2 text-sm">Vorige</Link><Link href="/vakman/onboarding?step=experience" className="rounded-full bg-primary px-4 py-2 text-sm text-white">Verder naar ervaring</Link></div>
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
              <FormField id="availability_status" label="Beschikbaarheid"><Select id="availability_status" name="availability_status" defaultValue={professional.distributionSettings?.availability_status ?? "available"}>{professionalAvailabilityStatusValues.map((value) => <option key={value} value={value}>{value}</option>)}</Select></FormField>
              <FormField id="available_from" label="Beschikbaar vanaf"><Input id="available_from" name="available_from" type="datetime-local" defaultValue={professional.distributionSettings?.available_from?.slice(0, 16) ?? ""} /></FormField>
              <FormField id="unavailable_until" label="Onbeschikbaar tot"><Input id="unavailable_until" name="unavailable_until" type="datetime-local" defaultValue={professional.distributionSettings?.unavailable_until?.slice(0, 16) ?? ""} /></FormField>
              <FormField id="pause_until" label="Pauze tot"><Input id="pause_until" name="pause_until" type="datetime-local" defaultValue={professional.distributionSettings?.pause_until?.slice(0, 16) ?? ""} /></FormField>
            </div>
            <label className="flex items-center gap-3 text-sm"><input type="checkbox" name="paused" defaultChecked={professional.distributionSettings?.paused ?? false} /> Tijdelijk gepauzeerd</label>
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
          <form action={uploadProfessionalDocumentAction} className="grid gap-4 md:grid-cols-3">
            <input type="hidden" name="redirect_to" value="/vakman/onboarding?step=documents" />
            <FormField id="document_type" label="Documenttype"><Select id="document_type" name="document_type" defaultValue="kvk_extract">{professionalDocumentTypeValues.map((value) => <option key={value} value={value}>{value}</option>)}</Select></FormField>
            <FormField id="expires_at" label="Verloopt op"><Input id="expires_at" name="expires_at" type="datetime-local" /></FormField>
            <FormField id="file" label="Bestand"><Input id="file" name="file" type="file" required /></FormField>
            <div className="md:col-span-3"><SubmitButton pendingLabel="Uploaden...">Document uploaden</SubmitButton></div>
          </form>
          <div className="space-y-3">
            {professional.documents.map((document) => (
              <div key={document.id} className="rounded-2xl bg-surface-muted px-4 py-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2"><StatusBadge value={document.verification_status} /><span className="font-medium">{document.document_type}</span></div>
                    <p className="text-muted-foreground">{document.original_filename} · {formatFileSize(document.file_size)} · {formatDate(document.uploaded_at)}</p>
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
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-surface-muted p-4 text-sm"><p className="font-medium">Onboarding</p><StatusBadge value={professional.onboarding_status} /></div>
            <div className="rounded-2xl bg-surface-muted p-4 text-sm"><p className="font-medium">Verificatie</p><StatusBadge value={professional.verification_status} /></div>
            <div className="rounded-2xl bg-surface-muted p-4 text-sm"><p className="font-medium">Kwaliteit</p><p>{professional.quality_score}/100 ({professional.qualityLabel})</p></div>
            <div className="rounded-2xl bg-surface-muted p-4 text-sm"><p className="font-medium">Distributie</p><p>{professional.distributionEligible ? "Eligible" : "Nog niet eligible"}</p></div>
          </div>
          <div>
            <p className="font-medium">Ontbrekende stappen</p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              {professional.missingSteps.length ? professional.missingSteps.map((missingStep) => <li key={missingStep}>{missingStep}</li>) : <li>Geen ontbrekende stappen.</li>}
            </ul>
          </div>
          {!!professional.reviewFeedback.length && (
            <div>
              <p className="font-medium">Reviewfeedback</p>
              <div className="space-y-2">{professional.reviewFeedback.map((feedback) => <div key={feedback.id} className="rounded-2xl border px-4 py-3 text-sm"><p className="font-medium">{feedback.section}</p><p>{feedback.message}</p></div>)}</div>
            </div>
          )}
          <form action={submitProfessionalOnboardingAction} className="flex gap-3">
            <input type="hidden" name="redirect_to" value="/vakman" />
            <Link href={`/vakman/onboarding?step=${previousStep}`} className="rounded-full border px-4 py-2 text-sm">Vorige</Link>
            <SubmitButton pendingLabel="Indienen..." disabled={!professional.canSubmit}>Verzenden voor review</SubmitButton>
          </form>
        </Card>
      ) : null}
    </div>
  );
}
