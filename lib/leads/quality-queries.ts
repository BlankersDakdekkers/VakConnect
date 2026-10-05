import "server-only";

import { requireAdminUser } from "@/lib/auth/helpers";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { buildQualityReport, collectQualityPages, unknownRegion, type QualityFilters, type QualityPurchase, type QualityOffer, type QualityCorrection } from "@/lib/leads/quality-reporting";

type Row = Record<string, unknown>;

function object(value: unknown): Row {
  return (Array.isArray(value) ? value[0] : value) as Row ?? {};
}
function text(value: unknown) { return typeof value === "string" ? value : ""; }
function nullable(value: unknown) { return typeof value === "string" ? value : null; }

export async function getAdminLeadQualityReport(filters: QualityFilters) {
  await requireAdminUser();
  const supabase = createAdminSupabaseClient();
  const asOf = new Date();
  const until = asOf.toISOString();
  const since = new Date(asOf.getTime() - filters.days * 86400000).toISOString();
  const [purchaseRows, offerRows, correctionRows] = await Promise.all([
    collectQualityPages<Row>((from, to) => supabase.from("lead_purchases").select(
      "id,lead_id,professional_id,status,purchased_at,commercial_type,lead:leads!lead_purchases_lead_id_fkey(public_reference,service_id,utm_source,service:services(name)),assignment:lead_assignments!lead_purchases_assignment_fk(progress_status,contacted_at,reached_at,appointment_scheduled_at,outcome_at,reachability,appointment_status,mismatch_reason,loss_reason)",
      { count: "exact" },
    ).gte("purchased_at", since).lte("purchased_at", until).order("id").range(from, to)),
    collectQualityPages<Row>((from, to) => supabase.from("lead_distribution_candidates").select(
      "id,offered_at,declined_at,decline_reason,lead:leads(service_id,commercial_type)",
      { count: "exact" },
    ).gte("offered_at", since).lte("offered_at", until).order("id").range(from, to)),
    collectQualityPages<Row>((from, to) => supabase.from("wallet_transactions")
      .select("id,lead_id,professional_id,type,created_at", { count: "exact" }).eq("type", "correction")
      .not("lead_id", "is", null).gte("created_at", since).lte("created_at", until).order("id").range(from, to)),
  ]);
  const purchases: QualityPurchase[] = purchaseRows.map((row) => {
    const lead = object(row.lead);
    const assignment = object(row.assignment);
    return {
      id: text(row.id), leadId: text(row.lead_id), professionalId: text(row.professional_id),
      status: text(row.status), purchasedAt: text(row.purchased_at), type: text(row.commercial_type),
      reference: text(lead.public_reference), serviceId: text(lead.service_id), serviceName: text(object(lead.service).name) || "Dienst onbekend",
      // No independent provenance exists for leads.city; never infer geography from address/postcode.
      region: unknownRegion, utmSource: nullable(lead.utm_source),
      assignment: {
        progressStatus: nullable(assignment.progress_status), contactedAt: nullable(assignment.contacted_at),
        reachedAt: nullable(assignment.reached_at), appointmentScheduledAt: nullable(assignment.appointment_scheduled_at),
        outcomeAt: nullable(assignment.outcome_at), reachability: nullable(assignment.reachability),
        appointmentStatus: nullable(assignment.appointment_status), mismatchReason: nullable(assignment.mismatch_reason),
        lossReason: nullable(assignment.loss_reason),
      },
    };
  });
  const offers: QualityOffer[] = offerRows.map((row) => ({
    id: text(row.id), offeredAt: nullable(row.offered_at), declinedAt: nullable(row.declined_at), declineReason: nullable(row.decline_reason),
    serviceId: text(object(row.lead).service_id), type: text(object(row.lead).commercial_type), region: unknownRegion,
  }));
  const corrections: QualityCorrection[] = correctionRows.map((row) => ({
    id: text(row.id), leadId: nullable(row.lead_id), professionalId: text(row.professional_id), type: text(row.type), createdAt: text(row.created_at),
  }));
  return buildQualityReport({ purchases, corrections, offers }, filters, asOf);
}
