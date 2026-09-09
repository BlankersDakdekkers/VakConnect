"use server";

import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/auth/helpers";
import { isSupabaseConfigured } from "@/lib/env";
import { serviceMainSlugs } from "@/lib/content/service-pages";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getSeoLocalPages, getSeoPageTextCorpus } from "@/lib/seo/local-pages/queries";
import { calculateLocalQualityScore, detectDuplicateRisk } from "@/lib/seo/local-pages/quality";
import { hasSlugCollisionWithSubservice, validatePublishSafety } from "@/lib/seo/local-pages/rules";
import { getRevalidationTargets, revalidateSeoTargets } from "@/lib/seo/revalidation";
import { evaluateCoverageStatus } from "@/lib/seo/local-pages/coverage";
import { seoBulkCreateSchema, seoBulkStatusSchema, seoLocalPageInputSchema, seoLocationInputSchema } from "@/lib/validation";

type AuditWriterSupabase = {
  from: (table: string) => {
    insert: (values: Record<string, unknown>) => unknown;
  };
};

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

function slugifyProvince(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function writeSeoAuditLog(input: {
  supabase: AuditWriterSupabase;
  localPageId: string;
  actor: string;
  action: "status_change" | "publish" | "unpublish";
  previousStatus: string;
  newStatus: string;
}) {
  await input.supabase.from("seo_audit_log").insert({
    seo_local_page_id: input.localPageId,
    actor: input.actor,
    action: input.action,
    previous_status: input.previousStatus,
    new_status: input.newStatus,
  });
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
    tier: formData.get("tier") || "C",
    contentProfile: (() => {
      const raw = formData.get("content_profile");
      if (typeof raw !== "string" || !raw.trim()) return undefined;
      try {
        return JSON.parse(raw);
      } catch {
        return undefined;
      }
    })(),
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

  for (const serviceSlug of serviceMainSlugs) {
    if (hasSlugCollisionWithSubservice(serviceSlug, payload.data.slug)) {
      redirectWithMessage(payload.data.redirectTo, "error", "Deze city-slug botst met een bestaande subdienstslug; kies een andere slug.");
    }
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
    tier: payload.data.tier,
    content_profile: payload.data.contentProfile,
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

  const response = payload.data.id ? await supabase.from("seo_locations").update(values).eq("id", payload.data.id) : await supabase.from("seo_locations").insert(values);

  if (response.error) {
    if (response.error.message.includes("seo_locations_slug_key")) {
      redirectWithMessage(payload.data.redirectTo, "error", "Deze locatieslug bestaat al.");
    }
    redirectWithMessage(payload.data.redirectTo, "error", "Locatie kon niet worden opgeslagen.");
  }

  const localPages = await getSeoLocalPages();
  const locationPaths = localPages.filter((page) => page.citySlug === payload.data.slug).map((page) => page.canonicalPath);
  const paths = getRevalidationTargets({
    locationSlug: payload.data.slug,
    provinceSlug: slugifyProvince(payload.data.province),
    existingPaths: locationPaths,
  });
  revalidateSeoTargets(paths);

  redirectWithMessage(payload.data.redirectTo, "success", payload.data.id ? "Locatie bijgewerkt." : "Locatie toegevoegd.");
}

export async function upsertSeoLocalPageAction(formData: FormData) {
  const admin = await requireAdminUser();

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
  const { data: location } = await supabase
    .from("seo_locations")
    .select("id, slug, name, province, published")
    .eq("id", payload.data.locationId)
    .maybeSingle();

  if (!location) {
    redirectWithMessage(payload.data.redirectTo, "error", "Locatie niet gevonden.");
  }

  if (hasSlugCollisionWithSubservice(payload.data.serviceSlug, location.slug) && !payload.data.subserviceSlug) {
    redirectWithMessage(payload.data.redirectTo, "error", "City-slug botst met een subdienstslug binnen dit vakgebied.");
  }

  const corpus = await getSeoPageTextCorpus(payload.data.id || undefined);
  const duplicateRisk = detectDuplicateRisk({ intro: payload.data.localIntro, sections: payload.data.localSections, existingCorpus: corpus });
  const quality = calculateLocalQualityScore({
    canonicalPath: payload.data.canonicalPath,
    intro: payload.data.localIntro,
    sections: payload.data.localSections,
    faqsCount: payload.data.faqs.length,
    relatedLinksCount: payload.data.relatedServiceLinks.length + payload.data.relatedLocalLinks.length,
    duplicateRisk: duplicateRisk.level,
    hasLocalContext: payload.data.localSections.some((section) => /lokaal|woning|planning|bereikbaarheid/i.test(section.heading)),
  });
  const coverageStatus = await evaluateCoverageStatus({ supabase, serviceSlug: payload.data.serviceSlug, locationName: location.name });

  const publishSafety = validatePublishSafety({
    locationPublished: Boolean(location.published),
    localPublished: payload.data.published,
    indexable: payload.data.indexable,
    contentStatus: payload.data.contentStatus,
    canonicalPath: payload.data.canonicalPath,
    localIntro: payload.data.localIntro,
    localSections: payload.data.localSections,
    faqs: payload.data.faqs,
    qualityScore: quality.score,
    duplicateRisk: duplicateRisk.level,
    coverageStatus,
  });

  if (!publishSafety.ok) {
    redirectWithMessage(payload.data.redirectTo, "error", publishSafety.reason);
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

  const { data: beforeRow } = payload.data.id
    ? await supabase.from("seo_local_pages").select("id, content_status, published").eq("id", payload.data.id).maybeSingle()
    : { data: null };

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
    quality_score: quality.score,
    duplicate_risk: duplicateRisk.level,
    coverage_status: coverageStatus,
    updated_at: new Date().toISOString(),
  };

  const response = payload.data.id ? await supabase.from("seo_local_pages").update(values).eq("id", payload.data.id) : await supabase.from("seo_local_pages").insert(values).select("id").single();

  if (response.error) {
    if (response.error.message.includes("seo_local_pages_service_slug_subservice_slug_key_location_id_key")) {
      redirectWithMessage(payload.data.redirectTo, "error", "Combinatie vakgebied/subdienst/stad bestaat al.");
    }
    redirectWithMessage(payload.data.redirectTo, "error", "Lokale pagina kon niet worden opgeslagen.");
  }

  const localPageId = payload.data.id || String((response.data as { id?: string } | null)?.id ?? "");
  if (localPageId && beforeRow) {
    const previousStatus = String(beforeRow.content_status ?? "draft");
    const newStatus = payload.data.contentStatus;
    if (previousStatus !== newStatus) {
      await writeSeoAuditLog({
        supabase,
        localPageId,
        actor: admin.email ?? admin.id,
        action: "status_change",
        previousStatus,
        newStatus,
      });
    }

    const wasPublished = Boolean(beforeRow.published);
    const isPublished = payload.data.published;
    if (wasPublished !== isPublished) {
      await writeSeoAuditLog({
        supabase,
        localPageId,
        actor: admin.email ?? admin.id,
        action: isPublished ? "publish" : "unpublish",
        previousStatus,
        newStatus,
      });
    }
  }

  const allPaths = (await getSeoLocalPages()).map((page) => page.canonicalPath);
  const targets = getRevalidationTargets({
    locationSlug: location.slug,
    provinceSlug: slugifyProvince(location.province),
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
    province: formData.get("province"),
    tier: formData.get("tier") || undefined,
    onlyWithCoverage: formData.get("only_with_coverage") === "on",
    redirectTo: formData.get("redirect_to") ?? "/admin/seo/lokaal",
  });

  if (!payload.success) {
    redirectWithMessage("/admin/seo/lokaal", "error", payload.error.issues[0]?.message ?? "Bulk-aanmaak ongeldig.");
  }

  const supabase = createAdminSupabaseClient();
  let locationQuery = supabase.from("seo_locations").select("id, slug, name, province, tier");

  if (payload.data.citySlugs.length) {
    locationQuery = locationQuery.in("slug", payload.data.citySlugs);
  }
  if (payload.data.province) {
    locationQuery = locationQuery.eq("province", payload.data.province);
  }
  if (payload.data.tier) {
    locationQuery = locationQuery.eq("tier", payload.data.tier);
  }

  const { data: locations, error: locationError } = await locationQuery;
  if (locationError || !(locations ?? []).length) {
    redirectWithMessage(payload.data.redirectTo, "error", "Geen geldige locaties geselecteerd.");
  }

  const rows = [] as Array<Record<string, unknown>>;
  for (const location of locations ?? []) {
    const coverageStatus = await evaluateCoverageStatus({ supabase, serviceSlug: payload.data.serviceSlug, locationName: String(location.name) });
    if (payload.data.onlyWithCoverage && coverageStatus === "none") continue;

    rows.push({
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
      quality_score: 0,
      duplicate_risk: "high",
      coverage_status: coverageStatus,
    });
  }

  if (!rows.length) {
    redirectWithMessage(payload.data.redirectTo, "error", "Geen records aangemaakt: coverage filter sloot alle locaties uit.");
  }

  const { error } = await supabase.from("seo_local_pages").upsert(rows, { onConflict: "canonical_path", ignoreDuplicates: true });
  if (error) {
    redirectWithMessage(payload.data.redirectTo, "error", "Bulk-aanmaak mislukt.");
  }

  const paths = new Set<string>(["/admin/seo", "/admin/seo/lokaal", "/regios", "/sitemap.xml"]);
  for (const location of locations ?? []) {
    paths.add(`/${payload.data.serviceSlug}/${location.slug}`);
    if (payload.data.subserviceSlug) paths.add(`/${payload.data.serviceSlug}/${payload.data.subserviceSlug}/${location.slug}`);
  }
  revalidateSeoTargets([...paths]);

  redirectWithMessage(payload.data.redirectTo, "success", `${rows.length} draftpagina's aangemaakt.`);
}

export async function bulkUpdateSeoLocalStatusAction(formData: FormData) {
  const admin = await requireAdminUser();

  if (!isSupabaseConfigured()) {
    redirectWithMessage("/admin/seo/lokaal", "error", "Supabase configuratie ontbreekt.");
  }

  const payload = seoBulkStatusSchema.safeParse({
    ids: parseJsonArray(formData.get("ids"), []),
    fromStatus: formData.get("from_status"),
    toStatus: formData.get("to_status"),
    redirectTo: formData.get("redirect_to") ?? "/admin/seo/lokaal",
  });

  if (!payload.success) {
    redirectWithMessage("/admin/seo/lokaal", "error", payload.error.issues[0]?.message ?? "Bulk status update ongeldig.");
  }

  if (payload.data.fromStatus === "draft" && payload.data.toStatus !== "review") {
    redirectWithMessage(payload.data.redirectTo, "error", "Alleen draft → review is toegestaan in bulk.");
  }

  if (payload.data.fromStatus === "review" && payload.data.toStatus !== "approved") {
    redirectWithMessage(payload.data.redirectTo, "error", "Alleen review → approved is toegestaan in bulk.");
  }

  const supabase = createAdminSupabaseClient();
  const { data: rows, error: readError } = await supabase
    .from("seo_local_pages")
    .select("id, content_status")
    .in("id", payload.data.ids)
    .eq("content_status", payload.data.fromStatus);

  if (readError || !(rows ?? []).length) {
    redirectWithMessage(payload.data.redirectTo, "error", "Geen records gevonden voor bulkstatusactie.");
  }

  const ids = (rows ?? []).map((row: Record<string, unknown>) => String(row.id));
  const { error } = await supabase
    .from("seo_local_pages")
    .update({ content_status: payload.data.toStatus, updated_at: new Date().toISOString(), published: false, indexable: false })
    .in("id", ids);

  if (error) {
    redirectWithMessage(payload.data.redirectTo, "error", "Bulk status update mislukt.");
  }

  await Promise.all(
    (rows ?? []).map((row: Record<string, unknown>) =>
      writeSeoAuditLog({
        supabase,
        localPageId: String(row.id),
        actor: admin.email ?? admin.id,
        action: "status_change",
        previousStatus: String(row.content_status ?? payload.data.fromStatus),
        newStatus: payload.data.toStatus,
      }),
    ),
  );

  revalidateSeoTargets(["/admin/seo", "/admin/seo/lokaal"]);
  redirectWithMessage(payload.data.redirectTo, "success", `${ids.length} records bijgewerkt naar ${payload.data.toStatus}.`);
}
