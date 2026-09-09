import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/config/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Kosten en prijsfactoren",
  description: "Lees welke factoren de kosten van een klus bepalen en hoe VakConnect transparantie biedt in het aanvraagproces.",
  path: "/kosten",
  keywords: ["kosten vakman", "prijsfactoren klus", "vakconnect kosten"],
});

const factors = ["vakgebied", "omvang van de klus", "materiaal", "bereikbaarheid", "spoed", "regio", "complexiteit"];

export default function PricingPage() {
  return (
    <div className="container-shell space-y-10 py-14">
      <nav className="text-sm text-muted-foreground"><Link href="/">Home</Link> / Kosten</nav>
      <section className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight">Kosten van een klus: waar hangen ze van af?</h1>
        <p className="max-w-3xl text-muted-foreground">
          De uiteindelijke klusprijs verschilt per situatie. VakConnect helpt vooral met een duidelijke intake en passende koppeling.
        </p>
      </section>

      <Card className="space-y-4">
        <h2 className="text-2xl font-semibold">Belangrijkste kostenfactoren</h2>
        <ul className="grid gap-2 sm:grid-cols-2 text-sm text-muted-foreground">
          {factors.map((factor) => (
            <li key={factor} className="rounded-2xl bg-surface-muted px-4 py-3 text-foreground">{factor}</li>
          ))}
        </ul>
      </Card>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="text-2xl font-semibold">Kosten van de klus</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            De kosten van uitvoering worden bepaald door de vakman op basis van jouw situatie, materiaalkeuze en gewenste planning.
          </p>
        </Card>
        <Card className="space-y-3">
          <h2 className="text-2xl font-semibold">Platformkosten</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            Eventuele commerciële platform- of leadkosten voor vakbedrijven kunnen in toekomstige fases worden uitgebreid.
          </p>
        </Card>
      </section>

      <Link href="/aanvraag" className={buttonClassName({ variant: "primary", size: "lg" })}>Start je aanvraag</Link>
    </div>
  );
}
