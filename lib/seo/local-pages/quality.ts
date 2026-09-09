import type { ServiceSection } from "@/lib/content/service-pages";

const placeholderPatterns = [/\blorem\b/i, /\btodo\b/i, /\bn\.t\.b\b/i, /\bvul\s+in\b/i, /\bplaceholder\b/i];

function normalize(value: string) {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

export function detectDuplicateRisk(input: { intro: string[]; sections: ServiceSection[]; existingCorpus: string[] }) {
  const introText = normalize(input.intro.join(" "));
  const sectionText = normalize(
    input.sections.flatMap((section) => [section.heading, ...section.paragraphs, ...(section.bullets ?? [])]).join(" "),
  );

  if (!introText || !sectionText) {
    return { level: "high" as const, reason: "Inhoud onvolledig voor duplicate-check." };
  }

  const exactIntroMatch = input.existingCorpus.some((item) => normalize(item) === introText);
  if (exactIntroMatch) {
    return { level: "high" as const, reason: "Intro is exact gelijk aan bestaande pagina." };
  }

  const sectionChunks = new Set(sectionText.split(".").map((line) => normalize(line)).filter((line) => line.length > 35));
  let overlap = 0;
  for (const corpusItem of input.existingCorpus) {
    const normalized = normalize(corpusItem);
    for (const chunk of sectionChunks) {
      if (normalized.includes(chunk)) {
        overlap += 1;
      }
    }
  }

  if (overlap >= 4) {
    return { level: "high" as const, reason: "Hoge overlap met bestaande teksten." };
  }

  if (overlap >= 2) {
    return { level: "medium" as const, reason: "Gedeeltelijke overlap met bestaande teksten." };
  }

  return { level: "low" as const, reason: "Geen relevante duplicaten gedetecteerd." };
}

export function calculateLocalQualityScore(input: {
  canonicalPath: string;
  intro: string[];
  sections: ServiceSection[];
  faqsCount: number;
  relatedLinksCount: number;
  duplicateRisk: "low" | "medium" | "high";
}) {
  let score = 0;

  if (input.canonicalPath.startsWith("/")) score += 10;
  if (input.intro.length >= 2 && input.intro.join(" ").length >= 180) score += 20;
  if (input.sections.length >= 4) score += 25;
  else if (input.sections.length >= 2) score += 12;
  if (input.faqsCount >= 4) score += 20;
  else if (input.faqsCount >= 2) score += 10;
  if (input.relatedLinksCount >= 3) score += 10;

  const hasPlaceholder = [...input.intro, ...input.sections.flatMap((section) => section.paragraphs)].some((value) =>
    placeholderPatterns.some((pattern) => pattern.test(value)),
  );
  if (!hasPlaceholder) score += 15;

  if (input.duplicateRisk === "medium") score -= 10;
  if (input.duplicateRisk === "high") score -= 30;

  const clamped = Math.max(0, Math.min(100, score));
  const label = clamped < 55 ? "onvoldoende" : clamped < 80 ? "redelijk" : "goed";

  return {
    score: clamped,
    label,
    hasPlaceholder,
  };
}
