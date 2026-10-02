import type { Json } from "../../types/database.ts";

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

export function sanitizeAnalyticsMetadata(input: unknown) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return null;
  }

  const entries = Object.entries(input as Record<string, unknown>)
    .slice(0, 40)
    .filter(([key]) => isKeyAllowed(key))
    .flatMap(([key, value]) => {
      if (key === "route" || key === "source_route") {
        if (typeof value !== "string" || !/^\/[a-zA-Z0-9_./-]{0,300}$/.test(value) || value.includes("//")) return [];
        return [[key, value] as const];
      }

      if (Array.isArray(value)) {
        const safeValues = value.slice(0, 10).map(sanitizeScalar).filter((entry): entry is Json => entry !== null);
        return safeValues.length ? [[key, safeValues] as const] : [];
      }

      const safeValue = sanitizeScalar(value);
      return safeValue === null ? [] : [[key, safeValue] as const];
    })
    .slice(0, 24);

  return entries.length ? Object.fromEntries(entries) : null;
}
