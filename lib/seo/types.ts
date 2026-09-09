import type { ServiceContentPageData, ServiceFaq, ServiceLink, ServiceSection } from "@/lib/content/service-pages";
import type { Json } from "@/types/database";

export const seoContentStatusValues = ["draft", "review", "approved", "published"] as const;
export type SeoContentStatus = (typeof seoContentStatusValues)[number];

export type SeoLocation = {
  id: string;
  slug: string;
  name: string;
  province: string;
  region_label: string | null;
  intro_facts: Json;
  local_characteristics: Json;
  nearby_city_slugs: Json;
  population_band: string | null;
  housing_notes: string | null;
  published: boolean;
  indexable: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
};

export type SeoLocalPage = {
  id: string;
  service_slug: string;
  subservice_slug: string | null;
  location_id: string;
  canonical_path: string;
  local_intro: Json;
  local_sections: Json;
  faqs: Json;
  related_local_links: Json;
  related_service_links: Json;
  published: boolean;
  indexable: boolean;
  content_status: SeoContentStatus;
  created_at: string;
  updated_at: string;
};

export type SeoLocalPageWithLocation = SeoLocalPage & {
  location: SeoLocation;
};

export type ResolvedPublicRoute =
  | { type: "local"; localPage: DatabaseBackedLocalPage }
  | { type: "service-sub"; serviceSubPage: ServiceContentPageData };

export type DatabaseBackedLocalPage = {
  id: string;
  serviceSlug: string;
  subserviceSlug: string | null;
  citySlug: string;
  contentStatus: SeoContentStatus;
  published: boolean;
  indexable: boolean;
  canonicalPath: string;
  qualityScore: number;
  qualityLabel: "onvoldoende" | "redelijk" | "goed";
  duplicateRisk: "low" | "medium" | "high";
  page: ServiceContentPageData;
};

export function coerceStringArray(input: Json, fallback: string[] = []) {
  if (!Array.isArray(input)) return fallback;
  return input.map((item) => String(item)).filter(Boolean);
}

export function coerceServiceSections(input: Json): ServiceSection[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return null;
      const record = item as Record<string, Json>;
      const heading = typeof record.heading === "string" ? record.heading : "";
      const paragraphs = coerceStringArray(record.paragraphs, []);
      if (!heading || !paragraphs.length) return null;
      const bullets = coerceStringArray(record.bullets, []);
      const type = record.type === "info" || record.type === "warning" || record.type === "default" ? record.type : undefined;
      return {
        heading,
        paragraphs,
        ...(bullets.length ? { bullets } : {}),
        ...(type ? { type } : {}),
      } satisfies ServiceSection;
    })
    .filter((item): item is ServiceSection => Boolean(item));
}

export function coerceFaqs(input: Json): ServiceFaq[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return null;
      const record = item as Record<string, Json>;
      const question = typeof record.question === "string" ? record.question : "";
      const answer = typeof record.answer === "string" ? record.answer : "";
      if (!question || !answer) return null;
      return { question, answer } satisfies ServiceFaq;
    })
    .filter((item): item is ServiceFaq => Boolean(item));
}

export function coerceServiceLinks(input: Json): ServiceLink[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return null;
      const record = item as Record<string, Json>;
      const href = typeof record.href === "string" ? record.href : "";
      const title = typeof record.title === "string" ? record.title : "";
      const description = typeof record.description === "string" ? record.description : "";
      if (!href || !title || !description) return null;
      return { href, title, description } satisfies ServiceLink;
    })
    .filter((item): item is ServiceLink => Boolean(item));
}
