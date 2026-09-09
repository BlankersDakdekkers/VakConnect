import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/config/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Over VakConnect",
  description: "Waarom VakConnect bestaat en hoe het platform consumenten en vakbedrijven slimmer met elkaar verbindt.",
  path: "/over-vakconnect",
  keywords: ["over vakconnect", "vakconnect missie", "vakman platform"],
});

export default function AboutPage() {
  return (
    <div className="container-shell space-y-10 py-14">
      <nav className="text-sm text-muted-foreground"><Link href="/">Home</Link> / Over VakConnect</nav>
      <section className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight">Over VakConnect</h1>
        <p className="max-w-3xl text-muted-foreground">VakConnect bestaat om vraag en aanbod in de vakmarkt duidelijker en slimmer met elkaar te verbinden.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="text-2xl font-semibold">Waarom VakConnect is gestart</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            Veel consumenten weten niet goed welke vakman past bij hun klus. Aan de andere kant ontvangen vakbedrijven vaak onvolledige aanvragen.
          </p>
        </Card>
        <Card className="space-y-3">
          <h2 className="text-2xl font-semibold">Onze aanpak</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            Met een duidelijke intake, relevante matching en professionele digitale infrastructuur wil VakConnect betere matches mogelijk maken.
          </p>
        </Card>
      </section>

      <Card className="space-y-4 bg-primary text-primary-foreground">
        <h2 className="text-2xl font-semibold">Klaar om je klus te starten?</h2>
        <div>
          <Link href="/aanvraag" className={buttonClassName({ variant: "secondary", className: "border-white/20 bg-white text-primary" })}>Vind een vakman</Link>
        </div>
      </Card>
    </div>
  );
}
