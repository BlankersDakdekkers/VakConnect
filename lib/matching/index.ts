import "server-only";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { MatchCandidate, type MatchingContext } from "@/lib/matching/eligibility";
import { getPostalCodePrefix } from "@/lib/utils";

export * from "@/lib/matching/eligibility";

export async function findEligibleProfessionalsForLead(context: MatchingContext) {
  const supabase = createAdminSupabaseClient();
  const prefix = getPostalCodePrefix(context.postalCode);
  const { data, error } = await supabase
    .from("professionals")
    .select(
      "id, company_name, contact_name, email, phone, status, professional_services!inner(service_id, active), professional_service_areas!inner(postal_code_prefix)",
    )
    .eq("status", "active")
    .eq("professional_services.service_id", context.serviceId)
    .eq("professional_services.active", true)
    .eq("professional_service_areas.postal_code_prefix", prefix)
    .order("company_name");

  if (error) {
    throw new Error("Geschikte vakmannen konden niet worden opgehaald.");
  }

  return ((data ?? []) as Array<Record<string, unknown>>).map((item) => ({
    id: String(item.id),
    companyName: String(item.company_name),
    contactName: String(item.contact_name),
    email: String(item.email),
    phone: String(item.phone),
    status: item.status as MatchCandidate["status"],
    postalCodePrefixes: ((item.professional_service_areas ?? []) as Array<{ postal_code_prefix: string }>).map(
      (area) => area.postal_code_prefix,
    ),
  })) as MatchCandidate[];
}
