import { z } from "zod";
import { serviceQuestionInputSchema, serviceQuestionOptionInputSchema } from "./dynamic.ts";

export const serviceInputSchema = z.object({
  name: z.string().trim().min(2, "Naam is verplicht.").max(120),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is verplicht.")
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Gebruik alleen kleine letters, cijfers en koppeltekens."),
  category: z.string().trim().min(2, "Categorie is verplicht.").max(120),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  active: z.boolean().default(true),
});

export const serviceToggleSchema = z.object({
  serviceId: z.string().uuid(),
  active: z.boolean(),
  redirectTo: z.string().startsWith("/admin"),
});

export const serviceQuestionToggleSchema = z.object({
  questionId: z.string().uuid(),
  active: z.boolean(),
  redirectTo: z.string().startsWith("/admin"),
});

export const serviceQuestionOptionToggleSchema = z.object({
  optionId: z.string().uuid(),
  active: z.boolean(),
  redirectTo: z.string().startsWith("/admin"),
});

export const serviceQuestionMutationSchema = serviceQuestionInputSchema.extend({
  questionId: z.string().uuid().optional().or(z.literal("")),
  redirectTo: z.string().startsWith("/admin/diensten/"),
});

export const serviceQuestionOptionMutationSchema = serviceQuestionOptionInputSchema.extend({
  optionId: z.string().uuid().optional().or(z.literal("")),
  redirectTo: z.string().startsWith("/admin/diensten/"),
});

export { serviceQuestionInputSchema, serviceQuestionOptionInputSchema };
