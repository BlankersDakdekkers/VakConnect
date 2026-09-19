"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser, requireProfessionalUser } from "@/lib/auth/helpers";
import { ensureDistributionSettingsForProfessional } from "@/lib/distribution/engine";
import { refreshProfessionalDerivedState } from "@/lib/professionals/derived";
import { getAdminProfessionalDetail } from "@/lib/professionals/queries";
import { buildProfessionalDocumentPath, professionalDocumentsBucket, validateProfessionalDocument } from "@/lib/storage/professional-documents";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  parseSpecialties,
  professionalAdminProfileUpdateSchema,
  professionalAreaDeleteSchema,
  professionalAreaMutationSchema,
  professionalCapacityOnboardingSchema,
  professionalCompanyOnboardingSchema,
  professionalContactOnboardingSchema,
  professionalCreationSchema,
  professionalDocumentDeleteSchema,
  professionalDocumentReviewSchema,
  professionalDocumentUploadSchema,
  professionalExperienceOnboardingSchema,
  professionalOnboardingStepMutationSchema,
  professionalOnboardingSubmitSchema,
  professionalProfileUpdateSchema,
  professionalReviewFeedbackCreateSchema,
  professionalServiceMutationSchema,
  professionalServiceSelectionListSchema,
  professionalServiceToggleSchema,
  professionalStatusUpdateSchema,
  professionalVerificationDecisionSchema,
  professionalVerificationStatusUpdateSchema,
} from "@/lib/validation/professionals";
import type { ProfessionalOnboardingStep } from "@/types/database";

function redirectWithMessage(path: string, key: "error" | "success", message: string): never {
  const search = new URLSearchParams({ [key]: message });
  redirect(`${path}?${search.toString()}`);
}

function parsePostalPrefixes(raw: FormDataEntryValue | null) {
  return String(raw ?? "")
    .split(",")
    .map((value) => value.trim().toUpperCase())
    .filter(Boolean);
}

function textValue(value: FormDataEntryValue | null) {
  const trimmed = String(value ?? "").trim();
  return trimmed || "";
}

function optionalDateValue(value: string | null | undefined) {
  return value ? new Date(value).toISOString() : null;
}

async function revalidateProfessionalSurfaces(professionalId: string) {
  revalidatePath("/vakman");
  revalidatePath("/vakman/onboarding");
  revalidatePath("/vakman/profiel");
  revalidatePath("/admin/verificatie");
  revalidatePath("/admin/vakmannen");
  revalidatePath(`/admin/vakmannen/${professionalId}`);
}

async function syncProfessionalServices(professionalId: string, formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const selectedServiceIds = formData.getAll("service_id").map(String);
  const entries = selectedServiceIds.map((serviceId) => ({
    serviceId,
    active: true,
    yearsExperience: Number(formData.get(`service_years_${serviceId}`) ?? 0),
    specializationSummary: textValue(formData.get(`service_specialization_${serviceId}`)),
    preferredLeadType: textValue(formData.get(`service_lead_type_${serviceId}`)),
  }));
  const payload = professionalServiceSelectionListSchema.safeParse(entries);
  if (!payload.success) throw new Error(payload.error.issues[0]?.message ?? "Controleer je dienstselectie.");

  const { data: existingRows } = await supabase
    .from("professional_services")
    .select("id, service_id")
    .eq("professional_id", professionalId);

  const existingByService = new Map((existingRows ?? []).map((row) => [String(row.service_id), String(row.id)]));
  for (const entry of payload.data) {
    const existingId = existingByService.get(entry.serviceId);
    if (existingId) {
      await supabase.from("professional_services").update({
        active: true,
        years_experience: entry.yearsExperience,
        specialization_summary: entry.specializationSummary || null,
        preferred_lead_type: entry.preferredLeadType || null,
      }).eq("id", existingId).eq("professional_id", professionalId);
      existingByService.delete(entry.serviceId);
    } else {
      await supabase.from("professional_services").insert({
        professional_id: professionalId,
        service_id: entry.serviceId,
        active: true,
        years_experience: entry.yearsExperience,
        specialization_summary: entry.specializationSummary || null,
        preferred_lead_type: entry.preferredLeadType || null,
      });
    }
  }

  for (const [, staleId] of existingByService) {
    await supabase.from("professional_services").update({ active: false }).eq("id", staleId).eq("professional_id", professionalId);
  }
}

async function saveCompanyStep(professionalId: string, formData: FormData) {
  const payload = professionalCompanyOnboardingSchema.safeParse({
    companyName: formData.get("company_name"),
    tradeName: formData.get("trade_name"),
    identityType: formData.get("identity_type"),
    kvkNumber: formData.get("kvk_number"),
    btwNumber: formData.get("btw_number"),
    addressLine1: formData.get("address_line_1"),
    addressLine2: formData.get("address_line_2"),
    postalCode: formData.get("postal_code"),
    city: formData.get("city"),
    province: formData.get("province"),
  });
  if (!payload.success) throw new Error(payload.error.issues[0]?.message ?? "Bedrijfsgegevens zijn ongeldig.");
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("professionals").update({
    company_name: payload.data.companyName,
    trade_name: payload.data.tradeName || null,
    identity_type: payload.data.identityType,
    kvk_number: payload.data.kvkNumber,
    btw_number: payload.data.btwNumber || null,
    address_line_1: payload.data.addressLine1,
    address_line_2: payload.data.addressLine2 || null,
    postal_code: payload.data.postalCode.toUpperCase(),
    city: payload.data.city,
    province: payload.data.province,
    onboarding_status: "in_progress",
    onboarding_step: "contact",
    updated_at: new Date().toISOString(),
  }).eq("id", professionalId);
  if (error) throw new Error("Bedrijfsgegevens konden niet worden opgeslagen.");
}

async function saveContactStep(professionalId: string, formData: FormData) {
  const payload = professionalContactOnboardingSchema.safeParse({
    contactName: formData.get("contact_name"),
    phone: formData.get("phone"),
    website: formData.get("website"),
  });
  if (!payload.success) throw new Error(payload.error.issues[0]?.message ?? "Contactgegevens zijn ongeldig.");
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("professionals").update({
    contact_name: payload.data.contactName,
    phone: payload.data.phone,
    website: payload.data.website || null,
    onboarding_status: "in_progress",
    onboarding_step: "services",
    updated_at: new Date().toISOString(),
  }).eq("id", professionalId);
  if (error) throw new Error("Contactgegevens konden niet worden opgeslagen.");
}

async function saveExperienceStep(professionalId: string, formData: FormData) {
  const payload = professionalExperienceOnboardingSchema.safeParse({
    yearsExperience: formData.get("years_experience"),
    teamSize: formData.get("team_size"),
    specialties: parseSpecialties(formData.get("specialties")),
    description: formData.get("description"),
  });
  if (!payload.success) throw new Error(payload.error.issues[0]?.message ?? "Ervaring is ongeldig.");
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("professionals").update({
    years_experience: payload.data.yearsExperience,
    team_size: payload.data.teamSize,
    specialties: payload.data.specialties,
    description: payload.data.description,
    onboarding_status: "in_progress",
    onboarding_step: "capacity",
    updated_at: new Date().toISOString(),
  }).eq("id", professionalId);
  if (error) throw new Error("Ervaring kon niet worden opgeslagen.");
}

async function saveCapacityStep(professionalId: string, formData: FormData) {
  const payload = professionalCapacityOnboardingSchema.safeParse({
    maxOpenOffers: formData.get("max_open_offers"),
    maxActiveAssignments: formData.get("max_active_assignments"),
    paused: formData.get("paused") === "on",
    pauseUntil: textValue(formData.get("pause_until")),
    preferredLeadTypes: formData.getAll("preferred_lead_types").map(String),
    availabilityStatus: formData.get("availability_status"),
    availableFrom: textValue(formData.get("available_from")),
    unavailableUntil: textValue(formData.get("unavailable_until")),
  });
  if (!payload.success) throw new Error(payload.error.issues[0]?.message ?? "Capaciteitsinstellingen zijn ongeldig.");
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("professional_distribution_settings").upsert({
    professional_id: professionalId,
    max_open_offers: payload.data.maxOpenOffers,
    max_active_assignments: payload.data.maxActiveAssignments,
    paused: payload.data.paused,
    pause_until: optionalDateValue(payload.data.pauseUntil),
    preferred_lead_types: payload.data.preferredLeadTypes,
    availability_status: payload.data.availabilityStatus,
    available_from: optionalDateValue(payload.data.availableFrom),
    unavailable_until: optionalDateValue(payload.data.unavailableUntil),
  }, { onConflict: "professional_id" });
  if (error) throw new Error("Capaciteitsinstellingen konden niet worden opgeslagen.");
}

async function saveProfileSection(professionalId: string, formData: FormData) {
  const payload = professionalProfileUpdateSchema.safeParse({
    companyName: formData.get("company_name"),
    tradeName: formData.get("trade_name"),
    identityType: formData.get("identity_type"),
    contactName: formData.get("contact_name"),
    phone: formData.get("phone"),
    kvkNumber: formData.get("kvk_number"),
    btwNumber: formData.get("btw_number"),
    website: formData.get("website"),
    addressLine1: formData.get("address_line_1"),
    addressLine2: formData.get("address_line_2"),
    postalCode: formData.get("postal_code"),
    city: formData.get("city"),
    province: formData.get("province"),
    yearsExperience: formData.get("years_experience") ?? undefined,
    teamSize: formData.get("team_size") ?? undefined,
    specialties: parseSpecialties(formData.get("specialties")),
    description: formData.get("description"),
  });
  if (!payload.success) throw new Error(payload.error.issues[0]?.message ?? "Profielgegevens zijn ongeldig.");
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("professionals").update({
    company_name: payload.data.companyName,
    trade_name: payload.data.tradeName || null,
    identity_type: payload.data.identityType || null,
    contact_name: payload.data.contactName,
    phone: payload.data.phone,
    kvk_number: payload.data.kvkNumber || null,
    btw_number: payload.data.btwNumber || null,
    website: payload.data.website || null,
    address_line_1: payload.data.addressLine1 || null,
    address_line_2: payload.data.addressLine2 || null,
    postal_code: payload.data.postalCode ? payload.data.postalCode.toUpperCase() : null,
    city: payload.data.city || null,
    province: payload.data.province || null,
    years_experience: payload.data.yearsExperience ?? null,
    team_size: payload.data.teamSize ?? null,
    specialties: payload.data.specialties,
    description: payload.data.description || null,
    updated_at: new Date().toISOString(),
  }).eq("id", professionalId);
  if (error) throw new Error("Profiel kon niet worden opgeslagen.");
}

async function saveOnboardingStep(professionalId: string, step: ProfessionalOnboardingStep, formData: FormData) {
  await ensureDistributionSettingsForProfessional(professionalId);
  switch (step) {
    case "company":
      await saveCompanyStep(professionalId, formData);
      break;
    case "contact":
      await saveContactStep(professionalId, formData);
      break;
    case "services":
      await syncProfessionalServices(professionalId, formData);
      break;
    case "areas":
      break;
    case "experience":
      await saveExperienceStep(professionalId, formData);
      break;
    case "capacity":
      await saveCapacityStep(professionalId, formData);
      break;
    case "documents":
    case "review":
      break;
  }
  return refreshProfessionalDerivedState(professionalId);
}

export async function createProfessionalAction(formData: FormData) {
  await requireAdminUser();
  const payload = professionalCreationSchema.safeParse({
    companyName: formData.get("company_name"),
    contactName: formData.get("contact_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    kvkNumber: formData.get("kvk_number"),
    website: formData.get("website"),
    description: formData.get("description"),
    status: formData.get("status"),
    verificationStatus: formData.get("verification_status") ?? "unverified",
    serviceIds: formData.getAll("service_ids"),
    postalCodePrefixes: parsePostalPrefixes(formData.get("postal_code_prefixes")),
  });
  if (!payload.success) redirectWithMessage("/admin/vakmannen", "error", payload.error.issues[0]?.message ?? "Ongeldige vakmangegevens.");

  const supabase = createAdminSupabaseClient();
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: payload.data.email,
    password: payload.data.password,
    email_confirm: true,
    app_metadata: { role: "professional" },
  });
  const authUser = authData?.user ?? null;
  if (authError || !authUser) redirectWithMessage("/admin/vakmannen", "error", "Het account voor de vakman kon niet worden aangemaakt.");

  const { data: professional, error: professionalError } = await supabase.from("professionals").insert({
    auth_user_id: authUser.id,
    company_name: payload.data.companyName,
    contact_name: payload.data.contactName,
    email: payload.data.email,
    phone: payload.data.phone,
    kvk_number: payload.data.kvkNumber || null,
    website: payload.data.website || null,
    description: payload.data.description || null,
    status: payload.data.status,
    verification_status: payload.data.verificationStatus,
    onboarding_status: "in_progress",
  }).select("id").single();
  if (professionalError || !professional) {
    await supabase.auth.admin.deleteUser(authUser.id);
    redirectWithMessage("/admin/vakmannen", "error", "De vakman kon niet worden opgeslagen.");
  }

  const serviceLinks = payload.data.serviceIds.map((serviceId) => ({ professional_id: professional.id, service_id: serviceId, active: true }));
  const areaLinks = payload.data.postalCodePrefixes.map((postalCodePrefix) => ({ professional_id: professional.id, postal_code_prefix: postalCodePrefix }));
  const [{ error: servicesError }, { error: areasError }] = await Promise.all([
    supabase.from("professional_services").insert(serviceLinks),
    supabase.from("professional_service_areas").insert(areaLinks),
  ]);
  if (servicesError || areasError) {
    await supabase.from("professionals").delete().eq("id", professional.id);
    await supabase.auth.admin.deleteUser(authUser.id);
    redirectWithMessage("/admin/vakmannen", "error", "De diensten of werkgebieden konden niet worden opgeslagen.");
  }

  await ensureDistributionSettingsForProfessional(professional.id);
  await refreshProfessionalDerivedState(professional.id);
  revalidatePath("/admin/vakmannen");
  redirectWithMessage("/admin/vakmannen", "success", "Vakman toegevoegd.");
}

export async function updateProfessionalStatusAction(formData: FormData) {
  await requireAdminUser();
  const payload = professionalStatusUpdateSchema.safeParse({
    professionalId: formData.get("professional_id"),
    status: formData.get("status"),
    redirectTo: formData.get("redirect_to"),
  });
  if (!payload.success) redirectWithMessage("/admin/vakmannen", "error", "De status van de vakman kon niet worden aangepast.");
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("professionals").update({ status: payload.data.status, updated_at: new Date().toISOString() }).eq("id", payload.data.professionalId);
  if (error) redirectWithMessage(payload.data.redirectTo, "error", "De status van de vakman kon niet worden aangepast.");
  await revalidateProfessionalSurfaces(payload.data.professionalId);
  redirectWithMessage(payload.data.redirectTo, "success", "Status bijgewerkt.");
}

export async function updateProfessionalVerificationStatusAction(formData: FormData) {
  await requireAdminUser();
  const payload = professionalVerificationStatusUpdateSchema.safeParse({
    professionalId: formData.get("professional_id"),
    verificationStatus: formData.get("verification_status"),
    redirectTo: formData.get("redirect_to"),
  });
  if (!payload.success) redirectWithMessage("/admin/vakmannen", "error", "De verificatiestatus kon niet worden aangepast.");
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("professionals").update({ verification_status: payload.data.verificationStatus, updated_at: new Date().toISOString() }).eq("id", payload.data.professionalId);
  if (error) redirectWithMessage(payload.data.redirectTo, "error", "De verificatiestatus kon niet worden aangepast.");
  await refreshProfessionalDerivedState(payload.data.professionalId);
  await revalidateProfessionalSurfaces(payload.data.professionalId);
  redirectWithMessage(payload.data.redirectTo, "success", "Verificatiestatus bijgewerkt.");
}

export async function updateProfessionalAdminProfileAction(formData: FormData) {
  await requireAdminUser();
  const payload = professionalAdminProfileUpdateSchema.safeParse({
    professionalId: formData.get("professional_id"),
    companyName: formData.get("company_name"),
    tradeName: formData.get("trade_name"),
    identityType: formData.get("identity_type"),
    contactName: formData.get("contact_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    kvkNumber: formData.get("kvk_number"),
    btwNumber: formData.get("btw_number"),
    website: formData.get("website"),
    addressLine1: formData.get("address_line_1"),
    addressLine2: formData.get("address_line_2"),
    postalCode: formData.get("postal_code"),
    city: formData.get("city"),
    province: formData.get("province"),
    yearsExperience: formData.get("years_experience") ?? undefined,
    teamSize: formData.get("team_size") ?? undefined,
    specialties: parseSpecialties(formData.get("specialties")),
    description: formData.get("description"),
    redirectTo: formData.get("redirect_to"),
  });
  if (!payload.success) redirectWithMessage("/admin/vakmannen", "error", payload.error.issues[0]?.message ?? "De vakman kon niet worden bijgewerkt.");
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("professionals").update({
    company_name: payload.data.companyName,
    trade_name: payload.data.tradeName || null,
    identity_type: payload.data.identityType || null,
    contact_name: payload.data.contactName,
    email: payload.data.email,
    phone: payload.data.phone,
    kvk_number: payload.data.kvkNumber || null,
    btw_number: payload.data.btwNumber || null,
    website: payload.data.website || null,
    address_line_1: payload.data.addressLine1 || null,
    address_line_2: payload.data.addressLine2 || null,
    postal_code: payload.data.postalCode || null,
    city: payload.data.city || null,
    province: payload.data.province || null,
    years_experience: typeof payload.data.yearsExperience === "number" ? payload.data.yearsExperience : null,
    team_size: typeof payload.data.teamSize === "number" ? payload.data.teamSize : null,
    specialties: payload.data.specialties,
    description: payload.data.description || null,
    updated_at: new Date().toISOString(),
  }).eq("id", payload.data.professionalId);
  if (error) redirectWithMessage(payload.data.redirectTo, "error", "De vakman kon niet worden bijgewerkt.");
  await refreshProfessionalDerivedState(payload.data.professionalId);
  await revalidateProfessionalSurfaces(payload.data.professionalId);
  redirectWithMessage(payload.data.redirectTo, "success", "Bedrijfsgegevens bijgewerkt.");
}

export async function addProfessionalServiceAction(formData: FormData) {
  await requireAdminUser();
  const payload = professionalServiceMutationSchema.safeParse({ professionalId: formData.get("professional_id"), serviceId: formData.get("service_id"), redirectTo: formData.get("redirect_to") });
  if (!payload.success) redirectWithMessage("/admin/vakmannen", "error", "Dienst kon niet worden toegevoegd.");
  const supabase = createAdminSupabaseClient();
  const { data: existing } = await supabase.from("professional_services").select("id").eq("professional_id", payload.data.professionalId).eq("service_id", payload.data.serviceId).maybeSingle();
  const { error } = existing
    ? await supabase.from("professional_services").update({ active: true }).eq("id", existing.id)
    : await supabase.from("professional_services").insert({ professional_id: payload.data.professionalId, service_id: payload.data.serviceId, active: true });
  if (error) redirectWithMessage(payload.data.redirectTo, "error", "Dienst kon niet worden toegevoegd.");
  await refreshProfessionalDerivedState(payload.data.professionalId);
  await revalidateProfessionalSurfaces(payload.data.professionalId);
  redirectWithMessage(payload.data.redirectTo, "success", "Dienst gekoppeld.");
}

export async function toggleProfessionalServiceAction(formData: FormData) {
  await requireAdminUser();
  const payload = professionalServiceToggleSchema.safeParse({
    professionalServiceId: formData.get("professional_service_id"),
    active: formData.get("active"),
    professionalId: formData.get("professional_id"),
    redirectTo: formData.get("redirect_to"),
  });
  if (!payload.success) redirectWithMessage("/admin/vakmannen", "error", "Dienststatus kon niet worden aangepast.");
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("professional_services").update({ active: payload.data.active }).eq("id", payload.data.professionalServiceId).eq("professional_id", payload.data.professionalId);
  if (error) redirectWithMessage(payload.data.redirectTo, "error", "Dienststatus kon niet worden aangepast.");
  await refreshProfessionalDerivedState(payload.data.professionalId);
  await revalidateProfessionalSurfaces(payload.data.professionalId);
  redirectWithMessage(payload.data.redirectTo, "success", "Dienststatus bijgewerkt.");
}

export async function addProfessionalAreaAction(formData: FormData) {
  await requireAdminUser();
  const payload = professionalAreaMutationSchema.safeParse({
    professionalId: formData.get("professional_id"),
    postalCodePrefix: formData.get("postal_code_prefix"),
    city: formData.get("city"),
    province: formData.get("province"),
    radiusKm: formData.get("radius_km") || undefined,
    redirectTo: formData.get("redirect_to"),
  });
  if (!payload.success) redirectWithMessage("/admin/vakmannen", "error", payload.error.issues[0]?.message ?? "Werkgebied kon niet worden toegevoegd.");
  const professionalId = payload.data.professionalId;
  if (!professionalId) redirectWithMessage(payload.data.redirectTo ?? "/admin/vakmannen", "error", "Vakman ontbreekt voor dit werkgebied.");
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("professional_service_areas").upsert({
    professional_id: professionalId,
    postal_code_prefix: payload.data.postalCodePrefix,
    city: payload.data.city || null,
    province: payload.data.province || null,
    radius_km: payload.data.radiusKm ?? null,
  }, { onConflict: "professional_id,postal_code_prefix" });
  if (error) redirectWithMessage(payload.data.redirectTo ?? `/admin/vakmannen/${professionalId}`, "error", "Werkgebied kon niet worden toegevoegd.");
  await refreshProfessionalDerivedState(professionalId);
  await revalidateProfessionalSurfaces(professionalId);
  redirectWithMessage(payload.data.redirectTo ?? `/admin/vakmannen/${professionalId}`, "success", "Werkgebied toegevoegd.");
}

export async function removeProfessionalAreaAction(formData: FormData) {
  await requireAdminUser();
  const payload = professionalAreaDeleteSchema.safeParse({ areaId: formData.get("area_id"), professionalId: formData.get("professional_id"), redirectTo: formData.get("redirect_to") });
  if (!payload.success) redirectWithMessage("/admin/vakmannen", "error", "Werkgebied kon niet worden verwijderd.");
  const professionalId = payload.data.professionalId;
  if (!professionalId) redirectWithMessage(payload.data.redirectTo ?? "/admin/vakmannen", "error", "Vakman ontbreekt voor dit werkgebied.");
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("professional_service_areas").delete().eq("id", payload.data.areaId).eq("professional_id", professionalId);
  if (error) redirectWithMessage(payload.data.redirectTo ?? `/admin/vakmannen/${professionalId}`, "error", "Werkgebied kon niet worden verwijderd.");
  await refreshProfessionalDerivedState(professionalId);
  await revalidateProfessionalSurfaces(professionalId);
  redirectWithMessage(payload.data.redirectTo ?? `/admin/vakmannen/${professionalId}`, "success", "Werkgebied verwijderd.");
}

export async function updateOwnProfessionalProfileAction(formData: FormData) {
  const user = await requireProfessionalUser();
  try {
    await saveProfileSection(user.professional.id, formData);
    await refreshProfessionalDerivedState(user.professional.id);
  } catch (error) {
    redirectWithMessage("/vakman/profiel", "error", error instanceof Error ? error.message : "Profiel kon niet worden opgeslagen.");
  }
  await revalidateProfessionalSurfaces(user.professional.id);
  redirectWithMessage("/vakman/profiel", "success", "Profiel bijgewerkt.");
}

export async function autosaveProfessionalOnboardingStepAction(formData: FormData) {
  const user = await requireProfessionalUser();
  const payload = professionalOnboardingStepMutationSchema.safeParse({
    professionalId: formData.get("professional_id"),
    step: formData.get("step"),
    nextStep: formData.get("next_step") || undefined,
    autosave: formData.get("autosave") || "true",
  });
  if (!payload.success) {
    return { ok: false, message: payload.error.issues[0]?.message ?? "Autosave mislukt." };
  }
  try {
    await saveOnboardingStep(user.professional.id, payload.data.step, formData);
    await revalidateProfessionalSurfaces(user.professional.id);
    return { ok: true, message: "Wijzigingen opgeslagen." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Autosave mislukt." };
  }
}

export async function saveProfessionalOnboardingStepAction(formData: FormData) {
  const user = await requireProfessionalUser();
  const payload = professionalOnboardingStepMutationSchema.safeParse({
    professionalId: formData.get("professional_id"),
    step: formData.get("step"),
    nextStep: formData.get("next_step") || undefined,
    autosave: formData.get("autosave") || "false",
  });
  if (!payload.success) redirectWithMessage("/vakman/onboarding", "error", payload.error.issues[0]?.message ?? "Stap kon niet worden opgeslagen.");
  try {
    await saveOnboardingStep(user.professional.id, payload.data.step, formData);
  } catch (error) {
    redirectWithMessage(`/vakman/onboarding?step=${payload.data.step}`, "error", error instanceof Error ? error.message : "Stap kon niet worden opgeslagen.");
  }
  await revalidateProfessionalSurfaces(user.professional.id);
  redirectWithMessage(`/vakman/onboarding?step=${payload.data.nextStep ?? payload.data.step}`, "success", "Stap opgeslagen.");
}

export async function submitProfessionalOnboardingAction(formData: FormData) {
  const user = await requireProfessionalUser();
  const payload = professionalOnboardingSubmitSchema.safeParse({ professionalId: formData.get("professional_id"), redirectTo: formData.get("redirect_to") });
  if (!payload.success) redirectWithMessage("/vakman/onboarding?step=review", "error", "Profiel kon niet worden ingediend.");
  const detail = await getAdminProfessionalDetail(user.professional.id);
  if (!detail || !detail.canSubmit) {
    redirectWithMessage(payload.data.redirectTo ?? "/vakman/onboarding?step=review", "error", "Vul eerst alle verplichte stappen en documenten aan.");
  }
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("professionals").update({
    onboarding_status: "submitted",
    onboarding_step: "review",
    submitted_for_review_at: new Date().toISOString(),
    verification_status: detail.verification_status === "verified" ? "verified" : "pending",
    updated_at: new Date().toISOString(),
  }).eq("id", user.professional.id);
  if (error) redirectWithMessage(payload.data.redirectTo ?? "/vakman/onboarding?step=review", "error", "Profiel kon niet worden ingediend.");
  await refreshProfessionalDerivedState(user.professional.id);
  await revalidateProfessionalSurfaces(user.professional.id);
  redirectWithMessage(payload.data.redirectTo ?? "/vakman", "success", "Profiel is ingediend voor review.");
}

export async function uploadProfessionalDocumentAction(formData: FormData) {
  const user = await requireProfessionalUser();
  const payload = professionalDocumentUploadSchema.safeParse({
    professionalId: formData.get("professional_id"),
    documentType: formData.get("document_type"),
    expiresAt: textValue(formData.get("expires_at")),
    redirectTo: formData.get("redirect_to"),
  });
  if (!payload.success) redirectWithMessage("/vakman/onboarding?step=documents", "error", payload.error.issues[0]?.message ?? "Document kon niet worden geüpload.");
  const file = formData.get("file");
  if (!(file instanceof File)) redirectWithMessage(payload.data.redirectTo ?? "/vakman/onboarding?step=documents", "error", "Selecteer een document.");

  const supabase = await createServerSupabaseClient();
  const fileInfo = validateProfessionalDocument(file);
  const documentId = randomUUID();
  const path = buildProfessionalDocumentPath(user.professional.id, documentId, file);
  const { data: existingApproved } = await supabase.from("professional_documents").select("id, verification_status").eq("professional_id", user.professional.id).eq("document_type", payload.data.documentType).eq("verification_status", "approved").is("archived_at", null).maybeSingle();
  const { error: uploadError } = await supabase.storage.from(professionalDocumentsBucket).upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
  if (uploadError) redirectWithMessage(payload.data.redirectTo ?? "/vakman/onboarding?step=documents", "error", "Document kon niet veilig worden opgeslagen.");
  const { error: insertError } = await supabase.from("professional_documents").insert({
    id: documentId,
    professional_id: user.professional.id,
    document_type: payload.data.documentType,
    storage_path: path,
    original_filename: fileInfo.originalFilename,
    mime_type: file.type,
    file_size: file.size,
    expires_at: optionalDateValue(payload.data.expiresAt),
  });
  if (insertError) {
    await supabase.storage.from(professionalDocumentsBucket).remove([path]);
    redirectWithMessage(payload.data.redirectTo ?? "/vakman/onboarding?step=documents", "error", "Documentmetadata kon niet worden opgeslagen.");
  }
  if (existingApproved?.id) {
    await supabase.from("professional_documents").update({ archived_at: new Date().toISOString(), superseded_by_document_id: documentId }).eq("id", existingApproved.id).eq("professional_id", user.professional.id);
  }
  await refreshProfessionalDerivedState(user.professional.id);
  await revalidateProfessionalSurfaces(user.professional.id);
  redirectWithMessage(payload.data.redirectTo ?? "/vakman/onboarding?step=documents", "success", "Document geüpload.");
}

export async function deleteProfessionalDocumentAction(formData: FormData) {
  const user = await requireProfessionalUser();
  const payload = professionalDocumentDeleteSchema.safeParse({ documentId: formData.get("document_id"), redirectTo: formData.get("redirect_to") });
  if (!payload.success) redirectWithMessage("/vakman/onboarding?step=documents", "error", "Document kon niet worden verwijderd.");
  const supabase = await createServerSupabaseClient();
  const { data: document, error } = await supabase.from("professional_documents").select("id, storage_path, verification_status").eq("id", payload.data.documentId).eq("professional_id", user.professional.id).maybeSingle();
  if (error || !document) redirectWithMessage(payload.data.redirectTo ?? "/vakman/onboarding?step=documents", "error", "Document kon niet worden gevonden.");
  if (document.verification_status === "approved") redirectWithMessage(payload.data.redirectTo ?? "/vakman/onboarding?step=documents", "error", "Goedgekeurde documenten kunnen alleen via vervanging worden bijgewerkt.");
  const { error: deleteError } = await supabase.from("professional_documents").delete().eq("id", document.id).eq("professional_id", user.professional.id);
  if (deleteError) redirectWithMessage(payload.data.redirectTo ?? "/vakman/onboarding?step=documents", "error", "Document kon niet worden verwijderd.");
  await supabase.storage.from(professionalDocumentsBucket).remove([String(document.storage_path)]);
  await refreshProfessionalDerivedState(user.professional.id);
  await revalidateProfessionalSurfaces(user.professional.id);
  redirectWithMessage(payload.data.redirectTo ?? "/vakman/onboarding?step=documents", "success", "Document verwijderd.");
}

export async function reviewProfessionalDocumentAction(formData: FormData) {
  const admin = await requireAdminUser();
  const payload = professionalDocumentReviewSchema.safeParse({
    documentId: formData.get("document_id"),
    professionalId: formData.get("professional_id"),
    verificationStatus: formData.get("verification_status"),
    rejectionReason: formData.get("rejection_reason"),
    redirectTo: formData.get("redirect_to"),
  });
  if (!payload.success) redirectWithMessage("/admin/verificatie", "error", payload.error.issues[0]?.message ?? "Documentreview kon niet worden opgeslagen.");
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("professional_documents").update({
    verification_status: payload.data.verificationStatus,
    rejection_reason: payload.data.rejectionReason || null,
    reviewed_at: new Date().toISOString(),
    reviewed_by: admin.id,
  }).eq("id", payload.data.documentId).eq("professional_id", payload.data.professionalId);
  if (error) redirectWithMessage(payload.data.redirectTo, "error", "Documentreview kon niet worden opgeslagen.");
  await refreshProfessionalDerivedState(payload.data.professionalId);
  await revalidateProfessionalSurfaces(payload.data.professionalId);
  redirectWithMessage(payload.data.redirectTo, "success", "Documentreview opgeslagen.");
}

export async function createProfessionalReviewFeedbackAction(formData: FormData) {
  const admin = await requireAdminUser();
  const payload = professionalReviewFeedbackCreateSchema.safeParse({
    professionalId: formData.get("professional_id"),
    section: formData.get("section"),
    message: formData.get("message"),
    status: formData.get("status") ?? "open",
    redirectTo: formData.get("redirect_to"),
  });
  if (!payload.success) redirectWithMessage("/admin/verificatie", "error", payload.error.issues[0]?.message ?? "Feedback kon niet worden opgeslagen.");
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("professional_review_feedback").insert({
    professional_id: payload.data.professionalId,
    section: payload.data.section,
    message: payload.data.message,
    status: payload.data.status,
    created_by: admin.id,
  });
  if (error) redirectWithMessage(payload.data.redirectTo, "error", "Feedback kon niet worden opgeslagen.");
  await revalidateProfessionalSurfaces(payload.data.professionalId);
  redirectWithMessage(payload.data.redirectTo, "success", "Feedback toegevoegd.");
}

export async function reviewProfessionalVerificationAction(formData: FormData) {
  const admin = await requireAdminUser();
  const payload = professionalVerificationDecisionSchema.safeParse({
    professionalId: formData.get("professional_id"),
    action: formData.get("decision"),
    reason: formData.get("reason"),
    redirectTo: formData.get("redirect_to"),
  });
  if (!payload.success) redirectWithMessage("/admin/verificatie", "error", payload.error.issues[0]?.message ?? "Verificatieactie kon niet worden uitgevoerd.");
  const detail = await getAdminProfessionalDetail(payload.data.professionalId);
  if (!detail) redirectWithMessage("/admin/verificatie", "error", "Vakman niet gevonden.");
  const supabase = createAdminSupabaseClient();
  const update: Record<string, unknown> = {
    verification_status_reason: payload.data.reason || null,
    updated_at: new Date().toISOString(),
  };
  if (payload.data.action === "verify") {
    update.verification_status = "verified";
    update.onboarding_status = "approved";
    update.onboarding_completed_at = detail.onboarding_completed_at ?? new Date().toISOString();
    update.status = detail.status === "suspended" ? "active" : detail.status;
  } else if (payload.data.action === "changes_requested") {
    update.onboarding_status = "changes_requested";
    update.verification_status = "changes_requested";
  } else if (payload.data.action === "reject") {
    update.onboarding_status = "rejected";
    update.verification_status = "rejected";
  } else if (payload.data.action === "suspend") {
    update.status = "suspended";
    update.verification_status = "suspended";
  }
  const { error } = await supabase.from("professionals").update(update).eq("id", payload.data.professionalId);
  if (error) redirectWithMessage(payload.data.redirectTo, "error", "Verificatieactie kon niet worden uitgevoerd.");
  if (payload.data.action === "changes_requested" && payload.data.reason) {
    await supabase.from("professional_review_feedback").insert({
      professional_id: payload.data.professionalId,
      section: "review",
      message: payload.data.reason,
      status: "open",
      created_by: admin.id,
    });
  }
  await refreshProfessionalDerivedState(payload.data.professionalId);
  await revalidateProfessionalSurfaces(payload.data.professionalId);
  redirectWithMessage(payload.data.redirectTo, "success", "Verificatie bijgewerkt.");
}

export async function updateOwnProfessionalAreaAction(formData: FormData) {
  const user = await requireProfessionalUser();
  const payload = professionalAreaMutationSchema.safeParse({
    professionalId: user.professional.id,
    postalCodePrefix: formData.get("postal_code_prefix"),
    city: formData.get("city"),
    province: formData.get("province"),
    radiusKm: formData.get("radius_km") || undefined,
    redirectTo: formData.get("redirect_to") || "/vakman/onboarding?step=areas",
  });
  if (!payload.success) redirectWithMessage("/vakman/onboarding?step=areas", "error", payload.error.issues[0]?.message ?? "Werkgebied kon niet worden opgeslagen.");
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("professional_service_areas").upsert({
    professional_id: user.professional.id,
    postal_code_prefix: payload.data.postalCodePrefix,
    city: payload.data.city || null,
    province: payload.data.province || null,
    radius_km: payload.data.radiusKm ?? null,
  }, { onConflict: "professional_id,postal_code_prefix" });
  if (error) redirectWithMessage(payload.data.redirectTo ?? "/vakman/onboarding?step=areas", "error", "Werkgebied kon niet worden opgeslagen.");
  await refreshProfessionalDerivedState(user.professional.id);
  await revalidateProfessionalSurfaces(user.professional.id);
  redirectWithMessage(payload.data.redirectTo ?? "/vakman/onboarding?step=areas", "success", "Werkgebied opgeslagen.");
}

export async function removeOwnProfessionalAreaAction(formData: FormData) {
  const user = await requireProfessionalUser();
  const payload = professionalAreaDeleteSchema.safeParse({ areaId: formData.get("area_id"), professionalId: user.professional.id, redirectTo: formData.get("redirect_to") || "/vakman/onboarding?step=areas" });
  if (!payload.success) redirectWithMessage("/vakman/onboarding?step=areas", "error", "Werkgebied kon niet worden verwijderd.");
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("professional_service_areas").delete().eq("id", payload.data.areaId).eq("professional_id", user.professional.id);
  if (error) redirectWithMessage(payload.data.redirectTo ?? "/vakman/onboarding?step=areas", "error", "Werkgebied kon niet worden verwijderd.");
  await refreshProfessionalDerivedState(user.professional.id);
  await revalidateProfessionalSurfaces(user.professional.id);
  redirectWithMessage(payload.data.redirectTo ?? "/vakman/onboarding?step=areas", "success", "Werkgebied verwijderd.");
}
