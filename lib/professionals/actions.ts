"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/auth/helpers";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { professionalCreationSchema, professionalStatusUpdateSchema } from "@/lib/validation/professionals";

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
    status: formData.get("status"),
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
      status: payload.data.status,
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
