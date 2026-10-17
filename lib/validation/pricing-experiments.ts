import { z } from "zod";

export const pricingPrimaryMetrics = [
  "offer_to_purchase_rate",
  "purchase_to_reached_rate",
  "purchase_to_appointment_rate",
  "purchase_to_won_rate",
  "net_credits_per_offer",
  "net_credits_per_purchase",
  "matured_credits_per_won",
] as const;

export const pricingDecisionValues = ["keep_control", "adopt_later", "inconclusive", "stop"] as const;
export const pricingGuardrailValues = ["refund_rate", "mismatch_rate", "reachability", "sample_size", "purchase_volume"] as const;

const uuidList = (maximum: number) => z.array(z.string().uuid()).max(maximum)
  .refine((values) => new Set(values).size === values.length, "Verwijder dubbele ID's.");

function parseCsv(value: string) {
  return value.trim() ? value.split(/[\s,]+/).filter(Boolean) : [];
}

export const pricingExperimentDraftSchema = z.object({
  name: z.string().trim().min(2, "Naam is verplicht.").max(120),
  description: z.string().trim().min(3, "Beschrijving is verplicht.").max(1000),
  serviceIds: z.string().trim().max(800).transform(parseCsv).pipe(uuidList(20)),
  commercialTypes: z.enum(["all", "shared", "exclusive"]),
  controlPriceMin: z.union([z.coerce.number().int().min(1).max(100), z.literal("")]),
  controlPriceMax: z.union([z.coerce.number().int().min(1).max(100), z.literal("")]),
  pilotProfessionalIds: z.string().trim().max(800).transform(parseCsv).pipe(uuidList(20)),
  primaryMetric: z.enum(pricingPrimaryMetrics),
  controlWeight: z.coerce.number().int().min(1).max(99),
  variantWeight: z.coerce.number().int().min(1).max(99),
  variantPriceCredits: z.coerce.number().int().min(1).max(100),
}).superRefine((value, ctx) => {
  if (value.controlWeight + value.variantWeight !== 100) {
    ctx.addIssue({ code: "custom", message: "De control- en variantallocatie moeten samen 100% zijn.", path: ["controlWeight"] });
  }
  if (value.controlPriceMin !== "" && value.controlPriceMax !== "" && value.controlPriceMin > value.controlPriceMax) {
    ctx.addIssue({ code: "custom", message: "De minimumprijs moet lager dan of gelijk aan de maximumprijs zijn.", path: ["controlPriceMin"] });
  }
}).transform((value) => ({
  ...value,
  config: {
    segment: {
      ...(value.serviceIds.length ? { service_ids: value.serviceIds } : {}),
      ...(value.commercialTypes === "all" ? {} : { commercial_types: [value.commercialTypes] }),
      ...(value.controlPriceMin === "" ? {} : { control_price_min: value.controlPriceMin }),
      ...(value.controlPriceMax === "" ? {} : { control_price_max: value.controlPriceMax }),
    },
    max_delta_percent: 25,
    pilot_mode: value.pilotProfessionalIds.length > 0,
    pilot_professional_ids: value.pilotProfessionalIds,
  },
}));

export const pricingDecisionSchema = z.object({
  experimentId: z.string().uuid(),
  decision: z.enum(pricingDecisionValues),
  note: z.string().trim().min(3, "Een korte beslisnotitie is verplicht.").max(1000),
});
