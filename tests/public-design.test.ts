import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("public baseline retains the brand and readable text/CTA contrast", () => {
  const css = source("app/globals.css");
  function color(token: string) {
    const hex = css.match(new RegExp(`--${token}: #([a-f0-9]{6});`))?.[1];
    assert.ok(hex, `Missing token ${token}`);
    const channels = [0, 2, 4].map((offset) => {
      const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  }
  for (const [text, background] of [
    ["foreground", "background"],
    ["muted-foreground", "surface"],
    ["muted-foreground", "surface-muted"],
    ["primary-foreground", "primary"],
    ["danger", "surface"],
  ]) {
    const values = [color(text), color(background)].sort((a, b) => b - a);
    assert.ok((values[0] + 0.05) / (values[1] + 0.05) >= 4.5, `${text}/${background} fails AA`);
  }
  assert.match(css, /--primary: #0f766e/);
  assert.match(css, /@layer base/);
  assert.doesNotMatch(css, /a\s*\{\s*color:\s*inherit/);
});

test("public forms share mobile-sized controls, error and disabled states", () => {
  const css = source("app/globals.css");
  for (const component of ["input", "select", "textarea"]) {
    assert.match(source(`components/ui/${component}.tsx`), /form-control/);
  }
  assert.match(css, /\.form-control\s*\{[^}]*min-height: 3rem;[^}]*font-size: 1rem;/);
  assert.match(css, /\.form-control\[aria-invalid="true"\]/);
  assert.match(css, /\.form-control:disabled/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});

test("form descriptions/errors are associated and choice groups use native semantics", () => {
  const field = source("components/ui/form-field.tsx");
  assert.match(field, /cloneElement\(child/);
  assert.match(field, /child\.props\.id !== id/);
  assert.match(field, /"aria-describedby": \[child\.props\["aria-describedby"\], describedBy\]/);
  assert.match(field, /"aria-invalid": error \? true/);
  assert.match(field, /<fieldset[^>]*aria-describedby=\{describedBy\}/);
  assert.match(field, /<legend/);
  assert.match(field, /id=\{errorId\} role="alert"/);
});

test("homepage has a quiet hero and retains existing tracked conversion destinations", () => {
  const home = source("app/(public)/page.tsx");
  assert.doesNotMatch(home, /gradient|<Badge/);
  assert.equal((home.match(/ctaId="home_hero_request"/g) ?? []).length, 1);
  assert.match(home, /ctaId="home_hero_request" ctaLocation="hero" destinationType="request"/);
  assert.match(home, /Start je aanvraag/);
  assert.match(home, /form action="\/aanvraag" method="get"/);
  assert.match(home, /name="dienst"/);
  assert.match(home, /name="postcode"/);
  assert.match(home, /getPopularServiceClusters/);
});

test("service template retains all SEO content and stable analytics identifiers", () => {
  const template = source("components/public/service-content-page.tsx");
  for (const expression of ["page.intro.map", "page.sections.map", "section.paragraphs.map", "section.bullets.map", "page.costFactors.map", "page.processSteps.map", "page.relatedLinks.map", "items={page.faqs}"]) {
    assert.ok(template.includes(expression), `Content renderer missing: ${expression}`);
  }
  for (const id of ["request_hero", "request_mid_content", "request_final_cta", "related_page"]) {
    assert.ok(template.includes(`ctaId="${id}"`));
  }
  assert.ok(template.indexOf('ctaId="request_hero"') < template.indexOf("page.intro.map"));
});

test("intake keeps seven steps, submission transport and analytics while improving presentation", () => {
  const form = source("components/forms/lead-request-form.tsx");
  assert.match(form, /const stepTitles = \["Dienst", "Dienstvragen", "Locatie", "Klus", "Foto's", "Contact", "Samenvatting"\]/);
  assert.match(form, /fetch\("\/api\/leads", \{\s*method: "POST",\s*body,/);
  assert.match(form, /body\.set\("anonymousSessionId", getOrCreateAnonymousSessionId\(\)\)/);
  assert.match(form, /router\.push\(`\/aanvraag\/bedankt\?ref=\$\{payload\.reference\}`\)/);
  assert.match(form, /funnelEventNames\.leadFunnelStepViewed/);
  assert.match(form, /role="progressbar"/);
  assert.match(form, /focusErrorRef\.current = false/);
  assert.match(form, /headingRef\.current\?\.focus\(\)/);
  for (const autocomplete of ["given-name", "family-name", "email", "tel", "postal-code"]) {
    assert.ok(form.includes(`autoComplete="${autocomplete}"`));
  }
  assert.match(form, /id="phone" type="tel"/);
  assert.match(form, /aria-busy=\{submitting\}/);
});

test("public keyboard navigation has a skip link, Escape handling and a bounded mobile menu", () => {
  const layout = source("app/(public)/layout.tsx");
  const menu = source("components/layout/mobile-navigation.tsx");
  assert.match(layout, /href="#main-content"/);
  assert.match(layout, /id="main-content" tabIndex=\{-1\}/);
  assert.match(menu, /aria-expanded=\{isOpen\}/);
  assert.match(menu, /event\.key === "Escape"/);
  assert.match(menu, /triggerRef\.current\?\.focus\(\)/);
  assert.match(menu, /event\.currentTarget\.contains\(event\.relatedTarget\)/);
  assert.match(menu, /max-h-\[calc\(100dvh-6rem\)\]/);
  assert.match(menu, /max-w-\[calc\(100vw-2rem\)\]/);
});
