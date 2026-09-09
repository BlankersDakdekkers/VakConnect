"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { publicContactSchema, publicProfessionalApplicationSchema } from "@/lib/validation";

function redirectWithMessage(path: string, key: "error" | "success", message: string): never {
  const params = new URLSearchParams({ [key]: message });
  redirect(`${path}?${params.toString()}`);
}

function parsePostalPrefixes(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((entry) => entry.trim().toUpperCase())
    .filter(Boolean);
}

export async function submitProfessionalApplicationAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirectWithMessage("/aanmelden-vakman", "error", "Aanmelden is tijdelijk niet beschikbaar.");
  }

  const payload = publicProfessionalApplicationSchema.safeParse({
    companyName: formData.get("company_name"),
    contactName: formData.get("contact_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    kvkNumber: formData.get("kvk_number"),
    website: formData.get("website"),
    description: formData.get("description"),
    serviceIds: formData.getAll("service_ids"),
    postalCodePrefixes: parsePostalPrefixes(formData.get("postal_code_prefixes")),
  });

  if (!payload.success) {
    redirectWithMessage("/aanmelden-vakman", "error", payload.error.issues[0]?.message ?? "Controleer je gegevens.");
  }

  const supabase = createAdminSupabaseClient();
  const { data: activeServices, error: serviceError } = await supabase
    .from("services")
    .select("id")
    .in("id", payload.data.serviceIds)
    .eq("active", true);

  if (serviceError || (activeServices ?? []).length !== payload.data.serviceIds.length) {
    redirectWithMessage("/aanmelden-vakman", "error", "Eén of meer geselecteerde diensten zijn niet beschikbaar.");
  }

  const { data: professional, error: professionalError } = await supabase
    .from("professionals")
    .insert({
      company_name: payload.data.companyName,
      contact_name: payload.data.contactName,
      email: payload.data.email,
      phone: payload.data.phone,
      kvk_number: payload.data.kvkNumber,
      website: payload.data.website || null,
      description: payload.data.description,
      status: "pending",
      verification_status: "pending",
      auth_user_id: null,
    })
    .select("id")
    .single();

  if (professionalError || !professional) {
    if (professionalError?.code === "23505") {
      redirectWithMessage("/aanmelden-vakman", "error", "Dit e-mailadres is al bekend bij VakConnect.");
    }
    redirectWithMessage("/aanmelden-vakman", "error", "Je aanmelding kon niet worden opgeslagen.");
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

  const [{ error: linksError }, { error: areasError }] = await Promise.all([
    supabase.from("professional_services").insert(serviceLinks),
    supabase.from("professional_service_areas").insert(areaLinks),
  ]);

  if (linksError || areasError) {
    await supabase.from("professionals").delete().eq("id", professional.id);
    redirectWithMessage("/aanmelden-vakman", "error", "Je aanmelding kon niet volledig worden verwerkt.");
  }

  revalidatePath("/admin/vakmannen");
  redirectWithMessage("/aanmelden-vakman", "success", "Bedankt! Je aanmelding staat op pending en wordt handmatig beoordeeld.");
}

export async function submitContactFormAction(formData: FormData) {
  const payload = publicContactSchema.safeParse({
    reason: formData.get("reason"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  });

  if (!payload.success) {
    redirectWithMessage("/contact", "error", payload.error.issues[0]?.message ?? "Controleer je bericht.");
  }

  redirectWithMessage("/contact", "success", "Bedankt voor je bericht. We komen hier zo snel mogelijk op terug.");
}
