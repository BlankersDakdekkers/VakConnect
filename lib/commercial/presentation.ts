export function getMatchExplanation(reasons: unknown) {
  if (!Array.isArray(reasons)) return [];
  const labels: Record<string, string> = {
    service_link_active: "Past bij een dienst die je aanbiedt.",
    postcode_prefix_match: "Het postcodegebied valt binnen je ingestelde werkgebied.",
    professional_active: "Je profiel was actief bij het bepalen van deze match.",
  };
  return [...new Set(reasons.flatMap((reason) => {
    if (!reason || typeof reason !== "object" || reason.passed !== true) return [];
    return typeof reason.code === "string" && Object.hasOwn(labels, reason.code) ? [labels[reason.code]] : [];
  }))];
}

export function getCommercialExplanation(type: string) {
  return type === "exclusive"
    ? "Exclusief: binnen VakConnect is er maximaal één koperslot. Dit garandeert geen opdracht en zegt niets over aanvragen buiten dit platform."
    : "Gedeeld: deze aanvraag kan aan meerdere passende vakmannen worden aangeboden en door meerdere vakmannen worden gekocht.";
}
