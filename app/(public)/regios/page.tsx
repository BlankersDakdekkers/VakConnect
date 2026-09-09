import Link from "next/link";
import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/config/site";
import { getPublishedLocationsGroupedByProvince } from "@/lib/seo/locations/queries";
import { hasPublishedLocalMainPage } from "@/lib/seo/local-pages/queries";

export const metadata: Metadata = buildPageMetadata({
  title: "Regio's en steden | VakConnect",
  description: "Overzicht van gepubliceerde steden voor lokale VakConnect dienstpagina's.",
  path: "/regios",
  keywords: ["regio", "steden", "lokale vakman", "VakConnect"],
});

export default async function RegionsPage() {
  const grouped = await getPublishedLocationsGroupedByProvince();

  return (
    <div className="container-shell space-y-10 py-14">
      <section className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight text-balance">Regio&apos;s en steden op VakConnect</h1>
        <p className="max-w-3xl text-muted-foreground">
          Deze pagina toont de steden waarvoor lokale dienstpagina&apos;s expliciet zijn gepubliceerd. Nieuwe steden worden alleen toegevoegd na inhoudelijke controle op kwaliteit, relevantie en indexatiebeleid.
        </p>
      </section>

      {grouped.map(([province, locations]) => (
        <section key={province} className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">{province}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {await Promise.all(
              locations.map(async (location) => {
                const [loodgieter, schilder, elektricien] = await Promise.all([
                  hasPublishedLocalMainPage("loodgieter", location.slug),
                  hasPublishedLocalMainPage("schilder", location.slug),
                  hasPublishedLocalMainPage("elektricien", location.slug),
                ]);

                const introFacts = Array.isArray(location.intro_facts) ? location.intro_facts : [];

                return (
                  <Card key={location.slug} className="space-y-3">
                    <h3 className="text-xl font-semibold">{location.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {location.province}
                      {location.region_label ? ` · ${location.region_label}` : ""}
                    </p>
                    <p className="text-sm leading-7 text-muted-foreground">{introFacts[0] ? String(introFacts[0]) : "Lokale context volgt in beheer."}</p>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/dakdekker/${location.slug}`} className={buttonClassName({ size: "sm", variant: "secondary" })}>
                        Dakdekker
                      </Link>
                      {loodgieter ? (
                        <Link href={`/loodgieter/${location.slug}`} className={buttonClassName({ size: "sm", variant: "secondary" })}>
                          Loodgieter
                        </Link>
                      ) : null}
                      {schilder ? (
                        <Link href={`/schilder/${location.slug}`} className={buttonClassName({ size: "sm", variant: "secondary" })}>
                          Schilder
                        </Link>
                      ) : null}
                      {elektricien ? (
                        <Link href={`/elektricien/${location.slug}`} className={buttonClassName({ size: "sm", variant: "secondary" })}>
                          Elektricien
                        </Link>
                      ) : null}
                    </div>
                  </Card>
                );
              }),
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
