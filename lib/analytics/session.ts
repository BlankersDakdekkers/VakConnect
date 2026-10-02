const SESSION_STORAGE_KEY = "vakconnect:anonymous-session-id";

export function generateAnonymousSessionId() {
  return crypto.randomUUID();
}

export function getOrCreateAnonymousSessionId() {
  if (typeof window === "undefined") return "";

  try {
    const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (existing && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(existing)) {
      return existing;
    }

    const next = generateAnonymousSessionId();
    window.localStorage.setItem(SESSION_STORAGE_KEY, next);
    return next;
  } catch {
    return generateAnonymousSessionId();
  }
}
