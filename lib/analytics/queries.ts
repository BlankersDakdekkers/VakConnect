import "server-only";

import { requireAdminUser } from "@/lib/auth/helpers";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { buildAnalyticsReport, type AnalyticsReport } from "@/lib/analytics/reporting";

const maxRows = 5000;

export async function getAdminAnalyticsDashboard(rangeDays: 7 | 28) {
  await requireAdminUser();
  const supabase = createAdminSupabaseClient();
  const until = new Date();
  const since = new Date(until.getTime() - rangeDays * 24 * 60 * 60 * 1000);
  const sinceIso = since.toISOString();
  const untilIso = until.toISOString();

  const [eventsResult, leadsResult, servicesResult, contactsResult] = await Promise.all([
    supabase
      .from("analytics_events")
      .select("event_name, anonymous_session_id, lead_id, service_id, metadata, created_at")
      .gte("created_at", sinceIso)
      .lt("created_at", untilIso)
      .order("created_at", { ascending: true })
      .limit(maxRows),
    supabase
      .from("leads")
      .select("id, service_id", { count: "exact" })
      .gte("created_at", sinceIso)
      .lt("created_at", untilIso)
      .limit(maxRows),
    supabase.from("services").select("id, slug, name").order("name"),
    supabase
      .from("contact_submissions")
      .select("id", { count: "exact", head: true })
      .gte("created_at", sinceIso)
      .lt("created_at", untilIso),
  ]);

  if (leadsResult.error) throw new Error("Leadgegevens voor analytics konden niet worden geladen.");
  if (servicesResult.error) throw new Error("Diensten voor analytics konden niet worden geladen.");
  if (contactsResult.error) throw new Error("Contactgegevens voor analytics konden niet worden geladen.");

  const eventRows = eventsResult.error ? [] : eventsResult.data ?? [];
  const leadRows = leadsResult.data ?? [];
  const storedLeadTotal = leadsResult.count ?? leadRows.length;
  const report: AnalyticsReport = buildAnalyticsReport({
    events: eventRows,
    leads: leadRows,
    services: servicesResult.data ?? [],
    storedLeadTotal,
    sampleLimited: eventRows.length === maxRows || leadRows.length === maxRows,
  });

  return {
    ...report,
    rangeDays,
    since: sinceIso,
    until: untilIso,
    contacts: contactsResult.count ?? 0,
    dataAvailable: !eventsResult.error,
  };
}
