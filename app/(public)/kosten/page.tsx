import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/config/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Kosten voor consumenten en vakmannen",
  description: "Lees wat een aanvraag kost voor consumenten en hoe leadkosten voor vakbedrijven op hoofdlijnen werken.",
  path: "/kosten",
  keywords: ["kosten vakman aanvragen", "kosten VakConnect", "leadkosten vakbedrijf"],
});

const factors = ["de aard en omvang van de klus", "benodigde materialen", "bereikbaarheid van de woning", "complexiteit en planning", "eventuele spoed"];

export default function PricingPage() {
  return (
    <div className="container-shell space-y-12 py-10 sm:py-14">
      <nav className="text-sm text-muted-foreground" aria-label="Broodkruimel"><Link href="/">Home</Link> / Kosten</nav>
      <section className="space-y-4">
        <p className="text-sm font-medium text-primary">Duidelijkheid vooraf</p>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Wat kost VakConnect?</h1>
        <p className="max-w-prose text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
          Voor consumenten is een aanvraag plaatsen gratis. Voor vakbedrijven kunnen kosten gelden wanneer zij een aanvraag oppakken. De prijs van de klus spreek je rechtstreeks af met de vakman.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-4">
          <h2 className="text-2xl font-semibold">Voor consumenten</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            Je betaalt VakConnect niets om je klus aan te vragen. Je zit nergens aan vast en beslist zelf of je met een vakman verdergaat. De kosten van de uitvoering bespreek je rechtstreeks met die vakman.
          </p>
          <Link href="/aanvraag" className={buttonClassName({ variant: "primary" })}>Plaats je klus</Link>
        </Card>
        <Card className="space-y-4">
          <h2 className="text-2xl font-semibold">Voor vakbedrijven</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            Voor bepaalde aanvragen kunnen leadkosten gelden. Een aanvraag kan shared worden aangeboden aan meerdere vakbedrijven of exclusief aan één bedrijf. De kosten zijn afhankelijk van onder meer het type aanvraag en de distributievorm.
          </p>
          <p className="text-sm leading-7 text-muted-foreground">
            In het platform worden eventuele kosten in credits weergegeven voordat je een aanvraag oppakt. De prijs per aanvraag verschilt; er staan daarom geen vaste bedragen op deze pagina. Het aanvullen van credits is op dit moment nog niet beschikbaar.
          </p>
          <Link href="/voor-vakmannen" className="text-sm font-medium text-primary underline underline-offset-4">Meer voor vakmannen</Link>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">De prijs van de klus</h2>
        <p className="max-w-3xl leading-7 text-muted-foreground">
          De prijs voor het werk hangt af van je situatie en de afspraken met de vakman. Onder meer deze onderdelen kunnen meespelen:
        </p>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {factors.map((factor) => <li key={factor} className="rounded-xl border bg-surface-muted px-4 py-3 text-sm leading-6">{factor}</li>)}
        </ul>
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
          Vraag de vakman om een duidelijke uitleg van de werkzaamheden en eventuele bijkomende kosten voordat je akkoord gaat.
        </p>
      </section>

      <Card className="space-y-4 bg-primary text-primary-foreground">
        <h2 className="text-2xl font-semibold">Begin met een duidelijke aanvraag</h2>
        <p className="text-sm text-primary-foreground/90">Omschrijf je klus; je beslist daarna zelf hoe je verdergaat.</p>
        <Link href="/aanvraag" className={buttonClassName({ variant: "secondary", size: "lg", className: "border-white/20 bg-white text-primary" })}>Plaats je klus</Link>
      </Card>
    </div>
  );
}
