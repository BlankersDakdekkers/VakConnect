"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/auth/helpers";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import {
  serviceInputSchema,
  serviceQuestionMutationSchema,
  serviceQuestionOptionMutationSchema,
  serviceQuestionOptionToggleSchema,
  serviceQuestionToggleSchema,
  serviceToggleSchema,
} from "@/lib/validation/services";

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

export async function upsertServiceQuestionAction(formData: FormData) {
  await requireAdminUser();

  const payload = serviceQuestionMutationSchema.safeParse({
    questionId: formData.get("question_id"),
    serviceId: formData.get("service_id"),
    question: formData.get("question"),
    slug: formData.get("slug"),
    type: formData.get("type"),
    helpText: formData.get("help_text"),
    required: formData.get("required") === "on",
    active: formData.get("active") === "on",
    sortOrder: formData.get("sort_order"),
    redirectTo: formData.get("redirect_to"),
    options: [],
  });

  if (!payload.success) {
    redirectWithMessage("/admin/diensten", "error", payload.error.issues[0]?.message ?? "De dienstvraag kon niet worden opgeslagen.");
  }

  const supabase = createAdminSupabaseClient();
  const values = {
    service_id: payload.data.serviceId,
    question: payload.data.question,
    slug: payload.data.slug,
    type: payload.data.type,
    help_text: payload.data.helpText || null,
    required: payload.data.required,
    active: payload.data.active,
    sort_order: payload.data.sortOrder,
    updated_at: new Date().toISOString(),
  };

  const response = payload.data.questionId
    ? await supabase.from("service_questions").update(values).eq("id", payload.data.questionId)
    : await supabase.from("service_questions").insert(values);

  if (response.error) {
    redirectWithMessage(payload.data.redirectTo, "error", "De dienstvraag kon niet worden opgeslagen.");
  }

  revalidatePath("/admin/diensten");
  revalidatePath(payload.data.redirectTo);
  revalidatePath("/aanvraag");
  redirectWithMessage(payload.data.redirectTo, "success", payload.data.questionId ? "Dienstvraag bijgewerkt." : "Dienstvraag toegevoegd.");
}

export async function toggleServiceQuestionStatusAction(formData: FormData) {
  await requireAdminUser();

  const payload = serviceQuestionToggleSchema.safeParse({
    questionId: formData.get("question_id"),
    active: formData.get("active") === "true",
    redirectTo: formData.get("redirect_to"),
  });

  if (!payload.success) {
    redirectWithMessage("/admin/diensten", "error", "De vraagstatus kon niet worden aangepast.");
  }

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("service_questions")
    .update({ active: payload.data.active, updated_at: new Date().toISOString() })
    .eq("id", payload.data.questionId);

  if (error) {
    redirectWithMessage(payload.data.redirectTo, "error", "De vraagstatus kon niet worden aangepast.");
  }

  revalidatePath("/admin/diensten");
  revalidatePath(payload.data.redirectTo);
  revalidatePath("/aanvraag");
  redirectWithMessage(payload.data.redirectTo, "success", "Vraagstatus bijgewerkt.");
}

export async function upsertServiceQuestionOptionAction(formData: FormData) {
  await requireAdminUser();

  const payload = serviceQuestionOptionMutationSchema.safeParse({
    optionId: formData.get("option_id"),
    questionId: formData.get("question_id"),
    label: formData.get("label"),
    value: formData.get("value"),
    sortOrder: formData.get("sort_order"),
    active: formData.get("active") === "on",
    redirectTo: formData.get("redirect_to"),
  });

  if (!payload.success) {
    redirectWithMessage("/admin/diensten", "error", payload.error.issues[0]?.message ?? "De optie kon niet worden opgeslagen.");
  }

  const supabase = createAdminSupabaseClient();
  const values = {
    question_id: payload.data.questionId,
    label: payload.data.label,
    value: payload.data.value,
    sort_order: payload.data.sortOrder,
    active: payload.data.active,
  };

  const response = payload.data.optionId
    ? await supabase.from("service_question_options").update(values).eq("id", payload.data.optionId)
    : await supabase.from("service_question_options").insert(values);

  if (response.error) {
    redirectWithMessage(payload.data.redirectTo, "error", "De optie kon niet worden opgeslagen.");
  }

  revalidatePath("/admin/diensten");
  revalidatePath(payload.data.redirectTo);
  revalidatePath("/aanvraag");
  redirectWithMessage(payload.data.redirectTo, "success", payload.data.optionId ? "Optie bijgewerkt." : "Optie toegevoegd.");
}

export async function toggleServiceQuestionOptionStatusAction(formData: FormData) {
  await requireAdminUser();

  const payload = serviceQuestionOptionToggleSchema.safeParse({
    optionId: formData.get("option_id"),
    active: formData.get("active") === "true",
    redirectTo: formData.get("redirect_to"),
  });

  if (!payload.success) {
    redirectWithMessage("/admin/diensten", "error", "De optiestatus kon niet worden aangepast.");
  }

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("service_question_options")
    .update({ active: payload.data.active })
    .eq("id", payload.data.optionId);

  if (error) {
    redirectWithMessage(payload.data.redirectTo, "error", "De optiestatus kon niet worden aangepast.");
  }

  revalidatePath("/admin/diensten");
  revalidatePath(payload.data.redirectTo);
  revalidatePath("/aanvraag");
  redirectWithMessage(payload.data.redirectTo, "success", "Optiestatus bijgewerkt.");
}
