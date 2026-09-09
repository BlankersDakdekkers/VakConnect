import { serviceSubSlugs } from "@/lib/content/service-pages";
import type { ServiceFaq, ServiceSection } from "@/lib/content/service-pages";

const canonicalRegex = /^\/[a-z0-9-]+\/[a-z0-9-]+(?:\/[a-z0-9-]+)?$/;

export function hasSlugCollisionWithSubservice(serviceSlug: string, citySlug: string) {
  return serviceSubSlugs.some((item) => item.vakgebied === serviceSlug && item.subdienst === citySlug);
}

export function validatePublishSafety(input: {
  locationPublished: boolean;
  localPublished: boolean;
  indexable: boolean;
  contentStatus: string;
  canonicalPath: string;
  localIntro: string[];
  localSections: ServiceSection[];
  faqs: ServiceFaq[];
}) {
  if (!input.localPublished) {
    return { ok: true } as const;
  }

  if (!input.locationPublished) {
    return { ok: false as const, reason: "Locatie moet published zijn voordat lokale pagina gepubliceerd wordt." };
  }

  if (input.contentStatus !== "published") {
    return { ok: false as const, reason: "Content status moet published zijn voor publicatie." };
  }

  if (!input.indexable) {
    return { ok: false as const, reason: "Pagina moet indexable=true hebben om gepubliceerd te worden." };
  }

  if (!canonicalRegex.test(input.canonicalPath)) {
    return { ok: false as const, reason: "Canonical path is ongeldig." };
  }

  if (!input.localIntro.length || input.localIntro.join(" ").trim().length < 60) {
    return { ok: false as const, reason: "Lokale intro is verplicht en te kort." };
  }

  if (input.localSections.length < 2) {
    return { ok: false as const, reason: "Minimaal 2 inhoudssecties vereist voor publicatie." };
  }

  if (input.faqs.length < 1) {
    return { ok: false as const, reason: "Minimaal 1 FAQ vereist voor publicatie." };
  }

  return { ok: true } as const;
}

export function isSitemapEligible(input: {
  locationPublished: boolean;
  published: boolean;
  indexable: boolean;
  contentStatus: string;
}) {
  return input.locationPublished && input.published && input.indexable && input.contentStatus === "published";
}
