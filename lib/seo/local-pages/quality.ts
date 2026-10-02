import type { ServiceSection } from "../../content/service-pages.ts";

const placeholderPatterns = [
  /\blorem\b/i,
  /\btodo\b/i,
  /\bn\.t\.b\b/i,
  /\bvul\s+in\b/i,
  /\bplaceholder\b/i,
  /\bbinnen\s+\d+\s+minuten\b/i,
  /\b(?:honderden|duizenden)\s+klanten\b/i,
  /\baltijd\s+een\s+vakman\b/i,
  /\b(?:de\s+)?beste\s+.+\s+in\s+[a-z-]+/i,
];
const stopWords = new Set([
  "aan",
  "als",
  "bij",
  "dan",
  "dat",
  "de",
  "dit",
  "een",
  "en",
  "er",
  "het",
  "in",
  "is",
  "je",
  "met",
  "naar",
  "of",
  "om",
  "op",
  "te",
  "van",
  "voor",
  "via",
  "waar",
  "wat",
  "wij",
  "wordt",
  "zijn",
  "zo",
  "vakconnect",
]);

export type QualityLabel = "onvoldoende" | "redelijk" | "goed";

export type LocalPageTextCorpusItem = {
  id?: string;
  serviceSlug: string;
  subserviceSlug: string | null;
  cityName: string;
  citySlug: string;
  intro: string;
  fullText: string;
  title?: string;
  description?: string;
  canonicalPath?: string;
  published?: boolean;
  indexable?: boolean;
  contentStatus?: string;
};

function stripAccents(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalize(value: string, cityNames: string[] = []) {
  let result = stripAccents(value).replace(/\s+/g, " ").trim().toLowerCase();

  for (const cityName of [...new Set(cityNames)].sort((left, right) => right.length - left.length)) {
    const normalizedName = stripAccents(cityName).trim().toLowerCase();
    if (!normalizedName) continue;
    const pattern = escapeRegExp(normalizedName).replace(/\s+/g, "[-\\s]+");
    result = result.replace(new RegExp(`(^|[^a-z0-9])${pattern}(?=$|[^a-z0-9])`, "g"), "$1plaats");
  }

  return result;
}

function tokenSet(value: string, cityNames: string[] = []) {
  return new Set(
    normalize(value, cityNames)
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 2 && token !== "plaats" && !stopWords.has(token)),
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

function sectionText(sections: ServiceSection[]) {
  return sections.flatMap((section) => [section.heading, ...section.paragraphs, ...(section.bullets ?? [])]).join(" ");
}

function countWords(value: string) {
  return stripAccents(value).match(/[a-z0-9]+(?:['-][a-z0-9]+)*/gi)?.length ?? 0;
}

export function hasLocalContext(input: {
  text: string;
  cityName: string;
  regionLabel?: string | null;
  localFacts: string[];
}) {
  const normalizedText = normalize(input.text);
  const cityNeutralText = normalize(input.text, [input.cityName]);
  const cityName = normalize(input.cityName);
  const regionLabel = input.regionLabel ? normalize(input.regionLabel) : "";
  const mentionsLocation = (cityName.length > 0 && normalizedText.includes(cityName)) || (regionLabel.length > 0 && normalizedText.includes(regionLabel));
  if (!mentionsLocation) return false;

  return input.localFacts.some((fact) => {
    const normalizedFact = normalize(fact, [input.cityName]);
    return normalizedFact.length >= 40 && cityNeutralText.includes(normalizedFact);
  });
}

export function hasUniqueLocalMetadata(input: {
  title: string;
  description: string;
  serviceSlug: string;
  currentId?: string;
  existingCorpus: LocalPageTextCorpusItem[];
}) {
  return !input.existingCorpus.some(
    (item) =>
      item.serviceSlug === input.serviceSlug &&
      item.id !== input.currentId &&
      ((item.title && item.title === input.title) || (item.description && item.description === input.description)),
  );
}

export function detectDuplicateRisk(input: {
  intro: string[];
  sections: ServiceSection[];
  existingCorpus: LocalPageTextCorpusItem[];
  serviceSlug?: string;
  subserviceSlug?: string | null;
  cityName?: string;
  cityNames?: string[];
  title?: string;
  description?: string;
}) {
  const introText = normalize(input.intro.join(" "), input.cityNames ?? []);
  const bodyText = normalize(sectionText(input.sections), input.cityNames ?? []);

  if (!introText || !bodyText) {
    return { level: "high" as const, similarity: 0, reason: "Inhoud onvolledig voor duplicate-check." };
  }

  const comparablePages = input.existingCorpus.filter(
    (item) =>
      item.serviceSlug === input.serviceSlug &&
      item.subserviceSlug === (input.subserviceSlug ?? null) &&
      !(input.cityName && item.cityName === input.cityName),
  );
  const cityNames = [...(input.cityNames ?? []), input.cityName ?? "", ...comparablePages.flatMap((item) => [item.cityName, item.citySlug.replace(/-/g, " ")])];
  const currentTokens = tokenSet(`${input.intro.join(" ")} ${sectionText(input.sections)}`, cityNames);
  const similarity = comparablePages.reduce((highest, item) => {
    const overlap = jaccard(currentTokens, tokenSet(item.fullText, cityNames));
    return Math.max(highest, overlap);
  }, 0);

  const normalizedIntro = normalize(input.intro.join(" "), cityNames);
  const exactIntroMatch = comparablePages.some((item) => normalize(item.intro, cityNames) === normalizedIntro);
  if (exactIntroMatch) {
    return { level: "high" as const, similarity, reason: "Intro blijft gelijk nadat plaatsnamen zijn geneutraliseerd." };
  }

  const introTokens = tokenSet(input.intro.join(" "), cityNames);
  const nearIdenticalIntro = comparablePages.some((item) => jaccard(introTokens, tokenSet(item.intro, cityNames)) >= 0.8);
  if (nearIdenticalIntro) {
    return { level: "high" as const, similarity, reason: "Intro heeft sterke overlap met een andere stadspagina na plaatsnaam-normalisatie." };
  }

  const normalizedParagraphs = input.sections.flatMap((section) => section.paragraphs.map((paragraph) => normalize(paragraph, cityNames)));
  const duplicateParagraphs = normalizedParagraphs.filter(
    (paragraph, index, values) => paragraph.length > 35 && values.findIndex((value) => value === paragraph) !== index,
  );
  if (duplicateParagraphs.length > 0) {
    return { level: "high" as const, similarity, reason: "Exact duplicate paragrafen binnen de pagina gedetecteerd." };
  }

  const normalizedHeadings = input.sections.map((section) => normalize(section.heading, cityNames));
  const repeatedHeadings = normalizedHeadings.filter(
    (heading, index, values) => heading.length > 0 && values.findIndex((value) => value === heading) !== index,
  );
  if (repeatedHeadings.length > 0) {
    return { level: "medium" as const, similarity, reason: "Sectieheading herhaalt binnen dezelfde pagina." };
  }

  if (similarity >= 0.72) {
    return { level: "high" as const, similarity, reason: "Inhoudsoverlap met een pagina voor dezelfde dienst/klus is ≥72% na plaatsnaam-normalisatie." };
  }

  if (similarity >= 0.58) {
    return { level: "medium" as const, similarity, reason: "Inhoudsoverlap is 58–71% na plaatsnaam-normalisatie; handmatige redactionele controle nodig." };
  }

  if (
    (input.title && comparablePages.some((item) => item.title === input.title)) ||
    (input.description && comparablePages.some((item) => item.description === input.description))
  ) {
    return { level: "medium" as const, similarity, reason: "Meta title of description is gelijk aan een andere pagina binnen dezelfde dienst." };
  }

  return { level: "low" as const, similarity, reason: "Geen relevante duplicaten gedetecteerd." };
}

export function calculateLocalQualityScore(input: {
  canonicalPath: string;
  intro: string[];
  sections: ServiceSection[];
  faqsCount: number;
  relatedLinksCount: number;
  duplicateRisk: "low" | "medium" | "high";
  hasLocalContext?: boolean;
  title?: string;
  description?: string;
  h1?: string;
  hasCta?: boolean;
  hasUniqueMetadata?: boolean;
  bodyText?: string;
}) {
  const bodyText = input.bodyText ?? `${input.intro.join(" ")} ${sectionText(input.sections)}`;
  const contentWordCount = countWords(bodyText);
  const hasPlaceholder = [...input.intro, sectionText(input.sections), bodyText].some((value) =>
    placeholderPatterns.some((pattern) => pattern.test(value)),
  );
  const hasLocalContext = input.hasLocalContext ?? true;
  const hasMetadata = Boolean(input.title?.trim() && input.description?.trim());
  const hasH1 = Boolean(input.h1?.trim());
  const hasCta = input.hasCta ?? true;

  let score = 0;
  if (/^\/[a-z0-9-]+\/[a-z0-9-]+(?:\/[a-z0-9-]+)?$/.test(input.canonicalPath)) score += 10;
  if (contentWordCount >= 250) score += 20;
  else if (contentWordCount >= 150) score += 10;
  if (input.intro.length >= 2 && input.intro.join(" ").length >= 180) score += 10;
  if (input.sections.length >= 4) score += 15;
  else if (input.sections.length >= 2) score += 8;
  if (input.faqsCount >= 4) score += 10;
  else if (input.faqsCount >= 2) score += 5;
  if (input.relatedLinksCount >= 3) score += 10;
  if (!hasPlaceholder) score += 10;
  if (hasLocalContext) score += 10;
  if (hasMetadata && input.hasUniqueMetadata !== false) score += 5;
  if (hasH1 && hasCta) score += 5;

  if (input.duplicateRisk === "medium") score -= 10;
  if (input.duplicateRisk === "high") score -= 30;

  const clamped = Math.max(0, Math.min(100, score));
  const label: QualityLabel = clamped < 55 ? "onvoldoende" : clamped < 80 ? "redelijk" : "goed";
  const warnings: string[] = [];

  if (contentWordCount < 250) warnings.push("Content te kort");
  if (!input.title?.trim()) warnings.push("Meta title ontbreekt");
  if (!input.description?.trim()) warnings.push("Meta description ontbreekt");
  if (input.hasUniqueMetadata === false) warnings.push("Meta title of description is niet uniek");
  if (!hasH1) warnings.push("H1 ontbreekt");
  if (!hasLocalContext) warnings.push("Geen lokale context");
  if (input.relatedLinksCount < 3) warnings.push("Minder dan 3 interne links");
  if (!hasCta) warnings.push("CTA ontbreekt");
  if (input.title && input.title.length > 60) warnings.push("Meta title te lang");
  if (input.description && input.description.length > 160) warnings.push("Meta description te lang");
  if (hasPlaceholder) warnings.push("Placeholder of niet-onderbouwde lokale claim gevonden");
  if (input.duplicateRisk === "high") warnings.push("Te veel overlap met andere stadspagina");
  else if (input.duplicateRisk === "medium") warnings.push("Mogelijke overlap met andere stadspagina; redactionele review nodig");

  return {
    score: clamped,
    label,
    hasPlaceholder,
    contentWordCount,
    warnings,
  };
}
