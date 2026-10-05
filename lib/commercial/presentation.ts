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

export function getMarketplaceGroup(lead: {
  purchaseStatus: string | null;
  assignmentStatus: string | null;
  offerStatus: string | null;
  offerState: string;
  offerTermExpired: boolean;
}) {
  if (lead.purchaseStatus === "refunded" || lead.purchaseStatus === "cancelled") return "Gesloten of verlopen";
  if (lead.purchaseStatus === "purchased" || (lead.assignmentStatus === "accepted" && !lead.purchaseStatus)) return "Gekocht of toegewezen";
  if (lead.offerStatus === "declined") return "Afgewezen";
  if (lead.offerStatus === "expired") return "Verlopen";
  if (lead.offerTermExpired || lead.offerState === "gesloten") return "Gesloten of verlopen";
  if (lead.offerState === "verloopt_bijna") return "Verloopt binnenkort";
  return "Nieuw aanbod";
}
