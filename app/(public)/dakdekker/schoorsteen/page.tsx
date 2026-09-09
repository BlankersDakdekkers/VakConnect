import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/config/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Schoorsteenwerk via een dakprofessional",
  description: "Schoorsteen laten herstellen of controleren? Plaats een gerichte aanvraag via VakConnect.",
  path: "/dakdekker/schoorsteen",
});

export default function ChimneyWorkPage() {
  return (
    <div className="container-shell space-y-8 py-14">
      <nav className="text-sm text-muted-foreground"><Link href="/">Home</Link> / <Link href="/dakdekker">Dakdekker</Link> / Schoorsteen</nav>
      <h1 className="text-4xl font-semibold tracking-tight">Schoorsteenwerk nodig? Vind een passende vakman via VakConnect</h1>
      <Card className="space-y-3"><h2 className="text-2xl font-semibold">Veelvoorkomende klussen</h2><p className="text-sm text-muted-foreground">Herstel van loodslabben, opnieuw voegen, reparatie van scheuren en het waterdicht maken van details.</p></Card>
      <Card className="space-y-3"><h2 className="text-2xl font-semibold">Informatie voor een sterke aanvraag</h2><p className="text-sm text-muted-foreground">Beschrijf de zichtbare schade, hoogte van het dak en voeg foto’s toe voor een beter eerste beeld.</p></Card>
      <Card className="space-y-3"><h2 className="text-2xl font-semibold">FAQ</h2><h3 className="font-semibold">Valt schoorsteenwerk onder dakwerk?</h3><p className="text-sm text-muted-foreground">Vaak wel, omdat aansluitingen met het dak bepalend zijn voor waterdichtheid.</p></Card>
      <div className="flex gap-3"><Link href="/aanvraag" className={buttonClassName({ variant: "primary" })}>Aanvraag starten</Link><Link href="/dakdekker" className={buttonClassName({ variant: "secondary" })}>Terug naar overzicht</Link></div>
    </div>
  );
}
