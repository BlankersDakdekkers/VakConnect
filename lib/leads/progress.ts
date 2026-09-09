import { leadLossReasonValues, leadProgressStatusValues } from "../validation/constants.ts";
import type { LeadProgressStatus } from "../../types/database.ts";

export const leadProgressTransitions: Record<LeadProgressStatus, LeadProgressStatus[]> = {
  new: ["contacted"],
  contacted: ["appointment_scheduled"],
  appointment_scheduled: ["quote_sent"],
  quote_sent: ["won", "lost"],
  won: [],
  lost: [],
};

export function isValidLeadProgressTransition(fromStatus: LeadProgressStatus, toStatus: LeadProgressStatus) {
  if (!leadProgressStatusValues.includes(fromStatus)) return false;
  if (!leadProgressStatusValues.includes(toStatus)) return false;
  if (fromStatus === toStatus) return true;
  return leadProgressTransitions[fromStatus].includes(toStatus);
}

export function normalizeLeadLossReason(value: string | null | undefined) {
  const trimmed = (value ?? "").trim().toLowerCase();
  if (!trimmed) return null;
  return leadLossReasonValues.includes(trimmed as (typeof leadLossReasonValues)[number]) ? trimmed : null;
}
