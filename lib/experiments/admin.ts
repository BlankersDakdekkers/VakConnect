import "server-only";

import { requireAdminUser } from "@/lib/auth/helpers";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { buildExperimentPerformance, type ExperimentReportEvent, type ExperimentReportVariant } from "@/lib/experiments/reporting";

const maxEvents = 5000;
const experimentIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function getAdminExperiments(filters: { status?: string; target?: string; from?: string; to?: string } = {}) {
  await requireAdminUser();
  const supabase = createAdminSupabaseClient();
  const { data: experiments, error } = await supabase
    .from("experiments")
    .select("id, key, name, status, target_type, slot, target_rules, goal_event, started_at, ended_at, created_at, updated_at")
    .order("updated_at", { ascending: false });
  if (error) throw new Error("Experimenten konden niet worden geladen.");

  const rows = experiments ?? [];
  const ids = rows.map((experiment) => experiment.id);
  if (!ids.length) return [];

  const [variantsResult, eventsResult] = await Promise.all([
    supabase.from("experiment_variants").select("id, experiment_id, key, label, weight, is_control").in("experiment_id", ids),
    supabase.from("analytics_events").select("anonymous_session_id, metadata").eq("event_name", "experiment_exposed").limit(maxEvents),
  ]);
  if (variantsResult.error) throw new Error("Experimentvarianten konden niet worden geladen.");

  const variantRows = variantsResult.data ?? [];
  const exposureSessions = new Map<string, Set<string>>();
  for (const event of eventsResult.data ?? []) {
    const metadata = event.metadata && typeof event.metadata === "object" && !Array.isArray(event.metadata)
      ? event.metadata as Record<string, unknown>
      : {};
    if (typeof metadata.experiment_id === "string") {
      const sessions = exposureSessions.get(metadata.experiment_id) ?? new Set<string>();
      sessions.add(event.anonymous_session_id);
      exposureSessions.set(metadata.experiment_id, sessions);
    }
  }

  return rows
    .filter((experiment) => !filters.status || experiment.status === filters.status)
    .filter((experiment) => !filters.target || experiment.target_type === filters.target)
    .filter((experiment) => !filters.from || (experiment.started_at ?? experiment.created_at) >= `${filters.from}T00:00:00.000Z`)
    .filter((experiment) => !filters.to || (experiment.started_at ?? experiment.created_at) < new Date(Date.parse(`${filters.to}T00:00:00.000Z`) + 24 * 60 * 60 * 1000).toISOString())
    .map((experiment) => ({
      ...experiment,
      variants: variantRows.filter((variant) => variant.experiment_id === experiment.id),
      sampleCount: eventsResult.error ? null : exposureSessions.get(experiment.id)?.size ?? 0,
      sampleLimited: (eventsResult.data ?? []).length === maxEvents,
      analyticsAvailable: !eventsResult.error,
    }));
}

export async function getAdminExperimentDetail(id: string, range: "7d" | "lifetime" = "lifetime") {
  await requireAdminUser();
  if (!experimentIdPattern.test(id)) return null;

  const supabase = createAdminSupabaseClient();
  const { data: experiment, error } = await supabase
    .from("experiments")
    .select("id, key, name, status, target_type, slot, target_rules, goal_event, started_at, ended_at, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error("Experiment kon niet worden geladen.");
  if (!experiment) return null;

  const { data: variants, error: variantsError } = await supabase
    .from("experiment_variants")
    .select("id, key, label, weight, is_control")
    .eq("experiment_id", experiment.id)
    .order("created_at", { ascending: true });
  if (variantsError) throw new Error("Experimentvarianten konden niet worden geladen.");

  const requestedSince = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const since = range === "7d"
    ? experiment.started_at && Date.parse(experiment.started_at) > Date.parse(requestedSince) ? experiment.started_at : requestedSince
    : experiment.started_at ?? experiment.created_at;
  const [{ data: eventRows, error: eventError }, { data: auditRows, error: auditError }] = await Promise.all([
    supabase
      .from("analytics_events")
      .select("event_name, anonymous_session_id, lead_id, metadata, created_at")
      .gte("created_at", since)
      .in("event_name", ["experiment_exposed", "public_cta_click", "lead_funnel_started", "lead_submitted"])
      .order("created_at", { ascending: true })
      .limit(maxEvents),
    supabase
      .from("experiment_audit_log")
      .select("previous_status, next_status, actor_user_id, created_at")
      .eq("experiment_id", experiment.id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);
  if (auditError) throw new Error("Experimentgeschiedenis kon niet worden geladen.");

  const report = buildExperimentPerformance({
    experimentId: experiment.id,
    goalEvent: experiment.goal_event,
    variants: (variants ?? []) as ExperimentReportVariant[],
    events: (eventRows ?? []) as ExperimentReportEvent[],
  });

  return {
    ...experiment,
    variants: variants ?? [],
    auditLog: auditRows ?? [],
    range,
    since,
    performance: report.rows,
    eventSampleLimited: report.eventSampleLimited || (eventRows ?? []).length === maxEvents,
    analyticsAvailable: !eventError,
  };
}
