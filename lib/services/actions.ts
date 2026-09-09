"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/auth/helpers";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { serviceInputSchema, serviceToggleSchema } from "@/lib/validation/services";

function redirectWithMessage(path: string, key: "error" | "success", message: string): never {
  const search = new URLSearchParams({ [key]: message });
  redirect(`${path}?${search.toString()}`);
}

export async function createServiceAction(formData: FormData) {
  await requireAdminUser();

  const payload = serviceInputSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    category: formData.get("category"),
    description: formData.get("description"),
    active: formData.get("active") === "on",
  });

  if (!payload.success) {
    redirectWithMessage("/admin/diensten", "error", payload.error.issues[0]?.message ?? "Ongeldige dienstgegevens.");
  }

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("services").insert({
    name: payload.data.name,
    slug: payload.data.slug,
    category: payload.data.category,
    description: payload.data.description || null,
    active: payload.data.active,
  });

  if (error) {
    redirectWithMessage("/admin/diensten", "error", "De dienst kon niet worden opgeslagen.");
  }

  revalidatePath("/admin/diensten");
  redirectWithMessage("/admin/diensten", "success", "Dienst toegevoegd.");
}

export async function toggleServiceStatusAction(formData: FormData) {
  await requireAdminUser();

  const payload = serviceToggleSchema.safeParse({
    serviceId: formData.get("service_id"),
    active: formData.get("active") === "true",
    redirectTo: formData.get("redirect_to"),
  });

  if (!payload.success) {
    redirectWithMessage("/admin/diensten", "error", "De dienststatus kon niet worden aangepast.");
  }

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("services")
    .update({ active: payload.data.active, updated_at: new Date().toISOString() })
    .eq("id", payload.data.serviceId);

  if (error) {
    redirectWithMessage(payload.data.redirectTo, "error", "De dienststatus kon niet worden aangepast.");
  }

  revalidatePath("/admin/diensten");
  revalidatePath("/aanvraag");
  redirectWithMessage(payload.data.redirectTo, "success", "Dienststatus bijgewerkt.");
}
