const SESSION_STORAGE_KEY = "vakconnect:anonymous-session-id";

export function generateAnonymousSessionId() {
  return crypto.randomUUID();
}

export function getOrCreateAnonymousSessionId() {
  if (typeof window === "undefined") return "";

  const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (existing && existing.length >= 16) {
    return existing;
  }

  const next = generateAnonymousSessionId();
  window.localStorage.setItem(SESSION_STORAGE_KEY, next);
  return next;
}
