import type { LeadAssignmentStatus, LeadPurchaseStatus } from "@/types/database";

export function canProfessionalViewLeadContact(input: {
  purchaseStatus?: LeadPurchaseStatus | null;
  assignmentStatus?: LeadAssignmentStatus | null;
  assignmentPurchaseLinked?: boolean;
}) {
  const hasPurchasedAccess = input.purchaseStatus === "purchased";

  if (hasPurchasedAccess) {
    return true;
  }

  if (input.assignmentStatus !== "accepted") {
    return false;
  }

  return input.assignmentPurchaseLinked ? hasPurchasedAccess : true;
}

export function summarizeLeadDescription(description: string, maxLength = 180) {
  const trimmed = description.trim().replace(/\s+/g, " ");
  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return `${trimmed.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

export function getSafeLeadPreview(input: {
  description: unknown;
  postalCode: unknown;
  preferredTiming: unknown;
  images: unknown;
}) {
  const timingLabels: Record<string, string> = {
    asap: "Zo snel mogelijk",
    few_weeks: "Binnen enkele weken",
    one_to_three_months: "Binnen 1 tot 3 maanden",
    later: "Later",
    unknown: "Planning nog niet zeker",
  };
  const postalCode = typeof input.postalCode === "string" ? input.postalCode.replace(/\s/g, "").toUpperCase() : "";
  return {
    postalCodePrefix: /^[1-9]\d{3}[A-Z]{2}$/.test(postalCode) ? postalCode.slice(0, 4) : null,
    planning: typeof input.preferredTiming === "string" && Object.hasOwn(timingLabels, input.preferredTiming)
      ? timingLabels[input.preferredTiming]
      : "Planning niet ingevuld",
    hasDescription: typeof input.description === "string" && input.description.trim().length > 0,
    imageCount: Array.isArray(input.images) ? input.images.length : 0,
    summary: "De vrije klusomschrijving en vrije intake-antwoorden zijn na geldige toegang zichtbaar, omdat ze contactgegevens kunnen bevatten.",
  };
}

export function getSafeIntakeAnswers(rows: unknown): Array<{ question: string; answer: string }> {
  if (!Array.isArray(rows)) return [];
  return rows.flatMap((row) => {
    if (!row || typeof row !== "object") return [];
    const question = Array.isArray(row.question) ? row.question[0] : row.question;
    if (!question || !["select", "radio", "multiselect"].includes(question.type) || typeof question.question !== "string") return [];
    const values = question.type === "multiselect" ? row.answer_json : [row.answer_text];
    const options = question.service_question_options;
    if (!Array.isArray(values) || !values.length || !Array.isArray(options)) return [];
    const labels = values.map((value) => options.find((option) => option && typeof value === "string" && option.value === value)?.label);
    if (!labels.every((label) => typeof label === "string")) return [];
    return [{ question: question.question, answer: labels.join(", ") }];
  });
}
