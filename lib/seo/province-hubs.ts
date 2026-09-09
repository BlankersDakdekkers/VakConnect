import "server-only";

import { getPublishedSeoLocations } from "@/lib/seo/locations/queries";
import { getPublishedSeoLocalPages } from "@/lib/seo/local-pages/queries";

function slugifyProvince(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const provinceIntroMap: Record<string, string> = {
  "noord-brabant": "Noord-Brabant heeft een brede mix van stedelijke en regionale woningcontexten; publicatie gebeurt alleen waar lokale pagina’s redactioneel op niveau zijn.",
  "zuid-holland": "Zuid-Holland combineert hoge stedelijke dichtheid met uiteenlopende woningtypen; deze hub bundelt gecontroleerd gepubliceerde lokale routes.",
  "noord-holland": "Noord-Holland vraagt per stad verschillende logistieke en bouwkundige accenten; deze provinciepagina linkt alleen naar actieve lokale SEO-routes.",
  gelderland: "Gelderland bevat zowel stedelijke kernen als ruimere woongebieden; hier vind je lokale pagina’s die voldoen aan quality- en indexatiegates.",
  utrecht: "In Utrecht variëren woningcontext en bereikbaarheid sterk per stad; de hub biedt alleen gecontroleerd gepubliceerde lokale servicepagina’s.",
  overijssel: "Overijssel combineert regionale kernen met groeigebieden; deze hub houdt lokale servicepagina’s per stad centraal bij elkaar.",
  groningen: "Voor Groningen bundelt deze hub lokale pagina’s met voldoende inhoud, interne linking en publicatiecontrole.",
  friesland: "Friesland wordt gefaseerd uitgebreid; alleen pagina’s met voldoende kwaliteit en indexatiestatus worden opgenomen.",
  limburg: "Limburg vraagt variatie tussen stedelijke en regionale contexten; deze hub toont uitsluitend gecontroleerde live-pagina’s.",
  flevoland: "Flevoland heeft veel jongere woningvoorraad en uitbreidingswijken; de hub toont relevante lokale servicepagina’s per stad.",
  drenthe: "Drenthe wordt stapsgewijs opgebouwd; publicatie blijft afhankelijk van redactionele review en technische SEO-gates.",
};

export async function getPublishedProvinceHubs(minPages = 6) {
  const [locations, localPages] = await Promise.all([getPublishedSeoLocations(), getPublishedSeoLocalPages()]);
  const locationBySlug = new Map(locations.map((location) => [location.slug, location]));

  const grouped = new Map<
    string,
    {
      province: string;
      slug: string;
      locations: typeof locations;
      pages: typeof localPages;
      services: Set<string>;
    }
  >();

  for (const page of localPages) {
    const location = locationBySlug.get(page.citySlug);
    if (!location) continue;

    const provinceSlug = slugifyProvince(location.province);
    if (!grouped.has(provinceSlug)) {
      grouped.set(provinceSlug, {
        province: location.province,
        slug: provinceSlug,
        locations: [],
        pages: [],
        services: new Set(),
      });
    }

    const bucket = grouped.get(provinceSlug)!;
    bucket.pages.push(page);
    bucket.services.add(page.serviceSlug);
    if (!bucket.locations.some((candidate) => candidate.slug === location.slug)) {
      bucket.locations.push(location);
    }
  }

  return [...grouped.values()]
    .filter((bucket) => bucket.pages.length >= minPages)
    .sort((a, b) => a.province.localeCompare(b.province, "nl"))
    .map((bucket) => ({
      province: bucket.province,
      slug: bucket.slug,
      intro:
        provinceIntroMap[bucket.slug] ??
        `${bucket.province} bevat meerdere gepubliceerde lokale servicepagina’s die handmatig zijn gecontroleerd op kwaliteit, duplicatie en indexeerbaarheid.`,
      locations: bucket.locations.sort((a, b) => a.name.localeCompare(b.name, "nl")),
      pages: bucket.pages,
      services: [...bucket.services].sort((a, b) => a.localeCompare(b, "nl")),
    }));
}

export async function getPublishedProvinceHubBySlug(slug: string, minPages = 6) {
  const hubs = await getPublishedProvinceHubs(minPages);
  return hubs.find((hub) => hub.slug === slug) ?? null;
}
