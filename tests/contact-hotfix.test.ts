import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { contactSubmissionStatusSchema, publicContactSchema } from "../lib/validation/public.ts";

const migrationPath =
  "/home/runner/work/VakConnect/VakConnect/supabase/migrations/20260909170000_contact_submissions_hotfix.sql";
const sql = readFileSync(migrationPath, "utf8");

test("contact schema accepteert geldige submission", () => {
  const result = publicContactSchema.safeParse({
    reason: "consument",
    name: "Jan Jansen",
    email: "jan@example.com",
    phone: "0612345678",
    message: "Ik wil graag advies over een dakrenovatie en mogelijke planning.",
    honeypot: "",
  });

  assert.equal(result.success, true);
});

test("contact schema weigert ongeldige email", () => {
  const result = publicContactSchema.safeParse({
    reason: "consument",
    name: "Jan Jansen",
    email: "geen-email",
    phone: "",
    message: "Ik wil graag advies over een dakrenovatie en mogelijke planning.",
    honeypot: "",
  });

  assert.equal(result.success, false);
});

test("contact schema weigert te lang bericht", () => {
  const result = publicContactSchema.safeParse({
    reason: "consument",
    name: "Jan Jansen",
    email: "jan@example.com",
    phone: "",
    message: "a".repeat(3001),
    honeypot: "",
  });

  assert.equal(result.success, false);
});

test("contact schema blokkeert honeypot", () => {
  const result = publicContactSchema.safeParse({
    reason: "consument",
    name: "Jan Jansen",
    email: "jan@example.com",
    phone: "",
    message: "Ik wil graag advies over een dakrenovatie en mogelijke planning.",
    honeypot: "spam-bot",
  });

  assert.equal(result.success, false);
});

test("contact statusvalidatie accepteert alleen toegestane statussen", () => {
  assert.equal(contactSubmissionStatusSchema.safeParse("handled").success, true);
  assert.equal(contactSubmissionStatusSchema.safeParse("archived").success, false);
});

test("contact migration bestaat en definieert contact_submissions", () => {
  assert.match(sql, /create table public\.contact_submissions/);
  assert.match(sql, /status contact_submission_status not null default 'new'/);
});

test("contact migration activeert RLS met admin-only policy", () => {
  assert.match(sql, /alter table public\.contact_submissions enable row level security;/);
  assert.match(sql, /create policy "admins manage contact submissions"/);
  assert.equal(sql.includes("for select"), false);
  assert.equal(sql.includes("for insert"), false);
  assert.equal(sql.includes("for update"), false);
  assert.equal(sql.includes("for delete"), false);
});
