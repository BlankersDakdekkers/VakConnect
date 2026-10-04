export function normalizePublicConsumerCopy<T>(value: T): T {
  if (typeof value === "string") {
    return value
      .replace(
        /\bVakConnect\s+(?:koppelt|matcht)\b[^.!?;]*(?=[.!?;]|$)/gi,
        "VakConnect zoekt op basis van dienst en regio naar vakmannen die mogelijk passen",
      )
      .replace(/\bprofessionals\b/gi, "vakmannen")
      .replace(/\bprofessional\b/gi, "vakman") as T;
  }
  if (Array.isArray(value)) {
    return value.map(normalizePublicConsumerCopy) as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, normalizePublicConsumerCopy(item)]),
    ) as T;
  }
  return value;
}
