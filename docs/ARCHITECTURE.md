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
