import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { randomUUID } from "node:crypto";

const repoRoot = "/home/runner/work/VakConnect/VakConnect";
const pgBinDir = "/usr/lib/postgresql/16/bin";
const initdbPath = join(pgBinDir, "initdb");
const pgCtlPath = join(pgBinDir, "pg_ctl");
const createdbPath = join(pgBinDir, "createdb");
const dropdbPath = join(pgBinDir, "dropdb");
const psqlPath = join(pgBinDir, "psql");
const migrationFiles = [
  "supabase/migrations/20260909124500_initial_vakconnect_schema.sql",
  "supabase/migrations/20260909133000_phase2_dynamic_intake.sql",
  "supabase/migrations/20260909152000_phase3_analytics_operations.sql",
  "supabase/migrations/20260909222000_phase5_commercial_lead_wallet.sql",
  "supabase/migrations/20260910160000_phase6_lead_distribution_engine.sql",
  "supabase/migrations/20261005150000_prompt27_marketplace_access_hardening.sql",
  "supabase/migrations/20261005170000_prompt28_lead_quality.sql",
  "supabase/migrations/20261005180000_prompt29_admin_quality_operations.sql",
].map((file) => join(repoRoot, file));

type AppRole = "admin" | "professional" | null;
type DatabaseRole = "postgres" | "authenticated" | "service_role";

type SessionContext = {
  appRole?: AppRole;
  dbRole?: DatabaseRole;
  requestRole?: "authenticated" | "service_role" | "anon";
  userId?: string | null;
};

type Harness = {
  adminContext: SessionContext;
  createDatabase: (name: string, legacy?: boolean) => string;
  dropDatabase: (name: string) => void;
  run: (database: string, sql: string, context?: SessionContext) => string;
  queryRowJson: <T>(database: string, selectSql: string, context?: SessionContext) => T;
  queryArrayJson: <T>(database: string, selectSql: string, context?: SessionContext) => T[];
  expectError: (database: string, sql: string, context?: SessionContext) => string;
  runConcurrent: (database: string, sql: string, context?: SessionContext) => Promise<{ ok: boolean; stdout: string; stderr: string }>;
};

type Fixture = {
  serviceId: string;
  leadId: string;
  professionalIds: string[];
  professionalContexts: SessionContext[];
};

let harnessPromise: Promise<Harness | null> | null = null;

function sqlLiteral(value: string) {
  return `'${value.replaceAll("'", "''")}'`;
}

function buildSessionPreamble(context: SessionContext = {}) {
  const dbRole = context.dbRole ?? "postgres";
  const requestRole = context.requestRole ?? (dbRole === "service_role" ? "service_role" : dbRole === "authenticated" ? "authenticated" : "anon");
  const jwt = context.appRole ? { app_metadata: { role: context.appRole } } : {};

  return [
    `set role ${dbRole};`,
    "do $$",
    "begin",
    `  perform set_config('app.current_role', ${sqlLiteral(requestRole)}, false);`,
    `  perform set_config('app.current_user_id', ${sqlLiteral(context.userId ?? "")}, false);`,
    `  perform set_config('app.current_jwt', ${sqlLiteral(JSON.stringify(jwt))}, false);`,
    "end $$;",
  ].join("\n");
}

function binaryAvailable() {
  return [initdbPath, pgCtlPath, createdbPath, dropdbPath, psqlPath].every((path) => existsSync(path));
}

function execProgram(command: string, args: string[], extraEnv?: Record<string, string>) {
  return execFileSync(command, args, {
    encoding: "utf8",
    env: { ...process.env, ...extraEnv },
    maxBuffer: 10 * 1024 * 1024,
  });
}

function startHarness(): Harness | null {
  if (!binaryAvailable()) {
    return null;
  }

  const baseDir = mkdtempSync(join(repoRoot, ".vakconnect-pg-"));
  const dataDir = join(baseDir, "data");
  const socketDir = join(baseDir, "socket");
  const logFile = join(baseDir, "postgres.log");
  const port = String(5600 + Math.floor(Math.random() * 1000));
  const adminContext: SessionContext = { dbRole: "authenticated", requestRole: "authenticated", appRole: "admin", userId: randomUUID() };
  const templateDb = "vakconnect_template";
  const legacyTemplateDb = "vakconnect_legacy_template";
  const env = { PATH: `${pgBinDir}:${process.env.PATH ?? ""}` };

  execProgram("mkdir", ["-p", socketDir], env);
  execProgram(initdbPath, ["-D", dataDir, "-A", "trust", "-U", "postgres"], env);
  execProgram(pgCtlPath, ["-D", dataDir, "-l", logFile, "-o", `-F -k ${socketDir} -p ${port}`, "-w", "start"], env);

  const connectionArgs = (database: string) => ["-h", "127.0.0.1", "-p", port, "-U", "postgres", "-d", database];
  const run = (database: string, sql: string, context?: SessionContext) => execProgram(psqlPath, [...connectionArgs(database), "-X", "-q", "-A", "-t", "-v", "ON_ERROR_STOP=1", "-c", `${buildSessionPreamble(context)}\n${sql}`], env).trim();
  const queryRowJson = <T>(database: string, selectSql: string, context?: SessionContext) => JSON.parse(run(database, `select row_to_json(result)::text from (${selectSql}) result;`, context)) as T;
  const queryArrayJson = <T>(database: string, selectSql: string, context?: SessionContext) => JSON.parse(run(database, `select coalesce(json_agg(result), '[]'::json)::text from (${selectSql}) result;`, context)) as T[];
  const expectError = (database: string, sql: string, context?: SessionContext) => {
    try {
      run(database, sql, context);
      assert.fail("Expected SQL command to fail");
    } catch (error) {
      const output = `${String((error as { stdout?: string }).stdout ?? "")}${String((error as { stderr?: string }).stderr ?? "")}`;
      return output;
    }
  };
  const runConcurrent = (database: string, sql: string, context?: SessionContext) => new Promise<{ ok: boolean; stdout: string; stderr: string }>((resolve) => {
    const child = spawn(psqlPath, [...connectionArgs(database), "-X", "-q", "-A", "-t", "-v", "ON_ERROR_STOP=1", "-c", `${buildSessionPreamble(context)}\n${sql}`], {
      env: { ...process.env, ...env },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += String(chunk);
    });
    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });
    child.on("close", (code) => resolve({ ok: code === 0, stdout: stdout.trim(), stderr: stderr.trim() }));
  });

  const bootstrapSql = `
    create role anon nologin;
    create role authenticated nologin;
    create role service_role nologin;
    create schema if not exists auth;
    create table if not exists auth.users (
      id uuid primary key,
      email text,
      raw_app_meta_data jsonb not null default '{}'::jsonb
    );
    create or replace function auth.uid()
    returns uuid
    language sql
    stable
    as $$
      select nullif(current_setting('app.current_user_id', true), '')::uuid;
    $$;
    create or replace function auth.role()
    returns text
    language sql
    stable
    as $$
      select coalesce(nullif(current_setting('app.current_role', true), ''), 'anon');
    $$;
    create or replace function auth.jwt()
    returns jsonb
    language sql
    stable
    as $$
      select coalesce(nullif(current_setting('app.current_jwt', true), '')::jsonb, '{}'::jsonb);
    $$;
    create schema if not exists storage;
    create table if not exists storage.buckets (
      id text primary key,
      name text not null,
      public boolean not null default false,
      file_size_limit bigint,
      allowed_mime_types text[]
    );
    create table if not exists storage.objects (
      id uuid primary key default gen_random_uuid(),
      bucket_id text not null,
      name text not null,
      owner uuid,
      metadata jsonb not null default '{}'::jsonb
    );
    grant usage on schema auth to anon, authenticated, service_role;
    grant execute on function auth.uid() to anon, authenticated, service_role;
    grant execute on function auth.role() to anon, authenticated, service_role;
    grant execute on function auth.jwt() to anon, authenticated, service_role;
    insert into auth.users (id, email)
    values (${sqlLiteral(adminContext.userId ?? randomUUID())}, 'template-admin@example.com')
    on conflict (id) do nothing;
  `;

  execProgram(createdbPath, ["-h", "127.0.0.1", "-p", port, "-U", "postgres", templateDb], env);
  execProgram(psqlPath, [...connectionArgs(templateDb), "-X", "-v", "ON_ERROR_STOP=1", "-c", bootstrapSql], env);
  for (const file of migrationFiles) {
    if (file.endsWith("20261005170000_prompt28_lead_quality.sql")) {
      execProgram(createdbPath, ["-h", "127.0.0.1", "-p", port, "-U", "postgres", "-T", templateDb, legacyTemplateDb], env);
    }
    execProgram(psqlPath, [...connectionArgs(templateDb), "-X", "-v", "ON_ERROR_STOP=1", "-f", file], env);
  }

  const cleanup = () => {
    try {
      execProgram(pgCtlPath, ["-D", dataDir, "-m", "fast", "stop"], env);
    } catch {
      // ignore cleanup failures
    }
    rmSync(baseDir, { recursive: true, force: true });
  };

  process.once("exit", cleanup);

  return {
    adminContext,
    createDatabase(name: string, legacy = false) {
      execProgram(createdbPath, ["-h", "127.0.0.1", "-p", port, "-U", "postgres", "-T", legacy ? legacyTemplateDb : templateDb, name], env);
      return name;
    },
    dropDatabase(name: string) {
      execProgram(dropdbPath, ["-h", "127.0.0.1", "-p", port, "-U", "postgres", "--if-exists", name], env);
    },
    run,
    queryRowJson,
    queryArrayJson,
    expectError,
    runConcurrent,
  };
}

async function getHarness(testContext: { skip: (message: string) => void }) {
  if (!harnessPromise) {
    harnessPromise = Promise.resolve(startHarness());
  }

  const harness = await harnessPromise;
  if (!harness) {
    testContext.skip("PostgreSQL test binaries are unavailable in this environment.");
    return null;
  }

  return harness;
}

function createDatabaseName(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

async function createIsolatedDatabase(testContext: { skip: (message: string) => void; after: (fn: () => void) => void }, prefix: string) {
  const harness = await getHarness(testContext);
  if (!harness) {
    return null;
  }

  const database = harness.createDatabase(createDatabaseName(prefix));
  testContext.after(() => {
    harness.dropDatabase(database);
  });
  return { harness, database };
}

function buildUserContext(userId: string, appRole: AppRole): SessionContext {
  return {
    dbRole: "authenticated",
    requestRole: "authenticated",
    appRole,
    userId,
  };
}

function insertFixture(harness: Harness, database: string, options: { commercialType: "exclusive" | "shared"; maxBuyers: number; balances: number[] }) {
  const serviceId = harness.run(database, "select id from public.services where slug = 'dakdekker' limit 1;");
  const leadId = randomUUID();
  const professionalIds = options.balances.map(() => randomUUID());
  const authUserIds = options.balances.map(() => randomUUID());

  harness.run(database, `
    ${authUserIds.map((userId, index) => `insert into auth.users (id, email) values (${sqlLiteral(userId)}, 'vakman-${index + 1}-${leadId}@example.com');`).join("\n")}
    ${professionalIds.map((professionalId, index) => `
      insert into public.professionals (
        id,
        auth_user_id,
        company_name,
        contact_name,
        email,
        phone,
        status,
        verification_status
      ) values (
        ${sqlLiteral(professionalId)},
        ${sqlLiteral(authUserIds[index])},
        'Bedrijf ${index + 1}',
        'Contact ${index + 1}',
        'company-${index + 1}-${leadId}@example.com',
        '06123456${String(index).padStart(2, "0")}',
        'active',
        'verified'
      );
      insert into public.professional_services (professional_id, service_id, active)
      values (${sqlLiteral(professionalId)}, ${sqlLiteral(serviceId)}, true);
      insert into public.professional_service_areas (professional_id, postal_code_prefix)
      values (${sqlLiteral(professionalId)}, '1234');
    `).join("\n")}
    insert into public.leads (
      id,
      public_reference,
      service_id,
      first_name,
      last_name,
      email,
      phone,
      postal_code,
      house_number,
      city,
      description,
      urgency,
      status,
      lead_score,
      commercial_type,
      max_buyers,
      buyers_count,
      sales_status,
      subservice_slug
    ) values (
      ${sqlLiteral(leadId)},
      'VC-${leadId.slice(0, 8).toUpperCase()}',
      ${sqlLiteral(serviceId)},
      'Jan',
      'Jansen',
      'lead-${leadId}@example.com',
      '0612345678',
      '1234AB',
      '10',
      'Amsterdam',
      'Er is sprake van een urgente daklekkage met duidelijke omschrijving voor de testflow.',
      'urgent',
      'matched',
      88,
      '${options.commercialType}',
      ${options.maxBuyers},
      0,
      'available',
      'daklekkage'
    );
    ${professionalIds.map((professionalId) => `
      insert into public.lead_matches (lead_id, professional_id, match_score)
      values (${sqlLiteral(leadId)}, ${sqlLiteral(professionalId)}, 92);
    `).join("\n")}
  `);

  for (const [index, balance] of options.balances.entries()) {
    if (balance <= 0) {
      continue;
    }

    harness.run(database, `
      select * from public.apply_wallet_transaction(
        ${sqlLiteral(professionalIds[index])},
        'admin_credit',
        ${balance},
        null,
        null,
        ${sqlLiteral(`seed-${leadId}-${index}`)},
        'Test credits',
        jsonb_build_object('seed', true)
      );
    `, harness.adminContext);
  }

  return {
    serviceId,
    leadId,
    professionalIds,
    professionalContexts: authUserIds.map((userId) => buildUserContext(userId, "professional")),
  } satisfies Fixture;
}

function qualityVersion(harness: Harness, database: string, assignmentId: string) {
  return harness.run(database, `select quality_updated_at from public.lead_assignments where id = ${sqlLiteral(assignmentId)};`);
}

function qualityRpc(assignmentId: string, version: string, values: {
      progress?: string; reachability?: string | null; appointment?: string; loss?: string | null;
      mismatch?: string | null; note?: string | null;
    } = {}) {
  const nullable = (value: string | null | undefined) => value == null ? "null" : sqlLiteral(value);
  return `select public.update_assignment_quality(
        ${sqlLiteral(assignmentId)}, ${sqlLiteral(version)}::timestamptz,
        ${sqlLiteral(values.progress ?? "contacted")}, ${nullable(values.reachability)},
        ${sqlLiteral(values.appointment ?? "not_scheduled")}, ${nullable(values.loss)},
        ${nullable(values.mismatch)}, ${nullable(values.note)}
      );`;
}

async function qualityFixture(t: Parameters<typeof createIsolatedDatabase>[0], count = 1) {
  const isolated = await createIsolatedDatabase(t, "prompt28_quality");
  if (!isolated) return null;
  const { harness, database } = isolated;
  harness.run(database, "grant usage on schema public to authenticated; grant select, insert, update, delete on all tables in schema public to authenticated;");
  const fixture = insertFixture(harness, database, {
    commercialType: "shared", maxBuyers: Math.max(count, 2), balances: Array(count).fill(100),
  });
  const assignmentIds = fixture.professionalContexts.map((context, index) => {
    harness.run(database, `select * from public.purchase_lead(${sqlLiteral(fixture.leadId)}, 'quality-buy-${index}');`, context);
    return harness.run(database, `select id from public.lead_assignments
          where lead_id = ${sqlLiteral(fixture.leadId)} and professional_id = ${sqlLiteral(fixture.professionalIds[index])};`);
  });
  return { ...isolated, fixture, assignmentIds };
}

test("Prompt 28 assignment-owned timestamps and exact duplicate updates are idempotent", async (t) => {
  const state = await qualityFixture(t);
  if (!state) return;
  const { harness, database, fixture, assignmentIds: [id] } = state;
  const owner = fixture.professionalContexts[0];
  const walletBefore = harness.run(database, `select json_build_object(
        'wallets', (select json_agg(w) from public.professional_wallets w),
        'transactions', (select count(*) from public.wallet_transactions),
        'purchases', (select count(*) from public.lead_purchases));`);
  const initial = qualityVersion(harness, database, id);
  harness.run(database, qualityRpc(id, initial, { reachability: "no_answer" }), owner);
  const first = harness.queryRowJson<{ contacted_at: string; reached_at: null; quality_updated_by: string; quality_updated_at: string }>(
    database, `select contacted_at, reached_at, quality_updated_by, quality_updated_at from public.lead_assignments where id = ${sqlLiteral(id)}`);
  assert.ok(first.contacted_at);
  assert.equal(first.reached_at, null);
  assert.equal(first.quality_updated_by, owner.userId);
  assert.notEqual(qualityVersion(harness, database, id), initial);
  const firstVersion = qualityVersion(harness, database, id);
  const activityCount = harness.run(database, `select count(*) from public.lead_activity;`);
  harness.run(database, qualityRpc(id, firstVersion, { reachability: "no_answer" }), owner);
  assert.equal(qualityVersion(harness, database, id), firstVersion);
  assert.equal(harness.run(database, `select count(*) from public.lead_activity;`), activityCount);
  harness.run(database, qualityRpc(id, firstVersion, { reachability: "reached" }), owner);
  const reached = harness.run(database, `select reached_at from public.lead_assignments where id = ${sqlLiteral(id)};`);
  harness.run(database, qualityRpc(id, qualityVersion(harness, database, id), {
    progress: "appointment_scheduled", reachability: "reached", appointment: "scheduled",
  }), owner);
  const scheduled = harness.run(database, `select appointment_scheduled_at from public.lead_assignments where id = ${sqlLiteral(id)};`);
  harness.run(database, qualityRpc(id, qualityVersion(harness, database, id), {
    progress: "quote_sent", reachability: "reached", appointment: "completed",
  }), owner);
  harness.run(database, qualityRpc(id, qualityVersion(harness, database, id), {
    progress: "won", reachability: "reached", appointment: "completed",
  }), owner);
  const timestamps = harness.queryRowJson<{ contacted_at: string; reached_at: string; appointment_scheduled_at: string; outcome_at: string }>(
    database, `select contacted_at, reached_at, appointment_scheduled_at, outcome_at from public.lead_assignments where id = ${sqlLiteral(id)}`);
  assert.equal(timestamps.contacted_at, first.contacted_at);
  assert.equal(harness.run(database, `select reached_at from public.lead_assignments where id = ${sqlLiteral(id)};`), reached);
  assert.equal(harness.run(database, `select appointment_scheduled_at from public.lead_assignments where id = ${sqlLiteral(id)};`), scheduled);
  assert.ok(timestamps.outcome_at);
  harness.run(database, qualityRpc(id, qualityVersion(harness, database, id), {
    progress: "won", reachability: "reached", appointment: "completed",
  }), owner);
  assert.match(harness.expectError(database, qualityRpc(id, qualityVersion(harness, database, id), {
    progress: "won", reachability: "reached", appointment: "cancelled",
  }), owner), /QUALITY_TERMINAL/);
  assert.equal(harness.run(database, `select json_build_object(
        'wallets', (select json_agg(w) from public.professional_wallets w),
        'transactions', (select count(*) from public.wallet_transactions),
        'purchases', (select count(*) from public.lead_purchases));`), walletBefore);
});

test("Prompt 28 shared outcomes and all professional activity reads stay isolated", async (t) => {
  const state = await qualityFixture(t, 2);
  if (!state) return;
  const { harness, database, fixture, assignmentIds: [first, second] } = state;
  const [one, two] = fixture.professionalContexts;
  for (const [id, context] of [[first, one], [second, two]] as const) {
    harness.run(database, qualityRpc(id, qualityVersion(harness, database, id)), context);
  }
  harness.run(database, qualityRpc(first, qualityVersion(harness, database, first), {
    progress: "lost", loss: "wrong_region", mismatch: "wrong_region",
  }), one);
  for (const [progress, appointment] of [
    ["appointment_scheduled", "scheduled"], ["quote_sent", "completed"], ["won", "completed"],
  ]) harness.run(database, qualityRpc(second, qualityVersion(harness, database, second), {
    progress, reachability: "reached", appointment,
  }), two);
  assert.equal(harness.run(database, `select progress_status from public.lead_assignments where id = ${sqlLiteral(first)};`), "lost");
  assert.equal(harness.run(database, `select progress_status from public.lead_assignments where id = ${sqlLiteral(second)};`), "won");
  assert.equal(harness.run(database, `select status from public.leads where id = ${sqlLiteral(fixture.leadId)};`), "accepted");
  assert.equal(harness.run(database, `select count(*) from public.lead_assignments where id = ${sqlLiteral(second)};`, one), "0");
  assert.equal(harness.run(database, `select count(*) from public.lead_activity where professional_id <> ${sqlLiteral(fixture.professionalIds[0])} or professional_id is null;`, one), "0");
  assert.equal(harness.run(database, `select count(*) from public.lead_activity where professional_id <> ${sqlLiteral(fixture.professionalIds[1])} or professional_id is null;`, two), "0");
  assert.match(harness.expectError(database, qualityRpc(second, qualityVersion(harness, database, second)), one), /QUALITY_NOT_AUTHORIZED/);
  harness.run(database, `update public.lead_assignments set mismatch_reason = 'duplicate' where id = ${sqlLiteral(second)};`, one);
  assert.equal(harness.run(database, `select mismatch_reason is null from public.lead_assignments where id = ${sqlLiteral(second)};`), "t");
});

test("Prompt 28 stale RPC, invalid enums, note limits and contradictions fail atomically", async (t) => {
  const state = await qualityFixture(t);
  if (!state) return;
  const { harness, database, fixture, assignmentIds: [id] } = state;
  const owner = fixture.professionalContexts[0];
  const initial = qualityVersion(harness, database, id);
  assert.match(harness.expectError(database, qualityRpc(id, initial, { progress: "won", reachability: "reached" }), owner), /QUALITY_INVALID_PROGRESS/);
  assert.match(harness.expectError(database, qualityRpc(id, initial, { progress: "lost", loss: "duplicate" }), owner), /QUALITY_INVALID_PROGRESS/);
  harness.run(database, qualityRpc(id, initial, { reachability: "no_answer" }), owner);
  const version = qualityVersion(harness, database, id);
  assert.match(harness.expectError(database, qualityRpc(id, initial), owner), /QUALITY_STALE_WRITE/);
  assert.match(harness.expectError(database, qualityRpc(id, version).replace(`${sqlLiteral(version)}::timestamptz`, "null"), owner), /QUALITY_STALE_WRITE/);
  for (const values of [
    { reachability: "unknown" }, { appointment: "unknown" }, { mismatch: "unknown" },
    { progress: "unknown" }, { progress: "lost", loss: "other" },
    { mismatch: "other", note: "x".repeat(501) }, { note: "text" },
    { loss: "prijs" },
    { appointment: "scheduled", reachability: "no_answer" },
    { appointment: "completed", reachability: "invalid_email" },
    { progress: "appointment_scheduled", reachability: "reached" },
  ]) assert.ok(harness.expectError(database, qualityRpc(id, version, values), owner).includes("ERROR:"));
  assert.equal(qualityVersion(harness, database, id), version);
  harness.run(database, qualityRpc(id, version, { mismatch: "other", note: "x".repeat(500) }), owner);
  const activity = harness.queryRowJson<{ metadata: Record<string, unknown>; actor_user_id: string; professional_id: string }>(
    database, `select metadata, actor_user_id, professional_id from public.lead_activity where metadata->>'source' = 'assignment_quality' order by created_at desc limit 1`);
  assert.equal(activity.actor_user_id, owner.userId);
  assert.equal(activity.professional_id, fixture.professionalIds[0]);
  assert.equal(activity.metadata.mismatch_reason, "other");
  assert.equal(JSON.stringify(activity.metadata).includes("x".repeat(50)), false);
  assert.equal(Object.hasOwn(activity.metadata, "feedback_note"), false);
});

test("Prompt 28 direct writes cannot forge timestamps, actors or audit events even as admin", async (t) => {
  const state = await qualityFixture(t, 2);
  if (!state) return;
  const { harness, database, fixture, assignmentIds: [id] } = state;
  const owner = fixture.professionalContexts[0];
  assert.match(harness.expectError(database, `insert into public.lead_assignments
        (lead_id, professional_id, reached_at) values
        (${sqlLiteral(fixture.leadId)}, ${sqlLiteral(fixture.professionalIds[0])}, '2001-01-01');`,
  harness.adminContext), /QUALITY_INSERT_FORBIDDEN/);
  for (const context of [owner, harness.adminContext]) {
    for (const column of ["contacted_at", "reached_at", "appointment_scheduled_at", "outcome_at", "quality_updated_at"]) {
      assert.match(harness.expectError(database, `update public.lead_assignments set ${column} = '2001-01-01' where id = ${sqlLiteral(id)};`, context), /QUALITY_SERVER_FIELDS_IMMUTABLE/);
    }
    assert.match(harness.expectError(database, `update public.lead_assignments set quality_updated_by = ${sqlLiteral(fixture.professionalContexts[1].userId!)} where id = ${sqlLiteral(id)};`, context), /QUALITY_SERVER_FIELDS_IMMUTABLE/);
    assert.match(harness.expectError(database, `insert into public.lead_activity (lead_id, professional_id, actor_user_id, activity_type, metadata)
          values (${sqlLiteral(fixture.leadId)}, ${sqlLiteral(fixture.professionalIds[0])}, ${sqlLiteral(owner.userId!)}, 'progress_updated',
          '{"source":"assignment_quality"}');`, context), /QUALITY_AUDIT_TRIGGER_ONLY/);
  }
  assert.match(harness.expectError(database, `update public.lead_assignments set mismatch_reason = 'other' where id = ${sqlLiteral(id)};`), /QUALITY_NOT_AUTHORIZED/);
  harness.run(database, `update public.lead_assignments set progress_status = 'contacted', reachability = 'no_answer' where id = ${sqlLiteral(id)};`, owner);
  harness.run(database, `update public.lead_assignments set mismatch_reason = 'wrong_service' where id = ${sqlLiteral(id)};`, harness.adminContext);
  assert.equal(harness.run(database, `select quality_updated_by from public.lead_assignments where id = ${sqlLiteral(id)};`), harness.adminContext.userId);
  assert.match(harness.expectError(database, `update public.lead_activity set actor_user_id = ${sqlLiteral(owner.userId!)} where metadata->>'source' = 'assignment_quality';`, harness.adminContext), /QUALITY_AUDIT_IMMUTABLE/);
  assert.match(harness.expectError(database, `delete from public.lead_activity where metadata->>'source' = 'assignment_quality';`, harness.adminContext), /QUALITY_AUDIT_IMMUTABLE/);
  assert.match(harness.expectError(database, `update public.lead_assignments set reachability = 'unknown' where id = ${sqlLiteral(id)};`, owner), /assignment_reachability_values/);
  assert.match(harness.expectError(database, `update public.lead_assignments set feedback_note = 'text', mismatch_reason = null where id = ${sqlLiteral(id)};`, owner), /assignment_feedback_note/);
  assert.equal(harness.run(database, `select has_function_privilege('anon', 'public.update_assignment_quality(uuid,timestamptz,text,text,text,text,text,text)', 'EXECUTE');`), "f");
  assert.equal(harness.run(database, `select has_function_privilege('authenticated', 'public.audit_assignment_quality()', 'EXECUTE');`), "f");
});

test("Prompt 28 early loss remains terminal while financial refunds still work", async (t) => {
  const state = await qualityFixture(t);
  if (!state) return;
  const { harness, database, fixture, assignmentIds: [id] } = state;
  const owner = fixture.professionalContexts[0];
  harness.run(database, qualityRpc(id, qualityVersion(harness, database, id)), owner);
  harness.run(database, qualityRpc(id, qualityVersion(harness, database, id), {
    progress: "lost", loss: "anders", note: "Klant annuleerde",
  }), owner);
  for (const sql of [
    qualityRpc(id, qualityVersion(harness, database, id)),
    `update public.lead_assignments set loss_reason = 'prijs' where id = ${sqlLiteral(id)};`,
    `update public.lead_assignments set feedback_note = 'Aangepast' where id = ${sqlLiteral(id)};`,
  ]) assert.match(harness.expectError(database, sql, owner), /QUALITY_TERMINAL/);
  const version = qualityVersion(harness, database, id);
  const purchaseId = harness.run(database, `select id from public.lead_purchases where lead_assignment_id = ${sqlLiteral(id)};`);
  harness.run(database, `select * from public.refund_lead_purchase(${sqlLiteral(purchaseId)}, 'Kwaliteitstest');`, harness.adminContext);
  assert.equal(qualityVersion(harness, database, id), version);
  assert.equal(harness.run(database, `select progress_status from public.lead_assignments where id = ${sqlLiteral(id)};`), "lost");
  harness.run(database, `update public.lead_assignments set status = 'rejected', accepted_at = null, rejected_at = now() where id = ${sqlLiteral(id)};`, harness.adminContext);
  assert.equal(harness.run(database, `select progress_status from public.lead_assignments where id = ${sqlLiteral(id)};`), "lost");
  assert.match(harness.expectError(database, qualityRpc(id, version, { progress: "lost", loss: "anders", note: "Klant annuleerde" }), owner), /QUALITY_ASSIGNMENT_NOT_ACCEPTED/);
});

test("Prompt 28 refunded nonterminal assignments cannot edit quality through direct or RPC paths", async (t) => {
  const state = await qualityFixture(t);
  if (!state) return;
  const { harness, database, fixture, assignmentIds: [id] } = state;
  const owner = fixture.professionalContexts[0];
  harness.run(database, qualityRpc(id, qualityVersion(harness, database, id)), owner);
  const purchaseId = harness.run(database, `select id from public.lead_purchases where lead_assignment_id = ${sqlLiteral(id)};`);
  harness.run(database, `select * from public.refund_lead_purchase(${sqlLiteral(purchaseId)}, 'Kwaliteitstest');`, harness.adminContext);
  assert.match(harness.expectError(database, qualityRpc(id, qualityVersion(harness, database, id), { mismatch: "duplicate" }), owner), /QUALITY_ACCESS_REVOKED/);
  assert.match(harness.expectError(database, `update public.lead_assignments set mismatch_reason = 'duplicate' where id = ${sqlLiteral(id)};`, owner), /QUALITY_ACCESS_REVOKED/);
  assert.equal(harness.run(database, `select count(*) from public.lead_activity where metadata->>'source' = 'assignment_quality';`, owner), "0");
});

test("Prompt 28 pending assignments can reject with structured mismatch, not progress changes", async (t) => {
  const isolated = await createIsolatedDatabase(t, "prompt28_reject");
  if (!isolated) return;
  const { harness, database } = isolated;
  harness.run(database, "grant usage on schema public to authenticated; grant select, insert, update on all tables in schema public to authenticated;");
  const fixture = insertFixture(harness, database, { commercialType: "shared", maxBuyers: 2, balances: [0, 0] });
  const ids = [randomUUID(), randomUUID()];
  for (const [index, id] of ids.entries()) harness.run(database, `insert into public.lead_assignments (id, lead_id, professional_id)
        values (${sqlLiteral(id)}, ${sqlLiteral(fixture.leadId)}, ${sqlLiteral(fixture.professionalIds[index])});`, harness.adminContext);
  const owner = fixture.professionalContexts[0];
  assert.match(harness.expectError(database, `update public.lead_assignments set mismatch_reason = 'wrong_service' where id = ${sqlLiteral(ids[0])};`, owner), /QUALITY_ASSIGNMENT_NOT_ACCEPTED/);
  assert.match(harness.expectError(database, `update public.lead_assignments set status = 'rejected', rejected_at = now(), mismatch_reason = 'other', feedback_note = repeat('x',501) where id = ${sqlLiteral(ids[0])};`, owner), /assignment_feedback_note/);
  harness.run(database, `update public.lead_assignments set status = 'rejected', rejected_at = now(), mismatch_reason = 'other', feedback_note = 'Verkeerde klus'
        where id = ${sqlLiteral(ids[0])};`, owner);
  assert.equal(harness.run(database, `select progress_status from public.lead_assignments where id = ${sqlLiteral(ids[0])};`), "new");
  assert.equal(harness.run(database, `select quality_updated_by from public.lead_assignments where id = ${sqlLiteral(ids[0])};`), owner.userId);
  assert.equal(harness.run(database, `select contacted_at is null and outcome_at is null from public.lead_assignments where id = ${sqlLiteral(ids[0])};`), "t");
  assert.match(harness.expectError(database, `update public.lead_assignments set progress_status = 'contacted', mismatch_reason = 'wrong_region'
        where id = ${sqlLiteral(ids[1])};`, fixture.professionalContexts[1]), /QUALITY_ASSIGNMENT_NOT_ACCEPTED/);
});

test("Prompt 28 concurrent RPC updates require a fresh version after the row lock", async (t) => {
  const state = await qualityFixture(t);
  if (!state) return;
  const { harness, database, fixture, assignmentIds: [id] } = state;
  const version = qualityVersion(harness, database, id);
  const results = await Promise.all([
    harness.runConcurrent(database, qualityRpc(id, version, { reachability: "no_answer" }), fixture.professionalContexts[0]),
    harness.runConcurrent(database, qualityRpc(id, version, { reachability: "reached" }), fixture.professionalContexts[0]),
  ]);
  assert.equal(results.filter((result) => result.ok).length, 1);
  assert.match(results.find((result) => !result.ok)!.stderr, /QUALITY_STALE_WRITE/);
  assert.equal(harness.run(database, `select count(*) from public.lead_activity where metadata->>'source' = 'assignment_quality';`), "1");
});

test("Prompt 28 logical loss after scheduling preserves first appointment timestamp", async (t) => {
  const state = await qualityFixture(t);
  if (!state) return;
  const { harness, database, fixture, assignmentIds: [id] } = state;
  const owner = fixture.professionalContexts[0];
  harness.run(database, qualityRpc(id, qualityVersion(harness, database, id), { reachability: "reached" }), owner);
  harness.run(database, qualityRpc(id, qualityVersion(harness, database, id), {
    progress: "appointment_scheduled", reachability: "reached", appointment: "scheduled",
  }), owner);
  const scheduled = harness.run(database, `select appointment_scheduled_at from public.lead_assignments where id = ${sqlLiteral(id)};`);
  harness.run(database, qualityRpc(id, qualityVersion(harness, database, id), {
    progress: "lost", reachability: "reached", appointment: "cancelled", loss: "already_completed",
  }), owner);
  assert.equal(harness.run(database, `select appointment_scheduled_at from public.lead_assignments where id = ${sqlLiteral(id)};`), scheduled);
  assert.equal(harness.run(database, `select outcome_at is not null from public.lead_assignments where id = ${sqlLiteral(id)};`), "t");
});

test("Prompt 28 migration does not infer historical milestones or block legacy refunds", async (t) => {
  const harness = await getHarness(t);
  if (!harness) return;
  const database = harness.createDatabase(createDatabaseName("prompt28_legacy"), true);
  t.after(() => harness.dropDatabase(database));
  harness.run(database, "grant usage on schema public to authenticated; grant select, insert, update on all tables in schema public to authenticated;");
  const fixture = insertFixture(harness, database, { commercialType: "shared", maxBuyers: 3, balances: [100, 100, 100] });
  const ids = fixture.professionalContexts.map((context, index) => {
    harness.run(database, `select * from public.purchase_lead(${sqlLiteral(fixture.leadId)}, 'legacy-quality-${index}');`, context);
    return harness.run(database, `select id from public.lead_assignments where professional_id = ${sqlLiteral(fixture.professionalIds[index])};`);
  });
  for (const [index, id] of ids.entries()) {
    harness.run(database, `update public.lead_assignments set progress_status = 'contacted' where id = ${sqlLiteral(id)};`);
    if (index >= 1) harness.run(database, `update public.lead_assignments set progress_status = 'appointment_scheduled' where id = ${sqlLiteral(id)};`);
    if (index === 2) {
      harness.run(database, `update public.lead_assignments set progress_status = 'quote_sent' where id = ${sqlLiteral(id)};`);
      harness.run(database, `update public.lead_assignments set progress_status = 'lost', loss_reason = 'Historische vrije verliesreden' where id = ${sqlLiteral(id)};`);
    }
  }
  harness.run(database, readFileSync(join(repoRoot, "supabase/migrations/20261005170000_prompt28_lead_quality.sql"), "utf8"));
  assert.equal(harness.run(database, `select count(*) from public.lead_assignments where contacted_at is not null
    or reached_at is not null or appointment_scheduled_at is not null or outcome_at is not null;`), "0");
  harness.run(database, qualityRpc(ids[0], qualityVersion(harness, database, ids[0]), {
    progress: "appointment_scheduled", reachability: "reached", appointment: "scheduled",
  }), fixture.professionalContexts[0]);
  assert.equal(harness.run(database, `select contacted_at is null and appointment_scheduled_at is not null
    from public.lead_assignments where id = ${sqlLiteral(ids[0])};`), "t");
  harness.run(database, qualityRpc(ids[1], qualityVersion(harness, database, ids[1]), {
    progress: "quote_sent", reachability: "reached", appointment: "completed",
  }), fixture.professionalContexts[1]);
  assert.equal(harness.run(database, `select contacted_at is null and appointment_scheduled_at is null
    from public.lead_assignments where id = ${sqlLiteral(ids[1])};`), "t");
  const legacyVersion = qualityVersion(harness, database, ids[2]);
  const purchase = harness.run(database, `select id from public.lead_purchases where lead_assignment_id = ${sqlLiteral(ids[2])};`);
  const balanceBeforeRefund = Number(harness.run(database, `select cached_balance from public.professional_wallets
    where professional_id = ${sqlLiteral(fixture.professionalIds[2])};`));
  const purchasePrice = Number(harness.run(database, `select price_credits from public.lead_purchases where id = ${sqlLiteral(purchase)};`));
  harness.run(database, `select * from public.refund_lead_purchase(${sqlLiteral(purchase)}, 'Historische kwaliteitscontrole');`, harness.adminContext);
  harness.run(database, `update public.lead_assignments set status = 'rejected', accepted_at = null,
    rejected_at = now() where id = ${sqlLiteral(ids[2])};`, harness.adminContext);
  assert.equal(harness.run(database, `select loss_reason from public.lead_assignments where id = ${sqlLiteral(ids[2])};`), "Historische vrije verliesreden");
  assert.equal(qualityVersion(harness, database, ids[2]), legacyVersion);
  assert.equal(harness.run(database, `select status from public.lead_purchases where id = ${sqlLiteral(purchase)};`), "refunded");
  const balanceAfterRefund = Number(harness.run(database, `select cached_balance from public.professional_wallets
    where professional_id = ${sqlLiteral(fixture.professionalIds[2])};`));
  assert.equal(balanceAfterRefund, balanceBeforeRefund + purchasePrice);
  assert.equal(balanceAfterRefund, 100);
  assert.equal(Number(harness.run(database, `select sum(amount) from public.wallet_transactions
    where professional_id = ${sqlLiteral(fixture.professionalIds[2])};`)), balanceAfterRefund);
  assert.equal(harness.run(database, `select count(*) from public.wallet_transactions where type = 'refund'
    and professional_id = ${sqlLiteral(fixture.professionalIds[2])} and lead_id = ${sqlLiteral(fixture.leadId)};`), "1");
});

test("Prompt 28 early loss accepts absent optional feedback without inventing a reason", async (t) => {
  const state = await qualityFixture(t);
  if (!state) return;
  const { harness, database, fixture, assignmentIds: [id] } = state;
  const owner = fixture.professionalContexts[0];
  harness.run(database, qualityRpc(id, qualityVersion(harness, database, id)), owner);
  harness.run(database, qualityRpc(id, qualityVersion(harness, database, id), { progress: "lost" }), owner);
  assert.equal(harness.run(database, `select progress_status = 'lost' and loss_reason is null
    and mismatch_reason is null and feedback_note is null and outcome_at is not null
    from public.lead_assignments where id = ${sqlLiteral(id)};`), "t");
});

function insertSecondaryLead(harness: Harness, database: string, serviceId: string, professionalId: string) {
  const secondLeadId = randomUUID();
  harness.run(database, `
    insert into public.leads (
      id,
      public_reference,
      service_id,
      first_name,
      last_name,
      email,
      phone,
      postal_code,
      house_number,
      city,
      description,
      urgency,
      status,
      lead_score,
      commercial_type,
      max_buyers,
      buyers_count,
      sales_status,
      subservice_slug
    ) values (
      ${sqlLiteral(secondLeadId)},
      'VC-${secondLeadId.slice(0, 8).toUpperCase()}',
      ${sqlLiteral(serviceId)},
      'Piet',
      'Pieters',
      'lead-${secondLeadId}@example.com',
      '0687654321',
      '1234AB',
      '11',
      'Amsterdam',
      'Tweede commerciële lead om idempotency-conflicten veilig te testen.',
      'normal',
      'matched',
      77,
      'shared',
      3,
      0,
      'available',
      'daklekkage'
    );
    insert into public.lead_matches (lead_id, professional_id, match_score)
    values (${sqlLiteral(secondLeadId)}, ${sqlLiteral(professionalId)}, 85);
  `);
  return secondLeadId;
}

test("internal commercial helpers are not directly executable by authenticated professionals", { concurrency: false }, async (t) => {
  const isolated = await createIsolatedDatabase(t, "commerce_permissions");
  if (!isolated) {
    return;
  }

  const { harness, database } = isolated;
  const fixture = insertFixture(harness, database, { commercialType: "exclusive", maxBuyers: 1, balances: [25] });
  const professionalContext = fixture.professionalContexts[0];

  const refreshError = harness.expectError(database, `select * from public.refresh_lead_sales_state(${sqlLiteral(fixture.leadId)});`, professionalContext);
  assert.match(refreshError, /permission denied for function refresh_lead_sales_state/i);

  const auditError = harness.expectError(
    database,
    `select public.append_commercial_audit_log(auth.uid(), public.current_professional_id(), 'lead', ${sqlLiteral(fixture.leadId)}, 'pricing_change', '{}'::jsonb);`,
    professionalContext,
  );
  assert.match(auditError, /permission denied for function append_commercial_audit_log/i);

  const signError = harness.expectError(
    database,
    `select * from public.apply_wallet_transaction(${sqlLiteral(fixture.professionalIds[0])}, 'lead_purchase', 5, null, null, null, 'bad sign', '{}'::jsonb);`,
    harness.adminContext,
  );
  assert.match(signError, /INVALID_TRANSACTION_AMOUNT_SIGN/);
});

test("exclusive lead concurrency allows exactly one successful purchase", { concurrency: false }, async (t) => {
  const isolated = await createIsolatedDatabase(t, "commerce_exclusive");
  if (!isolated) {
    return;
  }

  const { harness, database } = isolated;
  const fixture = insertFixture(harness, database, { commercialType: "exclusive", maxBuyers: 1, balances: [60, 60] });
  const [first, second] = await Promise.all([
    harness.runConcurrent(database, `select row_to_json(result)::text from public.purchase_lead(${sqlLiteral(fixture.leadId)}, 'exclusive-a') as result;`, fixture.professionalContexts[0]),
    harness.runConcurrent(database, `select row_to_json(result)::text from public.purchase_lead(${sqlLiteral(fixture.leadId)}, 'exclusive-b') as result;`, fixture.professionalContexts[1]),
  ]);

  assert.equal([first.ok, second.ok].filter(Boolean).length, 1);
  assert.equal([first.ok, second.ok].filter((value) => !value).length, 1);
  const failed = first.ok ? second : first;
  assert.match(`${failed.stdout}\n${failed.stderr}`, /(LEAD_SOLD_OUT|LEAD_NOT_AVAILABLE)/);

  assert.equal(Number(harness.run(database, `select count(*) from public.lead_purchases where lead_id = ${sqlLiteral(fixture.leadId)} and status = 'purchased';`)), 1);
  assert.equal(Number(harness.run(database, `select count(*) from public.wallet_transactions where lead_id = ${sqlLiteral(fixture.leadId)} and type = 'lead_purchase';`)), 1);

  const leadState = harness.queryRowJson<{ buyers_count: number; sales_status: string }>(
    database,
    `select buyers_count, sales_status from public.leads where id = ${sqlLiteral(fixture.leadId)}`,
  );
  assert.equal(leadState.buyers_count, 1);
  assert.equal(leadState.sales_status, "sold_out");
});

test("shared leads never exceed the final available slot under concurrency", { concurrency: false }, async (t) => {
  const isolated = await createIsolatedDatabase(t, "commerce_shared");
  if (!isolated) {
    return;
  }

  const { harness, database } = isolated;
  const fixture = insertFixture(harness, database, { commercialType: "shared", maxBuyers: 2, balances: [60, 60, 60] });
  harness.run(database, `select * from public.purchase_lead(${sqlLiteral(fixture.leadId)}, 'shared-prime');`, fixture.professionalContexts[0]);

  const [first, second] = await Promise.all([
    harness.runConcurrent(database, `select row_to_json(result)::text from public.purchase_lead(${sqlLiteral(fixture.leadId)}, 'shared-slot-a') as result;`, fixture.professionalContexts[1]),
    harness.runConcurrent(database, `select row_to_json(result)::text from public.purchase_lead(${sqlLiteral(fixture.leadId)}, 'shared-slot-b') as result;`, fixture.professionalContexts[2]),
  ]);

  assert.equal([first.ok, second.ok].filter(Boolean).length, 1);
  const failed = first.ok ? second : first;
  assert.match(`${failed.stdout}\n${failed.stderr}`, /(LEAD_SOLD_OUT|LEAD_NOT_AVAILABLE)/);
  assert.equal(Number(harness.run(database, `select count(*) from public.lead_purchases where lead_id = ${sqlLiteral(fixture.leadId)} and status = 'purchased';`)), 2);

  const leadState = harness.queryRowJson<{ buyers_count: number; sales_status: string }>(
    database,
    `select buyers_count, sales_status from public.leads where id = ${sqlLiteral(fixture.leadId)}`,
  );
  assert.equal(leadState.buyers_count, 2);
  assert.equal(leadState.sales_status, "sold_out");
});

test("insufficient balance leaves wallet, purchase and assignment state untouched", { concurrency: false }, async (t) => {
  const isolated = await createIsolatedDatabase(t, "commerce_balance");
  if (!isolated) {
    return;
  }

  const { harness, database } = isolated;
  const fixture = insertFixture(harness, database, { commercialType: "exclusive", maxBuyers: 1, balances: [0] });

  const error = harness.expectError(database, `select * from public.purchase_lead(${sqlLiteral(fixture.leadId)}, 'insufficient-balance');`, fixture.professionalContexts[0]);
  assert.match(error, /INSUFFICIENT_BALANCE/);
  assert.equal(Number(harness.run(database, `select count(*) from public.wallet_transactions where professional_id = ${sqlLiteral(fixture.professionalIds[0])};`)), 0);
  assert.equal(Number(harness.run(database, `select count(*) from public.lead_purchases where lead_id = ${sqlLiteral(fixture.leadId)};`)), 0);
  assert.equal(Number(harness.run(database, `select count(*) from public.lead_assignments where lead_id = ${sqlLiteral(fixture.leadId)};`)), 0);
});

test("purchase transaction rolls back when a downstream failure occurs after debit logic", { concurrency: false }, async (t) => {
  const isolated = await createIsolatedDatabase(t, "commerce_rollback");
  if (!isolated) {
    return;
  }

  const { harness, database } = isolated;
  const fixture = insertFixture(harness, database, { commercialType: "exclusive", maxBuyers: 1, balances: [60] });

  harness.run(database, `
    create or replace function public.test_fail_lead_purchase_insert()
    returns trigger
    language plpgsql
    as $$
    begin
      raise exception 'TEST_FORCE_ROLLBACK';
    end;
    $$;
    create trigger test_force_rollback_on_purchase
    before insert on public.lead_purchases
    for each row execute function public.test_fail_lead_purchase_insert();
  `);

  const error = harness.expectError(database, `select * from public.purchase_lead(${sqlLiteral(fixture.leadId)}, 'rollback-check');`, fixture.professionalContexts[0]);
  assert.match(error, /TEST_FORCE_ROLLBACK/);
  assert.equal(Number(harness.run(database, `select count(*) from public.wallet_transactions where lead_id = ${sqlLiteral(fixture.leadId)};`)), 0);
  assert.equal(Number(harness.run(database, `select count(*) from public.lead_assignments where lead_id = ${sqlLiteral(fixture.leadId)};`)), 0);
});

test("duplicate purchases are idempotent per professional and keys are bound to a single lead", { concurrency: false }, async (t) => {
  const isolated = await createIsolatedDatabase(t, "commerce_duplicate");
  if (!isolated) {
    return;
  }

  const { harness, database } = isolated;
  const fixture = insertFixture(harness, database, { commercialType: "shared", maxBuyers: 3, balances: [80] });
  const purchase = harness.queryRowJson<{ purchase_id: string }>(
    database,
    `select * from public.purchase_lead(${sqlLiteral(fixture.leadId)}, 'dedupe-key')`,
    fixture.professionalContexts[0],
  );
  const duplicate = harness.queryRowJson<{ purchase_id: string }>(
    database,
    `select * from public.purchase_lead(${sqlLiteral(fixture.leadId)}, 'second-key')`,
    fixture.professionalContexts[0],
  );
  assert.equal(duplicate.purchase_id, purchase.purchase_id);
  assert.equal(Number(harness.run(database, `select count(*) from public.wallet_transactions where lead_id = ${sqlLiteral(fixture.leadId)} and type = 'lead_purchase';`)), 1);
  assert.equal(Number(harness.run(database, `select count(*) from public.lead_purchases where lead_id = ${sqlLiteral(fixture.leadId)};`)), 1);

  const secondLeadId = insertSecondaryLead(harness, database, fixture.serviceId, fixture.professionalIds[0]);
  const conflict = harness.expectError(database, `select * from public.purchase_lead(${sqlLiteral(secondLeadId)}, 'dedupe-key');`, fixture.professionalContexts[0]);
  assert.match(conflict, /IDEMPOTENCY_KEY_CONFLICT/);
});

test("refunds add counter-transactions, block double refunds, block repurchase and reconcile cleanly", { concurrency: false }, async (t) => {
  const isolated = await createIsolatedDatabase(t, "commerce_refund");
  if (!isolated) {
    return;
  }

  const { harness, database } = isolated;
  const fixture = insertFixture(harness, database, { commercialType: "exclusive", maxBuyers: 1, balances: [50] });
  const purchase = harness.queryRowJson<{ purchase_id: string }>(
    database,
    `select * from public.purchase_lead(${sqlLiteral(fixture.leadId)}, 'refundable-purchase')`,
    fixture.professionalContexts[0],
  );
  harness.queryRowJson(
    database,
    `select * from public.refund_lead_purchase(${sqlLiteral(purchase.purchase_id)}, 'Klant buiten regio')`,
    harness.adminContext,
  );

  const transactions = harness.queryArrayJson<{ type: string; amount: number }>(
    database,
    `select type, amount from public.wallet_transactions where professional_id = ${sqlLiteral(fixture.professionalIds[0])} order by created_at asc`,
  );
  assert.deepEqual(transactions.map((row) => row.type), ["admin_credit", "lead_purchase", "refund"]);
  assert.ok(transactions.some((row) => row.type === "lead_purchase" && row.amount < 0));
  assert.ok(transactions.some((row) => row.type === "refund" && row.amount > 0));

  const doubleRefundError = harness.expectError(
    database,
    `select * from public.refund_lead_purchase(${sqlLiteral(purchase.purchase_id)}, 'Tweede refund');`,
    harness.adminContext,
  );
  assert.match(doubleRefundError, /PURCHASE_ALREADY_REFUNDED/);

  const repurchaseError = harness.expectError(
    database,
    `select * from public.purchase_lead(${sqlLiteral(fixture.leadId)}, 'repurchase-after-refund');`,
    fixture.professionalContexts[0],
  );
  assert.match(repurchaseError, /LEAD_PURCHASE_REFUNDED/);

  const reconciliation = harness.queryRowJson<{ cached_balance: number; ledger_balance: number; is_consistent: boolean }>(
    database,
    `select cached_balance, ledger_balance, is_consistent from public.get_wallet_reconciliation(${sqlLiteral(fixture.professionalIds[0])})`,
    harness.adminContext,
  );
  assert.equal(reconciliation.cached_balance, reconciliation.ledger_balance);
  assert.equal(reconciliation.is_consistent, true);
});

test("concurrent expiry workers claim each expired offer once and trigger one fallback offer", { concurrency: false }, async (t) => {
  const isolated = await createIsolatedDatabase(t, "distribution_expiry_workers");
  if (!isolated) {
    return;
  }

  const { harness, database } = isolated;
  const fixture = insertFixture(harness, database, { commercialType: "exclusive", maxBuyers: 1, balances: [50, 50, 50] });
  const runId = randomUUID();
  const [firstProfessional, secondProfessional, thirdProfessional] = fixture.professionalIds;

  harness.run(database, `
    insert into public.lead_distribution_runs (id, lead_id, commercial_type, status, strategy_version)
    values (${sqlLiteral(runId)}, ${sqlLiteral(fixture.leadId)}, 'exclusive', 'active', 'v1');
    insert into public.lead_distribution_candidates (
      distribution_run_id, lead_id, professional_id, rank_position, ranking_score, status, offered_at, offer_expires_at, score_breakdown, eligibility_reason
    ) values
      (${sqlLiteral(runId)}, ${sqlLiteral(fixture.leadId)}, ${sqlLiteral(firstProfessional)}, 1, 90, 'offered', timezone('utc', now()) - interval '30 minutes', timezone('utc', now()) - interval '2 minutes', '{}'::jsonb, '{}'::jsonb),
      (${sqlLiteral(runId)}, ${sqlLiteral(fixture.leadId)}, ${sqlLiteral(secondProfessional)}, 2, 85, 'queued', null, null, '{}'::jsonb, '{}'::jsonb),
      (${sqlLiteral(runId)}, ${sqlLiteral(fixture.leadId)}, ${sqlLiteral(thirdProfessional)}, 3, 80, 'queued', null, null, '{}'::jsonb, '{}'::jsonb);
  `);

  const workerSql = `
    with claimed as (
      select * from public.claim_expired_distribution_candidates(200)
    ),
    activated as (
      select * from public.activate_lead_distribution_run(${sqlLiteral(runId)}, 15, 20, 3)
    )
    select
      (select count(*) from claimed) as claimed_count,
      (select count(*) from activated where action = 'offered') as offered_count;
  `;

  const [workerA, workerB] = await Promise.all([
    harness.runConcurrent(database, workerSql),
    harness.runConcurrent(database, workerSql),
  ]);

  assert.equal(workerA.ok, true, workerA.stderr || workerA.stdout);
  assert.equal(workerB.ok, true, workerB.stderr || workerB.stdout);

  assert.equal(
    Number(harness.run(database, `
      select count(*)
      from public.lead_distribution_candidates
      where distribution_run_id = ${sqlLiteral(runId)}
        and status = 'expired';
    `)),
    1,
  );

  assert.equal(
    Number(harness.run(database, `
      select count(*)
      from public.lead_distribution_candidates
      where distribution_run_id = ${sqlLiteral(runId)}
        and status in ('offered', 'viewed');
    `)),
    1,
  );

  assert.equal(
    Number(harness.run(database, `
      select count(*)
      from public.lead_distribution_candidates
      where distribution_run_id = ${sqlLiteral(runId)}
        and professional_id = ${sqlLiteral(secondProfessional)}
        and status = 'offered';
    `)),
    1,
  );
});

test("activate_lead_distribution_run is idempotent and respects slots/batch limits", { concurrency: false }, async (t) => {
  const isolated = await createIsolatedDatabase(t, "distribution_activation_idempotency");
  if (!isolated) {
    return;
  }

  const { harness, database } = isolated;
  const fixture = insertFixture(harness, database, { commercialType: "shared", maxBuyers: 2, balances: [50, 50, 50] });
  const runId = randomUUID();

  harness.run(database, `
    insert into public.lead_distribution_runs (id, lead_id, commercial_type, status, strategy_version)
    values (${sqlLiteral(runId)}, ${sqlLiteral(fixture.leadId)}, 'shared', 'pending', 'v1');
    insert into public.lead_distribution_candidates (
      distribution_run_id, lead_id, professional_id, rank_position, ranking_score, status, score_breakdown, eligibility_reason
    ) values
      (${sqlLiteral(runId)}, ${sqlLiteral(fixture.leadId)}, ${sqlLiteral(fixture.professionalIds[0])}, 1, 90, 'queued', '{}'::jsonb, '{}'::jsonb),
      (${sqlLiteral(runId)}, ${sqlLiteral(fixture.leadId)}, ${sqlLiteral(fixture.professionalIds[1])}, 2, 88, 'queued', '{}'::jsonb, '{}'::jsonb),
      (${sqlLiteral(runId)}, ${sqlLiteral(fixture.leadId)}, ${sqlLiteral(fixture.professionalIds[2])}, 3, 85, 'queued', '{}'::jsonb, '{}'::jsonb);
  `);

  const firstActivationCount = Number(harness.run(database, `
    select count(*) from public.activate_lead_distribution_run(${sqlLiteral(runId)}, 15, 20, 3)
    where action = 'offered';
  `));
  const secondActivationCount = Number(harness.run(database, `
    select count(*) from public.activate_lead_distribution_run(${sqlLiteral(runId)}, 15, 20, 3)
    where action = 'offered';
  `));

  assert.equal(firstActivationCount, 2);
  assert.equal(secondActivationCount, 0);
  assert.equal(
    Number(harness.run(database, `
      select count(*)
      from public.lead_distribution_candidates
      where distribution_run_id = ${sqlLiteral(runId)}
        and status in ('offered', 'viewed');
    `)),
    2,
  );
});

test("Prompt 27 contact unlock and wallet/purchase/assignment reads enforce professional ownership", { concurrency: false }, async (t) => {
  const isolated = await createIsolatedDatabase(t, "prompt27_idor");
  if (!isolated) return;
  const { harness, database } = isolated;
  const fixture = insertFixture(harness, database, { commercialType: "shared", maxBuyers: 3, balances: [60, 60] });
  const [buyer, other] = fixture.professionalContexts;
  harness.run(database, "grant usage on schema public to authenticated; grant select, update on all tables in schema public to authenticated;");
  assert.equal(harness.run(database, `select count(*) from public.leads where id = ${sqlLiteral(fixture.leadId)};`, buyer), "0");
  assert.equal(harness.run(database, `select count(*) from public.leads where id = ${sqlLiteral(fixture.leadId)};`, other), "0");
  const purchase = harness.queryRowJson<{ purchase_id: string }>(
    database, `select * from public.purchase_lead(${sqlLiteral(fixture.leadId)}, 'prompt27-owner')`, buyer,
  );
  assert.equal(harness.run(database, `select count(*) from public.leads where id = ${sqlLiteral(fixture.leadId)} and phone = '0612345678';`, buyer), "1");
  assert.equal(harness.run(database, `select count(*) from public.leads where id = ${sqlLiteral(fixture.leadId)};`, other), "0");
  assert.equal(harness.run(database, `select count(*) from public.lead_purchases where id = ${sqlLiteral(purchase.purchase_id)};`, other), "0");
  for (const table of ["professional_wallets", "wallet_transactions", "lead_assignments"]) {
    assert.equal(harness.run(database, `select count(*) from public.${table} where professional_id = ${sqlLiteral(fixture.professionalIds[0])};`, other), "0");
  }
  harness.run(database, `update public.lead_assignments set progress_status = 'contacted' where lead_id = ${sqlLiteral(fixture.leadId)};`, buyer);
  assert.equal(harness.run(database, `select progress_status from public.lead_assignments where lead_id = ${sqlLiteral(fixture.leadId)};`, buyer), "contacted");
  harness.run(database, `update public.lead_assignments set progress_status = 'appointment_scheduled' where lead_id = ${sqlLiteral(fixture.leadId)};`, other);
  assert.equal(harness.run(database, `select progress_status from public.lead_assignments where lead_id = ${sqlLiteral(fixture.leadId)};`, buyer), "contacted");
});

test("Prompt 27 expired and declined offers reject purchase without any debit", { concurrency: false }, async (t) => {
  const isolated = await createIsolatedDatabase(t, "prompt27_expiry");
  if (!isolated) return;
  const { harness, database } = isolated;
  const fixture = insertFixture(harness, database, { commercialType: "shared", maxBuyers: 3, balances: [60, 60] });
  const runId = randomUUID();
  harness.run(database, `
    insert into public.lead_distribution_runs (id, lead_id, commercial_type, status, strategy_version)
    values (${sqlLiteral(runId)}, ${sqlLiteral(fixture.leadId)}, 'shared', 'active', 'v1');
    insert into public.lead_distribution_candidates (distribution_run_id, lead_id, professional_id, rank_position, ranking_score, status, offered_at, offer_expires_at, score_breakdown, eligibility_reason)
    values
      (${sqlLiteral(runId)}, ${sqlLiteral(fixture.leadId)}, ${sqlLiteral(fixture.professionalIds[0])}, 1, 90, 'offered', now() - interval '1 hour', now() - interval '1 minute', '{}', '{}'),
      (${sqlLiteral(runId)}, ${sqlLiteral(fixture.leadId)}, ${sqlLiteral(fixture.professionalIds[1])}, 2, 80, 'declined', now(), now() + interval '1 hour', '{}', '{}');
  `);
  for (const [index, context] of fixture.professionalContexts.entries()) {
    assert.match(harness.expectError(database, `select * from public.purchase_lead(${sqlLiteral(fixture.leadId)}, 'prompt27-expired-${index}');`, context), /LEAD_OFFER_NOT_ACTIVE/);
  }
  assert.equal(harness.run(database, `select count(*) from public.wallet_transactions where lead_id = ${sqlLiteral(fixture.leadId)} and type = 'lead_purchase';`), "0");
  assert.equal(harness.run(database, `select count(*) from public.lead_purchases where lead_id = ${sqlLiteral(fixture.leadId)};`), "0");
});

test("Prompt 27 server charges the current price and does not debit ineligible professionals", { concurrency: false }, async (t) => {
  const isolated = await createIsolatedDatabase(t, "prompt27_price");
  if (!isolated) return;
  const { harness, database } = isolated;
  const fixture = insertFixture(harness, database, { commercialType: "shared", maxBuyers: 3, balances: [60, 60] });
  harness.run(database, "grant usage on schema public to authenticated; grant select, update on all tables in schema public to authenticated;");
  harness.run(database, `
    update public.leads set price_credits = 18 where id = ${sqlLiteral(fixture.leadId)};
    update public.professionals set status = 'paused' where id = ${sqlLiteral(fixture.professionalIds[1])};
  `, harness.adminContext);
  assert.match(harness.expectError(database, `select * from public.purchase_lead(${sqlLiteral(fixture.leadId)}, 'prompt27-ineligible');`, fixture.professionalContexts[1]), /PROFESSIONAL_NOT_ELIGIBLE/);
  assert.equal(harness.run(database, `select count(*) from public.wallet_transactions where professional_id = ${sqlLiteral(fixture.professionalIds[1])} and type = 'lead_purchase';`), "0");
  harness.run(database, `select * from public.purchase_lead(${sqlLiteral(fixture.leadId)}, 'prompt27-price');`, fixture.professionalContexts[0]);
  assert.equal(harness.run(database, `select price_credits from public.lead_purchases where lead_id = ${sqlLiteral(fixture.leadId)};`), "18");
  assert.equal(harness.run(database, `select cached_balance from public.professional_wallets where professional_id = ${sqlLiteral(fixture.professionalIds[0])};`), "42");
});

test("Prompt 27 refunds revoke contact access without permitting purchase-link tampering", { concurrency: false }, async (t) => {
  const isolated = await createIsolatedDatabase(t, "prompt27_refund_privacy");
  if (!isolated) return;
  const { harness, database } = isolated;
  const fixture = insertFixture(harness, database, { commercialType: "shared", maxBuyers: 3, balances: [60] });
  const context = fixture.professionalContexts[0];
  const questionId = randomUUID();
  harness.run(database, `
    insert into public.lead_images (lead_id, storage_path) values (${sqlLiteral(fixture.leadId)}, 'private/example.jpg');
    insert into public.service_questions (id, service_id, question, slug, type)
    values (${sqlLiteral(questionId)}, ${sqlLiteral(fixture.serviceId)}, 'Omschrijving', 'privacy-test', 'textarea');
    insert into public.lead_answers (lead_id, question_id, answer_text)
    values (${sqlLiteral(fixture.leadId)}, ${sqlLiteral(questionId)}, 'Contactgegevens in vrije tekst');
  `);
  harness.run(database, "grant usage on schema public to authenticated; grant select, update on all tables in schema public to authenticated;");
  const purchase = harness.queryRowJson<{ purchase_id: string }>(
    database, `select * from public.purchase_lead(${sqlLiteral(fixture.leadId)}, 'prompt27-refund')`, context,
  );
  assert.equal(harness.run(database, `select count(*) from public.lead_images where lead_id = ${sqlLiteral(fixture.leadId)};`, context), "1");
  assert.equal(harness.run(database, `select count(*) from public.lead_answers where lead_id = ${sqlLiteral(fixture.leadId)};`, context), "1");
  assert.match(harness.expectError(database, `update public.lead_assignments set lead_purchase_id = null where lead_id = ${sqlLiteral(fixture.leadId)};`, context), /ASSIGNMENT_ACCESS_IMMUTABLE/);
  harness.run(database, `select * from public.refund_lead_purchase(${sqlLiteral(purchase.purchase_id)}, 'Privacy regression');`, harness.adminContext);
  assert.equal(harness.run(database, `select public.can_professional_view_lead_contact(${sqlLiteral(fixture.leadId)});`, context), "f");
  assert.equal(harness.run(database, `select count(*) from public.leads where id = ${sqlLiteral(fixture.leadId)};`, context), "0");
  assert.equal(harness.run(database, `select count(*) from public.lead_images where lead_id = ${sqlLiteral(fixture.leadId)};`, context), "0");
  assert.equal(harness.run(database, `select count(*) from public.lead_answers where lead_id = ${sqlLiteral(fixture.leadId)};`, context), "0");
});

test("Prompt 27 live offer purchase syncs availability and legacy direct assignments still unlock", { concurrency: false }, async (t) => {
  const isolated = await createIsolatedDatabase(t, "prompt27_live");
  if (!isolated) return;
  const { harness, database } = isolated;
  const fixture = insertFixture(harness, database, { commercialType: "exclusive", maxBuyers: 1, balances: [60, 60] });
  const runId = randomUUID();
  harness.run(database, `
    insert into public.lead_distribution_runs (id, lead_id, commercial_type, status, strategy_version)
    values (${sqlLiteral(runId)}, ${sqlLiteral(fixture.leadId)}, 'exclusive', 'active', 'v1');
    insert into public.lead_distribution_candidates (distribution_run_id, lead_id, professional_id, rank_position, ranking_score, status, offered_at, offer_expires_at, score_breakdown, eligibility_reason)
    values (${sqlLiteral(runId)}, ${sqlLiteral(fixture.leadId)}, ${sqlLiteral(fixture.professionalIds[0])}, 1, 90, 'viewed', now(), now() + interval '1 hour', '{}', '{}');
  `);
  harness.run(database, `select * from public.purchase_lead(${sqlLiteral(fixture.leadId)}, 'prompt27-live');`, fixture.professionalContexts[0]);
  assert.equal(harness.run(database, `select status from public.lead_distribution_candidates where distribution_run_id = ${sqlLiteral(runId)};`), "purchased");
  assert.equal(harness.run(database, `select count(*) from public.wallet_transactions where lead_id = ${sqlLiteral(fixture.leadId)} and type = 'lead_purchase';`), "1");
  const directLeadId = insertSecondaryLead(harness, database, fixture.serviceId, fixture.professionalIds[1]);
  harness.run(database, `
    insert into public.lead_assignments (lead_id, professional_id, status)
    values (${sqlLiteral(directLeadId)}, ${sqlLiteral(fixture.professionalIds[1])}, 'accepted');
    grant usage on schema public to authenticated;
    grant select on all tables in schema public to authenticated;
  `);
  assert.equal(harness.run(database, `select public.can_professional_view_lead_contact(${sqlLiteral(directLeadId)});`, fixture.professionalContexts[1]), "t");
  assert.equal(harness.run(database, `select count(*) from public.leads where id = ${sqlLiteral(directLeadId)};`, fixture.professionalContexts[1]), "1");
});

test("Prompt 27 exhausted historical offers cannot bypass their deadline through direct RPC", { concurrency: false }, async (t) => {
  const isolated = await createIsolatedDatabase(t, "prompt27_exhausted");
  if (!isolated) return;
  const { harness, database } = isolated;
  const fixture = insertFixture(harness, database, { commercialType: "exclusive", maxBuyers: 1, balances: [60] });
  const runId = randomUUID();
  harness.run(database, `
    insert into public.lead_distribution_runs (id, lead_id, commercial_type, status, strategy_version)
    values (${sqlLiteral(runId)}, ${sqlLiteral(fixture.leadId)}, 'exclusive', 'exhausted', 'v1');
    insert into public.lead_distribution_candidates (distribution_run_id, lead_id, professional_id, rank_position, ranking_score, status, offered_at, offer_expires_at, score_breakdown, eligibility_reason)
    values (${sqlLiteral(runId)}, ${sqlLiteral(fixture.leadId)}, ${sqlLiteral(fixture.professionalIds[0])}, 1, 90, 'expired', now() - interval '1 hour', now() - interval '1 minute', '{}', '{}');
  `);
  assert.match(harness.expectError(database, `select * from public.purchase_lead(${sqlLiteral(fixture.leadId)}, 'prompt27-exhausted');`, fixture.professionalContexts[0]), /LEAD_OFFER_NOT_ACTIVE/);
  assert.equal(harness.run(database, `select count(*) from public.wallet_transactions where lead_id = ${sqlLiteral(fixture.leadId)} and type = 'lead_purchase';`), "0");
});
