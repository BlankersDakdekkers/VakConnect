import type { Json } from "../../types/database.ts";

const forbiddenMetadataKeyPatterns = [
  /name/i,
  /first_name/i,
  /last_name/i,
  /email/i,
  /phone/i,
  /address/i,
  /street/i,
  /description/i,
  /message/i,
  /photo/i,
  /image/i,
];

function isKeyAllowed(key: string) {
  return !forbiddenMetadataKeyPatterns.some((pattern) => pattern.test(key));
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
    .filter(([key]) => isKeyAllowed(key))
    .flatMap(([key, value]) => {
      if (Array.isArray(value)) {
        const safeValues = value.map(sanitizeScalar).filter((entry): entry is Json => entry !== null);
        return safeValues.length ? [[key, safeValues] as const] : [];
      }

      const safeValue = sanitizeScalar(value);
      return safeValue === null ? [] : [[key, safeValue] as const];
    });

  return entries.length ? Object.fromEntries(entries) : null;
}
