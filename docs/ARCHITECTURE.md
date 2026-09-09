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
- `lib/leads` bevat querylogica, server actions en publieke leadopslag.
- `lib/professionals` bevat admin-querylogica en mutaties voor vakmannen.
- `lib/services` bevat querylogica en mutaties voor diensten.
- `lib/matching` bevat pure matchingtypes en de eerste database-gedreven eligibility-query.
- `lib/storage` bevat veilige upload- en signed URL-logica voor leadafbeeldingen.
- `lib/validation` bevat Zod-schema's en gedeelde validatieconstanten.
- `types` bevat domeintypes voor rollen, leads, services en professionals.

## Databaseconcepten

De basis bestaat uit de tabellen `professionals`, `services`, `professional_services`, `professional_service_areas`, `leads`, `lead_images` en `lead_assignments`.

Belangrijke keuzes:

- Alle primaire sleutels zijn UUID's.
- `leads.public_reference` gebruikt een willekeurige `VC-XXXXXXXX` referentie die niet afleidbaar is van een intern ID.
- `professional_services` en `lead_assignments` hebben unieke combinaties om dubbele koppelingen te voorkomen.
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
- Admins worden in de normale client herkend via `is_admin()` op basis van JWT metadata.
- Professionals kunnen alleen hun eigen `professionals`, `professional_services`, `professional_service_areas` en `lead_assignments` lezen.
- Professionals kunnen alleen `leads` en `lead_images` lezen als er een assignment naar hun `professional_id` bestaat.
- Professionals kunnen assignments niet creëren; alleen admins of server-side service-role logica kunnen toewijzen.

Admin-mutaties verlopen in de applicatie server-side via de service role key nadat de admin-rol eerst is gevalideerd.

## Lead lifecycle

1. Consument vult `/aanvraag` in.
2. Client-side validatie geeft directe feedback.
3. `POST /api/leads` valideert alles opnieuw server-side met Zod.
4. Lead wordt opgeslagen in `leads`.
5. Optionele afbeeldingen worden veilig opgeslagen in de private bucket `lead-images` en geregistreerd in `lead_images`.
6. Admin beoordeelt en wijzigt leadstatus.
7. Admin wijst een lead handmatig toe aan een vakman.

## Assignment lifecycle

1. Admin maakt een record in `lead_assignments`.
2. Leadstatus wordt op `assigned` gezet.
3. Professional ziet alleen eigen assignments in `/vakman/aanvragen`.
4. Bij openen wordt een pending assignment gemarkeerd als `viewed`.
5. Professional kan accepteren of weigeren.
6. Timestamps `accepted_at` of `rejected_at` worden vastgelegd.

## Matching-opzet

Er is bewust nog geen automatische matching-engine. De huidige MVP-matching helpt admins met een shortlist van geschikte professionals wanneer aan alle voorwaarden wordt voldaan:

- `professionals.status = active`
- professional biedt de gevraagde service aan via `professional_services`
- ten minste één `professional_service_area.postal_code_prefix` matcht met de leadpostcode

De admin beslist altijd handmatig over de uiteindelijke toewijzing.

## Storage-aanpak

Leadafbeeldingen worden opgeslagen in een private Supabase Storage bucket (`lead-images`). Bestandsnamen worden veilig server-side gegenereerd op basis van UUID's. Publieke bezoekers krijgen geen directe opslagtoegang. Dashboards gebruiken server-side gegenereerde signed URLs.

## Toekomstige uitbreidingen

De huidige structuur is voorbereid op:

- automatische matching- en scorelogica
- uitgebreide professionalprofielen
- betalingen en leadverkoop
- notificaties en workflow-automatisering
- SEO-uitbreidingen zoals dienst- en locatiepagina's
- admin tooling voor kwalificatie, rapportage en lifecycle-automatisering
