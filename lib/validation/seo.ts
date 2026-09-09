import { z } from "zod";
import { seoContentStatusValues } from "../seo/types.ts";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const canonicalRegex = /^\/[a-z0-9-]+\/[a-z0-9-]+(?:\/[a-z0-9-]+)?$/;

export const seoLocationInputSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  name: z.string().trim().min(2, "Naam is verplicht.").max(120),
  slug: z.string().trim().regex(slugRegex, "Slug moet uit kleine letters, cijfers en koppeltekens bestaan."),
  province: z.string().trim().min(2, "Provincie is verplicht.").max(120),
  regionLabel: z.string().trim().max(120).optional().or(z.literal("")),
  tier: z.enum(["A", "B", "C"]).default("C"),
  contentProfile: z
    .object({
      urbanDensity: z.enum(["hoog", "gemiddeld", "lager"]),
      buildingEraMix: z.enum(["historische-kern-mix", "naoorlogse-mix", "nieuwbouw-groei", "gemengd"]),
      accessibilityNotes: z.string().trim().min(10).max(240),
      apartmentShareBand: z.enum(["hoog", "gemiddeld", "lager"]),
      renovationContext: z.string().trim().min(10).max(240),
      parkingLogistics: z.string().trim().min(10).max(240),
      historicCore: z.boolean(),
      suburbanExpansion: z.boolean(),
    })
    .default({
      urbanDensity: "gemiddeld",
      buildingEraMix: "gemengd",
      accessibilityNotes: "Bereikbaarheid verschilt per wijk; benoem toegang en planning vooraf.",
      apartmentShareBand: "gemiddeld",
      renovationContext: "Woningvoorraad is gemengd; beschrijf de huidige situatie concreet.",
      parkingLogistics: "Parkeer- en toegangssituatie vooraf benoemen helpt de uitvoering.",
      historicCore: false,
      suburbanExpansion: false,
    }),
  introFacts: z.array(z.string().trim().min(10)).min(2, "Minimaal 2 intro facts vereist."),
  localCharacteristics: z.array(z.string().trim().min(10)).min(2, "Minimaal 2 lokale kenmerken vereist."),
  nearbyCitySlugs: z.array(z.string().trim().regex(slugRegex)).max(12),
  housingNotes: z.string().trim().max(600).optional().or(z.literal("")),
  populationBand: z.string().trim().max(80).optional().or(z.literal("")),
  priority: z.coerce.number().min(0).max(1),
  published: z.boolean().default(false),
  indexable: z.boolean().default(false),
  redirectTo: z.string().startsWith("/admin/seo"),
});

const sectionSchema = z.object({
  heading: z.string().trim().min(4),
  paragraphs: z.array(z.string().trim().min(20)).min(1),
  bullets: z.array(z.string().trim().min(2)).optional(),
  type: z.enum(["default", "warning", "info"]).optional(),
});

const faqSchema = z.object({
  question: z.string().trim().min(6),
  answer: z.string().trim().min(10),
});

const linkSchema = z.object({
  href: z.string().trim().startsWith("/"),
  title: z.string().trim().min(2),
  description: z.string().trim().min(5),
});

export const seoLocalPageInputSchema = z
  .object({
    id: z.string().uuid().optional().or(z.literal("")),
    serviceSlug: z.string().trim().regex(slugRegex),
    subserviceSlug: z.string().trim().regex(slugRegex).optional().or(z.literal("")),
    locationId: z.string().uuid(),
    canonicalPath: z.string().trim().regex(canonicalRegex, "Canonical pad is ongeldig."),
    localIntro: z.array(z.string().trim().min(20)).min(1, "Intro is verplicht."),
    localSections: z.array(sectionSchema).min(1, "Minimaal 1 sectie vereist."),
    faqs: z.array(faqSchema).min(1, "Minimaal 1 FAQ vereist."),
    relatedLocalLinks: z.array(z.string().trim().regex(slugRegex)).optional().default([]),
    relatedServiceLinks: z.array(linkSchema).optional().default([]),
    published: z.boolean().default(false),
    indexable: z.boolean().default(false),
    contentStatus: z.enum(seoContentStatusValues),
    redirectTo: z.string().startsWith("/admin/seo"),
  })
  .superRefine((value, ctx) => {
    if (["draft", "review"].includes(value.contentStatus) && value.indexable) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["indexable"], message: "Draft/review pagina's mogen niet indexeerbaar zijn." });
    }

    if (value.published && value.contentStatus !== "published") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["contentStatus"], message: "Alleen status published mag gepubliceerd worden." });
    }
  });

export const seoBulkCreateSchema = z.object({
  serviceSlug: z.string().trim().regex(slugRegex),
  subserviceSlug: z.string().trim().regex(slugRegex).optional().or(z.literal("")),
  citySlugs: z.array(z.string().trim().regex(slugRegex)).default([]),
  province: z.string().trim().max(120).optional().or(z.literal("")),
  tier: z.enum(["A", "B", "C"]).optional(),
  onlyWithCoverage: z.boolean().optional().default(false),
  redirectTo: z.string().startsWith("/admin/seo/lokaal"),
}).superRefine((value, ctx) => {
  if (!value.citySlugs.length && !value.province && !value.tier) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["citySlugs"],
      message: "Selecteer minimaal steden of gebruik provincie/tier filter.",
    });
  }
});

export const seoBulkStatusSchema = z.object({
  ids: z.array(z.string().uuid()).min(1),
  fromStatus: z.enum(["draft", "review"]),
  toStatus: z.enum(["review", "approved"]),
  redirectTo: z.string().startsWith("/admin/seo/lokaal"),
});
