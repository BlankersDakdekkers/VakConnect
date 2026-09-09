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
