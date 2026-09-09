import "server-only";
import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { AppRole, Professional } from "@/types/database";

export type CurrentAppUser = {
  id: string;
  email: string | undefined;
  role: AppRole;
  professional: Professional | null;
};

export function getUserRole(user: User | null): AppRole | null {
  const role = user?.app_metadata?.role;
  return role === "admin" || role === "professional" ? role : null;
}

export async function getCurrentAppUser(): Promise<CurrentAppUser | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  const role = getUserRole(data.user);
  if (!role) {
    return null;
  }

  let professional: Professional | null = null;

  if (role === "professional") {
    const { data: professionalData } = await supabase
      .from("professionals")
      .select("id, auth_user_id, company_name, contact_name, email, phone, kvk_number, website, status, created_at, updated_at")
      .eq("auth_user_id", data.user.id)
      .maybeSingle();

    professional = professionalData ?? null;
  }

  return {
    id: data.user.id,
    email: data.user.email,
    role,
    professional,
  };
}

export function getSafeRoleRedirect(role: AppRole) {
  return role === "admin" ? "/admin" : "/vakman";
}

export async function requireAdminUser() {
  const user = await getCurrentAppUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin") {
    redirect("/login?error=Je%20hebt%20geen%20toegang%20tot%20deze%20omgeving.");
  }

  return user;
}

export async function requireProfessionalUser() {
  const user = await getCurrentAppUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "professional" || !user.professional) {
    redirect("/login?error=Je%20hebt%20geen%20toegang%20tot%20deze%20omgeving.");
  }

  return user as CurrentAppUser & { professional: Professional };
}
