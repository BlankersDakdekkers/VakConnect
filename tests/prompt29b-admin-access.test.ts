import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";
import { getSafeLoginRedirect } from "../lib/auth/redirects.ts";

const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const userId = "11111111-1111-4111-8111-111111111111";
function load(path: string, mocks: Record<string, unknown>, env: Record<string, string> = {}) {
  const compiledModule = { exports: {} as Record<string, unknown> };
  const require = createRequire(import.meta.url);
  runInNewContext(ts.transpileModule(source(path).replaceAll("import.meta.url", '"file:///test-module"'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: path.replace(/\.mjs$/, ".ts"),
  }).outputText, {
    module: compiledModule, exports: compiledModule.exports, URL, URLSearchParams, process: { argv: [], env }, console,
    require: (name: string) => name === "server-only" ? {} : Object.hasOwn(mocks, name) ? mocks[name] : require(name),
  });
  return compiledModule.exports;
}
type TestUser = { id: string; app_metadata: Record<string, unknown>; user_metadata?: Record<string, unknown> };
function helpersHarness(user: TestUser | null, error: unknown = null) {
  let current = user;
  const helpers = load("lib/auth/helpers.ts", {
    "next/navigation": { redirect: (path: string) => { throw new Error(`REDIRECT:${path}`); } },
    "@/lib/env": { isSupabaseConfigured: () => true },
    "@/lib/supabase/server": { createServerSupabaseClient: async () => ({
      auth: { getUser: async () => ({ data: { user: current }, error }) },
      from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { id: "professional-profile" } }) }) }) }),
    }) },
  });
  return {
    requireAdmin: helpers.requireAdminUser as () => Promise<TestUser>,
    requireProfessional: helpers.requireProfessionalUser as () => Promise<{ professional: unknown }>,
    revoke: () => { current = { id: userId, app_metadata: { role: null } }; },
  };
}
test("central guard allows real admin without professional profile and denies public, expired and professional users", async () => {
  assert.equal((await helpersHarness({ id: userId, app_metadata: { role: "admin" } }).requireAdmin()).id, userId);
  for (const harness of [
    helpersHarness(null),
    helpersHarness({ id: userId, app_metadata: { role: "professional" } }),
    helpersHarness({ id: userId, app_metadata: { role: "admin" } }, new Error("expired")),
  ]) await assert.rejects(harness.requireAdmin(), /REDIRECT:\/login/);
  assert.ok((await helpersHarness({ id: userId, app_metadata: { role: "professional" } }).requireProfessional()).professional);
});
test("fresh server request denies revoked admin and ignores user-editable metadata", async () => {
  const harness = helpersHarness({ id: userId, app_metadata: { role: "admin" } });
  await harness.requireAdmin();
  harness.revoke();
  await assert.rejects(harness.requireAdmin(), /REDIRECT:\/login/);
  await assert.rejects(helpersHarness({
    id: userId, app_metadata: {}, user_metadata: { role: "admin", isAdmin: true },
  }).requireAdmin(), /REDIRECT:\/login/);
});
test("login return URL is normalized, internal and constrained to the authenticated role", () => {
  assert.equal(getSafeLoginRedirect("admin", "/admin/leadkwaliteit/review?id=1"), "/admin/leadkwaliteit/review?id=1");
  assert.equal(getSafeLoginRedirect("professional", "/vakman/profiel"), "/vakman/profiel");
  for (const path of ["https://example.com", "//example.com", "/administrator", "/admin/../../evil", "/admin\\evil", "/admin\nLocation:x", "/vakman"]) {
    assert.equal(getSafeLoginRedirect("admin", path), "/admin");
  }
  assert.equal(getSafeLoginRedirect("professional", "/admin?isAdmin=true"), "/vakman");
});
test("existing password login preserves professional/admin routing, rejects unassigned roles and logout clears session", async () => {
  for (const role of ["professional", "admin", null]) {
    let signIns = 0;
    let signOuts = 0;
    const actions = load("lib/auth/actions.ts", {
      "@/lib/env": { isSupabaseConfigured: () => true },
      "@/lib/auth/helpers": { getUserRole: () => role },
      "@/lib/auth/redirects": { getSafeLoginRedirect },
      "next/navigation": { redirect: (path: string) => { throw new Error(`REDIRECT:${path}`); } },
      "@/lib/supabase/server": { createServerSupabaseClient: async () => ({ auth: {
        signInWithPassword: async () => { signIns++; return { error: null }; },
        getUser: async () => ({ data: { user: { id: userId, app_metadata: { role } } } }),
        signOut: async () => { signOuts++; },
      } }) },
    });
    const form = new FormData();
    form.set("next", "/admin/leadkwaliteit/review");
    await assert.rejects((actions.signInAction as (form: FormData) => Promise<void>)(form),
      role === "admin" ? /REDIRECT:\/admin\/leadkwaliteit\/review/ : role === "professional" ? /REDIRECT:\/vakman$/ : /REDIRECT:\/login\?error=/);
    assert.equal(signIns, 1);
    assert.equal(signOuts, role === null ? 1 : 0);
    await assert.rejects((actions.signOutAction as () => Promise<void>)(), /REDIRECT:\/$/);
    assert.equal(signOuts, role === null ? 2 : 1);
  }
});
test("proxy denies every admin route before rendering, including details, spoofed cookies/URL/state and POST", async () => {
  const routes = ["/admin", "/admin/analytics", "/admin/experimenten", "/admin/experimenten/id", "/admin/leadkwaliteit",
    "/admin/leadkwaliteit/review", "/admin/leadkwaliteit/review/id", "/admin/leads/id", "/admin/vakmannen/id",
    "/admin/seo/lokaal/id/preview"];
  for (const user of [null, { id: userId, app_metadata: { role: "professional" } }, { id: userId, app_metadata: { role: "admin" } }]) {
    const response = () => ({ cookies: { getAll: () => [{ name: "refreshed-session", value: "test" }], set: () => {} } });
    const copiedCookies: unknown[] = [];
    const middleware = load("lib/supabase/middleware.ts", {
      "@supabase/ssr": { createServerClient: () => ({ auth: { getUser: async () => ({ data: { user }, error: null }) } }) },
      "next/server": { NextResponse: {
        next: response,
        redirect: (url: URL) => ({ url: url.href, cookies: { set: (cookie: unknown) => copiedCookies.push(cookie) } }),
      } },
    }, { NEXT_PUBLIC_SUPABASE_URL: "https://example.com", NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-public", NODE_ENV: "production" });
    for (const path of routes) {
      const result = await (middleware.updateSession as (request: unknown) => Promise<{ url?: string }>)({
        url: `https://example.com${path}?isAdmin=true`, method: "POST",
        nextUrl: new URL(`https://example.com${path}?isAdmin=true`),
        cookies: { getAll: () => [{ name: "isAdmin", value: "true" }], set: () => {} },
        localStorage: { role: "admin" }, state: { role: "admin" },
      });
      assert.equal(Boolean(result.url), user?.app_metadata.role !== "admin");
      if (result.url) assert.equal(new URL(result.url).pathname, "/login");
    }
    if (user?.app_metadata.role !== "admin") assert.equal(copiedCookies.length, routes.length);
  }
});
type AdminCommand = (args: string[], env: Record<string, string>, factory: unknown, output: (message: string) => void) => Promise<void>;
function cliHarness(role: unknown = "professional", failure?: "get" | "update" | "audit") {
  const user = { id: userId, app_metadata: { role, provider: "email", preserved: true } as Record<string, unknown> };
  const updates: unknown[] = [];
  const logs: string[] = [];
  const run = load("scripts/admin-access.mjs", { "@supabase/supabase-js": { createClient: () => {} } }).runAdminCommand as AdminCommand;
  const client = () => ({
    from: () => ({ select: () => ({ limit: async () => ({ error: failure === "audit" ? new Error("sensitive-token") : null }) }) }),
    auth: { admin: {
    getUserById: async () => failure === "get" ? { data: {}, error: { message: "sensitive-token" } } : { data: { user }, error: null },
    updateUserById: async (_id: string, attributes: { app_metadata: typeof user.app_metadata }) => {
      updates.push(attributes);
      if (failure === "update") return { data: {}, error: { message: "sensitive-token" } };
      user.app_metadata = attributes.app_metadata;
      if (user.app_metadata.role === null) delete user.app_metadata.role;
      return { data: { user }, error: null };
    },
  } } });
  return {
    run: (args: string[], env: Record<string, string> = { NEXT_PUBLIC_SUPABASE_URL: "https://example.com", SUPABASE_SERVICE_ROLE_KEY: "test-only-placeholder" }) =>
      run(args, env, client, (message) => logs.push(message)),
    updates, logs, user,
  };
}
test("CLI grant/revoke are UUID-only, idempotent, preserve metadata and never delete accounts", async () => {
  const h = cliHarness();
  await h.run(["grant", userId]);
  await h.run(["grant", userId]);
  assert.equal(h.updates.length, 1);
  assert.equal(h.user.app_metadata.role, "admin");
  assert.equal(h.user.app_metadata.preserved, true);
  await h.run(["check", userId]);
  assert.ok(h.logs.includes("user exists: yes; admin: yes"));
  await h.run(["revoke", userId]);
  await h.run(["revoke", userId]);
  assert.equal(h.updates.length, 2);
  assert.equal(h.user.app_metadata.role, undefined);
  await h.run(["check", userId]);
  assert.ok(h.logs.includes("user exists: yes; admin: no"));
  assert.ok(h.logs.every((line) => !/test-only-placeholder|sensitive-token|provider|email/.test(line)));
});
test("CLI rejects invalid/unknown users, credentials arguments, missing config and unsafe URL; errors are sanitized", async () => {
  for (const args of [["grant"], ["grant", "email@example.com"], ["grant", "';drop table users"], ["grant", userId, "password"], ["signup", userId]]) {
    await assert.rejects(cliHarness().run(args), /precies één user UUID/);
  }
  await assert.rejects(cliHarness().run(["grant", userId], {}), /zijn vereist/);
  for (const url of ["http://remote.example.com", "ftp://example.com", "invalid"]) {
    await assert.rejects(cliHarness().run(["grant", userId], { NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: "test-only-placeholder" }));
  }
  for (const failure of ["get", "update", "audit"] as const) {
    const h = cliHarness("professional", failure);
    await assert.rejects(h.run(["grant", userId]), (error: Error) => !error.message.includes("sensitive-token") && error.message.includes("Adminbeheer mislukt"));
    assert.equal(h.logs.length, 0);
    if (failure !== "update") assert.equal(h.updates.length, 0);
  }
  assert.throws(() => execFileSync(process.execPath, ["scripts/admin-access.mjs", "grant", "invalid"], {
    cwd: new URL("..", import.meta.url), stdio: "pipe",
  }), /Command failed/);
});
test("admin action rejects forged form role/actor and only calls RPC after authoritative authorization", async () => {
  for (const allowed of [false, true]) {
    const calls: unknown[] = [];
    const action = load("lib/leads/review-actions.ts", {
      "@/lib/auth/helpers": { requireAdminUser: async () => {
        if (!allowed) throw new Error("Geen toegang");
        return { id: userId };
      } },
      "@/lib/leads/review-taxonomy": {
        reviewUuidSchema: { safeParse: () => ({ success: true }) },
        reviewMutationSchema: { safeParse: () => ({ success: true, data: {
          leadId: userId, expectedUpdatedAt: null, status: "open", resolution: null, note: null,
        } }) },
      },
      "@/lib/supabase/server": { createServerSupabaseClient: async () => ({
        rpc: async (name: string, args: unknown) => { calls.push({ name, args }); return { data: userId, error: null }; },
      }) },
      "next/cache": { revalidatePath: () => {} },
      "next/navigation": { redirect: () => { throw new Error("REDIRECT"); } },
    }).updateLeadQualityReviewAction as (form: FormData) => Promise<void>;
    const form = new FormData();
    form.set("role", "admin"); form.set("isAdmin", "true"); form.set("actor", "forged");
    await assert.rejects(action(form), allowed ? /REDIRECT/ : /Geen toegang/);
    assert.equal(calls.length, allowed ? 1 : 0);
    assert.ok(!JSON.stringify(calls).includes("forged"));
  }
});
test("service-role tooling has no client imports or NEXT_PUBLIC service-key configuration", () => {
  const inspect = (dir: string) => {
    for (const entry of readdirSync(new URL(`../${dir}`, import.meta.url), { withFileTypes: true })) {
      const path = `${dir}/${entry.name}`;
      if (entry.isDirectory()) inspect(path);
      else if (/\.[jt]sx?$/.test(path)) {
        const text = source(path);
        assert.doesNotMatch(text, /NEXT_PUBLIC_\w*SERVICE_ROLE/);
        if (/^["']use client["']/m.test(text)) assert.doesNotMatch(text, /SUPABASE_SERVICE_ROLE_KEY|supabase\/admin|scripts\/admin-access/);
      }
    }
  };
  inspect("app"); inspect("components"); inspect("lib");
  assert.match(source("lib/supabase/admin.ts"), /import "server-only"/);
});
