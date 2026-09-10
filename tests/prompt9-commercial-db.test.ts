import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
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

  const baseDir = mkdtempSync(join(tmpdir(), "vakconnect-pg-"));
  const dataDir = join(baseDir, "data");
  const socketDir = join(baseDir, "socket");
  const logFile = join(baseDir, "postgres.log");
  const port = String(5600 + Math.floor(Math.random() * 1000));
  const adminContext: SessionContext = { dbRole: "authenticated", requestRole: "authenticated", appRole: "admin", userId: randomUUID() };
  const templateDb = "vakconnect_template";
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
