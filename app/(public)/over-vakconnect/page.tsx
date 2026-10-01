import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/config/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Over VakConnect",
  description: "VakConnect helpt consumenten hun klus duidelijk te beschrijven en vakbedrijven passende aanvragen te vinden.",
  path: "/over-vakconnect",
  keywords: ["over VakConnect", "VakConnect missie", "vakman vinden"],
});

export default function AboutPage() {
  return (
    <div className="container-shell space-y-12 py-10 sm:py-14">
      <nav className="text-sm text-muted-foreground" aria-label="Broodkruimel"><Link href="/">Home</Link> / Over VakConnect</nav>
      <section className="space-y-4">
        <p className="text-sm font-medium text-primary">Over VakConnect</p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight">Een goede klus begint met de juiste aansluiting</h1>
        <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
          Een passende vakman vinden kost tijd. En voor vakbedrijven is het niet vanzelfsprekend dat een aanvraag past bij hun diensten, regio of planning. VakConnect wil die eerste stap overzichtelijker maken.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="text-2xl font-semibold">Voor mensen met een klus</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            Je beschrijft wat er moet gebeuren op één plek. De dienst, locatie en details helpen VakConnect zoeken naar vakmensen voor wie de aanvraag relevant kan zijn.
          </p>
        </Card>
        <Card className="space-y-3">
          <h2 className="text-2xl font-semibold">Voor vakbedrijven</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            Vakmensen stellen hun diensten, werkgebied en beschikbaarheid in. Zo kan de matching beter aansluiten op het werk dat zij uitvoeren en de ruimte die zij hebben.
          </p>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Duidelijke verwachtingen horen erbij</h2>
        <p className="max-w-3xl leading-7 text-muted-foreground">
          VakConnect brengt aanvragen en vakbedrijven bij elkaar, maar voert de klus niet uit en bepaalt de offerte niet. Je bespreekt de aanpak, prijs en planning rechtstreeks met de vakman. We beloven geen directe match; beschikbaarheid en geschiktheid verschillen per aanvraag.
        </p>
        <Link href="/hoe-werkt-het" className={buttonClassName({ variant: "secondary" })}>Lees hoe het werkt</Link>
      </section>

      <Card className="space-y-4 bg-primary text-primary-foreground">
        <h2 className="text-2xl font-semibold">Heb je een klus?</h2>
        <p className="text-sm text-primary-foreground/90">Vertel wat er moet gebeuren en bekijk hoe VakConnect je kan helpen zoeken.</p>
        <Link href="/aanvraag" className={buttonClassName({ variant: "secondary", size: "lg", className: "border-white/20 bg-white text-primary" })}>Plaats je klus</Link>
      </Card>
    </div>
  );
}
