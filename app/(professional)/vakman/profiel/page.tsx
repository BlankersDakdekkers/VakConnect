import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { ProfessionalQualitySummary } from "@/components/professional/quality-summary";
import { isDistributionPauseActive } from "@/lib/distribution/scoring";
import { requireProfessionalUser } from "@/lib/auth/helpers";
import { getOwnProfessionalDetail } from "@/lib/professionals/queries";
import { professionalAvailabilityStatusLabels, professionalDocumentStatusLabels, professionalDocumentTypeLabels, professionalOnboardingStatusLabels, professionalStatusDescriptions, professionalVerificationStatusLabels } from "@/lib/professionals/labels";
import { formatDate, formatFileSize } from "@/lib/utils";
import type { ProfessionalReviewSection } from "@/types/database";

const sectionStep: Record<ProfessionalReviewSection, string> = {
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

const professionalStatusLabels: Record<string, string> = {
  active: "Actief",
  inactive: "Inactief",
  suspended: "Geschorst",
};

export default async function ProfessionalProfilePage() {
  const user = await requireProfessionalUser();
  const professional = await getOwnProfessionalDetail(user.professional.id);
  if (!professional) return null;

  const applicableDocumentRequirements = professional.documentRequirements.filter((requirement) =>
    requirement.service_id === null || professional.serviceLinks.some((service) => service.active),
  );
  const requirementsByType = new Map(applicableDocumentRequirements.map((requirement) => [requirement.document_type, requirement]));
  for (const requirement of applicableDocumentRequirements) {
    if (requirement.requirement_level === "required") requirementsByType.set(requirement.document_type, requirement);
  }
  const uploadedDocumentTypes = new Set(professional.documents
    .filter((document) => !document.archived_at && ["pending", "approved"].includes(document.verification_status))
    .map((document) => document.document_type));
  const missingRequiredDocuments = [...requirementsByType.values()].filter((requirement) =>
    requirement.requirement_level === "required" && !uploadedDocumentTypes.has(requirement.document_type),
  );
  const recommendedDocumentsMissing = [...new Map(applicableDocumentRequirements
    .filter((requirement) => requirement.requirement_level === "recommended")
    .map((requirement) => [requirement.document_type, requirement])).values()]
    .filter((requirement) => requirementsByType.get(requirement.document_type)?.requirement_level !== "required")
    .filter((requirement) => !professional.documents.some((document) => !document.archived_at && document.document_type === requirement.document_type));
  const pauseActive = isDistributionPauseActive(professional.distributionSettings?.paused ?? false, professional.distributionSettings?.pause_until ?? null);

  return (
    <div className="space-y-6">
      <PageHeader title="Profiel" description="Bekijk je bedrijfsgegevens, profielkwaliteit, beoordeling en beschikbaarheid." />

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge value={professional.status} label={`Profiel: ${professionalStatusLabels[professional.status] ?? "Status onbekend"}`} />
          <StatusBadge value={professional.onboarding_status} label={`Onboarding: ${professionalOnboardingStatusLabels[professional.onboarding_status]}`} />
          <StatusBadge value={professional.verification_status} label={`Verificatie: ${professionalVerificationStatusLabels[professional.verification_status]}`} />
        </div>
        <div>
          <h2 className="font-semibold">Wat betekent je verificatiestatus?</h2>
          <p className="mt-1 text-sm text-muted-foreground">{professionalStatusDescriptions[professional.verification_status]}</p>
          <p className="mt-2 text-sm text-muted-foreground">Profiel- en documentbeoordeling betekent niet dat VakConnect de kwaliteit of uitvoering van werk garandeert.</p>
        </div>
        {professional.verification_status_reason ? <p className="rounded-xl bg-surface-muted p-3 text-sm">{professional.verification_status_reason}</p> : null}
      </Card>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Nieuwe aanvragen ontvangen</h2>
        <StatusBadge value={professional.distributionReadiness.eligible ? "available" : "limited"} label={professional.distributionReadiness.eligible ? "Profiel gereed voor passende aanvragen" : "Voorwaarden nog niet vervuld"} />
        <p className="text-sm text-muted-foreground">VakConnect biedt kansen; niet elke aanvraag wordt een opdracht. Of een specifieke aanvraag wordt aangeboden, hangt ook af van je actieve diensten, werkgebied en beschikbare capaciteit.</p>
        {professional.distributionReadiness.reasons.length ? (
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {professional.distributionReadiness.reasons.map((reason) => <li key={reason}>{reason}</li>)}
          </ul>
        ) : <p className="text-sm text-success">Je profiel voldoet aan de huidige profiel- en beschikbaarheidsvoorwaarden.</p>}
      </Card>

      {professional.verification_status === "changes_requested" || professional.onboarding_status === "changes_requested" ? (
        <Card className="space-y-3 border-amber-300 bg-amber-50">
          <h2 className="font-semibold">Aanpassingen gevraagd</h2>
          {professional.reviewFeedback.filter((feedback) => feedback.status === "open").map((feedback) => (
            <div key={feedback.id} className="flex flex-wrap items-start justify-between gap-3 border-t border-amber-200 pt-3">
              <div className="min-w-0">
                <p className="font-medium">{feedback.section.replaceAll("_", " ")}</p>
                <p className="text-sm">{feedback.message}</p>
              </div>
              <Link href={`/vakman/onboarding?step=${sectionStep[feedback.section]}`} className="text-sm font-medium text-primary underline underline-offset-4">Dit onderdeel aanpassen</Link>
            </div>
          ))}
        </Card>
      ) : null}

      <Card>
        <ProfessionalQualitySummary score={professional.quality_score} label={professional.qualityLabel} breakdown={professional.qualityBreakdown} missingSteps={professional.missingSteps} />
        <div className="mt-5 border-t pt-4">
          <h3 className="font-medium">Optionele profielinformatie</h3>
          <p className="mt-1 text-sm text-muted-foreground">Website, handelsnaam, btw-nummer, specialisatie, leadtypevoorkeur en extra werkgebiedcontext zijn niet nodig om je profiel in te dienen.</p>
          {professional.documentRequirements.some((requirement) => requirement.requirement_level === "recommended") ? (
            <p className="mt-2 text-sm text-muted-foreground">Aanbevolen documenten verbeteren je profiel, maar zijn niet vereist voor indiening.</p>
          ) : null}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold tracking-tight">Bedrijfsgegevens</h2>
            <Link href="/vakman/onboarding?step=company" className="text-sm font-medium text-primary underline underline-offset-4">Bewerken</Link>
          </div>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div><dt className="text-muted-foreground">Bedrijfsnaam</dt><dd className="font-medium">{professional.company_name}</dd></div>
            <div><dt className="text-muted-foreground">Handelsnaam</dt><dd>{professional.trade_name || "Niet ingevuld"}</dd></div>
            <div><dt className="text-muted-foreground">KvK-nummer</dt><dd>{professional.kvk_number || "Niet ingevuld"}</dd></div>
            <div><dt className="text-muted-foreground">Btw-nummer</dt><dd>{professional.btw_number || "Niet ingevuld"}</dd></div>
            <div><dt className="text-muted-foreground">Adres</dt><dd>{[professional.address_line_1, professional.postal_code, professional.city].filter(Boolean).join(", ") || "Niet ingevuld"}</dd></div>
            <div><dt className="text-muted-foreground">Contactpersoon</dt><dd>{professional.contact_name}</dd></div>
            <div><dt className="text-muted-foreground">Telefoon</dt><dd>{professional.phone}</dd></div>
            <div><dt className="text-muted-foreground">Website</dt><dd>{professional.website || "Niet ingevuld"}</dd></div>
          </dl>
        </Card>

        <Card className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold tracking-tight">Diensten</h2>
            <Link href="/vakman/onboarding?step=services" className="text-sm font-medium text-primary underline underline-offset-4">Diensten beheren</Link>
          </div>
          {professional.serviceLinks.length ? (
            <ul className="space-y-2">
              {professional.serviceLinks.map((service) => (
                <li key={service.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-surface-muted p-3 text-sm">
                  <div><p className="font-medium">{service.service.name}</p>{service.specializationSummary ? <p className="text-muted-foreground">{service.specializationSummary}</p> : null}</div>
                  <StatusBadge value={service.active ? "active" : "inactive"} label={service.active ? "Actief" : "Niet actief"} />
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-muted-foreground">Er zijn nog geen diensten geselecteerd.</p>}
          <p className="text-sm text-muted-foreground">Alleen actieve diensten kunnen voor een passende aanvraag meetellen.</p>
        </Card>

        <Card className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold tracking-tight">Werkgebieden</h2>
            <Link href="/vakman/onboarding?step=areas" className="text-sm font-medium text-primary underline underline-offset-4">Werkgebieden beheren</Link>
          </div>
          {professional.areaLinks.length ? (
            <ul className="flex flex-wrap gap-2">
              {professional.areaLinks.map((area) => <li key={area.id} className="rounded-xl bg-surface-muted px-3 py-2 text-sm">{area.postalCodePrefix}{area.city ? ` · ${area.city}` : ""}{area.province ? ` · ${area.province}` : ""}{area.radiusKm ? ` · ${area.radiusKm} km` : ""}</li>)}
            </ul>
          ) : <p className="text-sm text-muted-foreground">Voeg minimaal één postcodegebied toe om voor passende aanvragen in aanmerking te komen.</p>}
        </Card>

        <Card className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold tracking-tight">Beschikbaarheid en capaciteit</h2>
            <Link href="/vakman/onboarding?step=capacity" className="text-sm font-medium text-primary underline underline-offset-4">Instellingen aanpassen</Link>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge value={pauseActive ? "paused" : professional.distributionSettings?.availability_status ?? "available"} label={pauseActive ? "Tijdelijk gepauzeerd" : professionalAvailabilityStatusLabels[professional.distributionSettings?.availability_status ?? "available"]} />
            {pauseActive && professional.distributionSettings?.pause_until ? <span className="text-sm text-muted-foreground">Pauze tot {formatDate(professional.distributionSettings.pause_until)}</span> : null}
          </div>
          {professional.distributionSettings?.availability_status === "limited" ? <p className="text-sm text-amber-800">Nieuwe aanvragen worden niet aangeboden zolang je beschikbaarheid beperkt is.</p> : null}
          {pauseActive ? <p className="text-sm text-muted-foreground">Je ontvangt geen nieuwe aanbiedingen zolang de pauze actief is.</p> : null}
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-muted-foreground">Open aanbiedingen</dt><dd>{professional.distributionReadiness.activeOffers} / {professional.distributionReadiness.maxOpenOffers}</dd></div>
            <div><dt className="text-muted-foreground">Actieve opdrachten</dt><dd>{professional.distributionReadiness.activeAssignments} / {professional.distributionReadiness.maxActiveAssignments}</dd></div>
          </dl>
        </Card>
      </div>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold tracking-tight">Documenten</h2>
          <Link href="/vakman/onboarding?step=documents" className="text-sm font-medium text-primary underline underline-offset-4">Documenten beheren</Link>
        </div>
        <p className="text-sm text-muted-foreground">Documenten worden privé bewaard voor beoordeling en zijn niet openbaar zichtbaar.</p>
        {missingRequiredDocuments.length ? (
          <div className="rounded-xl bg-amber-50 p-3">
            <p className="font-medium">Vereiste documenten nog nodig</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {missingRequiredDocuments.map((requirement) => <li key={requirement.id}>{requirement.display_name || professionalDocumentTypeLabels[requirement.document_type]} · upload dit document om je profiel in te dienen.</li>)}
            </ul>
          </div>
        ) : null}
        {recommendedDocumentsMissing.length ? (
          <div>
            <p className="font-medium">Aanbevolen, niet verplicht</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {recommendedDocumentsMissing.map((requirement) => <li key={requirement.id}>{requirement.display_name || professionalDocumentTypeLabels[requirement.document_type]}</li>)}
            </ul>
          </div>
        ) : null}
        {professional.documents.length ? (
          <ul className="divide-y">
            {professional.documents.filter((document) => !document.archived_at).map((document) => {
              const requirement = requirementsByType.get(document.document_type);
              return (
                <li key={document.id} className="grid min-w-0 gap-2 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium">{professionalDocumentTypeLabels[document.document_type]}</h3>
                      <StatusBadge value={document.verification_status} label={professionalDocumentStatusLabels[document.verification_status]} />
                      {requirement ? <span className="text-xs text-muted-foreground">{requirement.requirement_level === "required" ? "Vereist" : "Aanbevolen"}</span> : <span className="text-xs text-muted-foreground">Optioneel</span>}
                    </div>
                    <p className="break-words text-sm text-muted-foreground">{document.original_filename} · {formatFileSize(document.file_size)} · Geüpload {formatDate(document.uploaded_at)}</p>
                    {document.expires_at ? <p className={`text-sm ${document.verification_status === "expired" ? "text-danger" : "text-muted-foreground"}`}>{document.verification_status === "expired" ? "Verlopen op" : "Verloopt op"} {formatDate(document.expires_at)}{document.verification_status === "expired" ? "; upload een nieuwe versie." : ""}</p> : null}
                    {document.rejection_reason ? <p className="text-sm text-danger">{document.rejection_reason}</p> : null}
                  </div>
                  {document.verification_status !== "approved" ? <Link href="/vakman/onboarding?step=documents" className="text-sm font-medium text-primary underline underline-offset-4">Document vervangen of beheren</Link> : null}
                </li>
              );
            })}
          </ul>
        ) : <p className="text-sm text-muted-foreground">Er zijn nog geen documenten geüpload.</p>}
      </Card>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Reviewfeedback</h2>
        {professional.reviewFeedback.length ? (
          <ul className="space-y-3">
            {professional.reviewFeedback.map((feedback) => (
              <li key={feedback.id} className="rounded-xl border p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge value={feedback.status} label={feedback.status === "open" ? "Actie nodig" : "Afgehandeld"} />
                  <span className="font-medium">{feedback.section.replaceAll("_", " ")}</span>
                </div>
                <p className="mt-2 text-sm">{feedback.message}</p>
                {feedback.status === "open" ? <Link href={`/vakman/onboarding?step=${sectionStep[feedback.section]}`} className="mt-2 inline-block text-sm font-medium text-primary underline underline-offset-4">Dit onderdeel aanpassen</Link> : null}
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-muted-foreground">Er is nog geen reviewfeedback.</p>}
      </Card>
    </div>
  );
}
