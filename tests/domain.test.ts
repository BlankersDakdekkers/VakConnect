import assert from "node:assert/strict";
import test from "node:test";
import { isProfessionalEligibleForLead } from "../lib/matching/eligibility.ts";
import { formatPostalCode, getPostalCodePrefix, normalizePostalCode } from "../lib/utils.ts";

test("normalizePostalCode removes spaces and uppercases", () => {
  assert.equal(normalizePostalCode("4811 ab"), "4811AB");
});

test("formatPostalCode formats Dutch postal code with space", () => {
  assert.equal(formatPostalCode("4811ab"), "4811 AB");
});

test("getPostalCodePrefix returns four-digit prefix", () => {
  assert.equal(getPostalCodePrefix("4811 AB"), "4811");
});

test("isProfessionalEligibleForLead only matches active professional with prefix", () => {
  const candidate = {
    id: "professional-1",
    companyName: "Dakdekker Breda",
    contactName: "Jan Jansen",
    email: "jan@example.com",
    phone: "0612345678",
    status: "active" as const,
    postalCodePrefixes: ["4811", "4812"],
  };

  assert.equal(
    isProfessionalEligibleForLead(candidate, {
      leadId: "lead-1",
      serviceId: "service-1",
      postalCode: "4811 AB",
    }),
    true,
  );
  assert.equal(
    isProfessionalEligibleForLead({ ...candidate, status: "paused" }, { leadId: "lead-1", serviceId: "service-1", postalCode: "4811 AB" }),
    false,
  );
  assert.equal(
    isProfessionalEligibleForLead(candidate, { leadId: "lead-1", serviceId: "service-1", postalCode: "4900 AA" }),
    false,
  );
});
