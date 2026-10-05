import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { QualityReviewSignals } from "@/components/admin/quality-review-signals";
import { getAdminLeadQualityQueue } from "@/lib/leads/review-queries";
import { parseReviewFilters, reviewPageHref, reviewStatuses, reviewStatusLabels, reviewSignals, reviewSignalLabels } from "@/lib/leads/review-taxonomy";

export const dynamic = "force-dynamic";
function Select({ name, label, value, options }: { name: string; label: string; value: string; options: Array<{ value: string; label: string }> }) {
  return <label className="grid gap-1 text-sm">{label}<select name={name} defaultValue={value} className="min-w-0 rounded-xl border bg-surface p-2">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}
export default async function QualityReviewPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const filters = parseReviewFilters(params);
  const queue = await getAdminLeadQualityQueue(filters);
  return <div className="min-w-0 space-y-6 [contain:inline-size]">
    <section className="rounded-3xl border bg-surface p-5">
      <PageHeader title="Leadkwaliteit · werklijst" description="Onderzoek gestructureerde signalen per lead. Geen klantcontactgegevens, intake of vrije vakmanfeedback in deze werklijst." />
      <Link className="mt-3 inline-block text-sm underline" href="/admin/leadkwaliteit">Naar kwaliteitsrapport</Link>
      {typeof params.error === "string" && <p role="alert" className="mt-3 text-sm">{params.error}</p>}
      <form method="get" className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Select name="days" label="Lead aangemaakt in" value={String(filters.days)} options={[7, 28, 90].map((days) => ({ value: String(days), label: `Laatste ${days} dagen` }))} />
        <Select name="status" label="Reviewstatus" value={filters.status} options={[...reviewStatuses.map((value) => ({ value, label: reviewStatusLabels[value] })), { value: "all", label: "Alle statussen" }]} />
        <Select name="signal" label="Kwaliteitssignaal" value={filters.signal} options={[{ value: "", label: "Alle signalen" }, ...reviewSignals.map((value) => ({ value, label: reviewSignalLabels[value] }))]} />
        <Select name="service" label="Aangevraagde dienst" value={filters.service} options={[{ value: "", label: "Alle diensten" }, ...queue.options.services]} />
        <Select name="source" label="Bronkanaal" value={filters.source} options={[{ value: "", label: "Alle bronnen" }, ...queue.options.sources]} />
        <Select name="type" label="Commercieel type" value={filters.type} options={[{ value: "", label: "Alle typen" }, { value: "shared", label: "Gedeeld" }, { value: "exclusive", label: "Exclusief" }]} />
        <Select name="sort" label="Sortering" value={filters.sort} options={[{ value: "priority", label: "Prioriteit" }, { value: "newest", label: "Nieuwste lead" }, { value: "oldest", label: "Oudste lead" }, { value: "most_signals", label: "Meeste signalen" }, { value: "refund", label: "Meeste refunds" }]} />
        <label className="grid gap-1 text-sm">Referentie of volledige lead-ID<input name="search" defaultValue={filters.search} maxLength={36} placeholder="VC-… of UUID" className="min-w-0 rounded-xl border bg-surface p-2" aria-describedby="review-search-help" /></label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="refund" value="true" defaultChecked={filters.refund} />Alleen met refund</label>
        <div className="flex items-center gap-3"><button className="rounded-xl bg-primary px-4 py-2 text-white">Toepassen</button><Link className="text-sm underline" href="/admin/leadkwaliteit/review">Herstellen</Link></div>
        <p id="review-search-help" className="text-xs text-muted-foreground sm:col-span-2">Zoek uitsluitend op VC-referentie of UUID, niet op naam, telefoon of e-mail. Ongeldige zoekwaarden worden genegeerd.</p>
      </form>
    </section>
    <section className="rounded-3xl border bg-surface p-5">
      <h2 className="text-lg font-semibold">{queue.total} leads in deze selectie</h2>
      <dl className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">{[["Open", queue.counts.open], ["In onderzoek", queue.counts.in_review], ["Afgehandeld", queue.counts.resolved], ["Hoge prioriteit", queue.counts.high]].map(([label, count]) => <div key={label}><dt className="text-sm text-muted-foreground">{label}</dt><dd className="font-semibold">{count}</dd></div>)}</dl>
      <p className="mt-4 text-sm text-muted-foreground">Signalen zijn geen oordeel. Een refund of correctie bewijst geen slechte lead; gewonnen en verloren uitkomsten van verschillende vakmannen blijven zelfstandig. Prioriteit ordent alleen de werklijst en wijzigt geen productstatus.</p>
      <details className="mt-3 text-sm"><summary className="cursor-pointer font-medium">Waarom deze prioriteit?</summary><p className="mt-2">De vaste regels gebruiken herhaalde klachten, ongeldige contactgegevens, conflicten, ontbrekend bewijs en langdurig open uitkomsten. De signalen bij iedere lead tonen de concrete aanleiding; er is geen verborgen kwaliteitsscore.</p></details>
    </section>
    {!queue.items.length ? <section className="rounded-3xl border bg-surface p-5" role="status"><h2 className="font-semibold">Geen leads voor deze filters</h2><p className="mt-2 text-sm">Kies alle statussen, een langere periode of herstel de filters. Een lege werklijst betekent niet dat alle leads kwalitatief goed zijn.</p></section> : <ul className="space-y-3">{queue.items.map((item) => <li key={item.lead_id} className="rounded-3xl border bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><Link className="break-all font-semibold text-primary underline" href={`/admin/leadkwaliteit/review/${item.lead_id}`}>{item.reference || item.lead_id}</Link><p className="mt-1 text-sm">{item.service_name || "Dienst onbekend"} · {item.type === "exclusive" ? "Exclusief" : item.type === "shared" ? "Gedeeld" : "Type onbekend"} · {item.source}</p><p className="mt-1 text-xs text-muted-foreground">Aangemaakt: {new Date(item.created_at).toLocaleString("nl-NL", { timeZone: "Europe/Amsterdam" })}</p></div><span className="rounded-lg border px-2 py-1 text-sm">{reviewStatusLabels[item.status]}</span></div>
      <div className="mt-3"><QualityReviewSignals item={item} /></div>
    </li>)}</ul>}
    <nav aria-label="Werklijstpagina’s" className="flex flex-wrap items-center gap-4 text-sm">{queue.page > 1 && <Link className="underline" href={reviewPageHref(filters, queue.page - 1)}>Vorige</Link>}<span>Pagina {queue.page} van {queue.pages} · 25 per pagina</span>{queue.page < queue.pages && <Link className="underline" href={reviewPageHref(filters, queue.page + 1)}>Volgende</Link>}</nav>
  </div>;
}
