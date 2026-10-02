import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { getAdminAnalyticsDashboard } from "@/lib/analytics/queries";

type AnalyticsRange = 7 | 28;

function percentage(value: number | null) {
  return value === null ? "—" : `${value.toFixed(1)}%`;
}

function Metric({ label, value, detail }: Readonly<{ label: string; value: string | number; detail?: string }>) {
  return (
    <Card className="space-y-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl font-semibold tracking-tight">{value}</p>
      {detail ? <p className="text-xs text-muted-foreground">{detail}</p> : null}
    </Card>
  );
}

function insightsFor(report: Awaited<ReturnType<typeof getAdminAnalyticsDashboard>>) {
  const insights: string[] = [];
  const lowCompletion = report.funnelRows.find((step) => step.viewed >= 20 && step.completionRate !== null && step.completionRate < 50);
  if (lowCompletion) insights.push(`Stap ${lowCompletion.step} wordt relatief weinig afgerond (${percentage(lowCompletion.completionRate)}).`);
  const highErrorStep = report.funnelRows.find((step) => step.errors >= 5);
  if (highErrorStep) insights.push(`Bij stap ${highErrorStep.step} zijn ${highErrorStep.errors} validatiefouten geregistreerd.`);
  const lowClickPage = report.localRows.find((page) => page.views >= 20 && page.ctaClicks < 2);
  if (lowClickPage) insights.push(`${lowClickPage.route} heeft ${lowClickPage.views} weergaven en ${lowClickPage.ctaClicks} CTA-klikken.`);
  return insights;
}

export default async function AdminAnalyticsPage({
  searchParams,
}: Readonly<{ searchParams: Promise<Record<string, string | string[] | undefined>> }>) {
  const params = await searchParams;
  const range: AnalyticsRange = params.range === "28d" ? 28 : 7;
  const requestedLocalPage = Number(Array.isArray(params.localPage) ? params.localPage[0] : params.localPage);
  const localPage = Number.isSafeInteger(requestedLocalPage) && requestedLocalPage > 0 ? requestedLocalPage : 1;
  const analytics = await getAdminAnalyticsDashboard(range);
  const insights = insightsFor(analytics);
  const localPageSize = 20;
  const localPageCount = Math.max(1, Math.ceil(analytics.localRows.length / localPageSize));
  const currentLocalPage = Math.min(localPage, localPageCount);
  const paginatedLocalRows = analytics.localRows.slice((currentLocalPage - 1) * localPageSize, currentLocalPage * localPageSize);

  return (
    <div className="space-y-6">
      <PageHeader title="Conversie-analytics" description="Gedrag en opgeslagen aanvragen. Rapportagevensters zijn rollend en gebruiken UTC." />

      <nav aria-label="Periode" className="flex gap-2 text-sm">
        {[7, 28].map((days) => (
          <Link
            key={days}
            href={`/admin/analytics?range=${days}d`}
            aria-current={range === days ? "page" : undefined}
            className={`rounded-full border px-4 py-2 ${range === days ? "border-primary bg-primary text-primary-foreground" : "hover:bg-surface-muted"}`}
          >
            Laatste {days} dagen
          </Link>
        ))}
      </nav>

      {!analytics.dataAvailable ? (
        <Card role="status" className="space-y-2">
          <h2 className="font-semibold">Analytics-events niet beschikbaar</h2>
          <p className="text-sm text-muted-foreground">Gedragsdata kon niet worden gelezen. Opgeslagen aanvragen hieronder komen rechtstreeks uit de database.</p>
        </Card>
      ) : null}
      {analytics.sampleLimited ? (
        <Card role="status" className="text-sm text-muted-foreground">
          Detailrapporten zijn begrensd tot de nieuwste 5.000 events en aanvragen in dit venster; totalen voor opgeslagen aanvragen blijven database-aantallen.
        </Card>
      ) : null}

      <section aria-label="Kerncijfers" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Metric label="Paginaweergaven" value={analytics.pageViews} />
        <Metric label="CTA-klikken" value={analytics.ctaClicks} />
        <Metric label="Aanvraagstarts" value={analytics.funnelStarts} detail="Unieke anonieme ID’s met een zichtbare eerste stap; ID blijft in localStorage" />
        <Metric label="Opgeslagen aanvragen" value={analytics.storedLeads} detail="Databasebron van waarheid" />
        <Metric
          label="Waargenomen start → inzending"
          value={percentage(analytics.funnelStarts ? Math.round((analytics.convertedSessions / analytics.funnelStarts) * 1000) / 10 : null)}
          detail={`${analytics.convertedSessions} unieke anonieme ID’s met start én serverbevestigde inzending`}
        />
        <Metric label="Contactinzendingen" value={analytics.contacts} detail="Databasebron van waarheid; inhoud wordt niet getoond" />
      </section>

      {analytics.eventCount === 0 && analytics.storedLeads === 0 ? (
        <Card role="status">
          <h2 className="font-semibold">Nog geen analyticsdata</h2>
          <p className="mt-2 text-sm text-muted-foreground">Er zijn in deze periode geen events of opgeslagen aanvragen. Er worden geen voorbeeldcijfers getoond.</p>
        </Card>
      ) : null}

      <Card className="space-y-4">
        <PageHeader title="Dienstprestaties" description="Paginaverkeer en CTA’s komen uit events; opgeslagen aanvragen tellen uit de database." />
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full text-left text-sm">
            <thead className="text-muted-foreground">
              <tr><th className="py-2">Dienst</th><th>Paginaweergaven</th><th>CTA-klikken</th><th>Starts</th><th>Opgeslagen aanvragen</th><th>Waargenomen conversie</th></tr>
            </thead>
            <tbody>
              {analytics.serviceRows.map((service) => (
                <tr key={service.slug} className="border-t">
                  <th scope="row" className="py-3 font-medium">{service.service}</th>
                  <td>{service.pageViews}</td><td>{service.ctaClicks}</td><td>{service.funnelStarts}</td><td>{service.submissions}</td>
                  <td>{service.lowSample ? <span title="Minder dan 20 starts">Lage steekproef (&lt;20 starts)</span> : percentage(service.conversionRate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!analytics.serviceRows.length ? <p className="text-sm text-muted-foreground">Geen servicedata voor deze periode.</p> : null}
        </div>
      </Card>

      <Card className="space-y-4">
        <PageHeader title="Lokale pagina’s" description="Service-/plaatscombinaties; weergaven, CTA-klikken en starts uit analytics-events." />
        <div className="overflow-x-auto">
          <table className="min-w-[680px] w-full text-left text-sm">
            <thead className="text-muted-foreground">
              <tr><th className="py-2">Route</th><th>Plaats</th><th>Dienst</th><th>Weergaven</th><th>CTA-klikken</th><th>Starts</th><th>Inzendingen</th></tr>
            </thead>
            <tbody>
              {paginatedLocalRows.map((page) => (
                <tr key={page.route} className="border-t">
                  <th scope="row" className="py-3 font-medium"><Link href={page.route} className="text-primary underline-offset-2 hover:underline">{page.route}</Link></th>
                  <td>{page.city || "—"}</td><td>{page.service || "—"}</td><td>{page.views}</td><td>{page.ctaClicks}</td><td>{page.starts}</td><td>{page.submissions}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!analytics.localRows.length ? <p className="text-sm text-muted-foreground">Geen lokale paginadata voor deze periode.</p> : null}
        </div>
        {localPageCount > 1 ? (
          <nav aria-label="Lokale paginarapporten" className="flex items-center justify-between gap-3 text-sm">
            <Link
              href={`/admin/analytics?range=${range}d&localPage=${Math.max(1, currentLocalPage - 1)}`}
              aria-disabled={currentLocalPage === 1}
              className={currentLocalPage === 1 ? "pointer-events-none text-muted-foreground" : "text-primary hover:underline"}
            >
              Vorige
            </Link>
            <span aria-live="polite">Pagina {currentLocalPage} van {localPageCount}</span>
            <Link
              href={`/admin/analytics?range=${range}d&localPage=${Math.min(localPageCount, currentLocalPage + 1)}`}
              aria-disabled={currentLocalPage === localPageCount}
              className={currentLocalPage === localPageCount ? "pointer-events-none text-muted-foreground" : "text-primary hover:underline"}
            >
              Volgende
            </Link>
          </nav>
        ) : null}
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="space-y-4">
          <PageHeader title="CTA-prestaties" description="Kliks en sessies die daarna een aanvraag startten; CTA-impressies worden niet gemeten." />
          <div className="overflow-x-auto">
            <table className="min-w-[520px] w-full text-left text-sm">
              <thead className="text-muted-foreground"><tr><th className="py-2">CTA key</th><th>Locatie</th><th>Kliks</th><th>Starts</th><th>Serverbevestigde sessies</th></tr></thead>
              <tbody>
                {analytics.ctaRows.map((cta) => (
                  <tr key={`${cta.ctaId}:${cta.location}`} className="border-t">
                    <th scope="row" className="py-2 font-medium">{cta.ctaId}</th><td>{cta.location}</td><td>{cta.clicks}</td><td>{cta.startedSessions}</td><td>{cta.submittedSessions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!analytics.ctaRows.length ? <p className="text-sm text-muted-foreground">Geen CTA-klikken in deze periode.</p> : null}
          </div>
        </Card>

        <Card className="space-y-4">
          <PageHeader title="UTM-prestaties" description="Alleen sessies met ten minste één UTM-dimensie; click-ID’s worden niet als dimensie getoond." />
          <div className="overflow-x-auto">
            <table className="min-w-[520px] w-full text-left text-sm">
              <thead className="text-muted-foreground"><tr><th className="py-2">Source</th><th>Medium</th><th>Campaign</th><th>Starts</th><th>Serverbevestigde sessies</th></tr></thead>
              <tbody>
                {analytics.utmRows.map((utm) => (
                  <tr key={`${utm.source}:${utm.medium}:${utm.campaign}`} className="border-t">
                    <th scope="row" className="py-2 font-medium">{utm.source}</th><td>{utm.medium}</td><td>{utm.campaign}</td><td>{utm.starts}</td><td>{utm.submissions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!analytics.utmRows.length ? <p className="text-sm text-muted-foreground">Geen UTM-sessies in deze periode.</p> : null}
          </div>
        </Card>
      </div>

      <Card className="space-y-4">
        <PageHeader title="Aanvraagstappen" description="Drop-off is het aandeel bekeken stappen zonder een completion-event voor dezelfde stap." />
        <div className="overflow-x-auto">
          <table className="min-w-[620px] w-full text-left text-sm">
            <thead className="text-muted-foreground">
              <tr><th className="py-2">Stap</th><th>Bekeken</th><th>Afgerond</th><th>Completion</th><th>Drop-off</th><th>Validatiefouten</th><th>Duur-buckets</th></tr>
            </thead>
            <tbody>
              {analytics.funnelRows.map((step) => (
                <tr key={step.step} className="border-t">
                  <th scope="row" className="py-3 font-medium">{step.step}</th><td>{step.viewed}</td><td>{step.completed}</td>
                  <td>{percentage(step.completionRate)}</td><td>{percentage(step.dropOffRate)}</td><td>{step.errors}</td>
                  <td>{Object.entries(step.durationBuckets).map(([bucket, count]) => `${bucket}: ${count}`).join(", ") || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {[["Apparaat", analytics.deviceRows], ["Kanaal", analytics.channelRows]].map(([heading, rows]) => (
          <Card key={heading as string} className="space-y-3">
            <h2 className="text-lg font-semibold">{heading as string}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-[320px] w-full text-left text-sm">
                <thead className="text-muted-foreground"><tr><th className="py-2">Groep</th><th>Starts</th><th>Serverbevestigde sessies</th></tr></thead>
                <tbody>
                  {(rows as Array<{ device?: string; channel?: string; starts: number; submissions: number }>).map((row) => (
                    <tr key={row.device ?? row.channel} className="border-t">
                      <th scope="row" className="py-2 font-medium">{row.device ?? row.channel}</th><td>{row.starts}</td><td>{row.submissions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!rows.length ? <p className="text-sm text-muted-foreground">Geen segmentdata beschikbaar.</p> : null}
            </div>
          </Card>
        ))}
      </div>

      <Card className="space-y-3">
        <PageHeader title="Datakwaliteit en aandachtspunten" description="Regels beschrijven patronen; ze adviseren of wijzigen niets automatisch." />
        <p className="text-sm text-muted-foreground">
          Database-aanvragen: {analytics.storedLeads} · serverbevestigde lead-events: {analytics.observedSubmissions} · verschil: {analytics.reconciliationDifference}.
          Events van geblokkeerde clients kunnen ontbreken. Dienst-conversie en start→inzendingsratio tellen unieke anonieme ID’s met start én serverbevestigd event, geen tijdgebonden bezoeken; opgeslagen leads blijven een apart database-aantal.
        </p>
        {analytics.serviceRows.some((service) => service.lowSample) ? <p className="text-sm text-amber-800">Dienstpercentages met minder dan 20 starts worden niet als rate getoond.</p> : null}
        {insights.length ? <ul className="list-disc space-y-1 pl-5 text-sm">{insights.map((insight) => <li key={insight}>{insight}</li>)}</ul> : <p className="text-sm text-muted-foreground">Geen patroon met voldoende volume volgens de huidige regels.</p>}
      </Card>
    </div>
  );
}
