import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { calculateProfessionalQuality, getProfessionalQualityLabel, minimumProfessionalQualityScore } from "../lib/professionals/onboarding.ts";
import { buildProfessionalDocumentPath, validateProfessionalDocument } from "../lib/storage/professional-document-utils.ts";
import { evaluateDistributionCandidateEligibility, evaluateDistributionEligibility, isDistributionPauseActive } from "../lib/distribution/scoring.ts";

const migrationSql = readFileSync("/home/runner/work/VakConnect/VakConnect/supabase/migrations/20260911100000_phase7_professional_onboarding_verification.sql", "utf8");
const hardeningMigrationSql = readFileSync("/home/runner/work/VakConnect/VakConnect/supabase/migrations/20260911110000_phase7_professional_onboarding_security_hardening.sql", "utf8");
const onboardingPageSource = readFileSync("/home/runner/work/VakConnect/VakConnect/app/(professional)/vakman/onboarding/page.tsx", "utf8");
const verificationPageSource = readFileSync("/home/runner/work/VakConnect/VakConnect/app/(admin)/admin/verificatie/page.tsx", "utf8");
const documentStorageSource = readFileSync("/home/runner/work/VakConnect/VakConnect/lib/storage/professional-documents.ts", "utf8");
const actionsSource = readFileSync("/home/runner/work/VakConnect/VakConnect/lib/professionals/actions.ts", "utf8");
const engineSource = readFileSync("/home/runner/work/VakConnect/VakConnect/lib/distribution/engine.ts", "utf8");
const scoringSource = readFileSync("/home/runner/work/VakConnect/VakConnect/lib/distribution/scoring.ts", "utf8");
const postMergeHardeningSql = readFileSync("/home/runner/work/VakConnect/VakConnect/supabase/migrations/20260919104000_prompt11_post_merge_hardening.sql", "utf8");

test("phase7 migration adds onboarding, verification, document and audit schema", () => {
  assert.match(migrationSql, /professional_onboarding_status/);
  assert.match(migrationSql, /create table if not exists public\.professional_documents/);
  assert.match(migrationSql, /create table if not exists public\.professional_review_feedback/);
  assert.match(migrationSql, /create table if not exists public\.professional_audit_log/);
  assert.match(migrationSql, /create type professional_onboarding_status/);
  assert.match(migrationSql, /changes_requested/);
  assert.match(migrationSql, /suspended/);
});

test("phase7 migration configures private document storage and strict RLS", () => {
  assert.match(migrationSql, /professional-documents/);
  assert.match(migrationSql, /create policy "professionals read own document metadata"/);
  assert.match(migrationSql, /create policy "professionals upload own document metadata"/);
  assert.match(migrationSql, /create policy "admins manage professional documents"/);
  assert.match(migrationSql, /security definer/);
  assert.match(migrationSql, /set search_path = public, pg_temp/);
  assert.match(migrationSql, /revoke all on function/);
  assert.match(migrationSql, /APPROVED_DOCUMENT_DELETE_FORBIDDEN/);
});

test("quality scoring is deterministic and labels completeness tiers", () => {
  const baseInput = {
    professional: {
      companyName: "Dakdekker Breda",
      tradeName: "Dak & Co",
      contactName: "Jan Jansen",
      email: "jan@example.com",
      phone: "0612345678",
      website: "https://example.com",
      kvkNumber: "12345678",
      btwNumber: "NL123456789B01",
      identityType: "zzp" as const,
      addressLine1: "Markt 1",
      postalCode: "4811AB",
      city: "Breda",
      province: "Noord-Brabant",
      yearsExperience: 12,
      teamSize: 3,
      description: "Ervaren dakdekker voor renovatie en lekkages.",
      specialties: ["dakrenovatie", "daklekkage"],
      onboardingStatus: "approved" as const,
      verificationStatus: "verified" as const,
    },
    services: [{ active: true, yearsExperience: 8, specializationSummary: "Plat dak", preferredLeadType: "shared" as const }],
    areas: [{ id: "1", postalCodePrefix: "4811", city: "Breda", province: "Noord-Brabant", radiusKm: 15 }],
    settings: {
      maxOpenOffers: 4,
      maxActiveAssignments: 8,
      paused: false,
      pauseUntil: null,
      preferredLeadTypes: ["shared" as const],
      availabilityStatus: "available" as const,
      availableFrom: null,
      unavailableUntil: null,
    },
    documents: [{ documentType: "kvk_extract" as const, verificationStatus: "approved" as const, archivedAt: null, expiresAt: null }],
    requiredDocuments: [{ documentType: "kvk_extract" as const, requirementLevel: "required" as const, serviceId: null }],
  };
  const scoreA = calculateProfessionalQuality(baseInput);
  const scoreB = calculateProfessionalQuality(baseInput);
  assert.equal(scoreA.score, scoreB.score);
  assert.deepEqual(scoreA.breakdown, scoreB.breakdown);
  assert.equal(getProfessionalQualityLabel(scoreA.score), "compleet");
  assert.equal(scoreA.distributionEligible, true);
  assert.ok(scoreA.score >= minimumProfessionalQualityScore);
});

test("document validation enforces allowlist, filesize and safe storage path", () => {
  const valid = new File([new Uint8Array([1, 2, 3])], "KvK Uittreksel 2026.pdf", { type: "application/pdf" });
  assert.doesNotThrow(() => validateProfessionalDocument(valid));

  const invalidType = new File([new Uint8Array([1])], "script.exe", { type: "application/x-msdownload" });
  assert.throws(() => validateProfessionalDocument(invalidType), /Alleen PDF, JPG en PNG documenten zijn toegestaan/);

  const path = buildProfessionalDocumentPath("professional-1", "document-1", valid);
  assert.match(path, /^professionals\/professional-1\/documents\/document-1\/[a-f0-9-]+\.pdf$/);
  assert.doesNotMatch(path, /KvK|\s/);
});

test("distribution gating requires approved onboarding, quality and availability", () => {
  const allowedInput = {
    professionalActive: true,
    onboardingComplete: true,
    verificationAllowed: true,
    serviceActive: true,
    areaMatch: true,
    paused: false,
    availabilityAvailable: true,
    alreadyPurchased: false,
    leadCommerciallyAvailable: true,
    openOffers: 1,
    maxOpenOffers: 4,
    activeAssignments: 1,
    maxActiveAssignments: 4,
    qualityScore: minimumProfessionalQualityScore,
    minimumQualityScore: minimumProfessionalQualityScore,
  };
  const allowed = evaluateDistributionEligibility(allowedInput);
  assert.equal(allowed.eligible, true);
  assert.equal(evaluateDistributionEligibility({ ...allowedInput, availabilityAvailable: false }).eligible, false);
  assert.equal(evaluateDistributionEligibility({ ...allowedInput, onboardingComplete: false }).eligible, false);
  assert.equal(evaluateDistributionEligibility({ ...allowedInput, qualityScore: minimumProfessionalQualityScore - 1 }).eligible, false);
});

test("prompt11 UI surfaces exist for onboarding and admin verification", () => {
  assert.match(onboardingPageSource, /Onboarding vakman/);
  assert.match(onboardingPageSource, /step=documents/);
  assert.match(onboardingPageSource, /submitProfessionalOnboardingAction/);
  assert.match(verificationPageSource, /Verificatie/);
  assert.match(verificationPageSource, /getVerificationQueue/);
});

test("document storage and distribution engine use private signed access and onboarding gating", () => {
  assert.match(documentStorageSource, /requireAdminUser/);
  assert.match(documentStorageSource, /from\("professional_documents"\)/);
  assert.match(documentStorageSource, /createSignedUrl/);
  assert.match(engineSource, /evaluateDistributionCandidateEligibility\(candidate, now\)/);
  assert.doesNotMatch(engineSource, /availabilityStatus !== "unavailable"/);
  assert.match(scoringSource, /candidate\.onboardingStatus === "approved"/);
  assert.match(scoringSource, /candidate\.qualityScore/);
  assert.match(scoringSource, /availabilityStatus === "available"/);
});

test("hardening migration removes direct professional document deletes and narrows function execution", () => {
  assert.match(hardeningMigrationSql, /drop policy if exists "professionals delete own pending documents"/);
  assert.match(hardeningMigrationSql, /drop policy if exists "professionals delete own professional document storage"/);
  assert.match(hardeningMigrationSql, /revoke all on function public\.append_professional_audit_log/);
  assert.match(hardeningMigrationSql, /revoke all on function public\.enqueue_professional_notification/);
  assert.match(hardeningMigrationSql, /grant execute on function public\.transition_own_professional_onboarding/);
  assert.match(hardeningMigrationSql, /grant execute on function public\.delete_own_pending_professional_document/);
});

test("server actions use controlled onboarding transitions and storage cleanup flow", () => {
  assert.match(actionsSource, /rpc\("transition_own_professional_onboarding"/);
  assert.match(actionsSource, /rpc\("delete_own_pending_professional_document"/);
  assert.match(actionsSource, /createAdminSupabaseClient\(\)/);
  assert.match(actionsSource, /adminSupabase\.storage\.from\(professionalDocumentsBucket\)\.remove/);
});

test("signed document urls require admin and resolve by document id instead of raw path", async () => {
  assert.match(documentStorageSource, /await dependencies\.requireAdminUser\(\)/);
  assert.match(documentStorageSource, /from\("professional_documents"\)\s*\.select\("id, professional_id, storage_path"\)\s*\.eq\("id", documentId\)/);
  assert.match(documentStorageSource, /isOwnedProfessionalDocumentPath\(document\.storage_path, document\.professional_id, document\.id\)/);
  assert.match(documentStorageSource, /createSignedUrl\(String\(document\.storage_path\)/);
  const adminCheckIndex = documentStorageSource.indexOf("await dependencies.requireAdminUser()");
  const lookupIndex = documentStorageSource.indexOf('from("professional_documents")');
  const signIndex = documentStorageSource.indexOf("createSignedUrl(");
  assert.ok(adminCheckIndex >= 0 && adminCheckIndex < lookupIndex && lookupIndex < signIndex);
  assert.doesNotMatch(documentStorageSource, /createSignedProfessionalDocumentUrl\(path:/);
});

const baseCandidate = {
  professionalStatus: "active",
  onboardingStatus: "approved",
  verificationStatus: "verified",
  qualityScore: minimumProfessionalQualityScore,
  alreadyPurchased: false,
  settings: {
    paused: false,
    pauseUntil: null,
    availabilityStatus: "available",
    maxOpenOffers: 4,
    maxActiveAssignments: 4,
  },
  stats: { openOffers: 0, activeAssignments: 0 },
};

test("candidate eligibility requires availability exactly available and approved onboarding", () => {
  assert.equal(evaluateDistributionCandidateEligibility(baseCandidate).eligible, true);

  for (const availabilityStatus of ["limited", "unavailable", "", "AVAILABLE"]) {
    assert.equal(
      evaluateDistributionCandidateEligibility({ ...baseCandidate, settings: { ...baseCandidate.settings, availabilityStatus } }).eligible,
      false,
      `availability ${availabilityStatus} must block new offers`,
    );
  }

  for (const onboardingStatus of ["not_started", "in_progress", "submitted", "changes_requested", "rejected"]) {
    assert.equal(evaluateDistributionCandidateEligibility({ ...baseCandidate, onboardingStatus }).eligible, false, `onboarding ${onboardingStatus} must block new offers`);
  }

  for (const verificationStatus of ["unverified", "pending", "changes_requested", "rejected", "suspended"]) {
    assert.equal(evaluateDistributionCandidateEligibility({ ...baseCandidate, verificationStatus }).eligible, false, `verification ${verificationStatus} must block new offers`);
  }

  for (const professionalStatus of ["pending", "paused", "suspended"]) {
    assert.equal(evaluateDistributionCandidateEligibility({ ...baseCandidate, professionalStatus }).eligible, false, `status ${professionalStatus} must block new offers`);
  }

  assert.equal(evaluateDistributionCandidateEligibility({ ...baseCandidate, qualityScore: minimumProfessionalQualityScore - 1 }).eligible, false);
  assert.equal(evaluateDistributionCandidateEligibility({ ...baseCandidate, alreadyPurchased: true }).eligible, false);
  assert.equal(evaluateDistributionCandidateEligibility({ ...baseCandidate, stats: { openOffers: 4, activeAssignments: 0 } }).eligible, false);
  assert.equal(evaluateDistributionCandidateEligibility({ ...baseCandidate, stats: { openOffers: 0, activeAssignments: 4 } }).eligible, false);
});

test("candidate eligibility honours pauses until they expire", () => {
  const now = new Date("2026-09-19T10:00:00.000Z");
  const pausedIndefinitely = { ...baseCandidate, settings: { ...baseCandidate.settings, paused: true, pauseUntil: null } };
  const pausedUntilFuture = { ...baseCandidate, settings: { ...baseCandidate.settings, paused: true, pauseUntil: "2026-09-20T10:00:00.000Z" } };
  const pausedUntilPast = { ...baseCandidate, settings: { ...baseCandidate.settings, paused: true, pauseUntil: "2026-09-18T10:00:00.000Z" } };
  const pausedInvalidDate = { ...baseCandidate, settings: { ...baseCandidate.settings, paused: true, pauseUntil: "not-a-date" } };

  assert.equal(evaluateDistributionCandidateEligibility(pausedIndefinitely, now).eligible, false);
  assert.equal(evaluateDistributionCandidateEligibility(pausedUntilFuture, now).eligible, false);
  assert.equal(evaluateDistributionCandidateEligibility(pausedUntilPast, now).eligible, true);
  assert.equal(evaluateDistributionCandidateEligibility(pausedInvalidDate, now).eligible, false);
  assert.equal(isDistributionPauseActive(false, "2026-09-20T10:00:00.000Z", now), false);
});

test("post-merge hardening migration fixes submit fall-through and locks document binding", () => {
  assert.match(postMergeHardeningSql, /return next;\s*return;\s*end if;/);
  assert.match(postMergeHardeningSql, /create trigger enforce_professional_document_integrity\s+before insert or update on public\.professional_documents/);
  assert.match(postMergeHardeningSql, /PROFESSIONAL_DOCUMENT_PATH_NOT_OWNED/);
  assert.match(postMergeHardeningSql, /PROFESSIONAL_DOCUMENT_BINDING_IMMUTABLE/);
  assert.match(postMergeHardeningSql, /PROFESSIONAL_DOCUMENT_REVIEW_FIELDS_IMMUTABLE/);
  assert.match(postMergeHardeningSql, /old\.auth_user_id is distinct from auth\.uid\(\)/);
  assert.match(postMergeHardeningSql, /revoke all on function public\.enforce_professional_self_update\(\) from public, anon, authenticated, service_role/);
  assert.match(postMergeHardeningSql, /revoke all on function public\.protect_professional_document_delete\(\) from public, anon, authenticated, service_role/);
  assert.doesNotMatch(postMergeHardeningSql, /create policy "professionals delete own/);
});
