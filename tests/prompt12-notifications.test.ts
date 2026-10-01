import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const repoRoot = "/home/runner/work/VakConnect/VakConnect";
const migration = readFileSync(`${repoRoot}/supabase/migrations/20261001100000_prompt12_notifications_operations.sql`, "utf8");
const notificationWorker = readFileSync(`${repoRoot}/app/api/internal/notifications/process/route.ts`, "utf8");
const operationsWorker = readFileSync(`${repoRoot}/app/api/internal/operations/check/route.ts`, "utf8");
const documentWorker = readFileSync(`${repoRoot}/app/api/internal/documents/expiry/route.ts`, "utf8");
const reminderWorker = readFileSync(`${repoRoot}/app/api/internal/reminders/process/route.ts`, "utf8");

test("Prompt 12 extends existing notification events with lifecycle and idempotency fields", () => {
  assert.match(migration, /alter table public\.professional_notification_events/);
  assert.match(migration, /add column if not exists deduplication_key text/);
  assert.match(migration, /add column if not exists read_at timestamptz/);
  assert.match(migration, /professional_notification_events_deduplication_key_idx/);
  assert.match(migration, /check \(status in \('pending', 'processing', 'delivered', 'failed', 'cancelled'\)\)/);
  assert.match(migration, /check \(channel_type in \('in_app', 'system', 'email', 'sms', 'whatsapp'\)\)/);
});

test("notification claims use database row locking and service-role-only execution", () => {
  assert.match(migration, /claim_pending_notification_events/);
  assert.match(migration, /for update skip locked/i);
  assert.match(migration, /revoke all on function public\.claim_pending_notification_events\(integer\) from public, anon, authenticated/);
  assert.match(migration, /grant execute on function public\.claim_pending_notification_events\(integer\) to service_role/);
  assert.match(migration, /claim_expired_professional_documents/);
  assert.match(migration, /grant execute on function public\.claim_expired_professional_documents\(integer\) to service_role/);
});

test("notification preferences keep all external channels disabled", () => {
  assert.match(migration, /professional_notification_preferences_external_disabled/);
  assert.match(migration, /check \(not email_enabled and not sms_enabled and not whatsapp_enabled\)/);
});

test("all internal Prompt 12 processing routes expose POST handlers only", () => {
  for (const source of [notificationWorker, operationsWorker, documentWorker, reminderWorker]) {
    assert.match(source, /export async function POST\(request: Request\)/);
    assert.doesNotMatch(source, /export async function GET/);
  }
});
