import { scoringInputSchema } from "../../validation/index.ts";

export const leadScoringWeights = {
  contact: 20,
  address: 15,
  description: 20,
  images: 10,
  requiredIntake: 20,
  preferredTiming: 5,
  completeness: 10,
} as const;

export interface LeadScoreReason {
  key: keyof typeof leadScoringWeights;
  label: string;
  awarded: number;
  max: number;
  summary: string;
}

export interface LeadScoreResult {
  score: number;
  reasons: LeadScoreReason[];
}

function clampLeadScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getRatioPoints(completed: number, total: number, weight: number) {
  if (total <= 0) {
    return weight;
  }

  return Math.round((Math.min(completed, total) / total) * weight);
}

function getDescriptionPoints(descriptionLength: number) {
  if (descriptionLength >= 160) return leadScoringWeights.description;
  if (descriptionLength >= 80) return 15;
  if (descriptionLength >= 20) return 10;
  return 0;
}

function getCompletenessPoints(answeredQuestionCount: number, totalQuestionCount: number, descriptionLength: number) {
  const answerRatio = totalQuestionCount > 0 ? answeredQuestionCount / totalQuestionCount : 1;
  const descriptionSignal = descriptionLength >= 120 ? 1 : descriptionLength >= 60 ? 0.6 : descriptionLength >= 20 ? 0.3 : 0;
  const signal = Math.min(1, answerRatio * 0.65 + descriptionSignal * 0.35);

  return Math.round(signal * leadScoringWeights.completeness);
}

export function scoreLead(rawInput: unknown): LeadScoreResult {
  const input = scoringInputSchema.parse(rawInput);

  const reasons: LeadScoreReason[] = [
    {
      key: "contact",
      label: "Contactgegevens compleet",
      awarded: getRatioPoints(input.contactFieldsCompleted, 4, leadScoringWeights.contact),
      max: leadScoringWeights.contact,
      summary: `${input.contactFieldsCompleted}/4 contactvelden ingevuld.`,
    },
    {
      key: "address",
      label: "Postcode en huisnummer compleet",
      awarded: getRatioPoints(input.addressFieldsCompleted, 2, leadScoringWeights.address),
      max: leadScoringWeights.address,
      summary: `${input.addressFieldsCompleted}/2 adresvelden ingevuld.`,
    },
    {
      key: "description",
      label: "Klusomschrijving kwaliteit",
      awarded: getDescriptionPoints(input.descriptionLength),
      max: leadScoringWeights.description,
      summary: `Omschrijvinglengte: ${input.descriptionLength} tekens.`,
    },
    {
      key: "images",
      label: "Afbeeldingen aanwezig",
      awarded: input.imageCount > 0 ? leadScoringWeights.images : 0,
      max: leadScoringWeights.images,
      summary: `${input.imageCount} afbeelding(en) toegevoegd.`,
    },
    {
      key: "requiredIntake",
      label: "Verplichte intake compleet",
      awarded: getRatioPoints(input.requiredQuestionsAnswered, input.requiredQuestionsCount, leadScoringWeights.requiredIntake),
      max: leadScoringWeights.requiredIntake,
      summary: `${input.requiredQuestionsAnswered}/${input.requiredQuestionsCount} verplichte intakevragen beantwoord.`,
    },
    {
      key: "preferredTiming",
      label: "Voorkeur planning ingevuld",
      awarded: input.preferredTimingProvided ? leadScoringWeights.preferredTiming : 0,
      max: leadScoringWeights.preferredTiming,
      summary: input.preferredTimingProvided ? "Planning is concreet ingevuld." : "Planning ontbreekt of is nog onbekend.",
    },
    {
      key: "completeness",
      label: "Inhoudelijke volledigheid",
      awarded: getCompletenessPoints(input.answeredQuestionCount, input.totalQuestionCount, input.descriptionLength),
      max: leadScoringWeights.completeness,
      summary: `${input.answeredQuestionCount}/${input.totalQuestionCount} intakevragen beantwoord met een omschrijving van ${input.descriptionLength} tekens.`,
    },
  ];

  return {
    score: clampLeadScore(reasons.reduce((total, reason) => total + reason.awarded, 0)),
    reasons,
  };
}
