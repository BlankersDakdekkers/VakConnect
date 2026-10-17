import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  createPricingExperimentAction,
  recordPricingExperimentDecisionAction,
  transitionPricingExperimentAction,
} from "@/lib/experiments/pricing-actions";
import { getAdminPricingExperiments } from "@/lib/experiments/pricing-report";
import { requireAdminUser } from "@/lib/auth/helpers";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { pricingDecisionValues, pricingPrimaryMetrics } from "@/lib/validation";

export const dynamic = "force-dynamic";

const metricLabels: Record<(typeof pricingPrimaryMetrics)[number], string> = {
  offer_to_purchase_rate: "Aanbod → aankoop",
  purchase_to_reached_rate: "Aankoop → bereikt",
  purchase_to_appointment_rate: "Aankoop → afspraak (matured)",
  purchase_to_won_rate: "Aankoop → gewonnen (matured)",
  net_credits_per_offer: "Netto credits per aanbod",
  net_credits_per_purchase: "Netto credits per aankoop",
  matured_credits_per_won: "Matured credits per gewonnen lead",
};

const decisionLabels: Record<(typeof pricingDecisionValues)[number], string> = {
  keep_control: "Control behouden",
  adopt_later: "Variant later apart beoordelen",
  inconclusive: "Onvoldoende uitsluitsel",
  stop: "Stoppen",
};

const transitions: Record<string, Array<{ status: string; label: string }>> = {
  draft: [{ status: "active", label: "Activeer handmatig" }],
  active: [{ status: "paused", label: "Pauzeren" }, { status: "completed", label: "Completeren" }],
  paused: [{ status: "active", label: "Hervatten" }, { status: "completed", label: "Completeren" }],
  completed: [{ status: "archived", label: "Archiveren" }],
};

function displayPercent(value: number | null) {
  return value === null ? "—" : `${value.toFixed(1)}%`;
}

function displayCredits(value: number | null) {
  return value === null ? "—" : `${value.toFixed(1)} credits`;
}

function segmentDescription(config: unknown, serviceNames: Map<string, string>) {
  if (!config || typeof config !== "object" || Array.isArray(config)) return "Segmentconfiguratie niet beschikbaar";
  const root = config as Record<string, unknown>;
  const segment = root.segment && typeof root.segment === "object" && !Array.isArray(root.segment)
    ? root.segment as Record<string, unknown>
    : {};
  const details: string[] = [];
  if (Array.isArray(segment.service_ids)) {
    const names = segment.service_ids.map((id) => serviceNames.get(String(id)) ?? "Dienst onbekend");
    if (names.length) details.push(`Dienst: ${names.join(", ")}`);
  }
  if (Array.isArray(segment.commercial_types)) {
    details.push(`Type: ${segment.commercial_types.map((value) => value === "exclusive" ? "exclusief" : "gedeeld").join(", ")}`);
  }
  if (segment.control_price_min || segment.control_price_max) {
    details.push(`Controlprijs: ${String(segment.control_price_min ?? 1)}–${String(segment.control_price_max ?? 100)} credits`);
  }
  if (root.pilot_mode === true) details.push("Pilot allowlist");
  return details.length ? details.join(" · ") : "Alle actieve diensten en commerciële typen";
}

export default async function AdminPricingExperimentsPage({
  searchParams,
}: Readonly<{ searchParams: Promise<Record<string, string | string[] | undefined>> }>) {
  await requireAdminUser();
  const [query, data, servicesResult] = await Promise.all([
    searchParams,
    getAdminPricingExperiments(),
    createAdminSupabaseClient().from("services").select("id,name").eq("active", true).order("name"),
  ]);
  const success = typeof query.success === "string" ? query.success : null;
  const error = typeof query.error === "string" ? query.error : null;
  const serviceNames = new Map((servicesResult.data ?? []).map((service) => [service.id, service.name]));
  const reconciliationOk = data.reconciliation.checked && data.reconciliation.consistent;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pricingexperimenten"
        description="Handmatige tests met creditprijzen. Er is geen automatische winnaar, prijswijziging of uitrol."
      />
      <p><Link href="/admin/experimenten" className="text-sm text-primary underline">← CRO-experimenten</Link></p>
      {success ? <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-success">{success}</p> : null}
      {error ? <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-danger">{error}</p> : null}
      <Card className="space-y-2">
        <h2 className="font-semibold">Financiële reconciliatie · laatste 90 dagen</h2>
        {!data.reconciliation.checked
          ? <p className="text-sm text-muted-foreground">Er zijn nog geen pricingexperimenten om te reconciliëren.</p>
          : reconciliationOk
          ? <p className="text-sm text-muted-foreground">Ledger, purchases en wallets sluiten op elkaar aan. Outcomepercentages zijn pas vanaf 10 aankopen zichtbaar; beslissteekproef: minimaal 30 toewijzingen én 30 aankopen per variant.</p>
          : <p role="alert" className="text-sm text-amber-800">Reconciliatie wijkt af ({data.reconciliation.issues.reduce((sum, issue) => sum + issue.count, 0)} signalen). Toon alleen aantallen; trek geen pricingconclusies.</p>}
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold">Nieuw pricingexperiment · concept</h2>
        <p className="text-sm text-muted-foreground">Concepten zijn nooit automatisch actief. De normale prijs blijft de control; maximaal ±25% verschil, minimaal 1 en maximaal 100 credits.</p>
        <form action={createPricingExperimentAction} className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm">
            <span>Naam</span>
            <input name="name" required minLength={2} maxLength={120} className="h-11 rounded-xl border border-border bg-background px-3" />
          </label>
          <label className="grid gap-1 text-sm">
            <span>Primary metric</span>
            <select name="primary_metric" required className="h-11 rounded-xl border border-border bg-background px-3">
              {pricingPrimaryMetrics.map((metric) => <option key={metric} value={metric}>{metricLabels[metric]}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-sm md:col-span-2">
            <span>Beschrijving</span>
            <textarea name="description" required minLength={3} maxLength={1000} rows={3} className="rounded-xl border border-border bg-background px-3 py-2" />
          </label>
          <label className="grid gap-1 text-sm">
            <span>Diensten (meerdere selecteren met Ctrl/Cmd)</span>
            <select name="service_ids" multiple size={5} className="rounded-xl border border-border bg-background px-3 py-2">
              {(servicesResult.data ?? []).map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}
            </select>
            <span className="text-xs text-muted-foreground">Leeg betekent alle actieve diensten.</span>
          </label>
          <div className="grid content-start gap-3">
            <label className="grid gap-1 text-sm">
              <span>Leadtype</span>
              <select name="commercial_types" className="h-11 rounded-xl border border-border bg-background px-3">
                <option value="all">Gedeeld en exclusief</option>
                <option value="shared">Alleen gedeeld</option>
                <option value="exclusive">Alleen exclusief</option>
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1 text-sm">
                <span>Controlprijs vanaf</span>
                <input type="number" name="control_price_min" min={1} max={100} className="h-11 rounded-xl border border-border bg-background px-3" />
              </label>
              <label className="grid gap-1 text-sm">
                <span>Controlprijs t/m</span>
                <input type="number" name="control_price_max" min={1} max={100} className="h-11 rounded-xl border border-border bg-background px-3" />
              </label>
            </div>
          </div>
          <label className="grid gap-1 text-sm md:col-span-2">
            <span>Pilot allowlist · professional-ID’s</span>
            <textarea name="pilot_professional_ids" rows={2} maxLength={800} placeholder="UUID’s gescheiden door komma’s of regels; leeg = geen pilotbeperking" className="rounded-xl border border-border bg-background px-3 py-2" />
            <span className="text-xs text-muted-foreground">Geen namen, e-mailadressen of andere persoonsgegevens.</span>
          </label>
          <div className="grid gap-3 sm:grid-cols-3 md:col-span-2">
            <label className="grid gap-1 text-sm">
              <span>Controlallocatie (%)</span>
              <input type="number" name="control_weight" min={1} max={99} defaultValue={50} className="h-11 rounded-xl border border-border bg-background px-3" />
            </label>
            <label className="grid gap-1 text-sm">
              <span>Variantallocatie (%)</span>
              <input type="number" name="variant_weight" min={1} max={99} defaultValue={50} className="h-11 rounded-xl border border-border bg-background px-3" />
            </label>
            <label className="grid gap-1 text-sm">
              <span>Variantprijs (credits)</span>
              <input type="number" name="variant_price_credits" min={1} max={100} required className="h-11 rounded-xl border border-border bg-background px-3" />
            </label>
          </div>
          <div className="md:col-span-2">
            <SubmitButton pendingLabel="Concept opslaan...">Concept opslaan</SubmitButton>
          </div>
        </form>
      </Card>

      {data.experiments.length ? data.experiments.map((experiment) => (
        <Card key={experiment.id} className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">{experiment.name}</h2>
              <p className="text-sm text-muted-foreground">{experiment.description} · {segmentDescription(experiment.pricing_config, serviceNames)}</p>
            </div>
            <span className="rounded-full border px-3 py-1 text-xs">{experiment.status}</span>
          </div>
          <p className="text-sm">Primary metric: {experiment.primary_metric ? metricLabels[experiment.primary_metric as (typeof pricingPrimaryMetrics)[number]] : "—"} · allocatie en variantprijzen worden na activering vergrendeld.</p>
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-left text-sm">
              <thead className="text-muted-foreground">
                <tr><th scope="col" className="py-2">Variant</th><th scope="col">Prijs</th><th scope="col">Allocatie</th><th scope="col">Toewijzingen</th><th scope="col">Aankopen</th><th scope="col">Primary metric</th><th scope="col">Refund</th><th scope="col">Mismatch</th><th scope="col">Bereikt</th><th scope="col">Netto</th><th scope="col">Matured won</th></tr>
              </thead>
              <tbody>
                {experiment.variants.map((variant) => {
                  const primaryMetric = experiment.primary_metric as (typeof pricingPrimaryMetrics)[number] | null;
                  const metricIsRate = primaryMetric?.endsWith("_rate");
                  const value = variant.primaryMetric;
                  return (
                    <tr key={variant.id} className="border-t align-top">
                      <th scope="row" className="py-3 font-medium">{variant.label}{variant.is_control ? " · control" : ""}</th>
                      <td>{variant.is_control ? "Normale prijs" : `${variant.price_credits} credits`}</td>
                      <td>{variant.weight}%</td>
                      <td>{variant.assignedOffers}</td>
                      <td>{variant.all.purchases}</td>
                      <td>{!reconciliationOk ? "Geen conclusie" : value === null ? "Onvoldoende data" : metricIsRate ? `${value.toFixed(1)}%` : displayCredits(value)}</td>
                      <td>{reconciliationOk ? displayPercent(variant.all.refund.percent) : "—"}</td>
                      <td>{reconciliationOk ? displayPercent(variant.all.mismatch.percent) : "—"}</td>
                      <td>{reconciliationOk ? displayPercent(variant.all.reached.percent) : "—"}</td>
                      <td>{reconciliationOk ? displayCredits(variant.all.finance?.net ?? null) : "—"}</td>
                      <td>{reconciliationOk ? `${variant.matured.won.count}/${variant.matured.won.denominator}` : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {experiment.variants.map((variant) => (
            <div key={`${variant.id}-warnings`} className="space-y-1 text-sm">
              {variant.lowSample ? <p role="status" className="text-amber-800">{variant.label}: lage steekproef (percentages vanaf n≥10).</p> : null}
              {variant.guardrailWarnings.map((warning) => <p key={warning} role="status" className="text-amber-800">{variant.label}: {warning}.</p>)}
            </div>
          ))}
          {!experiment.variants.every((variant) => variant.decisionSampleReady) ? <p className="text-sm text-muted-foreground">Beslisdrempel nog niet gehaald: minimaal 30 toewijzingen én 30 aankopen per variant. Geen statistische significantieclaim.</p> : null}
          {experiment.variants.some((variant) => variant.all.purchases > 0 && variant.matured.purchases < variant.all.purchases)
            ? <p className="text-sm text-muted-foreground">Outcomepercentages gebruiken alleen de Prompt 30 maturity-window van 28 dagen; recente open aankopen worden niet als verlies geteld.</p>
            : null}
          {experiment.variants.some((variant) => variant.guardrailWarnings.length > 0)
            ? <p role="alert" className="text-sm text-amber-800">Controleer kwaliteits- en refundsignalen handmatig voordat je een beslissing vastlegt.</p>
            : null}

          {(transitions[experiment.status] ?? []).length ? (
            <div className="flex flex-wrap gap-2 border-t pt-4">
              {transitions[experiment.status].map((transition) => (
                <form key={transition.status} action={transitionPricingExperimentAction}>
                  <input type="hidden" name="experiment_id" value={experiment.id} />
                  <input type="hidden" name="next_status" value={transition.status} />
                  <SubmitButton pendingLabel="Bijwerken...">{transition.label}</SubmitButton>
                </form>
              ))}
            </div>
          ) : null}

          {["paused", "completed", "archived"].includes(experiment.status) ? (
            <details className="border-t pt-4">
              <summary className="cursor-pointer font-medium">Handmatige beslissing vastleggen</summary>
              <form action={recordPricingExperimentDecisionAction} className="mt-3 grid gap-3 sm:grid-cols-2">
                <input type="hidden" name="experiment_id" value={experiment.id} />
                <label className="grid gap-1 text-sm">
                  <span>Beslissing</span>
                  <select name="decision" className="h-11 rounded-xl border border-border bg-background px-3">
                    {pricingDecisionValues.map((decision) => <option key={decision} value={decision}>{decisionLabels[decision]}</option>)}
                  </select>
                </label>
                <label className="grid gap-1 text-sm sm:col-span-2">
                  <span>Notitie</span>
                  <textarea name="note" required minLength={3} maxLength={1000} rows={3} className="rounded-xl border border-border bg-background px-3 py-2" />
                </label>
                <div className="sm:col-span-2"><SubmitButton pendingLabel="Opslaan...">Beslissing opslaan</SubmitButton></div>
              </form>
              {experiment.decisions.length ? (
                <ul className="mt-3 space-y-2 text-sm">
                  {experiment.decisions.map((decision) => (
                    <li key={decision.id} className="border-t pt-2">
                      {decisionLabels[decision.decision as (typeof pricingDecisionValues)[number]]} · {decision.note} · {new Date(decision.created_at).toLocaleString("nl-NL")}
                    </li>
                  ))}
                </ul>
              ) : <p className="mt-3 text-sm text-muted-foreground">Nog geen handmatige beslissing.</p>}
              <p className="mt-2 text-xs text-muted-foreground">Een beslissing noteert uitsluitend de evaluatie en wijzigt de standaardprijs niet.</p>
            </details>
          ) : null}
        </Card>
      )) : (
        <Card role="status"><p>Er zijn nog geen pricingexperimenten. Een nieuw concept wordt nooit automatisch geactiveerd.</p></Card>
      )}
    </div>
  );
}
