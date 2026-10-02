"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/auth/helpers";
import { isSupabaseConfigured } from "@/lib/env";
import { experimentStatusValues } from "@/lib/experiments/targeting";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const idPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function redirectToExperiment(id: string, key: "success" | "error", message: string): never {
  const query = new URLSearchParams({ [key]: message });
  redirect(`/admin/experimenten/${id}?${query.toString()}`);
}

export async function transitionExperimentStatusAction(formData: FormData) {
  const admin = await requireAdminUser();
  const idValue = formData.get("experiment_id");
  const nextStatusValue = formData.get("next_status");

  if (typeof idValue !== "string" || !idPattern.test(idValue) || typeof nextStatusValue !== "string") {
    redirect("/admin/experimenten?error=Ongeldige%20experimentgegevens.");
  }
  if (!isSupabaseConfigured()) redirectToExperiment(idValue, "error", "Supabase configuratie ontbreekt.");
  if (!experimentStatusValues.includes(nextStatusValue as (typeof experimentStatusValues)[number]) || nextStatusValue === "draft") {
    redirectToExperiment(idValue, "error", "Ongeldige statusovergang.");
  }

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.rpc("transition_experiment_status", {
    input_experiment_id: idValue,
    input_next_status: nextStatusValue,
    input_actor_user_id: admin.id,
  });

  if (error) {
    redirectToExperiment(idValue, "error", "Status niet gewijzigd. Controleer status, control, varianten, weging en actief slot.");
  }

  revalidatePath("/admin/experimenten");
  revalidatePath("/admin/experimenten/[id]", "page");
  redirectToExperiment(idValue, "success", "Experimentstatus bijgewerkt.");
}
