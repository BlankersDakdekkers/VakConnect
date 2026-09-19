import "server-only";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { calculateProfessionalQuality, getNextOnboardingStep, minimumProfessionalQualityScore } from "@/lib/professionals/onboarding";
import type { Json, Professional, ProfessionalDistributionSettings } from "@/types/database";

function mapSettings(row: Record<string, unknown> | null | undefined) {
  if (!row) return null;
  return {
    maxOpenOffers: Number(row.max_open_offers ?? 0),
    maxActiveAssignments: Number(row.max_active_assignments ?? 0),
    paused: Boolean(row.paused),
    pauseUntil: (row.pause_until as string | null) ?? null,
    preferredLeadTypes: Array.isArray(row.preferred_lead_types) ? row.preferred_lead_types.map(String) as ProfessionalDistributionSettings["preferred_lead_types"] : [],
    availabilityStatus: (row.availability_status as ProfessionalDistributionSettings["availability_status"]) ?? "available",
    availableFrom: (row.available_from as string | null) ?? null,
    unavailableUntil: (row.unavailable_until as string | null) ?? null,
  };
}

export async function refreshProfessionalDerivedState(professionalId: string) {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("professionals")
    .select(`
      *,
      professional_services(id, active, years_experience, specialization_summary, preferred_lead_type),
      professional_service_areas(id, postal_code_prefix, city, province, radius_km),
      professional_distribution_settings(*),
      professional_documents(document_type, verification_status, archived_at, expires_at),
      professional_document_requirements(document_type, requirement_level, service_id)
    `)
    .eq("id", professionalId)
    .maybeSingle();

  if (error || !data) {
    throw new Error("Derived professional state kon niet worden geladen.");
  }

  const quality = calculateProfessionalQuality({
    professional: {
      companyName: String(data.company_name ?? ""),
      tradeName: (data.trade_name as string | null) ?? null,
      contactName: String(data.contact_name ?? ""),
      email: String(data.email ?? ""),
      phone: String(data.phone ?? ""),
      website: (data.website as string | null) ?? null,
      kvkNumber: (data.kvk_number as string | null) ?? null,
      btwNumber: (data.btw_number as string | null) ?? null,
      identityType: (data.identity_type as string | null) ?? null,
      addressLine1: (data.address_line_1 as string | null) ?? null,
      addressLine2: (data.address_line_2 as string | null) ?? null,
      postalCode: (data.postal_code as string | null) ?? null,
      city: (data.city as string | null) ?? null,
      province: (data.province as string | null) ?? null,
      yearsExperience: data.years_experience === null || data.years_experience === undefined ? null : Number(data.years_experience),
      teamSize: data.team_size === null || data.team_size === undefined ? null : Number(data.team_size),
      description: (data.description as string | null) ?? null,
      specialties: Array.isArray(data.specialties) ? data.specialties.map(String) : [],
      onboardingStatus: (data.onboarding_status as Professional["onboarding_status"]) ?? "not_started",
      verificationStatus: (data.verification_status as Professional["verification_status"]) ?? "unverified",
    },
    services: ((data.professional_services ?? []) as Array<Record<string, unknown>>).map((service) => ({
      active: Boolean(service.active),
      yearsExperience: Number(service.years_experience ?? 0),
      specializationSummary: (service.specialization_summary as string | null) ?? null,
      preferredLeadType: (service.preferred_lead_type as ProfessionalDistributionSettings["preferred_lead_types"][number] | null) ?? null,
    })),
    areas: ((data.professional_service_areas ?? []) as Array<Record<string, unknown>>).map((area) => ({
      postalCodePrefix: String(area.postal_code_prefix),
      city: (area.city as string | null) ?? null,
      province: (area.province as string | null) ?? null,
      radiusKm: area.radius_km === null || area.radius_km === undefined ? null : Number(area.radius_km),
    })),
    settings: mapSettings((Array.isArray(data.professional_distribution_settings) ? data.professional_distribution_settings[0] : data.professional_distribution_settings) as Record<string, unknown> | null),
    documents: ((data.professional_documents ?? []) as Array<Record<string, unknown>>).map((document) => ({
      documentType: document.document_type as never,
      verificationStatus: document.verification_status as never,
      archivedAt: (document.archived_at as string | null) ?? null,
      expiresAt: (document.expires_at as string | null) ?? null,
    })),
    requiredDocuments: ((data.professional_document_requirements ?? []) as Array<Record<string, unknown>>).map((requirement) => ({
      documentType: requirement.document_type as never,
      requirementLevel: requirement.requirement_level as never,
      serviceId: (requirement.service_id as string | null) ?? null,
    })),
  });

  const onboardingStatus = quality.canSubmit
    ? ((data.submitted_for_review_at || data.onboarding_status === "approved") ? (data.onboarding_status as Professional["onboarding_status"]) : "in_progress")
    : (data.onboarding_status === "submitted" || data.onboarding_status === "approved" ? "changes_requested" : "in_progress");

  const nextStep = quality.missingSteps[0] ?? getNextOnboardingStep((data.onboarding_step as Professional["onboarding_step"]) ?? "company");
  const nowIso = new Date().toISOString();
  const updates = {
    quality_score: quality.score,
    quality_breakdown: quality.breakdown as Json,
    onboarding_completion: quality.completion,
    onboarding_status: ((data.onboarding_status === "approved" && quality.canSubmit) ? "approved" : onboardingStatus),
    onboarding_step: nextStep,
    onboarding_completed_at: quality.canSubmit ? ((data.onboarding_completed_at as string | null) ?? nowIso) : null,
    last_critical_change_at: (data.last_critical_change_at as string | null) ?? null,
    updated_at: nowIso,
  };

  const { error: updateError } = await supabase.from("professionals").update(updates).eq("id", professionalId);
  if (updateError) {
    throw new Error("Derived professional state kon niet worden opgeslagen.");
  }

  return {
    ...quality,
    minimumProfessionalQualityScore,
  };
}
