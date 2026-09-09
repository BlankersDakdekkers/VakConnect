import { z } from "zod";

export const publicProfessionalApplicationSchema = z.object({
  companyName: z.string().trim().min(2, "Bedrijfsnaam is verplicht.").max(120),
  contactName: z.string().trim().min(2, "Contactpersoon is verplicht.").max(120),
  email: z.email("Vul een geldig e-mailadres in."),
  phone: z.string().trim().min(8, "Telefoonnummer is verplicht.").max(30),
  kvkNumber: z.string().trim().min(8, "Vul een geldig KvK-nummer in.").max(20),
  website: z.url("Gebruik een volledige URL inclusief https://").optional().or(z.literal("")),
  description: z.string().trim().min(20, "Geef een korte bedrijfsomschrijving.").max(2000),
  serviceIds: z.array(z.string().uuid()).min(1, "Selecteer minimaal één dienst."),
  postalCodePrefixes: z.array(z.string().regex(/^[1-9][0-9]{3}$/)).min(1, "Voeg minimaal één werkgebied toe."),
});

export const publicContactSchema = z.object({
  reason: z.enum(["consument", "vakman", "algemeen"]),
  name: z.string().trim().min(2, "Naam is verplicht.").max(120),
  email: z.email("Vul een geldig e-mailadres in."),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  message: z.string().trim().min(20, "Beschrijf je vraag in minimaal 20 tekens.").max(3000),
});
