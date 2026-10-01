import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { allLocations } from "../lib/content/locations.ts";
import { localServicePageConfigs, localServicePages } from "../lib/content/local-service-pages.ts";
import { hasSlugCollisionWithSubservice, isSitemapEligible, isValidSeoStatusTransition, validatePublishSafety } from "../lib/seo/local-pages/rules.ts";
import { calculateLocalQualityScore, detectDuplicateRisk, hasLocalContext, hasUniqueLocalMetadata } from "../lib/seo/local-pages/quality.ts";
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
  assert.equal(isSitemapEligible({ locationPublished: true, published: false, indexable: true, contentStatus: "published", qualityPassed: true }), false);
  assert.equal(isSitemapEligible({ locationPublished: true, published: true, indexable: true, contentStatus: "review", qualityPassed: true }), false);
  assert.equal(isSitemapEligible({ locationPublished: true, published: true, indexable: true, contentStatus: "published", qualityPassed: false }), false);
  assert.equal(isSitemapEligible({ locationPublished: true, published: true, indexable: true, contentStatus: "published", qualityPassed: true }), true);
});

test("publish safety blokkeert ongeldige content", () => {
  const invalid = validatePublishSafety({
    locationPublished: true,
    locationIndexable: true,
    localPublished: true,
    indexable: true,
    contentStatus: "published",
    canonicalPath: "/dakdekker/breda",
    serviceSlug: "dakdekker",
    subserviceSlug: null,
    citySlug: "breda",
    localIntro: ["te kort"],
    localSections: [{ heading: "Test", paragraphs: ["Te kort"] }],
    faqs: [],
    qualityScore: 10,
    contentWordCount: 0,
    hasMetadata: false,
    metadataWithinLimits: false,
    hasUniqueMetadata: false,
    hasH1: false,
    hasCta: false,
    hasLocalContext: false,
    relatedLinksCount: 0,
    relatedLinkHrefs: [],
    hasPlaceholder: true,
    duplicateRisk: "high",
    coverageStatus: "none",
  });

  assert.equal(invalid.ok, false);
});

test("quality gate staat dunne drafts toe maar blokkeert approved content met mismatch of ontbrekende eisen", () => {
  const publishCandidate = {
    locationPublished: true,
    locationIndexable: true,
    localPublished: false,
    indexable: false,
    contentStatus: "approved",
    canonicalPath: "/dakdekker/breda",
    serviceSlug: "dakdekker",
    subserviceSlug: null,
    citySlug: "breda",
    localIntro: ["Zoek een dakdekker voor herstel of onderhoud in Breda en beschrijf de situatie."],
    localSections: [
      { heading: "Woningcontext en dakwerk", paragraphs: ["Beschrijf het type woning, de staat van het dak en de details die tijdens de opname aandacht vragen."] },
      { heading: "Bereikbaarheid en voorbereiding", paragraphs: ["Deel toegang, werkhoogte en gewenste planning zodat de aanvraag inhoudelijk kan worden beoordeeld."] },
    ],
    faqs: [
      { question: "Hoe beschrijf ik mijn dakklus?", answer: "Noem de zichtbare situatie, gewenste oplossing en planning." },
      { question: "Wat beïnvloedt de kosten?", answer: "Daktype, materiaal, bereikbaarheid en omvang van herstel bepalen mede de prijs." },
    ],
    qualityScore: 80,
    contentWordCount: 300,
    hasMetadata: true,
    metadataWithinLimits: true,
    hasUniqueMetadata: true,
    hasH1: true,
    hasCta: true,
    hasLocalContext: true,
    relatedLinksCount: 3,
    relatedLinkHrefs: ["/dakdekker", "/aanvraag"],
    hasPlaceholder: false,
    duplicateRisk: "low" as const,
    coverageStatus: "sufficient" as const,
  };
  const safe = validatePublishSafety(publishCandidate);
  const invalidRoute = validatePublishSafety({ ...publishCandidate, canonicalPath: "/dakdekker/tilburg" });
  const thin = validatePublishSafety({ ...publishCandidate, contentWordCount: 20 });
  const draft = validatePublishSafety({
    ...publishCandidate,
    localPublished: false,
    indexable: false,
    contentStatus: "draft",
    localIntro: [],
    localSections: [],
    faqs: [],
    qualityScore: 0,
    contentWordCount: 0,
    hasMetadata: false,
    metadataWithinLimits: false,
    hasUniqueMetadata: false,
    hasH1: false,
    hasCta: false,
    hasLocalContext: false,
    relatedLinksCount: 0,
    relatedLinkHrefs: [],
    hasPlaceholder: true,
    duplicateRisk: "high",
    coverageStatus: "none",
  });

  assert.equal(safe.ok, true);
  assert.equal(invalidRoute.ok, false);
  assert.equal(thin.ok, false);
  assert.equal(draft.ok, true);
});

test("duplicate detector signaleert exacte intro duplicatie", () => {
  const duplicate = detectDuplicateRisk({
    intro: ["Zoek je een dakdekker in Breda? Deel de situatie en gewenste planning."],
    sections: [{ heading: "Sectie", paragraphs: ["Unieke paragraaf voor deze pagina."] }],
    serviceSlug: "dakdekker",
    subserviceSlug: null,
    cityName: "Breda",
    cityNames: ["Breda", "Tilburg"],
    existingCorpus: [
      {
        serviceSlug: "dakdekker",
        subserviceSlug: null,
        cityName: "Tilburg",
        citySlug: "tilburg",
        intro: "Zoek je een dakdekker in Tilburg? Deel de situatie en gewenste planning.",
        fullText: "Zoek je een dakdekker in Tilburg? Deel de situatie en gewenste planning.",
      },
    ],
  });

  assert.equal(duplicate.level, "high");
  assert.match(duplicate.reason, /plaatsnamen zijn geneutraliseerd/);
});

test("city-neutral duplicate detector scopes comparison to matching service intent", () => {
  const result = detectDuplicateRisk({
    intro: ["Zoek je een loodgieter in Breda? Deel de situatie en planning."],
    sections: [{ heading: "Werkzaamheden", paragraphs: ["Omschrijf leidingwerk, toegang en gewenste planning zodat een vakman de aanvraag kan beoordelen."] }],
    serviceSlug: "loodgieter",
    subserviceSlug: null,
    cityName: "Breda",
    cityNames: ["Breda", "Tilburg"],
    existingCorpus: [
      {
        serviceSlug: "dakdekker",
        subserviceSlug: null,
        cityName: "Tilburg",
        citySlug: "tilburg",
        intro: "Zoek je een dakdekker in Tilburg? Deel de situatie en planning.",
        fullText: "Zoek je een dakdekker in Tilburg? Deel de situatie en planning.",
      },
    ],
  });

  assert.equal(result.level, "low");
});

test("status workflow vereist approved vooraf, en gewijzigde live content moet opnieuw reviewed worden", () => {
  assert.equal(isValidSeoStatusTransition({ previousStatus: null, nextStatus: "draft", nextPublished: false, contentChanged: false }), true);
  assert.equal(isValidSeoStatusTransition({ previousStatus: "draft", nextStatus: "published", nextPublished: true, contentChanged: false }), false);
  assert.equal(isValidSeoStatusTransition({ previousStatus: "approved", nextStatus: "published", nextPublished: true, contentChanged: false }), true);
  assert.equal(isValidSeoStatusTransition({ previousStatus: "published", nextStatus: "published", nextPublished: true, contentChanged: true }), false);
  assert.equal(isValidSeoStatusTransition({ previousStatus: "published", nextStatus: "review", nextPublished: false, contentChanged: true }), true);
});

test("representatieve local SEO-pilot behoudt lokale waarde voor hoofd- en subservicepagina's", () => {
  const pilotRoutes = [
    "/dakdekker/amsterdam",
    "/dakdekker/rotterdam",
    "/dakdekker/breda",
    "/loodgieter/amsterdam",
    "/loodgieter/groningen",
    "/loodgieter/breda",
    "/elektricien/rotterdam",
    "/elektricien/utrecht",
    "/elektricien/eindhoven",
    "/badkamer/amsterdam",
    "/badkamer/breda",
    "/badkamer/utrecht",
    "/dakdekker/daklekkage/amsterdam",
    "/dakdekker/daklekkage/breda",
    "/loodgieter/lekkage/rotterdam",
    "/loodgieter/verstopping/groningen",
  ];
  const corpus = localServicePages.map((page) => {
    const location = allLocations.find((candidate) => candidate.slug === page.citySlug);
    assert.ok(location);
    const fullText = [
      ...page.page.intro,
      ...page.page.sections.flatMap((section) => [section.heading, ...section.paragraphs, ...(section.bullets ?? [])]),
      ...page.page.faqs.flatMap((faq) => [faq.question, faq.answer]),
    ].join(" ");

    return {
      id: `fallback-local-${page.canonicalPath}`,
      serviceSlug: page.serviceSlug,
      subserviceSlug: page.subserviceSlug,
      cityName: location.name,
      citySlug: page.citySlug,
      intro: page.page.intro.join(" "),
      fullText,
      title: page.page.title,
      description: page.page.description,
    };
  });
  const pagesByPath = new Map(localServicePages.map((page) => [page.canonicalPath, page]));
  const pilotWordCounts: number[] = [];

  for (const route of pilotRoutes) {
    const page = pagesByPath.get(route);
    assert.ok(page, `Ontbrekende pilotroute: ${route}`);
    assert.equal(page.published, true, `Pilotpagina moet een bestaande gepubliceerde route zijn: ${route}`);
    const location = allLocations.find((candidate) => candidate.slug === page.citySlug);
    assert.ok(location);
    const content = corpus.find((item) => item.id === `fallback-local-${route}`);
    assert.ok(content);
    const hasContext = hasLocalContext({
      text: content.fullText,
      cityName: location.name,
      regionLabel: location.regionLabel,
      localFacts: [...location.introFacts, ...location.localCharacteristics, location.housingNotes ?? ""],
    });
    const duplicateRisk = detectDuplicateRisk({
      intro: page.page.intro,
      sections: page.page.sections,
      existingCorpus: corpus,
      serviceSlug: page.serviceSlug,
      subserviceSlug: page.subserviceSlug,
      cityName: location.name,
      cityNames: allLocations.map((item) => item.name),
    });
    const metadataIsUnique = hasUniqueLocalMetadata({
      title: page.page.title,
      description: page.page.description,
      serviceSlug: page.serviceSlug,
      currentId: content.id,
      existingCorpus: corpus,
    });
    const quality = calculateLocalQualityScore({
      canonicalPath: page.canonicalPath,
      intro: page.page.intro,
      sections: page.page.sections,
      faqsCount: page.page.faqs.length,
      relatedLinksCount: page.page.relatedLinks.length,
      duplicateRisk: duplicateRisk.level,
      hasLocalContext: hasContext,
      title: page.page.title,
      description: page.page.description,
      h1: page.page.h1,
      hasCta: Boolean(page.page.cta.label && page.page.cta.description),
      hasUniqueMetadata: metadataIsUnique,
      bodyText: content.fullText,
    });

    pilotWordCounts.push(quality.contentWordCount);
    assert.ok(quality.contentWordCount >= 250, `Pilotpagina te dun: ${route}`);
    assert.ok(quality.score >= 55, `Quality score te laag: ${route}`);
    assert.notEqual(duplicateRisk.level, "high", `Pilotpagina heeft hoge overlap: ${route}`);
    assert.equal(hasContext, true, `Gecontroleerde lokale context ontbreekt: ${route}`);
    assert.equal(metadataIsUnique, true, `Meta niet uniek: ${route}`);
    assert.ok(page.page.title.length <= 60 && page.page.description.length <= 160, `Metadata te lang: ${route}`);
    assert.equal(page.page.cta.label, "Plaats je klus");
    assert.ok(page.page.relatedLinks.some((link) => link.href === `/${page.serviceSlug}`));
    assert.ok(page.page.relatedLinks.some((link) => link.href === "/aanvraag"));
    if (page.subserviceSlug) {
      assert.ok(page.page.relatedLinks.some((link) => link.href === `/${page.serviceSlug}/${page.citySlug}`));
      assert.ok(page.page.relatedLinks.some((link) => link.href === `/${page.serviceSlug}/${page.subserviceSlug}`));
    }
    assert.doesNotMatch(content.fullText, /binnen \d+ minuten|honderden klanten|duizenden klanten|altijd een vakman|beste .+ in /i);
  }

  assert.equal(new Set(pilotRoutes).size, 16);
  assert.ok(Math.min(...pilotWordCounts) >= 250);
  assert.equal(new Set(localServicePages.map((page) => page.page.title)).size, localServicePages.length);
  assert.equal(new Set(localServicePages.map((page) => page.page.description)).size, localServicePages.length);
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

test("ongeldige lokale combinaties krijgen een not-found UI en vallen niet terug op algemene content", () => {
  const routeSource = readFileSync("/home/runner/work/VakConnect/VakConnect/app/(public)/[vakgebied]/[...slug]/page.tsx", "utf8");
  const querySource = readFileSync("/home/runner/work/VakConnect/VakConnect/lib/seo/local-pages/queries.ts", "utf8");
  const notFoundSource = readFileSync("/home/runner/work/VakConnect/VakConnect/app/not-found.tsx", "utf8");

  assert.match(routeSource, /if \(!resolved\)\s*\{\s*notFound\(\);/);
  assert.match(querySource, /return null;/);
  assert.match(notFoundSource, /Pagina niet gevonden/);
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
  const detailSource = readFileSync("/home/runner/work/VakConnect/VakConnect/app/(admin)/admin/seo/lokaal/[id]/page.tsx", "utf8");
  assert.match(listSource, /pageSize/);
  assert.match(listSource, /bulkUpdateSeoLocalStatusAction/);
  assert.match(listSource, /quality_lt/);
  assert.match(listSource, /coverage/);
  assert.match(listSource, /Quality waarschuwingen/);
  assert.match(detailSource, /Quality warnings/);
});

test("provinciehubs route en querylaag bestaan", () => {
  const routeSource = readFileSync("/home/runner/work/VakConnect/VakConnect/app/(public)/regios/[provincie]/page.tsx", "utf8");
  const querySource = readFileSync("/home/runner/work/VakConnect/VakConnect/lib/seo/province-hubs.ts", "utf8");

  assert.match(routeSource, /generateStaticParams/);
  assert.match(routeSource, /getPublishedProvinceHubBySlug/);
  assert.match(querySource, /getPublishedProvinceHubs/);
  assert.match(querySource, /minPages = 6/);
});
