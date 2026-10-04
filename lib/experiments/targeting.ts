import { createHash } from "node:crypto";
import { analyticsDeviceCategories, analyticsPageTypes, analyticsReferralChannels, leadFunnelSteps, type AnalyticsPageType } from "../analytics/events.ts";

export const experimentStatusValues = ["draft", "active", "paused", "completed", "archived"] as const;
export type ExperimentStatus = (typeof experimentStatusValues)[number];

export const experimentTargetTypes = ["homepage", "service_page", "local_page", "lead_funnel", "cta", "funnel_step"] as const;
export type ExperimentTargetType = (typeof experimentTargetTypes)[number];

export type ExperimentTargetRules = {
  page_type?: AnalyticsPageType;
  route?: string;
  service_slug?: string;
  city_slug?: string;
  device_category?: "mobile" | "tablet" | "desktop";
  referral_channel?: "organic" | "paid" | "direct" | "referral" | "unknown";
  step_key?: string;
};

export type ExperimentVariant = {
  id: string;
  key: string;
  label: string;
  weight: number;
  is_control: boolean;
};

export function isValidExperimentConfiguration(input: {
  targetType: string;
  slot: string;
  targetRules: Record<string, unknown>;
  goalEvent: string;
  variants: ExperimentVariant[];
}) {
  const allowedRules = new Set(["page_type", "route", "service_slug", "city_slug", "device_category", "referral_channel", "step_key"]);
  const validTargetRules = Object.entries(input.targetRules).every(([key, value]) => {
    if (!allowedRules.has(key) || typeof value !== "string" || value.length > 300) return false;
    if (key === "route") return /^\/[a-z0-9_./-]{0,200}$/.test(value) && !value.includes("//") && value.replace(/\D/g, "").length < 7;
    if (key.endsWith("_slug")) return /^[a-z0-9-]{1,80}$/.test(value);
    if (key === "page_type") return analyticsPageTypes.includes(value as AnalyticsPageType);
    if (key === "device_category") return analyticsDeviceCategories.includes(value as (typeof analyticsDeviceCategories)[number]);
    if (key === "referral_channel") return analyticsReferralChannels.includes(value as (typeof analyticsReferralChannels)[number]);
    if (key === "step_key") return leadFunnelSteps.includes(value as (typeof leadFunnelSteps)[number]);
    return true;
  });
  const pageType = input.targetRules.page_type;
  const targetTypeMatchesPageType =
    !pageType ||
    (input.targetType === "homepage" && pageType === "homepage") ||
    (input.targetType === "service_page" && pageType === "service") ||
    (input.targetType === "local_page" && ["service_city", "subservice_city", "province"].includes(String(pageType))) ||
    ((input.targetType === "lead_funnel" || input.targetType === "funnel_step") && pageType === "lead_funnel");

  return (
    experimentTargetTypes.includes(input.targetType as ExperimentTargetType) &&
    /^[a-z0-9_.]{3,100}$/.test(input.slot) &&
    validTargetRules &&
    targetTypeMatchesPageType &&
    ["public_cta_click", "lead_funnel_started", "lead_submitted"].includes(input.goalEvent) &&
    input.variants.length >= 2 &&
    input.variants.filter((variant) => variant.is_control).length === 1 &&
    input.variants.every((variant) => /^[a-z0-9_]{2,80}$/.test(variant.key) && Number.isInteger(variant.weight) && variant.weight > 0) &&
    input.variants.reduce((total, variant) => total + variant.weight, 0) === 100
  );
}

export function matchesExperimentTarget(
  rules: ExperimentTargetRules,
  context: {
    pageType: AnalyticsPageType | null;
    route: string;
    serviceSlug: string | null;
    citySlug: string | null;
    deviceCategory: "mobile" | "tablet" | "desktop";
    referralChannel: "organic" | "paid" | "direct" | "referral" | "unknown";
    stepKey?: string | null;
  },
) {
  return Object.entries(rules).every(([key, value]) => {
    if (key === "route") return context.route === value;
    if (key === "page_type") return context.pageType === value;
    if (key === "service_slug") return context.serviceSlug === value;
    if (key === "city_slug") return context.citySlug === value;
    if (key === "device_category") return context.deviceCategory === value;
    if (key === "referral_channel") return context.referralChannel === value;
    if (key === "step_key") return context.stepKey === value;
    return false;
  });
}

export function chooseExperimentVariant(sessionId: string, experimentKey: string, variants: ExperimentVariant[]) {
  const validVariants = variants
    .filter((variant) => /^[a-z0-9_]{2,80}$/.test(variant.key) && Number.isInteger(variant.weight) && variant.weight > 0)
    .sort((left, right) => left.key.localeCompare(right.key));
  const control = validVariants.find((variant) => variant.is_control);
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sessionId) ||
    !/^[a-z0-9_]{2,80}$/.test(experimentKey) ||
    validVariants.length < 2 ||
    validVariants.filter((variant) => variant.is_control).length !== 1 ||
    validVariants.reduce((total, variant) => total + variant.weight, 0) !== 100
  ) {
    return control ?? null;
  }

  const digest = createHash("sha256").update(`${sessionId}:${experimentKey}`).digest();
  const bucket = digest.readUInt32BE(0) % 100;
  let cumulativeWeight = 0;
  for (const variant of validVariants) {
    cumulativeWeight += variant.weight;
    if (bucket < cumulativeWeight) return variant;
  }
  return control ?? null;
}
