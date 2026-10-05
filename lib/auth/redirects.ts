import type { AppRole } from "@/types/database";

export function getSafeLoginRedirect(role: AppRole, nextPath: string) {
  const root = role === "admin" ? "/admin" : "/vakman";
  if (!nextPath.startsWith("/") || /[\\\u0000-\u0020\u007f]/.test(nextPath)) return root;
  try {
    const url = new URL(nextPath, "https://vakconnect.invalid");
    if (url.origin !== "https://vakconnect.invalid") return root;
    if (url.pathname !== root && !url.pathname.startsWith(`${root}/`)) return root;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return root;
  }
}
