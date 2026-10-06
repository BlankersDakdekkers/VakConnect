import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test, { after, type TestContext } from "node:test";

const root = resolve(import.meta.dirname, "..");
const migrationDir = join(root, "supabase/migrations");
const migrations = readdirSync(migrationDir).filter((name) => name.endsWith(".sql")).sort();
const forwardName = "20261006100000_prompt29c_data_api_grants.sql";
const allocatedOfferPolicy = "session updates only allocated distribution offers";
const pgBin = "/usr/lib/postgresql/16/bin";
type Role = "postgres" | "anon" | "authenticated" | "service_role";
type Context = { role: Role; uid?: string; jwtRole?: string; requestRole?: string };
const service: Context = { role: "service_role" };
const anon: Context = { role: "anon" };
const quote = (value: string) => `'${value.replaceAll("'", "''")}'`;

function exec(command: string, args: string[]) {
  return execFileSync(command, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: 16 * 1024 * 1024,
  }).trim();
}

function startHarness() {
  if (!["initdb", "pg_ctl", "createdb", "dropdb", "psql"].every((name) => existsSync(join(pgBin, name)))) return null;
  assert.ok(migrations.includes(forwardName), "The forward grant migration must be present");
  const base = mkdtempSync(join(tmpdir(), "vakconnect-pg-p29c-"));
  const data = join(base, "data");
  const socket = join(base, "socket");
  const port = String(17600 + Math.floor(Math.random() * 1000));
  mkdirSync(socket);
  exec(join(pgBin, "initdb"), ["-D", data, "-A", "trust", "-U", "postgres"]);
  exec(join(pgBin, "pg_ctl"), ["-D", data, "-l", join(base, "postgres.log"), "-o", `-F -k ${socket} -p ${port} -h 127.0.0.1`, "-w", "start"]);
  let stopped = false;
  const cleanup = () => {
    if (stopped) return;
    stopped = true;
    try {
      exec(join(pgBin, "pg_ctl"), ["-D", data, "-m", "fast", "-w", "stop"]);
    } finally {
      rmSync(base, { recursive: true, force: true });
    }
  };
  process.once("exit", cleanup);
  const args = (db: string) => ["-h", "127.0.0.1", "-p", port, "-U", "postgres", "-d", db, "-X", "-q", "-A", "-t", "-v", "ON_ERROR_STOP=1"];
  const run = (db: string, sql: string, context: Context = { role: "postgres" }) => exec(join(pgBin, "psql"), [
    ...args(db), "-c", `set role ${context.role};
      select set_config('app.current_user_id', ${quote(context.uid ?? "")}, false),
             set_config('app.current_role', ${quote(context.requestRole ?? (context.role === "postgres" ? "anon" : context.role))}, false),
             set_config('app.current_jwt', ${quote(JSON.stringify(context.jwtRole ? { app_metadata: { role: context.jwtRole } } : {}))}, false);
      ${sql}`,
  ]).split("\n").slice(1).join("\n").trim();
  const file = (db: string, name: string) => exec(join(pgBin, "psql"), [...args(db), "-f", join(migrationDir, name)]);
  const json = <T>(db: string, sql: string, context?: Context) =>
    JSON.parse(run(db, `select coalesce(json_agg(q), '[]'::json) from (${sql}) q`, context)) as T[];
  const denied = (db: string, sql: string, context: Context, pattern = /permission denied/) => {
    let output = "";
    try {
      run(db, sql, context);
    } catch (error) {
      output = String((error as { stderr?: string }).stderr ?? error);
    }
    assert.match(output, pattern, `${context.role}: ${sql}`);
  };
  const create = (name: string, template?: string) => {
    exec(join(pgBin, "createdb"), ["-h", "127.0.0.1", "-p", port, "-U", "postgres", ...(template ? ["-T", template] : []), name]);
  };
  try {
    create("p29c_before");
    run("p29c_before", `
      create role anon nologin;
      create role authenticated nologin;
      create role service_role nologin bypassrls;
      create role supabase_storage_admin nologin;
      create schema auth;
      create table auth.users (id uuid primary key, email text, raw_app_meta_data jsonb not null default '{}');
      create function auth.uid() returns uuid language sql stable as $$
        select nullif(current_setting('app.current_user_id', true), '')::uuid
      $$;
      create function auth.role() returns text language sql stable as $$
        select coalesce(nullif(current_setting('app.current_role', true), ''), 'anon')
      $$;
      create function auth.jwt() returns jsonb language sql stable as $$
        select coalesce(nullif(current_setting('app.current_jwt', true), '')::jsonb, '{}'::jsonb)
      $$;
      grant usage on schema auth, public to anon, authenticated, service_role;
      create schema storage authorization supabase_storage_admin;
      create table storage.buckets (id text primary key, name text not null, public boolean not null default false,
        file_size_limit bigint, allowed_mime_types text[]);
      create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text not null,
        name text not null, owner uuid, metadata jsonb not null default '{}');
      alter table storage.buckets owner to supabase_storage_admin;
      alter table storage.objects owner to supabase_storage_admin;
      alter table storage.buckets enable row level security;
      alter table storage.objects enable row level security;
      -- Local postgres must be superuser to install storage policies. This cannot fully
      -- emulate hosted migration ownership; reject managed-table ALTER explicitly.
      create function auth.reject_managed_storage_alter() returns event_trigger language plpgsql as $$
      begin
        if exists (select 1 from pg_event_trigger_ddl_commands()
          where command_tag = 'ALTER TABLE' and object_identity in ('storage.objects', 'storage.buckets')) then
          raise exception 'MANAGED_STORAGE_ALTER_FORBIDDEN';
        end if;
      end $$;
      create event trigger reject_managed_storage_alter on ddl_command_end
        when tag in ('ALTER TABLE') execute function auth.reject_managed_storage_alter();
    `);
    denied("p29c_before", "alter table storage.objects enable row level security", { role: "postgres" }, /MANAGED_STORAGE_ALTER_FORBIDDEN/);
    for (const name of migrations.filter((name) => name < forwardName)) file("p29c_before", name);
    create("p29c_full", "p29c_before");
    for (const name of migrations.filter((name) => name >= forwardName)) file("p29c_full", name);
  } catch (error) {
    cleanup();
    throw error;
  }
  return { run, file, json, denied, create, cleanup };
}

type Harness = NonNullable<ReturnType<typeof startHarness>>;
let harness: ReturnType<typeof startHarness> | undefined;
after(() => harness?.cleanup());
function database(t: TestContext, before = false) {
  harness ??= startHarness();
  if (!harness) {
    t.skip("PostgreSQL 16 binaries unavailable");
    return null;
  }
  const db = `p29c_${randomUUID().replaceAll("-", "")}`;
  harness.create(db, before ? "p29c_before" : "p29c_full");
  return { h: harness, db };
}

function fixture(h: Harness, db: string) {
  const adminId = randomUUID();
  const users = [randomUUID(), randomUUID()];
  const professionals = [randomUUID(), randomUUID()];
  const leads = [randomUUID(), randomUUID()];
  const assignments = [randomUUID(), randomUUID()];
  const documents = [randomUUID(), randomUUID()];
  const runs = [randomUUID(), randomUUID()];
  const serviceId = h.run(db, "select id from public.services where slug = 'dakdekker'");
  const admin: Context = { role: "authenticated", uid: adminId, jwtRole: "admin" };
  const contexts: Context[] = users.map((uid) => ({ role: "authenticated", uid, jwtRole: "professional" }));
  h.run(db, `
    insert into auth.users (id, email, raw_app_meta_data) values (${quote(adminId)}, 'admin@example.invalid', '{"role":"admin"}');
    ${users.map((id, i) => `
      insert into auth.users (id, email) values (${quote(id)}, 'user-${i}@example.invalid');
      insert into public.professionals (id, auth_user_id, company_name, contact_name, email, phone, status, verification_status)
        values (${quote(professionals[i])}, ${quote(id)}, 'Company ${i}', 'Person ${i}', 'company-${i}@example.invalid', '0612345678', 'active', 'verified');
      insert into public.professional_services (professional_id, service_id) values (${quote(professionals[i])}, ${quote(serviceId)});
      insert into public.professional_service_areas (professional_id, postal_code_prefix) values (${quote(professionals[i])}, '1234');
      insert into public.professional_distribution_settings (professional_id) values (${quote(professionals[i])});
      insert into public.professional_notification_preferences (professional_id) values (${quote(professionals[i])});
      insert into public.leads (id, service_id, first_name, last_name, email, phone, postal_code, house_number, description,
        status, commercial_type, max_buyers, sales_status, lead_score, source, utm_source, utm_medium)
        values (${quote(leads[i])}, ${quote(serviceId)}, 'First', 'Last', 'lead-${i}@example.invalid', '0612345678',
          '1234AB', '10', 'A sufficiently detailed roof repair description for grants testing.',
          'matched', 'shared', 3, 'available', 88, 'website', 'grant-test', 'organic');
      insert into public.lead_matches (lead_id, professional_id, match_score) values (${quote(leads[i])}, ${quote(professionals[i])}, 92);
      insert into public.lead_images (lead_id, storage_path, mime_type, file_size)
        values (${quote(leads[i])}, ${quote(`leads/${leads[i]}/photo.jpg`)}, 'image/jpeg', 100);
      insert into public.lead_answers (lead_id, question_id, answer_text)
        select ${quote(leads[i])}, id, 'Fixture answer' from public.service_questions where service_id = ${quote(serviceId)} limit 1;
      insert into public.lead_assignments (id, lead_id, professional_id)
        values (${quote(assignments[i])}, ${quote(leads[i])}, ${quote(professionals[i])});
      insert into public.lead_distribution_runs (id, lead_id, commercial_type, status)
        values (${quote(runs[i])}, ${quote(leads[i])}, 'shared', 'active');
      insert into public.lead_distribution_candidates (distribution_run_id, lead_id, professional_id, rank_position, status, offer_expires_at)
        values (${quote(runs[i])}, ${quote(leads[i])}, ${quote(professionals[i])}, 1, 'offered', now() + interval '1 day');
      insert into public.professional_documents (id, professional_id, document_type, storage_path, original_filename, mime_type, file_size)
        values (${quote(documents[i])}, ${quote(professionals[i])}, 'kvk_extract',
          ${quote(`professionals/${professionals[i]}/documents/${documents[i]}/proof.pdf`)}, 'proof.pdf', 'application/pdf', 100);
      insert into public.professional_review_feedback (professional_id, section, message)
        values (${quote(professionals[i])}, 'company', 'Test review feedback');
    `).join("\n")}
  `);
  return { admin, adminId, contexts, users, professionals, leads, assignments, documents, serviceId };
}

const adminList = `select l.id, l.public_reference, l.status, l.urgency, l.postal_code, l.city,
  l.created_at, l.first_name, l.last_name, l.lead_score,
  json_build_object('name', s.name, 'slug', s.slug) as service
  from public.leads l left join public.services s on s.id = l.service_id
  order by l.created_at desc limit 100`;
const attribution = "select source, utm_source, utm_medium from public.leads";
const countQueries = [
  "select count(id) from public.leads where created_at >= current_date",
  "select count(id) from public.leads where created_at >= now() - interval '7 days'",
  "select count(id) from public.leads where status = 'new'",
  "select count(id) from public.leads where status = 'qualified'",
  "select count(id) from public.lead_assignments",
  "select count(id) from public.lead_assignments where status = 'accepted'",
  "select count(id) from public.lead_assignments where progress_status = 'won'",
  "select count(id) from public.professionals where status = 'active'",
  "select count(id) from public.lead_assignments where status = 'rejected'",
  "select count(id) from public.lead_assignments where progress_status = 'lost'",
];

test("Prompt29C every migration avoids ownership-sensitive managed storage ALTER", () => {
  assert.ok(migrations.includes(forwardName));
  for (const name of migrations) {
    const sql = readFileSync(join(migrationDir, name), "utf8").replace(/--[^\n]*|\/\*[\s\S]*?\*\//g, "");
    assert.doesNotMatch(sql, /\balter\s+table\s+(?:if\s+exists\s+)?(?:"storage"|storage)\s*\.\s*(?:"objects"|"buckets"|objects|buckets)\b/i, name);
  }
});

test("Prompt29C forward grants reproduce and repair the exact admin list, attribution and counts without default grants", (t) => {
  const isolated = database(t, true);
  if (!isolated) return;
  const { h, db } = isolated;
  assert.equal(h.run(db, "select rolbypassrls from pg_roles where rolname = 'service_role'"), "t");
  assert.equal(h.run(db, "select has_schema_privilege('service_role', 'public', 'usage')"), "t");
  assert.equal(h.run(db, "select has_table_privilege('service_role', 'public.leads', 'select')"), "f");
  for (const query of [adminList, attribution, ...countQueries]) h.denied(db, query, service);
  const authorizationDefinitions = () => h.run(db, `select json_build_object(
    'policies', (select json_agg(p order by schemaname, tablename, policyname) from pg_policies p
      where policyname <> ${quote(allocatedOfferPolicy)}),
    'functions', (select json_agg(f order by signature) from (
      select p.oid::regprocedure::text as signature, p.prosrc, p.prosecdef, p.proconfig
      from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public') f))`);
  const originalDefinitions = authorizationDefinitions();
  h.file(db, forwardName);
  assert.equal(authorizationDefinitions(), originalDefinitions, "Grant repair must not change existing policies or function bodies");
  assert.deepEqual(h.json<{ permissive: string; roles: string[]; cmd: string }>(db, `select permissive, roles, cmd
    from pg_policies where schemaname = 'public' and tablename = 'lead_distribution_candidates'
      and policyname = ${quote(allocatedOfferPolicy)}`), [{ permissive: "RESTRICTIVE", roles: ["authenticated"], cmd: "UPDATE" }]);
  assert.deepEqual(h.json(db, adminList, service), []);
  assert.deepEqual(h.json(db, attribution, service), []);
  for (const query of countQueries) assert.equal(h.run(db, query, service), "0");
  fixture(h, db);
  assert.equal(h.json(db, adminList, service).length, 2);
  assert.deepEqual(h.json<{ source: string; utm_source: string; utm_medium: string }>(db, attribution, service),
    Array.from({ length: 2 }, () => ({ source: "website", utm_source: "grant-test", utm_medium: "organic" })));
  assert.equal(h.run(db, countQueries[0], service), "2");
  assert.equal(h.run(db, countQueries[4], service), "2");
  assert.equal(h.run(db, countQueries[7], service), "2");
  for (const query of countQueries) assert.match(h.run(db, query, service), /^\d+$/);
  const snapshot = () => h.run(db, `select json_build_object(
    'policies', (select json_agg(p order by schemaname, tablename, policyname) from pg_policies p),
    'leads', (select json_agg(l order by id) from public.leads l),
    'professionals', (select json_agg(p order by id) from public.professionals p),
    'events', (select json_agg(e order by id) from public.professional_notification_events e),
    'storage', (select json_agg(b order by id) from storage.buckets b))`);
  const before = snapshot();
  h.file(db, forwardName);
  assert.equal(snapshot(), before, "Reapplication must preserve data and RLS policies");
  assert.equal(h.run(db, "select count(*) from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname in ('public','storage') and c.relkind = 'r' and not c.relrowsecurity"), "0");
  assert.equal(h.run(db, "select pg_get_userbyid(relowner) from pg_class where oid = 'storage.objects'::regclass"), "supabase_storage_admin");
  assert.equal(h.run(db, "select count(*) from storage.buckets where public"), "0");
  h.denied(db, "alter table storage.objects enable row level security", { role: "postgres" }, /MANAGED_STORAGE_ALTER_FORBIDDEN/);
  const populated = database(t, true)!;
  fixture(populated.h, populated.db);
  const existingData = populated.h.run(populated.db, `select json_build_object(
    'leads', (select json_agg(l order by id) from public.leads l),
    'documents', (select json_agg(d order by id) from public.professional_documents d),
    'policies', (select json_agg(p order by schemaname, tablename, policyname) from pg_policies p
      where policyname <> ${quote(allocatedOfferPolicy)}))`);
  populated.h.denied(populated.db, adminList, service);
  populated.h.file(populated.db, forwardName);
  assert.equal(populated.h.run(populated.db, `select json_build_object(
    'leads', (select json_agg(l order by id) from public.leads l),
    'documents', (select json_agg(d order by id) from public.professional_documents d),
    'policies', (select json_agg(p order by schemaname, tablename, policyname) from pg_policies p
      where policyname <> ${quote(allocatedOfferPolicy)}))`), existingData);
  assert.equal(populated.h.json(populated.db, adminList, service).length, 2);
});

test("Prompt29C table and column ACLs match the complete least-privilege role matrix, including legacy grants", (t) => {
  const isolated = database(t);
  if (!isolated) return;
  const { h, db } = isolated;
  const tables = [
    "admin_role_audit", "analytics_events", "commercial_audit_log", "contact_submissions",
    "experiment_assignments", "experiment_audit_log", "experiment_variants", "experiments",
    "lead_activity", "lead_answers", "lead_assignments", "lead_distribution_candidates", "lead_distribution_runs",
    "lead_images", "lead_matches", "lead_pricing_rules", "lead_purchases", "lead_quality_review_events",
    "lead_quality_reviews", "leads", "operational_settings", "operational_worker_runs", "professional_audit_log",
    "professional_distribution_settings", "professional_document_requirements", "professional_documents",
    "professional_notification_events", "professional_notification_preferences", "professional_review_feedback",
    "professional_service_areas", "professional_services", "professional_wallets", "professionals",
    "seo_audit_log", "seo_local_pages", "seo_locations", "service_question_options", "service_questions",
    "services", "wallet_transactions",
  ];
  const publicReads = ["services", "service_questions", "service_question_options"];
  const matrix: Record<Exclude<Role, "postgres">, Partial<Record<string, string[]>>> = {
    anon: { SELECT: publicReads },
    authenticated: {
      SELECT: [...publicReads, "professionals", "professional_services", "professional_service_areas",
        "professional_distribution_settings", "professional_documents", "professional_document_requirements",
        "professional_review_feedback", "professional_audit_log", "lead_assignments", "leads", "lead_images",
        "lead_answers", "lead_activity", "lead_distribution_candidates", "professional_wallets", "wallet_transactions",
        "lead_purchases", "lead_pricing_rules", "professional_notification_events", "professional_notification_preferences",
        "operational_settings", "operational_worker_runs", "experiments", "experiment_variants", "experiment_assignments",
        "experiment_audit_log", "lead_quality_reviews", "lead_quality_review_events", "admin_role_audit"],
      INSERT: ["professional_services", "professional_distribution_settings", "professional_documents",
        "lead_pricing_rules", "professional_notification_preferences", "professional_service_areas", "commercial_audit_log"],
      UPDATE: ["professionals", "lead_assignments", "lead_distribution_candidates", "leads", "professional_services",
        "professional_distribution_settings", "professional_documents", "lead_pricing_rules",
        "professional_notification_preferences", "professional_service_areas"],
      DELETE: ["professional_service_areas"],
    },
    service_role: {
      SELECT: tables.filter((name) => !["lead_quality_reviews", "lead_quality_review_events", "seo_audit_log"].includes(name)),
      INSERT: ["leads", "professionals", "services", "service_questions", "service_question_options",
        "professional_services", "analytics_events", "contact_submissions", "seo_locations", "seo_local_pages",
        "professional_distribution_settings", "lead_distribution_runs", "lead_distribution_candidates",
        "professional_notification_events", "operational_worker_runs", "experiment_assignments",
        "professional_service_areas", "lead_answers", "lead_images", "lead_assignments", "lead_activity",
        "seo_audit_log", "professional_review_feedback", "lead_matches"],
      UPDATE: ["leads", "professionals", "services", "service_questions", "service_question_options",
        "professional_services", "analytics_events", "contact_submissions", "seo_locations", "seo_local_pages",
        "professional_distribution_settings", "lead_distribution_runs", "lead_distribution_candidates",
        "professional_notification_events", "operational_worker_runs", "experiment_assignments", "professional_documents"],
      DELETE: ["leads", "professionals", "lead_matches"],
    },
  };
  const verify = () => {
    const schemas = h.json<{ role: string; usage: boolean; create: boolean }>(db, `select r.role,
      has_schema_privilege(r.role, 'public', 'USAGE') as usage,
      has_schema_privilege(r.role, 'public', 'CREATE') as create
      from (values ('anon'),('authenticated'),('service_role')) r(role)`);
    assert.equal(schemas.length, 3);
    for (const row of schemas) assert.deepEqual([row.usage, row.create], [true, false], `${row.role} public schema privileges`);
    assert.deepEqual(h.json(db, `select c.relname, r.role from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      cross join (values ('anon'),('authenticated'),('service_role')) r(role)
      where n.nspname = 'public' and c.relkind = 'S'
        and has_sequence_privilege(r.role, c.oid, 'USAGE,SELECT,UPDATE')`), []);
    assert.deepEqual(h.json<{ name: string }>(db, `select c.relname as name from pg_class c
      join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relkind = 'r' order by c.relname`).map((r) => r.name), tables);
    const rows = h.json<{ role: Exclude<Role, "postgres">; name: string; privilege: string; allowed: boolean; columns: string[] }>(db, `
      select r.role, c.relname as name, p.privilege,
        has_table_privilege(r.role, c.oid, p.privilege) as allowed,
        case when p.privilege in ('SELECT','INSERT','UPDATE','REFERENCES') then
          array(select a.attname::text from pg_attribute a where a.attrelid = c.oid and a.attnum > 0 and not a.attisdropped
            and has_column_privilege(r.role, c.oid, a.attnum, p.privilege) order by a.attname)
          else array[]::text[] end as columns
      from pg_class c join pg_namespace n on n.oid = c.relnamespace
      cross join (values ('anon'),('authenticated'),('service_role')) r(role)
      cross join (values ('SELECT'),('INSERT'),('UPDATE'),('DELETE'),('TRUNCATE'),('REFERENCES'),('TRIGGER')) p(privilege)
      where n.nspname = 'public' and c.relkind = 'r'`);
    assert.equal(rows.length, tables.length * 3 * 7);
    for (const row of rows) {
      const allowed = matrix[row.role][row.privilege]?.includes(row.name) ?? false;
      assert.equal(row.allowed, allowed, `${row.role} ${row.privilege} ${row.name}`);
      if (!allowed) {
        assert.deepEqual(row.columns, row.role === "authenticated" && row.name === "professional_notification_events" && row.privilege === "UPDATE" ? ["read_at"] : [],
          `${row.role} ${row.privilege} column grants on ${row.name}`);
      }
    }
  };
  verify();
  h.run(db, "grant all on all tables in schema public to public, anon, authenticated, service_role");
  h.file(db, forwardName);
  verify();
  h.file(db, forwardName);
  verify();
  h.run(db, "create table public.future_acl_probe (id uuid primary key); alter table public.future_acl_probe enable row level security");
  for (const context of [anon, service, { role: "authenticated" as const }]) h.denied(db, "select * from public.future_acl_probe", context);
});

test("Prompt29C RPC ACLs are exact and every trigger/internal definer helper denies direct execution", (t) => {
  const isolated = database(t);
  if (!isolated) return;
  const { h, db } = isolated;
  const both = ["authenticated", "service_role"];
  const functions: Array<[string, string[]]> = [
    ["is_admin()", ["anon", ...both]],
    ["current_professional_id()", both],
    ["can_professional_view_lead_contact(uuid,uuid)", both],
    ["generate_lead_public_reference()", ["service_role"]],
    ["analytics_metadata_is_safe(jsonb)", ["service_role"]],
    ["is_valid_lead_progress_transition(lead_progress_status,lead_progress_status)", both],
    ["professional_document_storage_path_is_owned(text,uuid)", both],
    ["professional_document_record_path_is_owned(text,uuid,uuid)", both],
    ["transition_own_professional_onboarding(professional_onboarding_step,boolean)", both],
    ["delete_own_pending_professional_document(uuid)", both],
    ["get_wallet_reconciliation(uuid)", both],
    ["apply_wallet_transaction(uuid,wallet_transaction_type,integer,uuid,uuid,text,text,jsonb)", ["authenticated"]],
    ["purchase_lead(uuid,text)", ["authenticated"]],
    ["refund_lead_purchase(uuid,text)", ["authenticated"]],
    ["update_assignment_quality(uuid,timestamptz,text,text,text,text,text,text)", ["authenticated"]],
    ["admin_lead_quality_queue(integer,text,text,uuid,text,text,boolean,text,text,integer)", ["authenticated"]],
    ["admin_lead_quality_detail(uuid)", ["authenticated"]],
    ["admin_update_lead_quality_review(uuid,timestamptz,text,text,text)", ["authenticated"]],
    ["refresh_lead_sales_state(uuid)", ["service_role"]],
    ["claim_expired_distribution_candidates(integer)", ["service_role"]],
    ["activate_lead_distribution_run(uuid,integer,integer,integer)", ["service_role"]],
    ["claim_pending_notification_events(integer)", ["service_role"]],
    ["claim_expired_professional_documents(integer)", ["service_role"]],
    ["transition_experiment_status(uuid,text,uuid)", ["service_role"]],
    ["append_commercial_audit_log(uuid,uuid,text,uuid,text,jsonb)", []],
    ["ensure_professional_wallet(uuid)", []],
    ["resolve_lead_price(uuid)", []],
    ["append_professional_audit_log(uuid,uuid,professional_audit_event_type,jsonb)", []],
    ["enqueue_professional_notification(uuid,professional_notification_event_type,jsonb)", []],
    ["admin_lead_quality_items(integer,uuid)", []],
  ];
  const verify = () => {
    const rows = h.json<{ signature: string; role: string; allowed: boolean }>(db, `
      select f.signature, r.role, has_function_privilege(r.role, 'public.' || f.signature, 'EXECUTE') as allowed
      from (values ${functions.map(([signature]) => `(${quote(signature)})`).join(",")}) f(signature)
      cross join (values ('anon'), ('authenticated'), ('service_role')) r(role)`);
    for (const row of rows) assert.equal(row.allowed, functions.find(([signature]) => signature === row.signature)![1].includes(row.role), `${row.role} EXECUTE ${row.signature}`);
    const triggers = h.json<{ signature: string; role: string; allowed: boolean }>(db, `
      select p.oid::regprocedure::text as signature, r.role, has_function_privilege(r.role, p.oid, 'EXECUTE') as allowed
      from pg_proc p join pg_namespace n on n.oid = p.pronamespace
      cross join (values ('anon'), ('authenticated'), ('service_role')) r(role)
      where n.nspname = 'public' and p.prorettype = 'trigger'::regtype`);
    assert.ok(triggers.length > 30);
    for (const row of triggers) assert.equal(row.allowed, false, `${row.role} trigger helper ${row.signature}`);
  };
  verify();
  h.run(db, `grant execute on function ${functions.map(([signature]) => `public.${signature}`).join(",")} to public, anon, authenticated, service_role;
    do $$ declare fn regprocedure; begin
      for fn in select p.oid::regprocedure from pg_proc p join pg_namespace n on n.oid = p.pronamespace
        where n.nspname = 'public' and p.prorettype = 'trigger'::regtype loop
        execute format('grant execute on function %s to public, anon, authenticated, service_role', fn);
      end loop;
    end $$`);
  h.file(db, forwardName);
  verify();
});

test("Prompt29C selective service writes execute actual intake defaults, CHECK helpers and notification triggers", (t) => {
  const isolated = database(t);
  if (!isolated) return;
  const { h, db } = isolated;
  const f = fixture(h, db);
  const lead = h.run(db, `insert into public.leads
    (service_id, first_name, last_name, email, phone, postal_code, house_number, description)
    values (${quote(f.serviceId)}, 'Service', 'Intake', 'intake@example.invalid', '0612345678',
      '1234AB', '10', 'A sufficiently detailed intake description using a real service context.')
    returning id`, service);
  assert.match(lead, /^[0-9a-f-]{36}$/);
  h.run(db, `insert into public.analytics_events (event_name, anonymous_session_id, lead_id, metadata)
    values ('page_view', 'grants-session-00000001', ${quote(lead)}, '{"schema_version":1}')`, service);
  h.run(db, `insert into public.lead_assignments (lead_id, professional_id)
    values (${quote(lead)}, ${quote(f.professionals[0])})`, service);
  assert.ok(Number(h.run(db, `select count(*) from public.professional_notification_events
    where lead_id = ${quote(lead)}`, service)) > 0);
  h.run(db, `update public.leads set city = 'Amsterdam' where id = ${quote(lead)}`, service);
  assert.equal(h.run(db, `select city from public.leads where id = ${quote(lead)}`, service), "Amsterdam");
  h.run(db, `delete from public.leads where id = ${quote(lead)}`, service);
  assert.equal(h.run(db, `select count(*) from public.leads where id = ${quote(lead)}`, service), "0");
  h.denied(db, "delete from public.admin_role_audit", service);
  h.denied(db, "delete from public.professional_notification_events", service);
});

test("Prompt29C candidate UPDATE cannot self-allocate queued offers or unlock a purchase", (t) => {
  const isolated = database(t);
  if (!isolated) return;
  const { h, db } = isolated;
  const f = fixture(h, db);
  h.run(db, `select * from public.apply_wallet_transaction(${quote(f.professionals[0])}, 'admin_credit', 10000,
    null, null, 'queued-seed', 'Test credit', '{}')`, f.admin);
  h.run(db, `update public.lead_distribution_candidates set status = 'queued', offered_at = null, offer_expires_at = null
    where professional_id = ${quote(f.professionals[0])}`);
  for (const status of ["offered", "viewed", "declined", "purchased"]) {
    assert.equal(h.run(db, `with updated as (update public.lead_distribution_candidates
      set status = ${quote(status)} where professional_id = ${quote(f.professionals[0])}
      returning id) select count(*) from updated`, f.contexts[0]), "0");
  }
  assert.equal(h.run(db, "select status from public.lead_distribution_candidates", f.contexts[0]), "queued");
  h.denied(db, `select * from public.purchase_lead(${quote(f.leads[0])}, 'queued-purchase')`,
    f.contexts[0], /LEAD_OFFER_NOT_ACTIVE/);
  assert.equal(h.run(db, "select count(*) from public.lead_purchases", service), "0");
  assert.equal(h.run(db, `select cached_balance from public.professional_wallets
    where professional_id = ${quote(f.professionals[0])}`, f.contexts[0]), "10000");
  assert.equal(h.run(db, `with updated as (update public.lead_distribution_candidates
    set status = 'offered', offered_at = now(), offer_expires_at = now() + interval '1 day'
    where professional_id = ${quote(f.professionals[0])} returning id) select count(*) from updated`, f.admin), "1");
  h.run(db, `select * from public.purchase_lead(${quote(f.leads[0])}, 'allocated-purchase')`, f.contexts[0]);
  assert.equal(h.run(db, "select count(*) from public.lead_purchases", service), "1");
  assert.equal(h.run(db, `with updated as (update public.lead_distribution_candidates
    set status = 'declined', decline_reason = 'Niet beschikbaar'
    where professional_id = ${quote(f.professionals[1])} returning id) select count(*) from updated`, f.contexts[1]), "1");
  h.run(db, `update public.lead_distribution_candidates set status = 'offered', declined_at = null, decline_reason = null
    where professional_id = ${quote(f.professionals[1])}`, service);
  assert.equal(h.run(db, `with updated as (update public.lead_distribution_candidates set status = 'viewed'
    where professional_id = ${quote(f.professionals[1])} returning id) select count(*) from updated`, f.contexts[1]), "1");
  assert.equal(h.run(db, `with updated as (update public.lead_distribution_candidates
    set status = 'declined', decline_reason = 'Niet beschikbaar'
    where professional_id = ${quote(f.professionals[1])} returning id) select count(*) from updated`, f.contexts[1]), "1");
  assert.equal(h.run(db, `with updated as (update public.lead_distribution_candidates set status = 'queued'
    where professional_id = ${quote(f.professionals[1])} returning id) select count(*) from updated`, service), "1");
});

test("Prompt29C authenticated profiles, documents, notifications, assignments and offers remain owner isolated", (t) => {
  const isolated = database(t);
  if (!isolated) return;
  const { h, db } = isolated;
  const f = fixture(h, db);
  for (const [index, context] of f.contexts.entries()) {
    assert.equal(h.run(db, "select id from public.professionals", context), f.professionals[index]);
    for (const table of ["professional_services", "professional_service_areas", "professional_distribution_settings",
      "professional_documents", "professional_review_feedback", "professional_audit_log", "professional_notification_events",
      "professional_notification_preferences", "lead_assignments", "lead_distribution_candidates"]) {
      assert.equal(h.run(db, `select count(*) from public.${table} where professional_id <> ${quote(f.professionals[index])}`, context), "0", table);
      assert.ok(Number(h.run(db, `select count(*) from public.${table}`, context)) > 0, table);
    }
    const other = 1 - index;
    assert.equal(h.run(db, `with updated as (update public.professionals set website = 'https://example.invalid' where id = ${quote(f.professionals[other])} returning id) select count(*) from updated`, context), "0");
    assert.equal(h.run(db, `with updated as (update public.professional_notification_preferences set in_app_enabled = false where professional_id = ${quote(f.professionals[other])} returning professional_id) select count(*) from updated`, context), "0");
    assert.equal(h.run(db, `with updated as (update public.lead_assignments set status = 'viewed' where id = ${quote(f.assignments[other])} returning id) select count(*) from updated`, context), "0");
    h.run(db, `update public.professionals set website = 'https://example.invalid' where id = ${quote(f.professionals[index])}`, context);
    h.run(db, `update public.professional_notification_preferences set in_app_enabled = false where professional_id = ${quote(f.professionals[index])}`, context);
    h.run(db, `update public.lead_assignments set status = 'viewed' where id = ${quote(f.assignments[index])}`, context);
    assert.equal(h.run(db, `with updated as (update public.lead_distribution_candidates set status = 'viewed'
      where professional_id = ${quote(f.professionals[other])} returning id) select count(*) from updated`, context), "0");
    assert.equal(h.run(db, `with updated as (update public.lead_distribution_candidates set status = 'viewed'
      where professional_id = ${quote(f.professionals[index])} returning id) select count(*) from updated`, context), "1");
    h.run(db, "update public.professional_notification_events set read_at = now()", context);
    h.run(db, `insert into public.professional_service_areas (professional_id, postal_code_prefix) values (${quote(f.professionals[index])}, '5678')`, context);
    h.run(db, `delete from public.professional_service_areas where professional_id = ${quote(f.professionals[index])} and postal_code_prefix = '5678'`, context);
    h.run(db, `update public.professional_services set active = false where professional_id = ${quote(f.professionals[index])}`, context);
    h.run(db, `update public.professional_distribution_settings set paused = true where professional_id = ${quote(f.professionals[index])}`, context);
    const newDocument = randomUUID();
    const insertDocument = (professionalId: string) => `insert into public.professional_documents
      (id, professional_id, document_type, storage_path, original_filename, mime_type, file_size)
      values (${quote(newDocument)}, ${quote(professionalId)}, 'other',
        ${quote(`professionals/${professionalId}/documents/${newDocument}/new.pdf`)}, 'new.pdf', 'application/pdf', 100)`;
    h.denied(db, insertDocument(f.professionals[other]), context, /row-level security/);
    h.run(db, insertDocument(f.professionals[index]), context);
    assert.equal(h.run(db, `with updated as (update public.professional_documents set original_filename = 'changed.pdf'
      where id = ${quote(f.documents[other])} returning id) select count(*) from updated`, context), "0");
    assert.equal(h.run(db, `with updated as (update public.professional_documents set verification_status = 'approved'
      where id = ${quote(newDocument)} returning id) select count(*) from updated`, context), "0");
    assert.equal(h.run(db, `select verification_status from public.professional_documents where id = ${quote(newDocument)}`, context), "pending");
    h.denied(db, `select public.delete_own_pending_professional_document(${quote(f.documents[other])})`, context, /DOCUMENT_NOT_FOUND/);
    h.denied(db, "update public.professional_notification_events set payload = '{}'", context);
    h.denied(db, `insert into public.professional_service_areas (professional_id, postal_code_prefix) values (${quote(f.professionals[other])}, '5678')`, context, /row-level security/);
    h.denied(db, `update public.professionals set verification_status = 'suspended' where id = ${quote(f.professionals[index])}`, context, /PROFESSIONAL_ADMIN_FIELDS_IMMUTABLE/);
    h.denied(db, `delete from public.professional_documents where id = ${quote(f.documents[index])}`, context);
    h.denied(db, "insert into public.lead_pricing_rules (lead_type, base_price_credits) values ('shared', 1)", context, /row-level security/);
    h.denied(db, `insert into public.commercial_audit_log (entity_type, entity_id, action)
      values ('lead', ${quote(f.leads[index])}, 'pricing_change')`, context, /row-level security/);
    h.run(db, `select * from public.delete_own_pending_professional_document(${quote(f.documents[index])})`, context);
    assert.equal(h.run(db, `select count(*) from public.professional_documents where id = ${quote(f.documents[index])}`, context), "0");
  }
  for (const table of ["professionals", "leads", "lead_assignments", "professional_documents", "professional_notification_events", "professional_wallets", "wallet_transactions"]) {
    h.denied(db, `select * from public.${table}`, anon);
  }
  for (const table of ["services", "service_questions", "service_question_options"]) {
    h.run(db, `select * from public.${table}`, anon);
    h.denied(db, `delete from public.${table}`, anon);
  }
});

test("Prompt29C live admin metadata, not stale JWT claims, controls admin reads and review RPCs; workers stay service-only", (t) => {
  const isolated = database(t);
  if (!isolated) return;
  const { h, db } = isolated;
  const f = fixture(h, db);
  h.run(db, `select * from public.apply_wallet_transaction(${quote(f.professionals[0])}, 'admin_credit', 10000,
    null, null, 'review-seed', 'Test credit', '{}')`, f.admin);
  const purchase = h.json<{ purchase_id: string }>(db,
    `select * from public.purchase_lead(${quote(f.leads[0])}, 'review-purchase')`, f.contexts[0])[0];
  h.run(db, `select * from public.refund_lead_purchase(${quote(purchase.purchase_id)}, 'Review signal')`, f.admin);
  const review = `select public.admin_update_lead_quality_review(${quote(f.leads[0])}, null, 'in_review', null, 'Review test')`;
  const detail = `select public.admin_lead_quality_detail(${quote(f.leads[0])})`;
  const queue = "select public.admin_lead_quality_queue()";
  h.run(db, review, f.admin);
  h.run(db, detail, f.admin);
  h.run(db, queue, f.admin);
  assert.equal(h.run(db, "select public.is_admin()", { ...f.admin, jwtRole: "professional" }), "t");
  assert.equal(h.run(db, "select count(*) from public.admin_role_audit", f.admin), "1");
  for (const context of [f.contexts[0], { ...f.contexts[0], jwtRole: "admin" }, { role: "authenticated" as const, jwtRole: "admin" }]) {
    assert.equal(h.run(db, "select public.is_admin()", context), "f");
    for (const query of [review, detail, queue]) h.denied(db, query, context, /QUALITY_REVIEW_NOT_AUTHORIZED/);
    for (const table of ["admin_role_audit", "lead_quality_reviews", "lead_quality_review_events", "operational_settings", "operational_worker_runs", "experiments", "experiment_audit_log"]) {
      assert.equal(h.run(db, `select count(*) from public.${table}`, context), "0", table);
    }
  }
  for (const query of [review, detail, queue]) {
    h.denied(db, query, service);
    h.denied(db, query, anon);
  }
  for (const query of ["select * from public.claim_pending_notification_events(1)",
    "select * from public.claim_expired_professional_documents(1)", "select * from public.claim_expired_distribution_candidates(1)"]) {
    h.run(db, query, service);
    h.denied(db, query, f.admin);
    h.denied(db, query, f.contexts[0]);
    h.denied(db, query, anon);
  }
  h.denied(db, `select * from public.activate_lead_distribution_run(${quote(randomUUID())})`, f.admin);
  h.run(db, `update auth.users set raw_app_meta_data = '{}' where id = ${quote(f.adminId)}`);
  assert.equal(h.run(db, "select public.is_admin()", f.admin), "f");
  assert.equal(h.run(db, "select count(*) from public.admin_role_audit", f.admin), "0");
  for (const query of [review, detail, queue]) h.denied(db, query, f.admin, /QUALITY_REVIEW_NOT_AUTHORIZED/);
  assert.equal(h.run(db, "select count(*) from public.admin_role_audit", service), "2");
});

test("Prompt29C granted contexts purchase idempotently and refund through RPCs but cannot mutate financial tables directly", (t) => {
  const isolated = database(t);
  if (!isolated) return;
  const { h, db } = isolated;
  const f = fixture(h, db);
  h.run(db, `select * from public.apply_wallet_transaction(${quote(f.professionals[0])}, 'admin_credit', 10000, null, null, 'seed-grants', 'Test credit', '{}')`, f.admin);
  const sql = `select * from public.purchase_lead(${quote(f.leads[0])}, 'grants-purchase')`;
  const purchase = h.json<{ purchase_id: string; price_credits: number }>(db, sql, f.contexts[0]);
  assert.equal(purchase.length, 1);
  assert.deepEqual(h.json(db, sql, f.contexts[0]), purchase);
  assert.equal(h.run(db, "select count(*) from public.lead_purchases", service), "1");
  assert.equal(h.run(db, "select count(*) from public.wallet_transactions where type = 'lead_purchase'"), "1");
  h.denied(db, "update public.wallet_transactions set amount = amount + 1", { role: "postgres" }, /immutable/);
  h.denied(db, "delete from public.wallet_transactions", { role: "postgres" }, /immutable/);
  assert.equal(h.run(db, "select count(*) from public.lead_purchases", f.contexts[1]), "0");
  assert.equal(h.run(db, "select count(*) from public.wallet_transactions", f.contexts[1]), "0");
  assert.equal(h.run(db, "select id from public.leads", f.contexts[0]), f.leads[0]);
  assert.equal(h.run(db, "select count(*) from public.leads", f.contexts[1]), "0");
  assert.equal(h.run(db, `with updated as (update public.leads set city = 'Changed' where id = ${quote(f.leads[0])} returning id)
    select count(*) from updated`, f.contexts[0]), "0");
  for (const table of ["lead_images", "lead_answers"]) {
    assert.equal(h.run(db, `select count(*) from public.${table}`, f.contexts[0]), "1", table);
    assert.equal(h.run(db, `select count(*) from public.${table}`, f.contexts[1]), "0", table);
  }
  const financialSnapshot = () => h.run(db, `select json_build_object(
    'wallets', (select json_agg(w order by id) from public.professional_wallets w),
    'ledger', (select json_agg(w order by id) from public.wallet_transactions w),
    'purchases', (select json_agg(p order by id) from public.lead_purchases p),
    'assignments', (select json_agg(a order by id) from public.lead_assignments a))`);
  const financialState = financialSnapshot();
  h.file(db, forwardName);
  assert.equal(financialSnapshot(), financialState);
  for (const context of [f.admin, f.contexts[0], service, anon]) {
    for (const table of ["professional_wallets", "wallet_transactions", "lead_purchases"]) {
      h.denied(db, `delete from public.${table}`, context);
      h.denied(db, `update public.${table} set id = id`, context);
      h.denied(db, `insert into public.${table} (id) values (${quote(randomUUID())})`, context);
    }
  }
  h.denied(db, `select * from public.refund_lead_purchase(${quote(purchase[0].purchase_id)}, 'Not authorized')`, f.contexts[0], /ADMIN_REQUIRED|UNAUTHORIZED/);
  h.run(db, `select * from public.refund_lead_purchase(${quote(purchase[0].purchase_id)}, 'Grant regression refund')`, f.admin);
  assert.equal(h.run(db, `select cached_balance from public.professional_wallets where professional_id = ${quote(f.professionals[0])}`, f.contexts[0]), "10000");
  assert.equal(h.run(db, "select status from public.lead_purchases", service), "refunded");
  assert.equal(h.run(db, "select count(*) from public.leads", f.contexts[0]), "0");
  h.run(db, "select * from public.get_wallet_reconciliation(null)", service);
});
