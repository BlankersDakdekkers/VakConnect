import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/config/site";
import { getPopularServiceClusters } from "@/lib/content/service-cards";
import { getActiveServices } from "@/lib/services/queries";

export const metadata: Metadata = buildPageMetadata({
  title: "Vind de juiste vakman voor jouw klus",
  description:
    "Plaats je klus en kom in contact met een passende vakman in jouw regio. VakConnect maakt het vinden van vakmensen eenvoudiger.",
  path: "/",
  keywords: ["vakman vinden", "vakman aanvragen", "lokale vakman", "VakConnect"],
});

const processSteps = [
  {
    title: "Vertel wat er moet gebeuren",
    description: "Beschrijf je klus, waar die is en wanneer je hulp zoekt.",
  },
  {
    title: "VakConnect zoekt passende vakmensen",
    description: "We kijken naar de dienst en het werkgebied. Je aanvraag komt zo bij relevante vakmensen terecht.",
  },
  {
    title: "Bespreek de klus en maak afspraken",
    description: "Een vakman kan contact met je opnemen. Jij bespreekt de aanpak en beslist zelf wat je doet.",
  },
];

const consumerBenefits = [
  "Je beschrijft je klus één keer in een centrale aanvraag.",
  "Je hoeft niet zelf tientallen bedrijven te bellen om te beginnen.",
  "De gekozen dienst en je regio helpen bepalen welke vakman past.",
  "Aanvullende klusdetails geven een vakman context voor het gesprek.",
];

const faqItems = [
  {
    question: "Hoe werkt VakConnect?",
    answer:
      "Je beschrijft je klus en locatie. VakConnect gebruikt die informatie om passende vakmensen te vinden. Als een vakman je aanvraag oppakt, bespreek je samen de vervolgstappen.",
  },
  {
    question: "Kost een aanvraag plaatsen geld?",
    answer: "Een aanvraag plaatsen is gratis. Je bent niet verplicht om met een vakman verder te gaan.",
  },
  {
    question: "Moet ik verplicht een vakman kiezen?",
    answer: "Nee. Je bespreekt de klus en eventuele kosten rechtstreeks met de vakman en beslist zelf of je afspraken maakt.",
  },
  {
    question: "Hoe wordt een vakman geselecteerd?",
    answer: "De matching houdt in ieder geval rekening met de soort klus en het werkgebied. Geschiktheid en beschikbaarheid spelen ook mee.",
  },
  {
    question: "Hoe snel krijg ik een reactie?",
    answer: "Dat verschilt per klus, regio en beschikbaarheid. We kunnen daarom geen vaste reactietijd beloven.",
  },
  {
    question: "Kan ik meerdere soorten klussen aanvragen?",
    answer: "Je aanvraag gaat over één dienst. Voor een andere soort klus kun je een aparte aanvraag starten.",
  },
  {
    question: "Werkt VakConnect door heel Nederland?",
    answer: "VakConnect werkt met regio’s en werkgebieden. Welke vakman beschikbaar is, verschilt per dienst en plaats.",
  },
];

export default async function HomePage() {
  const services = await getActiveServices();
  const popularServices = getPopularServiceClusters();

  return (
    <div className="space-y-16 pb-16 sm:space-y-20 sm:pb-20">
      <section className="border-b bg-[radial-gradient(circle_at_top,_rgba(15,118,110,0.12),_transparent_45%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
        <div className="container-shell grid gap-8 py-10 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
          <div className="space-y-5">
            <Badge className="border-primary/20 bg-primary/10 text-primary">Voor je klus, in jouw regio</Badge>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                Vind de juiste vakman voor jouw klus
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                Vertel wat er moet gebeuren en VakConnect koppelt jouw aanvraag aan een passende vakman bij jou in de buurt.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/aanvraag" className={buttonClassName({ variant: "primary", size: "lg" })}>
                Plaats je klus
              </Link>
              <Link href="/hoe-werkt-het" className={buttonClassName({ variant: "secondary", size: "lg" })}>
                Bekijk hoe het werkt
              </Link>
            </div>
            <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2" aria-label="Wat je kunt verwachten">
              <li>Je aanvraag plaatsen is gratis</li>
              <li>Je zit nergens aan vast</li>
              <li>Je regio telt mee</li>
              <li>Een aanvraag voor je klus</li>
            </ul>
          </div>
          <Card className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Waar heb je hulp bij nodig?</h2>
            <p className="text-sm text-muted-foreground">Kies een dienst en vul je postcode in. Daarna beschrijf je de klus.</p>
            <form action="/aanvraag" method="get" className="space-y-3">
              <label className="block text-sm font-medium text-foreground" htmlFor="dienst">
                Dienst
              </label>
              <select id="dienst" name="dienst" className="min-h-11 w-full rounded-2xl border bg-surface px-4 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20">
                <option value="">Kies een dienst</option>
                {services.map((service) => (
                  <option key={service.id} value={service.slug}>
                    {service.name}
                  </option>
                ))}
              </select>
              <label className="block text-sm font-medium text-foreground" htmlFor="postcode">
                Postcode
              </label>
              <input
                id="postcode"
                name="postcode"
                placeholder="1234 AB"
                autoComplete="postal-code"
                className="min-h-11 w-full rounded-2xl border bg-surface px-4 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button type="submit" className={buttonClassName({ variant: "primary", size: "lg", className: "w-full" })}>
                Beschrijf je klus
              </button>
            </form>
          </Card>
        </div>
      </section>

      <section className="container-shell grid gap-3 rounded-3xl border bg-surface-muted p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
        {[
          ["Eén aanvraag", "Beschrijf je klus op één plek."],
          ["Lokale aansluiting", "Je werkgebied helpt bij de matching."],
          ["Relevante informatie", "Geef details mee die ertoe doen."],
          ["Jij beslist", "Je maakt zelf afspraken met een vakman."],
        ].map(([title, description]) => (
          <div key={title} className="space-y-1">
            <h2 className="font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </section>

      <section id="hoe-het-werkt" className="container-shell space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight">Van klus naar gesprek</h2>
          <p className="max-w-2xl text-muted-foreground">Je begint met de informatie die nodig is om een passende vakman te vinden.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {processSteps.map((item, index) => (
            <Card key={item.title} className="space-y-3">
              <Badge>{`Stap ${index + 1}`}</Badge>
              <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
              <p className="text-sm leading-7 text-muted-foreground">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="diensten" className="container-shell space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight">Waar kunnen we je bij helpen?</h2>
          <p className="max-w-2xl text-muted-foreground">Bekijk de vakgebieden en voorbeelden van klussen die daarbij passen.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {popularServices.map((service) => (
            <Card key={service.href} className="flex flex-col items-start gap-3">
              <h3 className="text-xl font-semibold tracking-tight">{service.title}</h3>
              <p className="flex-1 text-sm leading-6 text-muted-foreground">{service.description}</p>
              <Link href={service.href} className={buttonClassName({ variant: "secondary", size: "sm" })}>
                Bekijk {service.title.toLowerCase()}
              </Link>
            </Card>
          ))}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/diensten" className={buttonClassName({ variant: "ghost" })}>
            Bekijk alle diensten
          </Link>
          <Link href="/aanvraag" className={buttonClassName({ variant: "primary" })}>
            Plaats je klus
          </Link>
        </div>
      </section>

      <section className="container-shell space-y-6">
        <h2 className="text-3xl font-semibold tracking-tight">Een duidelijkere eerste stap naar vakwerk</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Minder zelf zoeken", "Je hoeft niet eerst meerdere bedrijven te bellen om uit te leggen wat er moet gebeuren."],
            ["Informatie op één plek", "Je zet locatie, klusdetails en gewenste timing bij elkaar in een aanvraag."],
            ["Jij houdt de regie", "VakConnect brengt je aanvraag onder de aandacht; jij bepaalt zelf of je afspraken maakt."],
          ].map(([title, description]) => (
            <Card key={title} className="space-y-2">
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm leading-7 text-muted-foreground">{description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="container-shell space-y-4">
        <Badge className="border-primary/20 bg-primary/10 text-primary">Voor consumenten</Badge>
        <h2 className="text-3xl font-semibold tracking-tight">Minder zoeken. Duidelijker beginnen.</h2>
        <p className="max-w-3xl leading-7 text-muted-foreground">
          Je aanvraag bundelt wat je anders bij ieder bedrijf opnieuw moet uitleggen. Zo kan een vakman vooraf zien of je klus past bij het werk dat hij doet.
        </p>
        <ul className="grid gap-2 text-sm leading-6 text-muted-foreground sm:grid-cols-2">
          {consumerBenefits.map((benefit) => <li key={benefit}>• {benefit}</li>)}
        </ul>
        <Link href="/hoe-werkt-het" className={buttonClassName({ variant: "secondary" })}>Lees hoe het werkt</Link>
      </section>

      <section className="container-shell">
        <Card className="space-y-5 border-primary/20 bg-primary/5">
          <Badge className="border-primary/20 bg-primary/10 text-primary">Voor vakmensen</Badge>
          <h2 className="max-w-3xl text-3xl font-semibold tracking-tight">Ben je vakman? Ontvang opdrachten die beter bij je passen.</h2>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            Stel je diensten en werkgebied in, geef je beschikbaarheid aan en bekijk aanvragen die op die gegevens aansluiten.
          </p>
          <Link href="/voor-vakmannen" className={buttonClassName({ variant: "secondary", size: "lg" })}>
            Meld je aan als vakman
          </Link>
        </Card>
      </section>

      <section className="container-shell grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight">Matching begint bij jouw klus</h2>
          <p className="leading-7 text-muted-foreground">
            VakConnect kijkt naar de informatie in je aanvraag en de gegevens die vakmensen over hun bedrijf hebben ingevuld. Zo kan de selectie aansluiten op:
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {["Soort klus", "Regio en werkgebied", "Specialisatie", "Beschikbaarheid en capaciteit"].map((factor) => (
            <li key={factor} className="rounded-2xl border bg-surface-muted px-4 py-3 text-sm font-medium">{factor}</li>
          ))}
        </ul>
      </section>

      <section className="container-shell">
        <Card className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Zo houden we profielen zorgvuldig</h2>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
            Bij een aanmelding controleren we de ingevulde bedrijfsgegevens en beoordelen we het profiel voordat het wordt geactiveerd. Afhankelijk van het werk en de situatie kunnen aanvullende verificatie of documenten nodig zijn.
          </p>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
            Een controle is geen garantie voor de uitvoering of kwaliteit van iedere klus. Bespreek je verwachtingen en afspraken altijd rechtstreeks met de vakman.
          </p>
          <Link href="/aanmelden-vakman" className="text-sm font-medium text-primary underline underline-offset-4">Lees over aanmelden en beoordeling</Link>
        </Card>
      </section>

      <section id="faq" className="container-shell space-y-8">
        <h2 className="text-3xl font-semibold tracking-tight">Veelgestelde vragen</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {faqItems.map((item) => (
            <Card key={item.question} className="space-y-3">
              <h3 className="text-lg font-semibold tracking-tight">{item.question}</h3>
              <p className="text-sm leading-7 text-muted-foreground">{item.answer}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="container-shell">
        <Card className="space-y-5 bg-primary text-primary-foreground">
          <h2 className="text-3xl font-semibold tracking-tight">Vertel wat er moet gebeuren</h2>
          <p className="max-w-2xl text-sm leading-7 text-primary-foreground/90">
            Zet je klus op een rij. Daarna kan VakConnect zoeken naar een passende vakman in jouw regio.
          </p>
          <Link href="/aanvraag" className={buttonClassName({ variant: "secondary", size: "lg", className: "border-white/25 bg-white text-primary hover:bg-slate-100" })}>
            Plaats je klus
          </Link>
        </Card>
      </section>
    </div>
  );
}
