import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { buildPageMetadata } from "@/lib/config/site";
import { getPublishedProvinceHubBySlug, getPublishedProvinceHubs } from "@/lib/seo/province-hubs";

export async function generateStaticParams() {
  const hubs = await getPublishedProvinceHubs();
  return hubs.map((hub) => ({ provincie: hub.slug }));
}

export async function generateMetadata({ params }: Readonly<{ params: Promise<{ provincie: string }> }>): Promise<Metadata> {
  const { provincie } = await params;
  const hub = await getPublishedProvinceHubBySlug(provincie);
  if (!hub) return {};

  return buildPageMetadata({
    title: `${hub.province} | Lokale vakgebieden op VakConnect`,
    description: `Provinciehub voor ${hub.province} met gecontroleerd gepubliceerde lokale vakgebiedpagina’s en stedenoverzicht.`,
    path: `/regios/${hub.slug}`,
    keywords: [hub.province, "regio", "lokale vakman", "VakConnect"],
  });
}

export default async function ProvinceHubPage({ params }: Readonly<{ params: Promise<{ provincie: string }> }>) {
  const { provincie } = await params;
  const hub = await getPublishedProvinceHubBySlug(provincie);

  if (!hub) {
    notFound();
  }

  return (
    <div className="container-shell space-y-8 py-14">
      <div className="space-y-3">
        <Link href="/regios" className="text-sm text-primary hover:underline">
          ← Terug naar regio-overzicht
        </Link>
        <h1 className="text-4xl font-semibold tracking-tight text-balance">{hub.province}</h1>
        <p className="max-w-3xl text-muted-foreground">{hub.intro}</p>
      </div>

      <Card className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight">Vakgebieden in deze provincie</h2>
        <ul className="flex flex-wrap gap-2 text-sm">
          {hub.services.map((serviceSlug) => (
            <li key={serviceSlug} className="rounded-full border px-3 py-1">
              {serviceSlug}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight">Stedenoverzicht</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {hub.locations.map((location) => (
            <div key={location.slug} className="rounded-xl border p-4">
              <h3 className="text-lg font-medium">{location.name}</h3>
              <p className="text-xs text-muted-foreground">{location.region_label ?? location.province}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {hub.services.map((serviceSlug) => {
                  const route = `/${serviceSlug}/${location.slug}`;
                  const exists = hub.pages.some((page) => page.canonicalPath === route);
                  if (!exists) return null;
                  return (
                    <Link key={route} href={route} className="rounded-full border px-3 py-1 text-xs hover:bg-muted">
                      {serviceSlug}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
