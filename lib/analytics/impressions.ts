function createPageViewId() {
  try {
    return globalThis.crypto.randomUUID();
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  }
}

let pageViewId = createPageViewId();
const seenCtas = new Set<string>();

export function beginAnalyticsPageView() {
  pageViewId = createPageViewId();
  seenCtas.clear();
  return pageViewId;
}

export function shouldRecordCtaImpression(ctaId: string, location: string) {
  const key = `${pageViewId}:${ctaId}:${location}`;
  if (seenCtas.has(key)) return false;
  seenCtas.add(key);
  return true;
}

export function getAnalyticsPageViewId() {
  return pageViewId;
}

function stableShortHash(value: string) {
  let first = 2166136261;
  let second = 5381;
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    first = Math.imul(first ^ code, 16777619);
    second = Math.imul(second ^ code, 33);
  }
  return `${(first >>> 0).toString(36)}${(second >>> 0).toString(36)}`;
}

export function ctaImpressionIdempotencyKey(sessionId: string, pageView: string, ctaId: string, location: string) {
  return `cta_impression:${sessionId}:${pageView}:${stableShortHash(`${ctaId}:${location}`)}`;
}

export function experimentExposureIdempotencyKey(sessionId: string, experimentId: string, variantId: string, context: string) {
  return `experiment_exposed:${sessionId}:${experimentId}:${variantId}:${stableShortHash(context)}`;
}
