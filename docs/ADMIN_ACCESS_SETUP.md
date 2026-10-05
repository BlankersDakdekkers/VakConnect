# Admin Access Setup — Prompt 29B

## Architectuur en audit

Geaudit op actuele `main` **14c6b4e87fcdc8a4733fba49868831c16b0677a8**,
na merge van PR #33. Prompts 20–29 staan in de mergehistorie (PRs #24–#33).
Er is geen tweede authenticatiesysteem, admin-signup of apart adminprofiel.

**Enige bron van waarheid:** `auth.users.raw_app_meta_data.role`, via Supabase
Auth weergegeven als `user.app_metadata.role`. Alleen de waarde `admin` geeft
adminrechten. De koppeling is de echte `auth.users.id`, nooit e-mail. Bestaande
admins kunnen al aanwezig zijn als privileged beheer deze metadata eerder heeft
gezet; hun aanwezigheid is zonder projectcredentials niet vastgesteld.
Meerdere admins worden ondersteund; een professional-profiel is niet vereist.

- `/login` en `signInWithPassword` blijven de bestaande loginflow.
- `auth.getUser()` valideert de cookie-session bij Supabase Auth en leest actuele
  gebruikersmetadata; `getSession()` of clientclaims bepalen geen toegang.
- De bestaande proxy ververst de session en controleert `/admin` en alle
  `/admin/*` requests vóór pagina-rendering, ook POST en detailroutes.
- De adminlayout blijft `requireAdminUser()` gebruiken. Adminnavigatie wordt
  alleen na autorisatie gerenderd; de setupfallback toont geen adminnavigatie.
- Alle bestaande muterende adminactions doen opnieuw `requireAdminUser()`.
  Verborgen UI is geen autorisatie. Queries voor analytics, experimenten en
  kwaliteitsreviews hebben bovendien eigen checks. Andere bestaande privileged
  paginaqueries worden afgeschermd door proxy en layout.
- Kwaliteitsreview-RPCs vereisen een authenticated caller, `auth.uid()` en
  `is_admin()`; de actor komt uit de session. Hun CAS/auditworkflow blijft intact.
- Publieke en professional users worden geweigerd; clientstate, localStorage,
  formulierrollen, queryparameters en zelfverzonnen cookies worden niet vertrouwd.
- Login-return URLs worden intern genormaliseerd en beperkt tot `/admin[/…]`
  voor admins en `/vakman[/…]` voor professionals. Geen open redirect.

De audit vond twee databasegaten: `is_admin()` vertrouwde nog een mogelijk
verouderde JWT-role, en twee distribution-worker RPCs hadden standaard
PUBLIC EXECUTE. Eén migration sluit deze grenzen; de worker/distributionlogica
zelf wordt niet gewijzigd.

## Vereisten en environment

Node.js 22 zoals gebruikt door dit project, `npm ci`, een Supabase-project en
alle repositorymigrations in chronologische volgorde. Pas vóór grant/revoke ook
`supabase/migrations/20261005190000_prompt29b_admin_access.sql` toe via het normale
privileged deploymentproces, bijvoorbeeld de Supabase SQL Editor als `postgres`.
De migration moet met een vertrouwde eigenaar kunnen lezen uit `auth.users` en
daar een audittrigger kunnen aanmaken. Geef API-rollen nooit directe toegang tot
`auth.users`.

| Variabele | Gebruik |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL van het bedoelde Supabase-project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publieke appkey voor bestaande SSR-login |
| `SUPABASE_SERVICE_ROLE_KEY` | Alleen server/privileged lokale CLI; nooit een `NEXT_PUBLIC_*` variabele |

Gebruik uitsluitend eigen waarden in de deployment secret store of de genegeerde
`.env.local`. De CLI laadt `.env.local` automatisch; bestaande environmentwaarden
gaan voor. Zet nooit een sleutel in een CLI-argument, shell-history, screenshot,
PR of repository. De CLI gebruikt HTTPS, behalve HTTP op localhost.
Controleer het project vóór uitvoering: een service-role key heeft brede macht.
Verwijder lokale privileged keys zodra ze niet meer nodig zijn.

Voor installatie, vanuit de repositoryroot:

```sh
cd /home/runner/work/VakConnect/VakConnect
npm ci
```

## Eigen account aanmaken en UUID ophalen

1. Maak een gewone gebruiker via Supabase Auth aan, bijvoorbeeld in
   **Authentication → Users → Add user**. Geen publieke admin-signup bouwen.
2. Stel het wachtwoord veilig via Supabase Auth in; geef het niet aan scripts.
3. Bevestig het e-mailadres indien de projectinstellingen dat vereisen.
4. Kopieer het **User UID** uit Authentication → Users. Dit is `auth.users.id`,
   niet een professional-ID of een e-mailadres.
5. Controleer dat de environment bij hetzelfde project hoort en dat de migration
   is toegepast.

Er wordt geen echte admin, e-mail of credential in migrations/fixtures geseed.
De UUID hieronder is een placeholder en bestaat normaal niet: **vervang die**.

## Bootstrap en grant

Er hoeft nog geen admin ingelogd te zijn: de eigenaar gebruikt lokaal een
privileged service-role environment. De Auth Admin API controleert eerst dat de
UUID bestaat, behoudt andere `app_metadata` en zet uitsluitend `role: "admin"`.
De CLI controleert vóór een mutatie ook dat de audittabel toegankelijk is.

```sh
npm run admin:check -- 00000000-0000-0000-0000-000000000000
npm run admin:grant -- 00000000-0000-0000-0000-000000000000
npm run admin:check -- 00000000-0000-0000-0000-000000000000
```

Alle drie commando's gebruiken `scripts/admin-access.mjs`; er zijn geen nieuwe
dependencies. Alleen precies één UUID is toegestaan. Geen e-mail, wachtwoord,
SQL of extra arguments. Onbekende users en configuratie/API-fouten falen met
exitcode 1 en zonder ruwe API-details. Grant op een admin is een no-op.
Check toont alleen `user exists: yes; admin: yes/no`; een onbekende user faalt.
Succesoutput van mutaties bevat alleen action, target UUID, system/CLI en tijd.

## Login en toegang verifiëren

1. Log uit als er nog een session is.
2. Log opnieuw in via `/login` met de gewone Supabase Auth-credentials.
3. Open `/admin`; controleer dat dashboard en adminnavigatie zichtbaar zijn.
4. Controleer `/admin/analytics`, `/admin/experimenten`, `/admin/leadkwaliteit`,
   `/admin/leadkwaliteit/review` en een bestaand reviewdetail.
5. Voer een passende niet-financiële reviewactie uit en controleer de bestaande
   reviewaudit. Voer geen testrefund of walletmutatie op productiegegevens uit.
6. Log uit; een nieuwe request naar `/admin` moet naar `/login` gaan.

Een admin wordt na login standaard naar `/admin` gestuurd. Een veilige `next`
naar een adminroute wordt behouden. Een professional krijgt geen admin-return
URL maar zijn eigen `/vakman`-omgeving.

## Revoke en effect

```sh
npm run admin:revoke -- 00000000-0000-0000-0000-000000000000
npm run admin:check -- 00000000-0000-0000-0000-000000000000
```

Revoke verstuurt `role: null`; Supabase Auth verwijdert daarmee de role-key.
De CLI accepteert zowel een ontbrekende als null-role als bevestiging.
Het Auth-account, professional-profiel en
andere metadata worden niet verwijderd. Revoke op een niet-admin is een no-op.
**Een eerder gepromoveerde professional krijgt niet automatisch zijn oude role
terug.** Zet indien gewenst daarna privileged `app_metadata.role` terug op
`professional` in Supabase Auth; het bestaande gekoppelde professional-profiel
blijft beschikbaar. Normale professional users worden door deze commando's
niet gewijzigd.

Elke nieuwe serverrequest leest actuele Auth-metadata. Database-RLS en
admin-RPCs lezen via `is_admin()` de huidige metadata uit `auth.users`, gekoppeld
aan de geverifieerde `auth.uid()`. Een oud JWT met `role: admin` blijft dus niet
bevoegd. Re-login is voor intrekking niet nodig; herlogin na grant wordt
aanbevolen om client/sessionweergave te vernieuwen. Reeds afgeronde responses of
al lopende statements worden niet teruggedraaid; reeds getoonde informatie kan
niet uit het geheugen van een gebruiker worden gewist.

**Laatste admin:** de CLI blokkeert het intrekken van de laatste admin niet.
Controleer vooraf een tweede admin of behoud privileged bootstraptoegang tot
Supabase. Zo nodig kan de eigenaar opnieuw grant uitvoeren.

## RLS, audit en security boundaries

De ene nieuwe migration is nodig voor onmiddellijke DB-revocation en een
duurzame role-audit, niet voor een nieuwe rolemapping.

- `is_admin()` is een beperkte SECURITY DEFINER met lege, vaste `search_path`,
  volledig gekwalificeerde identifiers en expliciete execute grants. Anonymous
  public-read policies mogen de booleanhelper aanroepen maar ontvangen `false`.
  Service-role is geen menselijke adminsession.
- De bestaande SEO-auditpolicy gebruikt nu ook `is_admin()` in beide checks;
  publieke SEO-content en renderingregels veranderen niet.
- `claim_expired_distribution_candidates(integer)` en
  `activate_lead_distribution_run(uuid,integer,integer,integer)` zijn uitsluitend
  uitvoerbaar door service-role, niet PUBLIC/anon/authenticated. Bestaande
  workers gebruiken al service-role. Matching, batches en purchase blijven intact.
- `admin_role_audit` is geen rolebron. Een database-trigger legt alleen echte
  veranderingen naar/van admin vast, ook bij privileged Dashboard-updates:
  `system:<database-session-user>`, target UUID, grant/revoke, timestamp.
  De systemactor identificeert **niet** de menselijke CLI-operator. Gebruik voor
  operatorattributie het bestaande privileged beheerproces.
- Geen directe audit insert/update/delete grants voor API-rollen, ook niet voor
  service-role. Alleen admins kunnen via RLS lezen; service-role kan privileged
  lezen. De definer-trigger mag schrijven en is niet direct uitvoerbaar door
  API-rollen. Audit blijft behouden als een Auth-user later verwijderd wordt.
- Bestaande admins van vóór de migration krijgen geen fictieve historische
  grant-audit; toekomstige wijzigingen worden wel geregistreerd.
- Productie-SSR-cookies gebruiken `Secure` en `SameSite=Lax`; productie vereist
  HTTPS. De bestaande Supabase SSR-cookiearchitectuur, refresh en logout blijven.
  Er is geen nieuw localStorage-tokenmechanisme; SSR-cookies zijn niet als
  HttpOnly geforceerd omdat de Supabase SSR-clientarchitectuur cookie-access
  kan vereisen. Bescherm daarom ook tegen XSS.
- Service-role clients blijven `server-only`; de CLI heeft geen app/clientimport.
  Geen publieke adminbadge of roletrust op basis van e-mail of clientinput.

## Unauthorized tests en troubleshooting

- Incognito naar `/admin` en detailroute: loginredirect, geen admininhoud.
- Inloggen als professional: `/admin/*` toont geen toegang; hetzelfde geldt
  voor rechtstreeks verstuurde adminactions/RPCs.
- Zelf `isAdmin=true` in URL, localStorage, user_metadata, formulier of cookies
  zetten geeft geen rechten zonder echte gevalideerde adminsession.
- Revoke terwijl de admin ingelogd blijft: nieuwe route/RPC-request geweigerd,
  ook bij een nog niet verlopen JWT met de oude adminclaim.
- Setup-required betekent ontbrekende publieke Supabase-config; het bewijst
  **geen** succesvolle auth. Controleer de deployment environment.
- Login mislukt: controleer account, e-mailbevestiging, wachtwoord en project;
  kopieer geen tokens of ruwe API-errors naar logs/support.
- Grant faalt: controleer UUID, service-role environment en migration/auditrechten.
  Gebruik geen anon key in plaats van service-role.
- Laat bij deployment ook de werkelijke functie-ACLs controleren, inclusief
  eventuele apart ingestelde anon/authenticated grants op oudere RPCs; een
  repositorytest bewijst niet dat een live database identiek is gedeployd.

## Validatie en beperkingen

`npm ci`, lint, typecheck, **307 tests (0 failures/skips)** en productiebuild
zijn geslaagd. De
regressies omvatten authguards, veilige redirects, professional-loginhelper,
adminactions, role spoofing, UUID/unknown-user/idempotency/sanitized CLI,
Prompt 29 review RPC/RLS, detail-IDOR, revoked JWT en append-only role-audit.
Een niet-geheime service-key sentinel ontbreekt in de gebouwde clientassets.

De Prompt 26 npm-auditbaseline blijft **0 critical, 5 high package entries**:
dezelfde dev-only `braces`-keten; geen dependency/lockfilewijziging.
`npm audit --omit=dev` meldt 0 vulnerabilities.
Secret scan vond geen secrets. CodeQL JavaScript-analyse vond **0 alerts**.
De automatische Code Review-tool faalde door een niet-beschikbaar model; dit
is geen review-pass. Een afzonderlijke read-only securityaudit en diffreview zijn
uitgevoerd; de gevonden null-key-verwijdering bij Supabase revoke is gecorrigeerd
en de laatste diffreview vond geen resterende significante issues.

Er zijn **geen Supabase-testcredentials** beschikbaar in deze omgeving.
Echte admin/professional/public-browserauth, logout en live revoke zijn dus
**niet** geslaagd verklaard. Lokale PostgreSQL-tests simuleren geverifieerde
sessionclaims en testen de SQL-grenzen; auth/proxytests gebruiken mocks.
Browser/HTTP-smoke zonder Supabase bewijst alleen setupfallback en rendering.
HTTP-smoke gaf 200 met uitsluitend setupfallback op `/admin`, analytics,
experimenten, leadkwaliteit, reviewqueue, reviewdetail en `/vakman`; `/login`
gaf 200. Playwright kon niet starten (`Transport closed`), dus ook interactieve
fallback-browser-QA is niet bevestigd.
De eigenaar moet de bovenstaande echte flows na deployment nog uitvoeren.
