import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { SubmitButton } from "@/components/ui/submit-button";
import { transitionExperimentStatusAction } from "@/lib/experiments/actions";
import { getAdminExperimentDetail } from "@/lib/experiments/admin";
import { isValidExperimentConfiguration, type ExperimentVariant } from "@/lib/experiments/targeting";

export const dynamic = "force-dynamic";

function percent(value: number | null) {
  return value === null ? "—" : `${value.toFixed(1)}%`;
}

const nextStatuses: Record<string, Array<{ value: string; label: string }>> = {
  draft: [{ value: "active", label: "Activeer handmatig" }],
  active: [{ value: "paused", label: "Pauzeren" }, { value: "completed", label: "Completeren" }],
  paused: [{ value: "active", label: "Hervatten" }, { value: "completed", label: "Completeren" }],
  completed: [{ value: "archived", label: "Archiveren" }],
};

export default async function AdminExperimentDetailPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const range = query.range === "7d" ? "7d" : "lifetime";
  const success = typeof query.success === "string" ? query.success : undefined;
  const error = typeof query.error === "string" ? query.error : undefined;
  const experiment = await getAdminExperimentDetail(id, range);
  if (!experiment) notFound();

  const variants = experiment.variants as ExperimentVariant[];
  const targetRules = experiment.target_rules && typeof experiment.target_rules === "object" && !Array.isArray(experiment.target_rules)
    ? experiment.target_rules as Record<string, unknown>
    : {};
  const activatable = isValidExperimentConfiguration({
    targetType: experiment.target_type,
    slot: experiment.slot,
    targetRules,
    goalEvent: experiment.goal_event,
    variants,
  });
  const transitions = nextStatuses[experiment.status] ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title={experiment.name} description={`${experiment.key} · ${experiment.target_type} · slot ${experiment.slot}`} />
      <p><Link href="/admin/experimenten" className="text-sm text-primary hover:underline">← Alle experimenten</Link></p>
      {success ? <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-success">{success}</p> : null}
      {error ? <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-danger">{error}</p> : null}

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Status: {experiment.status}</h2>
          <div className="flex gap-2 text-sm">
            <Link href={`/admin/experimenten/${id}?range=7d`} aria-current={range === "7d" ? "page" : undefined} className="rounded-full border px-3 py-2">7 dagen</Link>
            <Link href={`/admin/experimenten/${id}?range=lifetime`} aria-current={range === "lifetime" ? "page" : undefined} className="rounded-full border px-3 py-2">Sinds start</Link>
          </div>
        </div>
        <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div><dt className="text-muted-foreground">Doel</dt><dd>{experiment.goal_event}</dd></div>
          <div><dt className="text-muted-foreground">Targetregels</dt><dd>{JSON.stringify(targetRules)}</dd></div>
          <div><dt className="text-muted-foreground">Startdatum</dt><dd>{experiment.started_at ? new Date(experiment.started_at).toLocaleString("nl-NL") : "Niet gestart"}</dd></div>
          <div><dt className="text-muted-foreground">Einddatum</dt><dd>{experiment.ended_at ? new Date(experiment.ended_at).toLocaleString("nl-NL") : "—"}</dd></div>
        </dl>
        {transitions.length ? (
          <div className="flex flex-wrap gap-3 border-t pt-4">
            {transitions.map((transition) => (
              <form key={transition.value} action={transitionExperimentStatusAction}>
                <input type="hidden" name="experiment_id" value={experiment.id} />
                <input type="hidden" name="next_status" value={transition.value} />
                <SubmitButton pendingLabel="Bijwerken..." disabled={transition.value === "active" && !activatable}>{transition.label}</SubmitButton>
              </form>
            ))}
          </div>
        ) : null}
        {experiment.status === "draft" && !activatable ? <p role="alert" className="text-sm text-amber-800">Activering geblokkeerd: controle, twee varianten, totaalgewicht 100, geldig target en eventmapping zijn vereist.</p> : null}
        <p className="text-xs text-muted-foreground">Pauzeren valt direct terug op de productie-control. Voltooide varianten worden niet automatisch uitgerold. Een permanente wijziging vereist een aparte codewijziging.</p>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold">Copypreview · alleen admin · niet gemeten</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {variants.map((variant) => (
            <div key={variant.id} className="space-y-2 rounded-xl border p-4">
              <p className="text-sm font-medium">{variant.label}{variant.is_control ? " (control)" : ""}</p>
              <div className="min-h-12">
                {experiment.slot.includes("cta") ? (
                  <span className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
                    {variant.label}
                  </span>
                ) : (
                  <p aria-label="Voortgangsvoorbeeld">Stap 2 van 7{variant.is_control ? "" : " — Vertel wat er moet gebeuren"}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Preview blijft binnen de afgeschermde adminroute; deze weergave verstuurt geen exposure- of CTA-events.</p>
      </Card>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold">Statusgeschiedenis</h2>
        {experiment.auditLog.length ? (
          <ul className="space-y-2 text-sm">
            {experiment.auditLog.map((entry, index) => (
              <li key={`${entry.created_at}-${index}`} className="border-t pt-2">
                {entry.previous_status} → {entry.next_status} · {new Date(entry.created_at).toLocaleString("nl-NL")} · actor {entry.actor_user_id ?? "onbekend"}
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-muted-foreground">Nog geen statuswijzigingen.</p>}
      </Card>

      <Card className="space-y-4">
        <PageHeader title="Variantresultaten" description={`Events ${range === "7d" ? "in de laatste 7 dagen" : "sinds de start"}. De cijfers zijn beschrijvend; ze kiezen of markeren geen winnaar.`} />
        {experiment.eventSampleLimited ? <p role="status" className="text-sm text-amber-800">Rapportage is begrensd tot 5.000 events; aantallen kunnen onvolledig zijn.</p> : null}
        {!experiment.analyticsAvailable ? <p role="status" className="text-sm text-amber-800">Analytics-events zijn niet beschikbaar; de configuratie en statusgeschiedenis blijven zichtbaar.</p> : null}
        <div className="overflow-x-auto">
          <table className="min-w-[850px] w-full text-left text-sm">
            <thead className="text-muted-foreground">
              <tr><th className="py-2">Variant</th><th>Allocatie</th><th>Exposures</th><th>CTA-clicksessies</th><th>CTR</th><th>Funnelstarts</th><th>Inzendingen</th><th>Conversie</th><th>Verschil t.o.v. control</th></tr>
            </thead>
            <tbody>
              {experiment.performance.map((variant) => (
                <tr key={variant.id} className="border-t align-top">
                  <th scope="row" className="py-3 font-medium">{variant.label}{variant.is_control ? " (control)" : ""}</th>
                  <td>{variant.weight}%</td><td>{variant.exposures}</td><td>{variant.ctaClicks}</td><td>{percent(variant.ctaCtr)}</td>
                  <td>{variant.funnelStarts}</td><td>{variant.leads}</td><td>{percent(variant.goalRate)}</td>
                  <td>{variant.differenceFromControl === null ? "—" : `${variant.differenceFromControl > 0 ? "+" : ""}${variant.differenceFromControl.toFixed(1)} pp`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-2">
          {experiment.performance.map((variant) => variant.warnings.length ? (
            <p key={variant.id} className="text-sm text-amber-800">{variant.label}: lage steekproef — {variant.warnings.join(", ")}.</p>
          ) : null)}
          <p className="text-xs text-muted-foreground">Inzendingen tellen alleen serverbevestigde lead_submitted-events; attribution sluit events aan op anonieme sessie-ID’s. Dit zijn geen significantietoetsen.</p>
        </div>
        <div className="space-y-2 border-t pt-4">
          <h3 className="font-semibold">Exposures per variant en apparaat</h3>
          <div className="overflow-x-auto">
            <table className="min-w-[860px] w-full text-left text-sm">
              <thead className="text-muted-foreground"><tr><th className="py-2">Variant</th><th>Apparaat</th><th>Exposures</th><th>CTA-clicksessies</th><th>Funnelstarts</th><th>Leads</th><th>Conversie</th><th>Steekproef</th></tr></thead>
              <tbody>
                {experiment.performance.flatMap((variant) => variant.deviceRows.map((row) => (
                  <tr key={`${variant.id}:${row.device}`} className="border-t">
                    <th scope="row" className="py-2 font-medium">{variant.label}</th><td>{row.device}</td><td>{row.exposures}</td>
                    <td>{row.ctaClicks}</td><td>{row.funnelStarts}</td><td>{row.leads}</td><td>{percent(row.leadConversionRate)}</td>
                    <td>{row.lowSample ? "Laag (<50)" : "Beschrijvend"}</td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}
