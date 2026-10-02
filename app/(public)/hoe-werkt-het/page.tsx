import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";
import { FaqList } from "@/components/public/faq-list";
import { ProcessSteps } from "@/components/public/process-steps";
import { buildPageMetadata } from "@/lib/config/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Hoe VakConnect werkt",
  description: "Lees hoe je een klus aanvraagt, hoe VakConnect passende vakmensen zoekt en wat je daarna zelf beslist.",
  path: "/hoe-werkt-het",
  keywords: ["hoe werkt vakconnect", "vakman aanvragen", "klus aanmelden"],
});

const steps = [
  {
    title: "Beschrijf je klus",
    description: "Kies een dienst en vertel wat er moet gebeuren, waar de klus is en wanneer je hulp zoekt. Per dienst kunnen aanvullende vragen volgen.",
  },
  {
    title: "We zoeken een passende aansluiting",
    description: "De soort klus en je regio zijn het vertrekpunt. Ook specialisatie, beschikbaarheid en profielinformatie spelen mee.",
  },
  {
    title: "Een vakman neemt contact op",
    description: "Als een vakman de aanvraag oppakt, bespreek je rechtstreeks de situatie, planning en mogelijke aanpak.",
  },
  {
    title: "Jij kiest wat je doet",
    description: "Vraag waar nodig om een voorstel en maak zelf afspraken met de vakman. Je bent nergens toe verplicht.",
  },
];

const faqItems = [
  {
    question: "Krijgt iedere aanvraag een match?",
    answer: "Niet altijd. Dat hangt onder meer af van de dienst, de regio en de beschikbaarheid van passende vakmensen.",
  },
  {
    question: "Hoe snel hoor ik iets?",
    answer: "De reactietijd verschilt. We kunnen geen vaste termijn beloven; een vakman neemt contact op als die de aanvraag oppakt.",
  },
  {
    question: "Wat kost mijn aanvraag?",
    answer: "Een aanvraag plaatsen is gratis voor consumenten. De prijs voor de uitvoering spreek je af met de vakman.",
  },
  {
    question: "Moet ik het voorstel accepteren?",
    answer: "Nee. Je beslist zelf of je met een vakman verdergaat en welke afspraken je maakt.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="container-shell space-y-12 py-10 sm:py-14">
      <nav className="text-sm text-muted-foreground" aria-label="Broodkruimel">
        <Link href="/">Home</Link> / Hoe het werkt
      </nav>
      <section className="space-y-4">
        <p className="text-sm font-medium text-primary">Voor consumenten</p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance">Zo vind je via VakConnect een vakman voor je klus</h1>
        <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
          Je hoeft niet eerst zelf uit te zoeken welk bedrijf je moet bellen. Beschrijf je klus; VakConnect gebruikt je aanvraag om passende vakmensen in jouw regio te vinden.
        </p>
        <Link href="/aanvraag" className={buttonClassName({ variant: "primary", size: "lg" })}>Plaats je klus</Link>
      </section>

      <section className="space-y-5">
        <h2 className="text-3xl font-semibold tracking-tight">Van aanvraag tot afspraak</h2>
        <ProcessSteps steps={steps} columns={4} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-4">
          <h2 className="text-2xl font-semibold">Wat VakConnect doet</h2>
          <ul className="space-y-2 text-sm leading-7 text-muted-foreground">
            <li>• Je aanvraag structureren zodat de klus duidelijker is.</li>
            <li>• De gekozen dienst en regio meenemen bij het zoeken.</li>
            <li>• Aanvragen tonen aan vakmensen voor wie de klus relevant kan zijn.</li>
            <li>• Vakmensen hun diensten, werkgebied en beschikbaarheid laten beheren.</li>
          </ul>
        </Card>
        <Card className="space-y-4">
          <h2 className="text-2xl font-semibold">Wat VakConnect niet doet</h2>
          <ul className="space-y-2 text-sm leading-7 text-muted-foreground">
            <li>• De klus zelf uitvoeren.</li>
            <li>• De uiteindelijke prijs of offerte voor je bepalen.</li>
            <li>• Garanderen dat iedere aanvraag direct wordt opgepakt.</li>
            <li>• In jouw plaats kiezen of afspraken maken met een vakman.</li>
          </ul>
          <p className="text-sm leading-7 text-muted-foreground">
            Je bespreekt de uitvoering, planning en prijs rechtstreeks met de vakman. Lees ook ons <Link className="text-primary underline underline-offset-4" href="/privacy">privacybeleid</Link>.
          </p>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Voor wie is dit handig?</h2>
        <p className="max-w-3xl leading-7 text-muted-foreground">
          Voor wie een klus heeft en liever één duidelijke aanvraag opstelt dan zelf meerdere bedrijven benadert. Ook als je nog aan het oriënteren bent, kun je je situatie beschrijven; afspraken over prijs en uitvoering maak je pas rechtstreeks met een vakman.
        </p>
        <Link href="/diensten" className={buttonClassName({ variant: "secondary" })}>Bekijk de vakgebieden</Link>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Veelgestelde vragen</h2>
        <FaqList items={faqItems} />
      </section>

      <Card className="space-y-4 bg-primary text-primary-foreground">
        <h2 className="text-2xl font-semibold">Klaar om je klus te beschrijven?</h2>
        <p className="text-sm text-primary-foreground/90">Plaats gratis je aanvraag en bespreek de mogelijkheden zelf met een vakman.</p>
        <Link href="/aanvraag" className={buttonClassName({ variant: "secondary", size: "lg", className: "border-white/20 bg-white text-primary" })}>Plaats je klus</Link>
      </Card>
    </div>
  );
}
