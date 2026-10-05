import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { requireAdminUser } from "@/lib/auth/helpers";
import { getAdminLeadQualityReport } from "@/lib/leads/quality-queries";
import { parseQualityFilters, mismatchReasons, type QualityMetric, type QualityFilters } from "@/lib/leads/quality-reporting";
import { QualityReviewSummary } from "@/components/admin/quality-review-summary";
import { getAdminLeadQualityQueue } from "@/lib/leads/review-queries";
import { parseReviewFilters } from "@/lib/leads/review-taxonomy";

export const dynamic = "force-dynamic";

const reasonLabels: Record<string, string> = {
  wrong_service: "Verkeerde dienst", wrong_region: "Verkeerde regio", incorrect_information: "Onjuiste informatie",
  already_completed: "Al uitgevoerd", duplicate: "Dubbel", unreachable: "Niet bereikbaar", invalid_contact: "Ongeldige contactgegevens",
  profile_mismatch: "Past niet bij profiel", other: "Overig",
  prijs: "Prijs", klant_niet_bereikbaar: "Klant niet bereikbaar", klant_koos_andere_partij: "Klant koos een andere partij",
  klus_uitgesteld: "Klus uitgesteld", buiten_scope: "Buiten scope", anders: "Anders",
  te_ver: "Te ver", geen_capaciteit: "Geen capaciteit", klus_past_niet: "Klus past niet", prijs_te_hoog: "Prijs te hoog", timing_past_niet: "Timing past niet",
};
const metricLabels = {
  contact: "Contact vastgelegd", reached: "Bereikt vastgelegd", unreachable: "Niet bereikbaar",
  invalidPhone: "Ongeldig telefoonnummer", invalidEmail: "Ongeldig e-mailadres", invalidContact: "Ongeldig contact (bereikbaarheid)",
  appointment: "Afspraak vastgelegd", won: "Gewonnen (zelfstandig)", lost: "Verloren (zelfstandig)",
  mismatch: "Mismatch", refund: "Refund", correction: "Walletcorrectie",
};

function Rate({ value }: { value: QualityMetric }) {
  return <span>{value.count}/{value.denominator} · {value.percent === null ? "Beperkte steekproef" : `${value.percent.toLocaleString("nl-NL")}%`}</span>;
}

function Select({ name, label, value, options }: { name: string; label: string; value: string; options: Array<{ value: string; label: string }> }) {
  return (
    <label className="grid gap-1 text-sm">
      {label}
      <select name={name} defaultValue={value} className="min-w-0 rounded-xl border bg-surface p-2">
        {options.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}

function pageHref(filters: QualityFilters, page: number) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...filters, page })) if (value !== "") params.set(key, String(value));
  return `/admin/leadkwaliteit?${params}`;
}

export default async function LeadQualityPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdminUser();
  const filters = parseQualityFilters(await searchParams);
  const report = await getAdminLeadQualityReport(filters);
  const operations = await getAdminLeadQualityQueue(parseReviewFilters({ status: "all" }));
  return (
    <div className="min-w-0 space-y-6 [contain:inline-size]">
      <QualityReviewSummary counts={operations.counts} />
      <section className="rounded-3xl border bg-surface p-5">
        <PageHeader title="Leadkwaliteit en uitkomsten" description={`Aankoopcohort van de laatste ${filters.days} dagen. Uitkomsten horen bij iedere afzonderlijke aankoop, niet bij de lead als geheel. Geen ranglijst van vakmannen.`} />
        <form method="get" className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Select name="days" label="Aankoopperiode" value={String(filters.days)} options={[7, 28, 90].map((days) => ({ value: String(days), label: `${days} dagen` }))} />
          <Select name="service" label="Dienst" value={filters.service} options={[{ value: "", label: "Alle diensten" }, ...report.options.services]} />
          <Select name="region" label="Regio" value={filters.region} options={[{ value: "", label: "Alle regio’s" }, ...report.options.regions.map((region) => ({ value: region, label: region }))]} />
          <Select name="type" label="Commercieel type" value={filters.type} options={[{ value: "", label: "Alle typen" }, { value: "shared", label: "Gedeeld" }, { value: "exclusive", label: "Exclusief" }]} />
          <Select name="outcome" label="Uitkomst per aankoop" value={filters.outcome} options={[{ value: "", label: "Alle uitkomsten" }, { value: "open", label: "Nog geen einduitkomst" }, { value: "won", label: "Gewonnen" }, { value: "lost", label: "Verloren" }]} />
          <Select name="mismatch" label="Mismatchreden" value={filters.mismatch} options={[{ value: "", label: "Alle aankopen" }, { value: "any", label: "Met mismatch" }, ...mismatchReasons.map((reason) => ({ value: reason, label: reasonLabels[reason] }))]} />
          <Select name="sort" label="Sorteer leads" value={filters.sort} options={[{ value: "newest", label: "Nieuwste aankoop" }, { value: "mostfeedback", label: "Meeste feedback" }, { value: "mismatch", label: "Meeste mismatches" }, { value: "refunds", label: "Meeste refunds" }]} />
          <div className="flex items-end gap-3"><button className="rounded-xl bg-primary px-4 py-2 text-white" type="submit">Toepassen</button><Link className="text-sm underline" href="/admin/leadkwaliteit">Herstellen</Link></div>
        </form>
      </section>

      <section className="rounded-3xl border bg-surface p-5">
        <h2 className="text-lg font-semibold">{report.uniqueLeads} unieke gekochte leads · {report.purchasedAssignments} gekochte assignments</h2>
        <p className="mt-2 text-sm text-muted-foreground">Noemer voor alle aankooppercentages: {report.purchasedAssignments} aankopen met status purchased of refunded, na filters. Geannuleerd is uitgesloten ({report.excludedCancelled} in dienst/regio/type-cohort). Een refund of walletcorrectie is geen bewijs van een slechte lead. Percentages worden pas getoond vanaf n ≥ 10.</p>
        {!report.purchasedAssignments && <p className="mt-4" role="status">Geen aankopen voor deze filters. Kies een langere periode of herstel de filters.</p>}
        {report.purchasedAssignments > 0 && report.feedbackAssignments === 0 && <p className="mt-4" role="status">Er is nog onvoldoende feedback voor deze periode.</p>}
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Object.entries(report.metrics).map(([key, value]) => <div key={key} className="rounded-xl border p-3"><dt className="text-sm text-muted-foreground">{metricLabels[key as keyof typeof metricLabels]}</dt><dd className="mt-1 text-sm font-medium"><Rate value={value} /></dd></div>)}
        </dl>
      </section>

      <section className="rounded-3xl border bg-surface p-5">
        <h2 className="text-lg font-semibold">Strikte funnel met vastgelegd bewijs</h2>
        <p className="mt-2 text-sm text-muted-foreground">Elke stap vereist alle eerdere stappen, in chronologische volgorde na aankoop. Contact, bereik en afspraak worden nooit uit een voortgangsstatus afgeleid. Gewonnen vereist ook een vastgelegd uitkomsttijdstip. Vaste basis voor iedere funnelstap: {report.purchasedAssignments} gekochte assignments inclusief refunds, na filters. Percentages alleen vanaf n ≥ 10.</p>
        <ol className="mt-4 grid gap-3 sm:grid-cols-5">
          {[{ label: "Gekocht", value: report.funnelRates.purchased }, { label: "Contact", value: report.funnelRates.contacted }, { label: "Bereikt", value: report.funnelRates.reached }, { label: "Afspraak", value: report.funnelRates.appointment }, { label: "Gewonnen", value: report.funnelRates.won }].map(({ label, value }) => <li key={label} className="rounded-xl border p-3"><span className="block text-sm">{label}</span><strong className="mt-1 block text-sm"><Rate value={value} /></strong></li>)}
        </ol>
        <p className="mt-4 text-sm">Ontbrekend geldig bewijs: contact {report.missingEvidence.contact}, bereikt {report.missingEvidence.reached}, afspraak {report.missingEvidence.appointment}; gewonnen/verloren zonder geldig uitkomsttijdstip {report.missingEvidence.outcome}. Ontbrekend bewijs betekent niet dat er geen contact of afspraak was. Historische data wordt niet aangevuld.</p>
        <h3 className="mt-4 font-medium">Mediane tijd vanaf aankoop</h3>
        <ul className="mt-2 text-sm">
          {Object.entries(report.timing).map(([key, value]) => <li key={key}>{key === "contact" ? "Eerste contact" : key === "appointment" ? "Eerste afspraakregistratie" : "Eerste einduitkomst"}: {value.hours === null ? "Nog geen geldige metingen" : `${value.hours.toLocaleString("nl-NL")} uur`} (n={value.sample})</li>)}
        </ul>
        <p className="mt-2 text-sm text-muted-foreground">Alleen eerste geregistreerde tijdstippen ≥ aankoop en ≤ rapporttijd, geen snapshot- of updated_at-tijden. De afspraakmeting is registratietijd, niet de geplande bezoekdatum.</p>
      </section>

      <section className="rounded-3xl border bg-surface p-5">
        <h2 className="text-lg font-semibold">Signalen ongeldige contactgegevens per aankoopcohort</h2>
        <p className="mt-2 text-sm text-muted-foreground">Trend per aankoopdatum (UTC), binnen de gekozen periode en filters. Alleen gestructureerde invalid_phone / invalid_email-feedback; elke aankoop telt eenmaal. Dit toont de huidige feedback over dat aankoopcohort, niet de datum waarop een contactprobleem optrad.</p>
        <div className="mt-3 max-w-full overflow-x-auto">
          <table className="w-full text-left text-sm"><caption className="sr-only">Ongeldige contactgegevens per aankoopdatum</caption>
            <thead><tr>{["Aankoopdatum", "n", "Ongeldig telefoonnummer", "Ongeldig e-mailadres", "Ongeldig contact totaal"].map((label) => <th key={label} className="whitespace-nowrap p-2" scope="col">{label}</th>)}</tr></thead>
            <tbody>{report.contactSignalCohorts.map((row) => <tr className="border-t" key={row.date}><th className="whitespace-nowrap p-2" scope="row">{row.date}</th><td className="p-2">{row.assignments}</td>{[row.invalidPhone, row.invalidEmail, row.invalidContact].map((value, index) => <td className="min-w-40 p-2" key={index}><Rate value={value} /></td>)}</tr>)}</tbody>
          </table>
          {!report.contactSignalCohorts.length && <p className="p-2 text-sm">Nog geen aankoopcohorten voor deze filters.</p>}
        </div>
      </section>

      <section className="rounded-3xl border bg-surface p-5">
        <h2 className="text-lg font-semibold">Uitsplitsingen</h2>
        <p className="mt-2 text-sm text-muted-foreground">Regio is onbekend zolang geen onafhankelijk opgeslagen, betrouwbaar regiolabel beschikbaar is. Postcode, adres en onbewezen city-velden worden niet gebruikt. Bron toont uitsluitend toegestane kanaalgroepen uit utm_source.</p>
        {Object.entries(report.breakdowns).map(([dimension, rows]) => (
          <details key={dimension} className="mt-4 rounded-xl border p-3" open={dimension === "service"}>
            <summary className="cursor-pointer font-medium">{({ service: "Dienst", region: "Regio", source: "Bronkanaal", type: "Gedeeld / exclusief" })[dimension as keyof typeof report.breakdowns]}</summary>
            <div className="mt-3 max-w-full overflow-x-auto">
              <table className="w-full text-left text-sm"><caption className="sr-only">Aankooppercentages per {dimension}</caption>
                <thead><tr>{["Groep", "n", "Contact", "Onbereikbaar", "Afspraak", "Gewonnen", "Verloren", "Mismatch", "Refund", "Correctie"].map((label) => <th key={label} className="whitespace-nowrap p-2" scope="col">{label}</th>)}</tr></thead>
                <tbody>{rows.map((row) => <tr key={row.label} className="border-t"><th className="p-2" scope="row">{row.label}</th><td className="p-2">{row.assignments}</td>{[row.contact, row.unreachable, row.appointment, row.won, row.lost, row.mismatch, row.refund, row.correction].map((value, index) => <td className="min-w-36 p-2" key={index}><Rate value={value} /></td>)}</tr>)}</tbody>
              </table>
              {!rows.length && <p className="p-2 text-sm">Geen aankopen in deze uitsplitsing.</p>}
            </div>
          </details>
        ))}
      </section>

      <section className="rounded-3xl border bg-surface p-5">
        <h2 className="text-lg font-semibold">Gestructureerde redenen</h2>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          {[{ title: "Mismatch", rows: report.mismatchReasons }, { title: "Verlies", rows: report.lossReasons }].map(({ title, rows }) => <div key={title}><h3 className="font-medium">{title}</h3><ul className="mt-2 space-y-1 text-sm">{rows.map((row) => <li key={row.reason}>{reasonLabels[row.reason]}: <Rate value={row} /></li>)}</ul></div>)}
        </div>
        <p className="mt-3 text-sm">Verliesreden niet ingevuld of onbekend (inclusief historische waarden): <Rate value={report.unknownLossReason} />.</p>
        <p className="mt-3 text-sm text-muted-foreground">Redenen gebruiken dezelfde aankoopnoemer. Vrije verliesredentekst wordt niet geïnterpreteerd of getoond; feedbacknotities worden niet opgehaald.</p>
        <h3 className="mt-5 font-medium">Afgewezen distributieaanbiedingen</h3>
        <p className="mt-2 text-sm">Apart aanbodcohort: aangeboden in dezelfde {filters.days} dagen, met dienst/regio/type-filters; uitkomst- en mismatchfilters zijn hier niet van toepassing. Noemer: {report.distribution.offers} unieke aanbiedingen, niet aankopen. Afgewezen: <Rate value={report.distribution.declined} />.</p>
        <ul className="mt-3 space-y-1 text-sm">{report.distribution.reasons.map((row) => <li key={row.reason}>{reasonLabels[row.reason]}: <Rate value={row} /></li>)}</ul>
        <p className="mt-3 text-sm text-muted-foreground">Zonder erkende reden: {report.distribution.unknownReason}. Alleen bestaande gestructureerde categorieën; geen interpretatie van willekeurige tekst.</p>
      </section>

      <section className="min-w-0 rounded-3xl border bg-surface p-5">
        <h2 className="text-lg font-semibold">Gekochte leads</h2>
        <div className="mt-4 max-w-full overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Gekochte leads met afzonderlijke aankoopuitkomsten</caption>
            <thead><tr>{["Referentie", "Dienst", "Regio", "Type", "Aankopen", "Contact", "Gewonnen", "Verloren", "Mismatch", "Refund", "Correctie"].map((label) => <th key={label} className="whitespace-nowrap p-2" scope="col">{label}</th>)}</tr></thead>
            <tbody>{report.table.map((row, index) => <tr className="border-t" key={`${row.reference}-${index}`}><th scope="row" className="whitespace-nowrap p-2">{row.reference}</th>{[row.service, row.region, row.type, row.purchaseCount, row.contacted, row.won, row.lost, row.mismatch, row.refunds, row.corrections].map((value, column) => <td key={column} className="p-2">{value}</td>)}</tr>)}</tbody>
          </table>
          {!report.table.length && <p className="p-2 text-sm">Geen leads voor deze selectie.</p>}
        </div>
        <nav aria-label="Rapportpagina’s" className="mt-4 flex flex-wrap gap-4 text-sm">
          {report.page > 1 && <Link className="underline" href={pageHref(filters, report.page - 1)}>Vorige</Link>}
          <span>Pagina {report.page} van {report.pages}</span>
          {report.page < report.pages && <Link className="underline" href={pageHref(filters, report.page + 1)}>Volgende</Link>}
        </nav>
      </section>
    </div>
  );
}
