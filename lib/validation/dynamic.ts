import { z } from "zod";
import { serviceQuestionTypeValues } from "./constants.ts";
import type { ServiceQuestion, ServiceQuestionOption, ServiceQuestionType } from "../../types/database.ts";
import { normalizePostalCode } from "../utils.ts";

export interface ServiceQuestionDefinition extends ServiceQuestion {
  options: ServiceQuestionOption[];
}

export type DynamicAnswerValue = string | string[] | boolean | number | null;
export type DynamicAnswerRecord = Record<string, DynamicAnswerValue>;

const optionBackedQuestionTypes: ServiceQuestionType[] = ["select", "multiselect", "radio"];

export const serviceQuestionOptionInputSchema = z.object({
  questionId: z.string().uuid("Kies een geldige vraag."),
  label: z.string().trim().min(1, "Optielabel is verplicht.").max(120),
  value: z
    .string()
    .trim()
    .min(1, "Optiewaarde is verplicht.")
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Gebruik alleen kleine letters, cijfers en koppeltekens."),
  sortOrder: z.coerce.number().int("Sorteervolgorde moet een geheel getal zijn.").min(0),
  active: z.boolean().default(true),
});

export const serviceQuestionInputSchema = z.object({
  serviceId: z.string().uuid("Kies een geldige dienst."),
  question: z.string().trim().min(3, "Vraag is verplicht.").max(200),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is verplicht.")
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Gebruik alleen kleine letters, cijfers en koppeltekens."),
  type: z.enum(serviceQuestionTypeValues),
  helpText: z.string().trim().max(280).optional().or(z.literal("")),
  required: z.boolean().default(false),
  active: z.boolean().default(true),
  sortOrder: z.coerce.number().int("Sorteervolgorde moet een geheel getal zijn.").min(0),
  options: z.array(serviceQuestionOptionInputSchema.omit({ questionId: true })).default([]),
}).superRefine((value, ctx) => {
  if (optionBackedQuestionTypes.includes(value.type)) {
    if (!value.options.length) {
      ctx.addIssue({
        code: "custom",
        path: ["options"],
        message: "Deze vraagsoort vereist minstens één optie.",
      });
    }

    const seenValues = new Set<string>();
    for (const option of value.options) {
      if (seenValues.has(option.value)) {
        ctx.addIssue({
          code: "custom",
          path: ["options"],
          message: "Optiewaardes moeten binnen dezelfde vraag uniek zijn.",
        });
        break;
      }
      seenValues.add(option.value);
    }
  }
});

export const scoringInputSchema = z.object({
  contactFieldsCompleted: z.coerce.number().int().min(0).max(4),
  addressFieldsCompleted: z.coerce.number().int().min(0).max(2),
  descriptionLength: z.coerce.number().int().min(0).max(10000),
  imageCount: z.coerce.number().int().min(0).max(100),
  requiredQuestionsCount: z.coerce.number().int().min(0).max(100),
  requiredQuestionsAnswered: z.coerce.number().int().min(0).max(100),
  answeredQuestionCount: z.coerce.number().int().min(0).max(100),
  totalQuestionCount: z.coerce.number().int().min(0).max(100),
  preferredTimingProvided: z.boolean(),
});

export const matchingInputSchema = z.object({
  serviceId: z.string().uuid(),
  postalCode: z
    .string()
    .trim()
    .transform(normalizePostalCode)
    .refine((value) => /^[1-9][0-9]{3}[A-Z]{2}$/.test(value), "Gebruik een geldige Nederlandse postcode."),
  candidate: z.object({
    professionalId: z.string().uuid(),
    status: z.enum(["pending", "active", "paused", "suspended"]),
    companyName: z.string().min(1),
    contactName: z.string().min(1),
    email: z.email(),
    phone: z.string().min(1),
    serviceLinks: z.array(z.object({
      serviceId: z.string().uuid(),
      active: z.boolean(),
    })).default([]),
    postalCodePrefixes: z.array(z.string().regex(/^[1-9][0-9]{3}$/)).default([]),
  }),
});

function getActiveOptionValues(question: Pick<ServiceQuestionDefinition, "options">) {
  return question.options.filter((option) => option.active).map((option) => option.value);
}

function createQuestionAnswerSchema(question: ServiceQuestionDefinition) {
  const validOptions = getActiveOptionValues(question);

  switch (question.type) {
    case "text":
    case "textarea":
      return z.preprocess(
        (value) => (value === null || value === undefined ? "" : value),
        z.string().trim().max(4000).refine((value) => (question.required ? value.length > 0 : true), "Deze vraag is verplicht."),
      );
    case "number":
      return z.preprocess((value) => {
        if (value === "" || value === null || value === undefined) return undefined;
        if (typeof value === "number") return value;
        if (typeof value === "string") return Number(value.replace(",", "."));
        return value;
      }, question.required
        ? z.number({ error: "Vul een geldig getal in." }).finite("Vul een geldig getal in.")
        : z.number({ error: "Vul een geldig getal in." }).finite("Vul een geldig getal in.").optional());
    case "boolean":
      return z.preprocess((value) => {
        if (value === "" || value === null || value === undefined) return undefined;
        if (typeof value === "boolean") return value;
        if (value === "true") return true;
        if (value === "false") return false;
        return value;
      }, question.required ? z.boolean({ error: "Kies een antwoord." }) : z.boolean().optional());
    case "select":
    case "radio":
      return z.preprocess(
        (value) => (value === null || value === undefined ? "" : value),
        z.string()
          .trim()
          .refine((value) => (question.required ? value.length > 0 : true), "Deze vraag is verplicht.")
          .refine((value) => (value.length === 0 && !question.required) || validOptions.includes(value), "Kies een geldige optie."),
      );
    case "multiselect":
      return z.preprocess((value) => {
        if (value === null || value === undefined || value === "") return [];
        if (Array.isArray(value)) return value;
        return [value];
      }, z.array(z.string().trim())
        .refine((values) => (question.required ? values.length > 0 : true), "Deze vraag is verplicht.")
        .refine((values) => values.every((entry) => validOptions.includes(entry)), "Kies alleen geldige opties."));
    default:
      return z.never();
  }
}

export function buildDynamicAnswersSchema(questions: ServiceQuestionDefinition[]) {
  const shape = Object.fromEntries(
    questions.map((question) => [question.id, createQuestionAnswerSchema(question)]),
  );

  return z.object(shape);
}

export function validateDynamicAnswers(questions: ServiceQuestionDefinition[], answers: Record<string, unknown>) {
  return buildDynamicAnswersSchema(questions).safeParse(answers);
}
