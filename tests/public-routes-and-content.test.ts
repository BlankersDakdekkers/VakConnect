import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { getEditorialClusters, getPopularServiceClusters, getServiceDetailHref } from "../lib/content/service-cards.ts";
import { getAllServicePages, serviceMainPages, serviceSubPages, getAllServiceRoutes } from "../lib/content/service-pages.ts";
import { localServicePageConfigs } from "../lib/content/local-service-pages.ts";
import { publicContactSchema, publicProfessionalApplicationSchema } from "../lib/validation/public.ts";

const repoRoot = process.cwd();
const requiredRouteFiles = [
  "app/(public)/page.tsx",
  "app/(public)/hoe-werkt-het/page.tsx",
  "app/(public)/diensten/page.tsx",
  "app/(public)/voor-vakmannen/page.tsx",
  "app/(public)/aanmelden-vakman/page.tsx",
  "app/(public)/[vakgebied]/page.tsx",
  "app/(public)/[vakgebied]/[...slug]/page.tsx",
  "app/(public)/regios/page.tsx",
  "app/(public)/regios/[provincie]/page.tsx",
  "app/(public)/kosten/page.tsx",
  "app/(public)/over-vakconnect/page.tsx",
  "app/(public)/contact/page.tsx",
  "app/(public)/aanvraag/page.tsx",
];

const expectedMainRoutes = [
  "/dakdekker",
  "/schilder",
  "/loodgieter",
  "/elektricien",
  "/kozijnen",
  "/badkamer",
  "/isolatie",
  "/verbouwing",
];

const expectedSubRoutes = [
  "/dakdekker/daklekkage",
  "/dakdekker/dakrenovatie",
  "/dakdekker/dakpannen-vervangen",
  "/dakdekker/plat-dak",
  "/dakdekker/schoorsteen",
  "/dakdekker/nokvorsten",
  "/dakdekker/dakgoot",
  "/dakdekker/dakkapel",
  "/dakdekker/dakinspectie",
  "/schilder/binnenschilderwerk",
  "/schilder/buitenschilderwerk",
  "/schilder/kozijnen-schilderen",
  "/schilder/deuren-schilderen",
  "/schilder/plafond-schilderen",
  "/loodgieter/lekkage",
  "/loodgieter/verstopping",
  "/loodgieter/leidingwerk",
  "/loodgieter/sanitair",
  "/loodgieter/spoed",
  "/elektricien/groepenkast",
  "/elektricien/storing",
  "/elektricien/stopcontacten",
  "/elektricien/verlichting",
  "/elektricien/krachtstroom",
  "/kozijnen/kunststof-kozijnen",
  "/kozijnen/houten-kozijnen",
  "/kozijnen/aluminium-kozijnen",
  "/kozijnen/kozijnen-vervangen",
  "/kozijnen/ramen-en-deuren",
  "/badkamer/renovatie",
  "/badkamer/tegelen",
  "/badkamer/sanitair",
  "/badkamer/inloopdouche",
  "/badkamer/complete-badkamer",
  "/isolatie/dakisolatie",
  "/isolatie/spouwmuurisolatie",
  "/isolatie/vloerisolatie",
  "/isolatie/gevelisolatie",
  "/verbouwing/aanbouw",
  "/verbouwing/uitbouw",
  "/verbouwing/zolder-verbouwen",
  "/verbouwing/woning-renoveren",
  "/verbouwing/keuken-verbouwen",
  "/loodgieter/afvoer",
  "/isolatie/kruipruimte-isolatie",
  "/badkamer/ventilatie",
];

const baseSitemapRoutes = [
  "/",
  "/hoe-werkt-het",
  "/diensten",
  "/regios",
  "/voor-vakmannen",
  "/aanmelden-vakman",
  "/kosten",
  "/over-vakconnect",
  "/contact",
  "/aanvraag",
  "/privacy",
];

test("vereiste publieke routebestanden bestaan", () => {
  for (const routeFile of requiredRouteFiles) {
    assert.equal(existsSync(join(repoRoot, routeFile)), true, `Ontbrekend routebestand: ${routeFile}`);
  }
});

test("alle gevraagde vakgebiedroutes zijn opgenomen", () => {
  const allRoutes = new Set(getAllServiceRoutes());

  for (const route of [...expectedMainRoutes, ...expectedSubRoutes]) {
    assert.equal(allRoutes.has(route), true, `Ontbrekende service route: ${route}`);
  }
});

test("servicepagina's hebben metadata, canonical pad en CTA-tekst", () => {
  for (const [slug, page] of Object.entries(serviceMainPages)) {
    assert.equal(page.path, `/${slug}`);
    assert.ok(page.title.length > 20);
    assert.ok(page.description.length > 40);
    assert.ok(page.cta.label.length > 8);
  }

  for (const [slug, page] of Object.entries(serviceSubPages)) {
    assert.equal(page.path, `/${slug}`);
    assert.ok(page.title.length > 20);
    assert.ok(page.description.length > 40);
    assert.ok(page.cta.label.length > 8);
  }

  const mainPages = Object.values(serviceMainPages);
  assert.equal(new Set(mainPages.map((page) => page.title)).size, mainPages.length, "Hoofdpagina-meta titles moeten uniek zijn");
  assert.equal(new Set(mainPages.map((page) => page.description)).size, mainPages.length, "Hoofdpagina-meta descriptions moeten uniek zijn");
  for (const [slug, page] of Object.entries(serviceMainPages)) {
    assert.ok(page.title.length <= 60, `Meta title te lang op ${page.path}`);
    assert.ok(page.description.length <= 160, `Meta description te lang op ${page.path}`);
    assert.ok(page.relatedLinks.some((link) => link.href === "/hoe-werkt-het"), `Link naar uitleg ontbreekt op ${page.path}`);
    assert.ok(page.relatedLinks.some((link) => link.href === "/kosten"), `Link naar kosten ontbreekt op ${page.path}`);
    assert.equal(page.cta.serviceSlug, slug === "badkamer" ? "badkamer-verbouwen" : slug);
  }
});

test("servicepagina's hebben voldoende inhoudelijke diepgang en niet-thin hoofdcontent", () => {
  for (const page of Object.values(serviceMainPages)) {
    const totalChars = page.intro.join(" ").length + page.sections.flatMap((section) => section.paragraphs).join(" ").length;
    assert.ok(page.h1.length > 20, `H1 ontbreekt of is te kort op ${page.path}`);
    assert.ok(page.sections.length >= 8, `Te weinig secties op hoofdpagina ${page.path}`);
    assert.ok(page.faqs.length >= 5, `Te weinig FAQ-items op hoofdpagina ${page.path}`);
    assert.ok(totalChars >= 3000, `Hoofdpagina is te dun: ${page.path}`);
  }

  for (const page of Object.values(serviceSubPages)) {
    const totalChars = page.intro.join(" ").length + page.sections.flatMap((section) => section.paragraphs).join(" ").length;
    assert.ok(page.h1.length > 20, `H1 ontbreekt of is te kort op ${page.path}`);
    assert.ok(page.sections.length >= 7, `Te weinig secties op subdienstpagina ${page.path}`);
    assert.ok(page.faqs.length >= 4, `Te weinig FAQ-items op subdienstpagina ${page.path}`);
    assert.ok(totalChars >= 2200, `Subdienstpagina is te dun: ${page.path}`);
  }
});

test("servicecontent vermijdt schaalbare template-duplicatie", () => {
  const pages = [...Object.values(serviceMainPages), ...Object.values(serviceSubPages)];
  const normalize = (value: string) => value.replace(/\s+/g, " ").trim();
  const allParagraphs = new Map<string, number>();
  const blockedPatterns = [
    /Voor .* telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten\./i,
    /in de dynamische wereld van/i,
    /van a tot z/i,
    /wij begrijpen dat/i,
    /dé oplossing voor/i,
  ];

  for (const page of pages) {
    const pageSentences = new Map<string, number>();
    for (const section of page.sections) {
      for (const paragraph of section.paragraphs) {
        const normalizedParagraph = normalize(paragraph);
        assert.ok(normalizedParagraph.length >= 55, `Paragraaf te kort op ${page.path}: ${section.heading}`);
        for (const blocked of blockedPatterns) {
          assert.equal(blocked.test(normalizedParagraph), false, `Template- of placeholderzin gevonden op ${page.path}`);
        }

        const paragraphCount = (allParagraphs.get(normalizedParagraph) ?? 0) + 1;
        allParagraphs.set(normalizedParagraph, paragraphCount);

        const sentences = normalizedParagraph
          .split(/[.!?]+/)
          .map((sentence) => sentence.trim())
          .filter((sentence) => sentence.length >= 20);

        for (const sentence of sentences) {
          const count = (pageSentences.get(sentence) ?? 0) + 1;
          pageSentences.set(sentence, count);
        }
      }
    }

    for (const [sentence, count] of pageSentences.entries()) {
      assert.ok(count <= 1, `Zelfde zin herhaald binnen pagina ${page.path}: "${sentence}"`);
    }
  }

  const repeatedParagraphs = [...allParagraphs.entries()].filter(([, count]) => count > 1);
  assert.equal(repeatedParagraphs.length, 0, "Exacte paragraafduplicatie over servicepagina's gevonden");
});

test("servicepagina canonical paths zijn uniek en routepaden bevatten geen duplicaten", () => {
  const pages = getAllServicePages();
  const paths = pages.map((page) => page.path);
  const uniquePaths = new Set(paths);

  assert.equal(uniquePaths.size, paths.length, "Duplicate canonical/service path gevonden");
  assert.equal(new Set(getAllServiceRoutes()).size, getAllServiceRoutes().length, "Duplicate route in service routing");
});

test("interne links verwijzen alleen naar bestaande publieke routes", () => {
  const routeSet = new Set([...baseSitemapRoutes, ...getAllServiceRoutes()]);

  for (const page of [...Object.values(serviceMainPages), ...Object.values(serviceSubPages)]) {
    for (const link of page.relatedLinks) {
      assert.equal(routeSet.has(link.href), true, `Onbekende interne link ${link.href} op ${page.path}`);
    }
  }
});

test("diensten helper voorkomt dubbele editorial cards op hetzelfde pad", () => {
  const servicesWithBathroom = [
    { slug: "dakdekker" },
    { slug: "badkamer-verbouwen" },
    { slug: "schilder" },
  ];
  const clustersWithBathroom = getEditorialClusters(servicesWithBathroom);
  assert.equal(clustersWithBathroom.some((cluster) => cluster.href === "/badkamer"), false);

  const servicesWithoutBathroom = [{ slug: "dakdekker" }];
  const clustersWithoutBathroom = getEditorialClusters(servicesWithoutBathroom);
  assert.equal(clustersWithoutBathroom.some((cluster) => cluster.href === "/badkamer"), true);
});

test("service detail route helper geeft bekende mappings terug", () => {
  assert.equal(getServiceDetailHref("dakdekker"), "/dakdekker");
  assert.equal(getServiceDetailHref("badkamer-verbouwen"), "/badkamer");
  assert.equal(getServiceDetailHref("onbekend"), undefined);
});

test("homepage en dienstenoverzicht linken naar alle acht hoofdvakgebieden", () => {
  const expectedClusters = [
    "/dakdekker",
    "/schilder",
    "/loodgieter",
    "/elektricien",
    "/kozijnen",
    "/badkamer",
    "/isolatie",
    "/verbouwing",
  ];
  const popularClusters = getPopularServiceClusters();
  const routeSet = new Set(getAllServiceRoutes());

  assert.deepEqual(popularClusters.map((cluster) => cluster.href), expectedClusters);
  for (const cluster of popularClusters) {
    assert.equal(routeSet.has(cluster.href), true, `Hoofdvakgebied ontbreekt: ${cluster.href}`);
    assert.ok(cluster.description.length > 40, `Vakgebied heeft te weinig uitleg: ${cluster.href}`);
  }

  const homeSource = readFileSync(join(repoRoot, "app/(public)/page.tsx"), "utf8");
  const servicesSource = readFileSync(join(repoRoot, "app/(public)/diensten/page.tsx"), "utf8");
  assert.match(homeSource, /href="\/aanvraag"/);
  assert.match(homeSource, /href="\/hoe-werkt-het"/);
  assert.match(servicesSource, /getPopularServiceClusters/);
});

test("publieke kernpagina's hebben één H1, metadata en de bedoelde primaire CTA", () => {
  const pages = [
    ["app/(public)/page.tsx", "/aanvraag"],
    ["app/(public)/hoe-werkt-het/page.tsx", "/aanvraag"],
    ["app/(public)/diensten/page.tsx", "/aanvraag"],
    ["app/(public)/voor-vakmannen/page.tsx", "/aanmelden-vakman"],
    ["app/(public)/aanmelden-vakman/page.tsx", "submitProfessionalApplicationAction"],
    ["app/(public)/kosten/page.tsx", "/aanvraag"],
    ["app/(public)/over-vakconnect/page.tsx", "/aanvraag"],
    ["app/(public)/contact/page.tsx", "submitContactFormAction"],
  ];

  for (const [path, expectedCta] of pages) {
    const source = readFileSync(join(repoRoot, path), "utf8");
    assert.equal((source.match(/<h1\b/g) ?? []).length, 1, `Verwacht één H1 op ${path}`);
    assert.match(source, /export const metadata: Metadata = buildPageMetadata/);
    assert.ok(source.includes(expectedCta), `Primaire CTA ontbreekt op ${path}`);
    const description = source.match(/description:\s*"([^"]+)"/)?.[1];
    assert.ok(description, `Meta description ontbreekt op ${path}`);
    assert.ok(description.length <= 160, `Meta description te lang op ${path}`);
  }
});

test("publieke contact- en vakmanformulieren behouden hun serveracties en velden", () => {
  const contactSource = readFileSync(join(repoRoot, "app/(public)/contact/page.tsx"), "utf8");
  const applicationSource = readFileSync(join(repoRoot, "app/(public)/aanmelden-vakman/page.tsx"), "utf8");

  assert.match(contactSource, /action=\{submitContactFormAction\}/);
  for (const field of ["reason", "name", "email", "phone", "message", "website"]) {
    assert.match(contactSource, new RegExp(`name="${field}"`), `Contactveld ontbreekt: ${field}`);
  }
  assert.match(applicationSource, /action=\{submitProfessionalApplicationAction\}/);
  for (const field of ["company_name", "contact_name", "email", "phone", "kvk_number", "website", "description", "service_ids", "postal_code_prefixes"]) {
    assert.match(applicationSource, new RegExp(`name="${field}"`), `Aanmeldveld ontbreekt: ${field}`);
  }
});

test("sitemap bevat publieke routes en geen protected routes", () => {
  const sitemapSource = readFileSync(join(repoRoot, "app/sitemap.ts"), "utf8");

  for (const path of baseSitemapRoutes) {
    assert.equal(sitemapSource.includes(`path: "${path}"`), true, `Sitemap mist basisroute: ${path}`);
  }

  assert.equal(sitemapSource.includes("getAllServiceRoutes"), true, "Sitemap gebruikt service route generatie niet");
  assert.equal(sitemapSource.includes("getIndexableSeoLocalRoutes"), true, "Sitemap gebruikt lokale route filtering niet");

  for (const blocked of ["/admin", "/vakman", "/login"]) {
    assert.equal(sitemapSource.includes(`path: "${blocked}"`), false, `Protected route in sitemap: ${blocked}`);
  }
});

test("lokale indexeerbare routes zijn uniek en in sitemap opgenomen", () => {
  const localRoutes = localServicePageConfigs.filter((page) => page.published && page.indexable).map((page) => page.canonicalPath);
  assert.ok(localRoutes.length > 0, "Lokale routes ontbreken");
  assert.equal(new Set(localRoutes).size, localRoutes.length, "Duplicate lokale routes gevonden");
});

test("publieke formulieren valideren verplichte velden", () => {
  const professional = publicProfessionalApplicationSchema.safeParse({
    companyName: "Dakbedrijf Noord",
    contactName: "Jan de Vries",
    email: "jan@dakbedrijf.nl",
    phone: "0612345678",
    kvkNumber: "12345678",
    website: "https://dakbedrijf.nl",
    description: "Wij voeren renovatie en lekkageherstel uit voor particuliere woningen.",
    serviceIds: ["11111111-1111-4111-8111-111111111111"],
    postalCodePrefixes: ["4811"],
  });
  assert.equal(professional.success, true);

  const contact = publicContactSchema.safeParse({
    reason: "consument",
    name: "Piet",
    email: "piet@example.com",
    phone: "",
    message: "Ik wil weten hoe ik extra foto’s kan toevoegen aan mijn aanvraag.",
  });
  assert.equal(contact.success, true);
});

test("publieke vakman-aanmelding forceert pending status server-side", () => {
  const actionsSource = readFileSync(join(repoRoot, "lib/public/actions.ts"), "utf8");
  assert.match(actionsSource, /status:\s*"pending"/);
  assert.match(actionsSource, /verification_status:\s*"pending"/);
  assert.match(actionsSource, /auth_user_id:\s*null/);
});

test("servicepagina component bevat CTA naar /aanvraag", () => {
  const componentSource = readFileSync(join(repoRoot, "components/public/service-content-page.tsx"), "utf8");
  assert.equal((componentSource.match(/<h1\b/g) ?? []).length, 1);
  assert.ok((componentSource.match(/href=\{applicationHref\}/g) ?? []).length >= 3, "CTA ontbreekt bovenaan, in de inhoud of onderaan");
  assert.match(componentSource, /`\/aanvraag\?dienst=\$\{encodeURIComponent\(page\.cta\.serviceSlug\)\}`/);
});
