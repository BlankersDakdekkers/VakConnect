import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";
import { ProcessSteps } from "@/components/public/process-steps";
import { TrackedLink } from "@/components/public/tracked-link";
import { buildPageMetadata } from "@/lib/config/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Meer passende opdrachten voor vakmannen",
  description: "Stel je diensten, werkgebied en beschikbaarheid in. Bekijk hoe VakConnect relevante aanvragen voor vakbedrijven selecteert.",
  path: "/voor-vakmannen",
  keywords: ["voor vakmannen", "vakbedrijf aanmelden", "opdrachten voor vakbedrijven"],
});

const challenges = [
  ["Aanvragen buiten je regio", "Een klus op afstand kost tijd om te beoordelen en is niet altijd uitvoerbaar."],
  ["Onvolledige klusinformatie", "Zonder locatie, omschrijving of context is lastig in te schatten wat een aanvraag vraagt."],
  ["Werk dat niet bij je diensten past", "Een aanvraag helpt pas als de klus aansluit op wat je bedrijf doet."],
  ["Geen ruimte in de planning", "Ook een passende klus komt niet altijd op het juiste moment."],
];

const setupSteps = [
  ["Maak je bedrijfsprofiel aan", "Deel je bedrijfs- en contactgegevens zodat we je aanmelding kunnen beoordelen."],
  ["Kies je diensten en regio", "Geef aan welk werk je doet en waar je opdrachten wilt uitvoeren."],
  ["Stel je beschikbaarheid in", "Houd je capaciteit en beschikbaarheid bij zodat de matching daar rekening mee kan houden."],
  ["Beoordeel passende aanvragen", "Bekijk de klusdetails en bepaal zelf of je een beschikbare aanvraag wilt oppakken."],
];

export default function ForProfessionalsPage() {
  return (
    <div className="container-shell space-y-12 py-10 sm:py-14">
      <nav className="text-sm text-muted-foreground" aria-label="Broodkruimel"><Link href="/">Home</Link> / Voor vakmannen</nav>
      <section className="space-y-5">
        <p className="text-sm font-medium text-primary">Voor vakbedrijven</p>
        <h1 className="max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl">
          Meer passende opdrachten. Minder tijd verspillen aan slechte leads.
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
          VakConnect houdt rekening met je diensten, werkgebied en beschikbaarheid. Zo kun je aanvragen bekijken die beter aansluiten op het werk dat je zoekt.
        </p>
        <TrackedLink href="/aanmelden-vakman" ctaId="professional_landing_signup_hero" ctaLocation="hero" destinationType="professional" className={buttonClassName({ variant: "primary", size: "lg" })}>Meld je aan als vakman</TrackedLink>
        <p className="text-sm text-muted-foreground">Nieuwe aanmeldingen worden eerst handmatig beoordeeld.</p>
      </section>

      <section className="space-y-5">
        <h2 className="text-3xl font-semibold tracking-tight">Een aanvraag moet passen bij je bedrijf</h2>
        <p className="max-w-3xl leading-7 text-muted-foreground">
          Irrelevante klussen, aanvragen buiten je regio en onduidelijke informatie maken opvolgen lastig. Met VakConnect stel je vooraf in welk werk je doet, waar je werkt en of je ruimte hebt voor nieuwe opdrachten.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {challenges.map(([title, description]) => (
            <Card key={title} className="space-y-2">
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm leading-7 text-muted-foreground">{description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-3xl font-semibold tracking-tight">Zo werkt het voor jouw bedrijf</h2>
        <ProcessSteps steps={setupSteps.map(([title, description]) => ({ title, description }))} columns={4} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="text-2xl font-semibold">Jij houdt overzicht</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            Bekijk de informatie bij een aanvraag en volg contact en voortgang vanuit je professionele omgeving op. Je kunt je diensten, werkgebied en beschikbaarheid beheren.
          </p>
        </Card>
        <Card className="space-y-3">
          <h2 className="text-2xl font-semibold">Duidelijkheid over kosten</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            Voor bepaalde aanvragen kunnen leadkosten gelden. Een aanvraag kan shared of exclusief worden aangeboden; het aantal beschikbare plekken verschilt. De kosten worden in credits weergegeven voordat je een aanvraag oppakt. Er zijn geen vaste publieke tarieven op deze pagina.
          </p>
          <Link href="/kosten" className="text-sm font-medium text-primary underline underline-offset-4">Lees hoe de kosten werken</Link>
        </Card>
      </section>

      <Card className="space-y-4 bg-primary text-primary-foreground">
        <h2 className="text-2xl font-semibold">Kijk of VakConnect bij je bedrijf past</h2>
        <p className="max-w-2xl text-sm leading-7 text-primary-foreground/90">
          Meld je bedrijf aan met je basisgegevens, diensten en werkgebied. We beoordelen nieuwe aanmeldingen voordat ze worden geactiveerd.
        </p>
        <TrackedLink href="/aanmelden-vakman" ctaId="professional_landing_signup_final" ctaLocation="final_cta" destinationType="professional" className={buttonClassName({ variant: "secondary", size: "lg", className: "border-white/20 bg-white text-primary" })}>
          Meld je aan als vakman
        </TrackedLink>
      </Card>
    </div>
  );
}
