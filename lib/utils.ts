export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function normalizePostalCode(value: string) {
  return value.replace(/\s+/g, "").toUpperCase();
}

export function formatPostalCode(value: string) {
  const normalized = normalizePostalCode(value);

  if (normalized.length !== 6) {
    return normalized;
  }

  return `${normalized.slice(0, 4)} ${normalized.slice(4)}`;
}

export function getPostalCodePrefix(value: string) {
  return normalizePostalCode(value).slice(0, 4);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("nl-NL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
