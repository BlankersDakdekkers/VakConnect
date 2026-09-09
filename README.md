# VakConnect

VakConnect is een Nederlandse lead marketplace in opbouw die consumenten koppelt aan geschikte lokale vakmensen. Deze repository bevat een schaalbare basis met publieke aanvraagflow, dynamische intakevragen per dienst, lead scoring, matchingvoorstellen, protected dashboards, private file uploads en Row Level Security.

## Stack

- Next.js App Router
- TypeScript (strict)
- Tailwind CSS v4
- Supabase
  - PostgreSQL database
  - Auth
  - Storage
- Zod validatie
- Vercel-compatible deployment

## Wat is in deze fase gebouwd

- Professionele homepage met SEO-basis
- Multi-step consumentenfunnel op `/aanvraag`
- Dynamische intake-engine met dienstspecifieke vragen en opties
- Server-side leadopslag via `/api/leads`
- Generieke opslag van lead-antwoorden in `lead_answers`
- Lead scoring met uitlegbare `score_reasons`
- Private afbeeldingopslag in Supabase Storage
- Publieke bedankpagina met niet-herleidbare leadreferentie
- Admin-dashboard voor leads, vakmannen en diensten
- Adminbeheer voor intakevragen per dienst via `/admin/diensten/[id]`
- Vakman-dashboard voor eigen toegewezen aanvragen
- Matchingmodule met `lead_matches` op basis van dienst + postcodeprefix
- Supabase migraties met RLS-beleid, storage-bucket en dynamische intake-tabellen
- Lead attribution (UTM, landing page, referrer, first-touch)
- Interne funnel analytics-events zonder PII
- Professional onboarding uitgebreid met verificatiestatus en omschrijving
- Adminbeheer per vakman voor diensten en postcode4-werkgebieden
- Lead activity timeline en operationele leadprogressie
- KPI-uitbreiding voor admin- en vakman-dashboard

## Projectstructuur

```
app/
  (public)/
  (admin)/admin/
  (professional)/vakman/
  api/leads/
  login/
components/
lib/
  auth/
  leads/
  matching/
  professionals/
  services/
  storage/
  supabase/
  validation/
docs/
supabase/migrations/
tests/
types/
```

## Lokale installatie

1. Installeer dependencies:

   ```bash
   npm install
   ```

2. Kopieer `.env.example` naar `.env.local` en vul de waarden in.

3. Start de development server:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000`.

## Environment variables

Gebruik minimaal deze variabelen:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### Betekenis

- `NEXT_PUBLIC_SITE_URL`: canonical URL / metadata base
- `NEXT_PUBLIC_SUPABASE_URL`: publieke Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: client-side en SSR public key
- `SUPABASE_SERVICE_ROLE_KEY`: uitsluitend server-side voor adminmutaties en publieke leadopslag

Plaats nooit echte secrets in de repository.

## Supabase setup

1. Maak een Supabase project aan.
2. Zet in **Authentication > Providers** minimaal email/password aan.
3. Voer de migraties uit uit:

   - `supabase/migrations/20260909124500_initial_vakconnect_schema.sql`
   - `supabase/migrations/20260909133000_phase2_dynamic_intake.sql`
   - `supabase/migrations/20260909152000_phase3_analytics_operations.sql`
   - `supabase/migrations/20260909170000_contact_submissions_hotfix.sql`
   - `supabase/migrations/20260909190000_phase4_local_seo_cms.sql`
4. Controleer in **Storage** dat de private bucket `lead-images` bestaat.
5. Voeg indien nodig handmatig admingebruikers toe in Supabase Auth en zet hun `app_metadata.role` op `admin`.

### Rollen

- `admin`: toegang tot `/admin/*`
- `professional`: toegang tot `/vakman/*`

Professionals worden via het admin-dashboard aangemaakt. Daarbij wordt een Supabase Auth gebruiker gemaakt en gekoppeld aan `professionals.auth_user_id`.

## Database migrations

De migraties bevatten:

- tabellen voor leads, vakmannen, diensten, assignments en afbeeldingen
- tabellen voor `service_questions`, `service_question_options`, `lead_answers` en `lead_matches`
- enums, constraints en indexen
- triggers voor `updated_at`
- generator voor `VC-XXXXXXXX` leadreferenties
- leadscorevelden `lead_score` en `score_reasons`
- RLS policies voor publiek, admin en professional
- private Supabase Storage bucket voor leadafbeeldingen
- initiële seeddata voor diensten en voorbeeldvragen voor `Dakdekker`

## Supabase Storage setup

Leadafbeeldingen worden in de private bucket `lead-images` opgeslagen. Uploads lopen via server-side code. Bestandsnamen worden niet overgenomen van de gebruiker, maar veilig gegenereerd met UUID's. Dashboards gebruiken signed URLs in plaats van publieke buckettoegang.

## Auth setup

- Login loopt via `/login`
- Rolcontrole gebeurt server-side via Supabase sessies en `app_metadata.role`
- `middleware.ts` ververst de sessiecookie
- Beschermde routes vertrouwen niet op client-side checks

## Development commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
```

## Deployment naar Vercel

1. Voeg alle environment variables toe in Vercel.
2. Koppel de repository aan Vercel.
3. Zorg dat de Supabase migratie is toegepast voordat je productiegebruikers toelaat.
4. Controleer na deployment de protected routes, loginflow en leadopslag.

## Testaccounts

Deze repository bevat geen echte testaccounts. Maak lokaal in Supabase zelf minimaal:

- één adminuser met `app_metadata.role = admin`
- één of meer professionals via het admin-dashboard of rechtstreeks in Supabase

## Security aandachtspunten

- Service role key blijft server-side en mag nooit in client bundles terechtkomen.
- Leadopslag, statuswijzigingen, scoring en matchgeneratie gebeuren server-side.
- RLS schermt persoonsgegevens, lead-antwoorden en matchdata af voor publiek en andere professionals.
- Analytics events slaan uitsluitend niet-gevoelige metadata op (geen naam, e-mail, telefoon, adres, vrije tekst of foto's).
- Uploads zijn beperkt op type, grootte en aantal.
- De applicatie toont geen ruwe database-errors aan bezoekers.
- Plaats geen persoonsgegevens in analytics of logs.

## Dynamische intake en matching

- Diensten beheren hun eigen actieve intakevragen via `service_questions` en `service_question_options`.
- Publieke bezoekers lezen alleen actieve vragen en opties; antwoorden worden uitsluitend server-side opgeslagen in `lead_answers`.
- `lib/leads/scoring` berekent per lead een score tussen 0 en 100 met configureerbare gewichten.
- `lib/matching` genereert potentiële matches in `lead_matches`.
- `lead_matches` zijn matchvoorstellen; `lead_assignments` zijn daadwerkelijk toegewezen leads.

## Aanvullende documentatie

- `docs/ARCHITECTURE.md`

## Attribution en analytics (fase 3)

- `leads` bevat last-touch UTM velden plus `first_touch_source` en `first_touch_timestamp`.
- `lib/analytics/attribution` normaliseert queryparameters en bewaart attribution over funnelstappen.
- `analytics_events` koppelt anonieme sessies aan funnel-events met privacy-sanitization.
- `lead_submitted` wordt server-side gelogd en bestaande sessie-events worden aan `lead_id` gekoppeld.

## Lead operatie en lifecycle (fase 3)

- `lead_assignments` bevat naast assignmentstatus nu `progress_status`, `progress_updated_at` en optionele `loss_reason`.
- `lead_activity` bewaart traceerbare status- en opvolgacties met timestamps.
- Professional flow ondersteunt stappen: `contacted`, `appointment_scheduled`, `quote_sent`, `won`, `lost`.


## Publieke website- en contentfase

Deze fase breidt de publieke website uit met conversion-first pagina's en duidelijke interne navigatie:

- `/` met hero, compacte aanvraagstart, diensten, voordelen, vertrouwen en FAQ
- `/hoe-werkt-het` met procesuitleg en duidelijke do/do-not verwachting
- `/diensten` met actieve services uit de bestaande service-querylaag
- `/dakdekker` plus subpagina's voor `daklekkage`, `dakrenovatie`, `dakpannen-vervangen`, `plat-dak` en `schoorsteen`
- `/voor-vakmannen` en `/aanmelden-vakman` voor publieke vakmanwerving
- `/kosten`, `/over-vakconnect`, `/contact` en `/privacy`

## Publieke vakman-aanmelding

Publieke aanmeldingen maken **geen** actieve professional-account aan. De flow:

1. valideert server-side
2. slaat professional op met `status = pending`
3. zet `verification_status = pending`
4. koppelt gekozen diensten en postcode4-werkgebieden
5. vereist daarna handmatige adminbeoordeling

Er wordt in deze route geen automatische login of privilege-escalatie uitgevoerd.

## SEO-opzet publieke pagina's

- Iedere publieke pagina gebruikt de Next.js Metadata API met unieke title/description
- Iedere pagina heeft een canonical URL en Open Graph metadata
- `app/sitemap.ts` bevat de complete publieke kernroutes
- `app/robots.ts` laat publieke routes indexeren en blokkeert dashboard/login-routes

## Lokale SEO-architectuur (Prompt 6)

- Centrale stedendata staat in `lib/content/locations.ts` (slug, naam, provincie, regio-label, lokale context, nearby cities, published/indexable, prioriteit).
- Lokale combinaties staan expliciet in `lib/content/local-service-pages.ts`; er wordt **geen** cartesian product van alle diensten × steden gebouwd.
- Lokale routes:
  - hoofdpagina: `/{vakgebied}/{stad}`
  - subdienst + stad: `/{vakgebied}/{subdienst}/{stad}`
- Route-resolutie gebeurt in `app/(public)/[vakgebied]/[...slug]/page.tsx` en voorkomt regressie op bestaande subdienstroutes zoals `/dakdekker/daklekkage`.
- `published = false` geeft geen publieke route; `published = true` + `indexable = false` geeft werkende route met `noindex,follow`.
- Canonical is altijd self-referencing via `buildPageMetadata` met routepad uit contentconfig.
- Sitemap bevat alleen lokale routes die zowel `published` als `indexable` zijn.
- `/regios` biedt een index van gepubliceerde steden en links alleen naar bestaande lokale pagina’s.

## Veilig nieuwe steden/combinaties toevoegen

1. Voeg of wijzig stadgegevens in `lib/content/locations.ts`.
2. Voeg specifieke combinaties toe in `lib/content/local-service-pages.ts` met `published` en `indexable` flags.
3. Controleer nearby-links, canonical path en related links op geldige bestaande routes.
4. Draai `npm run test` om duplicatie-, route- en sitemapcontroles te valideren.
5. Zet pas daarna nieuwe combinaties op `indexable: true`.

## Nieuwe dienstpagina's toevoegen

1. Maak een nieuwe route onder `app/(public)/<dienst>/page.tsx`
2. Voeg unieke metadata toe met `buildPageMetadata`
3. Link de pagina vanuit `/diensten` en relevante categoriepagina's
4. Voeg de route toe aan `app/sitemap.ts`
5. Houd content gescheiden van lead-, matching- en authlogica


## Lokale SEO beheerlaag (Prompt 7)

Lokale SEO is nu database-driven via Supabase in plaats van uitsluitend codeconfig:

- `seo_locations` beheert steden, provincie/regio context, publish/indexable en prioriteit
- `seo_local_pages` beheert service-stad/subservice-stad combinaties inclusief contentstatus
- contentworkflow: `draft` → `review` → `approved` → `published`
- alleen `published + indexable + content_status=published` én gepubliceerde locatie komen in sitemap
- slug-collision invariant: city-slug mag niet conflicteren met subdienstslug binnen hetzelfde vakgebied
- adminroutes:
  - `/admin/seo`
  - `/admin/seo/locaties`
  - `/admin/seo/locaties/[id]`
  - `/admin/seo/lokaal`
  - `/admin/seo/lokaal/[id]`
  - `/admin/seo/lokaal/[id]/preview`
- bulk create maakt uitsluitend drafts (`published=false`, `indexable=false`, geen auto-content)
- publicatie gebruikt server-side publish-safety checks, quality score en duplicate-protectie
- gerichte revalidatie gebruikt `revalidatePath()` voor lokale routepaden, `/regios`, admin-overzichten en sitemap

Lokale URL-structuur blijft ongewijzigd:

- `/{vakgebied}/{stad}`
- `/{vakgebied}/{subdienst}`
- `/{vakgebied}/{subdienst}/{stad}`
