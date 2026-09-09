export type LeadAttribution = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  landing_page: string | null;
  referrer: string | null;
  gclid: string | null;
  fbclid: string | null;
  first_touch_source: string | null;
  first_touch_timestamp: string | null;
};

const LAST_TOUCH_STORAGE_KEY = "vakconnect:attribution:last-touch";
const FIRST_TOUCH_STORAGE_KEY = "vakconnect:attribution:first-touch";

export function normalizeUtmValue(value: string | null | undefined) {
  if (!value) return null;
  const trimmed = value.trim().toLowerCase();
  return trimmed.length ? trimmed.slice(0, 120) : null;
}

function normalizeOptionalValue(value: string | null | undefined) {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed.slice(0, 500) : null;
}

function inferSource(data: Pick<LeadAttribution, "utm_source" | "gclid" | "fbclid" | "referrer">) {
  if (data.utm_source) return data.utm_source;
  if (data.gclid) return "google_ads";
  if (data.fbclid) return "meta_ads";

  if (data.referrer) {
    try {
      return new URL(data.referrer).hostname.replace(/^www\./, "").slice(0, 120) || "referral";
    } catch {
      return "referral";
    }
  }

  return "direct";
}

export function parseAttributionFromUrl(url: URL, referrer?: string) {
  const utm_source = normalizeUtmValue(url.searchParams.get("utm_source"));
  const utm_medium = normalizeUtmValue(url.searchParams.get("utm_medium"));
  const utm_campaign = normalizeUtmValue(url.searchParams.get("utm_campaign"));
  const utm_term = normalizeUtmValue(url.searchParams.get("utm_term"));
  const utm_content = normalizeUtmValue(url.searchParams.get("utm_content"));
  const gclid = normalizeOptionalValue(url.searchParams.get("gclid"));
  const fbclid = normalizeOptionalValue(url.searchParams.get("fbclid"));
  const landing_page = normalizeOptionalValue(`${url.pathname}${url.search}`);
  const normalizedReferrer = normalizeOptionalValue(referrer ?? null);

  const attribution = {
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    landing_page,
    referrer: normalizedReferrer,
    gclid,
    fbclid,
    first_touch_source: null,
    first_touch_timestamp: null,
  } satisfies LeadAttribution;

  return {
    ...attribution,
    first_touch_source: inferSource(attribution),
  };
}

function loadStoredValue<T>(key: string): T | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function saveStoredValue(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getStoredAttributionSnapshot() {
  if (typeof window === "undefined") {
    return {
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_term: null,
      utm_content: null,
      landing_page: null,
      referrer: null,
      gclid: null,
      fbclid: null,
      first_touch_source: null,
      first_touch_timestamp: null,
    } satisfies LeadAttribution;
  }

  const parsed = parseAttributionFromUrl(new URL(window.location.href), document.referrer || undefined);
  const previousLastTouch = loadStoredValue<Partial<LeadAttribution>>(LAST_TOUCH_STORAGE_KEY);

  const currentLastTouch = {
    ...previousLastTouch,
    ...parsed,
    first_touch_source: null,
    first_touch_timestamp: null,
  } as LeadAttribution;

  saveStoredValue(LAST_TOUCH_STORAGE_KEY, currentLastTouch);

  const previousFirstTouch = loadStoredValue<{ source: string; timestamp: string }>(FIRST_TOUCH_STORAGE_KEY);
  const currentFirstTouch = previousFirstTouch ?? {
    source: parsed.first_touch_source ?? "direct",
    timestamp: new Date().toISOString(),
  };

  if (!previousFirstTouch) {
    saveStoredValue(FIRST_TOUCH_STORAGE_KEY, currentFirstTouch);
  }

  return {
    ...currentLastTouch,
    first_touch_source: currentFirstTouch.source,
    first_touch_timestamp: currentFirstTouch.timestamp,
  } satisfies LeadAttribution;
}
