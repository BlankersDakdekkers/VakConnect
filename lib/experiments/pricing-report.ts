import "server-only";

import { requireAdminUser } from "@/lib/auth/helpers";
import { economicsDefinitions } from "@/lib/economics/metrics";
import { getAdminEconomicsReport } from "@/lib/economics/queries";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { PricingExperimentMetric } from "@/types/database";

type PricingSummary = {
  purchases: number;
  refund: { count: number; denominator: number; percent: number | null };
  reached: { count: number; denominator: number; percent: number | null };
  appointment: { count: number; denominator: number; percent: number | null };
  won: { count: number; denominator: number; percent: number | null };
  mismatch: { count: number; denominator: number; percent: number | null };
  finance: { net: number; creditsPerWon: number | null } | null;
};

function primaryMetricValue(
  metric: PricingExperimentMetric,
  assignments: number,
  all: PricingSummary,
  matured: PricingSummary,
) {
  if (metric === "offer_to_purchase_rate") {
    return assignments >= economicsDefinitions.minimumSample ? all.purchases / assignments * 100 : null;
  }
  if (metric === "purchase_to_reached_rate") return all.reached.percent;
  if (metric === "purchase_to_appointment_rate") return matured.appointment.percent;
  if (metric === "purchase_to_won_rate") return matured.won.percent;
  if (metric === "net_credits_per_offer") return all.finance && assignments ? all.finance.net / assignments : null;
  if (metric === "net_credits_per_purchase") return all.finance && all.purchases ? all.finance.net / all.purchases : null;
  return matured.finance?.creditsPerWon ?? null;
}

export async function getAdminPricingExperiments() {
  await requireAdminUser();
  const supabase = createAdminSupabaseClient();
  const asOf = new Date();
  const since = new Date(asOf.getTime() - 90 * 86400000).toISOString();
  const [experimentResult, report] = await Promise.all([
    supabase.from("experiments").select(
      "id,key,name,description,status,slot,pricing_config,primary_metric,guardrail_metrics,started_at,created_at,updated_at",
    ).eq("experiment_type", "pricing").order("updated_at", { ascending: false }),
    getAdminEconomicsReport(90),
  ]);
  if (experimentResult.error) throw new Error("Pricingexperimenten konden niet worden geladen.");
  const experiments = experimentResult.data ?? [];
  if (!experiments.length) return { experiments: [], reconciliation: report.reconciliation };
  const ids = experiments.map((experiment) => experiment.id);
  const [variantResult, assignmentResult, decisionResult] = await Promise.all([
    supabase.from("experiment_variants").select("id,experiment_id,key,label,weight,is_control,price_credits")
      .in("experiment_id", ids).order("created_at", { ascending: true }),
    supabase.from("pricing_experiment_assignments").select("experiment_id,variant_id,assigned_at")
      .in("experiment_id", ids).gte("assigned_at", since),
    supabase.from("pricing_experiment_decisions").select("id,experiment_id,decision,note,actor_user_id,created_at")
      .in("experiment_id", ids).order("created_at", { ascending: false }),
  ]);
  if (variantResult.error || assignmentResult.error || decisionResult.error) {
    throw new Error("Pricingexperimentgegevens konden niet worden geladen.");
  }

  return {
    reconciliation: report.reconciliation,
    experiments: experiments.map((experiment) => {
      const variants = (variantResult.data ?? []).filter((variant) => variant.experiment_id === experiment.id);
      const decisions = (decisionResult.data ?? []).filter((decision) => decision.experiment_id === experiment.id);
      const controlId = variants.find((variant) => variant.is_control)?.id;
      const controlSummary = report.pricingVariants.find((row) => row.variantId === controlId);
      const rows = variants.map((variant) => {
        const assignedOffers = (assignmentResult.data ?? []).filter((assignment) =>
          assignment.experiment_id === experiment.id && assignment.variant_id === variant.id,
        ).length;
        const economics = report.pricingVariants.find((row) => row.variantId === variant.id);
        const all = (economics?.all ?? {
          purchases: 0,
          refund: { count: 0, denominator: 0, percent: null },
          reached: { count: 0, denominator: 0, percent: null },
          appointment: { count: 0, denominator: 0, percent: null },
          won: { count: 0, denominator: 0, percent: null },
          mismatch: { count: 0, denominator: 0, percent: null },
          finance: null,
        }) as PricingSummary;
        const matured = (economics?.matured ?? all) as PricingSummary;
        const control = controlSummary?.all as PricingSummary | undefined;
        const adequatePurchaseSample = all.purchases >= economicsDefinitions.minimumSample
          && (control?.purchases ?? 0) >= economicsDefinitions.minimumSample;
        const guardrailWarnings = report.reconciliation.consistent && adequatePurchaseSample ? [
          ...(control && all.refund.percent !== null && control.refund.percent !== null && all.refund.percent > control.refund.percent
            ? ["Refundpercentage hoger dan control"] : []),
          ...(control && all.mismatch.percent !== null && control.mismatch.percent !== null && all.mismatch.percent > control.mismatch.percent
            ? ["Mismatchpercentage hoger dan control"] : []),
          ...(control && all.reached.percent !== null && control.reached.percent !== null && all.reached.percent < control.reached.percent
            ? ["Bereikbaarheid lager dan control"] : []),
        ] : [];
        return {
          ...variant,
          assignedOffers,
          all,
          matured,
          primaryMetric: experiment.primary_metric
            ? primaryMetricValue(experiment.primary_metric, assignedOffers, all, matured)
            : null,
          lowSample: assignedOffers < economicsDefinitions.minimumSample || all.purchases < economicsDefinitions.minimumSample,
          decisionSampleReady: assignedOffers >= 30 && all.purchases >= 30,
          guardrailWarnings,
        };
      });
      return { ...experiment, variants: rows, decisions };
    }),
  };
}
