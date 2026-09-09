import { z } from "zod";
import {
  leadCommercialTypeValues,
  leadSalesStatusValues,
  walletTransactionTypeValues,
} from "./constants.ts";

const positiveInteger = z.coerce.number().int().positive();
const optionalSlug = z.string().trim().regex(/^[a-z0-9-]+$/, "Gebruik een slug met kleine letters, cijfers en koppeltekens.").optional().or(z.literal(""));

export const leadPurchaseSchema = z.object({
  leadId: z.string().uuid(),
  idempotencyKey: z.string().trim().max(120).optional().or(z.literal("")),
  redirectTo: z.string().startsWith("/vakman"),
});

export const walletAdminMutationSchema = z.object({
  professionalId: z.string().uuid(),
  type: z.enum(["admin_credit", "admin_debit", "promotional_credit", "correction"]),
  amount: positiveInteger,
  reason: z.string().trim().min(3, "Reden is verplicht.").max(240),
  reference: z.string().trim().max(120).optional().or(z.literal("")),
  redirectTo: z.string().startsWith("/admin"),
});

export const leadPricingRuleMutationSchema = z.object({
  ruleId: z.string().uuid().optional().or(z.literal("")),
  serviceId: z.string().uuid().optional().or(z.literal("")),
  subserviceSlug: optionalSlug,
  leadType: z.enum(leadCommercialTypeValues),
  basePriceCredits: positiveInteger,
  exclusiveMultiplier: z.coerce.number().positive().optional(),
  sharedMultiplier: z.coerce.number().positive().optional(),
  minScore: z.coerce.number().int().min(0).max(100).optional(),
  maxScore: z.coerce.number().int().min(0).max(100).optional(),
  active: z.boolean(),
  priority: z.coerce.number().int().min(0).max(1000),
  redirectTo: z.string().startsWith("/admin"),
}).refine((value) => value.minScore === undefined || value.maxScore === undefined || value.minScore <= value.maxScore, {
  message: "Minimale score moet lager of gelijk zijn aan de maximale score.",
  path: ["minScore"],
});

export const leadPricingRuleToggleSchema = z.object({
  ruleId: z.string().uuid(),
  active: z.boolean(),
  redirectTo: z.string().startsWith("/admin"),
});

export const leadCommercialSettingsSchema = z.object({
  leadId: z.string().uuid(),
  subserviceSlug: optionalSlug,
  commercialType: z.enum(leadCommercialTypeValues),
  priceCredits: z.union([positiveInteger, z.literal("")]).transform((value) => value === "" ? null : value),
  maxBuyers: positiveInteger,
  salesStatus: z.enum(leadSalesStatusValues),
  redirectTo: z.string().startsWith("/admin"),
}).superRefine((value, ctx) => {
  if (value.commercialType === "exclusive" && value.maxBuyers !== 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Exclusive leads moeten exact 1 koper hebben.",
      path: ["maxBuyers"],
    });
  }
});

export const leadRefundSchema = z.object({
  purchaseId: z.string().uuid(),
  reason: z.string().trim().min(3, "Refundreden is verplicht.").max(240),
  redirectTo: z.string().startsWith("/admin"),
});

export const purchaseIntentTokenSchema = z
  .string()
  .trim()
  .min(8)
  .max(120)
  .regex(/^[a-zA-Z0-9_-]+$/);

export const walletTransactionReadTypeSchema = z.enum(walletTransactionTypeValues);
