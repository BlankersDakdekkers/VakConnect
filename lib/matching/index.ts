import "server-only";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { evaluateProfessionalMatch, type LeadMatchEvaluation, type MatchCandidate, type MatchingContext } from "@/lib/matching/eligibility";

export * from "@/lib/matching/eligibility";

export async function findEligibleProfessionalsForLead(context: MatchingContext) {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("professionals")
    .select(
      "id, company_name, contact_name, email, phone, status, professional_services!inner(service_id, active), professional_service_areas(postal_code_prefix)",
    )
    .eq("professional_services.service_id", context.serviceId)
    .order("company_name");

  if (error) {
    throw new Error("Geschikte vakmannen konden niet worden opgehaald.");
  }

  return ((data ?? []) as Array<Record<string, unknown>>)
    .map((item) => evaluateProfessionalMatch({
      professionalId: String(item.id),
      companyName: String(item.company_name),
      contactName: String(item.contact_name),
      email: String(item.email),
      phone: String(item.phone),
      status: item.status as MatchCandidate["status"],
      serviceLinks: ((item.professional_services ?? []) as Array<{ service_id: string; active: boolean }>).map((serviceLink) => ({
        serviceId: serviceLink.service_id,
        active: serviceLink.active,
      })),
      postalCodePrefixes: ((item.professional_service_areas ?? []) as Array<{ postal_code_prefix: string }>).map(
        (area) => area.postal_code_prefix,
      ),
    }, context))
    .filter((candidate) => candidate.eligible)
    .sort((left, right) => right.matchScore - left.matchScore || left.companyName.localeCompare(right.companyName));
}

export async function refreshLeadMatchesForLead(context: MatchingContext & { leadId: string }) {
  const supabase = createAdminSupabaseClient();
  const matches = await findEligibleProfessionalsForLead(context);

  await supabase.from("lead_matches").delete().eq("lead_id", context.leadId);

  if (matches.length) {
    const { error } = await supabase.from("lead_matches").insert(matches.map((match) => ({
      lead_id: context.leadId,
      professional_id: match.professionalId,
      match_score: match.matchScore,
      reasons: match.reasons,
    })));

    if (error) {
      throw new Error("Leadmatches konden niet worden opgeslagen.");
    }
  }

  return matches as LeadMatchEvaluation[];
}
