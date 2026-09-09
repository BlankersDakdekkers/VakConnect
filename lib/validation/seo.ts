import { z } from "zod";
import { seoContentStatusValues } from "@/lib/seo/types";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const canonicalRegex = /^\/[a-z0-9-]+\/[a-z0-9-]+(?:\/[a-z0-9-]+)?$/;

export const seoLocationInputSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  name: z.string().trim().min(2, "Naam is verplicht.").max(120),
  slug: z.string().trim().regex(slugRegex, "Slug moet uit kleine letters, cijfers en koppeltekens bestaan."),
  province: z.string().trim().min(2, "Provincie is verplicht.").max(120),
  regionLabel: z.string().trim().max(120).optional().or(z.literal("")),
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
  citySlugs: z.array(z.string().trim().regex(slugRegex)).min(1),
  redirectTo: z.string().startsWith("/admin/seo/lokaal"),
});
