import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/config/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Dakdekker nodig? Vind een passende vakman via VakConnect",
  description: "Dakdekker nodig? Ontdek welke dakwerken mogelijk zijn en plaats een duidelijke aanvraag via VakConnect.",
  path: "/dakdekker",
  keywords: ["dakdekker", "daklekkage", "dakrenovatie", "plat dak"],
});

const subServices = [
  { href: "/dakdekker/daklekkage", title: "Daklekkage" },
  { href: "/dakdekker/dakrenovatie", title: "Dakrenovatie" },
  { href: "/dakdekker/dakpannen-vervangen", title: "Dakpannen vervangen" },
  { href: "/dakdekker/plat-dak", title: "Plat dak" },
  { href: "/dakdekker/schoorsteen", title: "Schoorsteenwerk" },
];

const faqItems = [
  { question: "Wanneer schakel je een dakdekker in?", answer: "Bij lekkage, slijtage, renovatie, onderhoud of vervanging van dakdelen." },
  { question: "Kan ik spoedhulp aanvragen?", answer: "Ja, vermeld spoed duidelijk in je aanvraag zodat een passende vakman dit direct ziet." },
  { question: "Wat moet ik invullen voor een goede aanvraag?", answer: "Type dak, probleemomschrijving, locatie, foto’s en gewenste planning." },
];

export default function RooferPage() {
  return (
    <div className="container-shell space-y-10 py-14">
      <nav className="text-sm text-muted-foreground"><Link href="/">Home</Link> / <Link href="/diensten">Diensten</Link> / Dakdekker</nav>
      <section className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight">Dakdekker nodig? Vind een passende vakman via VakConnect</h1>
        <p className="max-w-3xl text-muted-foreground">
          Voor dakproblemen of geplande dakwerken kun je via VakConnect een aanvraag plaatsen die aansluit op je situatie.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-3"><h2 className="text-2xl font-semibold">Waarvoor kun je een dakdekker inschakelen?</h2><p className="text-sm text-muted-foreground">Van lekkageherstel tot renovatie en onderhoud aan pannendaken, platte daken en schoorstenen.</p></Card>
        <Card className="space-y-3"><h2 className="text-2xl font-semibold">Soorten dakwerk</h2><p className="text-sm text-muted-foreground">De juiste aanpak hangt af van het type dak, de staat van materialen en de urgentie.</p></Card>
        <Card className="space-y-3"><h2 className="text-2xl font-semibold">Daklekkage</h2><p className="text-sm text-muted-foreground">Snelle diagnose en herstel zijn vaak belangrijk om gevolgschade te beperken.</p></Card>
        <Card className="space-y-3"><h2 className="text-2xl font-semibold">Dakrenovatie</h2><p className="text-sm text-muted-foreground">Bij ouderdom of structurele slijtage kan renovatie op langere termijn voordeliger zijn.</p></Card>
        <Card className="space-y-3"><h2 className="text-2xl font-semibold">Dakpannen vervangen</h2><p className="text-sm text-muted-foreground">Losliggende, gebroken of poreuze pannen vragen om tijdige vervanging.</p></Card>
        <Card className="space-y-3"><h2 className="text-2xl font-semibold">Plat dak en schoorsteenwerk</h2><p className="text-sm text-muted-foreground">Bitumen, EPDM en lood-/voegwerk vragen specialistische kennis en veilige uitvoering.</p></Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Meer over specifieke dakklussen</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {subServices.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-2xl border bg-surface px-4 py-3 text-sm font-medium transition hover:bg-surface-muted">
              {item.title}
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="text-2xl font-semibold">Hoe VakConnect werkt</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            Je beschrijft je dakklus via <Link href="/aanvraag" className="text-primary underline">de aanvraagflow</Link>. Daarna koppelt VakConnect je aanvraag aan een passende vakman in de regio.
          </p>
        </Card>
        <Card className="space-y-3">
          <h2 className="text-2xl font-semibold">Wat een goede aanvraag bevat</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Type dak en huidige situatie</li>
            <li>• Duidelijke omschrijving van het probleem</li>
            <li>• Eventuele foto’s van schade of bereikbaarheid</li>
            <li>• Gewenste planning en spoedindicatie</li>
          </ul>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-3"><h2 className="text-2xl font-semibold">Kostenfactoren</h2><p className="text-sm text-muted-foreground">Kosten hangen onder meer af van materiaal, omvang, hoogte, bereikbaarheid en urgentie. Lees ook <Link href="/kosten" className="text-primary underline">/kosten</Link>.</p></Card>
        <Card className="space-y-3"><h2 className="text-2xl font-semibold">Spoed</h2><p className="text-sm text-muted-foreground">Bij spoedsituaties helpt een duidelijke melding in je aanvraag om sneller de juiste vakman te vinden.</p></Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {faqItems.map((item) => (
            <Card key={item.question} className="space-y-2"><h3 className="font-semibold">{item.question}</h3><p className="text-sm text-muted-foreground">{item.answer}</p></Card>
          ))}
        </div>
      </section>

      <Link href="/aanvraag" className={buttonClassName({ variant: "primary", size: "lg" })}>Vraag een dakdekker aan</Link>
    </div>
  );
}
