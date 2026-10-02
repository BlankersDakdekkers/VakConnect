import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { allLocations } from "../lib/content/locations.ts";
import { localContentDepth, matchesLocalContentDepth } from "../lib/content/local-content-depth.ts";
import { baselineLocalServicePages, localServicePageConfigs, localServicePages, getLocalServicePageByPath } from "../lib/content/local-service-pages.ts";
import { getAllServiceRoutes } from "../lib/content/service-pages.ts";
import { calculateLocalQualityScore, detectDuplicateRisk, hasLocalContext, hasUniqueLocalMetadata } from "../lib/seo/local-pages/quality.ts";
import { isSitemapEligible, validatePublishSafety } from "../lib/seo/local-pages/rules.ts";

const pilotRoutes = [
  "/dakdekker/breda", "/dakdekker/utrecht", "/dakdekker/apeldoorn", "/dakdekker/den-bosch",
  "/loodgieter/rotterdam", "/loodgieter/den-haag",
  "/elektricien/amsterdam", "/elektricien/eindhoven",
  "/badkamer/amsterdam", "/badkamer/breda",
  "/kozijnen/rotterdam", "/kozijnen/utrecht",
  "/dakdekker/daklekkage/breda", "/dakdekker/daklekkage/utrecht",
  "/dakdekker/dakrenovatie/amsterdam", "/dakdekker/dakrenovatie/rotterdam",
  "/loodgieter/lekkage/amsterdam", "/loodgieter/lekkage/rotterdam",
  "/loodgieter/verstopping/den-haag", "/loodgieter/verstopping/breda",
  "/elektricien/groepenkast/utrecht", "/elektricien/storing/rotterdam",
  "/badkamer/renovatie/amsterdam", "/kozijnen/kunststof-kozijnen/rotterdam",
];
const draftRoutes = new Set(pilotRoutes.slice(-4));
const textOf = (page: (typeof localServicePages)[number]["page"]) => [
  ...page.intro,
  ...page.sections.flatMap((section) => [section.heading, ...section.paragraphs, ...(section.bullets ?? [])]),
  ...page.faqs.flatMap((faq) => [faq.question, faq.answer]),
].join(" ");
const corpus = localServicePages.map((local) => ({
  id: local.canonicalPath,
  serviceSlug: local.serviceSlug,
  subserviceSlug: local.subserviceSlug,
  cityName: allLocations.find((city) => city.slug === local.citySlug)!.name,
  citySlug: local.citySlug,
  intro: local.page.intro.join(" "),
  fullText: textOf(local.page),
  title: local.page.title,
  description: local.page.description,
}));

test("Prompt 17 selecteert exact 24 bestaande routes: 12 hoofd- en 12 subdienstpagina’s, vijf services", () => {
  assert.deepEqual(new Set(Object.keys(localContentDepth)), new Set(pilotRoutes));
  assert.equal(pilotRoutes.filter((route) => route.split("/").length === 3).length, 12);
  assert.equal(new Set(pilotRoutes.map((route) => route.split("/")[1])).size, 5);
  assert.equal(allLocations.length, 61);
  assert.equal(localServicePageConfigs.length, 282);
  assert.equal(localServicePageConfigs.filter((page) => page.published).length, 115);
  const routeStatusFingerprint = createHash("sha256")
    .update(JSON.stringify(localServicePageConfigs.map((page) => [page.canonicalPath, page.published, page.indexable]).sort()))
    .digest("hex");
  assert.equal(routeStatusFingerprint, "3bd6359b4565ff7e79594948ae1096c5ade89b65882fada812392f91b6c1d52f");
  for (const route of pilotRoutes) {
    const local = getLocalServicePageByPath(route)!;
    assert.ok(local, `Bestaande route ontbreekt: ${route}`);
    assert.equal(local.published, !draftRoutes.has(route), route);
    assert.equal(local.indexable, !draftRoutes.has(route), route);
    assert.equal(local.page.path, local.canonicalPath);
    assert.equal(local.page.cta.label, "Plaats je klus");
    assert.equal(local.page.cta.secondaryHref, "/aanvraag");
  }
});

for (const route of pilotRoutes) {
  test(`Prompt 17 inhoud, metadata, lokale context en quality gate: ${route}`, () => {
    const local = getLocalServicePageByPath(route)!;
    const page = local.page;
    const city = allLocations.find((location) => location.slug === local.citySlug)!;
    const bodyText = textOf(page);
    const context = hasLocalContext({
      text: bodyText, cityName: city.name, regionLabel: city.regionLabel,
      localFacts: [...city.introFacts, ...city.localCharacteristics, city.housingNotes ?? ""],
    });
    const duplicates = detectDuplicateRisk({
      intro: page.intro, sections: page.sections, existingCorpus: corpus,
      serviceSlug: local.serviceSlug, subserviceSlug: local.subserviceSlug,
      cityName: city.name, cityNames: allLocations.map((location) => location.name),
      title: page.title, description: page.description,
    });
    const uniqueMetadata = hasUniqueLocalMetadata({
      title: page.title, description: page.description, serviceSlug: local.serviceSlug,
      currentId: route, existingCorpus: corpus,
    });
    const quality = calculateLocalQualityScore({
      canonicalPath: route, intro: page.intro, sections: page.sections,
      faqsCount: page.faqs.length, relatedLinksCount: page.relatedLinks.length,
      duplicateRisk: duplicates.level, hasLocalContext: context,
      title: page.title, description: page.description, h1: page.h1,
      hasCta: Boolean(page.cta.label), hasUniqueMetadata: uniqueMetadata, bodyText,
    });
    assert.ok(quality.contentWordCount >= (local.subserviceSlug ? 650 : 700), `${quality.contentWordCount} woorden`);
    assert.ok(quality.contentWordCount <= (local.subserviceSlug ? 950 : 1000), `${quality.contentWordCount} woorden`);
    assert.ok(page.sections.length >= 6);
    assert.ok(page.faqs.length >= 4 && page.faqs.length <= 6);
    assert.ok(page.h1.includes(city.name));
    assert.ok(page.title.endsWith(" | VakConnect") && page.title.length <= 60);
    assert.ok(page.description.length > 40 && page.description.length <= 160);
    assert.equal(context, true);
    assert.equal(uniqueMetadata, true);
    assert.equal(duplicates.level, "low", duplicates.reason);
    assert.ok(duplicates.similarity < 0.58);
    assert.equal(quality.hasPlaceholder, false);
    assert.deepEqual(quality.warnings, []);
    assert.doesNotMatch(bodyText, /lorem ipsum|\bTODO\b|Bij VakConnect begrijpen|Of je nu|bruisende stad|staat voor je klaar|binnen 24 uur|altijd een vakman|€|\d+\s*%|sterren/i);
    assert.ok(page.breadcrumbs.some((item) => item.href === `/${local.serviceSlug}`));
    assert.equal(page.breadcrumbs.at(-1)?.label, city.name);
    const allowedLinks = new Set([...getAllServiceRoutes(), "/aanvraag", ...localServicePages.filter((candidate) => candidate.published).map((candidate) => candidate.canonicalPath)]);
    for (const link of page.relatedLinks) assert.ok(allowedLinks.has(link.href), `Onbekende link ${link.href}`);
    const safety = validatePublishSafety({
      locationPublished: city.published, locationIndexable: city.indexable,
      localPublished: true, indexable: true, contentStatus: "published",
      canonicalPath: route, serviceSlug: local.serviceSlug, subserviceSlug: local.subserviceSlug, citySlug: city.slug,
      localIntro: page.intro, localSections: page.sections, faqs: page.faqs,
      qualityScore: quality.score, contentWordCount: quality.contentWordCount,
      hasMetadata: true, metadataWithinLimits: true, hasUniqueMetadata: uniqueMetadata,
      hasH1: Boolean(page.h1), hasCta: Boolean(page.cta.label), hasLocalContext: context,
      relatedLinksCount: page.relatedLinks.length, relatedLinkHrefs: page.relatedLinks.map((link) => link.href),
      hasPlaceholder: quality.hasPlaceholder, duplicateRisk: duplicates.level,
      coverageStatus: city.tier === "A" ? "sufficient" : "limited",
    });
    assert.equal(safety.ok, true, "Ook draft-inhoud moet inhoudelijk de gate kunnen passeren");
    assert.equal(isSitemapEligible({
      locationPublished: city.published, published: local.published, indexable: local.indexable,
      contentStatus: local.published ? "published" : "draft", qualityPassed: safety.ok,
    }), !draftRoutes.has(route));
  });
}

test("Prompt 17 behoudt PR 21 componenten, intake, canonical en notFound routing", () => {
  const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
  const renderer = source("components/public/service-content-page.tsx");
  assert.equal((renderer.match(/<h1\b/g) ?? []).length, 1);
  assert.match(renderer, /<FaqList items=\{page\.faqs\}/);
  assert.match(renderer, /href=\{`#service-section-\$\{index \+ 1\}`\}/);
  assert.match(renderer, /id=\{`service-section-\$\{index \+ 1\}`\}/);
  assert.match(renderer, /<ProcessSteps/);
  assert.match(renderer, /focus-visible:ring-2/);
  assert.match(source("components/layout/mobile-navigation.tsx"), /onClick=\{closeMenu\}/);
  assert.match(source("components/public/faq-list.tsx"), /<details/);
  assert.match(source("components/public/faq-summary.tsx"), /<summary/);
  const route = source("app/(public)/[vakgebied]/[...slug]/page.tsx");
  assert.match(route, /path: resolved\.localPage\.canonicalPath/);
  assert.match(route, /title: \{ absolute: resolved\.localPage\.page\.title \}/);
  assert.match(route, /if \(!resolved\) \{\s*notFound\(\)/);
  assert.match(route, /resolved\.localPage\.contentStatus !== "published"/);
  assert.match(source("components/forms/lead-request-form.tsx"), /aria-valuenow/);
  const editor = source("app/(admin)/admin/seo/lokaal/[id]/page.tsx");
  assert.match(editor, /query\.voorstel === "prompt17"/);
  assert.match(editor, /action=\{upsertSeoLocalPageAction\}/);
  assert.match(editor, /name="content_status" defaultValue=\{page\.contentStatus\}/);
  assert.match(editor, /name="published" defaultChecked=\{page\.published\}/);
  assert.match(editor, /name="indexable" defaultChecked=\{page\.indexable\}/);
});

test("Prompt 17 voegt geen onbekende stad, dienst of combinatie toe", () => {
  for (const route of ["/dakdekker/onbekende-stad", "/onbekende-dienst/breda", "/dakdekker/groepenkast/breda"]) {
    assert.equal(getLocalServicePageByPath(route), undefined);
  }
});

test("Prompt 17 wijzigt DB-fallbacks niet zonder een opgeslagen redactioneel voorstel", () => {
  for (const route of pilotRoutes) {
    const baseline = baselineLocalServicePages.find((page) => page.canonicalPath === route)!;
    const proposal = localContentDepth[route];
    assert.equal(matchesLocalContentDepth(baseline.page, proposal), false);
    assert.equal(matchesLocalContentDepth(proposal, proposal), true);
    const reordered = {
      ...proposal,
      sections: proposal.sections.map((section) => ({ paragraphs: section.paragraphs, heading: section.heading, bullets: section.bullets, type: section.type })),
      faqs: proposal.faqs.map((faq) => ({ answer: faq.answer, question: faq.question })),
    };
    assert.equal(matchesLocalContentDepth(reordered, proposal), true, "JSONB-keyvolgorde mag selectie niet beïnvloeden");
    assert.equal(matchesLocalContentDepth({ ...proposal, intro: ["Handmatig bijgewerkte CMS-intro"] }, proposal), false);
  }
  const queries = readFileSync(new URL("../lib/seo/local-pages/queries.ts", import.meta.url), "utf8");
  assert.match(queries, /new Map\(baselineLocalServicePages\.map/);
  assert.match(queries, /matchesLocalContentDepth\(/);
});
