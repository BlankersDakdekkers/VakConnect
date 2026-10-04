import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { getAllServicePages } from "../lib/content/service-pages.ts";
import { localServicePageConfigs } from "../lib/content/local-service-pages.ts";

const repoRoot = process.cwd();
const source = (path: string) => readFileSync(join(repoRoot, path), "utf8");

test("marketplace trust component is concise, semantic, server-rendered, and used on service and local routes", () => {
  const component = source("components/public/marketplace-trust.tsx");
  const servicePage = source("components/public/service-content-page.tsx");

  assert.match(component, /<section aria-labelledby=/);
  assert.match(component, /<h2/);
  assert.match(component, /<ul[^>]*>/);
  assert.match(component, /Een passende match is geen garantie\s+op beschikbaarheid of een opdracht/);
  assert.doesNotMatch(component, /use client/);
  assert.match(servicePage, /<MarketplaceTrust/);
  assert.match(servicePage, /context\.citySlug/);
});

test("public verification and matching wording explains review limits and uncertain outcomes", () => {
  const home = source("app/(public)/page.tsx");
  const howItWorks = source("app/(public)/hoe-werkt-het/page.tsx");
  const onboarding = source("app/(public)/aanmelden-vakman/page.tsx");
  const matrix = source("docs/TRUST_CLAIMS.md");

  assert.match(home, /Hoe VakConnect vertrouwen opbouwt/);
  assert.match(home, /Een profiel- of documentbeoordeling betekent dat de aangeleverde informatie is bekeken/);
  assert.match(home, /geen garantie voor de uitvoering of kwaliteit/);
  assert.match(howItWorks, /Een passende match is geen garantie|match garandeert geen beschikbaarheid/);
  assert.match(howItWorks, /Wat houdt een profielbeoordeling in/);
  assert.match(onboarding, /Een beoordeling van je profiel of documenten is geen kwaliteitsgarantie/);
  assert.match(matrix, /\| conditional \|/);
  assert.match(matrix, /\| unsupported \|/);
});

test("consumer and professional costs are distinguished and disclosed before a lead is taken", () => {
  const costs = source("app/(public)/kosten/page.tsx");
  const professionals = source("app/(public)/voor-vakmannen/page.tsx");

  assert.match(costs, /Een aanvraag plaatsen is gratis/);
  assert.match(costs, /geen platformkosten voor het insturen/);
  assert.match(costs, /in credits getoond voordat je een aanvraag oppakt/);
  assert.match(costs, /niet iedere aanvraag leidt tot een opdracht/);
  assert.match(professionals, /kosten worden vóór het oppakken in credits getoond/);
  assert.match(professionals, /Een lead leidt niet automatisch tot contact of een opdracht/);
});

test("privacy language avoids a no-sharing promise and explains use for matching", () => {
  const privacy = source("app/(public)/privacy/page.tsx");
  const intake = source("components/forms/lead-request-form.tsx");
  const homepage = source("app/(public)/page.tsx");

  assert.match(privacy, /gebruikt de gegevens.*aanvraag te verwerken.*passende vakmannen te zoeken/);
  assert.match(privacy, /kunnen relevante gegevens beschikbaar komen/);
  assert.doesNotMatch(privacy, /gegevens worden nooit gedeeld/i);
  assert.match(intake, /Na verzending kan je aanvraag worden aangeboden aan passende vakmannen/);
  assert.match(intake, /privacybeleid/);
  assert.match(homepage, /ctaId="home_hero_request"\s+ctaLocation="hero"\s+destinationType="request"/);
});

test("public copy contains no fabricated ratings, scale claims, endorsements, or quality guarantees", () => {
  const routes = [
    "app/(public)/page.tsx",
    "app/(public)/hoe-werkt-het/page.tsx",
    "app/(public)/diensten/page.tsx",
    "app/(public)/kosten/page.tsx",
    "app/(public)/voor-vakmannen/page.tsx",
    "app/(public)/aanmelden-vakman/page.tsx",
    "app/(public)/over-vakconnect/page.tsx",
    "app/(public)/privacy/page.tsx",
    "app/(public)/contact/page.tsx",
    "app/(public)/aanvraag/page.tsx",
    "app/(public)/aanvraag/bedankt/page.tsx",
  ];
  const serviceCopy = JSON.stringify([
    ...getAllServicePages(),
    ...localServicePageConfigs,
  ]);
  const publicCopy = [...routes.map(source), serviceCopy].join("\n");
  const forbiddenClaims = [
    /\b(?:4[.,]9|5[.,]0)\s*\/\s*5\b/i,
    /\b(?:duizenden|10\.000\+|10000\+)\s+(?:vakmannen|klussen|aanvragen|opdrachten)\b/i,
    /\btop[\s-]?vakman(?:nen)?\b/i,
    /\b100%\s+betrouwbare?\s+vakman\b/i,
    /VakConnect\s+garandeert\s+(?!geen\b|niet\b)/i,
    /(?:Google Reviews|Trustpilot|klantreviews|reviews van klanten)/i,
  ];

  for (const claim of forbiddenClaims) {
    assert.doesNotMatch(publicCopy, claim);
  }
});
