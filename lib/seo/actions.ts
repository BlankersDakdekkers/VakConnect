"use server";

import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/auth/helpers";
import { isSupabaseConfigured } from "@/lib/env";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getSeoLocalPages, getSeoPageTextCorpus } from "@/lib/seo/local-pages/queries";
import { calculateLocalQualityScore, detectDuplicateRisk } from "@/lib/seo/local-pages/quality";
import { hasSlugCollisionWithSubservice, validatePublishSafety } from "@/lib/seo/local-pages/rules";
import { getRevalidationTargets, revalidateSeoTargets } from "@/lib/seo/revalidation";
import { seoBulkCreateSchema, seoLocalPageInputSchema, seoLocationInputSchema } from "@/lib/validation";

function redirectWithMessage(path: string, key: "error" | "success", message: string): never {
  const search = new URLSearchParams({ [key]: message });
  redirect(`${path}?${search.toString()}`);
}

function parseJsonArray<T = unknown>(value: FormDataEntryValue | null, fallback: T[] = []) {
  if (typeof value !== "string" || !value.trim()) return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

export async function upsertSeoLocationAction(formData: FormData) {
  await requireAdminUser();

  if (!isSupabaseConfigured()) {
    redirectWithMessage("/admin/seo/locaties", "error", "Supabase configuratie ontbreekt.");
  }

  const payload = seoLocationInputSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    province: formData.get("province"),
    regionLabel: formData.get("region_label"),
    introFacts: parseJsonArray(formData.get("intro_facts"), []),
    localCharacteristics: parseJsonArray(formData.get("local_characteristics"), []),
    nearbyCitySlugs: parseJsonArray(formData.get("nearby_city_slugs"), []),
    housingNotes: formData.get("housing_notes"),
    populationBand: formData.get("population_band"),
    priority: formData.get("priority"),
    published: formData.get("published") === "on",
    indexable: formData.get("indexable") === "on",
    redirectTo: formData.get("redirect_to") ?? "/admin/seo/locaties",
  });

  if (!payload.success) {
    redirectWithMessage("/admin/seo/locaties", "error", payload.error.issues[0]?.message ?? "Ongeldige locatiegegevens.");
  }

  if (payload.data.indexable && !payload.data.published) {
    redirectWithMessage(payload.data.redirectTo, "error", "Een niet-gepubliceerde locatie mag niet indexeerbaar zijn.");
  }

  if (hasSlugCollisionWithSubservice("dakdekker", payload.data.slug) || hasSlugCollisionWithSubservice("loodgieter", payload.data.slug)) {
    redirectWithMessage(payload.data.redirectTo, "error", "Deze city-slug botst met een bestaande subdienstslug; kies een andere slug.");
  }

  const supabase = createAdminSupabaseClient();

  if (payload.data.id) {
    const { data: existingRows } = await supabase.from("seo_local_pages").select("id").eq("location_id", payload.data.id).limit(1);
    const hasPages = (existingRows ?? []).length > 0;
    const { data: current } = await supabase.from("seo_locations").select("slug").eq("id", payload.data.id).maybeSingle();

    if (hasPages && current?.slug && current.slug !== payload.data.slug) {
      redirectWithMessage(payload.data.redirectTo, "error", "Slug wijzigen is geblokkeerd omdat er al lokale pagina's gekoppeld zijn.");
    }
  }

  const values = {
    name: payload.data.name,
    slug: payload.data.slug,
    province: payload.data.province,
    region_label: payload.data.regionLabel || null,
    intro_facts: payload.data.introFacts,
    local_characteristics: payload.data.localCharacteristics,
    nearby_city_slugs: payload.data.nearbyCitySlugs,
    housing_notes: payload.data.housingNotes || null,
    population_band: payload.data.populationBand || null,
    priority: payload.data.priority,
    published: payload.data.published,
    indexable: payload.data.indexable,
    updated_at: new Date().toISOString(),
  };

  const response = payload.data.id
    ? await supabase.from("seo_locations").update(values).eq("id", payload.data.id)
    : await supabase.from("seo_locations").insert(values);

  if (response.error) {
    if (response.error.message.includes("seo_locations_slug_key")) {
      redirectWithMessage(payload.data.redirectTo, "error", "Deze locatieslug bestaat al.");
    }
    redirectWithMessage(payload.data.redirectTo, "error", "Locatie kon niet worden opgeslagen.");
  }

  const localPages = await getSeoLocalPages();
  const locationPaths = localPages.filter((page) => page.citySlug === payload.data.slug).map((page) => page.canonicalPath);
  const paths = getRevalidationTargets({ locationSlug: payload.data.slug, existingPaths: locationPaths });
  revalidateSeoTargets(paths);

  redirectWithMessage(payload.data.redirectTo, "success", payload.data.id ? "Locatie bijgewerkt." : "Locatie toegevoegd.");
}

export async function upsertSeoLocalPageAction(formData: FormData) {
  await requireAdminUser();

  if (!isSupabaseConfigured()) {
    redirectWithMessage("/admin/seo/lokaal", "error", "Supabase configuratie ontbreekt.");
  }

  const payload = seoLocalPageInputSchema.safeParse({
    id: formData.get("id"),
    serviceSlug: formData.get("service_slug"),
    subserviceSlug: formData.get("subservice_slug"),
    locationId: formData.get("location_id"),
    canonicalPath: formData.get("canonical_path"),
    localIntro: parseJsonArray(formData.get("local_intro"), []),
    localSections: parseJsonArray(formData.get("local_sections"), []),
    faqs: parseJsonArray(formData.get("faqs"), []),
    relatedLocalLinks: parseJsonArray(formData.get("related_local_links"), []),
    relatedServiceLinks: parseJsonArray(formData.get("related_service_links"), []),
    published: formData.get("published") === "on",
    indexable: formData.get("indexable") === "on",
    contentStatus: formData.get("content_status"),
    redirectTo: formData.get("redirect_to") ?? "/admin/seo/lokaal",
  });

  if (!payload.success) {
    redirectWithMessage("/admin/seo/lokaal", "error", payload.error.issues[0]?.message ?? "Ongeldige lokale paginadata.");
  }

  const supabase = createAdminSupabaseClient();
  const { data: location } = await supabase.from("seo_locations").select("id, slug, published").eq("id", payload.data.locationId).maybeSingle();

  if (!location) {
    redirectWithMessage(payload.data.redirectTo, "error", "Locatie niet gevonden.");
  }

  if (hasSlugCollisionWithSubservice(payload.data.serviceSlug, location.slug) && !payload.data.subserviceSlug) {
    redirectWithMessage(payload.data.redirectTo, "error", "City-slug botst met een subdienstslug binnen dit vakgebied.");
  }

  const publishSafety = validatePublishSafety({
    locationPublished: Boolean(location.published),
    localPublished: payload.data.published,
    indexable: payload.data.indexable,
    contentStatus: payload.data.contentStatus,
    canonicalPath: payload.data.canonicalPath,
    localIntro: payload.data.localIntro,
    localSections: payload.data.localSections,
    faqs: payload.data.faqs,
  });

  if (!publishSafety.ok) {
    redirectWithMessage(payload.data.redirectTo, "error", publishSafety.reason);
  }

  const corpus = await getSeoPageTextCorpus(payload.data.id || undefined);
  const duplicateRisk = detectDuplicateRisk({
    intro: payload.data.localIntro,
    sections: payload.data.localSections,
    existingCorpus: corpus,
  });

  const quality = calculateLocalQualityScore({
    canonicalPath: payload.data.canonicalPath,
    intro: payload.data.localIntro,
    sections: payload.data.localSections,
    faqsCount: payload.data.faqs.length,
    relatedLinksCount: payload.data.relatedServiceLinks.length + payload.data.relatedLocalLinks.length,
    duplicateRisk: duplicateRisk.level,
  });

  if (payload.data.published && quality.score < 55) {
    redirectWithMessage(payload.data.redirectTo, "error", "Kwaliteitsscore te laag om te publiceren.");
  }

  if (payload.data.published && duplicateRisk.level === "high") {
    redirectWithMessage(payload.data.redirectTo, "error", "Publicatie geblokkeerd door hoge duplicatie met bestaande pagina's.");
  }

  const { data: conflictingCanonical } = await supabase
    .from("seo_local_pages")
    .select("id")
    .eq("canonical_path", payload.data.canonicalPath)
    .neq("id", payload.data.id || "")
    .limit(1);

  if ((conflictingCanonical ?? []).length) {
    redirectWithMessage(payload.data.redirectTo, "error", "Canonical pad bestaat al.");
  }

  const values = {
    service_slug: payload.data.serviceSlug,
    subservice_slug: payload.data.subserviceSlug || null,
    location_id: payload.data.locationId,
    canonical_path: payload.data.canonicalPath,
    local_intro: payload.data.localIntro,
    local_sections: payload.data.localSections,
    faqs: payload.data.faqs,
    related_local_links: payload.data.relatedLocalLinks,
    related_service_links: payload.data.relatedServiceLinks,
    published: payload.data.published,
    indexable: payload.data.indexable,
    content_status: payload.data.contentStatus,
    updated_at: new Date().toISOString(),
  };

  const response = payload.data.id
    ? await supabase.from("seo_local_pages").update(values).eq("id", payload.data.id)
    : await supabase.from("seo_local_pages").insert(values);

  if (response.error) {
    if (response.error.message.includes("seo_local_pages_service_slug_subservice_slug_key_location_id_key")) {
      redirectWithMessage(payload.data.redirectTo, "error", "Combinatie vakgebied/subdienst/stad bestaat al.");
    }
    redirectWithMessage(payload.data.redirectTo, "error", "Lokale pagina kon niet worden opgeslagen.");
  }

  const allPaths = (await getSeoLocalPages()).map((page) => page.canonicalPath);
  const targets = getRevalidationTargets({
    locationSlug: location.slug,
    serviceSlug: payload.data.serviceSlug,
    subserviceSlug: payload.data.subserviceSlug || null,
    existingPaths: allPaths,
  });
  revalidateSeoTargets(targets);

  redirectWithMessage(payload.data.redirectTo, "success", payload.data.id ? "Lokale pagina bijgewerkt." : "Lokale pagina toegevoegd.");
}

export async function bulkCreateSeoLocalDraftsAction(formData: FormData) {
  await requireAdminUser();

  if (!isSupabaseConfigured()) {
    redirectWithMessage("/admin/seo/lokaal", "error", "Supabase configuratie ontbreekt.");
  }

  const payload = seoBulkCreateSchema.safeParse({
    serviceSlug: formData.get("service_slug"),
    subserviceSlug: formData.get("subservice_slug"),
    citySlugs: parseJsonArray(formData.get("city_slugs"), []),
    redirectTo: formData.get("redirect_to") ?? "/admin/seo/lokaal",
  });

  if (!payload.success) {
    redirectWithMessage("/admin/seo/lokaal", "error", payload.error.issues[0]?.message ?? "Bulk-aanmaak ongeldig.");
  }

  const supabase = createAdminSupabaseClient();
  const { data: locations, error: locationError } = await supabase
    .from("seo_locations")
    .select("id, slug")
    .in("slug", payload.data.citySlugs);

  if (locationError || !(locations ?? []).length) {
    redirectWithMessage(payload.data.redirectTo, "error", "Geen geldige locaties geselecteerd.");
  }

  const rows = (locations ?? []).map((location) => ({
    service_slug: payload.data.serviceSlug,
    subservice_slug: payload.data.subserviceSlug || null,
    location_id: String(location.id),
    canonical_path: payload.data.subserviceSlug
      ? `/${payload.data.serviceSlug}/${payload.data.subserviceSlug}/${location.slug}`
      : `/${payload.data.serviceSlug}/${location.slug}`,
    local_intro: [],
    local_sections: [],
    faqs: [],
    related_local_links: [],
    related_service_links: [],
    content_status: "draft",
    published: false,
    indexable: false,
  }));

  const { error } = await supabase.from("seo_local_pages").upsert(rows, { onConflict: "canonical_path", ignoreDuplicates: true });

  if (error) {
    redirectWithMessage(payload.data.redirectTo, "error", "Bulk-aanmaak mislukt.");
  }

  const paths = new Set<string>(["/admin/seo", "/admin/seo/lokaal", "/regios"]);
  for (const location of locations ?? []) {
    paths.add(`/${payload.data.serviceSlug}/${location.slug}`);
    if (payload.data.subserviceSlug) {
      paths.add(`/${payload.data.serviceSlug}/${payload.data.subserviceSlug}/${location.slug}`);
    }
  }
  revalidateSeoTargets([...paths]);

  redirectWithMessage(payload.data.redirectTo, "success", `${rows.length} draftpagina's aangemaakt.`);
}
