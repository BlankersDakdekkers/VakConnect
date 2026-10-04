import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FormField } from "@/components/ui/form-field";
import { FaqList } from "@/components/public/faq-list";
import { TrackedLink } from "@/components/public/tracked-link";
import { ProcessSteps } from "@/components/public/process-steps";
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
    <div className="space-y-12 pb-12 sm:space-y-16 sm:pb-16">
      <section className="public-hero">
        <div className="container-shell">
          <div className="max-w-3xl space-y-5">
            <p className="text-sm font-medium text-muted-foreground">Voor je klus, in jouw regio</p>
            <div className="space-y-2">
              <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Vind de juiste vakman voor jouw klus
              </h1>
              <p className="max-w-prose text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                Beschrijf je klus. VakConnect zoekt passende vakmensen in jouw regio. Jij bespreekt de mogelijkheden en beslist zelf.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <TrackedLink
                href="/aanvraag"
                ctaId="home_hero_request"
                ctaLocation="hero"
                destinationType="request"
                experimentSlot="homepage.hero.cta"
                experimentLabels={{ variant_b: "Start je aanvraag" }}
                className={buttonClassName({ variant: "primary", size: "lg", className: "w-full sm:w-auto" })}
              >
                Plaats je klus
              </TrackedLink>
              <Link href="/hoe-werkt-het" className={buttonClassName({ variant: "ghost", size: "lg", className: "w-full sm:w-auto" })}>
                Bekijk hoe het werkt
              </Link>
            </div>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground" aria-label="Wat je kunt verwachten">
              <li>Gratis aanvraag</li>
              <li>Geen verplichting</li>
              <li>Jij kiest hoe je verdergaat</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="hoe-het-werkt" className="container-shell space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight">Van klus naar gesprek</h2>
          <p className="max-w-2xl text-muted-foreground">Je begint met de informatie die nodig is om een passende vakman te vinden.</p>
        </div>
        <ProcessSteps steps={processSteps} />
      </section>

      <section id="diensten" className="container-shell space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight">Waar kunnen we je bij helpen?</h2>
          <p className="max-w-2xl text-muted-foreground">Bekijk de vakgebieden en voorbeelden van klussen die daarbij passen.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {popularServices.map((service) => (
            <TrackedLink key={service.href} href={service.href} ctaId={`service_${service.href.split("/").filter(Boolean)[0]}`} ctaLocation="service_card" destinationType="service" serviceSlug={service.href.split("/").filter(Boolean)[0]} className="service-card group">
              <Card className="flex h-full flex-col items-start gap-3 transition-colors group-hover:border-muted-foreground">
                <h3 className="text-xl font-semibold tracking-tight">{service.title}</h3>
                <p className="flex-1 text-sm leading-6 text-muted-foreground">{service.description}</p>
                <span className="inline-flex min-h-11 items-center text-sm font-medium text-foreground">
                  Bekijk {service.title.toLowerCase()} <span aria-hidden="true" className="ml-2">→</span>
                </span>
              </Card>
            </TrackedLink>
          ))}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/diensten" className={buttonClassName({ variant: "ghost" })}>
            Bekijk alle diensten
          </Link>
        </div>
        {services.length ? (
          <div className="space-y-5 border-t pt-6">
            <div className="space-y-1">
              <h3 className="text-xl font-semibold tracking-tight">Weet je al welke dienst je nodig hebt?</h3>
              <p className="text-sm leading-6 text-muted-foreground">Kies je dienst en postcode. We nemen deze gegevens mee naar je aanvraag.</p>
            </div>
            <form action="/aanvraag" method="get" className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]">
              <FormField id="dienst" label="Dienst">
                <Select id="dienst" name="dienst">
                  <option value="">Kies een dienst</option>
                  {services.map((service) => <option key={service.id} value={service.slug}>{service.name}</option>)}
                </Select>
              </FormField>
              <FormField id="postcode" label="Postcode">
                <Input id="postcode" name="postcode" placeholder="1234 AB" autoComplete="postal-code" autoCapitalize="characters" />
              </FormField>
              <button type="submit" className={buttonClassName({ variant: "secondary", size: "lg", className: "w-full sm:col-span-2 lg:col-span-1" })}>
                Ga verder met deze gegevens
              </button>
            </form>
          </div>
        ) : null}
      </section>

      <section className="container-shell space-y-6">
        <h2 className="text-3xl font-semibold tracking-tight">Een duidelijkere eerste stap naar vakwerk</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Minder zelf zoeken", "Je hoeft niet eerst meerdere bedrijven te bellen om uit te leggen wat er moet gebeuren."],
            ["Informatie op één plek", "Je zet locatie, klusdetails en gewenste timing bij elkaar in een aanvraag."],
            ["Jij houdt de regie", "VakConnect brengt je aanvraag onder de aandacht; jij bepaalt zelf of je afspraken maakt."],
          ].map(([title, description]) => (
            <div key={title} className="space-y-2 border-t pt-5">
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm leading-7 text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell space-y-4">
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
        <div className="space-y-5 border-y py-8">
          <p className="text-sm font-medium text-muted-foreground">Voor vakmensen</p>
          <h2 className="max-w-3xl text-3xl font-semibold tracking-tight">Ben je vakman? Ontvang opdrachten die beter bij je passen.</h2>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            Stel je diensten en werkgebied in, geef je beschikbaarheid aan en bekijk aanvragen die op die gegevens aansluiten.
          </p>
          <TrackedLink href="/voor-vakmannen" ctaId="home_professional_signup" ctaLocation="mid_content" destinationType="professional" className={buttonClassName({ variant: "secondary", size: "lg" })}>
            Meld je aan als vakman
          </TrackedLink>
        </div>
      </section>

      <section className="container-shell grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight">Zo zoekt VakConnect naar een passende aansluiting</h2>
          <p className="leading-7 text-muted-foreground">
            We vergelijken de gekozen dienst en postcode van je klus met de diensten en werkgebieden van actieve vakmannen.
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {["De dienst die je kiest", "De postcode van de klus", "De diensten van de vakman", "Het opgegeven werkgebied"].map((factor) => (
            <li key={factor} className="border-b py-3 text-sm font-medium">{factor}</li>
          ))}
        </ul>
      </section>

      <section className="container-shell">
        <Card className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Hoe VakConnect vertrouwen opbouwt</h2>
          <ul className="grid gap-2 text-sm leading-6 text-muted-foreground sm:grid-cols-2">
            <li>Je aanvraag begint met de klus en de regio.</li>
            <li>We beoordelen profielinformatie en relevante documenten waar die beschikbaar zijn.</li>
            <li>Een passende vakman kan de aanvraag ontvangen; beschikbaarheid verschilt.</li>
            <li>Je kiest zelf of je met een vakman verdergaat.</li>
          </ul>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
            Een profiel- of documentbeoordeling betekent dat de aangeleverde informatie is bekeken. Dat is geen garantie voor de uitvoering of kwaliteit van een klus.
          </p>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
            Bespreek verwachtingen, planning en afspraken rechtstreeks met de vakman.
          </p>
          <Link href="/aanmelden-vakman" className="text-sm font-medium text-primary underline underline-offset-4">Lees over aanmelden en beoordeling</Link>
        </Card>
      </section>

      <section id="faq" className="container-shell space-y-8">
        <h2 className="text-3xl font-semibold tracking-tight">Veelgestelde vragen</h2>
        <FaqList items={faqItems} />
      </section>

      <section className="container-shell">
        <div className="public-cta space-y-5">
          <h2 className="text-3xl font-semibold tracking-tight">Vertel wat er moet gebeuren</h2>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            Zet je klus op een rij. Daarna kan VakConnect zoeken naar een passende vakman in jouw regio.
          </p>
          <TrackedLink href="/aanvraag" ctaId="home_final_request" ctaLocation="final_cta" destinationType="request" className={buttonClassName({ variant: "primary", size: "lg", className: "w-full sm:w-auto" })}>
            Start je aanvraag
          </TrackedLink>
        </div>
      </section>
    </div>
  );
}
