import Link from "next/link";
import type { ReactNode } from "react";
import { PageHeader } from "@/components/ui/page-header";
import {
  economicsDefinitions,
  type EconomicsRate,
  type EconomicsReport,
  type EconomicsRow,
} from "@/lib/economics/metrics";

const number = (value: number) => value.toLocaleString("nl-NL", { maximumFractionDigits: 2 });
const credits = (value: number | null | undefined) => value == null ? "Niet beschikbaar" : `${number(value)} credits`;
const qualityLabels: Record<string, string> = {
  wrong_service: "Verkeerde dienst",
  invalid_contact: "Ongeldige contactgegevens",
  unreachable: "Niet bereikbaar",
  duplicate: "Dubbel",
  already_completed: "Al uitgevoerd",
};

function Rate({ value }: { value: EconomicsRate }) {
  return <span>{number(value.count)}/{number(value.denominator)} · {value.denominator < economicsDefinitions.minimumSample || value.percent === null ? "Beperkte data: percentage verborgen (n < 10)" : `${number(value.percent)}%`}</span>;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="min-w-0 rounded-3xl border bg-surface p-5"><h2 className="text-lg font-semibold">{title}</h2><div className="mt-3 space-y-3">{children}</div></section>;
}

function Metrics({ items }: { items: Array<[string, ReactNode]> }) {
  return <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{items.map(([label, value]) => <div key={label} className="min-w-0 rounded-xl border p-3"><dt className="text-sm text-muted-foreground">{label}</dt><dd className="mt-1 font-medium">{value}</dd></div>)}</dl>;
}

function Table({ caption, headers, children }: { caption: string; headers: string[]; children: ReactNode }) {
  return (
    <div className="min-w-0 max-w-full overflow-x-auto rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" role="region" aria-label={caption} tabIndex={0}>
      <table className="w-full text-left text-sm">
        <caption className="pb-2 text-left text-sm text-muted-foreground">{caption}</caption>
        <thead><tr>{headers.map((header) => <th key={header} className="whitespace-nowrap p-2" scope="col">{header}</th>)}</tr></thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function SummaryTable({ title, rows }: { title: string; rows: EconomicsRow[] }) {
  return (
    <Table caption={title} headers={["Groep", "Aankopen", "Unieke leads", "Gem. bruto credits", "Bruto credits", "Refundcredits", "Refund aantal / aandeel", "Positieve correcties", "Extra afboekingen", "Netto credits", "Bereikt", "Afspraak", "Gewonnen", "Mismatch", "Gedeeltelijke correctie", "Credits / gewonnen", "Open", "Verloren"]}>
      {rows.map((row, index) => <tr className="border-t" key={`${row.label}-${index}`}>
        <th scope="row" className="min-w-40 p-2">{row.label}</th>
        {[number(row.purchases), number(row.uniqueLeads), credits(row.finance?.average), credits(row.finance?.gross), credits(row.finance?.refunded),
          <Rate key="refund" value={row.refund} />, credits(row.finance?.corrections), credits(row.finance?.extraCharges), credits(row.finance?.net),
          <Rate key="reached" value={row.reached} />, <Rate key="appointment" value={row.appointment} />, <Rate key="won" value={row.won} />,
          <Rate key="mismatch" value={row.mismatch} />, <Rate key="partial" value={row.partialCorrection} />, credits(row.finance?.creditsPerWon),
          number(row.open), number(row.lost)].map((value, column) => <td className="min-w-36 p-2" key={column}>{value}</td>)}
      </tr>)}
      {!rows.length && <tr><td className="p-2" colSpan={18}>Geen aankopen in deze uitsplitsing.</td></tr>}
    </Table>
  );
}

function OffersTable({ title, rows }: { title: string; rows: EconomicsReport["distribution"]["byType"] }) {
  return <Table caption={title} headers={["Groep", "Aanbiedingen", "Gekocht / aanbodnoemer"]}>
    {rows.map((row, index) => <tr className="border-t" key={`${row.label}-${index}`}><th scope="row" className="p-2">{row.label}</th><td className="p-2">{number(row.offers)}</td><td className="min-w-48 p-2"><Rate value={row.purchases} /></td></tr>)}
    {!rows.length && <tr><td colSpan={3} className="p-2">Geen aanbiedingen in dit cohort.</td></tr>}
  </Table>;
}

export function EconomicsDashboard({ report }: { report: EconomicsReport }) {
  const { all, priceDistribution: prices, distribution } = report;
  const finance = all.finance;
  const candidates = report.reconciliation.consistent
    ? report.breakdowns.service.filter((row) => row.sufficientData && Object.values(row.quality).some((signal) => signal.count > 0))
    : [];
  const iqr = prices?.p25 != null && prices.p75 != null ? prices.p75 - prices.p25 : null;

  return (
    <div className="min-w-0 space-y-6 [contain:inline-size]">
      <section className="min-w-0 rounded-3xl border bg-surface p-5">
        <PageHeader title="Lead-economie" description={`Aankoopcohort van de laatste ${report.days} dagen. Alleen-lezen, geaggregeerde observaties; geen ranglijsten of prijsadvies.`} />
        <form method="get" action="/admin/economie" className="mt-5 flex flex-wrap items-end gap-3">
          <label className="grid gap-1 text-sm">Aankoopperiode
            <select name="days" defaultValue={String(report.days)} className="min-w-0 rounded-xl border bg-surface p-2">
              {[7, 28, 90].map((days) => <option key={days} value={days}>{days} dagen</option>)}
            </select>
          </label>
          <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-white">Bekijken</button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">Rapportmoment: <time dateTime={report.asOf}>{new Date(report.asOf).toLocaleString("nl-NL", { timeZone: "UTC" })} UTC</time>. {economicsDefinitions.denominator} Percentages verborgen bij n &lt; {economicsDefinitions.minimumSample}; ontbrekende uitkomsten betekenen niet dat er geen resultaat was.</p>
        <nav aria-label="Gerelateerde rapporten" className="mt-3 flex flex-wrap gap-4 text-sm">
          <Link href="/admin/lead-prijzen" className="underline">Leadprijzen bekijken</Link>
          <Link href="/admin/leadkwaliteit" className="underline">Leadkwaliteit bekijken</Link>
        </nav>
      </section>

      <Section title="Reconciliatie en overzicht">
        <p role={report.reconciliation.consistent ? "status" : "alert"}>{report.reconciliation.consistent ? "Reconciliatie geslaagd." : "Reconciliatie niet geslaagd. Alle financiële cijfers zijn niet beschikbaar; aantallen blijven observaties."}</p>
        {!!report.reconciliation.issues.length && <Table caption="Reconciliatieproblemen" headers={["Probleem", "Aantal"]}>
          {report.reconciliation.issues.map((issue) => <tr key={issue.label} className="border-t"><th className="p-2" scope="row">{issue.label}</th><td className="p-2">{number(issue.count)}</td></tr>)}
        </Table>}
        {!all.purchases && <p role="status">Geen aankopen in deze periode. Kies eventueel een langere periode.</p>}
        <Metrics items={[
          ["Aankopen", number(all.purchases)], ["Unieke gekochte leads", number(all.uniqueLeads)],
          ["Bruto aankoopcredits", credits(finance?.gross)], ["Werkelijk teruggeboekte refunds", credits(finance?.refunded)],
          ["Positieve correcties (terugboekingen)", credits(finance?.corrections)], ["Extra afboekingen", credits(finance?.extraCharges)],
          ["Netto behouden credits", credits(finance?.net)], ["Gemiddelde bruto aankoopcredits", credits(finance?.average)],
          ["Refund aantal / aandeel", <Rate key="refund" value={all.refund} />],
          ["Bereikt (zelfstandig)", <Rate key="reached" value={all.reached} />],
          ["Afspraak (zelfstandig)", <Rate key="appointment" value={all.appointment} />],
          ["Gewonnen (zelfstandig)", <Rate key="won" value={all.won} />],
          ["Netto credits / bereikt (zelfstandig)", credits(finance?.creditsPerReached)],
          ["Netto credits / afspraak (zelfstandig)", credits(finance?.creditsPerAppointment)],
          ["Netto credits / gewonnen (zelfstandig)", credits(finance?.creditsPerWon)],
          ["Walletvoorraad (verplichting)", credits(report.walletStock)],
          ["Gedeelde aankopen / unieke gedeelde lead", report.sharedPurchasesPerLead === null ? "Niet beschikbaar" : number(report.sharedPurchasesPerLead)],
        ]} />
        <p className="text-sm text-muted-foreground">Netto = bruto − refunds − positieve correcties + extra afboekingen (negatieve correcties). Een correctie ter grootte van de aankoopprijs zonder refundstatus blijft een correctie. Gedeeltelijk betekent positieve correcties &gt; 0 en &lt; aankoopprijs, zonder refund. Walletvoorraad is een actuele creditverplichting, geen omzet of cohortopbrengst. Creditcijfers zijn geen euro-omzet, marge of ROI. Een refund of correctie bewijst geen slechte lead.</p>
      </Section>

      <Section title="Cohorten en resultaatvertraging">
        <p className="text-sm text-muted-foreground">{economicsDefinitions.maturity} Recent: minder dan {economicsDefinitions.maturityDays} dagen sinds aankoop. Resultaten kunnen nog veranderen door openstaande leads. Uitkomsten kunnen later worden vastgelegd; recente cohorten zijn nog onvolledig en de grens garandeert geen afgeronde resultaten.</p>
        <SummaryTable title="Alle, uitgerijpte en recente aankopen" rows={[{ label: "Alle aankopen", ...all }, { label: "Uitgerijpt (≥ 28 dagen)", ...report.matured }, { label: "Recent (< 28 dagen)", ...report.recent }]} />
      </Section>

      <Section title="Strikte funnel: bereikt → afspraak → gewonnen">
        <p className="text-sm text-muted-foreground">Iedere stap vereist de eerdere stappen met chronologisch geldig bewijs na aankoop, inclusief contact vóór bereikt. Gewonnen vereist een geldig uitkomsttijdstip. Elke stap gebruikt alle {number(all.purchases)} aankopen inclusief refunds als noemer, niet de vorige stap. Dit staat los van de zelfstandige uitkomstpercentages hierboven.</p>
        <Table caption="Strikte funnel en netto cohortcredits per bereikte uitkomst" headers={["Stap", "Aantal / aankoopnoemer", "Netto credits / behaalde uitkomst"]}>
          {report.funnel.map((step) => <tr className="border-t" key={step.label}><th scope="row" className="p-2">{step.label}</th><td className="min-w-48 p-2"><Rate value={step} /></td><td className="p-2">{credits(step.creditsPerOutcome)}</td></tr>)}
        </Table>
        <p className="text-sm text-muted-foreground">{economicsDefinitions.creditsPerOutcome} De teller is het netto creditbedrag van het hele aankoopcohort, niet alleen van de aankopen met die uitkomst.</p>
      </Section>

      <Section title="Prijsverdeling (aankoopcredits)">
        <Metrics items={[
          ["Minimum", credits(prices?.min)], ["P25", credits(prices?.p25)], ["Mediaan", credits(prices?.median)],
          ["P75", credits(prices?.p75)], ["Maximum", credits(prices?.max)], ["Interkwartielafstand (IQR)", credits(iqr)],
          ["Observaties buiten de IQR-grenzen", prices?.outliers == null ? "Niet beschikbaar" : number(prices.outliers)],
        ]} />
        <p className="text-sm text-muted-foreground">Alle aankoopprijzen inclusief refunds. Beschrijvende spreiding; observaties buiten P25 − 1,5 × IQR of P75 + 1,5 × IQR zijn geen fouten of kwaliteitsoordeel. Deze telling verschijnt alleen vanaf n ≥ 10; geen prijsaanbeveling.</p>
      </Section>

      <Section title="Uitsplitsingen van aankopen">
        <p className="text-sm text-muted-foreground">Dezelfde aankoopnoemer per groep, inclusief refunds. Regio is niet betrouwbaar beschikbaar: geen regionale tabel. Subdienst heeft onvoldoende betrouwbare taxonomie en historie en wordt niet uitgesplitst. Bron is uitsluitend een toegestane hoog-niveau kanaalgroep, zelfgerapporteerd; geen causale attributie.</p>
        {([
          ["service", "Per dienst"], ["type", "Gedeeld / exclusief"], ["source", "Per bronkanaal"],
        ] as const).map(([key, title]) => <details key={key} className="min-w-0 rounded-xl border p-3" open={key === "service"}>
          <summary className="cursor-pointer font-medium">{title}</summary>
          <div className="mt-3 min-w-0"><SummaryTable title={title} rows={report.breakdowns[key]} /></div>
        </details>)}
      </Section>

      <Section title="Dagtrend per aankoopcohort">
        <p className="text-sm text-muted-foreground">Aankoopdatum in UTC; huidige refunds en gewonnen uitkomsten worden aan die aankoopdatum toegerekend, niet aan hun registratiedatum. Alleen dagen met aankopen; geen voorspelling.</p>
        <Table caption="Dagelijkse aankoopcohorten" headers={["Aankoopdatum (UTC)", "Aankopen", "Netto credits", "Refund aantal / aandeel", "Refundcredits", "Gewonnen aantal / aandeel"]}>
          {report.trend.map((row) => <tr key={row.label} className="border-t"><th scope="row" className="whitespace-nowrap p-2">{row.label}</th><td className="p-2">{number(row.purchases)}</td><td className="p-2">{credits(row.finance?.net)}</td><td className="min-w-48 p-2"><Rate value={row.refund} /></td><td className="p-2">{credits(row.finance?.refunded)}</td><td className="min-w-48 p-2"><Rate value={row.won} /></td></tr>)}
          {!report.trend.length && <tr><td colSpan={6} className="p-2">Geen aankoopcohorten in deze periode.</td></tr>}
        </Table>
      </Section>

      <Section title="Distributie: afzonderlijk aanbodcohort">
        <p className="text-sm text-muted-foreground">Aanbiedingen aangeboden in de laatste {report.days} dagen. Conversie gebruikt {number(distribution.offers)} aanbiedingen als noemer, niet aankopen of unieke leads. Dit is geen volledige historische sold-through: aanbodhistorie en cohortgrenzen beperken het beeld.</p>
        <Metrics items={[
          ["Aanbiedingen", number(distribution.offers)], ["Aanbodconversie", <Rate key="converted" value={distribution.converted} />],
          ["Verlopen, niet gekocht", number(distribution.expired)], ["Open, niet gekocht", number(distribution.open)],
          ["Onverkochte unieke leads in aanbodcohort", number(distribution.unsoldLeads)],
        ]} />
        <p className="text-sm text-muted-foreground">Onverkocht betekent geen aankoop met status purchased of refunded tot het rapportmoment, ook vóór het aanbodcohort gecontroleerd. Een refund wist eerdere verkoop niet uit. Een open aanbieding is nog niet verkocht, geen mislukking. Aankopen zonder distributieaanbod ontbreken in de aanbodconversie. Een lead kan meerdere aanbiedingen of gedeelde aankopen hebben.</p>
        <OffersTable title="Aanbodconversie per gedeeld / exclusief" rows={distribution.byType} />
        <OffersTable title="Aanbodconversie per dienst" rows={distribution.byService} />
      </Section>

      <Section title="Kwaliteitssignalen en concepten voor handmatige beoordeling">
        <p className="text-sm text-muted-foreground">Gestructureerde signalen per aankoop, met dezelfde aankoopnoemer inclusief refunds. Signalen kunnen overlappen; zelfgerapporteerde feedback is geen bewezen causaliteit.</p>
        <Table caption="Kwaliteitssignalen in het aankoopcohort" headers={["Signaal", "Aantal / aankoopnoemer"]}>
          {Object.entries(all.quality).map(([key, signal]) => <tr key={key} className="border-t"><th scope="row" className="p-2">{qualityLabels[key] ?? "Overig gestructureerd signaal"}</th><td className="min-w-48 p-2"><Rate value={signal} /></td></tr>)}
          <tr className="border-t"><th scope="row" className="p-2">Mismatch totaal</th><td className="p-2"><Rate value={all.mismatch} /></td></tr>
          <tr className="border-t"><th scope="row" className="p-2">Gedeeltelijke positieve correctie</th><td className="p-2"><Rate value={all.partialCorrection} /></td></tr>
        </Table>
        <h3 className="font-medium">Beschrijvende conceptkandidaten per dienst</h3>
        <p className="text-sm text-muted-foreground">Alleen bij geslaagde reconciliatie, minstens 10 aankopen per dienst en minstens één gestructureerd kwaliteitssignaal. Dit is uitsluitend een selectie voor menselijke controle; geen ranglijst, prijsadvies, opgeslagen concept of geactiveerd experiment. Controleer resultaatvertraging en onderliggende feedback eerst.</p>
        <Table caption="In aanmerking komende diensten voor handmatige controle" headers={["Dienst", "Aankopen", "Aanwezige signalen"]}>
          {candidates.map((row, index) => <tr key={`${row.label}-${index}`} className="border-t"><th scope="row" className="p-2">{row.label}</th><td className="p-2">{number(row.purchases)}</td><td className="min-w-64 p-2">{Object.entries(row.quality).filter(([, signal]) => signal.count > 0).map(([key, signal]) => <div key={key}>{qualityLabels[key] ?? "Overig gestructureerd signaal"}: <Rate value={signal} /></div>)}</td></tr>)}
          {!candidates.length && <tr><td colSpan={3} className="p-2">{report.reconciliation.consistent ? "Geen diensten voldoen aan deze beschrijvende selectie." : "Kandidaten niet beschikbaar zolang reconciliatie niet slaagt."}</td></tr>}
        </Table>
      </Section>
    </div>
  );
}
