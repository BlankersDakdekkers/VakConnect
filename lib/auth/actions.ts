"use server";

import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { getUserRole } from "@/lib/auth/helpers";
import { getSafeLoginRedirect } from "@/lib/auth/redirects";
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

  redirect(getSafeLoginRedirect(role, nextPath));
}

export async function signOutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  }

  redirect("/");
}
