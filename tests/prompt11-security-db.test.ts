import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import test from "node:test";

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
  "supabase/migrations/20260911100000_phase7_professional_onboarding_verification.sql",
  "supabase/migrations/20260911110000_phase7_professional_onboarding_security_hardening.sql",
  "supabase/migrations/20260919104000_prompt11_post_merge_hardening.sql",
  "supabase/migrations/20261001100000_prompt12_notifications_operations.sql",
  "supabase/migrations/20261002100000_prompt12_followup_hardening.sql",
  "supabase/migrations/20261002210000_prompt19_analytics_hardening.sql",
  "supabase/migrations/20261002220000_prompt20_cro_experiments.sql",
  "supabase/migrations/20261005150000_prompt27_marketplace_access_hardening.sql",
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
  createDatabase: (name: string) => string;
  dropDatabase: (name: string) => void;
  run: (database: string, sql: string, context?: SessionContext) => string;
  runConcurrent: (database: string, sql: string, context?: SessionContext) => Promise<{ ok: boolean; stdout: string; stderr: string }>;
  queryRowJson: <T>(database: string, selectSql: string, context?: SessionContext) => T;
  expectError: (database: string, sql: string, context?: SessionContext) => string;
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

function stripTrailingSemicolon(sql: string) {
  return sql.trim().replace(/;+\s*$/, "");
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
  if (!binaryAvailable()) return null;

  const baseDir = mkdtempSync(join(tmpdir(), "vakconnect-pg-p11-"));
  const dataDir = join(baseDir, "data");
  const socketDir = join(baseDir, "socket");
  const logFile = join(baseDir, "postgres.log");
  const port = String(6600 + Math.floor(Math.random() * 1000));
  const adminContext: SessionContext = { dbRole: "authenticated", requestRole: "authenticated", appRole: "admin", userId: randomUUID() };
  const templateDb = "vakconnect_prompt11_template";
  const env = { PATH: `${pgBinDir}:${process.env.PATH ?? ""}` };

  execProgram("mkdir", ["-p", socketDir], env);
  execProgram(initdbPath, ["-D", dataDir, "-A", "trust", "-U", "postgres"], env);
  execProgram(pgCtlPath, ["-D", dataDir, "-l", logFile, "-o", `-F -k ${socketDir} -p ${port}`, "-w", "start"], env);

  const connectionArgs = (database: string) => ["-h", "127.0.0.1", "-p", port, "-U", "postgres", "-d", database];
  const run = (database: string, sql: string, context?: SessionContext) =>
    execProgram(psqlPath, [...connectionArgs(database), "-X", "-q", "-A", "-t", "-v", "ON_ERROR_STOP=1", "-c", `${buildSessionPreamble(context)}\n${stripTrailingSemicolon(sql)}`], env).trim();
  const runConcurrent = (database: string, sql: string, context?: SessionContext) => new Promise<{ ok: boolean; stdout: string; stderr: string }>((resolve) => {
    const child = spawn(psqlPath, [...connectionArgs(database), "-X", "-q", "-A", "-t", "-v", "ON_ERROR_STOP=1", "-c", `${buildSessionPreamble(context)}\n${stripTrailingSemicolon(sql)}`], {
      env: { ...process.env, ...env },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += String(chunk); });
    child.stderr.on("data", (chunk) => { stderr += String(chunk); });
    child.on("close", (code) => resolve({ ok: code === 0, stdout: stdout.trim(), stderr: stderr.trim() }));
  });
  const queryRowJson = <T>(database: string, selectSql: string, context?: SessionContext) =>
    JSON.parse(run(database, `select row_to_json(result)::text from (${stripTrailingSemicolon(selectSql)}) result`, context)) as T;
  const expectError = (database: string, sql: string, context?: SessionContext) => {
    try {
      run(database, sql, context);
      assert.fail("Expected SQL command to fail");
    } catch (error) {
      return `${String((error as { stdout?: string }).stdout ?? "")}${String((error as { stderr?: string }).stderr ?? "")}`;
    }
  };

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
    createDatabase(name: string) {
      execProgram(createdbPath, ["-h", "127.0.0.1", "-p", port, "-U", "postgres", "-T", templateDb, name], env);
      return name;
    },
    dropDatabase(name: string) {
      execProgram(dropdbPath, ["-h", "127.0.0.1", "-p", port, "-U", "postgres", "--if-exists", name], env);
    },
    run,
    runConcurrent,
    queryRowJson,
    expectError,
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
  if (!harness) return null;
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

function seedProfessional(harness: Harness, database: string, professionalId: string, userId: string, email: string, companyName: string) {
  harness.run(database, `
    insert into auth.users (id, email, raw_app_meta_data)
    values (${sqlLiteral(userId)}, ${sqlLiteral(email)}, '{"role":"professional"}'::jsonb);

    insert into public.professionals (
      id,
      auth_user_id,
      company_name,
      contact_name,
      email,
      phone,
      status,
      verification_status,
      onboarding_status,
      onboarding_step
    ) values (
      ${sqlLiteral(professionalId)},
      ${sqlLiteral(userId)},
      ${sqlLiteral(companyName)},
      'Piet Professional',
      ${sqlLiteral(email)},
      '0612345678',
      'active',
      'unverified',
      'not_started',
      'company'
    );
  `);
}

test("Prompt 20 experiments default to draft, enforce assignment privacy, and activate atomically with audit", { concurrency: false }, async (t) => {
  const isolated = await createIsolatedDatabase(t, "prompt20_experiments");
  if (!isolated) return;

  const { harness, database } = isolated;
  const actorId = harness.adminContext.userId ?? randomUUID();
  assert.equal(harness.run(database, "select count(*) from public.experiments where status = 'draft';"), "3");

  const homepage = harness.queryRowJson<{ id: string }>(
    database,
    "select id from public.experiments where key = 'homepage_cta_copy';",
  );
  const service = harness.queryRowJson<{ id: string }>(
    database,
    "select id from public.experiments where key = 'service_mid_cta_copy';",
  );
  const control = harness.queryRowJson<{ id: string }>(
    database,
    `select id from public.experiment_variants where experiment_id = ${sqlLiteral(homepage.id)} and is_control;`,
  );
  const sessionId = randomUUID();

  const assignmentInsert = `insert into public.experiment_assignments (experiment_id, anonymous_session_id, variant_id) values (${sqlLiteral(homepage.id)}, ${sqlLiteral(sessionId)}, ${sqlLiteral(control.id)});`;
  harness.run(database, assignmentInsert);
  assert.equal(harness.run(database, `select count(*) from public.experiment_assignments where anonymous_session_id = ${sqlLiteral(sessionId)};`, harness.adminContext), "1");
  let publicAssignmentRows = "";
  try {
    publicAssignmentRows = harness.run(database, `select count(*) from public.experiment_assignments where anonymous_session_id = ${sqlLiteral(sessionId)};`, {
      dbRole: "authenticated",
      requestRole: "anon",
    });
  } catch (error) {
    assert.match(String(error), /permission denied/i);
  }
  assert.ok(publicAssignmentRows === "" || publicAssignmentRows === "0");
  const publicWriteError = harness.expectError(
    database,
    assignmentInsert,
    { dbRole: "authenticated", requestRole: "anon" },
  );
  assert.match(publicWriteError, /permission denied|row-level security/i);

  const forbiddenActivation = harness.expectError(
    database,
    `select public.transition_experiment_status(${sqlLiteral(homepage.id)}, 'active', ${sqlLiteral(actorId)});`,
    harness.adminContext,
  );
  assert.match(forbiddenActivation, /permission denied/i);

  harness.run(database, `update public.experiment_variants set weight = 40 where experiment_id = ${sqlLiteral(homepage.id)} and is_control;`);
  const invalidWeights = harness.expectError(
    database,
    `select public.transition_experiment_status(${sqlLiteral(homepage.id)}, 'active', ${sqlLiteral(actorId)});`,
    { dbRole: "service_role", requestRole: "service_role" },
  );
  assert.match(invalidWeights, /minimaal twee varianten|gewichten van totaal 100/i);
  assert.equal(harness.run(database, `select status from public.experiments where id = ${sqlLiteral(homepage.id)};`), "draft");
  assert.equal(harness.run(database, `select count(*) from public.experiment_audit_log where experiment_id = ${sqlLiteral(homepage.id)};`), "0");

  harness.run(database, `update public.experiment_variants set weight = 50 where experiment_id = ${sqlLiteral(homepage.id)} and is_control;`);
  harness.run(database, `select public.transition_experiment_status(${sqlLiteral(homepage.id)}, 'active', ${sqlLiteral(actorId)});`, {
    dbRole: "service_role",
    requestRole: "service_role",
  });
  assert.equal(harness.run(database, `select status from public.experiments where id = ${sqlLiteral(homepage.id)};`), "active");

  harness.run(database, `update public.experiments set slot = 'homepage.hero.cta' where id = ${sqlLiteral(service.id)};`);
  const conflictingSlot = harness.expectError(
    database,
    `select public.transition_experiment_status(${sqlLiteral(service.id)}, 'active', ${sqlLiteral(actorId)});`,
    { dbRole: "service_role", requestRole: "service_role" },
  );
  assert.match(conflictingSlot, /experiments_one_active_per_slot_idx/i);
  assert.equal(harness.run(database, `select status from public.experiments where id = ${sqlLiteral(service.id)};`), "draft");

  harness.run(database, `select public.transition_experiment_status(${sqlLiteral(homepage.id)}, 'paused', ${sqlLiteral(actorId)});`, {
    dbRole: "service_role",
    requestRole: "service_role",
  });
  assert.equal(harness.run(database, `select status from public.experiments where id = ${sqlLiteral(homepage.id)};`), "paused");
  harness.run(database, `select public.transition_experiment_status(${sqlLiteral(homepage.id)}, 'completed', ${sqlLiteral(actorId)});`, {
    dbRole: "service_role",
    requestRole: "service_role",
  });
  const completedAt = harness.run(database, `select ended_at::text from public.experiments where id = ${sqlLiteral(homepage.id)};`);
  harness.run(database, `select public.transition_experiment_status(${sqlLiteral(homepage.id)}, 'archived', ${sqlLiteral(actorId)});`, {
    dbRole: "service_role",
    requestRole: "service_role",
  });
  assert.equal(harness.run(database, `select status from public.experiments where id = ${sqlLiteral(homepage.id)};`), "archived");
  assert.equal(harness.run(database, `select ended_at::text from public.experiments where id = ${sqlLiteral(homepage.id)};`), completedAt);
  assert.equal(harness.run(database, `select count(*) from public.experiment_audit_log where experiment_id = ${sqlLiteral(homepage.id)} and actor_user_id = ${sqlLiteral(actorId)};`), "4");
});

test("professional can start onboarding and only advance through controlled transitions", { concurrency: false }, async (t) => {
  const isolated = await createIsolatedDatabase(t, "prompt11_onboarding_transition");
  if (!isolated) return;

  const { harness, database } = isolated;
  const userId = randomUUID();
  const professionalId = randomUUID();
  const context = buildUserContext(userId, "professional");
  seedProfessional(harness, database, professionalId, userId, "pro1@example.com", "Dakbedrijf 1");

  const started = harness.queryRowJson<{
    professional_id: string;
    onboarding_status: string;
    onboarding_step: string;
    submitted_for_review_at: string | null;
  }>(
    database,
    `select * from public.transition_own_professional_onboarding('company', false);`,
    context,
  );
  assert.equal(started.professional_id, professionalId);
  assert.equal(started.onboarding_status, "in_progress");
  assert.equal(started.onboarding_step, "company");
  assert.equal(started.submitted_for_review_at, null);

  const advanced = harness.queryRowJson<{ onboarding_status: string; onboarding_step: string }>(
    database,
    `select * from public.transition_own_professional_onboarding('contact', false);`,
    context,
  );
  assert.equal(advanced.onboarding_status, "in_progress");
  assert.equal(advanced.onboarding_step, "contact");

  const invalidSkip = harness.expectError(
    database,
    `select * from public.transition_own_professional_onboarding('capacity', false);`,
    context,
  );
  assert.match(invalidSkip, /INVALID_ONBOARDING_STEP_TRANSITION/);
});

test("professional cannot verify themselves or forge audit and notification records for another professional", { concurrency: false }, async (t) => {
  const isolated = await createIsolatedDatabase(t, "prompt11_authz");
  if (!isolated) return;

  const { harness, database } = isolated;
  const userA = randomUUID();
  const userB = randomUUID();
  const professionalA = randomUUID();
  const professionalB = randomUUID();
  const contextA = buildUserContext(userA, "professional");
  seedProfessional(harness, database, professionalA, userA, "proa@example.com", "Dakbedrijf A");
  seedProfessional(harness, database, professionalB, userB, "prob@example.com", "Dakbedrijf B");

  const verifyError = harness.expectError(
    database,
    `update public.professionals set verification_status = 'verified' where id = ${sqlLiteral(professionalA)};`,
    contextA,
  );
  assert.match(verifyError, /PROFESSIONAL_ADMIN_FIELDS_IMMUTABLE|permission denied/i);

  const auditError = harness.expectError(
    database,
    `select public.append_professional_audit_log(${sqlLiteral(professionalB)}, auth.uid(), 'onboarding_started', '{}'::jsonb);`,
    contextA,
  );
  assert.match(auditError, /permission denied/i);

  const notificationError = harness.expectError(
    database,
    `select public.enqueue_professional_notification(${sqlLiteral(professionalB)}, 'onboarding_submitted', '{}'::jsonb);`,
    contextA,
  );
  assert.match(notificationError, /permission denied/i);
});

test("notification inbox enforces ownership, read-only fields and atomic worker claims", { concurrency: false }, async (t) => {
  const isolated = await createIsolatedDatabase(t, "prompt12_notifications");
  if (!isolated) return;

  const { harness, database } = isolated;
  const userA = randomUUID();
  const userB = randomUUID();
  const professionalA = randomUUID();
  const professionalB = randomUUID();
  const notificationId = randomUUID();
  const systemNotificationId = randomUUID();
  const pendingNotificationId = randomUUID();
  const concurrentlyLockedNotificationId = randomUUID();
  const contextA = buildUserContext(userA, "professional");
  const contextB = buildUserContext(userB, "professional");
  seedProfessional(harness, database, professionalA, userA, "notifications-a@example.com", "Dakbedrijf Notifications A");
  seedProfessional(harness, database, professionalB, userB, "notifications-b@example.com", "Dakbedrijf Notifications B");
  harness.run(database, `grant select on public.professionals to authenticated;`);
  harness.run(database, `
    insert into public.professional_notification_events (
      id, professional_id, event_type, channel_type, payload, status, processed_at
    ) values
      (${sqlLiteral(notificationId)}, ${sqlLiteral(professionalA)}, 'lead_offer_received', 'in_app', '{"title":"Nieuw aanbod"}'::jsonb, 'delivered', now()),
      (${sqlLiteral(systemNotificationId)}, null, 'operational_alert', 'system', '{"title":"Operationele melding"}'::jsonb, 'delivered', now()),
      (${sqlLiteral(pendingNotificationId)}, ${sqlLiteral(professionalA)}, 'lead_offer_received', 'in_app', '{}'::jsonb, 'pending', null);
    insert into public.professional_notification_events (
      professional_id, event_type, channel_type, payload, status, deduplication_key
    ) values (
      ${sqlLiteral(professionalA)}, 'operational_alert', 'in_app', '{}'::jsonb, 'delivered', 'notification-idempotency-test'
    ) on conflict (deduplication_key) where deduplication_key is not null do nothing;
    insert into public.professional_notification_events (
      professional_id, event_type, channel_type, payload, status, deduplication_key
    ) values (
      ${sqlLiteral(professionalA)}, 'operational_alert', 'in_app', '{}'::jsonb, 'delivered', 'notification-idempotency-test'
    ) on conflict (deduplication_key) where deduplication_key is not null do nothing;
    update public.professional_notification_events
    set max_attempts = 2
    where id = ${sqlLiteral(pendingNotificationId)};
  `);
  assert.equal(harness.run(database, `
    select count(*) from public.professional_notification_events
    where deduplication_key = 'notification-idempotency-test';
  `), "1");

  assert.equal(harness.run(database, `
    select count(*) from public.professional_notification_events where id = ${sqlLiteral(notificationId)};
  `, contextA), "1");
  assert.equal(harness.run(database, `
    select count(*) from public.professional_notification_events where id = ${sqlLiteral(notificationId)};
  `, contextB), "0");
  assert.equal(harness.run(database, `
    select count(*) from public.professional_notification_events where id = ${sqlLiteral(systemNotificationId)};
  `, contextA), "0");

  harness.run(database, `
    update public.professional_notification_events set read_at = now()
    where id = ${sqlLiteral(notificationId)};
  `, contextA);
  const contentUpdateError = harness.expectError(database, `
    update public.professional_notification_events set payload = '{}'::jsonb
    where id = ${sqlLiteral(notificationId)};
  `, contextA);
  assert.match(contentUpdateError, /permission denied/i);
  const preferencesError = harness.expectError(database, `
    insert into public.professional_notification_preferences (professional_id, email_enabled)
    values (${sqlLiteral(professionalA)}, true);
  `, contextA);
  assert.match(preferencesError, /professional_notification_preferences_external_disabled|check constraint|row-level security/i);

  const unauthorizedClaim = harness.expectError(
    database,
    `select count(*) from public.claim_pending_notification_events(10);`,
    contextA,
  );
  assert.match(unauthorizedClaim, /permission denied/i);
  assert.equal(harness.run(database, `select count(*) from public.claim_pending_notification_events(10);`, { dbRole: "service_role" }), "1");
  harness.run(database, `
    update public.professional_notification_events
    set status = 'failed', scheduled_for = now() + interval '1 hour'
    where id = ${sqlLiteral(pendingNotificationId)};
  `, { dbRole: "postgres", requestRole: "service_role" });
  assert.equal(harness.run(database, `select count(*) from public.claim_pending_notification_events(10);`, { dbRole: "service_role" }), "0");
  harness.run(database, `
    update public.professional_notification_events
    set scheduled_for = now() - interval '1 second'
    where id = ${sqlLiteral(pendingNotificationId)};
  `, { dbRole: "postgres", requestRole: "service_role" });
  assert.equal(harness.run(database, `select count(*) from public.claim_pending_notification_events(10);`, { dbRole: "service_role" }), "1");
  harness.run(database, `
    update public.professional_notification_events
    set status = 'failed', scheduled_for = now() - interval '1 second'
    where id = ${sqlLiteral(pendingNotificationId)};
  `, { dbRole: "postgres", requestRole: "service_role" });
  assert.equal(harness.run(database, `select count(*) from public.claim_pending_notification_events(10);`, { dbRole: "service_role" }), "0");
  assert.equal(harness.run(database, `
    select status || ':' || attempt_count::text
    from public.professional_notification_events where id = ${sqlLiteral(pendingNotificationId)};
  `), "failed:2");
  harness.run(database, `
    insert into public.professional_notification_events (
      id, professional_id, event_type, channel_type, payload, status
    ) values (
      ${sqlLiteral(concurrentlyLockedNotificationId)}, ${sqlLiteral(professionalA)}, 'operational_alert', 'in_app', '{}'::jsonb, 'pending'
    );
  `);
  const lockPromise = harness.runConcurrent(database, `
    begin;
    select id from public.professional_notification_events
    where id = ${sqlLiteral(concurrentlyLockedNotificationId)} for update;
    select pg_sleep(1);
    commit;
  `);
  await new Promise((resolve) => setTimeout(resolve, 150));
  assert.equal(harness.run(database, `select count(*) from public.claim_pending_notification_events(10);`, { dbRole: "service_role" }), "0");
  const lockResult = await lockPromise;
  assert.equal(lockResult.ok, true, lockResult.stderr);
  assert.equal(harness.run(database, `select count(*) from public.claim_pending_notification_events(10);`, { dbRole: "service_role" }), "1");

  const expiredDocumentId = randomUUID();
  harness.run(database, `
    insert into public.professional_documents (
      id, professional_id, document_type, storage_path, original_filename, mime_type, file_size, verification_status, expires_at
    ) values (
      ${sqlLiteral(expiredDocumentId)}, ${sqlLiteral(professionalA)}, 'other',
      ${sqlLiteral(`professionals/${professionalA}/documents/${expiredDocumentId}/expired.pdf`)},
      'expired.pdf', 'application/pdf', 128, 'pending', now() - interval '1 day'
    );
  `);
  assert.equal(harness.run(database, `select count(*) from public.claim_expired_professional_documents(10);`, { dbRole: "service_role" }), "1");
  assert.equal(harness.run(database, `select count(*) from public.claim_expired_professional_documents(10);`, { dbRole: "service_role" }), "0");
});

test("expired recommended documents do not revoke verification while required documents trigger review", { concurrency: false }, async (t) => {
  const isolated = await createIsolatedDatabase(t, "prompt12_document_requirements");
  if (!isolated) return;

  const { harness, database } = isolated;
  const userId = randomUUID();
  const professionalId = randomUUID();
  const recommendedDocumentId = randomUUID();
  const requiredDocumentId = randomUUID();
  seedProfessional(harness, database, professionalId, userId, "requirements@example.com", "Dakbedrijf Requirements");
  harness.run(database, `update public.professionals set verification_status = 'verified' where id = ${sqlLiteral(professionalId)};`);

  harness.run(database, `
    insert into public.professional_documents (
      id, professional_id, document_type, storage_path, original_filename, mime_type, file_size, verification_status
    ) values (
      ${sqlLiteral(recommendedDocumentId)}, ${sqlLiteral(professionalId)}, 'liability_insurance',
      ${sqlLiteral(`professionals/${professionalId}/documents/${recommendedDocumentId}/recommended.pdf`)},
      'recommended.pdf', 'application/pdf', 128, 'pending'
    );
  `);
  assert.equal(harness.run(database, `select verification_status from public.professionals where id = ${sqlLiteral(professionalId)};`), "verified");

  harness.run(database, `
    insert into public.professional_documents (
      id, professional_id, document_type, storage_path, original_filename, mime_type, file_size, verification_status
    ) values (
      ${sqlLiteral(requiredDocumentId)}, ${sqlLiteral(professionalId)}, 'kvk_extract',
      ${sqlLiteral(`professionals/${professionalId}/documents/${requiredDocumentId}/required.pdf`)},
      'required.pdf', 'application/pdf', 128, 'pending'
    );
  `);
  assert.equal(harness.run(database, `select verification_status from public.professionals where id = ${sqlLiteral(professionalId)};`), "pending");
});

test("distribution lifecycle hooks enqueue private idempotent professional and admin notifications", { concurrency: false }, async (t) => {
  const isolated = await createIsolatedDatabase(t, "prompt12_distribution_notifications");
  if (!isolated) return;

  const { harness, database } = isolated;
  const userId = randomUUID();
  const professionalId = randomUUID();
  const serviceId = randomUUID();
  const leadId = randomUUID();
  const runId = randomUUID();
  const candidateId = randomUUID();
  const assignmentId = randomUUID();
  const professionalContext = buildUserContext(userId, "professional");
  seedProfessional(harness, database, professionalId, userId, "distribution-events@example.com", "Dakbedrijf Distribution Events");
  harness.run(database, `
    grant select on public.professionals to authenticated;
    insert into public.services (id, name, slug, category, active)
    values (${sqlLiteral(serviceId)}, 'Dakreparatie', 'dakreparatie-events', 'Dakwerk', true);
    insert into public.leads (
      id, public_reference, service_id, first_name, last_name, email, phone, postal_code,
      house_number, city, description, urgency, status, lead_score, commercial_type,
      max_buyers, buyers_count, sales_status, subservice_slug
    ) values (
      ${sqlLiteral(leadId)}, 'VC-${leadId.slice(0, 8).toUpperCase()}', ${sqlLiteral(serviceId)},
      'Test', 'Lead', 'private@example.com', '0612345678', '1234AB', '10', 'Amsterdam',
      'Er is sprake van een dringende dakreparatie met voldoende testdetails voor deze leadflow.',
      'normal', 'matched', 80, 'exclusive', 1, 0, 'available', 'dakreparatie'
    );
    insert into public.lead_distribution_runs (id, lead_id, commercial_type, status)
    values (${sqlLiteral(runId)}, ${sqlLiteral(leadId)}, 'exclusive', 'active');
    insert into public.lead_distribution_candidates (
      id, distribution_run_id, lead_id, professional_id, rank_position, status
    ) values (
      ${sqlLiteral(candidateId)}, ${sqlLiteral(runId)}, ${sqlLiteral(leadId)}, ${sqlLiteral(professionalId)}, 1, 'queued'
    );
    update public.lead_distribution_candidates set status = 'offered', offered_at = now()
    where id = ${sqlLiteral(candidateId)};
    update public.lead_distribution_candidates set status = 'expired', expired_at = now()
    where id = ${sqlLiteral(candidateId)};
    update public.lead_distribution_candidates set status = 'expired'
    where id = ${sqlLiteral(candidateId)};
    insert into public.lead_assignments (id, lead_id, professional_id, status)
    values (${sqlLiteral(assignmentId)}, ${sqlLiteral(leadId)}, ${sqlLiteral(professionalId)}, 'pending');
    update public.lead_distribution_runs set status = 'exhausted' where id = ${sqlLiteral(runId)};
    update public.lead_distribution_runs set status = 'exhausted' where id = ${sqlLiteral(runId)};
  `);

  const notificationCounts = harness.queryRowJson<{
    offer_received: number;
    offer_expired: number;
    assignment_created: number;
    exhausted: number;
    pii_fields: number;
  }>(database, `
    select
      count(*) filter (where event_type = 'lead_offer_received')::int as offer_received,
      count(*) filter (where event_type = 'lead_offer_expired')::int as offer_expired,
      count(*) filter (where event_type = 'lead_assignment_created')::int as assignment_created,
      count(*) filter (where event_type = 'distribution_exhausted')::int as exhausted,
      count(*) filter (where payload ?| array['phone', 'email', 'address', 'exact_address'])::int as pii_fields
    from public.professional_notification_events;
  `);
  assert.deepEqual(notificationCounts, {
    offer_received: 1,
    offer_expired: 1,
    assignment_created: 1,
    exhausted: 1,
    pii_fields: 0,
  });
  assert.equal(harness.run(database, `
    select count(*) from public.professional_notification_events
    where professional_id = ${sqlLiteral(professionalId)};
  `, professionalContext), "3");

  const systemEventId = harness.run(database, `
    select id from public.professional_notification_events
    where event_type = 'distribution_exhausted';
  `);
  harness.run(database, `
    update public.professional_notification_events set read_at = '2026-01-01T00:00:00Z'::timestamptz
    where id = ${sqlLiteral(systemEventId)};
  `, harness.adminContext);
  harness.run(database, `
    update public.professional_notification_events set read_at = now()
    where id = ${sqlLiteral(systemEventId)};
  `, professionalContext);
  assert.equal(harness.run(database, `
    select (read_at = '2026-01-01T00:00:00Z'::timestamptz)::text
    from public.professional_notification_events where id = ${sqlLiteral(systemEventId)};
  `), "true");
});

test("approved document storage cannot be deleted directly while pending documents can be deleted through the controlled flow", { concurrency: false }, async (t) => {
  const isolated = await createIsolatedDatabase(t, "prompt11_documents");
  if (!isolated) return;

  const { harness, database } = isolated;
  const userId = randomUUID();
  const professionalId = randomUUID();
  const context = buildUserContext(userId, "professional");
  seedProfessional(harness, database, professionalId, userId, "prodocs@example.com", "Dakbedrijf Docs");

  const approvedDocumentId = randomUUID();
  const pendingDocumentId = randomUUID();
  const approvedPath = `professionals/${professionalId}/documents/${approvedDocumentId}/approved.pdf`;
  const pendingPath = `professionals/${professionalId}/documents/${pendingDocumentId}/pending.pdf`;

  harness.run(database, `
    insert into public.professional_documents (
      id, professional_id, document_type, storage_path, original_filename, mime_type, file_size, verification_status
    ) values
      (${sqlLiteral(approvedDocumentId)}, ${sqlLiteral(professionalId)}, 'kvk_extract', ${sqlLiteral(approvedPath)}, 'approved.pdf', 'application/pdf', 128, 'approved'),
      (${sqlLiteral(pendingDocumentId)}, ${sqlLiteral(professionalId)}, 'other', ${sqlLiteral(pendingPath)}, 'pending.pdf', 'application/pdf', 128, 'pending');

    insert into storage.objects (bucket_id, name, owner)
    values
      ('professional-documents', ${sqlLiteral(approvedPath)}, ${sqlLiteral(userId)}),
      ('professional-documents', ${sqlLiteral(pendingPath)}, ${sqlLiteral(userId)});
  `);

  const directDeleteError = harness.expectError(
    database,
    `delete from storage.objects where bucket_id = 'professional-documents' and name = ${sqlLiteral(approvedPath)};`,
    context,
  );
  assert.match(directDeleteError, /permission denied|row-level security/i);

  const removedPath = harness.run(
    database,
    `select public.delete_own_pending_professional_document(${sqlLiteral(pendingDocumentId)});`,
    context,
  );
  assert.equal(removedPath, pendingPath);

  const counts = harness.queryRowJson<{ pending_count: number; approved_count: number }>(
    database,
    `
      select
        count(*) filter (where id = ${sqlLiteral(pendingDocumentId)})::int as pending_count,
        count(*) filter (where id = ${sqlLiteral(approvedDocumentId)})::int as approved_count
      from public.professional_documents
      where professional_id = ${sqlLiteral(professionalId)};
    `,
  );
  assert.equal(counts.pending_count, 0);
  assert.equal(counts.approved_count, 1);
});

type TransitionRow = {
  professional_id: string;
  onboarding_status: string;
  onboarding_step: string;
  submitted_for_review_at: string | null;
};

function grantSupabaseTableDefaults(harness: Harness, database: string) {
  harness.run(database, `
    grant usage on schema public to authenticated;
    grant select, insert, update, delete on public.professionals, public.professional_documents to authenticated;
  `);
}

function walkOnboardingToReview(harness: Harness, database: string, context: SessionContext) {
  for (const step of ["company", "contact", "services", "areas", "experience", "capacity", "documents", "review"]) {
    harness.run(database, `select * from public.transition_own_professional_onboarding('${step}', false);`, context);
  }
}

test("onboarding submit returns exactly once and resubmit after changes_requested stays submitted", { concurrency: false }, async (t) => {
  const isolated = await createIsolatedDatabase(t, "prompt11_resubmit");
  if (!isolated) return;

  const { harness, database } = isolated;
  const userId = randomUUID();
  const professionalId = randomUUID();
  const context = buildUserContext(userId, "professional");
  seedProfessional(harness, database, professionalId, userId, "resubmit@example.com", "Dakbedrijf Resubmit");
  grantSupabaseTableDefaults(harness, database);

  walkOnboardingToReview(harness, database, context);

  const submittedRows = harness.run(
    database,
    `select count(*)::int from public.transition_own_professional_onboarding('review', true);`,
    context,
  );
  assert.equal(submittedRows, "1");

  const afterSubmit = harness.queryRowJson<{ onboarding_status: string; verification_status: string; submitted_for_review_at: string | null }>(
    database,
    `select onboarding_status, verification_status, submitted_for_review_at from public.professionals where id = ${sqlLiteral(professionalId)}`,
  );
  assert.equal(afterSubmit.onboarding_status, "submitted");
  assert.equal(afterSubmit.verification_status, "pending");
  assert.notEqual(afterSubmit.submitted_for_review_at, null);

  const doubleSubmit = harness.expectError(
    database,
    `select * from public.transition_own_professional_onboarding('review', true);`,
    context,
  );
  assert.match(doubleSubmit, /INVALID_ONBOARDING_SUBMIT_STATE/);

  harness.run(
    database,
    `    update public.professionals set onboarding_status = 'changes_requested', verification_status = 'changes_requested' where id = ${sqlLiteral(professionalId)};
  `, harness.adminContext);
  harness.run(database, `
    insert into public.professional_review_feedback (professional_id, section, message, status)
    values (${sqlLiteral(professionalId)}, 'review', 'Upload een bijgewerkt document.', 'open');
  `);

  const resubmitted = harness.queryRowJson<TransitionRow>(
    database,
    `select * from public.transition_own_professional_onboarding('review', true);`,
    context,
  );
  assert.equal(resubmitted.onboarding_status, "submitted");
  assert.equal(resubmitted.onboarding_step, "review");
  assert.notEqual(resubmitted.submitted_for_review_at, null);
  assert.equal(harness.run(database, `
    select status || ':' || (resolved_at is not null)::text
    from public.professional_review_feedback
    where professional_id = ${sqlLiteral(professionalId)};
  `), "resolved:true");

  const persisted = harness.queryRowJson<{ onboarding_status: string; submitted_for_review_at: string | null }>(
    database,
    `select onboarding_status, submitted_for_review_at from public.professionals where id = ${sqlLiteral(professionalId)}`,
  );
  assert.equal(persisted.onboarding_status, "submitted");
  assert.notEqual(persisted.submitted_for_review_at, null);

  harness.run(
    database,
    `update public.professionals set onboarding_status = 'changes_requested', verification_status = 'changes_requested' where id = ${sqlLiteral(professionalId)};`,
    harness.adminContext,
  );
  const restarted = harness.queryRowJson<TransitionRow>(
    database,
    `select * from public.transition_own_professional_onboarding('company', false);`,
    context,
  );
  assert.equal(restarted.onboarding_status, "in_progress");
  assert.equal(restarted.onboarding_step, "review");
  assert.equal(restarted.submitted_for_review_at, null);

  const approveSelf = harness.expectError(
    database,
    `update public.professionals set onboarding_status = 'approved' where id = ${sqlLiteral(professionalId)};`,
    context,
  );
  assert.match(approveSelf, /PROFESSIONAL_ADMIN_FIELDS_IMMUTABLE|permission denied/i);

  const qualityEscalation = harness.expectError(
    database,
    `update public.professionals set quality_score = 100 where id = ${sqlLiteral(professionalId)};`,
    context,
  );
  assert.match(qualityEscalation, /PROFESSIONAL_ADMIN_FIELDS_IMMUTABLE|permission denied/i);
});

test("document metadata cannot spoof storage paths, self-approve or be rebound to another professional", { concurrency: false }, async (t) => {
  const isolated = await createIsolatedDatabase(t, "prompt11_document_paths");
  if (!isolated) return;

  const { harness, database } = isolated;
  const userA = randomUUID();
  const userB = randomUUID();
  const professionalA = randomUUID();
  const professionalB = randomUUID();
  const contextA = buildUserContext(userA, "professional");
  seedProfessional(harness, database, professionalA, userA, "patha@example.com", "Dakbedrijf Pad A");
  seedProfessional(harness, database, professionalB, userB, "pathb@example.com", "Dakbedrijf Pad B");
  grantSupabaseTableDefaults(harness, database);

  const insertDocument = (documentId: string, ownerId: string, storagePath: string, status = "pending") => `
    insert into public.professional_documents (
      id, professional_id, document_type, storage_path, original_filename, mime_type, file_size, verification_status
    ) values (
      ${sqlLiteral(documentId)}, ${sqlLiteral(ownerId)}, 'other', ${sqlLiteral(storagePath)}, 'doc.pdf', 'application/pdf', 128, ${sqlLiteral(status)}
    );
  `;

  const spoofedDocumentId = randomUUID();
  const spoofedPath = harness.expectError(
    database,
    insertDocument(spoofedDocumentId, professionalA, `professionals/${professionalB}/documents/${spoofedDocumentId}/doc.pdf`),
    contextA,
  );
  assert.match(spoofedPath, /PROFESSIONAL_DOCUMENT_PATH_NOT_OWNED|row-level security/i);

  const mismatchedDocumentId = randomUUID();
  const mismatchedDocument = harness.expectError(
    database,
    insertDocument(mismatchedDocumentId, professionalA, `professionals/${professionalA}/documents/${randomUUID()}/doc.pdf`),
    contextA,
  );
  assert.match(mismatchedDocument, /PROFESSIONAL_DOCUMENT_PATH_NOT_OWNED|row-level security/i);

  const traversalDocumentId = randomUUID();
  const traversal = harness.expectError(
    database,
    insertDocument(traversalDocumentId, professionalA, `professionals/${professionalA}/documents/${traversalDocumentId}/../../${professionalB}/doc.pdf`),
    contextA,
  );
  assert.match(traversal, /PROFESSIONAL_DOCUMENT_PATH_NOT_OWNED|row-level security/i);

  const selfApprovedId = randomUUID();
  const selfApproved = harness.expectError(
    database,
    insertDocument(selfApprovedId, professionalA, `professionals/${professionalA}/documents/${selfApprovedId}/doc.pdf`, "approved"),
    contextA,
  );
  assert.match(selfApproved, /PROFESSIONAL_DOCUMENT_REVIEW_FIELDS_IMMUTABLE|row-level security/i);

  const otherOwnerId = randomUUID();
  const otherOwner = harness.expectError(
    database,
    insertDocument(otherOwnerId, professionalB, `professionals/${professionalB}/documents/${otherOwnerId}/doc.pdf`),
    contextA,
  );
  assert.match(otherOwner, /row-level security|PROFESSIONAL_DOCUMENT/i);

  const validDocumentId = randomUUID();
  const validPath = `professionals/${professionalA}/documents/${validDocumentId}/doc.pdf`;
  harness.run(database, insertDocument(validDocumentId, professionalA, validPath), contextA);

  const adminSpoofId = randomUUID();
  const adminSpoof = harness.expectError(
    database,
    insertDocument(adminSpoofId, professionalA, `professionals/${professionalB}/documents/${adminSpoofId}/doc.pdf`),
    harness.adminContext,
  );
  assert.match(adminSpoof, /PROFESSIONAL_DOCUMENT_PATH_NOT_OWNED/);

  const rebind = harness.expectError(
    database,
    `update public.professional_documents set professional_id = ${sqlLiteral(professionalB)} where id = ${sqlLiteral(validDocumentId)};`,
    harness.adminContext,
  );
  assert.match(rebind, /PROFESSIONAL_DOCUMENT_BINDING_IMMUTABLE/);

  const repath = harness.expectError(
    database,
    `update public.professional_documents set storage_path = ${sqlLiteral(`professionals/${professionalB}/documents/${validDocumentId}/doc.pdf`)} where id = ${sqlLiteral(validDocumentId)};`,
    harness.adminContext,
  );
  assert.match(repath, /PROFESSIONAL_DOCUMENT_BINDING_IMMUTABLE/);

  harness.run(
    database,
    `update public.professional_documents set verification_status = 'approved', reviewed_at = timezone('utc', now()) where id = ${sqlLiteral(validDocumentId)};`,
    harness.adminContext,
  );

  const approvedDelete = harness.expectError(
    database,
    `select public.delete_own_pending_professional_document(${sqlLiteral(validDocumentId)});`,
    contextA,
  );
  assert.match(approvedDelete, /DOCUMENT_DELETE_FORBIDDEN/);

  const directDelete = harness.run(
    database,
    `with removed as (delete from public.professional_documents where id = ${sqlLiteral(validDocumentId)} returning id) select count(*)::int from removed;`,
    contextA,
  );
  assert.equal(directDelete, "0");

  const ownership = harness.queryRowJson<{ owned: boolean; null_owner: boolean; null_path: boolean }>(
    database,
    `select
      public.professional_document_storage_path_is_owned(${sqlLiteral(validPath)}, ${sqlLiteral(professionalA)}) as owned,
      public.professional_document_storage_path_is_owned(${sqlLiteral(validPath)}, null) as null_owner,
      public.professional_document_storage_path_is_owned(null, ${sqlLiteral(professionalA)}) as null_path`,
  );
  assert.deepEqual(ownership, { owned: true, null_owner: false, null_path: false });
});

test("trigger-only helpers are not executable by authenticated users", { concurrency: false }, async (t) => {
  const isolated = await createIsolatedDatabase(t, "prompt11_privileges");
  if (!isolated) return;

  const { harness, database } = isolated;
  const privileges = harness.queryRowJson<Record<string, boolean>>(
    database,
    `select
      has_function_privilege('authenticated', 'public.enforce_professional_self_update()', 'execute') as self_update,
      has_function_privilege('authenticated', 'public.protect_professional_document_delete()', 'execute') as document_delete,
      has_function_privilege('authenticated', 'public.enforce_professional_document_integrity()', 'execute') as document_integrity,
      has_function_privilege('authenticated', 'public.touch_professional_verification_on_document_change()', 'execute') as touch_verification,
      has_function_privilege('authenticated', 'public.track_professional_audit_after_change()', 'execute') as audit_trigger,
      has_function_privilege('authenticated', 'public.track_professional_document_audit_after_change()', 'execute') as document_audit_trigger,
      has_function_privilege('authenticated', 'public.append_professional_audit_log(uuid, uuid, professional_audit_event_type, jsonb)', 'execute') as append_audit,
      has_function_privilege('authenticated', 'public.enqueue_professional_notification(uuid, professional_notification_event_type, jsonb)', 'execute') as enqueue_notification,
      has_function_privilege('anon', 'public.transition_own_professional_onboarding(professional_onboarding_step, boolean)', 'execute') as anon_transition,
      has_function_privilege('anon', 'public.delete_own_pending_professional_document(uuid)', 'execute') as anon_delete,
      has_function_privilege('authenticated', 'public.transition_own_professional_onboarding(professional_onboarding_step, boolean)', 'execute') as authenticated_transition,
      has_function_privilege('authenticated', 'public.delete_own_pending_professional_document(uuid)', 'execute') as authenticated_delete`,
  );
  assert.deepEqual(privileges, {
    self_update: false,
    document_delete: false,
    document_integrity: false,
    touch_verification: false,
    audit_trigger: false,
    document_audit_trigger: false,
    append_audit: false,
    enqueue_notification: false,
    anon_transition: false,
    anon_delete: false,
    authenticated_transition: true,
    authenticated_delete: true,
  });
});
