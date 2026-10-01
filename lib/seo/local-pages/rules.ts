import { serviceMainSlugs, serviceSubSlugs } from "../../content/service-pages.ts";
import type { ServiceFaq, ServiceSection } from "../../content/service-pages.ts";
import type { SeoCoverageStatus, SeoDuplicateRisk } from "../types.ts";

const canonicalRegex = /^\/[a-z0-9-]+\/[a-z0-9-]+(?:\/[a-z0-9-]+)?$/;

export function hasSlugCollisionWithSubservice(serviceSlug: string, citySlug: string) {
  return serviceSubSlugs.some((item) => item.vakgebied === serviceSlug && item.subdienst === citySlug);
}

export function isValidSeoStatusTransition(input: {
  previousStatus: string | null;
  nextStatus: string;
  nextPublished: boolean;
  contentChanged: boolean;
}) {
  if (!input.previousStatus) {
    return input.nextStatus === "draft" && !input.nextPublished;
  }

  if (input.previousStatus === input.nextStatus) {
    return !(input.previousStatus === "published" && input.contentChanged);
  }

  if (input.previousStatus === "draft" && input.nextStatus === "review") return !input.nextPublished;
  if (input.previousStatus === "review" && input.nextStatus === "approved") return !input.nextPublished;
  if (input.previousStatus === "approved" && input.nextStatus === "published") return input.nextPublished;
  if (input.previousStatus === "published" && ["approved", "review"].includes(input.nextStatus)) return !input.nextPublished;
  return false;
}

export function validatePublishSafety(input: {
  locationPublished: boolean;
  locationIndexable: boolean;
  localPublished: boolean;
  indexable: boolean;
  contentStatus: string;
  canonicalPath: string;
  serviceSlug: string;
  subserviceSlug: string | null;
  citySlug: string;
  localIntro: string[];
  localSections: ServiceSection[];
  faqs: ServiceFaq[];
  qualityScore?: number;
  contentWordCount: number;
  hasMetadata: boolean;
  metadataWithinLimits: boolean;
  hasUniqueMetadata: boolean;
  hasH1: boolean;
  hasCta: boolean;
  hasLocalContext: boolean;
  relatedLinksCount: number;
  relatedLinkHrefs: string[];
  hasPlaceholder: boolean;
  duplicateRisk?: SeoDuplicateRisk;
  coverageStatus?: SeoCoverageStatus;
}) {
  if (!input.localPublished) {
    return { ok: true } as const;
  }

  if (!input.locationPublished) {
    return { ok: false as const, reason: "Locatie moet published zijn voordat lokale pagina gepubliceerd wordt." };
  }

  if (!input.locationIndexable) {
    return { ok: false as const, reason: "Locatie moet indexeerbaar zijn voordat de lokale pagina gepubliceerd kan worden." };
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

  const validService = serviceMainSlugs.includes(input.serviceSlug as (typeof serviceMainSlugs)[number]);
  const validSubservice =
    input.subserviceSlug === null ||
    serviceSubSlugs.some((item) => item.vakgebied === input.serviceSlug && item.subdienst === input.subserviceSlug);
  const expectedPath = input.subserviceSlug
    ? `/${input.serviceSlug}/${input.subserviceSlug}/${input.citySlug}`
    : `/${input.serviceSlug}/${input.citySlug}`;

  if (!validService || !validSubservice || input.canonicalPath !== expectedPath) {
    return { ok: false as const, reason: "Route past niet bij de bestaande combinatie vakgebied, subdienst en stad." };
  }

  if (!input.subserviceSlug && hasSlugCollisionWithSubservice(input.serviceSlug, input.citySlug)) {
    return { ok: false as const, reason: "City-slug botst met een bestaande subdienstslug binnen dit vakgebied." };
  }

  if (!input.localIntro.length || input.localIntro.join(" ").trim().length < 60) {
    return { ok: false as const, reason: "Lokale intro is verplicht en te kort." };
  }

  if (input.localSections.length < 2) {
    return { ok: false as const, reason: "Minimaal 2 inhoudssecties vereist voor publicatie." };
  }

  if (input.faqs.length < 2) {
    return { ok: false as const, reason: "Minimaal 2 FAQ-items vereist voor publicatie." };
  }

  if (input.contentWordCount < 250) {
    return { ok: false as const, reason: "Content te kort: er zijn minimaal 250 inhoudelijke woorden nodig." };
  }

  if (!input.hasMetadata || !input.metadataWithinLimits || !input.hasUniqueMetadata) {
    return { ok: false as const, reason: "Meta title en description moeten aanwezig en uniek zijn." };
  }

  if (!input.hasH1) {
    return { ok: false as const, reason: "Een unieke H1 is verplicht voor publicatie." };
  }

  if (!input.hasCta) {
    return { ok: false as const, reason: "Een CTA naar de bestaande aanvraagflow is verplicht." };
  }

  if (!input.hasLocalContext) {
    return { ok: false as const, reason: "Er ontbreekt controleerbare lokale context." };
  }

  if (input.relatedLinksCount < 3) {
    return { ok: false as const, reason: "Minimaal 3 relevante interne links zijn verplicht." };
  }

  const requiredLinks = [
    `/${input.serviceSlug}`,
    "/aanvraag",
    ...(input.subserviceSlug ? [`/${input.serviceSlug}/${input.subserviceSlug}`, `/${input.serviceSlug}/${input.citySlug}`] : []),
  ];
  if (requiredLinks.some((href) => !input.relatedLinkHrefs.includes(href))) {
    return { ok: false as const, reason: "Link terug naar de hoofdservice, relevante subservice of aanvraag ontbreekt." };
  }

  if (input.hasPlaceholder) {
    return { ok: false as const, reason: "Placeholdertekst of een niet-onderbouwde lokale claim blokkeert publicatie." };
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
  qualityPassed: boolean;
}) {
  return input.locationPublished && input.published && input.indexable && input.contentStatus === "published" && input.qualityPassed;
}
