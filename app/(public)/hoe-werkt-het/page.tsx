import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/config/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Hoe werkt VakConnect",
  description: "Lees stap voor stap hoe VakConnect jouw aanvraag omzet in contact met een passende vakman.",
  path: "/hoe-werkt-het",
  keywords: ["hoe werkt vakconnect", "aanvraagproces vakman", "klus matching"],
});

const faqItems = [
  {
    question: "Hoe start ik?",
    answer: "Je start via de aanvraagpagina en vult de gevraagde informatie in over je klus.",
  },
  {
    question: "Waarom vraagt VakConnect om details?",
    answer: "Hoe duidelijker je aanvraag, hoe beter de matching met een passende vakman.",
  },
  {
    question: "Krijgt elke aanvraag direct een match?",
    answer: "Niet altijd. Beschikbaarheid en geschiktheid verschillen per klus en regio.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="container-shell space-y-10 py-14">
      <nav className="text-sm text-muted-foreground"><Link href="/">Home</Link> / Hoe het werkt</nav>
      <section className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight">Hoe werkt VakConnect?</h1>
        <p className="max-w-3xl text-muted-foreground">
          VakConnect verbindt consumenten en vakbedrijven via een duidelijke intake, relevante matching en heldere opvolging.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-3"><h2 className="text-2xl font-semibold">1. Aanvraag plaatsen</h2><p className="text-sm leading-7 text-muted-foreground">Via <Link href="/aanvraag" className="text-primary underline">/aanvraag</Link> beschrijf je de klus, planning en locatie.</p></Card>
        <Card className="space-y-3"><h2 className="text-2xl font-semibold">2. Informatie en foto’s toevoegen</h2><p className="text-sm leading-7 text-muted-foreground">Je kunt extra context geven met dienstspecifieke antwoorden en optioneel foto’s.</p></Card>
        <Card className="space-y-3"><h2 className="text-2xl font-semibold">3. Passende vakman zoeken</h2><p className="text-sm leading-7 text-muted-foreground">VakConnect kijkt naar type klus, regio en intakekwaliteit om een passende professional te selecteren.</p></Card>
        <Card className="space-y-3"><h2 className="text-2xl font-semibold">4. Contact</h2><p className="text-sm leading-7 text-muted-foreground">Bij een match kan een aangesloten vakman contact opnemen om de klus te bespreken.</p></Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="text-2xl font-semibold">Wat VakConnect wel en niet doet</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Wel: intake structureren en gericht koppelen.</li>
            <li>• Wel: gegevens verwerken voor matching en opvolging.</li>
            <li>• Niet: zelf het uitvoerende vakwerk doen.</li>
            <li>• Niet: garanderen dat elke aanvraag direct wordt opgepakt.</li>
          </ul>
        </Card>
        <Card className="space-y-3">
          <h2 className="text-2xl font-semibold">Privacy</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            Gegevens worden privacybewust verwerkt voor intake en matching. Lees meer op de <Link className="text-primary underline" href="/privacy">privacypagina</Link>.
          </p>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {faqItems.map((item) => (
            <Card key={item.question} className="space-y-2">
              <h3 className="font-semibold">{item.question}</h3>
              <p className="text-sm text-muted-foreground">{item.answer}</p>
            </Card>
          ))}
        </div>
      </section>

      <Card className="space-y-4 bg-primary text-primary-foreground">
        <h2 className="text-2xl font-semibold">Klaar om te starten?</h2>
        <p className="text-sm text-primary-foreground/90">Plaats je aanvraag of bekijk eerst de beschikbare diensten.</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/aanvraag" className={buttonClassName({ variant: "secondary", className: "border-white/20 bg-white text-primary" })}>Aanvraag starten</Link>
          <Link href="/diensten" className={buttonClassName({ variant: "secondary", className: "border-white/50 bg-transparent text-white hover:bg-white/10" })}>Bekijk diensten</Link>
          <Link href="/voor-vakmannen" className={buttonClassName({ variant: "secondary", className: "border-white/50 bg-transparent text-white hover:bg-white/10" })}>Voor vakmannen</Link>
        </div>
      </Card>
    </div>
  );
}
