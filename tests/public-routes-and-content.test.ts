import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { serviceMainPages, serviceSubPages, getAllServiceRoutes } from "../lib/content/service-pages.ts";
import { publicContactSchema, publicProfessionalApplicationSchema } from "../lib/validation/public.ts";

const repoRoot = process.cwd();
const requiredRouteFiles = [
  "app/(public)/page.tsx",
  "app/(public)/hoe-werkt-het/page.tsx",
  "app/(public)/diensten/page.tsx",
  "app/(public)/voor-vakmannen/page.tsx",
  "app/(public)/aanmelden-vakman/page.tsx",
  "app/(public)/[vakgebied]/page.tsx",
  "app/(public)/[vakgebied]/[subdienst]/page.tsx",
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
];

const baseSitemapRoutes = [
  "/",
  "/hoe-werkt-het",
  "/diensten",
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
});

test("interne links verwijzen alleen naar bestaande publieke routes", () => {
  const routeSet = new Set([...baseSitemapRoutes, ...getAllServiceRoutes()]);

  for (const page of [...Object.values(serviceMainPages), ...Object.values(serviceSubPages)]) {
    for (const link of page.relatedLinks) {
      assert.equal(routeSet.has(link.href), true, `Onbekende interne link ${link.href} op ${page.path}`);
    }
  }
});

test("sitemap bevat publieke routes en geen protected routes", () => {
  const sitemapSource = readFileSync(join(repoRoot, "app/sitemap.ts"), "utf8");

  for (const path of baseSitemapRoutes) {
    assert.equal(sitemapSource.includes(`path: "${path}"`), true, `Sitemap mist basisroute: ${path}`);
  }

  assert.equal(sitemapSource.includes("getAllServiceRoutes"), true, "Sitemap gebruikt service route generatie niet");

  for (const blocked of ["/admin", "/vakman", "/login"]) {
    assert.equal(sitemapSource.includes(`path: "${blocked}"`), false, `Protected route in sitemap: ${blocked}`);
  }
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
  assert.equal(componentSource.includes('href="/aanvraag"'), true);
});
