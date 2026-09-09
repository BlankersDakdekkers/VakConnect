import assert from "node:assert/strict";
import test from "node:test";
import sitemap from "../app/sitemap.ts";
import { resolvePublicServiceRoute, generateMetadata as generateCatchAllMetadata } from "../app/(public)/[vakgebied]/[...slug]/page.tsx";
import { allLocations } from "../lib/content/locations.ts";
import {
  getIndexableLocalRoutes,
  getLocalCoverageSummary,
  getPublishedLocalRoutes,
  localServicePageConfigs,
  localServicePages,
} from "../lib/content/local-service-pages.ts";
import { getServiceSubPage } from "../lib/content/service-pages.ts";

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
  const urls = sitemap().map((entry) => entry.url);
  const indexableRoutes = new Set(getIndexableLocalRoutes().map((route) => `http://localhost:3000${route}`));

  for (const route of indexableRoutes) {
    assert.equal(urls.includes(route), true, `Lokale indexeerbare route ontbreekt in sitemap: ${route}`);
  }

  for (const page of localServicePages) {
    if (!page.published || page.indexable) continue;
    assert.equal(urls.includes(`http://localhost:3000${page.canonicalPath}`), false, `Niet-indexeerbare route staat in sitemap: ${page.canonicalPath}`);
  }
});

test("nearby-links verwijzen alleen naar gepubliceerde lokale routes", () => {
  const publishedRouteSet = new Set(getPublishedLocalRoutes());

  for (const page of localServicePages) {
    if (!page.published) continue;

    for (const link of page.page.relatedLinks) {
      const isLocalMainLink = /^\/(dakdekker|loodgieter|schilder|elektricien)\/[a-z-]+$/.test(link.href);
      if (!isLocalMainLink) continue;
      assert.equal(publishedRouteSet.has(link.href), true, `Broken nearby/local link ${link.href} op ${page.canonicalPath}`);
    }
  }
});

test("metadata gebruikt canonical + index/follow voor indexeerbare lokale route", async () => {
  const metadata = await generateCatchAllMetadata({ params: Promise.resolve({ vakgebied: "dakdekker", slug: ["breda"] }) });
  assert.equal(metadata.alternates?.canonical, "/dakdekker/breda");
  assert.equal(metadata.robots && typeof metadata.robots === "object" && "index" in metadata.robots ? metadata.robots.index : undefined, true);
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
