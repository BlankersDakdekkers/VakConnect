import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/config/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Daklekkage oplossen via een passende vakman",
  description: "Last van daklekkage? Lees oorzaken, aanpak en welke informatie helpt voor een snelle aanvraag via VakConnect.",
  path: "/dakdekker/daklekkage",
});

export default function RoofLeakPage() {
  return (
    <div className="container-shell space-y-8 py-14">
      <nav className="text-sm text-muted-foreground"><Link href="/">Home</Link> / <Link href="/dakdekker">Dakdekker</Link> / Daklekkage</nav>
      <h1 className="text-4xl font-semibold tracking-tight">Daklekkage? Vind via VakConnect een passende vakman</h1>
      <Card className="space-y-3"><h2 className="text-2xl font-semibold">Veelvoorkomende signalen</h2><p className="text-sm text-muted-foreground">Vochtplekken, druppelvorming, loslatend stucwerk en schimmel rond plafonds zijn bekende tekenen van lekkage.</p></Card>
      <Card className="space-y-3"><h2 className="text-2xl font-semibold">Wat helpt in je aanvraag</h2><p className="text-sm text-muted-foreground">Geef aan wanneer de lekkage optreedt, op welke plek, en voeg foto’s toe van binnen én buitenzijde als dat veilig kan.</p></Card>
      <Card className="space-y-3"><h2 className="text-2xl font-semibold">FAQ</h2><h3 className="font-semibold">Is daklekkage altijd spoed?</h3><p className="text-sm text-muted-foreground">Niet altijd, maar snel handelen voorkomt vaak extra schade. Vermeld spoed daarom duidelijk.</p></Card>
      <div className="flex gap-3"><Link href="/aanvraag" className={buttonClassName({ variant: "primary" })}>Start aanvraag</Link><Link href="/dakdekker" className={buttonClassName({ variant: "secondary" })}>Terug naar dakdekker</Link></div>
    </div>
  );
}
