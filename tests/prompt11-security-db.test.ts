import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
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
