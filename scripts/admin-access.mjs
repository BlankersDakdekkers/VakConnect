import { createClient } from "@supabase/supabase-js";
import { pathToFileURL } from "node:url";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function runAdminCommand(args, env = process.env, makeClient = createClient, output = console.log) {
  const [command, userId] = args;
  if (args.length !== 2 || !["grant", "revoke", "check"].includes(command) || !uuidPattern.test(userId ?? "")) {
    throw new Error("Gebruik admin:grant, admin:revoke of admin:check met precies één user UUID.");
  }
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL en SUPABASE_SERVICE_ROLE_KEY zijn vereist.");
  let parsed;
  try { parsed = new URL(url); } catch { throw new Error("Ongeldige Supabase URL."); }
  if (parsed.username || parsed.password || (parsed.protocol !== "https:" &&
      !(parsed.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname)))) {
    throw new Error("Gebruik HTTPS voor Supabase; HTTP is alleen lokaal toegestaan.");
  }
  try {
    const client = makeClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await client.auth.admin.getUserById(userId);
    if (error || !data?.user || data.user.id !== userId) throw new Error();
    const metadata = data.user.app_metadata ?? {};
    const isAdmin = metadata.role === "admin";
    if (command === "check") {
      output(`user exists: yes; admin: ${isAdmin ? "yes" : "no"}`);
      return;
    }
    if ((command === "grant" && isAdmin) || (command === "revoke" && !isAdmin)) {
      output(`${command}: no-op; target=${userId}`);
      return;
    }
    const role = command === "grant" ? "admin" : null;
    const result = await client.auth.admin.updateUserById(userId, { app_metadata: { ...metadata, role } });
    if (result.error || !result.data?.user || result.data.user.app_metadata?.role !== role) throw new Error();
    output(`${command}: success; target=${userId}; actor=privileged-cli; timestamp=${new Date().toISOString()}`);
  } catch {
    throw new Error("Adminbeheer mislukt. Controleer UUID, gebruikersbestaan, configuratie en privileged rechten; er worden geen API-details gelogd.");
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runAdminCommand(process.argv.slice(2)).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
