import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buildPageMetadata } from "@/lib/config/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy",
  description: "Lees hoe VakConnect persoonsgegevens gebruikt voor aanvraagintake, matching en opvolging.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="container-shell space-y-8 py-14">
      <nav className="text-sm text-muted-foreground"><Link href="/">Home</Link> / Privacy</nav>
      <h1 className="text-4xl font-semibold tracking-tight">Privacy</h1>
      <Card className="space-y-3 text-sm leading-7 text-muted-foreground">
        <p>VakConnect verwerkt persoonsgegevens alleen voor het behandelen van aanvragen, matching en opvolging tussen consument en vakman.</p>
        <p>Gegevens worden niet gebruikt voor verzonnen social proof of ongewenste publicatie en blijven onderdeel van een afgeschermd proces.</p>
      </Card>
    </div>
  );
}
