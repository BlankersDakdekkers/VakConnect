import Link from "next/link";
import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/config/site";
import { getPublishedLocationsGroupedByProvince } from "@/lib/seo/locations/queries";
import { hasPublishedLocalMainPage } from "@/lib/seo/local-pages/queries";
import { serviceMainSlugs } from "@/lib/content/service-pages";
import { getPublishedProvinceHubs } from "@/lib/seo/province-hubs";

export const metadata: Metadata = buildPageMetadata({
  title: "Regio's en steden | VakConnect",
  description: "Overzicht van gepubliceerde steden voor lokale VakConnect dienstpagina's.",
  path: "/regios",
  keywords: ["regio", "steden", "lokale vakman", "VakConnect"],
});

export default async function RegionsPage() {
  const [grouped, provinceHubs] = await Promise.all([getPublishedLocationsGroupedByProvince(), getPublishedProvinceHubs()]);
  const provinceHubByName = new Map(provinceHubs.map((hub) => [hub.province, hub]));

  const groupedCards = await Promise.all(
    grouped.map(async ([province, locations]) => ({
      province,
      hubSlug: provinceHubByName.get(province)?.slug,
      cards: await Promise.all(
        locations.map(async (location) => {
          const availableServices = (
            await Promise.all(
              serviceMainSlugs.map(async (serviceSlug) => ({
                serviceSlug,
                hasPage: await hasPublishedLocalMainPage(serviceSlug, location.slug),
              })),
            )
          )
            .filter((item) => item.hasPage)
            .map((item) => item.serviceSlug);

          const introFacts = Array.isArray(location.intro_facts) ? location.intro_facts : [];

          return {
            location,
            intro: introFacts[0] ? String(introFacts[0]) : "Lokale context volgt in beheer.",
            availableServices,
          };
        }),
      ),
    })),
  );

  return (
    <div className="container-shell space-y-10 py-14">
      <section className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight text-balance">Regio&apos;s en steden op VakConnect</h1>
        <p className="max-w-3xl text-muted-foreground">
          Deze pagina toont de steden waarvoor lokale dienstpagina&apos;s expliciet zijn gepubliceerd. Nieuwe steden worden alleen toegevoegd na inhoudelijke controle op kwaliteit, relevantie en indexatiebeleid.
        </p>
      </section>

      {groupedCards.map((group) => (
        <section key={group.province} className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight">{group.province}</h2>
            {group.hubSlug ? (
              <Link href={`/regios/${group.hubSlug}`} className={buttonClassName({ size: "sm", variant: "secondary" })}>
                Provinciehub
              </Link>
            ) : null}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {group.cards.map(({ location, intro, availableServices }) => (
              <Card key={location.slug} className="space-y-3">
                <h3 className="text-xl font-semibold">{location.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {location.province}
                  {location.region_label ? ` · ${location.region_label}` : ""}
                </p>
                <p className="text-sm leading-7 text-muted-foreground">{intro}                </p>
                <div className="flex flex-wrap gap-2">
                  {availableServices.map((serviceSlug) => (
                    <Link key={serviceSlug} href={`/${serviceSlug}/${location.slug}`} className={buttonClassName({ size: "sm", variant: "secondary" })}>
                      {serviceSlug}
                    </Link>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
