# VakConnect architectuur

## Globale architectuur

VakConnect is opgezet als een Next.js App Router applicatie met TypeScript strict mode, Tailwind CSS v4 en Supabase voor database, authenticatie en opslag. Server Components zijn de standaard. Client Components worden alleen gebruikt voor interactieve flows zoals de multi-step aanvraagfunnel.

## Routegroepen

- `app/(public)` bevat de publieke website, de aanvraagfunnel en de vakman-landingspagina.
- `app/login` bevat de gedeelde inlogroute voor admin en professional.
- `app/(admin)/admin/*` bevat het admin-dashboard, leadbeheer, vakmannen en dienstenbeheer.
- `app/(professional)/vakman/*` bevat het vakman-dashboard, eigen aanvragen en profiel.
- `app/api/leads` verwerkt publieke leadinzendingen server-side.

## Domeinen en library-structuur

- `lib/auth` regelt rolbepaling, sessiecontrole en login/logout acties.
- `lib/supabase` bevat server-, admin- en middleware-clients.
- `lib/leads` bevat querylogica, server actions, publieke leadopslag en scoring.
- `lib/professionals` bevat admin-querylogica en mutaties voor vakmannen.
- `lib/services` bevat querylogica en mutaties voor diensten plus intakebeheer.
- `lib/matching` bevat pure matchingtypes en database-gedreven matchgeneratie.
- `lib/storage` bevat veilige upload- en signed URL-logica voor leadafbeeldingen.
- `lib/validation` bevat Zod-schema's voor lead submission, intakevragen, antwoorden, scoring en matching.
- `types` bevat domeintypes voor rollen, leads, services en professionals.

## Databaseconcepten

De basis bestaat uit de tabellen `professionals`, `services`, `service_questions`, `service_question_options`, `professional_services`, `professional_service_areas`, `leads`, `lead_answers`, `lead_images`, `lead_matches`, `lead_assignments`, `analytics_events` en `lead_activity`.

Belangrijke keuzes:

- Alle primaire sleutels zijn UUID's.
- `leads.public_reference` gebruikt een willekeurige `VC-XXXXXXXX` referentie die niet afleidbaar is van een intern ID.
- `professional_services` en `lead_assignments` hebben unieke combinaties om dubbele koppelingen te voorkomen.
- `service_questions.slug` is uniek binnen een dienst.
- `lead_answers` houdt dienstspecifieke intake generiek buiten de `leads`-tabel.
- `lead_matches` bewaart potentiële geschikte vakmannen; `lead_assignments` bewaart daadwerkelijke toewijzingen.
- `postal_code_prefix` gebruikt een viercijferige MVP-regiobasis voor matching.
- `created_at` en `updated_at` zijn standaard aanwezig waar mutaties relevant zijn.

## Auth-aanpak

Supabase Auth wordt gebruikt voor admins en professionals. Applicatierollen worden server-side bepaald via `app_metadata.role` in de Supabase user. De applicatie ondersteunt minimaal:

- `admin`
- `professional`

Na inloggen wordt altijd server-side bepaald naar welk dashboard iemand mag. Een professional wordt extra gekoppeld aan het eigen `professionals` record via `auth_user_id`.

## RLS-aanpak

RLS is geactiveerd op alle relevante domeintabellen.

- Publiek kan alleen actieve services lezen.
- Publiek kan alleen actieve `service_questions` en `service_question_options` lezen.
- Admins worden in de normale client herkend via `is_admin()` op basis van JWT metadata.
- Professionals kunnen alleen hun eigen `professionals`, `professional_services`, `professional_service_areas` en `lead_assignments` lezen.
- Professionals kunnen alleen `leads`, `lead_images` en `lead_answers` lezen als er een assignment naar hun `professional_id` bestaat.
- Professionals kunnen alleen eigen `lead_matches` lezen wanneer dat server-side nodig is; ze zien geen matches van andere vakmannen.
- Professionals kunnen assignments niet creëren; alleen admins of server-side service-role logica kunnen toewijzen.

Admin-mutaties verlopen in de applicatie server-side via de service role key nadat de admin-rol eerst is gevalideerd.

## Lead lifecycle

1. Consument kiest een dienst in `/aanvraag`.
2. De funnel laadt actieve `service_questions` plus opties en rendert de juiste inputtypes.
3. Client-side validatie geeft directe feedback; `POST /api/leads` valideert alles opnieuw server-side met Zod.
4. Lead wordt opgeslagen in `leads`.
5. Dienstspecifieke antwoorden worden generiek opgeslagen in `lead_answers`.
6. Optionele afbeeldingen worden veilig opgeslagen in de private bucket `lead-images` en geregistreerd in `lead_images`.
7. `lib/leads/scoring` berekent `lead_score` en `score_reasons`.
8. `lib/matching` berekent potentiële matches en slaat die op in `lead_matches`.
9. Admin beoordeelt de lead en wijst handmatig toe via `lead_assignments`.

## Assignment lifecycle

1. Admin maakt een record in `lead_assignments`.
2. Leadstatus wordt op `assigned` gezet.
3. Professional ziet alleen eigen assignments in `/vakman/aanvragen`.
4. Bij openen wordt een pending assignment gemarkeerd als `viewed`.
5. Professional kan accepteren of weigeren.
6. Timestamps `accepted_at` of `rejected_at` worden vastgelegd.

## Dynamische intake-opzet

- Iedere dienst beheert eigen actieve intakevragen in `service_questions`.
- Optiegedreven vraagtypes (`select`, `multiselect`, `radio`) gebruiken `service_question_options`.
- Antwoorden worden opgeslagen in `lead_answers` met generieke kolommen (`answer_text`, `answer_number`, `answer_boolean`, `answer_json`).
- De frontend bevat geen hardcoded beroepsspecifieke formulieren.

## Scoring-opzet

- `lib/leads/scoring/index.ts` is een pure module.
- De score is altijd geclamped tussen 0 en 100.
- Factoren zijn centraal gewogen voor contactgegevens, adres, omschrijving, afbeeldingen, verplichte intake, preferred timing en inhoudelijke volledigheid.
- `score_reasons` bewaart uitlegbare reason-items voor admininzage.

## Matching-opzet

`lead_matches` bevat potentiële geschikte vakmannen wanneer aan alle voorwaarden wordt voldaan:

- `professionals.status = active`
- `professional_services.active = true`
- `service_id` matcht
- ten minste één `professional_service_area.postal_code_prefix` matcht met de leadpostcode

Iedere match bevat `professional_id`, `match_score` en `reasons`. De admin beslist altijd handmatig over de uiteindelijke toewijzing. `lead_assignments` blijft dus het beslismoment; `lead_matches` is alleen de shortlist.

## Storage-aanpak

Leadafbeeldingen worden opgeslagen in een private Supabase Storage bucket (`lead-images`). Bestandsnamen worden veilig server-side gegenereerd op basis van UUID's. Publieke bezoekers krijgen geen directe opslagtoegang. Dashboards gebruiken server-side gegenereerde signed URLs.

## Toekomstige uitbreidingen

De huidige structuur is voorbereid op:

- rijkere scoring- en matchinglogica
- uitgebreide professionalprofielen
- betalingen en leadverkoop
- notificaties en workflow-automatisering
- SEO-uitbreidingen zoals dienst- en locatiepagina's
- admin tooling voor kwalificatie, rapportage en lifecycle-automatisering


## Attribution model (fase 3)

- Last-touch attribution wordt opgeslagen op `leads` met `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `landing_page`, `referrer`, `gclid` en `fbclid`.
- First-touch basis wordt opgeslagen via `first_touch_source` en `first_touch_timestamp`.
- `source` blijft bestaan voor backwards compatibility met bestaande businesslogica.
- Attribution wordt client-side verzameld en server-side gevalideerd/opgeslagen bij lead submission.

## Analytics events en privacy

- Funnel-events zijn centraal gedefinieerd in `lib/analytics/events.ts`.
- `app/api/analytics/events` accepteert alleen whitelisted eventnamen en anonieme sessie-id's.
- `analytics_events` bevat alleen niet-gevoelige metadata (zoals stapnummer, dienst-id, upload-aantal).
- Verboden in events: naam, e-mail, telefoon, volledig adres, vrije omschrijving, foto's en andere PII.
- `lib/analytics/providers.ts` biedt een provider-abstractie zodat GA4/Plausible/PostHog/Meta later gekoppeld kunnen worden zonder domeinlogica te herschrijven.

## Professional onboarding en beheer

- `professionals` bevat onboardingvelden inclusief `description` en `verification_status` (`unverified`, `pending`, `verified`, `rejected`).
- Admin beheert op `/admin/vakmannen/[id]` de secties: bedrijfsgegevens, accountstatus, verificatie, diensten, werkgebieden en statistieken.
- Services blijven data-driven via `professional_services`; werkgebieden via `professional_service_areas` met postcode4-validatie.

## Professional self-service autorisatie

- `/vakman/profiel` laat professionals alleen veilige profielvelden muteren: `contact_name`, `phone`, `website`, `description`.
- `status`, `verification_status`, `auth_user_id` en admin-only koppelingen blijven server-side beschermd.
- Autorisatie gebeurt dubbel: server-side checks in actions én database policies/triggers in Supabase.

## Progress lifecycle en lead activity

- Assignmentstatus (pending/viewed/accepted/rejected) blijft apart van operationele progressie.
- Operationele voortgang gebruikt `lead_progress_status`: `new`, `contacted`, `appointment_scheduled`, `quote_sent`, `won`, `lost`.
- `lead_activity` registreert statuswissels en sleutelacties als tijdlijn voor admin en professional.
- Validatie van progress-transities gebeurt server-side en in de database-trigger.

## KPI-berekening

- Admin dashboard toont volume, lifecycle-statussen, leadkwaliteit en ratio's (acceptatiepercentage/winrate) op basis van echte databasewaarden.
- Professional dashboard toont uitsluitend eigen KPI's uit eigen assignments en progressiestatussen.
- Attribution KPI toont leads per source/medium op basis van opgeslagen leadattributie.


## Publieke route-architectuur (contentfase)

De publieke laag gebruikt uitsluitend routes in `app/(public)`:

- `/`
- `/aanvraag`
- `/hoe-werkt-het`
- `/diensten`
- `/voor-vakmannen`
- `/aanmelden-vakman`
- `/dakdekker`
- `/dakdekker/daklekkage`
- `/dakdekker/dakrenovatie`
- `/dakdekker/dakpannen-vervangen`
- `/dakdekker/plat-dak`
- `/dakdekker/schoorsteen`
- `/kosten`
- `/over-vakconnect`
- `/contact`
- `/privacy`

Deze routes gebruiken bestaande UI-bouwblokken (`Card`, `Button`, `FormField`, `Input`, `Select`, `Textarea`) en raken geen dashboardlogica.

## Contentstructuur en scheiding van verantwoordelijkheden

- Publieke pagina's bevatten alleen content, CTA's en veilige formulieringangspunten.
- Businesslogic voor leads, matching, scoring, auth en analytics blijft in `lib/leads`, `lib/matching`, `lib/auth` en `lib/analytics`.
- Service-data voor publieke lijsten komt uit `lib/services/queries` (`getActiveServices`, `getActiveServicesWithQuestions`) zodat geen dubbele hardcoded dataset nodig is.

## SEO-architectuur

- `lib/config/site.ts` bevat `buildPageMetadata` voor consistente title/description/canonical/OG-opbouw.
- `app/sitemap.ts` registreert indexeerbare publieke routes centraal.
- `app/robots.ts` staat publieke routes toe en blokkeert `/admin`, `/vakman` en `/login`.
- Contentpagina's houden één duidelijke H1 en semantische H2/H3 voor crawlbaarheid en leesbaarheid.

## Lokale SEO-model (Prompt 6)

- `lib/content/locations.ts` is de centrale bron voor stedendata met:
  - `slug`, `name`, `province`, `regionLabel`
  - `introFacts`, `localCharacteristics`, `nearbyCities`
  - `published`, `indexable`, `priority`
  - optioneel `populationBand` en `housingNotes`
- `lib/content/local-service-pages.ts` beheert publicatie van lokale pagina’s met expliciete combinaties per dienst/stad (en beperkte subdienstpilot).
- De combinatieconfig bevat per pagina o.a. `canonicalPath`, `localIntro`, `localSections`, FAQ en interne links.
- Het model voorkomt massale autogeneratie: alleen expliciet geconfigureerde combinaties worden gepubliceerd of geïndexeerd.

## Lokale routearchitectuur

- Hoofdservice blijft op `/{vakgebied}` via `app/(public)/[vakgebied]/page.tsx`.
- Diepere routes worden centraal afgehandeld via `app/(public)/[vakgebied]/[...slug]/page.tsx`:
  - `/{vakgebied}/{stad}` → lokale hoofdpagina
  - `/{vakgebied}/{subdienst}` → bestaande subdienstpagina
  - `/{vakgebied}/{subdienst}/{stad}` → lokale subdienstpagina
- Deze resolver voorkomt routeconflicten tussen stadslug en subdienstslug en bewaart bestaande service-URL’s.

## Canonical, indexatie en robots

- Metadata loopt via `buildPageMetadata`.
- Lokale pagina’s krijgen self-referencing canonical (`canonicalPath` uit config).
- `indexable: false` forceert `robots: noindex,follow`; `indexable: true` geeft `index,follow`.
- `published: false` routes worden niet gerenderd.

## Sitemaplogica lokaal

- `app/sitemap.ts` combineert:
  - vaste publieke routes
  - bestaande service-routes
  - lokale routes uit `getIndexableLocalRoutes()`
- Alleen routes met `published && indexable` komen in de sitemap.
- Duplicaten worden gefilterd voordat XML-output wordt opgebouwd.

## Interne linking lokaal

- Vakgebiedpagina’s tonen extra links naar lokale stadsroutes (alleen gepubliceerde combinaties).
- Subdienstpagina’s linken naar beschikbare lokale subdienstroutes.
- Lokale pagina’s linken terug naar:
  - vakgebiedhoofdpagina
  - parent subdienst (voor lokale subdienstpagina’s)
  - lokale hoofdpagina van dezelfde stad
  - nearby cities (alleen als doelroute gepubliceerd is)
- `/regios` is een publieke hub met overzicht van gepubliceerde steden.

## Publieke formulieren

- `lib/public/actions.ts` bevat server actions voor contact en vakman-aanmelding.
- Vakman-aanmelding schrijft naar bestaande professional-tabellen zonder auth-accountcreatie en forceert `status = pending`, `verification_status = pending`, `auth_user_id = null`.
- Gekozen diensten en werkgebieden worden gekoppeld via bestaande `professional_services` en `professional_service_areas`.

## Patroon voor toekomstige dienstuitbreiding

1. Maak per dienst een hoofdpagina en eventueel subpagina's binnen `app/(public)/<dienst>/...`.
2. Gebruik unieke inhoud per zoekintentie en link altijd door naar `/aanvraag`.
3. Koppel nieuwe dienstpagina's aan `/diensten`, relevante categorie-overzichten en de sitemap.
4. Houd alle commerciële/logistieke logica buiten contentroutes; gebruik bestaande query- en action-lagen.

## Lokale SEO schaalfase (Prompt 7)

### Database-driven model

Lokale SEO-content wordt beheerd via twee tabellen:

- `seo_locations`: city-masterdata met `published`, `indexable`, prioriteit en lokale contextvelden.
- `seo_local_pages`: service-city records met `content_status` (`draft|review|approved|published`) en JSON-contentblokken.

`seo_local_pages` heeft:

- unieke combinatie op `service_slug + coalesce(subservice_slug,'') + location_id`
- unieke `canonical_path`
- publish/indexable flags plus statusworkflow

### Publicatie- en indexatieregels

Een lokale pagina is alleen sitemap/index-eligible wanneer alle voorwaarden gelden:

1. locatie `published = true`
2. pagina `published = true`
3. pagina `indexable = true`
4. `content_status = published`

`draft` en `review` mogen niet indexeerbaar zijn. Bij onvoldoende content of ongeldige publish-state blokkeert server-side validatie publicatie.

### Route-invariant en slug-collision

Publieke routevorm blijft exact gelijk:

- `/{vakgebied}/{stad}`
- `/{vakgebied}/{subdienst}`
- `/{vakgebied}/{subdienst}/{stad}`

Architectuurinvariant: een city-slug mag niet gelijk zijn aan een subdienstslug binnen hetzelfde vakgebied. Overtreding blokkeert save/publish in admin.

### Querylaag en cache

Server-only querylagen centraliseren lokale SEO-data:

- `lib/seo/locations/queries.ts`
- `lib/seo/local-pages/queries.ts`

Deze laag gebruikt DB-first data en gecontroleerde fallback naar bestaande Prompt 6 content wanneer Supabase niet geconfigureerd is.

### Revalidatie

Na SEO-mutaties worden gerichte paden gerevalideerd met `revalidatePath()`:

- relevante lokale route(s)
- `/regios`
- `/admin/seo`, `/admin/seo/locaties`, `/admin/seo/lokaal`
- `/sitemap.xml`

### Admin/CMS-oppervlak

Nieuwe beheerpaden:

- `/admin/seo` (dashboard)
- `/admin/seo/locaties` + detail
- `/admin/seo/lokaal` + detail + preview

Bulk create maakt alleen conceptrecords en genereert geen automatische SEO-teksten.

### Kwaliteitsbewaking

Per lokale pagina draait een eenvoudige niet-AI quality check:

- intro aanwezig
- voldoende secties
- FAQ aanwezig
- canonical geldig
- related links aanwezig
- placeholderdetectie
- duplicatierisico op tekstniveau

Uitkomst wordt geclassificeerd als `onvoldoende`, `redelijk` of `goed` en gebruikt als publicatiewaarschuwing/blokkade.
