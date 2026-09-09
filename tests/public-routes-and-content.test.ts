import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import sitemap from "../app/sitemap.ts";
import { publicContactSchema, publicProfessionalApplicationSchema } from "../lib/validation/public.ts";

const repoRoot = process.cwd();
const requiredRoutes = [
  "app/(public)/page.tsx",
  "app/(public)/hoe-werkt-het/page.tsx",
  "app/(public)/diensten/page.tsx",
  "app/(public)/voor-vakmannen/page.tsx",
  "app/(public)/aanmelden-vakman/page.tsx",
  "app/(public)/dakdekker/page.tsx",
  "app/(public)/dakdekker/daklekkage/page.tsx",
  "app/(public)/dakdekker/dakrenovatie/page.tsx",
  "app/(public)/dakdekker/dakpannen-vervangen/page.tsx",
  "app/(public)/dakdekker/plat-dak/page.tsx",
  "app/(public)/dakdekker/schoorsteen/page.tsx",
  "app/(public)/kosten/page.tsx",
  "app/(public)/over-vakconnect/page.tsx",
  "app/(public)/contact/page.tsx",
  "app/(public)/aanvraag/page.tsx",
];

test("vereiste publieke routebestanden bestaan", () => {
  for (const routeFile of requiredRoutes) {
    assert.equal(existsSync(join(repoRoot, routeFile)), true, `Ontbrekend routebestand: ${routeFile}`);
  }
});

test("sitemap bevat alle kernroutes", () => {
  const entries = sitemap();
  const urls = new Set(entries.map((entry) => new URL(entry.url).pathname));

  for (const path of [
    "/",
    "/hoe-werkt-het",
    "/diensten",
    "/voor-vakmannen",
    "/aanmelden-vakman",
    "/dakdekker",
    "/dakdekker/daklekkage",
    "/dakdekker/dakrenovatie",
    "/dakdekker/dakpannen-vervangen",
    "/dakdekker/plat-dak",
    "/dakdekker/schoorsteen",
    "/kosten",
    "/over-vakconnect",
    "/contact",
    "/aanvraag",
  ]) {
    assert.equal(urls.has(path), true, `Sitemap mist route: ${path}`);
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
