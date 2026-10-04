import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { getAdminExperiments } from "@/lib/experiments/admin";
import { experimentTargetTypes, experimentStatusValues } from "@/lib/experiments/targeting";

export const dynamic = "force-dynamic";

function safeDate(value: string | string[] | undefined) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
  return new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10) === value ? value : "";
}

export default async function AdminExperimentsPage({
  searchParams,
}: Readonly<{ searchParams: Promise<Record<string, string | string[] | undefined>> }>) {
  const params = await searchParams;
  const status = typeof params.status === "string" && experimentStatusValues.includes(params.status as (typeof experimentStatusValues)[number])
    ? params.status
    : "";
  const target = typeof params.target === "string" && experimentTargetTypes.includes(params.target as (typeof experimentTargetTypes)[number])
    ? params.target
    : "";
  const from = safeDate(params.from);
  const to = safeDate(params.to);
  const experiments = await getAdminExperiments({ status, target, from, to });

  return (
    <div className="space-y-6">
      <PageHeader title="CRO-experimenten" description="Handmatig beheerde tests. Er is geen automatische winnaarselectie of uitrol." />

      <Card>
        <form method="get" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className="grid gap-1 text-sm">
            <span>Status</span>
            <select name="status" defaultValue={status} className="h-11 rounded-xl border border-border bg-background px-3">
              <option value="">Alle statussen</option>
              {experimentStatusValues.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            <span>Vanaf</span>
            <input type="date" name="from" defaultValue={from} className="h-11 rounded-xl border border-border bg-background px-3" />
          </label>
          <label className="grid gap-1 text-sm">
            <span>Tot en met</span>
            <input type="date" name="to" defaultValue={to} className="h-11 rounded-xl border border-border bg-background px-3" />
          </label>
          <label className="grid gap-1 text-sm">
            <span>Doeltype</span>
            <select name="target" defaultValue={target} className="h-11 rounded-xl border border-border bg-background px-3">
              <option value="">Alle targets</option>
              {experimentTargetTypes.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <button type="submit" className="self-end rounded-full border px-4 py-2 text-sm hover:bg-surface-muted">Filter toepassen</button>
        </form>
      </Card>

      {experiments.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {experiments.map((experiment) => (
            <Card key={experiment.id} className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold"><Link href={`/admin/experimenten/${experiment.id}`} className="text-primary hover:underline">{experiment.name}</Link></h2>
                  <p className="text-sm text-muted-foreground">{experiment.key} · {experiment.target_type} · slot {experiment.slot}</p>
                </div>
                <span className="rounded-full border px-3 py-1 text-xs">{experiment.status}</span>
              </div>
              <dl className="grid gap-2 text-sm sm:grid-cols-2">
                <div><dt className="text-muted-foreground">Start</dt><dd>{experiment.started_at ? new Date(experiment.started_at).toLocaleDateString("nl-NL") : "Niet gestart"}</dd></div>
                <div><dt className="text-muted-foreground">Einde</dt><dd>{experiment.ended_at ? new Date(experiment.ended_at).toLocaleDateString("nl-NL") : "—"}</dd></div>
                <div><dt className="text-muted-foreground">Exposures</dt><dd>{experiment.sampleCount ?? "Niet beschikbaar"}</dd></div>
                <div><dt className="text-muted-foreground">Control</dt><dd>{experiment.variants.find((variant) => variant.is_control)?.label ?? "Ontbreekt"}</dd></div>
              </dl>
              <div className="flex flex-wrap gap-2 text-xs">
                {experiment.variants.map((variant) => (
                  <span key={variant.id} className="rounded-full bg-surface-muted px-3 py-1">
                    {variant.label} · {variant.weight}%{variant.is_control ? " · control" : ""}
                  </span>
                ))}
              </div>
              {experiment.sampleCount !== null && experiment.sampleCount < 50 ? <p className="text-sm text-amber-800">Lage steekproef: minder dan 50 exposures. Geen winnaarconclusie.</p> : null}
              {!experiment.analyticsAvailable ? <p role="status" className="text-sm text-amber-800">Analytics-events niet beschikbaar; exposureaantal is niet bekend.</p> : null}
              {experiment.sampleLimited ? <p className="text-xs text-muted-foreground">Exposuretelling begrensd tot de nieuwste 5.000 events.</p> : null}
            </Card>
          ))}
        </div>
      ) : (
        <Card role="status"><p>Geen experimenten voor deze filters.</p></Card>
      )}
    </div>
  );
}
