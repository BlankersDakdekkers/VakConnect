import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookieOptions: { secure: process.env.NODE_ENV === "production", sameSite: "lax" },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data, error } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  if (path === "/admin" || path.startsWith("/admin/")) {
    if (error || !data.user || data.user.app_metadata?.role !== "admin") {
      const login = new URL("/login", request.url);
      if (error || !data.user) {
        login.searchParams.set("next", `${path}${request.nextUrl.search}`);
      } else {
        login.searchParams.set("error", "Geen toegang");
      }
      const denied = NextResponse.redirect(login);
      response.cookies.getAll().forEach((cookie) => denied.cookies.set(cookie));
      return denied;
    }
  }
  return response;
}
