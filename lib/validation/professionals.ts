import { z } from "zod";
import { professionalStatusValues } from "@/lib/validation/constants";

export const professionalCreationSchema = z.object({
  companyName: z.string().trim().min(2, "Bedrijfsnaam is verplicht.").max(120),
  contactName: z.string().trim().min(2, "Contactpersoon is verplicht.").max(120),
  email: z.email("Vul een geldig e-mailadres in."),
  phone: z.string().trim().min(8, "Telefoonnummer is verplicht.").max(30),
  password: z.string().min(10, "Gebruik minimaal 10 tekens voor het tijdelijke wachtwoord."),
  kvkNumber: z.string().trim().max(20).optional().or(z.literal("")),
  website: z.url("Gebruik een volledige URL inclusief https://").optional().or(z.literal("")),
  status: z.enum(professionalStatusValues),
  serviceIds: z.array(z.string().uuid()).min(1, "Selecteer minimaal één dienst."),
  postalCodePrefixes: z.array(z.string().regex(/^[1-9][0-9]{3}$/)).min(1, "Voeg minimaal één postcodegebied toe."),
});

export const professionalStatusUpdateSchema = z.object({
  professionalId: z.string().uuid(),
  status: z.enum(professionalStatusValues),
  redirectTo: z.string().startsWith("/admin"),
});
