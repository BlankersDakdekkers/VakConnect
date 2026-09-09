import type { SeoCoverageStatus } from "@/lib/seo/types";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

function postalPrefixFromCode(value: string) {
  return value.replace(/\s+/g, "").slice(0, 4);
}

export async function evaluateCoverageStatus(input: {
  supabase: ReturnType<typeof createAdminSupabaseClient>;
  serviceSlug: string;
  locationName: string;
}): Promise<SeoCoverageStatus> {
  const { data: service } = await input.supabase.from("services").select("id").eq("slug", input.serviceSlug).maybeSingle();
  if (!service?.id) {
    return "none";
  }

  const { data: leads } = await input.supabase
    .from("leads")
    .select("postal_code")
    .eq("service_id", service.id)
    .ilike("city", input.locationName)
    .limit(500);

  const leadPrefixes = new Set<string>(
    (leads ?? [])
      .map((item: Record<string, unknown>) => (typeof item.postal_code === "string" ? postalPrefixFromCode(item.postal_code) : ""))
      .filter((prefix: string) => /^[1-9][0-9]{3}$/.test(prefix)),
  );

  const { data: professionals } = await input.supabase
    .from("professionals")
    .select(
      "id, status, professional_services!inner(service_id, active), professional_service_areas(postal_code_prefix)",
    )
    .eq("status", "active")
    .eq("professional_services.service_id", service.id)
    .eq("professional_services.active", true)
    .limit(400);

  const activeCoverage = (professionals ?? []).map((item: Record<string, unknown>) => {
    const areas = (item.professional_service_areas ?? []) as Array<{ postal_code_prefix: string }>;
    return new Set(areas.map((area) => area.postal_code_prefix).filter((prefix) => /^[1-9][0-9]{3}$/.test(prefix)));
  });

  if (!activeCoverage.length) {
    return "none";
  }

  if (!leadPrefixes.size) {
    if (activeCoverage.length >= 6) return "sufficient";
    if (activeCoverage.length >= 2) return "limited";
    return "none";
  }

  const matchingProfessionals = activeCoverage.filter((prefixes: Set<string>) => [...leadPrefixes].some((prefix) => prefixes.has(prefix))).length;

  if (matchingProfessionals >= 3) return "sufficient";
  if (matchingProfessionals >= 1) return "limited";
  return "none";
}
