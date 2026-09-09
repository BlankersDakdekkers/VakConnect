import { z } from "zod";

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
