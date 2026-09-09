import "server-only";

import { unstable_cache } from "next/cache";
import { allLocations } from "@/lib/content/locations";
import { isSupabaseConfigured } from "@/lib/env";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { SeoLocation } from "@/lib/seo/types";

function toLocation(input: Record<string, unknown>): SeoLocation {
  return {
    id: String(input.id),
    slug: String(input.slug),
    name: String(input.name),
    province: String(input.province),
    region_label: (input.region_label as string | null) ?? null,
    intro_facts: (input.intro_facts ?? []) as SeoLocation["intro_facts"],
    local_characteristics: (input.local_characteristics ?? []) as SeoLocation["local_characteristics"],
    nearby_city_slugs: (input.nearby_city_slugs ?? []) as SeoLocation["nearby_city_slugs"],
    population_band: (input.population_band as string | null) ?? null,
    housing_notes: (input.housing_notes as string | null) ?? null,
    published: Boolean(input.published),
    indexable: Boolean(input.indexable),
    priority: Number(input.priority ?? 0),
    created_at: String(input.created_at ?? ""),
    updated_at: String(input.updated_at ?? ""),
  };
}

async function fetchLocationsFromDb() {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("seo_locations")
    .select("id, slug, name, province, region_label, intro_facts, local_characteristics, nearby_city_slugs, population_band, housing_notes, published, indexable, priority, created_at, updated_at")
    .order("name", { ascending: true });

  if (error) {
    return [] as SeoLocation[];
  }

  return ((data ?? []) as Array<Record<string, unknown>>).map(toLocation);
}

const getCachedLocations = unstable_cache(fetchLocationsFromDb, ["seo-locations-all"], { revalidate: 3600 });

export async function getSeoLocations() {
  if (!isSupabaseConfigured()) {
    return allLocations.map((location, index) => ({
      id: `fallback-location-${index}`,
      slug: location.slug,
      name: location.name,
      province: location.province,
      region_label: location.regionLabel,
      intro_facts: location.introFacts,
      local_characteristics: location.localCharacteristics,
      nearby_city_slugs: location.nearbyCities,
      population_band: location.populationBand ?? null,
      housing_notes: location.housingNotes ?? null,
      published: location.published,
      indexable: location.indexable,
      priority: location.priority,
      created_at: "",
      updated_at: "",
    } satisfies SeoLocation));
  }

  const rows = await getCachedLocations();
  return rows.length ? rows : [];
}

export async function getPublishedSeoLocations() {
  const locations = await getSeoLocations();
  return locations.filter((location) => location.published);
}

export async function getSeoLocationById(id: string) {
  const locations = await getSeoLocations();
  return locations.find((location) => location.id === id) ?? null;
}

export async function getSeoLocationBySlug(slug: string) {
  const locations = await getSeoLocations();
  return locations.find((location) => location.slug === slug) ?? null;
}

export async function getPublishedLocationsGroupedByProvince() {
  const locations = (await getPublishedSeoLocations()).sort((a, b) => a.name.localeCompare(b.name, "nl"));

  return Object.entries(
    locations.reduce<Record<string, SeoLocation[]>>((acc, location) => {
      acc[location.province] ??= [];
      acc[location.province].push(location);
      return acc;
    }, {}),
  ).sort(([left], [right]) => left.localeCompare(right, "nl"));
}
