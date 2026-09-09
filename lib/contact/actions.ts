"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/auth/helpers";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { contactSubmissionStatusUpdateSchema } from "@/lib/validation";

function redirectWithMessage(path: string, key: "error" | "success", message: string): never {
  const search = new URLSearchParams({ [key]: message });
  redirect(`${path}?${search.toString()}`);
}

export async function updateContactSubmissionStatusAction(formData: FormData) {
  await requireAdminUser();

  const payload = contactSubmissionStatusUpdateSchema.safeParse({
    submissionId: formData.get("submission_id"),
    status: formData.get("status"),
    redirectTo: formData.get("redirect_to"),
  });

  if (!payload.success) {
    redirectWithMessage("/admin/contact", "error", "Status kon niet worden bijgewerkt.");
  }

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("contact_submissions")
    .update({
      status: payload.data.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", payload.data.submissionId);

  if (error) {
    redirectWithMessage(payload.data.redirectTo, "error", "Status kon niet worden bijgewerkt.");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/contact");
  redirectWithMessage(payload.data.redirectTo, "success", "Status bijgewerkt.");
}
