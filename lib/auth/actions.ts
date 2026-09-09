"use server";

import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { getSafeRoleRedirect, getUserRole } from "@/lib/auth/helpers";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function encodeMessage(message: string) {
  return encodeURIComponent(message);
}

export async function signInAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect("/login?error=Supabase%20is%20nog%20niet%20geconfigureerd.");
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "").trim();
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeMessage("Inloggen is niet gelukt. Controleer je gegevens en probeer opnieuw.")}`);
  }

  const { data } = await supabase.auth.getUser();
  const role = getUserRole(data.user);

  if (!role) {
    await supabase.auth.signOut();
    redirect(`/login?error=${encodeMessage("Je account heeft nog geen geldige rol in VakConnect.")}`);
  }

  const fallback = getSafeRoleRedirect(role);
  const isSafeNext = nextPath.startsWith("/admin") || nextPath.startsWith("/vakman");
  redirect(isSafeNext ? nextPath : fallback);
}

export async function signOutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  }

  redirect("/");
}
