import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/config/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Dakpannen vervangen via VakConnect",
  description: "Dakpannen vervangen? Lees waarop je let bij schade, materiaalkeuze en een complete aanvraag via VakConnect.",
  path: "/dakdekker/dakpannen-vervangen",
});

export default function RoofTilesPage() {
  return (
    <div className="container-shell space-y-8 py-14">
      <nav className="text-sm text-muted-foreground"><Link href="/">Home</Link> / <Link href="/dakdekker">Dakdekker</Link> / Dakpannen vervangen</nav>
      <h1 className="text-4xl font-semibold tracking-tight">Dakpannen vervangen? Vind een passende vakman via VakConnect</h1>
      <Card className="space-y-3"><h2 className="text-2xl font-semibold">Wanneer vervangen slim is</h2><p className="text-sm text-muted-foreground">Gebroken, verschoven of poreuze dakpannen vergroten de kans op lekkage en gevolgschade.</p></Card>
      <Card className="space-y-3"><h2 className="text-2xl font-semibold">Welke info helpt</h2><p className="text-sm text-muted-foreground">Noem het type pannendak, geschatte oppervlakte en of het om lokaal herstel of grotere vervanging gaat.</p></Card>
      <Card className="space-y-3"><h2 className="text-2xl font-semibold">FAQ</h2><h3 className="font-semibold">Kan ik losse pannen vervangen?</h3><p className="text-sm text-muted-foreground">Dat kan, maar bij brede slijtage kan een grotere aanpak op termijn verstandiger zijn.</p></Card>
      <div className="flex gap-3"><Link href="/aanvraag" className={buttonClassName({ variant: "primary" })}>Start aanvraag</Link><Link href="/dakdekker/dakrenovatie" className={buttonClassName({ variant: "secondary" })}>Ook dakrenovatie bekijken</Link></div>
    </div>
  );
}
