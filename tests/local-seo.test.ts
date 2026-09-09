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

const representativeRoutes = [
  "/dakdekker/amsterdam",
  "/dakdekker/breda",
  "/dakdekker/daklekkage/utrecht",
  "/loodgieter/rotterdam",
  "/loodgieter/verstopping/den-haag",
  "/schilder/eindhoven",
  "/elektricien/groningen",
];

test("stedenbatch en lokale combinatieomvang blijven 20 en 75", () => {
  assert.equal(allLocations.length, 20);
  assert.equal(new Set(allLocations.map((item) => item.slug)).size, 20);
  assert.equal(localServicePageConfigs.length, 75);
  assert.equal(new Set(localServicePageConfigs.map((item) => item.canonicalPath)).size, 75);
});

test("migratie bevat SEO-tabellen, RLS en canonical/combinatie-uniques", () => {
  assert.match(migrationSql, /create table public\.seo_locations/);
  assert.match(migrationSql, /create table public\.seo_local_pages/);
  assert.match(migrationSql, /alter table public\.seo_locations enable row level security;/);
  assert.match(migrationSql, /alter table public\.seo_local_pages enable row level security;/);
  assert.match(migrationSql, /canonical_path text not null unique/);
  assert.match(migrationSql, /unique\(service_slug, subservice_slug_key, location_id\)/);
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

test("revalidation target generation bevat regio, admin en relevante lokale paden", () => {
  const targets = getRevalidationTargets({
    locationSlug: "breda",
    serviceSlug: "dakdekker",
    subserviceSlug: "daklekkage",
    existingPaths: ["/dakdekker/breda", "/dakdekker/daklekkage/breda"],
  });

  assert.equal(targets.includes("/regios"), true);
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
});
