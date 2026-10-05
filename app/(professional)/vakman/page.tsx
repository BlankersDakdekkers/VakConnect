import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { ProfessionalQualitySummary } from "@/components/professional/quality-summary";
import { formatCredits } from "@/lib/commercial/labels";
import { getProfessionalWalletOverview } from "@/lib/commercial/queries";
import { requireProfessionalUser } from "@/lib/auth/helpers";
import { getProfessionalDashboardStats } from "@/lib/leads/queries";
import { isDistributionPauseActive } from "@/lib/distribution/scoring";
import { getProfessionalActivationChecklist, getProfessionalActivationStage, getProfessionalBlockerRecovery, getProfessionalNextBestAction, getProfessionalReviewFeedbackHref } from "@/lib/professionals/activation";
import { getOwnProfessionalDetail } from "@/lib/professionals/queries";
import { professionalAvailabilityStatusLabels, professionalOnboardingStatusLabels, professionalVerificationStatusLabels } from "@/lib/professionals/labels";
import { getProfessionalNotifications } from "@/lib/notifications/queries";

function notificationHref(eventType: string, leadId: string | null) {
  if (eventType.startsWith("lead_") && leadId) return `/vakman/aanvragen/${leadId}`;
  if (eventType.startsWith("lead_offer") || eventType === "lead_assignment_created") return "/vakman/aanvragen";
  if (eventType.startsWith("document")) return "/vakman/onboarding?step=documents";
  if (eventType === "changes_requested" || eventType.startsWith("verification")) return "/vakman/onboarding?step=review";
  return "/vakman/notificaties";
}

export default async function ProfessionalDashboardPage() {
  const user = await requireProfessionalUser();
  const [stats, wallet, professional, notificationPage] = await Promise.all([
    getProfessionalDashboardStats(user.professional.id),
    getProfessionalWalletOverview(user.professional.id),
    getOwnProfessionalDetail(user.professional.id),
    getProfessionalNotifications(user.professional.id, 1),
  ]);

  if (!professional) {
    return null;
  }

  const nextAction = getProfessionalNextBestAction(professional);
  const activationStage = getProfessionalActivationStage(professional);
  const activationChecklist = getProfessionalActivationChecklist(professional);
  const attentionNotifications = notificationPage.items.filter((notification) =>
    !notification.read_at && [
      "changes_requested",
      "verification_rejected",
      "verification_suspended",
      "document_expiring",
      "document_expired",
      "document_rejected",
      "lead_offer_received",
      "lead_offer_expiring",
      "lead_assignment_created",
      "operational_alert",
    ].includes(notification.event_type),
  ).slice(0, 3);
  const availability = professional.distributionSettings?.availability_status ?? "available";
  const pauseActive = isDistributionPauseActive(professional.distributionSettings?.paused ?? false, professional.distributionSettings?.pause_until ?? null);
  const pauseUntil = professional.distributionSettings?.pause_until ? new Date(professional.distributionSettings.pause_until) : null;
  const availabilityLabel = pauseActive
    ? "Tijdelijk gepauzeerd"
    : professionalAvailabilityStatusLabels[availability];

  return (
    <div className="space-y-6">
      <PageHeader title="Overzicht" description={`Je profiel, beschikbaarheid en aanvragen op één plek. Activatiefase: ${activationStage.label}.`} />

      <Card className="border-primary/20 bg-primary/[0.03]">
        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div className="min-w-0 space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Belangrijkste vervolgstap</p>
            <h2 className="text-xl font-semibold tracking-tight">{nextAction.label}</h2>
            <p className="text-sm text-muted-foreground">{nextAction.description}</p>
            <div className="flex flex-wrap gap-2">
              <StatusBadge value={professional.onboarding_status} label={`Profiel: ${professionalOnboardingStatusLabels[professional.onboarding_status]}`} />
              <StatusBadge value={professional.verification_status} label={`Verificatie: ${professionalVerificationStatusLabels[professional.verification_status]}`} />
              <StatusBadge value={professional.distributionReadiness.eligible ? "available" : "limited"} label={professional.distributionReadiness.eligible ? "Profiel gereed voor passende aanbiedingen" : "Nieuwe aanbiedingen tijdelijk niet beschikbaar"} />
            </div>
          </div>
          <Link href={nextAction.href} className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            {nextAction.label}
          </Link>
        </div>
      </Card>

      {professional.verification_status === "changes_requested" || professional.onboarding_status === "changes_requested" ? (
        <Card className="border-amber-300 bg-amber-50">
          <h2 className="font-semibold">Aanpassingen gevraagd</h2>
          <p className="mt-1 text-sm text-muted-foreground">{professional.verification_status_reason ?? "Bekijk de reviewfeedback en pas de genoemde onderdelen aan."}</p>
          {professional.reviewFeedback.filter((item) => item.status === "open").map((item) => (
            <div key={item.id} className="mt-3 flex flex-wrap items-start justify-between gap-3 border-t border-amber-200 pt-3">
              <p className="min-w-0 flex-1 text-sm"><strong>{item.section.replaceAll("_", " ")}:</strong> {item.message}</p>
              <Link href={getProfessionalReviewFeedbackHref(item.section)} className="text-sm font-medium text-primary underline underline-offset-4">Aanpassen</Link>
            </div>
          ))}
        </Card>
      ) : null}

      {attentionNotifications.length ? (
        <Card className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold tracking-tight">Notificaties die aandacht vragen</h2>
            <Link href="/vakman/notificaties" className="text-sm font-medium text-primary underline underline-offset-4">Alle notificaties</Link>
          </div>
          <ul className="divide-y">
            {attentionNotifications.map((notification) => {
              const title = typeof notification.payload.title === "string" ? notification.payload.title : notification.event_type.replaceAll("_", " ");
              const description = typeof notification.payload.description === "string" ? notification.payload.description : "Bekijk deze update voor je account.";
              return (
                <li key={notification.id} className="flex flex-wrap items-start justify-between gap-2 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="font-medium">{title} <span className="sr-only">(ongelezen)</span></p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                  <Link href={notificationHref(notification.event_type, notification.lead_id)} className="shrink-0 text-sm font-medium text-primary underline underline-offset-4">Bekijk actie</Link>
                </li>
              );
            })}
          </ul>
        </Card>
      ) : null}

      {!professional.distributionReadiness.eligible ? (
        <Card className="space-y-3 border-amber-300 bg-amber-50">
          <h2 className="text-lg font-semibold tracking-tight">Waarom ontvang ik nog geen aanvragen?</h2>
          <ul className="space-y-2 text-sm">
            {professional.distributionReadiness.reasons.map((reason) => {
              const recovery = getProfessionalBlockerRecovery(reason);
              return (
                <li key={reason} className="flex flex-wrap items-start justify-between gap-2">
                  <span className="min-w-0 flex-1">{reason}</span>
                  <Link href={recovery.href} className="shrink-0 font-medium text-primary underline underline-offset-4">{recovery.label}</Link>
                </li>
              );
            })}
          </ul>
        </Card>
      ) : (
        <Card className="space-y-2">
          <h2 className="font-semibold">Je profiel is gereed voor passende aanvragen</h2>
          <p className="text-sm text-muted-foreground">
            {professional.distributionReadiness.activeOffers > 0
              ? `Er staan ${professional.distributionReadiness.activeOffers} open aanbieding(en) voor je klaar.`
              : "Er staat nu geen open aanbod voor je klaar. Aanbod hangt af van dienst, regio, beschikbaarheid, capaciteit en bestaande distributieregels."}
            {" "}Een passende aanvraag is geen garantie op een opdracht.
          </p>
        </Card>
      )}

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Je activatiechecklist</h2>
            <p className="text-sm text-muted-foreground">Gebaseerd op je huidige profiel-, verificatie- en beschikbaarheidsstatus.</p>
          </div>
          <Link href="/vakman/profiel" className="text-sm font-medium text-primary underline underline-offset-4">Profielstatus bekijken</Link>
        </div>
        <ul className="divide-y">
          {activationChecklist.map((item) => (
            <li key={item.label} className="flex flex-wrap items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <p className="font-medium">
                  {item.label} <span className="text-xs font-normal text-muted-foreground">
                    {item.status === "complete" ? "· Afgerond" : item.status === "action" ? "· Actie nodig" : item.status === "blocked" ? "· In behandeling" : "· Optioneel"}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              {item.href ? <Link href={item.href} className="shrink-0 text-sm font-medium text-primary underline underline-offset-4">Bekijk actie</Link> : null}
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">Beschikbaarheid en capaciteit</h2>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge value={pauseActive ? "paused" : availability} label={availabilityLabel} />
            {pauseActive && pauseUntil && Number.isFinite(pauseUntil.getTime()) ? <p className="text-sm text-muted-foreground">Pauze tot {pauseUntil.toLocaleString("nl-NL")}</p> : null}
          </div>
          {availability === "limited" ? <p className="text-sm text-amber-800">Je profiel ontvangt geen nieuwe aanbiedingen zolang je status beperkt is.</p> : null}
          {pauseActive ? <p className="text-sm text-muted-foreground">Je ontvangt geen nieuwe aanbiedingen zolang de pauze actief is.</p> : null}
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-muted-foreground">Open aanbiedingen</dt><dd className="font-medium">{professional.distributionReadiness.activeOffers} / {professional.distributionReadiness.maxOpenOffers}</dd></div>
            <div><dt className="text-muted-foreground">Actieve opdrachten</dt><dd className="font-medium">{professional.distributionReadiness.activeAssignments} / {professional.distributionReadiness.maxActiveAssignments}</dd></div>
          </dl>
          <Link href="/vakman/onboarding?step=capacity" className="inline-block text-sm font-medium text-primary underline underline-offset-4">Beschikbaarheid en capaciteit aanpassen</Link>
        </Card>
        <Card className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">Nieuwe passende aanvragen</h2>
          <StatusBadge value={professional.distributionReadiness.eligible ? "available" : "limited"} label={professional.distributionReadiness.eligible ? "Profiel gereed" : "Voorwaarden nog niet vervuld"} />
          <p className="text-sm text-muted-foreground">Of je een specifieke aanvraag ontvangt, hangt ook af van de actieve dienst, het werkgebied en de beschikbare capaciteit. Bestaande distributieregels zijn eveneens van toepassing; er wordt geen aantal aanvragen gegarandeerd.</p>
        </Card>
      </div>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Profielkwaliteit</h2>
            <p className="text-sm text-muted-foreground">Verbeter je profiel waar nodig; verificatie is geen kwaliteitsgarantie.</p>
          </div>
          <Link href="/vakman/profiel" className="text-sm font-medium text-primary underline underline-offset-4">Profiel bekijken</Link>
        </div>
        <ProfessionalQualitySummary score={professional.quality_score} label={professional.qualityLabel} breakdown={professional.qualityBreakdown} missingSteps={professional.missingSteps} />
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-2">
          <p className="text-sm text-muted-foreground">Creditsaldo</p>
          <p className="text-3xl font-semibold tracking-tight">{formatCredits(wallet.cachedBalance)}</p>
          <p className="text-sm text-muted-foreground">Een aankoop wordt vóór bevestiging opnieuw server-side gecontroleerd.</p>
          <Link href="/vakman/credits" className="inline-block text-sm font-medium text-primary underline underline-offset-4">Credits en transacties bekijken</Link>
        </Card>
        <Card className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">Je aanvragenoverzicht</h2>
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-wrap justify-between gap-2 border-b pb-2 last:border-0 last:pb-0">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <span className="font-semibold">{stat.value}</span>
            </div>
          ))}
          <Link href="/vakman/aanvragen" className="inline-block text-sm font-medium text-primary underline underline-offset-4">Naar aanvragen</Link>
        </Card>
      </div>
    </div>
  );
}
