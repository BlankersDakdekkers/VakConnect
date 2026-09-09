import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const migrationPath =
  "/home/runner/work/VakConnect/VakConnect/supabase/migrations/20260909152000_phase3_analytics_operations.sql";
const sql = readFileSync(migrationPath, "utf8");

test("phase3 migration adds attribution and onboarding fields", () => {
  assert.match(sql, /add column utm_source text/);
  assert.match(sql, /add column utm_medium text/);
  assert.match(sql, /add column first_touch_source text/);
  assert.match(sql, /add column first_touch_timestamp timestamptz/);
  assert.match(sql, /add column verification_status professional_verification_status/);
  assert.match(sql, /add column description text/);
});

test("phase3 migration creates analytics and activity tables with RLS", () => {
  assert.match(sql, /create table public\.analytics_events/);
  assert.match(sql, /create table public\.lead_activity/);
  assert.match(sql, /alter table public\.analytics_events enable row level security;/);
  assert.match(sql, /alter table public\.lead_activity enable row level security;/);
  assert.match(sql, /create policy "admins manage analytics events"/);
  assert.match(sql, /create policy "professionals can read lead activity for assigned leads"/);
});

test("phase3 migration adds lead progress and performance indexes", () => {
  assert.match(sql, /add column progress_status lead_progress_status/);
  assert.match(sql, /create index analytics_events_event_name_idx/);
  assert.match(sql, /create index analytics_events_created_at_idx/);
  assert.match(sql, /create index analytics_events_lead_id_idx/);
  assert.match(sql, /create index lead_activity_lead_id_idx/);
  assert.match(sql, /create index lead_activity_professional_id_idx/);
  assert.match(sql, /create index professional_service_areas_professional_id_idx/);
});
