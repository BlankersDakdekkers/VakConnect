import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";

const migrationPath =
  "/home/runner/work/VakConnect/VakConnect/supabase/migrations/20260909124500_initial_vakconnect_schema.sql";
const sql = readFileSync(migrationPath, "utf8");

test("migration defines professionals table before current_professional_id", () => {
  const professionalsTableIndex = sql.indexOf("create table public.professionals");
  const currentProfessionalIdFunctionIndex = sql.indexOf("create or replace function public.current_professional_id()");

  assert.ok(professionalsTableIndex !== -1, "professionals table definition not found");
  assert.ok(currentProfessionalIdFunctionIndex !== -1, "current_professional_id function definition not found");
  assert.ok(
    professionalsTableIndex < currentProfessionalIdFunctionIndex,
    "current_professional_id must be defined after professionals table",
  );
});

test("migration hardens professional assignment updates", () => {
  assert.match(sql, /create trigger enforce_lead_assignments_update/);
  assert.match(sql, /if new\.lead_id <> old\.lead_id then/);
  assert.match(sql, /if new\.professional_id <> old\.professional_id then/);
  assert.match(sql, /with check \([\s\S]*status in \('viewed', 'accepted', 'rejected'\)/);
});

test("migrations leave storage.objects RLS to the hosted Supabase platform", () => {
  const directory = "/home/runner/work/VakConnect/VakConnect/supabase/migrations";
  for (const file of readdirSync(directory).filter((name) => name.endsWith(".sql"))) {
    assert.doesNotMatch(
      readFileSync(`${directory}/${file}`, "utf8"),
      /alter\s+table\s+(?:only\s+)?(?:"?storage"?\s*\.\s*"?objects"?)\s+(?:enable|disable|force|no\s+force)\s+row\s+level\s+security/i,
      `${file} must not alter platform-managed storage RLS`,
    );
  }
  assert.match(sql, /create policy "admins manage lead image storage"/);
  assert.match(sql, /'lead-images',\s*'lead-images',\s*false/);
});
