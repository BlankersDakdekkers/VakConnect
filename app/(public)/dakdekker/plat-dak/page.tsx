import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/config/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Plat dak laten repareren of vernieuwen",
  description: "Hulp nodig bij een plat dak? Lees opties voor onderhoud, herstel en vernieuwing via VakConnect.",
  path: "/dakdekker/plat-dak",
});

export default function FlatRoofPage() {
  return (
    <div className="container-shell space-y-8 py-14">
      <nav className="text-sm text-muted-foreground"><Link href="/">Home</Link> / <Link href="/dakdekker">Dakdekker</Link> / Plat dak</nav>
      <h1 className="text-4xl font-semibold tracking-tight">Plat dak: vind via VakConnect een passende professional</h1>
      <Card className="space-y-3"><h2 className="text-2xl font-semibold">Typische werkzaamheden</h2><p className="text-sm text-muted-foreground">Inspectie, reparatie van naden, vernieuwen van dakbedekking en verbeteren van afwatering.</p></Card>
      <Card className="space-y-3"><h2 className="text-2xl font-semibold">Aandachtspunten</h2><p className="text-sm text-muted-foreground">Geef aan welk materiaal op het dak ligt (zoals bitumen of EPDM) en waar klachten zichtbaar zijn.</p></Card>
      <Card className="space-y-3"><h2 className="text-2xl font-semibold">FAQ</h2><h3 className="font-semibold">Hoe vaak is controle nodig?</h3><p className="text-sm text-muted-foreground">Regelmatige inspectie helpt slijtage en verstoppingen vroeg te signaleren, zeker na zware regen.</p></Card>
      <div className="flex gap-3"><Link href="/aanvraag" className={buttonClassName({ variant: "primary" })}>Vraag hulp aan</Link><Link href="/dakdekker/daklekkage" className={buttonClassName({ variant: "secondary" })}>Lekkage-info</Link></div>
    </div>
  );
}
