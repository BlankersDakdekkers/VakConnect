import "server-only";
import { requireAdminUser } from "@/lib/auth/helpers";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { parseReviewFilters, reviewUuidSchema, type ReviewFilters } from "@/lib/leads/review-taxonomy";

export type ReviewItem = {
  lead_id: string; reference: string; service_id: string; service_name: string; source: string; type: string;
  created_at: string; status: "open" | "in_review" | "resolved" | "dismissed"; review_id: string | null;
  updated_at: string | null; priority: "high" | "medium" | "low"; signals: Record<string, number>; signal_count: number;
};
export type ReviewQueue = {
  items: ReviewItem[]; total: number; page: number; pages: number;
  counts: { open: number; in_review: number; resolved: number; high: number };
  options: { services: Array<{ value: string; label: string }>; sources: Array<{ value: string; label: string }> };
};
export type ReviewAssignment = {
  id: string; professional_id: string; status: string; progress_status: string; loss_reason: string | null;
  mismatch_reason: string | null; reachability: string | null; appointment_status: string | null;
  assigned_at: string | null; contacted_at: string | null; reached_at: string | null;
  appointment_scheduled_at: string | null; outcome_at: string | null; quality_updated_at: string | null;
};
export type ReviewDetail = {
  item: ReviewItem; lead: { created_at: string; reference: string; service_name: string; type: string; source: string };
  assignments: ReviewAssignment[];
  purchases: Array<{ id: string; professional_id: string; status: string; price_credits: number; purchased_at: string | null; refunded_at: string | null }>;
  corrections: Array<{ id: string; professional_id: string; amount: number; created_at: string; type: string }>;
  ledger: Array<{ id: string; professional_id: string; lead_id: string | null; lead_assignment_id: string | null; type: string; amount: number; balance_after: number; created_at: string; created_by_admin_id: string | null }>;
  financial_audit: Array<{ id: string; entity_type: string; entity_id: string; action: string; actor_user_id: string | null; actor_professional_id: string | null; created_at: string }>;
  notes: Array<{ id: string; body: string; actor_user_id: string; created_at: string }>;
  audit: Array<{ id: string; action: string; from_status: string | null; to_status: string; resolution: string | null; actor_user_id: string; created_at: string }>;
  timeline: Array<{ at: string; label: string; assignment_id?: string; purchase_id?: string }>;
};
export async function getAdminLeadQualityQueue(filters: ReviewFilters): Promise<ReviewQueue> {
  await requireAdminUser();
  const safe = parseReviewFilters(Object.fromEntries(Object.entries(filters).map(([key, value]) => [key, String(value)])));
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.rpc("admin_lead_quality_queue", {
    p_days: safe.days, p_status: safe.status, p_signal: safe.signal, p_service: safe.service || null,
    p_source: safe.source, p_type: safe.type, p_refund: safe.refund, p_search: safe.search, p_sort: safe.sort, p_page: safe.page,
  });
  if (error || !data) throw new Error("De kwaliteitswerklijst kon niet worden geladen.");
  return data as ReviewQueue;
}
export async function getAdminLeadQualityDetail(leadId: string): Promise<ReviewDetail | null> {
  await requireAdminUser();
  if (!reviewUuidSchema.safeParse(leadId).success) return null;
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.rpc("admin_lead_quality_detail", { p_lead_id: leadId });
  if (error) throw new Error("Het reviewdossier kon niet worden geladen.");
  return data as ReviewDetail | null;
}
