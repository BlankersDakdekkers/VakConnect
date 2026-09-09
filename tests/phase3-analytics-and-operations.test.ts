import assert from "node:assert/strict";
import test from "node:test";
import { normalizeUtmValue, parseAttributionFromUrl } from "../lib/analytics/attribution.ts";
import { sanitizeAnalyticsMetadata } from "../lib/analytics/privacy.ts";
import { generateAnonymousSessionId } from "../lib/analytics/session.ts";
import { isProfessionalOwner } from "../lib/auth/ownership.ts";
import { calculateAcceptanceRate, calculateWinRate } from "../lib/leads/kpi.ts";
import { isValidLeadProgressTransition, normalizeLeadLossReason } from "../lib/leads/progress.ts";
import { sanitizeProfessionalSelfUpdateInput } from "../lib/professionals/profile.ts";
import { professionalAreaMutationSchema, professionalProfileUpdateSchema } from "../lib/validation/professionals.ts";

test("UTM normalisatie en attribution parsing werken consistent", () => {
  assert.equal(normalizeUtmValue("  Google Ads  "), "google ads");

  const parsed = parseAttributionFromUrl(
    new URL("https://vakconnect.nl/aanvraag?utm_source=Google&utm_medium=CPC&utm_campaign=Najaar&gclid=abc123"),
    "https://www.google.com/search?q=dakdekker",
  );

  assert.equal(parsed.utm_source, "google");
  assert.equal(parsed.utm_medium, "cpc");
  assert.equal(parsed.utm_campaign, "najaar");
  assert.equal(parsed.gclid, "abc123");
  assert.equal(parsed.first_touch_source, "google");
  assert.equal(parsed.landing_page, "/aanvraag?utm_source=Google&utm_medium=CPC&utm_campaign=Najaar&gclid=abc123");
});

test("anonymous session ids zijn random en UUID-geformatteerd", () => {
  const first = generateAnonymousSessionId();
  const second = generateAnonymousSessionId();

  assert.match(first, /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  assert.notEqual(first, second);
});

test("analytics metadata sanitizer verwijdert PII-velden", () => {
  const sanitized = sanitizeAnalyticsMetadata({
    step: 3,
    service_id: "123",
    email: "should-be-removed@example.com",
    message: "vrije tekst",
    upload_count: 2,
    tags: ["dak", "spoed"],
  });

  assert.deepEqual(sanitized, {
    step: 3,
    service_id: "123",
    upload_count: 2,
    tags: ["dak", "spoed"],
  });
});

test("professional profiel self-service beperkt velden", () => {
  const payload = professionalProfileUpdateSchema.parse({
    contactName: "Piet Jansen",
    phone: "0612345678",
    website: "https://vakbedrijf.nl",
    description: "Specialist in dakrenovatie",
  });

  const sanitized = sanitizeProfessionalSelfUpdateInput(payload);
  assert.equal(sanitized.contact_name, "Piet Jansen");
  assert.equal(sanitized.phone, "0612345678");
  assert.equal(sanitized.website, "https://vakbedrijf.nl");
  assert.equal(sanitized.description, "Specialist in dakrenovatie");
  assert.ok(!("status" in sanitized));
  assert.ok(!("verification_status" in sanitized));
});

test("postcode4 validatie accepteert alleen geldige NL prefix", () => {
  const valid = professionalAreaMutationSchema.safeParse({
    professionalId: "11111111-1111-4111-8111-111111111111",
    postalCodePrefix: "4811",
    redirectTo: "/admin/vakmannen/1",
  });
  assert.equal(valid.success, true);

  const invalid = professionalAreaMutationSchema.safeParse({
    professionalId: "11111111-1111-4111-8111-111111111111",
    postalCodePrefix: "0811",
    redirectTo: "/admin/vakmannen/1",
  });
  assert.equal(invalid.success, false);
});

test("lead progress transities accepteren geldige flow en blokkeren ongeldige stappen", () => {
  assert.equal(isValidLeadProgressTransition("new", "contacted"), true);
  assert.equal(isValidLeadProgressTransition("contacted", "appointment_scheduled"), true);
  assert.equal(isValidLeadProgressTransition("appointment_scheduled", "quote_sent"), true);
  assert.equal(isValidLeadProgressTransition("quote_sent", "won"), true);

  assert.equal(isValidLeadProgressTransition("new", "quote_sent"), false);
  assert.equal(isValidLeadProgressTransition("contacted", "won"), false);
  assert.equal(isValidLeadProgressTransition("lost", "won"), false);
});

test("verliesreden normalisatie accepteert alleen centrale redenen", () => {
  assert.equal(normalizeLeadLossReason("prijs"), "prijs");
  assert.equal(normalizeLeadLossReason("KLANT_NIET_BEREIKBAAR"), "klant_niet_bereikbaar");
  assert.equal(normalizeLeadLossReason("onbekend"), null);
});

test("professional ownership helper valideert ownership", () => {
  assert.equal(isProfessionalOwner("prof-1", "prof-1"), true);
  assert.equal(isProfessionalOwner("prof-1", "prof-2"), false);
  assert.equal(isProfessionalOwner("prof-1", null), false);
});

test("KPI berekeningen voor acceptatiepercentage en winrate", () => {
  assert.equal(calculateAcceptanceRate(8, 2), 80);
  assert.equal(calculateWinRate(3, 1), 75);
  assert.equal(calculateAcceptanceRate(0, 0), 0);
  assert.equal(calculateWinRate(0, 0), 0);
});
