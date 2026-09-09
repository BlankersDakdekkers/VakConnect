import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonClassName } from "@/components/ui/button";
import { getActiveServices } from "@/lib/services/queries";

const howItWorks = [
  {
    title: "Vertel wat er moet gebeuren",
    description: "Omschrijf de klus, locatie en planning in een korte aanvraagfunnel.",
  },
  {
    title: "VakConnect controleert de aanvraag",
    description: "We beoordelen de aanvraag en bepalen welke vakmannen passen bij de klus en regio.",
  },
  {
    title: "Een passende vakman neemt contact op",
    description: "Een toegewezen vakman kan de aanvraag accepteren en rechtstreeks opvolgen.",
  },
];

const consumerBenefits = [
  "Eén duidelijke aanvraag in plaats van meerdere losse offertes",
  "Server-side gevalideerde leadaanvragen met veilige opslag van gegevens",
  "Regionale matching op basis van dienst en werkgebied",
  "Professionele opvolging vanuit een beheerd dashboard",
];

const faqItems = [
  {
    question: "Moet ik een account aanmaken om een aanvraag te doen?",
    answer: "Nee. In deze MVP dien je als consument zonder account een aanvraag in.",
  },
  {
    question: "Wanneer hoor ik iets na mijn aanvraag?",
    answer: "Eerst wordt de aanvraag gecontroleerd, daarna koppelt VakConnect een passende vakman waar mogelijk.",
  },
  {
    question: "Kan ik foto's meesturen?",
    answer: "Ja, je kunt optioneel meerdere afbeeldingen uploaden binnen veilige bestandstypen en limieten.",
  },
];

export default async function HomePage() {
  const services = await getActiveServices();
  const featuredServices = services.slice(0, 6);

  return (
    <div className="space-y-20 pb-20">
      <section className="border-b bg-[radial-gradient(circle_at_top,_rgba(15,118,110,0.12),_transparent_45%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
        <div className="container-shell grid gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
          <div className="space-y-6">
            <Badge className="border-primary/20 bg-primary/10 text-primary">Professionele lead marketplace basis</Badge>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                Vind de juiste vakman voor jouw klus.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Vertel wat er moet gebeuren en VakConnect koppelt je aan een geschikte vakman bij jou in de buurt.
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
          <Card className="space-y-5 bg-slate-950 text-slate-50 shadow-[0_25px_80px_rgba(15,23,42,0.18)]">
            <PageHeader
              eyebrow="MVP-focus"
              title="Schaalbaar fundament"
              description="VakConnect is vanaf dag één modulair opgezet voor leads, matching, dashboards, Supabase Auth en RLS."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/5 p-5">
                <p className="text-sm text-slate-300">Server-side autorisatie</p>
                <p className="mt-2 text-lg font-semibold">Admin en vakman beschermd</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-5">
                <p className="text-sm text-slate-300">Veilige opslag</p>
                <p className="mt-2 text-lg font-semibold">Leads en foto’s in Supabase</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section id="hoe-het-werkt" className="container-shell space-y-8">
        <PageHeader title="Hoe werkt VakConnect" description="Een heldere leadflow voor consumenten, beheerders en vakmannen." />
        <div className="grid gap-4 md:grid-cols-3">
          {howItWorks.map((item, index) => (
            <Card key={item.title} className="space-y-3">
              <Badge>{`Stap ${index + 1}`}</Badge>
              <h2 className="text-xl font-semibold tracking-tight">{item.title}</h2>
              <p className="text-sm leading-7 text-muted-foreground">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="diensten" className="container-shell space-y-8">
        <PageHeader title="Populaire diensten" description="Actieve diensten worden rechtstreeks vanuit de database geladen." />
        {featuredServices.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featuredServices.map((service) => (
              <Card key={service.id} className="space-y-3">
                <Badge>{service.category}</Badge>
                <h2 className="text-xl font-semibold tracking-tight">{service.name}</h2>
                <p className="text-sm text-muted-foreground">{service.description ?? "Beschikbaar voor intake en handmatige matching."}</p>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nog geen actieve diensten zichtbaar"
            description="Voer eerst de Supabase-migratie uit en activeer diensten om deze sectie te vullen."
          />
        )}
      </section>

      <section className="container-shell grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="space-y-5">
          <PageHeader title="Voordelen voor consumenten" description="Gebouwd voor duidelijkheid, veiligheid en snelle opvolging." />
          <ul className="space-y-3 text-sm leading-7 text-muted-foreground">
            {consumerBenefits.map((benefit) => (
              <li key={benefit} className="rounded-2xl bg-surface-muted px-4 py-3 text-foreground">
                {benefit}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="space-y-5">
          <PageHeader title="Vertrouwen vanaf de basis" description="Zonder verzonnen reviews of misleidende statistieken." />
          <p className="text-sm leading-7 text-muted-foreground">
            VakConnect gebruikt een gecontroleerde intake, server-side validatie, rolgebaseerde toegang en Supabase Row Level Security om persoonsgegevens en leadgegevens af te schermen.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-surface-muted px-4 py-4 text-sm">
              <p className="font-medium">Geen publieke leadinzage</p>
              <p className="mt-2 text-muted-foreground">Persoonsgegevens blijven afgeschermd voor bezoekers.</p>
            </div>
            <div className="rounded-2xl bg-surface-muted px-4 py-4 text-sm">
              <p className="font-medium">Toegang per rol</p>
              <p className="mt-2 text-muted-foreground">Vakmannen zien alleen hun eigen toegewezen leads.</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="container-shell">
        <Card className="space-y-5 bg-primary text-primary-foreground">
          <PageHeader
            title="Werk jij als vakman of vakbedrijf?"
            description="VakConnect is voorbereid op onboarding, leadtoewijzing en een beschermd dashboard voor jouw opdrachten."
          />
          <div>
            <Link href="/voor-vakmannen" className={buttonClassName({ variant: "secondary", size: "lg", className: "border-white/20 bg-white text-primary hover:bg-slate-100" })}>
              Meer voor vakmannen
            </Link>
          </div>
        </Card>
      </section>

      <section id="faq" className="container-shell space-y-8">
        <PageHeader title="Veelgestelde vragen" description="Heldere verwachtingen voor de eerste VakConnect-fase." />
        <div className="grid gap-4 md:grid-cols-3">
          {faqItems.map((item) => (
            <Card key={item.question} className="space-y-3">
              <h2 className="text-lg font-semibold tracking-tight">{item.question}</h2>
              <p className="text-sm leading-7 text-muted-foreground">{item.answer}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
