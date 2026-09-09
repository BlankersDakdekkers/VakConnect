import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { allLocations } from "../lib/content/locations.ts";
import { localServicePageConfigs } from "../lib/content/local-service-pages.ts";
import { hasSlugCollisionWithSubservice, isSitemapEligible, validatePublishSafety } from "../lib/seo/local-pages/rules.ts";
import { detectDuplicateRisk } from "../lib/seo/local-pages/quality.ts";
import { getRevalidationTargets } from "../lib/seo/revalidation-targets.ts";

const migrationPath = "/home/runner/work/VakConnect/VakConnect/supabase/migrations/20260909190000_phase4_local_seo_cms.sql";
const migrationSql = readFileSync(migrationPath, "utf8");
const migrationPrompt8Path = "/home/runner/work/VakConnect/VakConnect/supabase/migrations/20260909211000_prompt8_local_seo_scaling.sql";
const migrationPrompt8Sql = readFileSync(migrationPrompt8Path, "utf8");

const representativeRoutes = [
  "/dakdekker/amsterdam",
  "/dakdekker/breda",
  "/dakdekker/daklekkage/utrecht",
  "/loodgieter/rotterdam",
  "/loodgieter/verstopping/den-haag",
  "/schilder/eindhoven",
  "/elektricien/groningen",
];

test("stedenbatch schaalt naar 50-75 met unieke slugs en lokale service ondersteunt 8 clusters", () => {
  assert.ok(allLocations.length >= 50 && allLocations.length <= 75);
  assert.equal(new Set(allLocations.map((item) => item.slug)).size, allLocations.length);
  assert.equal(new Set(localServicePageConfigs.map((item) => item.serviceSlug)).size, 8);
});

test("migratie bevat SEO-tabellen, RLS en canonical/combinatie-uniques", () => {
  assert.match(migrationSql, /create table public\.seo_locations/);
  assert.match(migrationSql, /create table public\.seo_local_pages/);
  assert.match(migrationSql, /alter table public\.seo_locations enable row level security;/);
  assert.match(migrationSql, /alter table public\.seo_local_pages enable row level security;/);
  assert.match(migrationSql, /canonical_path text not null unique/);
  assert.match(migrationSql, /unique\(service_slug, subservice_slug_key, location_id\)/);
});

test("Prompt 8 migratie bevat tier/coverage/quality/audit uitbreidingen", () => {
  assert.match(migrationPrompt8Sql, /add column if not exists tier text/);
  assert.match(migrationPrompt8Sql, /add column if not exists content_profile jsonb/);
  assert.match(migrationPrompt8Sql, /add column if not exists quality_score integer/);
  assert.match(migrationPrompt8Sql, /add column if not exists duplicate_risk text/);
  assert.match(migrationPrompt8Sql, /add column if not exists coverage_status text/);
  assert.match(migrationPrompt8Sql, /create table if not exists public\.seo_audit_log/);
});

test("city slug collision met subdienst wordt gedetecteerd", () => {
  assert.equal(hasSlugCollisionWithSubservice("dakdekker", "daklekkage"), true);
  assert.equal(hasSlugCollisionWithSubservice("dakdekker", "amsterdam"), false);
});

test("publish workflow bepaalt sitemap eligibility", () => {
  assert.equal(isSitemapEligible({ locationPublished: true, published: false, indexable: true, contentStatus: "published" }), false);
  assert.equal(isSitemapEligible({ locationPublished: true, published: true, indexable: true, contentStatus: "review" }), false);
  assert.equal(isSitemapEligible({ locationPublished: true, published: true, indexable: true, contentStatus: "published" }), true);
});

test("publish safety blokkeert ongeldige content", () => {
  const invalid = validatePublishSafety({
    locationPublished: true,
    localPublished: true,
    indexable: true,
    contentStatus: "published",
    canonicalPath: "/dakdekker/breda",
    localIntro: ["te kort"],
    localSections: [{ heading: "Test", paragraphs: ["Te kort"] }],
    faqs: [],
    qualityScore: 10,
    duplicateRisk: "high",
    coverageStatus: "none",
  });

  assert.equal(invalid.ok, false);
});

test("duplicate detector signaleert exacte intro duplicatie", () => {
  const duplicate = detectDuplicateRisk({
    intro: ["Exact dezelfde intro tekst"],
    sections: [{ heading: "Sectie", paragraphs: ["Unieke paragraaf voor deze pagina."] }],
    existingCorpus: ["Exact dezelfde intro tekst"],
  });

  assert.equal(duplicate.level, "high");
});

test("local draftsets bevatten gecontroleerde schaalgrootte", () => {
  const published = localServicePageConfigs.filter((item) => item.published);
  const draftMain = localServicePageConfigs.filter((item) => !item.published && item.subserviceSlug === null);
  const draftSub = localServicePageConfigs.filter((item) => !item.published && item.subserviceSlug !== null);

  assert.equal(published.length, 115);
  assert.ok(draftMain.length >= 100 && draftMain.length <= 150);
  assert.ok(draftSub.length >= 50 && draftSub.length <= 75);
});

test("revalidation target generation bevat regio, admin en relevante lokale paden", () => {
  const targets = getRevalidationTargets({
    locationSlug: "breda",
    provinceSlug: "noord-brabant",
    serviceSlug: "dakdekker",
    subserviceSlug: "daklekkage",
    existingPaths: ["/dakdekker/breda", "/dakdekker/daklekkage/breda"],
  });

  assert.equal(targets.includes("/regios"), true);
  assert.equal(targets.includes("/regios/noord-brabant"), true);
  assert.equal(targets.includes("/admin/seo/lokaal"), true);
  assert.equal(targets.includes("/dakdekker/breda"), true);
  assert.equal(targets.includes("/dakdekker/daklekkage/breda"), true);
});

test("representatieve Prompt 6 routes blijven aanwezig in lokale dataset", () => {
  const routeSet = new Set(localServicePageConfigs.map((item) => item.canonicalPath));
  for (const route of representativeRoutes) {
    assert.equal(routeSet.has(route), true, `Ontbrekende route: ${route}`);
  }
});

test("bulk create defaults staan op draft/unpublished/non-indexable in actioncode", () => {
  const actionsSource = readFileSync("/home/runner/work/VakConnect/VakConnect/lib/seo/actions.ts", "utf8");
  assert.match(actionsSource, /content_status: "draft"/);
  assert.match(actionsSource, /published: false/);
  assert.match(actionsSource, /indexable: false/);
  assert.match(actionsSource, /coverage_status: coverageStatus/);
});

test("admin lokaal pagina gebruikt server-side paginering en statusbulkacties", () => {
  const listSource = readFileSync("/home/runner/work/VakConnect/VakConnect/app/(admin)/admin/seo/lokaal/page.tsx", "utf8");
  assert.match(listSource, /pageSize/);
  assert.match(listSource, /bulkUpdateSeoLocalStatusAction/);
  assert.match(listSource, /quality_lt/);
  assert.match(listSource, /coverage/);
});

test("provinciehubs route en querylaag bestaan", () => {
  const routeSource = readFileSync("/home/runner/work/VakConnect/VakConnect/app/(public)/regios/[provincie]/page.tsx", "utf8");
  const querySource = readFileSync("/home/runner/work/VakConnect/VakConnect/lib/seo/province-hubs.ts", "utf8");

  assert.match(routeSource, /generateStaticParams/);
  assert.match(routeSource, /getPublishedProvinceHubBySlug/);
  assert.match(querySource, /getPublishedProvinceHubs/);
  assert.match(querySource, /minPages = 6/);
});
