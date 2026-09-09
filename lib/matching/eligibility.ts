import { getPostalCodePrefix } from "../utils.ts";
import { matchingInputSchema } from "../validation/index.ts";
import type { ProfessionalStatus } from "../../types/database.ts";

export interface MatchCandidate {
  professionalId: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  status: ProfessionalStatus;
  serviceLinks: Array<{
    serviceId: string;
    active: boolean;
  }>;
  postalCodePrefixes: string[];
}

export interface MatchingContext {
  leadId?: string;
  serviceId: string;
  postalCode: string;
}

export interface MatchReason {
  code: "professional_active" | "service_link_active" | "postcode_prefix_match";
  label: string;
  passed: boolean;
  points: number;
}

export interface LeadMatchEvaluation {
  professionalId: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  postalCodePrefixes: string[];
  eligible: boolean;
  matchScore: number;
  reasons: MatchReason[];
}

const matchingWeights = {
  professionalActive: 40,
  serviceLinkActive: 35,
  postcodePrefixMatch: 25,
} as const;

export function evaluateProfessionalMatch(candidate: MatchCandidate, context: MatchingContext): LeadMatchEvaluation {
  const payload = matchingInputSchema.parse({
    serviceId: context.serviceId,
    postalCode: context.postalCode,
    candidate,
  });

  const prefix = getPostalCodePrefix(payload.postalCode);
  const isProfessionalActive = payload.candidate.status === "active";
  const hasActiveServiceLink = payload.candidate.serviceLinks.some(
    (serviceLink) => serviceLink.serviceId === payload.serviceId && serviceLink.active,
  );
  const hasPostalCodePrefixMatch = payload.candidate.postalCodePrefixes.includes(prefix);
  const reasons: MatchReason[] = [
    {
      code: "professional_active",
      label: "Vakman heeft actieve status.",
      passed: isProfessionalActive,
      points: isProfessionalActive ? matchingWeights.professionalActive : 0,
    },
    {
      code: "service_link_active",
      label: "Vakman biedt deze dienst actief aan.",
      passed: hasActiveServiceLink,
      points: hasActiveServiceLink ? matchingWeights.serviceLinkActive : 0,
    },
    {
      code: "postcode_prefix_match",
      label: `Werkgebied bevat postcodeprefix ${prefix}.`,
      passed: hasPostalCodePrefixMatch,
      points: hasPostalCodePrefixMatch ? matchingWeights.postcodePrefixMatch : 0,
    },
  ];

  return {
    professionalId: payload.candidate.professionalId,
    companyName: payload.candidate.companyName,
    contactName: payload.candidate.contactName,
    email: payload.candidate.email,
    phone: payload.candidate.phone,
    postalCodePrefixes: payload.candidate.postalCodePrefixes,
    eligible: isProfessionalActive && hasActiveServiceLink && hasPostalCodePrefixMatch,
    matchScore: reasons.reduce((total, reason) => total + reason.points, 0),
    reasons,
  };
}

export function isProfessionalEligibleForLead(candidate: MatchCandidate, context: MatchingContext) {
  return evaluateProfessionalMatch(candidate, context).eligible;
}
