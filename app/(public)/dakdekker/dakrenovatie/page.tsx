import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/config/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Dakrenovatie plannen met een passende professional",
  description: "Overweeg je dakrenovatie? Lees wanneer renovatie logisch is en hoe je de klus duidelijk aanvraagt via VakConnect.",
  path: "/dakdekker/dakrenovatie",
});

export default function RoofRenovationPage() {
  return (
    <div className="container-shell space-y-8 py-14">
      <nav className="text-sm text-muted-foreground"><Link href="/">Home</Link> / <Link href="/dakdekker">Dakdekker</Link> / Dakrenovatie</nav>
      <h1 className="text-4xl font-semibold tracking-tight">Dakrenovatie nodig? Start via VakConnect</h1>
      <Card className="space-y-3"><h2 className="text-2xl font-semibold">Wanneer renovatie vaak nodig is</h2><p className="text-sm text-muted-foreground">Bij verouderde dakbedekking, terugkerende lekkages of afnemende isolatiewaarde is renovatie vaak een logische stap.</p></Card>
      <Card className="space-y-3"><h2 className="text-2xl font-semibold">Voorbereiding</h2><p className="text-sm text-muted-foreground">Vermeld type dak, huidige staat, bereikbaarheid en of je ook isolatie of afwerking wilt meenemen.</p></Card>
      <Card className="space-y-3"><h2 className="text-2xl font-semibold">FAQ</h2><h3 className="font-semibold">Is renovatie hetzelfde als reparatie?</h3><p className="text-sm text-muted-foreground">Nee. Reparatie pakt een lokaal probleem aan, renovatie kijkt breder naar levensduur en opbouw van het dak.</p></Card>
      <div className="flex gap-3"><Link href="/aanvraag" className={buttonClassName({ variant: "primary" })}>Aanvraag dakrenovatie</Link><Link href="/kosten" className={buttonClassName({ variant: "secondary" })}>Kostenfactoren</Link></div>
    </div>
  );
}
