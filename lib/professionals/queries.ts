import "server-only";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { calculateProfessionalQuality, getProfessionalQualityLabel } from "@/lib/professionals/onboarding";
import { createSignedProfessionalDocumentUrl } from "@/lib/storage/professional-documents";
import type {
  LeadCommercialType,
  Professional,
  ProfessionalAuditLog,
  ProfessionalDistributionSettings,
  ProfessionalDocument,
  ProfessionalDocumentRequirement,
  ProfessionalReviewFeedback,
  Service,
} from "@/types/database";

export interface ProfessionalListItem extends Professional {
  serviceNames: string[];
  postalCodePrefixes: string[];
  qualityLabel: ReturnType<typeof getProfessionalQualityLabel>;
}

export interface ProfessionalDetail extends ProfessionalListItem {
  serviceLinks: Array<{
    id: string;
    active: boolean;
    yearsExperience: number;
    specializationSummary: string | null;
    preferredLeadType: LeadCommercialType | null;
    service: Service;
  }>;
  areaLinks: Array<{
    id: string;
    postalCodePrefix: string;
    city: string | null;
    province: string | null;
    radiusKm: number | null;
  }>;
  distributionSettings: ProfessionalDistributionSettings | null;
  documents: Array<ProfessionalDocument & { signedUrl: string | null }>;
  documentRequirements: ProfessionalDocumentRequirement[];
  reviewFeedback: ProfessionalReviewFeedback[];
  auditEntries: ProfessionalAuditLog[];
  qualityLabel: ReturnType<typeof getProfessionalQualityLabel>;
  missingSteps: string[];
  canSubmit: boolean;
  distributionEligible: boolean;
  stats: {
    assignmentsTotal: number;
    assignmentsAccepted: number;
    assignmentsWon: number;
    assignmentsLost: number;
    offersReceived: number;
    offersViewed: number;
    offersDeclined: number;
    offersExpired: number;
    offersPurchased: number;
    averageResponseHours: number;
  };
}

export interface VerificationQueueItem extends ProfessionalListItem {
  missingSteps: string[];
  canSubmit: boolean;
  distributionEligible: boolean;
  submittedAt: string | null;
}

function firstOf<T>(value: T | T[] | null | undefined) {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function toStringArray(value: unknown) {
  return Array.isArray(value) ? value.map(String) : [];
}

function mapProfessional(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    auth_user_id: (row.auth_user_id as string | null) ?? null,
    company_name: String(row.company_name),
    trade_name: (row.trade_name as string | null) ?? null,
    contact_name: String(row.contact_name),
    email: String(row.email),
    phone: String(row.phone),
    kvk_number: (row.kvk_number as string | null) ?? null,
    btw_number: (row.btw_number as string | null) ?? null,
    website: (row.website as string | null) ?? null,
    description: (row.description as string | null) ?? null,
    identity_type: (row.identity_type as Professional["identity_type"]) ?? null,
    address_line_1: (row.address_line_1 as string | null) ?? null,
    address_line_2: (row.address_line_2 as string | null) ?? null,
    postal_code: (row.postal_code as string | null) ?? null,
    city: (row.city as string | null) ?? null,
    province: (row.province as string | null) ?? null,
    years_experience: row.years_experience === null || row.years_experience === undefined ? null : Number(row.years_experience),
    team_size: row.team_size === null || row.team_size === undefined ? null : Number(row.team_size),
    specialties: toStringArray(row.specialties),
    status: row.status as Professional["status"],
    verification_status: row.verification_status as Professional["verification_status"],
    verification_status_reason: (row.verification_status_reason as string | null) ?? null,
    onboarding_status: row.onboarding_status as Professional["onboarding_status"],
    onboarding_step: row.onboarding_step as Professional["onboarding_step"],
    onboarding_completion: Number(row.onboarding_completion ?? 0),
    onboarding_started_at: (row.onboarding_started_at as string | null) ?? null,
    onboarding_completed_at: (row.onboarding_completed_at as string | null) ?? null,
    submitted_for_review_at: (row.submitted_for_review_at as string | null) ?? null,
    quality_score: Number(row.quality_score ?? 0),
    quality_breakdown: (row.quality_breakdown as Professional["quality_breakdown"]) ?? {},
    last_critical_change_at: (row.last_critical_change_at as string | null) ?? null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  } satisfies Professional;
}

function mapService(serviceLink: Record<string, unknown>): ProfessionalDetail["serviceLinks"][number] | null {
  const service = firstOf(serviceLink.service as Service | Service[]);
  if (!service) return null;
  return {
    id: String(serviceLink.id),
    active: Boolean(serviceLink.active),
    yearsExperience: Number(serviceLink.years_experience ?? 0),
    specializationSummary: (serviceLink.specialization_summary as string | null) ?? null,
    preferredLeadType: (serviceLink.preferred_lead_type as LeadCommercialType | null) ?? null,
    service,
  };
}

function mapArea(area: Record<string, unknown>) {
  return {
    id: String(area.id),
    postalCodePrefix: String(area.postal_code_prefix),
    city: (area.city as string | null) ?? null,
    province: (area.province as string | null) ?? null,
    radiusKm: area.radius_km === null || area.radius_km === undefined ? null : Number(area.radius_km),
  };
}

function mapDistributionSettings(settings: Record<string, unknown> | null | undefined): ProfessionalDistributionSettings | null {
  if (!settings) return null;
  return {
    professional_id: String(settings.professional_id),
    max_open_offers: Number(settings.max_open_offers ?? 0),
    max_active_assignments: Number(settings.max_active_assignments ?? 0),
    paused: Boolean(settings.paused),
    pause_until: (settings.pause_until as string | null) ?? null,
    preferred_lead_types: toStringArray(settings.preferred_lead_types) as ProfessionalDistributionSettings["preferred_lead_types"],
    auto_accept_enabled: Boolean(settings.auto_accept_enabled),
    availability_status: (settings.availability_status as ProfessionalDistributionSettings["availability_status"]) ?? "available",
    available_from: (settings.available_from as string | null) ?? null,
    unavailable_until: (settings.unavailable_until as string | null) ?? null,
    created_at: String(settings.created_at ?? new Date().toISOString()),
    updated_at: String(settings.updated_at ?? new Date().toISOString()),
  };
}

const baseSelection = `
  id,
  auth_user_id,
  company_name,
  trade_name,
  contact_name,
  email,
  phone,
  kvk_number,
  btw_number,
  website,
  description,
  identity_type,
  address_line_1,
  address_line_2,
  postal_code,
  city,
  province,
  years_experience,
  team_size,
  specialties,
  status,
  verification_status,
  verification_status_reason,
  onboarding_status,
  onboarding_step,
  onboarding_completion,
  onboarding_started_at,
  onboarding_completed_at,
  submitted_for_review_at,
  quality_score,
  quality_breakdown,
  last_critical_change_at,
  created_at,
  updated_at,
  professional_services(
    id,
    active,
    years_experience,
    specialization_summary,
    preferred_lead_type,
    service:services(id, name, slug, category, description, active, created_at, updated_at)
  ),
  professional_service_areas(id, postal_code_prefix, city, province, radius_km),
  professional_distribution_settings(*),
  professional_documents(*),
  professional_document_requirements(*),
  professional_review_feedback(*),
  professional_audit_log(*)
`;

async function loadProfessionalStats(professionalId: string) {
  const supabase = createAdminSupabaseClient();
  const [totalAssignments, acceptedAssignments, wonAssignments, lostAssignments, candidateRows] = await Promise.all([
    supabase.from("lead_assignments").select("id", { count: "exact", head: true }).eq("professional_id", professionalId),
    supabase.from("lead_assignments").select("id", { count: "exact", head: true }).eq("professional_id", professionalId).eq("status", "accepted"),
    supabase.from("lead_assignments").select("id", { count: "exact", head: true }).eq("professional_id", professionalId).eq("progress_status", "won"),
    supabase.from("lead_assignments").select("id", { count: "exact", head: true }).eq("professional_id", professionalId).eq("progress_status", "lost"),
    supabase.from("lead_distribution_candidates").select("status, offered_at, viewed_at, declined_at, expired_at, purchased_at").eq("professional_id", professionalId),
  ]);

  const offers = (candidateRows.data ?? []) as Array<Record<string, unknown>>;
  const responseHours = offers.map((row) => {
    const offeredAt = row.offered_at ? new Date(String(row.offered_at)).getTime() : 0;
    const respondedAt = row.viewed_at || row.declined_at || row.purchased_at;
    if (!offeredAt || !respondedAt) return null;
    const diff = (new Date(String(respondedAt)).getTime() - offeredAt) / (1000 * 60 * 60);
    return diff >= 0 ? diff : null;
  }).filter((value): value is number => value !== null);

  return {
    assignmentsTotal: totalAssignments.count ?? 0,
    assignmentsAccepted: acceptedAssignments.count ?? 0,
    assignmentsWon: wonAssignments.count ?? 0,
    assignmentsLost: lostAssignments.count ?? 0,
    offersReceived: offers.filter((row) => Boolean(row.offered_at)).length,
    offersViewed: offers.filter((row) => Boolean(row.viewed_at)).length,
    offersDeclined: offers.filter((row) => Boolean(row.declined_at)).length,
    offersExpired: offers.filter((row) => Boolean(row.expired_at)).length,
    offersPurchased: offers.filter((row) => Boolean(row.purchased_at)).length,
    averageResponseHours: responseHours.length ? Number((responseHours.reduce((sum, value) => sum + value, 0) / responseHours.length).toFixed(1)) : 0,
  };
}

function calculateFromRow(row: Record<string, unknown>) {
  const professional = mapProfessional(row);
  const serviceLinks = ((row.professional_services ?? []) as Array<Record<string, unknown>>).map(mapService).filter((serviceLink): serviceLink is ProfessionalDetail["serviceLinks"][number] => serviceLink !== null);
  const areaLinks = ((row.professional_service_areas ?? []) as Array<Record<string, unknown>>).map(mapArea);
  const settings = mapDistributionSettings((Array.isArray(row.professional_distribution_settings) ? row.professional_distribution_settings[0] : row.professional_distribution_settings) as Record<string, unknown> | null);
  const documents = ((row.professional_documents ?? []) as Array<Record<string, unknown>>).map((document) => ({
    id: String(document.id),
    professional_id: String(document.professional_id),
    document_type: document.document_type as ProfessionalDocument["document_type"],
    storage_path: String(document.storage_path),
    original_filename: String(document.original_filename),
    mime_type: String(document.mime_type),
    file_size: Number(document.file_size ?? 0),
    verification_status: document.verification_status as ProfessionalDocument["verification_status"],
    rejection_reason: (document.rejection_reason as string | null) ?? null,
    uploaded_at: String(document.uploaded_at ?? document.created_at),
    reviewed_at: (document.reviewed_at as string | null) ?? null,
    reviewed_by: (document.reviewed_by as string | null) ?? null,
    expires_at: (document.expires_at as string | null) ?? null,
    archived_at: (document.archived_at as string | null) ?? null,
    superseded_by_document_id: (document.superseded_by_document_id as string | null) ?? null,
    created_at: String(document.created_at ?? document.uploaded_at),
  } satisfies ProfessionalDocument));
  const documentRequirements = ((row.professional_document_requirements ?? []) as Array<Record<string, unknown>>).map((requirement) => ({
    id: String(requirement.id),
    service_id: (requirement.service_id as string | null) ?? null,
    document_type: requirement.document_type as ProfessionalDocumentRequirement["document_type"],
    requirement_level: requirement.requirement_level as ProfessionalDocumentRequirement["requirement_level"],
    display_name: String(requirement.display_name),
    description: (requirement.description as string | null) ?? null,
    created_at: String(requirement.created_at),
    updated_at: String(requirement.updated_at),
  } satisfies ProfessionalDocumentRequirement));
  const reviewFeedback = ((row.professional_review_feedback ?? []) as Array<Record<string, unknown>>).map((feedback) => ({
    id: String(feedback.id),
    professional_id: String(feedback.professional_id),
    section: feedback.section as ProfessionalReviewFeedback["section"],
    message: String(feedback.message),
    status: feedback.status as ProfessionalReviewFeedback["status"],
    created_by: (feedback.created_by as string | null) ?? null,
    created_at: String(feedback.created_at),
    resolved_at: (feedback.resolved_at as string | null) ?? null,
  } satisfies ProfessionalReviewFeedback)).sort((a, b) => b.created_at.localeCompare(a.created_at));
  const auditEntries = ((row.professional_audit_log ?? []) as Array<Record<string, unknown>>).map((entry) => ({
    id: String(entry.id),
    professional_id: String(entry.professional_id),
    actor_user_id: (entry.actor_user_id as string | null) ?? null,
    event_type: entry.event_type as ProfessionalAuditLog["event_type"],
    metadata: (entry.metadata as ProfessionalAuditLog["metadata"]) ?? {},
    created_at: String(entry.created_at),
  } satisfies ProfessionalAuditLog)).sort((a, b) => b.created_at.localeCompare(a.created_at));
  const quality = calculateProfessionalQuality({
    professional: {
      companyName: professional.company_name,
      tradeName: professional.trade_name,
      contactName: professional.contact_name,
      email: professional.email,
      phone: professional.phone,
      website: professional.website,
      kvkNumber: professional.kvk_number,
      btwNumber: professional.btw_number,
      identityType: professional.identity_type,
      addressLine1: professional.address_line_1,
      postalCode: professional.postal_code,
      city: professional.city,
      province: professional.province,
      yearsExperience: professional.years_experience,
      teamSize: professional.team_size,
      description: professional.description,
      specialties: professional.specialties,
      onboardingStatus: professional.onboarding_status,
      verificationStatus: professional.verification_status,
    },
    services: serviceLinks.map((serviceLink) => ({
      active: serviceLink.active,
      yearsExperience: serviceLink.yearsExperience,
      specializationSummary: serviceLink.specializationSummary,
      preferredLeadType: serviceLink.preferredLeadType,
    })),
    areas: areaLinks,
    settings: settings ? {
      maxOpenOffers: settings.max_open_offers,
      maxActiveAssignments: settings.max_active_assignments,
      paused: settings.paused,
      pauseUntil: settings.pause_until,
      preferredLeadTypes: settings.preferred_lead_types,
      availabilityStatus: settings.availability_status,
      availableFrom: settings.available_from,
      unavailableUntil: settings.unavailable_until,
    } : null,
    documents: documents.map((document) => ({
      documentType: document.document_type,
      verificationStatus: document.verification_status,
      archivedAt: document.archived_at,
      expiresAt: document.expires_at,
    })),
    requiredDocuments: documentRequirements.map((requirement) => ({
      documentType: requirement.document_type,
      requirementLevel: requirement.requirement_level,
      serviceId: requirement.service_id,
    })),
  });

  return { professional, serviceLinks, areaLinks, settings, documents, documentRequirements, reviewFeedback, auditEntries, quality };
}

export async function getAdminProfessionals() {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase.from("professionals").select(baseSelection).order("created_at", { ascending: false });
  if (error) throw new Error("Vakmannen konden niet worden geladen.");

  return ((data ?? []) as Array<Record<string, unknown>>).map((row) => {
    const { professional, serviceLinks, areaLinks, quality } = calculateFromRow(row);
    return {
      ...professional,
      serviceNames: serviceLinks.filter((serviceLink) => serviceLink.active).map((serviceLink) => serviceLink.service.name),
      postalCodePrefixes: areaLinks.map((area) => area.postalCodePrefix),
      qualityLabel: getProfessionalQualityLabel(quality.score),
    } satisfies ProfessionalListItem;
  });
}

export async function getAdminProfessionalDetail(id: string) {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase.from("professionals").select(baseSelection).eq("id", id).maybeSingle();
  if (error) throw new Error("Vakman kon niet worden geladen.");
  if (!data) return null;

  const { professional, serviceLinks, areaLinks, settings, documents, documentRequirements, reviewFeedback, auditEntries, quality } = calculateFromRow(data as Record<string, unknown>);
  const stats = await loadProfessionalStats(id);
  const signedDocuments = await Promise.all(documents.map(async (document) => ({
    ...document,
    signedUrl: await createSignedProfessionalDocumentUrl(document.storage_path),
  })));

  return {
    ...professional,
    serviceNames: serviceLinks.filter((serviceLink) => serviceLink.active).map((serviceLink) => serviceLink.service.name),
    postalCodePrefixes: areaLinks.map((area) => area.postalCodePrefix),
    serviceLinks,
    areaLinks,
    distributionSettings: settings,
    documents: signedDocuments,
    documentRequirements,
    reviewFeedback,
    auditEntries,
    qualityLabel: getProfessionalQualityLabel(quality.score),
    missingSteps: quality.missingSteps,
    canSubmit: quality.canSubmit,
    distributionEligible: quality.distributionEligible,
    stats,
  } satisfies ProfessionalDetail;
}

export async function getOwnProfessionalDetail(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("professionals").select(baseSelection).eq("id", id).maybeSingle();
  if (error) throw new Error("Profiel kon niet worden geladen.");
  if (!data) return null;

  const { professional, serviceLinks, areaLinks, settings, documents, documentRequirements, reviewFeedback, auditEntries, quality } = calculateFromRow(data as Record<string, unknown>);
  return {
    ...professional,
    serviceNames: serviceLinks.filter((serviceLink) => serviceLink.active).map((serviceLink) => serviceLink.service.name),
    postalCodePrefixes: areaLinks.map((area) => area.postalCodePrefix),
    serviceLinks,
    areaLinks,
    distributionSettings: settings,
    documents: documents.map((document) => ({ ...document, signedUrl: null })),
    documentRequirements,
    reviewFeedback,
    auditEntries,
    qualityLabel: getProfessionalQualityLabel(quality.score),
    missingSteps: quality.missingSteps,
    canSubmit: quality.canSubmit,
    distributionEligible: quality.distributionEligible,
    stats: await loadProfessionalStats(id),
  } satisfies ProfessionalDetail;
}

export async function getVerificationQueue(filter: "submitted" | "pending" | "changes_requested" | "verified" | "rejected" | "all" = "all", sort: "oldest" | "newest" = "oldest") {
  const supabase = createAdminSupabaseClient();
  let query = supabase.from("professionals").select(baseSelection);
  if (filter !== "all") {
    if (["submitted", "changes_requested", "rejected"].includes(filter)) {
      query = query.eq("onboarding_status", filter);
    } else {
      query = query.eq("verification_status", filter);
    }
  }
  query = query.order("submitted_for_review_at", { ascending: sort === "oldest", nullsFirst: sort === "oldest" });
  const { data, error } = await query;
  if (error) throw new Error("Verificatiequeue kon niet worden geladen.");

  return ((data ?? []) as Array<Record<string, unknown>>).map((row) => {
    const { professional, serviceLinks, areaLinks, quality } = calculateFromRow(row);
    return {
      ...professional,
      serviceNames: serviceLinks.filter((serviceLink) => serviceLink.active).map((serviceLink) => serviceLink.service.name),
      postalCodePrefixes: areaLinks.map((area) => area.postalCodePrefix),
      qualityLabel: getProfessionalQualityLabel(quality.score),
      missingSteps: quality.missingSteps,
      canSubmit: quality.canSubmit,
      distributionEligible: quality.distributionEligible,
      submittedAt: professional.submitted_for_review_at,
    } satisfies VerificationQueueItem;
  });
}

export async function getActiveAssignableProfessionals(serviceId: string) {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("professionals")
    .select("id, company_name, contact_name, email, phone, status, professional_services!inner(service_id, active), professional_service_areas(postal_code_prefix)")
    .eq("status", "active")
    .eq("professional_services.service_id", serviceId)
    .eq("professional_services.active", true)
    .order("company_name");

  if (error) throw new Error("Vakmannen konden niet worden opgehaald.");

  return ((data ?? []) as Array<Record<string, unknown>>).map((item) => ({
    id: String(item.id),
    company_name: String(item.company_name),
    contact_name: String(item.contact_name),
    email: String(item.email),
    phone: String(item.phone),
    status: String(item.status),
    professional_service_areas: (item.professional_service_areas ?? []) as Array<{ postal_code_prefix: string }>,
  }));
}
