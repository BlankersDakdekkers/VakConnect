import "server-only";

import { unstable_cache } from "next/cache";
import { getServiceSubPage, serviceSubSlugs, type ServiceContentPageData } from "@/lib/content/service-pages";
import { localServicePageConfigs, localServicePages } from "@/lib/content/local-service-pages";
import { isSupabaseConfigured } from "@/lib/env";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { calculateLocalQualityScore, detectDuplicateRisk } from "@/lib/seo/local-pages/quality";
import { isSitemapEligible } from "@/lib/seo/local-pages/rules";
import {
  coerceFaqs,
  coerceServiceLinks,
  coerceServiceSections,
  coerceStringArray,
  type DatabaseBackedLocalPage,
  type ResolvedPublicRoute,
  type SeoContentStatus,
  type SeoCoverageStatus,
  type SeoDuplicateRisk,
  type SeoLocalPage,
  type SeoLocalPageWithLocation,
  type SeoLocation,
} from "@/lib/seo/types";
import { getPublishedSeoLocations, getSeoLocations } from "@/lib/seo/locations/queries";

function humanizeSlug(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const serviceNameMap: Record<string, string> = {
  dakdekker: "Dakdekker",
  loodgieter: "Loodgieter",
  schilder: "Schilder",
  elektricien: "Elektricien",
  kozijnen: "Kozijnen specialist",
  badkamer: "Badkamerspecialist",
  isolatie: "Isolatiespecialist",
  verbouwing: "Verbouwspecialist",
};

const subserviceMap = new Map(serviceSubSlugs.map((item) => [`${item.vakgebied}/${item.subdienst}`, humanizeSlug(item.subdienst)]));
const fallbackByPath = new Map(localServicePages.map((page) => [page.canonicalPath, page]));
const fallbackConfigByPath = new Map(localServicePageConfigs.map((config) => [config.canonicalPath, config]));
let fallbackLocalPageCache: DatabaseBackedLocalPage[] | null = null;

function rowToLocation(input: Record<string, unknown>): SeoLocation {
  return {
    id: String(input.id),
    slug: String(input.slug),
    name: String(input.name),
    province: String(input.province),
    region_label: (input.region_label as string | null) ?? null,
    tier: (input.tier as "A" | "B" | "C") ?? "C",
    content_profile: (input.content_profile ?? {}) as SeoLocation["content_profile"],
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

function rowToLocalPage(input: Record<string, unknown>): SeoLocalPageWithLocation | null {
  if (!input.location || typeof input.location !== "object") return null;

  return {
    id: String(input.id),
    service_slug: String(input.service_slug),
    subservice_slug: (input.subservice_slug as string | null) ?? null,
    location_id: String(input.location_id),
    canonical_path: String(input.canonical_path),
    local_intro: (input.local_intro ?? []) as SeoLocalPage["local_intro"],
    local_sections: (input.local_sections ?? []) as SeoLocalPage["local_sections"],
    faqs: (input.faqs ?? []) as SeoLocalPage["faqs"],
    related_local_links: (input.related_local_links ?? []) as SeoLocalPage["related_local_links"],
    related_service_links: (input.related_service_links ?? []) as SeoLocalPage["related_service_links"],
    published: Boolean(input.published),
    indexable: Boolean(input.indexable),
    content_status: (input.content_status as SeoContentStatus) ?? "draft",
    quality_score: Number(input.quality_score ?? 0),
    duplicate_risk: (input.duplicate_risk as SeoDuplicateRisk) ?? "high",
    coverage_status: (input.coverage_status as SeoCoverageStatus) ?? "none",
    created_at: String(input.created_at ?? ""),
    updated_at: String(input.updated_at ?? ""),
    location: rowToLocation(input.location as Record<string, unknown>),
  };
}

function toPage(row: SeoLocalPageWithLocation, corpus: string[]): DatabaseBackedLocalPage {
  const fallback = fallbackByPath.get(row.canonical_path);
  const intro = coerceStringArray(row.local_intro, fallback?.page.intro ?? []);
  const sections = coerceServiceSections(row.local_sections);
  const faqs = coerceFaqs(row.faqs);
  const relatedServiceLinks = coerceServiceLinks(row.related_service_links);
  const relatedLocalCitySlugs = coerceStringArray(row.related_local_links, []);

  const relatedLocalLinks = relatedLocalCitySlugs.map((citySlug) => ({
    href: `/${row.service_slug}/${citySlug}`,
    title: `${serviceNameMap[row.service_slug] ?? humanizeSlug(row.service_slug)} in ${humanizeSlug(citySlug)}`,
    description: `Lokale pagina voor ${humanizeSlug(citySlug)}.`,
  }));

  const fallbackRelatedLinks = fallback?.page.relatedLinks ?? [];
  const relatedLinks = [...relatedServiceLinks, ...relatedLocalLinks, ...fallbackRelatedLinks].filter(
    (link, index, links) => links.findIndex((candidate) => candidate.href === link.href) === index,
  );

  const serviceName = serviceNameMap[row.service_slug] ?? humanizeSlug(row.service_slug);
  const subserviceName = row.subservice_slug ? subserviceMap.get(`${row.service_slug}/${row.subservice_slug}`) ?? humanizeSlug(row.subservice_slug) : null;
  const label = subserviceName ? `${subserviceName} in ${row.location.name}` : `${serviceName} in ${row.location.name}`;

  const builtPage: ServiceContentPageData = {
    path: row.canonical_path,
    title: fallback?.page.title ?? `${label} nodig? Vind een passende vakman via VakConnect`,
    description: fallback?.page.description ?? `Lokale uitleg over ${label.toLowerCase()} via VakConnect.`,
    keywords: fallback?.page.keywords ?? [`${label.toLowerCase()}`, "VakConnect"],
    h1: fallback?.page.h1 ?? `${label} nodig? Vind een passende vakman via VakConnect`,
    intro,
    breadcrumbs:
      fallback?.page.breadcrumbs ?? [
        { label: "Home", href: "/" },
        { label: "Diensten", href: "/diensten" },
        { label: serviceName, href: `/${row.service_slug}` },
        ...(subserviceName ? [{ label: subserviceName, href: `/${row.service_slug}/${row.subservice_slug}` }] : []),
        { label: row.location.name },
      ],
    sections: sections.length ? sections : fallback?.page.sections ?? [],
    costFactors: fallback?.page.costFactors ?? [],
    processSteps: fallback?.page.processSteps ?? [],
    relatedLinks,
    faqs: faqs.length ? faqs : fallback?.page.faqs ?? [],
    cta:
      fallback?.page.cta ?? {
        title: `Vind een passende ${serviceName.toLowerCase()} in ${row.location.name}`,
        description: `Plaats je aanvraag voor ${row.location.name} met relevante details en planning.`,
        label: "Start aanvraag",
        secondaryLabel: "Hoe werkt het",
        secondaryHref: "/hoe-werkt-het",
      },
  };

  const duplicateRisk = detectDuplicateRisk({ intro: builtPage.intro, sections: builtPage.sections, existingCorpus: corpus });
  const quality = calculateLocalQualityScore({
    canonicalPath: row.canonical_path,
    intro: builtPage.intro,
    sections: builtPage.sections,
    faqsCount: builtPage.faqs.length,
    relatedLinksCount: builtPage.relatedLinks.length,
    duplicateRisk: duplicateRisk.level,
    hasLocalContext: builtPage.sections.some((section) => /lokaal|woning|bereikbaarheid|planning/i.test(section.heading)),
  });

  return {
    id: row.id,
    serviceSlug: row.service_slug,
    subserviceSlug: row.subservice_slug,
    citySlug: row.location.slug,
    contentStatus: row.content_status,
    published: row.published,
    indexable: row.indexable,
    canonicalPath: row.canonical_path,
    qualityScore: Math.max(row.quality_score || 0, quality.score),
    qualityLabel: quality.label,
    duplicateRisk: row.duplicate_risk || duplicateRisk.level,
    coverageStatus: row.coverage_status || "none",
    updatedAt: row.updated_at,
    page: builtPage,
  };
}

async function fetchDbLocalPages() {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("seo_local_pages")
    .select(
      "id, service_slug, subservice_slug, location_id, canonical_path, local_intro, local_sections, faqs, related_local_links, related_service_links, published, indexable, content_status, quality_score, duplicate_risk, coverage_status, created_at, updated_at, location:seo_locations(id, slug, name, province, region_label, tier, content_profile, intro_facts, local_characteristics, nearby_city_slugs, population_band, housing_notes, published, indexable, priority, created_at, updated_at)",
    )
    .order("canonical_path", { ascending: true });

  if (error) return [] as DatabaseBackedLocalPage[];

  const rows = ((data ?? []) as Array<Record<string, unknown>>).map(rowToLocalPage).filter((row): row is SeoLocalPageWithLocation => Boolean(row));
  const corpus = rows.map((row) => [coerceStringArray(row.local_intro).join(" "), JSON.stringify(row.local_sections)].join(" "));
  return rows.map((row) => toPage(row, corpus));
}

const getCachedDbLocalPages = unstable_cache(fetchDbLocalPages, ["seo-local-pages-all"], { revalidate: 3600 });

export async function getSeoLocalPages() {
  if (!isSupabaseConfigured()) {
    if (fallbackLocalPageCache) {
      return fallbackLocalPageCache;
    }

    const corpus = localServicePages.map((page) => [page.page.intro.join(" "), JSON.stringify(page.page.sections)].join(" "));
    fallbackLocalPageCache = localServicePages.map((page) => {
      const duplicateRisk = detectDuplicateRisk({ intro: page.page.intro, sections: page.page.sections, existingCorpus: corpus });
      const quality = calculateLocalQualityScore({
        canonicalPath: page.canonicalPath,
        intro: page.page.intro,
        sections: page.page.sections,
        faqsCount: page.page.faqs.length,
        relatedLinksCount: page.page.relatedLinks.length,
        duplicateRisk: duplicateRisk.level,
        hasLocalContext: page.page.sections.some((section) => /lokaal|woning|bereikbaarheid|planning/i.test(section.heading)),
      });
      const config = fallbackConfigByPath.get(page.canonicalPath);

      return {
        id: `fallback-local-${page.canonicalPath}`,
        serviceSlug: page.serviceSlug,
        subserviceSlug: page.subserviceSlug,
        citySlug: page.citySlug,
        contentStatus: page.published ? "published" : "draft",
        published: page.published,
        indexable: page.indexable,
        canonicalPath: page.canonicalPath,
        qualityScore: quality.score,
        qualityLabel: quality.label,
        duplicateRisk: duplicateRisk.level,
        coverageStatus: config?.tier === "A" ? "sufficient" : config?.tier === "B" ? "limited" : "none",
        updatedAt: "",
        page: page.page,
      } satisfies DatabaseBackedLocalPage;
    });
    return fallbackLocalPageCache;
  }

  return getCachedDbLocalPages();
}

export async function getPublishedSeoLocalPages() {
  const pages = await getSeoLocalPages();
  const publishedLocations = new Set((await getPublishedSeoLocations()).map((location) => location.slug));
  return pages.filter((page) =>
    isSitemapEligible({
      locationPublished: publishedLocations.has(page.citySlug),
      published: page.published,
      indexable: page.indexable,
      contentStatus: page.contentStatus,
    }),
  );
}

export async function getIndexableSeoLocalPages() {
  return getPublishedSeoLocalPages();
}

export async function getIndexableSeoLocalRoutes() {
  return (await getIndexableSeoLocalPages()).map((page) => page.canonicalPath);
}

export async function getSeoLocalStaticParams() {
  return (await getPublishedSeoLocalPages()).map((page) =>
    page.subserviceSlug ? { vakgebied: page.serviceSlug, slug: [page.subserviceSlug, page.citySlug] } : { vakgebied: page.serviceSlug, slug: [page.citySlug] },
  );
}

export async function getLocalLinksForServiceMain(serviceSlug: string, limit = 6) {
  return (await getPublishedSeoLocalPages())
    .filter((page) => page.serviceSlug === serviceSlug && page.subserviceSlug === null)
    .slice(0, limit)
    .map((page) => ({
      href: page.canonicalPath,
      title: `${serviceNameMap[page.serviceSlug] ?? humanizeSlug(page.serviceSlug)} in ${humanizeSlug(page.citySlug)}`,
      description: `Bekijk lokale informatie voor ${humanizeSlug(page.citySlug)}.`,
    }));
}

export async function getLocalLinksForServiceSub(serviceSlug: string, subserviceSlug: string, limit = 6) {
  const subserviceName = subserviceMap.get(`${serviceSlug}/${subserviceSlug}`) ?? humanizeSlug(subserviceSlug);
  return (await getPublishedSeoLocalPages())
    .filter((page) => page.serviceSlug === serviceSlug && page.subserviceSlug === subserviceSlug)
    .slice(0, limit)
    .map((page) => ({
      href: page.canonicalPath,
      title: `${subserviceName} in ${humanizeSlug(page.citySlug)}`,
      description: `Lokale pagina over ${subserviceName.toLowerCase()} in ${humanizeSlug(page.citySlug)}.`,
    }));
}

export async function resolvePublicServiceRoute(vakgebied: string, slug: string[]): Promise<ResolvedPublicRoute | null> {
  const pages = await getSeoLocalPages();

  if (slug.length === 1) {
    const [secondSegment] = slug;
    const localMainPage = pages.find((page) => page.serviceSlug === vakgebied && page.subserviceSlug === null && page.citySlug === secondSegment);

    if (localMainPage) return { type: "local", localPage: localMainPage };

    const serviceSubPage = getServiceSubPage(vakgebied, secondSegment);
    if (serviceSubPage) return { type: "service-sub", serviceSubPage };

    return null;
  }

  if (slug.length === 2) {
    const [subdienst, stad] = slug;
    const localSubPage = pages.find((page) => page.serviceSlug === vakgebied && page.subserviceSlug === subdienst && page.citySlug === stad);
    if (localSubPage) return { type: "local", localPage: localSubPage };
  }

  return null;
}

export async function hasPublishedLocalMainPage(serviceSlug: string, citySlug: string) {
  return (await getPublishedSeoLocalPages()).some((page) => page.serviceSlug === serviceSlug && page.subserviceSlug === null && page.citySlug === citySlug);
}

export async function getSeoLocalPageById(id: string) {
  const pages = await getSeoLocalPages();
  return pages.find((page) => page.id === id) ?? null;
}

export async function getSeoLocalDashboardSummary() {
  const [locations, pages] = await Promise.all([getSeoLocations(), getSeoLocalPages()]);

  const byStatus = pages.reduce<Record<SeoContentStatus, number>>(
    (acc, page) => {
      acc[page.contentStatus] += 1;
      return acc;
    },
    { draft: 0, review: 0, approved: 0, published: 0 },
  );

  const byCoverage = pages.reduce<Record<SeoCoverageStatus, number>>(
    (acc, page) => {
      acc[page.coverageStatus] += 1;
      return acc;
    },
    { none: 0, limited: 0, sufficient: 0 },
  );

  const warnings = pages.filter((page) => page.qualityLabel === "onvoldoende" || page.duplicateRisk !== "low" || page.coverageStatus === "none").length;
  const avg = pages.length ? Math.round(pages.reduce((sum, page) => sum + page.qualityScore, 0) / pages.length) : 0;

  return {
    totalLocations: locations.length,
    totalLocalPages: pages.length,
    drafts: byStatus.draft,
    review: byStatus.review,
    publishedStatus: byStatus.published,
    approved: byStatus.approved,
    published: pages.filter((page) => page.published).length,
    indexable: pages.filter((page) => page.indexable).length,
    nonIndexable: pages.filter((page) => !page.indexable).length,
    coverageNone: byCoverage.none,
    coverageLimited: byCoverage.limited,
    coverageSufficient: byCoverage.sufficient,
    averageQualityScore: avg,
    warningPages: warnings,
  };
}

export async function getSeoLocalPreviewModel(id: string) {
  const page = await getSeoLocalPageById(id);
  if (!page) return null;

  return {
    h1: page.page.h1,
    intro: page.page.intro,
    sections: page.page.sections,
    faqs: page.page.faqs,
    cta: page.page.cta,
    relatedLinks: page.page.relatedLinks,
  };
}

export async function getSeoPageTextCorpus(excludeId?: string) {
  const pages = await getSeoLocalPages();
  return pages
    .filter((page) => page.id !== excludeId)
    .map((page) => [page.page.intro.join(" "), page.page.sections.flatMap((section) => section.paragraphs).join(" ")].join(" "));
}

export async function getSeoLocalPagesAdminList(input: {
  service?: string;
  subservice?: string;
  city?: string;
  province?: string;
  status?: string;
  published?: string;
  indexable?: string;
  coverage?: string;
  duplicate?: "any-warning" | "high" | "none" | "";
  qualityLt?: number;
  page?: number;
  pageSize?: number;
  sort?: "updated_desc" | "quality_asc" | "quality_desc";
}) {
  const page = Math.max(1, input.page ?? 1);
  const pageSize = Math.max(10, Math.min(100, input.pageSize ?? 25));
  const offset = (page - 1) * pageSize;

  const filterFn = (item: DatabaseBackedLocalPage, locationsBySlug: Map<string, SeoLocation>) => {
    const location = locationsBySlug.get(item.citySlug);
    if (input.service && item.serviceSlug !== input.service) return false;
    if (input.subservice && (item.subserviceSlug ?? "") !== input.subservice) return false;
    if (input.city && item.citySlug !== input.city) return false;
    if (input.province && location?.province !== input.province) return false;
    if (input.status && item.contentStatus !== input.status) return false;
    if (input.published === "true" && !item.published) return false;
    if (input.published === "false" && item.published) return false;
    if (input.indexable === "true" && !item.indexable) return false;
    if (input.indexable === "false" && item.indexable) return false;
    if (input.coverage && item.coverageStatus !== input.coverage) return false;
    if (input.duplicate === "high" && item.duplicateRisk !== "high") return false;
    if (input.duplicate === "any-warning" && item.duplicateRisk === "low") return false;
    if (input.duplicate === "none" && item.duplicateRisk !== "low") return false;
    if (typeof input.qualityLt === "number" && item.qualityScore >= input.qualityLt) return false;
    return true;
  };

  const sortFn = (left: DatabaseBackedLocalPage, right: DatabaseBackedLocalPage) => {
    if (input.sort === "quality_asc") return left.qualityScore - right.qualityScore;
    if (input.sort === "quality_desc") return right.qualityScore - left.qualityScore;
    return right.canonicalPath.localeCompare(left.canonicalPath);
  };

  if (!isSupabaseConfigured()) {
    const [rows, locations] = await Promise.all([getSeoLocalPages(), getSeoLocations()]);
    const locationBySlug = new Map(locations.map((item) => [item.slug, item]));
    const filtered = rows.filter((row) => filterFn(row, locationBySlug)).sort(sortFn);
    return {
      rows: filtered.slice(offset, offset + pageSize).map((row) => ({ ...row, location: locationBySlug.get(row.citySlug) ?? null })),
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
    };
  }

  const supabase = createAdminSupabaseClient();
  let query = supabase
    .from("seo_local_pages")
    .select(
      "id, service_slug, subservice_slug, location_id, canonical_path, local_intro, local_sections, faqs, related_local_links, related_service_links, published, indexable, content_status, quality_score, duplicate_risk, coverage_status, created_at, updated_at, location:seo_locations(id, slug, name, province, region_label, tier, content_profile, intro_facts, local_characteristics, nearby_city_slugs, population_band, housing_notes, published, indexable, priority, created_at, updated_at)",
      { count: "exact" },
    );

  if (input.service) query = query.eq("service_slug", input.service);
  if (input.subservice) query = query.eq("subservice_slug", input.subservice);
  if (input.city) query = query.eq("location.slug", input.city);
  if (input.province) query = query.eq("location.province", input.province);
  if (input.status) query = query.eq("content_status", input.status);
  if (input.published === "true") query = query.eq("published", true);
  if (input.published === "false") query = query.eq("published", false);
  if (input.indexable === "true") query = query.eq("indexable", true);
  if (input.indexable === "false") query = query.eq("indexable", false);
  if (input.coverage) query = query.eq("coverage_status", input.coverage);
  if (input.duplicate === "high") query = query.eq("duplicate_risk", "high");
  if (input.duplicate === "none") query = query.eq("duplicate_risk", "low");
  if (input.duplicate === "any-warning") query = query.neq("duplicate_risk", "low");
  if (typeof input.qualityLt === "number") query = query.lt("quality_score", input.qualityLt);

  if (input.sort === "quality_asc") query = query.order("quality_score", { ascending: true });
  else if (input.sort === "quality_desc") query = query.order("quality_score", { ascending: false });
  else query = query.order("updated_at", { ascending: false }).order("canonical_path", { ascending: true });

  const { data, count, error } = await query.range(offset, offset + pageSize - 1);
  if (error) {
    return { rows: [], total: 0, page, pageSize, totalPages: 1 };
  }

  const rawRows = ((data ?? []) as Array<Record<string, unknown>>).map(rowToLocalPage).filter((row): row is SeoLocalPageWithLocation => Boolean(row));
  const corpus = rawRows.map((row) => [coerceStringArray(row.local_intro).join(" "), JSON.stringify(row.local_sections)].join(" "));
  const mapped = rawRows.map((row) => {
    const pageRow = toPage(row, corpus);
    return { ...pageRow, location: row.location };
  });

  return {
    rows: mapped,
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
  };
}
