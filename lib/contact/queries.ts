import "server-only";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { ContactSubmission } from "@/types/database";

export async function getAdminContactSubmissions() {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("id, reason, name, email, phone, message, status, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Contactberichten konden niet worden geladen.");
  }

  return (data ?? []) as ContactSubmission[];
}
