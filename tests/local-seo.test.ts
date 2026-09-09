import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { allLocations } from "../lib/content/locations.ts";
import { resolvePublicServiceRoute } from "../lib/content/local-routing.ts";
import {
  getIndexableLocalServicePages,
  getIndexableLocalRoutes,
  getLocalCoverageSummary,
  getPublishedLocalRoutes,
  localServicePageConfigs,
  localServicePages,
} from "../lib/content/local-service-pages.ts";
import { getServiceSubPage } from "../lib/content/service-pages.ts";

const repoRoot = process.cwd();

const expectedCities = [
  "amsterdam",
  "rotterdam",
  "den-haag",
  "utrecht",
  "eindhoven",
  "groningen",
  "tilburg",
  "almere",
  "breda",
  "nijmegen",
  "arnhem",
  "apeldoorn",
  "haarlem",
  "amersfoort",
  "zwolle",
  "leeuwarden",
  "den-bosch",
  "enschede",
  "leiden",
  "dordrecht",
];

test("stedenbatch bevat 20 unieke slugs inclusief den-haag en den-bosch", () => {
  assert.equal(allLocations.length, 20);
  assert.equal(new Set(allLocations.map((location) => location.slug)).size, 20);
  assert.equal(new Set(expectedCities).size, expectedCities.length);

  for (const citySlug of expectedCities) {
    assert.equal(allLocations.some((location) => location.slug === citySlug), true, `Ontbrekende city slug: ${citySlug}`);
  }
});

test("lokale publicatieset heeft gecontroleerde omvang en verdeling", () => {
  const summary = getLocalCoverageSummary();
  assert.equal(summary.cities, 20);
  assert.equal(summary.mainPages, 50);
  assert.equal(summary.subPages, 25);
  assert.equal(summary.totalPages, 75);

  const mainByService = new Map<string, number>();
  const subByCombo = new Map<string, number>();

  for (const page of localServicePages) {
    if (!page.published) continue;

    if (page.subserviceSlug) {
      const key = `${page.serviceSlug}/${page.subserviceSlug}`;
      subByCombo.set(key, (subByCombo.get(key) ?? 0) + 1);
    } else {
      mainByService.set(page.serviceSlug, (mainByService.get(page.serviceSlug) ?? 0) + 1);
    }
  }

  assert.equal(mainByService.get("dakdekker"), 20);
  assert.equal(mainByService.get("loodgieter"), 10);
  assert.equal(mainByService.get("schilder"), 10);
  assert.equal(mainByService.get("elektricien"), 10);
  assert.equal(subByCombo.get("dakdekker/daklekkage"), 10);
  assert.equal(subByCombo.get("dakdekker/dakrenovatie"), 5);
  assert.equal(subByCombo.get("loodgieter/lekkage"), 5);
  assert.equal(subByCombo.get("loodgieter/verstopping"), 5);
});

test("canonical paden, gepubliceerde routes en config routes zijn uniek", () => {
  const configRoutes = localServicePageConfigs.map((config) => config.canonicalPath);
  assert.equal(new Set(configRoutes).size, configRoutes.length, "Duplicate canonicalPath in config");

  const publishedRoutes = getPublishedLocalRoutes();
  assert.equal(new Set(publishedRoutes).size, publishedRoutes.length, "Duplicate published route");

  const canonicalRoutes = localServicePages.map((page) => page.canonicalPath);
  assert.equal(new Set(canonicalRoutes).size, canonicalRoutes.length, "Duplicate canonical path in pages");
});

test("sitemap bevat alleen indexeerbare lokale routes", () => {
  const source = readFileSync(join(repoRoot, "app/sitemap.ts"), "utf8");

  assert.equal(source.includes("getIndexableLocalRoutes"), true, "Sitemap gebruikt geen indexeerbare lokale routebron");

  for (const route of getIndexableLocalRoutes()) {
    assert.equal(source.includes(`path: \"${route}\"`), false, "Lokale routes moeten runtime uit data komen, niet hardcoded per pad");
  }

  for (const page of localServicePages) {
    if (!page.published || page.indexable) continue;
    assert.equal(getIndexableLocalRoutes().includes(page.canonicalPath), false, `Niet-indexeerbare route zit in indexable set: ${page.canonicalPath}`);
  }
});

test("nearby-links verwijzen alleen naar gepubliceerde lokale routes", () => {
  const publishedRouteSet = new Set(getPublishedLocalRoutes());
  const citySlugSet = new Set(allLocations.map((location) => location.slug));

  for (const page of localServicePages) {
    if (!page.published) continue;

    for (const link of page.page.relatedLinks) {
      const segments = link.href.split("/").filter(Boolean);
      const isLocalMainLink = segments.length === 2 && citySlugSet.has(segments[1]);
      if (!isLocalMainLink) continue;
      assert.equal(publishedRouteSet.has(link.href), true, `Broken nearby/local link ${link.href} op ${page.canonicalPath}`);
    }
  }
});

test("lokale pagina metadata en canonical volgen published/indexable beleid", () => {
  for (const page of localServicePages) {
    if (!page.published) continue;
    assert.equal(page.page.path, page.canonicalPath);
    assert.equal(page.page.path.startsWith(`/${page.serviceSlug}/`), true);
  }

  for (const page of getIndexableLocalServicePages()) {
    assert.equal(getIndexableLocalRoutes().includes(page.canonicalPath), true);
  }

  const routeSource = readFileSync(join(repoRoot, "app/(public)/[vakgebied]/[...slug]/page.tsx"), "utf8");
  assert.equal(routeSource.includes("indexable: resolved.localPage.indexable"), true, "Route metadata geeft indexable status niet door");
});

test("route-resolver houdt subdienst en lokale routes uit elkaar", () => {
  const localMain = resolvePublicServiceRoute("dakdekker", ["breda"]);
  assert.equal(localMain?.type, "local");

  const subservice = resolvePublicServiceRoute("dakdekker", ["daklekkage"]);
  assert.equal(subservice?.type, "service-sub");
  assert.equal(getServiceSubPage("dakdekker", "daklekkage")?.path, "/dakdekker/daklekkage");

  const localSubservice = resolvePublicServiceRoute("dakdekker", ["daklekkage", "breda"]);
  assert.equal(localSubservice?.type, "local");

  const unknownCity = resolvePublicServiceRoute("dakdekker", ["onbekende-stad"]);
  assert.equal(unknownCity, null);

  const unknownSubservice = resolvePublicServiceRoute("dakdekker", ["onbekende-subdienst", "breda"]);
  assert.equal(unknownSubservice, null);
});

test("lokale content vermijdt exacte duplicatie van intro en sectieblokken", () => {
  const introSet = new Set<string>();
  const sectionSet = new Set<string>();

  for (const page of localServicePages) {
    if (!page.published) continue;

    const introText = page.page.intro.join(" ").replace(/\s+/g, " ").trim();
    assert.equal(introSet.has(introText), false, `Exacte intro-duplicatie gevonden op ${page.canonicalPath}`);
    introSet.add(introText);

    const sectionText = page.page.sections
      .flatMap((section) => [section.heading, ...section.paragraphs, ...(section.bullets ?? [])])
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    assert.equal(sectionSet.has(sectionText), false, `Exacte sectieduplicatie gevonden op ${page.canonicalPath}`);
    sectionSet.add(sectionText);
  }
});

test("representatieve lokale pagina's verschillen inhoudelijk", () => {
  const samples = [
    "/dakdekker/amsterdam",
    "/dakdekker/breda",
    "/dakdekker/daklekkage/utrecht",
    "/loodgieter/rotterdam",
    "/loodgieter/verstopping/den-haag",
    "/schilder/eindhoven",
    "/elektricien/groningen",
  ];

  const pages = samples.map((path) => {
    const page = localServicePages.find((candidate) => candidate.canonicalPath === path);
    assert.ok(page, `Ontbrekende representatieve pagina: ${path}`);
    return page!;
  });

  for (let i = 0; i < pages.length; i += 1) {
    for (let j = i + 1; j < pages.length; j += 1) {
      assert.notEqual(pages[i].page.intro.join(" "), pages[j].page.intro.join(" "), `Intro identiek tussen ${pages[i].canonicalPath} en ${pages[j].canonicalPath}`);
    }
  }
});
