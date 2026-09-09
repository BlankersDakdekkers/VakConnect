"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser, requireProfessionalUser } from "@/lib/auth/helpers";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  professionalAdminProfileUpdateSchema,
  professionalAreaDeleteSchema,
  professionalAreaMutationSchema,
  professionalCreationSchema,
  professionalProfileUpdateSchema,
  professionalServiceMutationSchema,
  professionalServiceToggleSchema,
  professionalStatusUpdateSchema,
  professionalVerificationStatusUpdateSchema,
} from "@/lib/validation/professionals";
import { sanitizeProfessionalSelfUpdateInput } from "@/lib/professionals/profile";

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

  if (!payload.success) {
    redirectWithMessage("/admin/vakmannen", "error", payload.error.issues[0]?.message ?? "Ongeldige vakmangegevens.");
  }

  const supabase = createAdminSupabaseClient();
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: payload.data.email,
    password: payload.data.password,
    email_confirm: true,
    app_metadata: { role: "professional" },
  });

  const authUser = authData?.user ?? null;
  if (authError || !authUser) {
    redirectWithMessage("/admin/vakmannen", "error", "Het account voor de vakman kon niet worden aangemaakt.");
  }

  const { data: professional, error: professionalError } = await supabase
    .from("professionals")
    .insert({
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
    })
    .select("id")
    .single();

  if (professionalError || !professional) {
    await supabase.auth.admin.deleteUser(authUser.id);
    redirectWithMessage("/admin/vakmannen", "error", "De vakman kon niet worden opgeslagen.");
  }

  const serviceLinks = payload.data.serviceIds.map((serviceId) => ({
    professional_id: professional.id,
    service_id: serviceId,
    active: true,
  }));
  const areaLinks = payload.data.postalCodePrefixes.map((postalCodePrefix) => ({
    professional_id: professional.id,
    postal_code_prefix: postalCodePrefix,
  }));

  const [{ error: servicesError }, { error: areasError }] = await Promise.all([
    supabase.from("professional_services").insert(serviceLinks),
    supabase.from("professional_service_areas").insert(areaLinks),
  ]);

  if (servicesError || areasError) {
    await supabase.from("professionals").delete().eq("id", professional.id);
    await supabase.auth.admin.deleteUser(authUser.id);
    redirectWithMessage("/admin/vakmannen", "error", "De diensten of werkgebieden konden niet worden opgeslagen.");
  }

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

  if (!payload.success) {
    redirectWithMessage("/admin/vakmannen", "error", "De status van de vakman kon niet worden aangepast.");
  }

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("professionals")
    .update({ status: payload.data.status, updated_at: new Date().toISOString() })
    .eq("id", payload.data.professionalId);

  if (error) {
    redirectWithMessage(payload.data.redirectTo, "error", "De status van de vakman kon niet worden aangepast.");
  }

  revalidatePath("/admin/vakmannen");
  revalidatePath(`/admin/vakmannen/${payload.data.professionalId}`);
  redirectWithMessage(payload.data.redirectTo, "success", "Status bijgewerkt.");
}

export async function updateProfessionalVerificationStatusAction(formData: FormData) {
  await requireAdminUser();

  const payload = professionalVerificationStatusUpdateSchema.safeParse({
    professionalId: formData.get("professional_id"),
    verificationStatus: formData.get("verification_status"),
    redirectTo: formData.get("redirect_to"),
  });

  if (!payload.success) {
    redirectWithMessage("/admin/vakmannen", "error", "De verificatiestatus kon niet worden aangepast.");
  }

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("professionals")
    .update({ verification_status: payload.data.verificationStatus, updated_at: new Date().toISOString() })
    .eq("id", payload.data.professionalId);

  if (error) {
    redirectWithMessage(payload.data.redirectTo, "error", "De verificatiestatus kon niet worden aangepast.");
  }

  revalidatePath(`/admin/vakmannen/${payload.data.professionalId}`);
  redirectWithMessage(payload.data.redirectTo, "success", "Verificatiestatus bijgewerkt.");
}

export async function updateProfessionalAdminProfileAction(formData: FormData) {
  await requireAdminUser();

  const payload = professionalAdminProfileUpdateSchema.safeParse({
    professionalId: formData.get("professional_id"),
    companyName: formData.get("company_name"),
    contactName: formData.get("contact_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    kvkNumber: formData.get("kvk_number"),
    website: formData.get("website"),
    description: formData.get("description"),
    redirectTo: formData.get("redirect_to"),
  });

  if (!payload.success) {
    redirectWithMessage("/admin/vakmannen", "error", payload.error.issues[0]?.message ?? "De vakman kon niet worden bijgewerkt.");
  }

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("professionals")
    .update({
      company_name: payload.data.companyName,
      contact_name: payload.data.contactName,
      email: payload.data.email,
      phone: payload.data.phone,
      kvk_number: payload.data.kvkNumber || null,
      website: payload.data.website || null,
      description: payload.data.description || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", payload.data.professionalId);

  if (error) {
    redirectWithMessage(payload.data.redirectTo, "error", "De vakman kon niet worden bijgewerkt.");
  }

  revalidatePath("/admin/vakmannen");
  revalidatePath(`/admin/vakmannen/${payload.data.professionalId}`);
  revalidatePath("/vakman/profiel");
  redirectWithMessage(payload.data.redirectTo, "success", "Bedrijfsgegevens bijgewerkt.");
}

export async function addProfessionalServiceAction(formData: FormData) {
  await requireAdminUser();

  const payload = professionalServiceMutationSchema.safeParse({
    professionalId: formData.get("professional_id"),
    serviceId: formData.get("service_id"),
    redirectTo: formData.get("redirect_to"),
  });

  if (!payload.success) {
    redirectWithMessage("/admin/vakmannen", "error", "Dienst kon niet worden toegevoegd.");
  }

  const supabase = createAdminSupabaseClient();
  const { data: existing } = await supabase
    .from("professional_services")
    .select("id")
    .eq("professional_id", payload.data.professionalId)
    .eq("service_id", payload.data.serviceId)
    .maybeSingle();

  const { error } = existing
    ? await supabase.from("professional_services").update({ active: true }).eq("id", existing.id)
    : await supabase.from("professional_services").insert({
      professional_id: payload.data.professionalId,
      service_id: payload.data.serviceId,
      active: true,
    });

  if (error) {
    redirectWithMessage(payload.data.redirectTo, "error", "Dienst kon niet worden toegevoegd.");
  }

  revalidatePath(`/admin/vakmannen/${payload.data.professionalId}`);
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

  if (!payload.success) {
    redirectWithMessage("/admin/vakmannen", "error", "Dienststatus kon niet worden aangepast.");
  }

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("professional_services")
    .update({ active: payload.data.active })
    .eq("id", payload.data.professionalServiceId)
    .eq("professional_id", payload.data.professionalId);

  if (error) {
    redirectWithMessage(payload.data.redirectTo, "error", "Dienststatus kon niet worden aangepast.");
  }

  revalidatePath(`/admin/vakmannen/${payload.data.professionalId}`);
  redirectWithMessage(payload.data.redirectTo, "success", "Dienststatus bijgewerkt.");
}

export async function addProfessionalAreaAction(formData: FormData) {
  await requireAdminUser();

  const payload = professionalAreaMutationSchema.safeParse({
    professionalId: formData.get("professional_id"),
    postalCodePrefix: String(formData.get("postal_code_prefix") ?? "").trim(),
    redirectTo: formData.get("redirect_to"),
  });

  if (!payload.success) {
    redirectWithMessage("/admin/vakmannen", "error", payload.error.issues[0]?.message ?? "Werkgebied kon niet worden toegevoegd.");
  }

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("professional_service_areas").insert({
    professional_id: payload.data.professionalId,
    postal_code_prefix: payload.data.postalCodePrefix,
  });

  if (error) {
    redirectWithMessage(payload.data.redirectTo, "error", "Werkgebied kon niet worden toegevoegd.");
  }

  revalidatePath(`/admin/vakmannen/${payload.data.professionalId}`);
  redirectWithMessage(payload.data.redirectTo, "success", "Werkgebied toegevoegd.");
}

export async function removeProfessionalAreaAction(formData: FormData) {
  await requireAdminUser();

  const payload = professionalAreaDeleteSchema.safeParse({
    areaId: formData.get("area_id"),
    professionalId: formData.get("professional_id"),
    redirectTo: formData.get("redirect_to"),
  });

  if (!payload.success) {
    redirectWithMessage("/admin/vakmannen", "error", "Werkgebied kon niet worden verwijderd.");
  }

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("professional_service_areas")
    .delete()
    .eq("id", payload.data.areaId)
    .eq("professional_id", payload.data.professionalId);

  if (error) {
    redirectWithMessage(payload.data.redirectTo, "error", "Werkgebied kon niet worden verwijderd.");
  }

  revalidatePath(`/admin/vakmannen/${payload.data.professionalId}`);
  redirectWithMessage(payload.data.redirectTo, "success", "Werkgebied verwijderd.");
}

export async function updateOwnProfessionalProfileAction(formData: FormData) {
  const user = await requireProfessionalUser();

  const payload = professionalProfileUpdateSchema.safeParse({
    contactName: formData.get("contact_name"),
    phone: formData.get("phone"),
    website: formData.get("website"),
    description: formData.get("description"),
  });

  if (!payload.success) {
    redirectWithMessage("/vakman/profiel", "error", payload.error.issues[0]?.message ?? "Profiel kon niet worden opgeslagen.");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("professionals")
    .update(sanitizeProfessionalSelfUpdateInput(payload.data))
    .eq("id", user.professional.id)
    .eq("auth_user_id", user.id);

  if (error) {
    redirectWithMessage("/vakman/profiel", "error", "Profiel kon niet worden opgeslagen.");
  }

  revalidatePath("/vakman/profiel");
  revalidatePath("/vakman");
  redirectWithMessage("/vakman/profiel", "success", "Profiel bijgewerkt.");
}
