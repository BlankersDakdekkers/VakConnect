import { getPostalCodePrefix } from "../utils.ts";
import type { ProfessionalStatus } from "@/types/database";

export interface MatchCandidate {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  status: ProfessionalStatus;
  postalCodePrefixes: string[];
}

export interface MatchingContext {
  leadId: string;
  serviceId: string;
  postalCode: string;
}

export function isProfessionalEligibleForLead(candidate: MatchCandidate, context: MatchingContext) {
  return candidate.status === "active" && candidate.postalCodePrefixes.includes(getPostalCodePrefix(context.postalCode));
}
