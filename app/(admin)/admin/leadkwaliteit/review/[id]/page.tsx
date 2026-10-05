import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { QualityReviewSignals } from "@/components/admin/quality-review-signals";
import { QualityReviewForm } from "@/components/admin/quality-review-form";
import { QualityReviewEvidence, reviewTimestamp } from "@/components/admin/quality-review-evidence";
import { getAdminLeadQualityDetail } from "@/lib/leads/review-queries";
import { updateLeadQualityReviewAction } from "@/lib/leads/review-actions";
import { reviewStatusLabels } from "@/lib/leads/review-taxonomy";

export const dynamic = "force-dynamic";
export default async function QualityReviewDetailPage({ params, searchParams }: {
  params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const detail = await getAdminLeadQualityDetail(id);
  if (!detail) notFound();
  const messages = await searchParams;
  return <div className="min-w-0 space-y-6 [contain:inline-size]">
    <section className="rounded-3xl border bg-surface p-5">
      <Link className="text-sm underline" href="/admin/leadkwaliteit/review">← Naar werklijst</Link>
      <div className="mt-4"><PageHeader title={`Kwaliteitsreview · ${detail.lead.reference || id}`} description="Onderzoek en administratieve afhandeling, los van productstatus en vakmanuitkomsten." /></div>
      {typeof messages.error === "string" && <p role="alert" className="mt-3 rounded-xl border p-3 text-sm">{messages.error} <Link className="underline" href={`/admin/leadkwaliteit/review/${id}`}>Vernieuw dossier</Link></p>}
      {typeof messages.success === "string" && <p role="status" className="mt-3 rounded-xl border p-3 text-sm">{messages.success}</p>}
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div><dt className="text-muted-foreground">Aangevraagde dienst</dt><dd>{detail.lead.service_name || "Onbekend"}</dd></div>
        <div><dt className="text-muted-foreground">Reviewstatus</dt><dd>{reviewStatusLabels[detail.item.status]}</dd></div>
        <div><dt className="text-muted-foreground">Aangemaakt</dt><dd>{reviewTimestamp(detail.lead.created_at)}</dd></div>
        <div><dt className="text-muted-foreground">Huidige afhandeling vastgelegd op</dt><dd>{reviewTimestamp(detail.item.resolved_at)}</dd><p className="mt-1 text-xs text-muted-foreground">Het door de database vastgelegde afhandeltijdstip is leidend. Een nieuwe status of afhandelreden vernieuwt dit tijdstip; alleen een notitie niet. Bij heropenen vervalt de huidige afhandeling, maar de auditgeschiedenis blijft behouden.</p></div>
        <div><dt className="text-muted-foreground">Bron / type</dt><dd>{detail.lead.source} · {detail.lead.type === "exclusive" ? "Exclusief" : detail.lead.type === "shared" ? "Gedeeld" : "Onbekend"}</dd></div>
        <div><dt className="text-muted-foreground">Regio</dt><dd>Onbekend: onvoldoende betrouwbare locatieherkomst.</dd></div>
        <div><dt className="text-muted-foreground">Gematchte dienst</dt><dd>Geen afzonderlijk betrouwbaar vastgelegde gematchte dienst; niet afgeleid uit de aangevraagde dienst.</dd></div>
      </dl>
      <div className="mt-4"><QualityReviewSignals item={detail.item} /></div>
      <p className="mt-3 text-sm text-muted-foreground">Signalen vragen om onderzoek, niet om een automatisch oordeel. Conflicterende feedback en financiële conflicten blijven zichtbaar; onafhankelijke vakmanuitkomsten worden niet samengevoegd.</p>
      <details className="mt-4 rounded-xl border p-3"><summary className="cursor-pointer text-sm font-medium">Klantcontact of intake bewust openen</summary><p className="mt-2 text-sm text-muted-foreground">Het bestaande, geautoriseerde leaddossier bevat contactgegevens en intake. Open dit alleen wanneer nodig voor dit onderzoek.</p><Link className="mt-3 inline-block text-sm text-primary underline" href={`/admin/leads/${id}`}>Open bestaand leaddossier met klantgegevens</Link></details>
    </section>
    <QualityReviewEvidence detail={detail} />
    <section className="rounded-3xl border bg-surface p-5">
      <h2 className="text-lg font-semibold">Review behandelen</h2>
      <p className="mb-4 mt-2 text-sm text-muted-foreground">Status, reden en toegevoegde notitie worden met jouw ingelogde beheerderidentiteit vastgelegd. Een gelijktijdige wijziging blokkeert opslaan; vernieuw dan eerst het dossier.</p>
      <QualityReviewForm key={`${detail.item.updated_at}-${detail.item.status}`} leadId={id} updatedAt={detail.item.updated_at} currentStatus={detail.item.status} action={updateLeadQualityReviewAction} />
    </section>
  </div>;
}
