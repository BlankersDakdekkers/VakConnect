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
        <p>VakConnect gebruikt de gegevens die je bij een aanvraag invult om die aanvraag te verwerken, passende vakmannen te zoeken en eventueel contact mogelijk te maken.</p>
        <p>Je gegevens zijn niet publiek zichtbaar. Afhankelijk van de aanvraagflow kunnen relevante gegevens beschikbaar komen voor vakmannen aan wie de aanvraag wordt aangeboden of die deze oppakken. We beloven daarom niet dat gegevens nooit worden gedeeld.</p>
        <p>Een aanvraag plaatsen is gratis. Je beslist zelf of je met een vakman verdergaat. Neem bij vragen contact met ons op via <Link className="text-primary underline underline-offset-4" href="/contact">de contactpagina</Link>.</p>
      </Card>
    </div>
  );
}
