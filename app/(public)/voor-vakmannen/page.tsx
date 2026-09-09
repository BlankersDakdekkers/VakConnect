import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/config/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Voor vakmannen",
  description: "Meer passende opdrachten. Minder tijd verspillen aan slechte leads. Ontdek hoe VakConnect werkt voor vakbedrijven.",
  path: "/voor-vakmannen",
  keywords: ["voor vakmannen", "vakbedrijf leads", "vakman aanmelden"],
});

export default function ForProfessionalsPage() {
  return (
    <div className="container-shell space-y-10 py-14">
      <nav className="text-sm text-muted-foreground"><Link href="/">Home</Link> / Voor vakmannen</nav>
      <section className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight">Meer passende opdrachten. Minder tijd verspillen aan slechte leads.</h1>
        <p className="max-w-3xl text-muted-foreground">
          VakConnect helpt Nederlandse vakbedrijven met aanvragen die beter aansluiten op dienst en werkgebied.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="text-2xl font-semibold">Wat VakConnect is</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            VakConnect is een professioneel platform dat consumentaanvragen gestructureerd opbouwt en koppelt aan passende vakmensen.
          </p>
        </Card>
        <Card className="space-y-3">
          <h2 className="text-2xl font-semibold">Hoe aanvragen worden opgebouwd</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            Aanvragen bevatten kerngegevens, dienstspecifieke intakevragen en optioneel foto’s, zodat jij sneller kunt beoordelen of een klus past.
          </p>
        </Card>
        <Card className="space-y-3">
          <h2 className="text-2xl font-semibold">Dienst- en regiomatching</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            Matching gebeurt op basis van gekozen dienst en werkgebied. Zo ontstaan minder irrelevante aanvragen.
          </p>
        </Card>
        <Card className="space-y-3">
          <h2 className="text-2xl font-semibold">Wat een vakman ziet</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            Aangesloten professionals zien alleen relevante, toegewezen aanvragen in een afgeschermde omgeving.
          </p>
        </Card>
        <Card className="space-y-3">
          <h2 className="text-2xl font-semibold">Toewijzing en intakekwaliteit</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            Kwalitatieve intake maakt het eenvoudiger om aanvragen gericht toe te wijzen en sneller op te volgen.
          </p>
        </Card>
        <Card className="space-y-3">
          <h2 className="text-2xl font-semibold">Professioneel dashboard</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            VakConnect wordt stap voor stap uitgebreid met aanvullende functies voor vakbedrijven.
          </p>
        </Card>
      </section>

      <Card className="space-y-4 bg-primary text-primary-foreground">
        <h2 className="text-2xl font-semibold">Wil je aansluiten als vakman?</h2>
        <p className="text-sm text-primary-foreground/90">Meld je bedrijf aan. Nieuwe aanmeldingen worden altijd eerst handmatig beoordeeld.</p>
        <div>
          <Link href="/aanmelden-vakman" className={buttonClassName({ variant: "secondary", size: "lg", className: "border-white/20 bg-white text-primary" })}>
            Aanmelden als vakman
          </Link>
        </div>
      </Card>
    </div>
  );
}
