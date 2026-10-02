import type { Json } from "../../types/database.ts";
import {
  analyticsCtaLocations,
  analyticsDestinationTypes,
  analyticsDeviceCategories,
  analyticsDurationBuckets,
  analyticsPageTypes,
  analyticsReferralChannels,
  analyticsValidationErrorTypes,
  leadFunnelSteps,
} from "./events.ts";

const allowedMetadataKeys = new Set([
  "schema_version",
  "route",
  "page_type",
  "service",
  "service_slug",
  "service_id",
  "subservice",
  "subservice_slug",
  "city",
  "city_slug",
  "province_slug",
  "device_category",
  "viewport_bucket",
  "referral_channel",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "first_touch_source",
  "funnel_step",
  "step_key",
  "cta_id",
  "cta_location",
  "question_id",
  "jump_link_id",
  "destination_type",
  "error_type",
  "duration_bucket",
  "source_route",
  "source_page_type",
  "experiment_id",
  "variant_id",
  "step_count",
  "question_count",
  "answered_count",
  "upload_count",
  "viewed_count",
  "completed_count",
  "click_count",
  "started_count",
  "submitted_count",
  "dropped_count",
]);
const numericMetadataKeys = new Set([
  "schema_version",
  "step_count",
  "question_count",
  "answered_count",
  "upload_count",
  "viewed_count",
  "completed_count",
  "click_count",
  "started_count",
  "submitted_count",
  "dropped_count",
]);

function isKeyAllowed(key: string) {
  return allowedMetadataKeys.has(key);
}

function sanitizeScalar(value: unknown): Json | null {
  if (typeof value === "boolean") return value;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed || trimmed.length > 120) return null;
    return trimmed;
  }
  return null;
}

function isSafeDimension(key: string, value: Json) {
  if (numericMetadataKeys.has(key)) {
    return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 && value <= 1_000_000 && (key !== "schema_version" || value === 1);
  }
  if (key === "service_id") return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  if (typeof value !== "string") return true;
  if (/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(value)) return false;
  if (value.replace(/\D/g, "").length >= 7) return false;

  if (["page_type", "source_page_type"].includes(key)) return analyticsPageTypes.includes(value as (typeof analyticsPageTypes)[number]);
  if (["service", "service_slug", "subservice", "subservice_slug", "city", "city_slug", "province_slug"].includes(key)) {
    return /^[a-z0-9-]{1,80}$/.test(value);
  }
  if (["device_category", "viewport_bucket"].includes(key)) return analyticsDeviceCategories.includes(value as (typeof analyticsDeviceCategories)[number]);
  if (key === "referral_channel") return analyticsReferralChannels.includes(value as (typeof analyticsReferralChannels)[number]);
  if (key === "cta_location") return analyticsCtaLocations.includes(value as (typeof analyticsCtaLocations)[number]);
  if (key === "destination_type") return analyticsDestinationTypes.includes(value as (typeof analyticsDestinationTypes)[number]);
  if (key === "step_key" || key === "funnel_step") return leadFunnelSteps.includes(value as (typeof leadFunnelSteps)[number]);
  if (key === "error_type") return analyticsValidationErrorTypes.includes(value as (typeof analyticsValidationErrorTypes)[number]);
  if (key === "duration_bucket") return analyticsDurationBuckets.includes(value as (typeof analyticsDurationBuckets)[number]);
  if (key === "question_id") return /^faq_[1-9]\d{0,2}$/.test(value);
  if (key === "jump_link_id") return /^section_[1-9]\d{0,2}$/.test(value);
  if (key === "cta_id") return /^[a-z0-9_-]{1,80}$/.test(value);
  if (key === "experiment_id" || key === "variant_id") return /^[a-z0-9_-]{1,80}$/i.test(value);
  if (["utm_source", "utm_medium", "utm_campaign", "first_touch_source"].includes(key)) return /^[a-z0-9_. -]{1,120}$/i.test(value);
  return /^[a-z0-9_.-]{1,120}$/i.test(value);
}

export function sanitizeAnalyticsMetadata(input: unknown) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return null;
  }

  const entries = Object.entries(input as Record<string, unknown>)
    .slice(0, 40)
    .filter(([key]) => isKeyAllowed(key))
    .flatMap(([key, value]) => {
      if (key === "route" || key === "source_route") {
        if (
          typeof value !== "string" ||
          !/^\/[a-zA-Z0-9_./-]{0,300}$/.test(value) ||
          value.includes("//") ||
          value.replace(/\D/g, "").length >= 7
        ) return [];
        return [[key, value] as const];
      }

      if (Array.isArray(value)) {
        const safeValues = value
          .slice(0, 10)
          .map(sanitizeScalar)
          .filter((entry): entry is Json => entry !== null)
          .filter((entry) => isSafeDimension(key, entry));
        return safeValues.length ? [[key, safeValues] as const] : [];
      }

      const safeValue = sanitizeScalar(value);
      return safeValue === null || !isSafeDimension(key, safeValue) ? [] : [[key, safeValue] as const];
    })
    .slice(0, 24);

  while (entries.length && JSON.stringify(Object.fromEntries(entries)).length > 4000) {
    entries.pop();
  }

  return entries.length ? Object.fromEntries(entries) : null;
}
