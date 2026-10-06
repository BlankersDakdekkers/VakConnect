# Supabase bootstrap en Data API grants (Prompt 29C)

## Projectinstellingen en installatie

Gebruik voor een nieuw **hosted Supabase-project**:

- **Enable Data API: aan**; `public` moet een exposed schema zijn.
- **Automatically expose new tables: uit**. VakConnect bepaalt privileges in Git,
  niet via impliciete projectdefaults.
- **Automatic RLS: aan**. Business-tabellen hebben daarnaast expliciet RLS in
  migrations; Storage RLS en Storage-table ownership worden door Supabase beheerd.

Vanuit de actuele VakConnect-repo op `main`:

```sh
npm ci
npx supabase link --project-ref <project-ref>
npx supabase db push
```

De linkstap is alleen nodig als de repo nog niet aan het juiste project gekoppeld
is. Configureer de bestaande Vercel-variabelen:
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` en de **server-only**
`SUPABASE_SERVICE_ROLE_KEY`. Bewaar echte waarden uitsluitend in secretbeheer of
de gitignored `.env.local`; nooit in SQL, tests, documentatie of clientcode.
Gebruik de bestaande procedure in `docs/ADMIN_ACCESS_SETUP.md` voor adminrollen.

### Bestaand project herstellen na merge

Als alle migrations tot en met Prompt 29B al zijn toegepast en de lokale repo al
aan het juiste Supabase-project gekoppeld is, volstaat:

```sh
git pull
npx supabase db push
```

Voer dit uit op `main`. Daarna Vercel redeployen vanaf de gemergede `main`.
Geen reset, migration repair, handmatige SQL Editor-grants of nieuwe login/key
zijn nodig voor deze privilegefix. De nieuwe migration wijzigt geen data.
Bij ontbrekende projectlink eerst de linkstap hierboven uitvoeren.

## Auditbasis en oorzaak

Gecontroleerde base: `6c4762a63a8124bc192514b0e46bfe6b8802b8f6` (PR #34 /
Prompt 29B gemerged). De 19 bestaande migrations, in volgorde:

1. `20260909124500_initial_vakconnect_schema.sql`
2. `20260909133000_phase2_dynamic_intake.sql`
3. `20260909152000_phase3_analytics_operations.sql`
4. `20260909170000_contact_submissions_hotfix.sql`
5. `20260909190000_phase4_local_seo_cms.sql`
6. `20260909211000_prompt8_local_seo_scaling.sql`
7. `20260909222000_phase5_commercial_lead_wallet.sql`
8. `20260910160000_phase6_lead_distribution_engine.sql`
9. `20260911100000_phase7_professional_onboarding_verification.sql`
10. `20260911110000_phase7_professional_onboarding_security_hardening.sql`
11. `20260919104000_prompt11_post_merge_hardening.sql`
12. `20261001100000_prompt12_notifications_operations.sql`
13. `20261002100000_prompt12_followup_hardening.sql`
14. `20261002210000_prompt19_analytics_hardening.sql`
15. `20261002220000_prompt20_cro_experiments.sql`
16. `20261005150000_prompt27_marketplace_access_hardening.sql`
17. `20261005170000_prompt28_lead_quality.sql`
18. `20261005180000_prompt29_admin_quality_operations.sql`
19. `20261005190000_prompt29b_admin_access.sql`

Deze definiëren 40 public business-tabellen en 58 functies (35 SECURITY DEFINER,
23 SECURITY INVOKER), inclusief triggerfuncties. Vroege migrations zetten RLS en
policies aan maar geven **geen tabelprivileges**, ook niet op `leads`.
Expliciete tabelgrants vóór 29C bestaan alleen voor notifications/preferences,
operational settings/workers, experiments, quality reviews/events en admin-role
audit. Er zijn geen schema-, sequence- of default-privilege-statements.
RPC grants/revokes staan in commercial, onboarding/hardening, notifications,
experiments en Prompts 27–29B.

`createAdminSupabaseClient()` gebruikt de service key, maar **BYPASSRLS verleent
geen SELECT/INSERT/UPDATE/DELETE en geen schema USAGE**. Zonder automatische
tabelgrants faalt `SELECT ... FROM public.leads` dus met PostgreSQL `42501:
permission denied for table leads`, ook met effectieve RLS-bypass en schema
USAGE. Een succesvolle Auth Admin API-call bewijst geen databaseprivileges.

De regressiondatabase reproduceert die ontbrekende SELECT vóór de nieuwe
migration, en voert daarna de SQL-equivalenten van `getAdminLeads()` (inclusief
services-join), `getAdminAttributionSummary()` en `getAdminDashboardStats()` uit
als echte `service_role`. Lege tabellen leveren nul rijen/nul counts, geen error.
Er is geen applicatieworkaround die queryfouten als een lege lijst behandelt.
Dit bewijst het databaseprobleem onder de opgegeven instellingen; zonder hosted
credentials is het geen verificatie van de precieze Vercel/PostgREST-response.

## Privileges versus RLS

- **anon**: geen login; alleen catalogus-SELECT voor actieve intakegegevens.
- **authenticated**: zowel professional- als adminsessies. De app-rol verandert
  de database-role niet. RLS bepaalt eigen rijen of actuele adminbevoegdheid.
- **service_role**: uitsluitend server-side adminclient/worker; Supabase levert
  BYPASSRLS. De migration verandert geen role-attributen of Auth-users.
- **PUBLIC**: PostgreSQL-pseudorol waarvan iedereen rechten erft; geen
  business-table grants of privileged RPC execute grants.

Toegang vereist eerst schema USAGE en relation-/functionprivileges, daarna
RLS waar van toepassing. Schema USAGE opent zelf geen tabellen en verleent
geen CREATE. Alle drie API-rollen krijgen USAGE op `public`; platform-managed
`auth`/`storage` ACLs worden niet gewijzigd.

## Expliciete tabelmatrix

`S/I/U/D` = SELECT/INSERT/UPDATE/DELETE; `—` = geen tabelprivileges.
Alle rechten gelden naast de ongewijzigde policies, constraints en triggers.

| Tabel | anon | authenticated | service_role |
| --- | --- | --- | --- |
| services | S | S | S/I/U |
| service_questions | S | S | S/I/U |
| service_question_options | S | S | S/I/U |
| professionals | — | S/U | S/I/U/D |
| professional_services | — | S/I/U | S/I/U |
| professional_service_areas | — | S/I/U/D | S/I |
| professional_distribution_settings | — | S/I/U | S/I/U |
| professional_documents | — | S/I/U | S/U |
| professional_document_requirements | — | S | S |
| professional_review_feedback | — | S | S/I |
| professional_audit_log | — | S | S |
| professional_notification_events | — | S/U(read_at) | S/I/U |
| professional_notification_preferences | — | S/I/U | S |
| leads | — | S/U | S/I/U/D |
| lead_answers | — | S | S/I |
| lead_images | — | S | S/I |
| lead_matches | — | — | S/I/D |
| lead_assignments | — | S/U | S/I |
| lead_activity | — | S | S/I |
| lead_distribution_runs | — | — | S/I/U |
| lead_distribution_candidates | — | S/U | S/I/U |
| professional_wallets | — | S | S |
| wallet_transactions | — | S | S |
| lead_purchases | — | S | S |
| lead_pricing_rules | — | S/I/U | S |
| commercial_audit_log | — | I | S |
| analytics_events | — | — | S/I/U |
| contact_submissions | — | — | S/I/U |
| seo_locations | — | — | S/I/U |
| seo_local_pages | — | — | S/I/U |
| seo_audit_log | — | — | I |
| operational_settings | — | S | S |
| operational_worker_runs | — | S | S/I/U |
| experiments | — | S | S |
| experiment_variants | — | S | S |
| experiment_assignments | — | S | S/I/U |
| experiment_audit_log | — | S | S |
| lead_quality_reviews | — | S | — |
| lead_quality_review_events | — | S | — |
| admin_role_audit | — | S | S |

Authenticated `leads` UPDATE, pricing mutations en commercial-audit INSERT zijn
nodig voor bestaande **adminsessie**-acties; professional-RLS verleent deze
mutaties niet. Document UPDATE heeft nog steeds de bestaande admin-only
UPDATE-policy. Documentdelete gaat via de gecontroleerde pending-document RPC,
niet via direct DELETE. Notificatiemutaties blijven kolomgericht op `read_at`.
Operational-, experiment-, quality-review- en role-audit-reads blijven admin-only.

Bronnen voor deze matrix: `lib/services/queries.ts` (publieke embedded intake),
`lib/public/actions.ts`, `lib/leads/submission.ts`, `lib/analytics/server.ts`
(server-only submissions); `lib/auth/helpers.ts`, `lib/professionals/actions.ts`,
`lib/professionals/queries.ts`, `lib/leads/actions.ts`, `lib/leads/queries.ts`,
`lib/commercial/actions.ts`, `lib/commercial/queries.ts`,
`lib/distribution/engine.ts`, `lib/notifications/actions.ts` (sessies plus
serverflows); `lib/operations/`, `lib/experiments/`, `lib/seo/` (serverflows).
Embedded relations tellen mee, niet alleen directe `.from()`-calls.

De migration trekt bestaande table grants op deze **benoemde** tabellen in en
bouwt alleen de bovenstaande matrix op; ook oudere automatische exposure wordt
zo niet behouden. Geen TRUNCATE, REFERENCES of TRIGGER-grants, geen globale
table grants. Wallet/ledger/purchase- en reviewmutaties blijven RPC/trigger-only,
ook voor service_role. De owner voert SECURITY DEFINER-bodymutaties uit.

## RLS-policy-audit en regressies

- Services/questions/options: actieve catalogusreads; beheer via `is_admin()`.
- Professionals: eigen `auth_user_id`; services/areas/distribution settings:
  eigen `professional_id`. Self-update/integrity-triggers beschermen status,
  verificatie en ownership.
- Leads/images/answers: alleen ontsloten purchase/legacy-assignment-toegang via
  `can_professional_view_lead_contact`; matches/candidates: eigen professional.
  Geen publieke lead-PII. Activity-policy houdt feedback per professional apart.
- Assignments: eigen professional + bestaande status/quality/CAS- en
  access-immutability-triggers. Wallet/transactions/purchases: eigen reads,
  financiële writes uitsluitend via atomic definer-RPCs.
- Documentmetadata: eigen reads/pending-insert met gevalideerde eigen storagepath;
  reviewfeedback/audit: eigen reads. Notification-events: eigen delivered-events,
  update alleen read state; preferences: eigen rijen, externe kanalen uit.
- Contact/analytics/SEO-beheer/commercial audit: adminpolicies; publieke SEO-reads
  bestaan als policies maar krijgen geen anon grant omdat de app server-side leest.
- Operational/experiments/review/admin-role-audit: admin-only reads.
- `is_admin()` leest **actuele** `auth.users.raw_app_meta_data`; ingetrokken
  adminrechten werken ook bij een oud JWT niet meer.

Geen bestaande policy, RLS-status, wallet-/matching-/quality-businessregel of
experimentstatus wordt door 29C veranderd. Eén aanvullende **restrictive**
UPDATE-policy op distribution candidates voorkomt dat de nu expliciete
authenticated UPDATE-grant professionals hun eigen `queued` rij laat activeren.
Professionals kunnen alleen bestaande `offered`/`viewed` rijen bekijken/weigeren;
adminsessies en service-workers behouden hun bestaande toegang.
Ownershippolicies en immutable-field/status-triggers blijven daarnaast gelden.
Bestaande SECURITY INVOKER-helpers
hebben hun afhankelijkheden: `current_professional_id` leest `professionals`;
`can_professional_view_lead_contact` leest purchases én assignments.

## Functions en RPC EXECUTE

| RPC/helper | anon | authenticated | service_role |
| --- | --- | --- | --- |
| is_admin | execute (false) | execute, actuele DB-check | execute (false) |
| current_professional_id, can_professional_view_lead_contact | — | execute | execute |
| professional_document_storage_path_is_owned, professional_document_record_path_is_owned | — | execute | execute |
| is_valid_lead_progress_transition | — | execute | execute |
| generate_lead_public_reference, analytics_metadata_is_safe | — | — | execute (default/CHECK) |
| transition_own_professional_onboarding, delete_own_pending_professional_document | — | execute + ownership checks | bestaande execute + bodychecks |
| purchase_lead | — | execute + professional/offer checks | — |
| apply_wallet_transaction, refund_lead_purchase | — | execute + body-authorization | — |
| get_wallet_reconciliation | — | execute + body-authorization | execute |
| update_assignment_quality (INVOKER) | — | execute + eigen assignment/CAS | — |
| admin_lead_quality_queue/detail, admin_update_lead_quality_review | — | execute + actuele admincheck | — |
| refresh_lead_sales_state | — | — | execute |
| claim_expired_distribution_candidates, activate_lead_distribution_run | — | — | execute |
| claim_pending_notification_events, claim_expired_professional_documents | — | — | execute |
| transition_experiment_status | — | — | execute + bodychecks |

De worker HTTP-secret beveiligt de worker-entrypoint, niet database-EXECUTE;
de worker gebruikt vervolgens de server-only service client.
Admin-review RPCs worden juist met de authenticated sessieclient aangeroepen,
niet met een service key.

De volledige actuele SECURITY DEFINER-inventaris:

- Autorisatie: `is_admin`, `audit_admin_role_change`.
- Commercial: `append_commercial_audit_log`, `ensure_professional_wallet`,
  `resolve_lead_price`, `refresh_lead_sales_state`, `apply_wallet_transaction`,
  `purchase_lead`, `refund_lead_purchase`, `get_wallet_reconciliation`.
- Distribution: `enforce_active_offer_for_purchase`,
  `sync_distribution_after_purchase`, `claim_expired_distribution_candidates`,
  `activate_lead_distribution_run`.
- Onboarding: `append_professional_audit_log`, `enqueue_professional_notification`,
  `touch_professional_verification_on_document_change`,
  `track_professional_audit_after_change`,
  `track_professional_document_audit_after_change`,
  `transition_own_professional_onboarding`, `delete_own_pending_professional_document`.
- Notifications/operations: `notify_professional_document_rejection`,
  `notify_professional_suspension`, `claim_pending_notification_events`,
  `claim_expired_professional_documents`, `notify_distribution_candidate_lifecycle`,
  `notify_lead_assignment_created`, `notify_distribution_run_exhausted`,
  `resolve_professional_review_feedback_on_status_change`.
- Experiments: `transition_experiment_status`.
- Quality/review: `audit_assignment_quality`, `admin_lead_quality_items`,
  `admin_lead_quality_queue`, `admin_lead_quality_detail`,
  `admin_update_lead_quality_review`.

Interne audit/enqueue/wallet/price/review-items helpers zijn owner-only.
Direct EXECUTE op alle 26 benoemde application-triggerfuncties wordt ingetrokken,
ook bij oude automatische function grants; triggeruitvoering zelf vereist die
API-callergrants niet. Dit omvat zowel DEFINER- als INVOKER-triggers en behoudt
eerdere trigger-hardening. Geen execute-grant/revoke op alle schemafuncties;
extensionfuncties en overige pure INVOKER-functions blijven ongemoeid.
Bodies en search paths blijven ongewijzigd.

## Sequences en toekomstige migrations

Er zijn geen business serial/identity-sequences; UUID-defaults vereisen geen
sequence USAGE/SELECT. Daarom geen sequence grants.

Geen `ALTER DEFAULT PRIVILEGES`: brede defaults zouden toekomstige private
tabellen direct ontsluiten, en defaults gelden alleen voor de **werkelijke
creator-role**, niet automatisch voor alle migration-/platform-owners.
Elke toekomstige migration moet daarom zijn eigen noodzakelijke grants,
function revokes en RLS-policies expliciet toevoegen en testen. De nieuwe
`20261006100000_prompt29c_data_api_grants.sql` draait na 29B en kan veilig opnieuw
worden uitgevoerd. Ze werkt forward op een bestaand project, zonder reset.

## Waarom één historische bootstrapregel is verwijderd

Alleen `alter table storage.objects enable row level security;` is verwijderd
uit de initial migration. De hosted migration-role is geen owner van
Supabase-managed `storage.objects`: de regel veroorzaakte `must be owner of
table objects`. Supabase beheert RLS op deze tabel al.

Geen andere historische migration is aangepast. Bucketconfiguratie, private
`lead-images` en `professional-documents`, storagepolicies, documentpathchecks
en signed URL-flows blijven intact. Professionals mogen geen documenten van
anderen lezen; er is geen publieke SELECT-policy voor deze private objects.
Een eigen plain-PostgreSQL installatie moet Storage/Auth-platformobjecten en
hun ACLs/RLS zelf vooraf bootstrapen; VakConnect vervangt Supabase Storage niet.

## Tests en grenzen van lokale verificatie

`npm run test` omvat bestaande commercial/onboarding/worker/quality/admintests
en de nieuwe Prompt 29C PostgreSQL-regressies. Die starten een tijdelijke
PostgreSQL 16-cluster, bootstrapen minimale Auth/Storage-platformobjecten en
passen **alle** migrations in bestandsvolgorde toe. Zonder PostgreSQL-binaries
worden database-backed tests expliciet skipped; dat is geen database-pass.

Het model gebruikt service_role met echte BYPASSRLS en geen automatische table
grants, plus platform-enabled storage RLS. Een static regression verbiedt
ownership-sensitive Storage-RLS ALTERs in alle migrations.
Plain PostgreSQL emuleert niet de volledige hosted platform-ownershipmachtiging,
PostgREST schema cache/configuratie, Storage HTTP-service of Vercel-runtime.
De lokale database-tests zijn daarom geen hosted `supabase db push` of echte
`/admin`-browser-pass. Verifieer die na deployment op het gekoppelde project.

### Bestaande full-chain beperking buiten de grantfix

De bestaande `lead_activity` CHECK gebruikt dezelfde
`analytics_metadata_is_safe(jsonb)` als analytics-events. De Prompt 19/20
allowlist staat operationele quality-auditkeys zoals `assignment_id` en
`reachability` niet toe, terwijl de Prompt 28 audittrigger die juist schrijft.
Daarom bewijst de RPC execute-grant geen geslaagde full-chain quality-update.
Ook operationele metadata zoals de bestaande leadscore-activity moet afzonderlijk
tegen die CHECK worden geverifieerd. De analytics-route-regex `{0,300}` uit
dezelfde historische validator is bovendien niet PostgreSQL-compatibel
(maximale bounded repetition is 255).

29C verandert deze bestaande metadata-/analytics-businessregels niet en versoepelt
geen CHECK om tests groen te maken. Bestaande geïsoleerde Prompt-regressies zijn
dus geen bewijs dat al deze samengestelde runtimeflows werken. Een volledige
product-runtime Definition of Done vereist een aparte, expliciet beoordeelde
correctie van deze baselineproblemen plus hosted verificatie.

## Troubleshooting: verschillende foutklassen

| Symptoom | Controle / betekenis |
| --- | --- |
| `42501 permission denied for table leads` | Table privilege ontbreekt; controleer `has_table_privilege('service_role','public.leads','SELECT')` en of de 29C migration toegepast is. RLS-bypass alleen helpt niet. |
| `permission denied for schema public` | Controleer `has_schema_privilege('<role>','public','USAGE')`; een tabelgrant vervangt schema USAGE niet. |
| `permission denied for sequence ...` | Alleen relevant bij sequence-defaults; huidige business-tabellen hebben die niet. Geef niet globaal sequencegrants. |
| `permission denied for function ...` | Controleer exacte overloaded signature en execute-grant. Admin-review hoort authenticated te blijven; worker RPCs horen service-only. |
| RLS INSERT/UPDATE rejection | Privileges bestaan, maar ownership/admin/policy WITH CHECK faalt; corrigeer de sessie of toegestane flow, schakel RLS niet uit. |
| SELECT geeft nul rijen zonder error | Kan RLS-filtering of een werkelijk lege dataset zijn. Service-role op een lege DB hoort lege states/nul counts op te leveren. |
| Relation niet gevonden / niet exposed / schema-cache error | Controleer project-URL, migrationstatus, relation/schema-naam, Data API enabled en exposed schema `public`. Dit is niet hetzelfde als een ontbrekende SELECT-grant. |
| Auth Admin API werkt, `.from()` faalt | Auth- en Data API zijn verschillende routes/rechten; inspecteer de databasefout, niet opnieuw de loginflow ontwerpen. |
| `must be owner of table objects` | Controleer dat de gemergede initial migration wordt gebruikt, zonder de verwijderde platform-RLS ALTER; geen handmatige lokale patch nodig. |

Bewaar foutcode/-categorie voor diagnose zonder keys, JWTs, persoonsgegevens of
private documentpaden te loggen. Een permission error mag niet als succesvolle
lege dashboardstate worden behandeld.
