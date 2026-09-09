import "server-only";
import { isSupabaseConfigured } from "@/lib/env";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Service } from "@/types/database";

const baseSelection = "id, name, slug, category, description, active, created_at, updated_at";

export async function getActiveServices() {
  if (!isSupabaseConfigured()) {
    return [] as Service[];
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("services").select(baseSelection).eq("active", true).order("name");

  if (error) {
    return [] as Service[];
  }

  return (data ?? []) as Service[];
}

export async function getAdminServices() {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase.from("services").select(baseSelection).order("category").order("name");

  if (error) {
    throw new Error("Diensten konden niet worden geladen.");
  }

  return (data ?? []) as Service[];
}
