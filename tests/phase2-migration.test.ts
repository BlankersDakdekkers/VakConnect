import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const migrationPath =
  "/home/runner/work/VakConnect/VakConnect/supabase/migrations/20260909133000_phase2_dynamic_intake.sql";
const sql = readFileSync(migrationPath, "utf8");

test("phase2 migration creates dynamic intake tables and score columns", () => {
  assert.match(sql, /create table public\.service_questions/);
  assert.match(sql, /create table public\.service_question_options/);
  assert.match(sql, /create table public\.lead_answers/);
  assert.match(sql, /create table public\.lead_matches/);
  assert.match(sql, /add column lead_score integer/);
  assert.match(sql, /add column score_reasons jsonb/);
  assert.match(sql, /check \(lead_score is null or \(lead_score >= 0 and lead_score <= 100\)\)/);
});

test("phase2 migration protects dynamic intake tables with RLS", () => {
  assert.match(sql, /alter table public\.service_questions enable row level security;/);
  assert.match(sql, /alter table public\.service_question_options enable row level security;/);
  assert.match(sql, /alter table public\.lead_answers enable row level security;/);
  assert.match(sql, /alter table public\.lead_matches enable row level security;/);
  assert.match(sql, /create policy "service questions are publicly readable when active"/);
  assert.match(sql, /create policy "service question options are publicly readable when active"/);
  assert.match(sql, /create policy "professionals can read lead answers for assigned leads"/);
  assert.match(sql, /create policy "professionals can read own lead matches"/);
});

test("phase2 migration prevents duplicate matches and seeds dakdekker intake", () => {
  assert.match(sql, /unique \(lead_id, professional_id\)/);
  assert.match(sql, /'Wat voor dak heeft de woning\?'/);
  assert.match(sql, /'Waar bevindt het probleem zich\?'/);
  assert.match(sql, /'Is er actieve waterinloop\?'/);
  assert.match(sql, /'Geschatte oppervlakte in m²'/);
});
