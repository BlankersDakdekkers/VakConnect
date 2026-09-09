import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/config/site";
import { getActiveServices } from "@/lib/services/queries";

const serviceDetailRoutes: Record<string, string> = {
  dakdekker: "/dakdekker",
  schilder: "/schilder",
  loodgieter: "/loodgieter",
  elektricien: "/elektricien",
  isolatie: "/isolatie",
  "badkamer-verbouwen": "/badkamer",
};

export const metadata: Metadata = buildPageMetadata({
  title: "Vind de juiste vakman",
  description:
    "Vind de juiste vakman voor jouw klus. Vertel wat er moet gebeuren en VakConnect koppelt jouw aanvraag aan een passende vakman in de buurt.",
  path: "/",
  keywords: ["vakman vinden", "vakman aanvragen", "lokale vakman", "VakConnect"],
});

const processSteps = [
  {
    title: "Vertel wat er moet gebeuren",
    description: "Je omschrijft de klus, gewenste timing en locatie in één duidelijke aanvraag.",
  },
  {
    title: "Wij zoeken een passende vakman",
    description: "Op basis van dienst, regio en intake-informatie koppelen we jouw aanvraag gericht door.",
  },
  {
    title: "Kom in contact",
    description: "Een aangesloten professional kan je aanvraag oppakken en rechtstreeks contact opnemen.",
  },
];

const consumerBenefits = [
  "Één duidelijke aanvraag in plaats van losse belrondes.",
  "Passende vakman in jouw regio op basis van relevante intake.",
  "Ruimte voor foto’s en klusdetails voor betere opvolging.",
  "Geen eindeloos zelf zoeken naar beschikbare partijen.",
  "Heldere vervolgstappen na het versturen van je aanvraag.",
];

const trustPoints = [
  "Duidelijke aanvraagstructuur",
  "Privacybewuste verwerking van gegevens",
  "Focus op relevante klusinformatie",
  "Lokale matching op dienst en regio",
  "Transparant proces zonder nepclaims",
];

const faqItems = [
  {
    question: "Hoe werkt VakConnect?",
    answer:
      "Je plaatst één aanvraag met klusdetails. Daarna koppelt VakConnect de aanvraag aan een passende vakman op basis van dienst en regio.",
  },
  {
    question: "Kost een aanvraag plaatsen geld?",
    answer: "Voor consumenten is het plaatsen van een aanvraag in deze fase kosteloos.",
  },
  {
    question: "Hoe snel neemt een vakman contact op?",
    answer:
      "Dat verschilt per klus en beschikbaarheid. Na je aanvraag wordt eerst beoordeeld welke vakman het best past.",
  },
  {
    question: "Welke informatie moet ik invullen?",
    answer:
      "Je vult in ieder geval de soort klus, locatie en contactgegevens in. Per dienst kunnen aanvullende vragen worden gesteld.",
  },
  {
    question: "Kan ik foto’s toevoegen?",
    answer: "Ja, je kunt foto’s toevoegen om de situatie duidelijker te maken voor de vakman.",
  },
  {
    question: "Wat gebeurt er met mijn gegevens?",
    answer: "VakConnect verwerkt je gegevens alleen voor intake, matching en opvolging van je aanvraag.",
  },
  {
    question: "Welke vakgebieden ondersteunt VakConnect?",
    answer: "Je vindt het actuele aanbod op de dienstenpagina, waaronder dakwerk en andere woningdiensten.",
  },
];

export default async function HomePage() {
  const services = await getActiveServices();
  const featuredServices = services.slice(0, 6);

  return (
    <div className="space-y-20 pb-20">
      <section className="border-b bg-[radial-gradient(circle_at_top,_rgba(15,118,110,0.12),_transparent_45%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
        <div className="container-shell grid gap-8 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
          <div className="space-y-6">
            <Badge className="border-primary/20 bg-primary/10 text-primary">Professioneel platform voor vakwerk</Badge>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                Vind de juiste vakman voor jouw klus.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Vertel wat er moet gebeuren en VakConnect koppelt jouw aanvraag aan een passende vakman bij jou in de buurt.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/aanvraag" className={buttonClassName({ variant: "primary", size: "lg" })}>
                Vind een vakman
              </Link>
              <Link href="/voor-vakmannen" className={buttonClassName({ variant: "secondary", size: "lg" })}>
                Word VakConnect vakman
              </Link>
            </div>
          </div>
          <Card className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Start je aanvraag in 30 seconden</h2>
            <p className="text-sm text-muted-foreground">Kies alvast je dienst en postcode. Daarna ga je verder in de volledige aanvraagflow.</p>
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
                className="min-h-11 w-full rounded-2xl border bg-surface px-4 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button type="submit" className={buttonClassName({ variant: "primary", size: "lg", className: "w-full" })}>
                Naar aanvraag
              </button>
            </form>
          </Card>
        </div>
      </section>

      <section id="hoe-het-werkt" className="container-shell space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight">Zo werkt VakConnect</h2>
          <p className="text-sm text-muted-foreground">Een helder proces van aanvraag tot contact.</p>
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
          <h2 className="text-3xl font-semibold tracking-tight">Populaire diensten</h2>
          <p className="text-sm text-muted-foreground">Actieve diensten vanuit de bestaande service-architectuur.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featuredServices.map((service) => (
            <Card key={service.id} className="space-y-3">
              <Badge>{service.category}</Badge>
              <h3 className="text-xl font-semibold tracking-tight">{service.name}</h3>
              <p className="text-sm text-muted-foreground">{service.description ?? "Beschikbaar voor aanvraag via VakConnect."}</p>
              <Link href={serviceDetailRoutes[service.slug] ?? "/diensten"} className={buttonClassName({ variant: "secondary", size: "sm" })}>
                Bekijk dienst
              </Link>
            </Card>
          ))}
        </div>
        <Link href="/diensten" className={buttonClassName({ variant: "ghost" })}>
          Bekijk alle diensten
        </Link>
      </section>

      <section className="container-shell grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight">Waarom consumenten VakConnect gebruiken</h2>
          <ul className="space-y-3 text-sm leading-7 text-muted-foreground">
            {consumerBenefits.map((benefit) => (
              <li key={benefit} className="rounded-2xl bg-surface-muted px-4 py-3 text-foreground">
                {benefit}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight">Vertrouwen en duidelijkheid</h2>
          <p className="text-sm text-muted-foreground">Rustige, transparante aanpak zonder fictieve keurmerken of opgeblazen claims.</p>
          <ul className="space-y-3 text-sm leading-7 text-muted-foreground">
            {trustPoints.map((point) => (
              <li key={point} className="rounded-2xl bg-surface-muted px-4 py-3 text-foreground">
                {point}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="container-shell">
        <Card className="space-y-5 bg-primary text-primary-foreground">
          <h2 className="text-3xl font-semibold tracking-tight">Ontvang aanvragen die bij jouw bedrijf passen.</h2>
          <p className="max-w-2xl text-sm leading-7 text-primary-foreground/90">
            VakConnect helpt vakbedrijven aan relevante aanvragen op basis van dienst en werkgebied.
          </p>
          <div>
            <Link
              href="/voor-vakmannen"
              className={buttonClassName({ variant: "secondary", size: "lg", className: "border-white/25 bg-white text-primary hover:bg-slate-100" })}
            >
              Meer over VakConnect voor vakmannen
            </Link>
          </div>
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
    </div>
  );
}
