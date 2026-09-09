import { z } from "zod";
import { professionalStatusValues, professionalVerificationStatusValues } from "./constants.ts";

export const professionalCreationSchema = z.object({
  companyName: z.string().trim().min(2, "Bedrijfsnaam is verplicht.").max(120),
  contactName: z.string().trim().min(2, "Contactpersoon is verplicht.").max(120),
  email: z.email("Vul een geldig e-mailadres in."),
  phone: z.string().trim().min(8, "Telefoonnummer is verplicht.").max(30),
  password: z.string().min(10, "Gebruik minimaal 10 tekens voor het tijdelijke wachtwoord."),
  kvkNumber: z.string().trim().max(20).optional().or(z.literal("")),
  website: z.url("Gebruik een volledige URL inclusief https://").optional().or(z.literal("")),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  status: z.enum(professionalStatusValues),
  verificationStatus: z.enum(professionalVerificationStatusValues).default("unverified"),
  serviceIds: z.array(z.string().uuid()).min(1, "Selecteer minimaal één dienst."),
  postalCodePrefixes: z.array(z.string().regex(/^[1-9][0-9]{3}$/)).min(1, "Voeg minimaal één postcodegebied toe."),
});

export const professionalStatusUpdateSchema = z.object({
  professionalId: z.string().uuid(),
  status: z.enum(professionalStatusValues),
  redirectTo: z.string().startsWith("/admin"),
});

export const professionalVerificationStatusUpdateSchema = z.object({
  professionalId: z.string().uuid(),
  verificationStatus: z.enum(professionalVerificationStatusValues),
  redirectTo: z.string().startsWith("/admin"),
});

export const professionalAdminProfileUpdateSchema = z.object({
  professionalId: z.string().uuid(),
  companyName: z.string().trim().min(2).max(120),
  contactName: z.string().trim().min(2).max(120),
  email: z.email(),
  phone: z.string().trim().min(8).max(30),
  kvkNumber: z.string().trim().max(20).optional().or(z.literal("")),
  website: z.url("Gebruik een volledige URL inclusief https://").optional().or(z.literal("")),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  redirectTo: z.string().startsWith("/admin"),
});

export const professionalProfileUpdateSchema = z.object({
  contactName: z.string().trim().min(2, "Contactpersoon is verplicht.").max(120),
  phone: z.string().trim().min(8, "Telefoonnummer is verplicht.").max(30),
  website: z.url("Gebruik een volledige URL inclusief https://").optional().or(z.literal("")),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
});

export const professionalServiceMutationSchema = z.object({
  professionalId: z.string().uuid(),
  serviceId: z.string().uuid(),
  redirectTo: z.string().startsWith("/admin"),
});

export const professionalServiceToggleSchema = z.object({
  professionalServiceId: z.string().uuid(),
  active: z.enum(["true", "false"]).transform((value) => value === "true"),
  professionalId: z.string().uuid(),
  redirectTo: z.string().startsWith("/admin"),
});

export const professionalAreaMutationSchema = z.object({
  professionalId: z.string().uuid(),
  postalCodePrefix: z.string().trim().regex(/^[1-9][0-9]{3}$/, "Gebruik een geldige postcode4."),
  redirectTo: z.string().startsWith("/admin"),
});

export const professionalAreaDeleteSchema = z.object({
  areaId: z.string().uuid(),
  professionalId: z.string().uuid(),
  redirectTo: z.string().startsWith("/admin"),
});
