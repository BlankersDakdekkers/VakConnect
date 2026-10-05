# Dependency security hardening

## Baseline

Checked on 2026-10-05 against `main` at `93043779f1773148f23d8767530b2be6c64e8a57`. PRs #24–#29 (Prompts 20–25) are in that history. The task branch started at the same SHA.

| Component | Before |
| --- | --- |
| Node.js / npm | 22.23.3 / 10.9.9 |
| Next.js / `eslint-config-next` | 16.3.4 / 16.3.4 |
| React / React DOM | 19.2.8 / 19.2.8 |
| TypeScript | 5.9.3 |
| Supabase SSR / JS | 0.12.7 / 2.116.0 |
| ESLint | 9.39.5 |
| Lockfile | `package-lock.json`, lockfile v3 |

The lockfile was present and `npm ci` completed successfully. The other security-relevant direct dependencies are Zod 4.5.4 and the Next.js ESLint config.

## Audit findings and disposition

The initial `npm audit` reported **1 critical and 6 high package findings** (no moderate or low). Findings were checked in the dependency tree; the high count includes affected parent packages in one transitive chain.

| Finding | Dependency path and scope | Vulnerable range | Fix / disposition |
| --- | --- | --- | --- |
| GHSA-vcvr-r3jv-pc5j, Next.js ImageResponse RCE (critical) | Direct `next`; production runtime | `>=16.2.0 <16.3.6` | Updated to 16.3.6, the minimum patched stable release identified by the advisory. |
| GHSA-q2hr-2g5m-vwhr, GHSA-qhr7-859c-m2p7, GHSA-6j4f-fj2g-mc7p, `brace-expansion` (high and moderate advisories) | Transitive dev tooling: `eslint > minimatch > brace-expansion@1.1.18` and `eslint-config-next > typescript-eslint > typescript-estree > minimatch > brace-expansion@5.0.9` | `<=1.1.20` or `4.0.0–5.0.11` (individual advisory ranges are narrower) | Safe lockfile updates to 1.1.21 and 5.0.12; fixed. |
| GHSA-vfj7-8cjw-p6xm, `braces` (high) | `eslint-config-next > @next/eslint-plugin-next > fast-glob@3.3.1 > micromatch@4.0.8 > braces@3.0.3`; dev-only lint tooling | `<=3.0.3` | Remains. The configured npm registry has no release newer than 3.0.3. npm offers only a breaking downgrade to `eslint-config-next@14.2.35`; that is incompatible with this Next.js 16 setup. No override was added because no patched compatible upstream version was available. |

The `braces` issue propagates through `micromatch`, `fast-glob`, `@next/eslint-plugin-next`, and the direct dev dependency `eslint-config-next`, accounting for the five high package entries after remediation. It is not on a production runtime path. This is the only remaining high advisory; there are no remaining critical, moderate, or low findings, and no high runtime findings.

## Changes

| Package | Before → after | Reason |
| --- | --- | --- |
| `next` | 16.3.4 → 16.3.6 | Minimum stable release outside the critical advisory range. |
| `eslint-config-next` | 16.3.4 → 16.3.6 | Keep the framework-matched lint config in sync with Next.js. |
| `@next/env`, `@next/eslint-plugin-next`, `@next/swc-darwin-arm64`, `@next/swc-darwin-x64`, `@next/swc-linux-arm64-gnu`, `@next/swc-linux-arm64-musl`, `@next/swc-linux-x64-gnu`, `@next/swc-linux-x64-musl`, `@next/swc-win32-arm64-msvc`, `@next/swc-win32-x64-msvc` | 16.3.4 → 16.3.6 | Exact transitive/optional package versions required by the matching Next.js release. |
| `brace-expansion` | 1.1.18 → 1.1.21; 5.0.9 → 5.0.12 | Patched transitive versions selected by non-forced `npm audit fix`. |

React 19.2.8 remains compatible with Next.js 16.3.6's peer range and has no advisory requiring an update. No dependencies were added or removed. No application source, routes, metadata, migrations, policies, or business logic changed.

`npm outdated` was run before and after. Before, Next.js and its lint config were 16.3.4 (wanted 16.3.4; latest 16.3.8); after, both are 16.3.6 (wanted 16.3.6; latest 16.3.8). Other reported updates (Supabase JS, Zod, React/types, ESLint, and TypeScript) have no relevant audit finding; no unrelated or major upgrades were taken.

## Validation

| Check | Result |
| --- | --- |
| Clean install | `rm -rf node_modules && npm ci` passed. |
| Final audit | 0 critical, 5 high package entries, 0 moderate, 0 low. The remaining entries are the one dev-only `braces` advisory and its dependency chain. |
| Lint / typecheck | `npm run lint` and `npm run typecheck` passed. |
| Tests | `npm test`: 204 passed, 0 failed across the existing test suite. Coverage includes RLS, private documents/storage, lead privacy, wallet/purchase atomicity, distribution, analytics, experiment defaults/assignment, and public SEO routes. |
| Production build | `npm run build` passed on Next.js 16.3.6 and generated 150 static pages. It emitted one non-blocking “No build cache found” warning and no other build warnings. npm also reports the existing ESLint 9.39.5 deprecation during install. |
| HTTP route smoke | Production server returned HTTP 200 for `/`, `/aanvraag`, `/diensten`, `/dakdekker`, `/dakdekker/amsterdam`, `/vakman`, `/vakman/aanvragen`, `/vakman/profiel`, and `/admin`. |
| Authenticated/browser QA | Supabase credentials were unset; professional/admin routes showed their setup-required fallback, so no authenticated QA is claimed. Browser automation could not start (Playwright transport/OAuth failure); interactive behavior and hydration warnings were therefore not verified in a browser. |
| CodeQL / code review | CodeQL reported no code changes for analyzable languages and performed no analysis; this is not a security pass. Code review tooling failed because its configured model was unavailable. |
| Secret scan | No secrets detected in `package.json`, `package-lock.json`, or this report. |
| Security-scope checks | No migrations or product logic changed. No package additions. Next build does not report bundle-size metrics; no pre-update build artifact was available for a size comparison. |

Next.js 16.3.6's bundled upgrade guidance confirms the existing Node.js 22 and TypeScript 5 setup meets its minimums. This patch update required no App Router compatibility changes. Existing tests and the production build passed without changes to layouts, server/client components, route handlers, metadata, or not-found behavior.
