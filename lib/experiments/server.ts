import "server-only";

import { funnelEventNames } from "@/lib/analytics/events";
import { experimentExposureIdempotencyKey } from "@/lib/analytics/impressions";
import { storeAnalyticsEvent } from "@/lib/analytics/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { chooseExperimentVariant, isValidExperimentConfiguration, matchesExperimentTarget, type ExperimentTargetRules, type ExperimentVariant } from "@/lib/experiments/targeting";

const sessionIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type ExperimentRequestContext = {
  pageType: "homepage" | "core_public" | "service" | "subservice" | "service_city" | "subservice_city" | "province" | "lead_funnel" | "professional_landing" | "contact" | "costs";
  route: string;
  serviceSlug: string | null;
  citySlug: string | null;
  deviceCategory: "mobile" | "tablet" | "desktop";
  referralChannel: "organic" | "paid" | "direct" | "referral" | "unknown";
  stepKey?: string | null;
};

export type SafeExperimentAssignment = {
  experimentId: string;
  experimentKey: string;
  slot: string;
  variantId: string;
  variantKey: string;
  variantLabel: string;
};

export async function assignExperimentVariant(input: {
  anonymousSessionId: string;
  slot: string;
  context: ExperimentRequestContext;
}): Promise<SafeExperimentAssignment | null> {
  if (!sessionIdPattern.test(input.anonymousSessionId) || !/^[a-z0-9_.]{3,100}$/.test(input.slot)) return null;

  const supabase = createAdminSupabaseClient();
  const { data: experiment, error } = await supabase
    .from("experiments")
    .select("id, key, status, target_type, slot, target_rules, goal_event")
    .eq("slot", input.slot)
    .eq("status", "active")
    .maybeSingle();

  if (error || !experiment) return null;

  const targetRules = experiment.target_rules as ExperimentTargetRules;
  if (!matchesExperimentTarget(targetRules, {
    pageType: input.context.pageType,
    route: input.context.route,
    serviceSlug: input.context.serviceSlug,
    citySlug: input.context.citySlug,
    deviceCategory: input.context.deviceCategory,
    referralChannel: input.context.referralChannel,
    stepKey: input.context.stepKey,
  })) return null;

  const { data: variants, error: variantsError } = await supabase
    .from("experiment_variants")
    .select("id, key, label, weight, is_control")
    .eq("experiment_id", experiment.id);

  if (variantsError || !variants) return null;
  const safeVariants = variants as ExperimentVariant[];
  if (!isValidExperimentConfiguration({
    targetType: experiment.target_type,
    slot: experiment.slot,
    targetRules: targetRules as Record<string, unknown>,
    goalEvent: experiment.goal_event,
    variants: safeVariants,
  })) return null;

  const { data: existing } = await supabase
    .from("experiment_assignments")
    .select("variant_id")
    .eq("experiment_id", experiment.id)
    .eq("anonymous_session_id", input.anonymousSessionId)
    .maybeSingle();

  let assignedVariantId = existing?.variant_id;
  if (!assignedVariantId) {
    const selected = chooseExperimentVariant(input.anonymousSessionId, experiment.key, safeVariants);
    if (!selected) return null;

    const { error: assignmentError } = await supabase.from("experiment_assignments").upsert(
      {
        experiment_id: experiment.id,
        anonymous_session_id: input.anonymousSessionId,
        variant_id: selected.id,
      },
      { onConflict: "experiment_id,anonymous_session_id", ignoreDuplicates: true },
    );
    if (assignmentError) return null;

    const { data: stored } = await supabase
      .from("experiment_assignments")
      .select("variant_id")
      .eq("experiment_id", experiment.id)
      .eq("anonymous_session_id", input.anonymousSessionId)
      .maybeSingle();
    assignedVariantId = stored?.variant_id ?? selected.id;
  }

  const assignedVariant = safeVariants.find((variant) => variant.id === assignedVariantId);
  if (!assignedVariant) return null;

  return {
    experimentId: experiment.id,
    experimentKey: experiment.key,
    slot: experiment.slot,
    variantId: assignedVariant.id,
    variantKey: assignedVariant.key,
    variantLabel: assignedVariant.label,
  };
}

export async function recordExperimentExposure(input: {
  anonymousSessionId: string;
  experimentId: string;
  variantId: string;
  context: ExperimentRequestContext;
}) {
  if (!sessionIdPattern.test(input.anonymousSessionId)) return false;

  const supabase = createAdminSupabaseClient();
  const { data: experiment, error: experimentError } = await supabase
    .from("experiments")
    .select("id, key, status, slot, target_rules")
    .eq("id", input.experimentId)
    .eq("status", "active")
    .maybeSingle();
  if (experimentError || !experiment) return false;

  const rules = experiment.target_rules as ExperimentTargetRules;
  if (!matchesExperimentTarget(rules, {
    pageType: input.context.pageType,
    route: input.context.route,
    serviceSlug: input.context.serviceSlug,
    citySlug: input.context.citySlug,
    deviceCategory: input.context.deviceCategory,
    referralChannel: input.context.referralChannel,
    stepKey: input.context.stepKey,
  })) return false;

  const [{ data: assignment, error: assignmentError }, { data: variant, error: variantError }] = await Promise.all([
    supabase
      .from("experiment_assignments")
      .select("variant_id")
      .eq("experiment_id", experiment.id)
      .eq("anonymous_session_id", input.anonymousSessionId)
      .maybeSingle(),
    supabase
      .from("experiment_variants")
      .select("id, key")
      .eq("experiment_id", experiment.id)
      .eq("id", input.variantId)
      .maybeSingle(),
  ]);
  if (assignmentError || variantError || assignment?.variant_id !== input.variantId || !variant) return false;

  await storeAnalyticsEvent({
    eventName: funnelEventNames.experimentExposed,
    anonymousSessionId: input.anonymousSessionId,
    idempotencyKey: experimentExposureIdempotencyKey(
      input.anonymousSessionId,
      experiment.id,
      variant.id,
      `${input.context.route}:${input.context.deviceCategory}:${input.context.referralChannel}:${input.context.stepKey ?? ""}`,
    ),
    metadata: {
      experiment_id: experiment.id,
      experiment_key: experiment.key,
      variant_id: variant.id,
      variant_key: variant.key,
      experiment_slot: experiment.slot,
      route: input.context.route,
      page_type: input.context.pageType,
      ...(input.context.serviceSlug ? { service_slug: input.context.serviceSlug } : {}),
      ...(input.context.citySlug ? { city_slug: input.context.citySlug } : {}),
      device_category: input.context.deviceCategory,
      referral_channel: input.context.referralChannel,
      ...(input.context.stepKey ? { step_key: input.context.stepKey } : {}),
    },
  });

  return true;
}
