import type { ServiceSection } from "../../content/service-pages.ts";

const placeholderPatterns = [/\blorem\b/i, /\btodo\b/i, /\bn\.t\.b\b/i, /\bvul\s+in\b/i, /\bplaceholder\b/i];

export type QualityLabel = "onvoldoende" | "redelijk" | "goed";

function normalize(value: string) {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

function tokenSet(value: string) {
  return new Set(
    normalize(value)
      .split(/[^a-z0-9à-ÿ]+/i)
      .filter((token) => token.length > 3),
  );
}

function jaccard(left: Set<string>, right: Set<string>) {
  const union = new Set([...left, ...right]);
  if (!union.size) return 0;
  let shared = 0;
  for (const token of left) {
    if (right.has(token)) shared += 1;
  }
  return shared / union.size;
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

  const introTokens = tokenSet(introText);
  const nearIdenticalIntro = input.existingCorpus.some((item) => jaccard(introTokens, tokenSet(item)) > 0.9);
  if (nearIdenticalIntro) {
    return { level: "high" as const, reason: "Intro lijkt vrijwel identiek op bestaande content." };
  }

  const normalizedParagraphs = input.sections.flatMap((section) => section.paragraphs.map((paragraph) => normalize(paragraph)));
  const duplicateParagraphs = normalizedParagraphs.filter(
    (paragraph, index, values) => paragraph.length > 35 && values.findIndex((value) => value === paragraph) !== index,
  );
  if (duplicateParagraphs.length > 0) {
    return { level: "high" as const, reason: "Exact duplicate paragrafen binnen de pagina gedetecteerd." };
  }

  const normalizedHeadings = input.sections.map((section) => normalize(section.heading));
  const repeatedHeadings = normalizedHeadings.filter(
    (heading, index, values) => heading.length > 0 && values.findIndex((value) => value === heading) !== index,
  );
  if (repeatedHeadings.length > 0) {
    return { level: "medium" as const, reason: "Sectieheading herhaalt binnen dezelfde pagina." };
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
    return { level: "high" as const, reason: "Hoge overlap met bestaande teksten binnen hetzelfde vakgebied." };
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
  hasLocalContext?: boolean;
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
  if (input.hasLocalContext ?? true) score += 10;

  const uniqueIntroLines = new Set(input.intro.map((line) => normalize(line))).size;
  if (uniqueIntroLines >= 2) score += 5;

  if (input.duplicateRisk === "medium") score -= 10;
  if (input.duplicateRisk === "high") score -= 30;

  const clamped = Math.max(0, Math.min(100, score));
  const label: QualityLabel = clamped < 55 ? "onvoldoende" : clamped < 80 ? "redelijk" : "goed";

  return {
    score: clamped,
    label,
    hasPlaceholder,
  };
}
