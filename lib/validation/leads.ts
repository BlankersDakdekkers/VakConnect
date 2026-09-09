import { z } from "zod";
import {
  assignmentStatusValues,
  leadProgressStatusValues,
  leadStatusValues,
  leadUrgencyValues,
  preferredTimingValues,
} from "./constants.ts";
import { normalizePostalCode } from "../utils.ts";
import { buildDynamicAnswersSchema } from "./dynamic.ts";
import type { ServiceQuestionDefinition } from "./dynamic.ts";

export const leadSubmissionSchema = z.object({
  serviceId: z.string().uuid("Selecteer een geldige dienst."),
  postalCode: z
    .string()
    .min(1, "Postcode is verplicht.")
    .transform(normalizePostalCode)
    .refine((value) => /^[1-9][0-9]{3}[A-Z]{2}$/.test(value), "Gebruik een geldige Nederlandse postcode."),
  houseNumber: z.string().trim().min(1, "Huisnummer is verplicht."),
  houseNumberAddition: z.string().trim().max(12).optional().or(z.literal("")),
  description: z.string().trim().min(20, "Omschrijf de klus in minimaal 20 tekens.").max(2500),
  urgency: z.enum(leadUrgencyValues),
  preferredTiming: z.enum(preferredTimingValues),
  firstName: z.string().trim().min(1, "Voornaam is verplicht.").max(80),
  lastName: z.string().trim().min(1, "Achternaam is verplicht.").max(80),
  phone: z.string().trim().min(8, "Telefoonnummer is verplicht.").max(30),
  email: z.email("Vul een geldig e-mailadres in."),
});

export const leadStatusUpdateSchema = z.object({
  leadId: z.string().uuid(),
  status: z.enum(leadStatusValues),
  redirectTo: z.string().startsWith("/admin"),
});

export const assignmentCreationSchema = z.object({
  leadId: z.string().uuid(),
  professionalId: z.string().uuid(),
  redirectTo: z.string().startsWith("/admin"),
});

export const assignmentDecisionSchema = z.object({
  leadId: z.string().uuid(),
  decision: z.enum(["accepted", "rejected"]),
  redirectTo: z.string().startsWith("/vakman"),
});

export const assignmentProgressUpdateSchema = z.object({
  leadId: z.string().uuid(),
  progressStatus: z.enum(leadProgressStatusValues),
  lossReason: z.string().trim().max(120).optional().or(z.literal("")),
  redirectTo: z.string().startsWith("/vakman"),
});

export const assignmentStatusSchema = z.enum(assignmentStatusValues);

export function createLeadSubmissionSchema(questions: ServiceQuestionDefinition[]) {
  return leadSubmissionSchema.extend({
    dynamicAnswers: buildDynamicAnswersSchema(questions),
  });
}
