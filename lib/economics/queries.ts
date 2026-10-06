import "server-only";

import { requireAdminUser } from "@/lib/auth/helpers";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { collectQualityPages } from "@/lib/leads/quality-reporting";
import { buildEconomicsReport, type EconomicsInput } from "@/lib/economics/metrics";

type Row = Record<string, unknown>;
function object(value: unknown): Row {
  const row = Array.isArray(value) ? value[0] : value;
  return row && typeof row === "object" ? row as Row : {};
}
const text = (value: unknown) => typeof value === "string" ? value : "";
const nullable = (value: unknown) => typeof value === "string" ? value : null;
const integer = (value: unknown) => typeof value === "number" && Number.isSafeInteger(value) ? value : NaN;

export async function getAdminEconomicsReport(days: 7 | 28 | 90) {
  await requireAdminUser();
  const supabase = createAdminSupabaseClient();
  const asOf = new Date();
  const until = asOf.toISOString();
  const since = new Date(asOf.getTime() - days * 86400000).toISOString();
  const [purchaseRows, transactionRows, walletRows, offerRows, purchaseLinkRows] = await Promise.all([
    collectQualityPages<Row>((from, to) => supabase.from("lead_purchases").select(
      "id,lead_id,professional_id,lead_assignment_id,price_credits,commercial_type,status,purchased_at,wallet_transaction_id,refund_transaction_id,refunded_at,lead:leads!lead_purchases_lead_id_fkey(id,service_id,utm_source,service:services(name)),professional:professionals!lead_purchases_professional_id_fkey(id),assignment:lead_assignments!lead_purchases_assignment_fk(id,lead_id,professional_id,progress_status,contacted_at,reached_at,appointment_scheduled_at,outcome_at,reachability,appointment_status,mismatch_reason)",
      { count: "exact" },
    ).gte("purchased_at", since).lte("purchased_at", until).order("id").range(from, to)),
    // Full ledger is needed for credit stock; corrections after the purchase period
    // still belong to that purchase cohort. Never parse references or descriptions.
    collectQualityPages<Row>((from, to) => supabase.from("wallet_transactions").select(
      "id,wallet_id,professional_id,lead_id,lead_assignment_id,type,amount,created_at", { count: "exact" },
    ).lte("created_at", until).order("id").range(from, to)),
    collectQualityPages<Row>((from, to) => supabase.from("professional_wallets").select(
      "id,professional_id,cached_balance,updated_at", { count: "exact" },
    ).order("id").range(from, to)),
    collectQualityPages<Row>((from, to) => supabase.from("lead_distribution_candidates").select(
      "id,lead_id,offered_at,offer_expires_at,purchased_at,run:lead_distribution_runs(commercial_type),lead:leads(service_id,service:services(name))",
      { count: "exact" },
    ).gte("offered_at", since).lte("offered_at", until).order("id").range(from, to)),
    collectQualityPages<Row>((from, to) => supabase.from("lead_purchases").select(
      "id,lead_id,wallet_transaction_id,refund_transaction_id,price_credits,status", { count: "exact" },
    ).lte("purchased_at", until).order("id").range(from, to)),
  ]);
  const distributedPurchasedLeadIds = new Set(purchaseLinkRows
    .filter((row) => ["purchased", "refunded"].includes(text(row.status))).map((row) => text(row.lead_id)));
  const input: EconomicsInput = {
    distributedPurchasedLeadIds: [...distributedPurchasedLeadIds],
    purchaseLinks: purchaseLinkRows.map((row) => ({
      id: text(row.id), debitId: text(row.wallet_transaction_id), refundId: nullable(row.refund_transaction_id),
      price: integer(row.price_credits), status: text(row.status),
    })),
    purchases: purchaseRows.map((row) => {
      const lead = object(row.lead);
      const assignment = object(row.assignment);
      return {
        id: text(row.id), leadId: text(row.lead_id), professionalId: text(row.professional_id),
        assignmentId: nullable(row.lead_assignment_id), price: integer(row.price_credits),
        type: text(row.commercial_type), status: text(row.status), purchasedAt: text(row.purchased_at),
        debitId: text(row.wallet_transaction_id), refundId: nullable(row.refund_transaction_id), refundedAt: nullable(row.refunded_at),
        serviceId: text(lead.service_id), serviceName: text(object(lead.service).name) || "Dienst onbekend",
        subservice: null, source: nullable(lead.utm_source),
        leadExists: Boolean(lead.id), professionalExists: Boolean(object(row.professional).id),
        assignment: assignment.id ? {
          id: text(assignment.id), leadId: text(assignment.lead_id), professionalId: text(assignment.professional_id),
          progressStatus: nullable(assignment.progress_status), contactedAt: nullable(assignment.contacted_at),
          reachedAt: nullable(assignment.reached_at), appointmentScheduledAt: nullable(assignment.appointment_scheduled_at),
          outcomeAt: nullable(assignment.outcome_at), reachability: nullable(assignment.reachability),
          appointmentStatus: nullable(assignment.appointment_status), mismatchReason: nullable(assignment.mismatch_reason),
        } : null,
      };
    }),
    transactions: transactionRows.map((row) => ({
      id: text(row.id), walletId: text(row.wallet_id), professionalId: text(row.professional_id),
      leadId: nullable(row.lead_id), assignmentId: nullable(row.lead_assignment_id),
      type: text(row.type), amount: integer(row.amount), createdAt: text(row.created_at),
    })),
    wallets: walletRows.map((row) => ({
      id: text(row.id), professionalId: text(row.professional_id), balance: integer(row.cached_balance), updatedAt: text(row.updated_at),
    })),
    offers: offerRows.map((row) => ({
      id: text(row.id), leadId: text(row.lead_id), offeredAt: text(row.offered_at), expiresAt: nullable(row.offer_expires_at),
      purchasedAt: nullable(row.purchased_at), type: text(object(row.run).commercial_type),
      serviceId: text(object(row.lead).service_id), serviceName: text(object(object(row.lead).service).name) || "Dienst onbekend",
    })),
  };
  return buildEconomicsReport(input, days, asOf);
}
