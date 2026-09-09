import Link from "next/link";
import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/config/site";
import { getPublishedLocations } from "@/lib/content/locations";
import { hasPublishedLocalMainPage } from "@/lib/content/local-service-pages";

export const metadata: Metadata = buildPageMetadata({
  title: "Regio's en steden | VakConnect",
  description: "Overzicht van gepubliceerde steden voor lokale VakConnect dienstpagina's.",
  path: "/regios",
  keywords: ["regio", "steden", "lokale vakman", "VakConnect"],
});

export default function RegionsPage() {
  const locations = getPublishedLocations().sort((a, b) => a.name.localeCompare(b.name, "nl"));

  return (
    <div className="container-shell space-y-10 py-14">
      <section className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight text-balance">Regio&apos;s en steden op VakConnect</h1>
        <p className="max-w-3xl text-muted-foreground">
          Deze pagina toont de steden waarvoor lokale dienstpagina&apos;s expliciet zijn gepubliceerd. Nieuwe steden worden alleen toegevoegd na inhoudelijke controle op kwaliteit, relevantie en indexatiebeleid.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {locations.map((location) => (
          <Card key={location.slug} className="space-y-3">
            <h2 className="text-xl font-semibold">{location.name}</h2>
            <p className="text-sm text-muted-foreground">{location.province}{location.regionLabel ? ` · ${location.regionLabel}` : ""}</p>
            <p className="text-sm leading-7 text-muted-foreground">{location.introFacts[0]}</p>
            <div className="flex flex-wrap gap-2">
              <Link href={`/dakdekker/${location.slug}`} className={buttonClassName({ size: "sm", variant: "secondary" })}>Dakdekker</Link>
              {hasPublishedLocalMainPage("loodgieter", location.slug) ? (
                <Link href={`/loodgieter/${location.slug}`} className={buttonClassName({ size: "sm", variant: "secondary" })}>Loodgieter</Link>
              ) : null}
              {hasPublishedLocalMainPage("schilder", location.slug) ? (
                <Link href={`/schilder/${location.slug}`} className={buttonClassName({ size: "sm", variant: "secondary" })}>Schilder</Link>
              ) : null}
              {hasPublishedLocalMainPage("elektricien", location.slug) ? (
                <Link href={`/elektricien/${location.slug}`} className={buttonClassName({ size: "sm", variant: "secondary" })}>Elektricien</Link>
              ) : null}
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
