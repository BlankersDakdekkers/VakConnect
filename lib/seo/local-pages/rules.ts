import { serviceSubSlugs } from "../../content/service-pages.ts";
import type { ServiceFaq, ServiceSection } from "../../content/service-pages.ts";
import type { SeoCoverageStatus, SeoDuplicateRisk } from "../types.ts";

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
  qualityScore?: number;
  duplicateRisk?: SeoDuplicateRisk;
  coverageStatus?: SeoCoverageStatus;
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

  if ((input.qualityScore ?? 0) < 55) {
    return { ok: false as const, reason: "Kwaliteitsscore te laag om te publiceren." };
  }

  if (input.duplicateRisk === "high") {
    return { ok: false as const, reason: "Publicatie geblokkeerd door hoge duplicate risk." };
  }

  if (input.coverageStatus === "none") {
    return { ok: false as const, reason: "Publicatie geblokkeerd: geen coverage voor deze combinatie." };
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
