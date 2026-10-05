# VakConnect architectuur

## Globale architectuur

VakConnect is opgezet als een Next.js App Router applicatie met TypeScript strict mode, Tailwind CSS v4 en Supabase voor database, authenticatie en opslag. Server Components zijn de standaard. Client Components worden alleen gebruikt voor interactieve flows zoals de multi-step aanvraagfunnel.

## Routegroepen

- `app/(public)` bevat de publieke website, de aanvraagfunnel en de vakman-landingspagina.
- `app/login` bevat de gedeelde inlogroute voor admin en professional.
- `app/(admin)/admin/*` bevat het admin-dashboard, leadbeheer, vakmannen en dienstenbeheer.
- `app/(professional)/vakman/*` bevat het vakman-dashboard, eigen aanvragen en profiel.
- `app/api/leads` verwerkt publieke leadinzendingen server-side.
- `app/api/analytics` en `app/api/experiments` verwerken privacy-gesaneerde gedragsevents en veilige server-side varianttoewijzing/exposure.

## Domeinen en library-structuur

- `lib/auth` regelt rolbepaling, sessiecontrole en login/logout acties.
- `lib/supabase` bevat server-, admin- en middleware-clients.
- `lib/leads` bevat querylogica, server actions, publieke leadopslag en scoring.
- `lib/professionals` bevat admin-querylogica en mutaties voor vakmannen.
- `lib/services` bevat querylogica en mutaties voor diensten plus intakebeheer.
- `lib/matching` bevat pure matchingtypes en database-gedreven matchgeneratie.
- `lib/distribution` bevat eligibility-, ranking-, fairness- en offer-window logica plus fallback-engine.
- `lib/notifications` beheert getypeerde in-app/system events, voorkeuren en de notification worker.
- `lib/operations` bevat configureerbare SLA/reminderdrempels en provider-agnostische expiry- en monitoringjobs.
- `lib/experiments` bevat safe targetmatching, deterministische varianttoewijzing, experimentrapportage en adminstatusmutaties.
- `lib/storage` bevat veilige upload- en signed URL-logica voor leadafbeeldingen.
- `lib/validation` bevat Zod-schema's voor lead submission, intakevragen, antwoorden, scoring en matching.
- `types` bevat domeintypes voor rollen, leads, services en professionals.

## Databaseconcepten

De basis bestaat uit de tabellen `professionals`, `services`, `service_questions`, `service_question_options`, `professional_services`, `professional_service_areas`, `leads`, `lead_answers`, `lead_images`, `lead_matches`, `lead_assignments`, `analytics_events`, `experiments`, `experiment_variants`, `experiment_assignments`, `experiment_audit_log`, `lead_activity`, `professional_wallets`, `wallet_transactions`, `lead_pricing_rules`, `lead_purchases`, `commercial_audit_log`, `lead_distribution_runs`, `lead_distribution_candidates` en `professional_distribution_settings`.

Belangrijke keuzes:

- Alle primaire sleutels zijn UUID's.
- `leads.public_reference` gebruikt een willekeurige `VC-XXXXXXXX` referentie die niet afleidbaar is van een intern ID.
- `professional_services` en `lead_assignments` hebben unieke combinaties om dubbele koppelingen te voorkomen.
- `service_questions.slug` is uniek binnen een dienst.
- `lead_answers` houdt dienstspecifieke intake generiek buiten de `leads`-tabel.
- `lead_matches` bewaart potentiële geschikte vakmannen; `lead_purchases` bewaart commerciële aankopen; `lead_assignments` bewaart daadwerkelijke operationele leadrelaties.
- `lead_distribution_runs` versieert distributiestrategie per lead (`strategy_version`) en borgt idempotency via maximaal één actieve run per lead.
- `lead_distribution_candidates` bewaart rankpositie, score, breakdown, offerstatus en offerwindow per kandidaat zonder duplicatie van lead-PII.
- `professional_distribution_settings` beheert capaciteitslimieten zoals `max_open_offers`, `max_active_assignments` en tijdelijke pause.
- `professional_notification_events` is de gedeelde, idempotente inbox- en system-eventbron; `professional_notification_preferences` bevat uitsluitend de huidige in-app voorkeuren.
- `operational_settings` bewaart SLA-, reminder-, retry- en stale-lead drempels; `operational_worker_runs` registreert alleen veilige aantallen en generieke foutcodes.
- `wallet_transactions` is een immutable ledger; `professional_wallets.cached_balance` is alleen een transactioneel bijgewerkte cache.
- Nieuwe wallets starten op `0` credits; eventuele testcredits worden alleen via expliciete seed- of admintransacties toegevoegd.
- `leads` bewaart commerciële verkoopstatus via `commercial_type`, `price_credits`, `max_buyers`, `buyers_count`, `sales_status` en optionele `subservice_slug`.
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
- Professionals kunnen alleen hun eigen `professional_wallets`, `wallet_transactions` en `lead_purchases` lezen.
- Professionals kunnen alleen hun eigen distributiekandidaten lezen/updaten en nooit rankingdetails van andere professionals zien.
- Professionals kunnen alleen `leads`, `lead_images`, `lead_answers` en `lead_activity` direct lezen na `can_professional_view_lead_contact(...)`, dus pas na geldige purchase of geaccepteerde directe assignment.
- Professionals kunnen alleen eigen `lead_matches` lezen wanneer dat server-side nodig is; ze zien geen matches van andere vakmannen.
- Professionals kunnen assignments niet creëren; alleen admins of server-side service-role logica kunnen toewijzen.
- Prijsresolutie, walletdebits, refunds en lead purchases gebeuren via centrale server-side / SQL functies; client-submitted prijzen worden genegeerd.

Admin-mutaties verlopen server-side na een admin-sessiecheck. De admin-RPC's gebruiken de ingelogde admin-identiteit voor auditvelden; service-role EXECUTE blijft alleen open voor interne onderhoudspaden zoals sales-state refresh en backend reconciliatie.

## Lead lifecycle

1. Consument kiest een dienst in `/aanvraag`.
2. De funnel laadt actieve `service_questions` plus opties en rendert de juiste inputtypes.
3. Client-side validatie geeft directe feedback; `POST /api/leads` valideert alles opnieuw server-side met Zod.
4. Lead wordt opgeslagen in `leads`.
5. Dienstspecifieke antwoorden worden generiek opgeslagen in `lead_answers`.
6. Optionele afbeeldingen worden veilig opgeslagen in de private bucket `lead-images` en geregistreerd in `lead_images`.
7. `lib/leads/scoring` berekent `lead_score` en `score_reasons`.
8. `lib/matching` berekent potentiële matches en slaat die op in `lead_matches`.
9. Admin beoordeelt de lead en kan commerciële instellingen beheren of handmatig toewijzen via `lead_assignments`.
10. Professionals zien voor gematchte leads alleen beperkte marktmetadata.
11. `purchase_lead` voert de commerciële acceptatie atomair uit: eligibility-check, prijsresolutie, walletdebit, purchase-record, assignment unlock en sales-status update.
12. De distributie-engine start een run, rankt kandidaten met breakdown, activeert offer windows en doet fallback bij decline/expiry.

## Assignment lifecycle

1. `lead_matches` vormt de shortlist van potentiële professionals.
2. Een directe admin-assignment kan nog steeds een `lead_assignments` record maken zonder walletstap.
3. Een commerciële purchase maakt eerst een `lead_purchases` record en koppelt/maakt daarna een `lead_assignments` record.
4. Een purchase-linked assignment unlockt contact pas zolang de gekoppelde purchase `status = purchased` heeft.
5. Shared leads blijven verkoopbaar totdat `buyers_count = max_buyers`; exclusive leads blokkeren na de eerste geldige koper.
6. Refunds maken een positieve wallettransactie, markeren de purchase als refunded en verversen de sales-status zonder historische transacties te wijzigen.

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

Iedere match bevat `professional_id`, `match_score` en `reasons`. In de commerciële flow is `lead_matches` de toegangsvoorwaarde tot de leadmarkt, `lead_purchases` het financiële beslismoment en `lead_assignments` de operationele vervolgrelatie.

## Distributie-opzet (Prompt 10)

- Eligibility wordt centraal beoordeeld op status, verificatie, service-fit, postcode4-fit, capaciteit en commerciële beschikbaarheid.
- Ranking gebruikt een uitlegbare 0-100 score met vaste componenten: service, regio, verificatie, purchase/accept performance, win rate, response time, workload en fairness.
- Fairness gebruikt recente exposure (offers/purchases) als zachte boost/penalty; fitfactoren blijven dominant.
- Exclusive: één actieve offer tegelijk met expiry → fallback naar volgende kandidaat.
- Shared: batch-offers met configureerbare batchsize, slotcontrole (`max_buyers`) en sluiting bij sold-out.
- Expiry/decline/purchase events worden als `lead_activity` gelogd voor audittrail en admin-inzicht.
- Exhausted runs krijgen expliciet status `exhausted`; requeue gebeurt alleen via admin override.

## Notifications en operationele workers (Prompt 12)

- `professional_notification_events` is zowel event-outbox als inbox. Events gebruiken `pending → processing → delivered/failed` of `cancelled`; `delivered` betekent voor `in_app` dat de melding in de inbox staat. `read_at` is per ontvanger en wordt los van de lifecycle-status bijgewerkt.
- Unieke `deduplication_key` waarden maken eventcreatie en reminder-herhalingen idempotent. De database claimt due events met `FOR UPDATE SKIP LOCKED`; een mislukte delivery verhoogt `attempt_count`, plant exponentiële backoff en stopt bij `max_attempts`. Verlopen processing leases kunnen opnieuw worden geclaimd.
- Database-triggers enqueue-en `lead_offer_received`, `lead_offer_expired`, `lead_assignment_created` en `distribution_exhausted` transactioneel bij de lifecycleovergang. Dat voorkomt afhankelijkheid van UI-acties of een polling-window en houdt event en bronwijziging atomair. Herhaalde statusupdates produceren geen extra event.
- Document workers maken afzonderlijke 30- en 7-dagen reminders met document-ID deduplication keys. Op expiry claimt een worker het document, zet het op `expired` en ververst derived quality/eligibility. Een required document triggert herbeoordeling en actieve offers worden overgeslagen; een recommended document veroorzaakt geen distribution block. Workerclaims gebruiken databaseleases/row locks.
- Verification reminders waarschuwen het interne team op de ingestelde 24/48-uursdrempels, zonder commerciële SLA-belofte. Open `changes_requested` feedback geeft na de ingestelde termijn een professionalreminder en staat in de admin operations queue. Een statusovergang weg van `changes_requested` resolveert open feedback, zodat de queue vanzelf opruimt.
- `/vakman/notificaties` en `/admin/notificaties` zijn gepagineerd. Professional RLS beperkt lezen en `read_at`-updates tot eigen delivered in-app events; admin RLS geeft system-events en hun leesstatus uitsluitend aan admins. Preferences zijn per professional/categorie; externe delivery preferences kunnen niet worden ingeschakeld.
- Pre-purchase offermeldingen bevatten alleen generieke tekst en een interne route, nooit telefoon, e-mail of exact adres. Assignmentmeldingen ontstaan pas bij een `lead_assignments` insert en bevatten geen contactvelden. Geen externe notification provider wordt aangeroepen.
- Worker endpoints `/api/internal/notifications/process`, `/api/internal/reminders/process`, `/api/internal/documents/expiry` en `/api/internal/operations/check` zijn POST-only, gebruiken `x-worker-secret` via `INTERNAL_WORKER_SECRET` of de bestaande distribution secret, en weigeren zonder secret generiek. De bestaande distribution worker verwerkt offer expiry/fallback.
- `operational_worker_runs` registreert start/eindtijd, status en aantallen met begrensde foutcodes, niet met PII. `/admin/operatie` toont actuele verification/feedback queues, documentexpiry, unmatched/stale leads, exhausted runs, failed delivery/workers en recente runs. Instelbare thresholds staan in `operational_settings`.
- Notification- en workerdata zijn retentie-klaar maar worden niet automatisch verwijderd. E-mail, SMS en WhatsApp zijn alleen schema-uitbreidingspunten en blijven uitgeschakeld; er is geen externe queue of cron-provider nodig.

## Wallet- en pricing-opzet

- `apply_wallet_transaction(...)` lockt eerst de walletrow (`FOR UPDATE`), leest het saldo, valideert credits, schrijft een immutable transactie en werkt pas daarna `cached_balance` bij.
- Positieve bedragen verhogen credits; negatieve bedragen verlagen credits; `amount = 0` is verboden.
- Het transactietype dwingt het teken af: `lead_purchase` en `admin_debit` zijn negatief, `refund`/`admin_credit`/`promotional_credit`/`credit_purchase` positief en alleen `correction` mag beide kanten op.
- `lead_pricing_rules` ondersteunt prioriteitsvolgorde, dienst-/subdienstfilters, scorebanden en aparte multipliers voor shared/exclusive leads.
- `resolve_lead_price(...)` bepaalt de authoritative prijs server-side en gebruikt alleen een lead-level override of een centrale fallback wanneer geen actieve regel matcht.
- `commercial_audit_log` registreert walletcredits/debits, lead purchases, refunds, pricing changes en commerciële leadwijzigingen.
- `purchase_lead(...)` bindt idempotency keys aan één professional én één lead; hergebruik op een andere lead geeft `IDEMPOTENCY_KEY_CONFLICT`.
- Een refunded purchase kan niet opnieuw worden gekocht; compensatie verloopt uitsluitend via de refundtransactie en niet via mutatie van historische debits.
- `get_wallet_reconciliation(...)` en admin-overzichten controleren afwijkingen tussen `cached_balance` en de som van het immutable ledger zonder automatische correctie.

## Storage-aanpak

Leadafbeeldingen worden opgeslagen in een private Supabase Storage bucket (`lead-images`). Bestandsnamen worden veilig server-side gegenereerd op basis van UUID's. Publieke bezoekers krijgen geen directe opslagtoegang. Dashboards gebruiken server-side gegenereerde signed URLs.

## Toekomstige uitbreidingen

De huidige structuur is voorbereid op:

- rijkere scoring- en matchinglogica
- uitgebreide professionalprofielen
- externe betalingen, checkout en leadverkoop
- notificaties en workflow-automatisering
- SEO-uitbreidingen zoals dienst- en locatiepagina's
- admin tooling voor kwalificatie, rapportage en lifecycle-automatisering


## Attribution model (fase 3)

- Last-touch attribution wordt opgeslagen op `leads` met `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `landing_page`, `referrer`, `gclid` en `fbclid`.
- First-touch basis wordt opgeslagen via `first_touch_source` en `first_touch_timestamp`.
- `source` blijft bestaan voor backwards compatibility met bestaande businesslogica.
- Attribution wordt client-side verzameld en server-side gevalideerd/opgeslagen bij lead submission.

## Analytics events en privacy

- `lib/analytics/events.ts` bevat de centrale eventnamen, page types, funnel steps, CTA-locaties en validatiefouttypes. `lib/analytics/page-types.ts` classificeert publieke routes; dynamische lokale/subdienstpagina's geven hun bestaande routecontext expliciet door.
- Bestaande events blijven behouden. Toegevoegd zijn publieke/service/lokale page views, zichtbare CTA-impressies, expliciete CTA-klikken, experimentexposures, FAQ/jump-link gebruik en per aanvraagstap viewed/completed/validation-error/back events. De aanvraag start bij het tonen van de eerste stap van `/aanvraag`, niet alleen bij een CTA-klik.
- Client-events gaan via `trackFunnelEvent()` en `POST /api/analytics/events` naar de bestaande `analytics_events`-tabel. Het endpoint accepteert uitsluitend client-eventnamen, UUID-sessie-id's, een begrensde body en de centrale property-allowlist uit `lib/analytics/privacy.ts`. Onbekende, te lange, geneste, e-mailachtige, telefoonachtige en query-bevattende routewaarden worden gedropt. Geen global click capture, session replay, fingerprinting of ruwe formulierinhoud.
- `experiment_exposed` is geen client-trackable event: `POST /api/experiments/exposure` verifieert actieve configuratie en de server opgeslagen sessie/variant-assignment voordat het event wordt opgeslagen. `/api/experiments/assignment` retourneert alleen de veilige variant voor één passend slot.
- Toegestane dimensies zijn onder meer route/page type, service/subservice/plaats/provincie-slugs, device/viewport bucket, referral channel, UTM source/medium/campaign, first-touch source, funnel step, CTA key/location, error type en grove duration bucket. Naam, e-mail, telefoon, adres/postcode, beschrijving, vraagantwoord, bericht, document- en afbeeldingsinhoud horen niet in analytics.
- De bestaande first-party UUID in localStorage blijft het anonieme sessiemodel. First-touch source wordt niet overschreven; UTM/gclid/fbclid/referrer vormen current/last touch met voorrang UTM source → gclid → fbclid → externe referrer → direct. Interne navigatie wist de touch niet. Alleen het landing-path (zonder querystring) en de referrer-host worden bewaard voor analytics/lead attribution.
- `lead_submitted` wordt uitsluitend server-side na succesvolle opslag verstuurd, gebruikt een idempotency key per lead en mag client-side niet worden aangevraagd. `leads` is de bron van waarheid voor opgeslagen aanvragen; analytics-events verklaren gedrag ervoor. Analyticsfouten blokkeren de leadopslag niet.
- Er bestaat geen consentmanager of GA4-config/provider in deze codebase. De no-op provider uit `lib/analytics/providers.ts` blijft behouden; er is geen externe marketingprovider toegevoegd en deze wijziging introduceert geen consentlaag.

### Analytics-dashboard en definities

- `/admin/analytics` gebruikt de bestaande adminlayout en `requireAdminUser`; de serverquery leest hoogstens 5.000 events en 5.000 leaddetails per rollend venster. De vensters zijn 7 en 28 dagen in UTC; leadtotalen komen uit database-counts.
- KPI's: page views, CTA-klikken, unieke aanvraagstarts, opgeslagen leads uit `leads`, waargenomen sessies met serverbevestigde inzending en contactinzendingen uit `contact_submissions`. Het event/leadverschil wordt als datakwaliteit getoond; adblockers kunnen events missen.
- Dienst- en lokale tabellen tonen views, CTA's, starts en beschikbare inzendingen. De funnel telt unieke anonieme sessies per stap; drop-off is `max(0, viewed - completed) / viewed` binnen dezelfde stap. Validatiefouten zijn eventaantallen; duration wordt alleen in grove buckets opgeslagen. Device en kanaal zijn alleen zichtbaar bij beschikbare sessiedata.
- CTA-reporting telt zichtbare impressies en clicks, toont CTR (`clicks / impressions`) en koppelt downstream starts/serverbevestigde inzendingen aan de laatste gemeten CTA vóór de funnelstart. UTM-tabellen tonen source/medium/campaign voor starts en serverbevestigde sessies; click-ID's zijn niet zichtbaar als dimensie.
- Er is geen betrouwbaar tab-close-event. Step drop-off, validatiefouten en terugnavigatie blijven onderscheiden; abandonment wordt alleen afgeleid uit starts zonder opgeslagen/gekoppelde lead plus configureerbare inactiviteit (30 minuten of 2 uur). De intake heeft geen state persistence, dus er is geen resume/fresh-start-classificatie.
- De bestaande anonymous UUID blijft persistent in localStorage en heeft geen time-based expiry. Daarom zijn dashboardstarts/conversies unieke anonieme ID’s binnen het venster, geen onafhankelijke browserbezoeken of strikt tijdgebonden funnelcohorten; dit wordt expliciet gelabeld.
- Dienst-rates met minder dan 20 starts worden als lage steekproef getoond, niet als percentage. Regels voor lage step completion, validatiefouten en lokale views zonder CTA zijn beschrijvend, niet automatisch advies; er worden geen kleine-sampleconclusies, upliftclaims of automatische contentwijzigingen gemaakt.
- Empty state bevat geen demodata. Detaildata wordt begrensd; bij het bereiken van de querylimiet wordt dat gemeld. De primaire conversie is een succesvol opgeslagen lead, niet een CTA, leadscore of klik.
- GA4 is niet geconfigureerd. Als dit later wordt ingericht, aanbevolen custom dimensions zijn `page_type`, `service_slug`, `subservice_slug`, `city_slug`, `cta_location` en `step_key`; map dan alleen vanuit de interne eventtaxonomie en configureer GA4 buiten deze code.
- `/admin/experimenten` beheert handmatig de status van experimenten en toont variantcounts, CTR, starts, serverbevestigde leads, device-exposures en sample warnings. Configuratie blijft draft totdat een admin activeert; er is geen winnerselectie, automatische rollout of AI-optimalisatie. Targeting blijft beperkt tot CTA-copy/progressie; SEO-content en lead-businesslogica blijven gelijk.
- Experimenttoewijzing gebruikt de bestaande localStorage-anonieme UUID, deterministische gewichtsverdeling en server-side assignmentopslag. Er wordt geen cookie, fingerprint of tweede analyticsysteem toegevoegd. Door de bestaande localStorage-identiteit ziet SSR control; na hydration kan actieve variantcopy wisselen. Zie `docs/EXPERIMENTS.md` voor activatie, privacy, meetdefinities en de no-flicker productkeuze.

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

- Admin dashboard toont volume, lifecycle-statussen, leadkwaliteit en ratio's op basis van echte databasewaarden: viewRate (viewed/offers), purchaseRate (purchases/offers), declineRate, expiryRate en winRate.
- Professional dashboard toont uitsluitend eigen KPI's uit eigen assignments en progressiestatussen.
- Attribution KPI toont leads per source/medium op basis van opgeslagen leadattributie.


## Publieke route-architectuur (contentfase)

### Publieke designbaseline (Prompt 21)

- `app/globals.css` blijft de bron voor merkkleur, neutrale kleuren, radii en shadows; bestaande UI-primitives blijven gedeeld met de rest van de applicatie. Componentstyles staan in de Tailwind-componentlaag zodat sizing-utilities (bijvoorbeeld `min-h-32` voor textareas) kunnen overrulen.
- De publieke layout gebruikt een skiplink naar `main-content`. De mobiele navigatie is een niet-modale disclosure: Tab volgt de normale documentvolgorde, Escape sluit met focusterugkeer, en focus buiten het menu of een klik buiten het menu sluit het.
- `FormField` koppelt helptekst en fouten aan de control met hetzelfde `id`. Keuzegroepen gebruiken `group` voor native `fieldset`/`legend`. De intake focust de nieuwe staptitel en alleen na een mislukte validatie de eerste ongeldige control; typen mag geen focus verplaatsen.
- De homepage heeft één dominante hero-aanvraagactie; de optionele dienst/postcode-prefill staat bij de vakgebieden, niet naast die hero-actie. De gedeelde service/subdienst/lokale template behoudt alle content, headings, routes en schema-output; de hero-CTA staat vóór de volledige introductie zodat lange content de aanvraag niet verstopt.
- Geraakte Prompt 20-slots: `homepage.hero.cta` (`home_hero_request`, presentatie), `lead.progress.copy` (aanvraagprogresspresentatie) en `service.mid_cta` (`request_mid_content`, styling op de dakdekker-hoofdpagina). De homepage behoudt de controltekst “Plaats je klus” en variant B “Start je aanvraag” zodat het bestaande copy-experiment onderscheidend blijft. Ook servicehero (`request_hero`, positie) en eind-CTA (`request_final_cta`, styling) zijn visueel aangepast. Bestaande CTA-, FAQ-, jumplink- en zeven funnelstapidentifiers blijven gelijk; `home_final_request` is een extra trackingpunt voor de bestaande homepage-eindactie.
- Prompt 20 is via de merge met main opgenomen: experimenttabellen, server-side assignment/exposure, analytics en handmatig adminbeheer blijven intact. De designbaseline wijzigt geen assignmentlogica, variantgewichten, targets of seedstatussen en activeert geen experiment; de drie bestaande experimenten worden nog steeds als `draft` ingevoegd.
- Er zijn geen nieuwe dependencies, fonts, afbeeldingen of animatielibraries nodig; publieke content blijft server-rendered. Auth, RLS, privacygedrag, matching/scoring, submittransport en databasearchitectuur blijven ongewijzigd.

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

1. locatie `published = true` en `indexable = true`
2. pagina `published = true`
3. pagina `indexable = true`
4. `content_status = published`
5. de quality gate slaagt op route/service/stad, minimaal 250 inhoudelijke woorden, metadata, H1, CTA, lokale broncontext, interne links en placeholders
6. duplicate risk is niet `high`

`draft` en `review` mogen niet indexeerbaar zijn. Bij onvoldoende content of ongeldige publish-state blokkeert server-side validatie publicatie.

Dezelfde contentgate geldt vóór `approved`; nieuwe records starten als draft en live copy moet na inhoudelijke wijzigingen opnieuw door review en approval. Een duplicate-check vergelijkt alleen dezelfde service en zoekintentie, neutraliseert alle bekende plaatsnamen en gebruikt Jaccard-overlap van inhoudelijke tokens: vanaf 72% is het risico hoog en publicatie geblokkeerd; 58–71% geeft een redactionele waarschuwing en vereist menselijke beoordeling; lager dan 58% geldt als laag risico. Deze drempels zijn review-signalen, geen automatische goedkeuring.

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

### Redactionele lokale verdieping (Prompt 17)

- `lib/content/local-content-depth.ts` selecteert een begrensde batch van 24 bestaande combinaties: 12 service-stad en 12 subdienst-stad, verdeeld over dakdekker, loodgieter, elektricien, badkamer en kozijnen. De teksten staan in twee server-side contentmodules; routes, locaties en publicatiestatussen veranderen niet.
- De repositoryfallback gebruikt deze individuele teksten en metadata. Vier geselecteerde subdienstpagina’s blijven draft: groepenkast/Utrecht, storing/Rotterdam, renovatie/Amsterdam en kunststof-kozijnen/Rotterdam. Ze krijgen geen publieke indexeerbare pagina of sitemapvermelding.
- Supabase blijft DB-first: bestaande CMS-teksten worden nooit stilzwijgend vervangen door een runtime-overlay of migratie. DB-fallbacks behouden ook de oorspronkelijke metadata/H1; alleen als de opgeslagen intro, secties en FAQ exact het voorstel bevatten, worden de bijbehorende redactionele metadata/H1 gebruikt. De vergelijking is onafhankelijk van JSONB-keyvolgorde. In de bestaande admineditor kan een beheerder **Laad redactioneel voorstel** kiezen en het voorstel in de bestaande preview bekijken. Dit vult alleen het formulier; opslaan, opnieuw beoordelen en publiceren gebruiken de bestaande acties en quality gate. De indicatoren tonen tot opslaan de opgeslagen content. Gepubliceerde content moet eerst terug naar review, met published/indexable uit.
- Duplicate-checks blijven plaatsnamen neutraliseren, met 58% als reviewdrempel en 72% als high risk. Het resultaat bevat ook de maximale Jaccard-overlap (`similarity`, 0–1); introduplicatie kan onafhankelijk daarvan high risk opleveren.
- Nabijgelegen links worden uitsluitend uit de bestaande `nearbyCities` en publiceerbare combinaties gehaald. Waar minder dan twee zulke routes bestaan, worden geen drafts of willekeurige nationale bestemmingen toegevoegd om een linkquotum te halen.
- Lokale metadata gebruikt een absolute titel om een dubbele `| VakConnect` door de roottemplate te voorkomen. Canonical, FAQ, jump links, CTA’s, intake en analytics blijven op de bestaande implementaties.
- Onbekende steden, diensten en combinaties blijven via de bestaande DB-aware resolver naar `notFound()` gaan. Er is bewust geen statische proxy-allowlist toegevoegd: die zou geldige CMS-routes kunnen blokkeren. Bij een reeds gestreamde response kan Next.js een 200 met not-found UI en noindex geven; vóór streaming kan het een harde 404 geven.
- De contenttests controleren de batchgrenzen, tekstlengte, lokale broncontext, metadata, interne links, duplicate risk, kwaliteits- en publicatievoorwaarden en behoud van de PR #21-componenten. Live tellingen moeten apart read-only worden gecontroleerd; repositorytellingen zijn geen bewijs van de actuele DB-inhoud.

## Lokale SEO gecontroleerd opschalen (Prompt 8)

### Stedenbestand, tiers en contentprofielen

- `seo_locations` en `lib/content/locations.ts` bevatten nu 61 steden.
- Iedere stad heeft:
  - `tier` (`A|B|C`) voor interne prioritering
  - `content_profile` voor veilige lokale variatie (geen hard claims of statistiekgedreven feiten)
- Publieke output toont géén tierlabels.

### Lokale service-ondersteuning

- Alle 8 hoofdclusters ondersteunen lokale routes:
  - `dakdekker`, `loodgieter`, `schilder`, `elektricien`
  - `kozijnen`, `badkamer`, `isolatie`, `verbouwing`
- Bestaande routevorm blijft ongewijzigd:
  - `/{vakgebied}/{stad}`
  - `/{vakgebied}/{subdienst}`
  - `/{vakgebied}/{subdienst}/{stad}`

### Gecontroleerde drafts i.p.v. cartesian product

- Er wordt geen volledige `stad × vakgebied × subdienst` matrix gepubliceerd.
- Prompt 8 dataset:
  - 75 bestaande live-lokale routes blijven behouden
  - 40 nieuwe live lokale hoofdpagina’s (nieuw voor extra clusters)
  - 104 lokale hoofdpagina-drafts
  - 63 lokale subdienst-drafts
- Bulk create in admin zet records altijd op `draft` + `published=false` + `indexable=false`.

### Coverage, quality, duplicate en publish gates

- `seo_local_pages` bevat extra velden:
  - `coverage_status` (`none|limited|sufficient`)
  - `quality_score`
  - `duplicate_risk`
- Coverage wordt intern afgeleid uit bestaande service-, lead- en professional-service-area data.
- Publicatieblokkades omvatten nu:
  - locatie/page status
  - indexable/content_status
  - canonical validatie
  - minimale contentdiepte
  - quality-threshold
  - duplicate risk high
  - coverage `none`

### Admin schaalbaarheid

- `/admin/seo/lokaal` gebruikt paginering + server-side filter/sort parameters (`page`, `pageSize`, service, status, province, coverage, duplicate, quality threshold).
- Bulk reviewstatusacties zijn veilig beperkt tot:
  - `draft → review`
  - `review → approved`
- Geen bulk publish zonder extra handmatige gate.

### Provinciehubs en interne linking

- Publieke regio-architectuur:
  - `/regios` (overzicht)
  - `/regios/{provincie}` (hub per provincie)
- Een provinciehub wordt alleen gerenderd bij voldoende gepubliceerde lokale pagina’s (minimale drempel in querylaag).
- Hubs linken door naar relevante stad/servicecombinaties en ondersteunen schaalbare interne linking zonder linkspam.

### Audit en sitemap scaling policy

- `seo_audit_log` registreert status- en publishmutaties met actor/tijd.
- `app/sitemap.ts` blijft filteren op live/indexeerbare records + geldige provinciehubs.
- Zolang routeaantallen ruim onder limieten blijven, volstaat één sitemap; bij grotere groei kan worden opgeschaald naar sitemap-index met gesplitste bestanden.

## Prompt 11: onboarding, kwaliteit, documenten en verificatie

- `professionals` blijft het enige profielmodel en is uitgebreid met onboardingstatus, huidige wizardstap, completion, submissionmomenten, quality-score en critical-change timestamps.
- `professional_services` en `professional_service_areas` blijven de canonieke koppelingen voor diensten en regio, nu met extra ervarings-, specialisatie- en leadtypevoorkeurvelden zonder parallel model.
- `professional_distribution_settings` bevat nu ook availability (`available`, `limited`, `unavailable`), pause/pause_until en capaciteitsgrenzen die direct door de distributie-engine worden hergebruikt.
- `lib/professionals/onboarding.ts` centraliseert wizardstappen, deterministische kwaliteitsscore, submit gates en distribution gates zodat businesslogica niet over UI, SQL en distributiecode wordt gedupliceerd.
- `professional_documents` bewaart alleen metadata; binaire bestanden staan in private Supabase Storage onder `professionals/{professionalId}/documents/{documentId}/...` en worden alleen via korte signed URLs voor admin review ontsloten.
- `professional_review_feedback` modelleert feedback per sectie voor changes-requested flows; kritieke profielwijzigingen kunnen verificatie terugzetten naar `pending` of `changes_requested`.
- `professional_audit_log` registreert onboarding started/completed/submitted, documentevents, verificatiebesluiten en critical profile changes; `professional_notification_events` bewaart interne event-hooks zonder mailprovider.
- `/vakman`, `/vakman/profiel` en `/vakman/onboarding` tonen onboardingstatus, quality score, availability, documenten en feedback voor self-service binnen RLS-grenzen.
- `/admin/verificatie` en `/admin/vakmannen/[id]` vormen samen de adminreviewlaag voor filters, checklist, documenten, audit en verificatieacties.
- Distributie (Prompt 10) leest de Prompt 11-gates via gedeelde scoring/eligibility helpers: incomplete onboarding, rejected/suspended, paused/unavailable en lage quality blokkeren eligibility, terwijl verified professionals hun bonus behouden.

## Prompt 27: marketplacekwaliteit en aankoopbeslissing

### Baseline en audit vóór implementatie

Actuele `origin/main` is opgehaald en gelijk aan de start-HEAD: `23f99be3f1e5b644336768af670f4210f04cf32c` (PR #30 / Prompt 26).
De geschiedenis bevat PRs #24–#30: experimentinfra, UX-baseline, consumerfunnel, trust claims, professional UX, activation/retention en dependency hardening (Prompts 20–26).
De runtimebranch is `copilot/lead-marketplace-quality-conversion`.

| Onderdeel | Grootste frictie op de baseline |
| --- | --- |
| `/vakman/aanvragen` | Vrije omschrijving werd alleen ingekort, niet gemaskeerd. Dat kan naam, telefoon, e-mail of adres lekken. Matchcontext, planning en foto-indicator ontbraken. Slotcijfers en dubbele badges maakten kaarten druk. |
| `/vakman/aanvragen/[id]` | Zelfde vrije-tekstlek; plaatsnaam is eveneens consumenteninvoer. Veilige intakekeuzes waren niet zichtbaar. Een verlopen offer kon tegelijk een badge “Beschikbaar” hebben. |
| Purchase en wallet | Prijs stond al vóór aankoop, maar de CTA noemde deze niet. Tekort werd bij “saldo na aankoop” als nul gepresenteerd. Een gekochte aanvraag toonde opnieuw een hypothetische aankoopprijs/saldo in plaats van de werkelijk betaalde prijs. |
| Contact en opvolging | Contact stond in één tekstregel zonder bel-/maillinks. De statuskeuze bood ook ongeldige vervolgstappen aan. Een expliciete primaire vervolgstap ontbrak. |
| Notificaties/dashboard | De inbox had een detailfallback, maar de bestaande payloadlink naar het overzicht kreeg voorrang. Dashboardmeldingen verwezen eveneens naar het overzicht. |
| Analytics | Prompt 19 meet de publieke consumerfunnel, niet marketplace-impressies, detailviews, purchase intent of purchase failure reasons. Purchase-audit, distribution candidates en lead activity bieden wel operationele brondata. |

Technische leadscore stond al niet in de professionalpagina's en blijft verborgen. Prompt 24-cards en Prompt 25-gereed/geblokkeerd-empty states blijven behouden.
Geen nieuwe filters of sorteerstrategie: er is geen bewezen aanbodvolume dat extra marketplace-search rechtvaardigt.

### Veilige informatie vóór aankoop

- Dienst, gevalideerd viercijferig postcodegebied, aanvraagdatum, echte offerstatus/eindtijd, shared/exclusive en actuele creditprijs.
- Planning wordt uitsluitend uit bestaande enumwaarden vertaald; onbekende/ontbrekende waarden worden niet ge-echoot.
- Alleen de aanwezigheid van een omschrijving en het aantal foto's worden getoond, niet de inhoud of bestandsmetadata.
- Detail toont bestaande select/radio/multiselect-antwoorden alleen als **alle** waarden bij geconfigureerde opties passen. Labels en vragen komen uit beheerde intakeconfiguratie; er is geen fallback naar ingestuurde tekst.
- Consumentennamen, telefoons, e-mails, volledig adres/postcode, vrije omschrijving, vrije intake-antwoorden en ongestructureerde plaatsnaam blijven verborgen.
- Er is bewust geen regex/NLP-redaction-engine. Inkorten is geen privacymaatregel; de veilige grens is niet tonen. Dit vermindert de beschikbare kluscontext vóór aankoop en wordt expliciet uitgelegd.
- Foto's blijven privé: alleen een indicator vóór unlock, bestaande signed-imageflow erna. Geen originele filenames of storage paths in de preview.

De indicatoren zeggen alleen wat is ingevuld, niet dat de inhoud duidelijk/correct is of dat de opdrachtkans hoger is.
Matchuitleg vertaalt uitsluitend geslaagde, opgeslagen `lead_matches.reasons`-codes voor actieve dienst, postcodegebied en actief profiel. Onbekende codes, vrije labels en scoregewichten worden niet getoond.
Deze uitleg benoemt een historische selectie, niet actuele eligibility of een “perfecte match”; ontbreken van redenen wordt eerlijk getoond.

### Prijs, beschikbaarheid en opvolging

- Cards en detail gebruiken dezelfde bestaande `resolveLeadPrice`; `purchase_lead` blijft authoritative voor actuele prijs, saldo, eligibility en transactie.
- Detail toont huidig saldo en, uitsluitend vóór aankoop met voldoende saldo, resterend saldo. Bij tekort staat het exacte tekort met de bestaande creditslink; er is geen actieve betaalprovider.
- CTA: “Ontgrendel voor … credits”, met uitleg over de vrijgegeven informatie en het ontbreken van opdrachtgarantie. Geen vooraf aangevinkte bevestiging of automatische aankoop.
- Bestaande `SubmitButton` houdt pending/disabled en loadingtekst; bestaande UUID-idempotency en databaseatomiciteit blijven behouden.
- De server accepteert geen clientprijs. Na aankoop toont de pagina de werkelijk opgeslagen `lead_purchases.price_credits`, ook als de prijs tijdens het bekijken veranderde.
- Aankoopfouten blijven menselijke meldingen voor saldo, beschikbaarheid, verlopen aanbod, eligibility en techniek; geen DB-codes. Detail/overzicht/credits worden ook op de fouttak gerevalideerd.
- Mutabele professionalroutes blijven dynamisch via bestaande cookie-auth; geen gedeelde/user-overstijgende cache toegevoegd. Een offer dat tijdens bekijken verloopt wordt bij aankoop opnieuw door de server gecontroleerd.
- Gedeeld betekent meerdere mogelijke kopers. Exclusief betekent maximaal één **koperslot binnen VakConnect**, niet de enige vakman/contactroute wereldwijd en niet een opdrachtgarantie.
- Deadline komt uit `offer_expires_at`. Geen countdown, fake urgency, interesseclaims of “nog één plek”.
- Na unlock: werkelijk afgeschreven credits, huidig saldo, primaire link naar contactgegevens, leesbare naam/adres, expliciete `tel:`/`mailto:`-links en korte eerste-contactuitleg. Geen automatische outreach.
- Voortgang gebruikt uitsluitend bestaande toegestane transities: nieuw → contact → afspraak → offerte → gewonnen/niet gewonnen. De keuzelijst biedt alleen de huidige en toegestane volgende status.
- Bestaande verliesredenen (o.a. buiten scope en niet bereikbaar) zijn vindbaar, maar dit is geen afzonderlijk mismatch-/refundverzoek. Er worden geen nieuwe CRM-statussen, refundregels of inference uit inactivity toegevoegd.
- Notificaties met een lead-ID verwijzen nu vanuit inbox én dashboard naar die detailroute; historische verlopen aanbiedingen blijven een gesloten detailpagina in plaats van een onterechte 404.

### Noodzakelijke, bewezen autorisatiereparatie

Een uitsluitend frontendaanpassing bleek onvoldoende. PostgreSQL-regressietests faalden vóór de nieuwe migratie:

1. Een professional kon op de eigen assignment de aankoopkoppeling wissen; de accepted/null-link-tak gold dan als directe toegang. De bestaande refundprocedure wist dezelfde koppeling en kon contacttoegang laten bestaan.
2. `enforce_active_offer_for_purchase` liet aankopen door wanneer geen actieve/pending ronde bestond, ook als historische aanbiedingen waren verlopen en de ronde was uitgeput.

Daarom bevat Prompt 27 **één gerichte migratie**: `20261005150000_prompt27_marketplace_access_hardening.sql`.
Zij houdt assignment-ID, lead-ID, eigenaar en purchase-link immutable voor professionals; directe contacttoegang vereist geen historische aankoop; een lead met distributiehistorie vereist nog steeds een actieve, niet-verlopen aanbieding.
De JS-accesshelper volgt dezelfde aankoopstatusregel en terugbetaalde aanvragen krijgen geen nieuwe acceptatieknop.
Legacy niet-gedistribueerde aankopen en geaccepteerde directe assignments zonder aankoopgeschiedenis blijven werken.

Geen wijzigingen aan ledger/refundprocedure, pricing, matching, scoring, ranking, distributiestrategie, capaciteit, verification, notificatieschedulers of RLS-policydefinities.
Bestaande RLS-contactpolicies gebruiken de gerepareerde helper. Nieuwe signed-imageaanvragen verliezen toegang na refund; eerder verstrekte kortlopende URLs/downloads kunnen niet achteraf worden teruggehaald.

### Analytics, mismatchfeedback en toekomstige experimenten

Geen nieuwe clientevents, identifiers, PII of wijzigingen aan Prompt 19-taxonomie. De securitymigratie wordt niet uitgebreid met onnodige analytics-schemawijzigingen.
De bestaande consumerfunnel/experimentinfra blijft ongewijzigd; alle experimenten blijven draft/inactive.

| Mogelijke metric | Bron/beperking |
| --- | --- |
| Offer view rate | `viewed_at` versus aangeboden candidates; handmatig “bekeken” is geen betrouwbare schermimpressie. |
| Detail view rate | Blind spot: geen marketplace-detailviewevent; niet claimen als gemeten. |
| Purchase conversion | Aankopen versus aangeboden candidates met dezelfde cohort/periode; geen publieke benchmark. |
| Insufficient balance rate | Blind spot: geen afzonderlijk failure-event met toegestane redenenum. |
| Expired-before-purchase rate | Candidate-status/eindtijd versus purchase timestamps; onderscheid echte expiry en andere sluitredenen. |
| Purchase failure reasons | Blind spot: UI-errors zijn geen duurzame analyticsdataset. |
| Post-purchase status completion | Eigen assignmentprogress en `lead_activity`; uitsluitend expliciete updates. |
| Mismatch report rate | Geen aparte mismatchflow. Bestaande decline/loss reason-data zijn slechts proxies, geen volledige report-rate. |

Latere mismatchanalyse kan bestaande gestructureerde redenen per dienst/regio/cohort voor menselijke review gebruiken, zonder vrije tekst, contactdata of documentinfo te exporteren.
Geen automatische refunds, scorewijzigingen, rankinghertraining of “self-learning”.
Draft-testkandidaten: informatiedichtheid van cards, CTA-copy, positie van fituitleg, volledigheidsindicatoren en aankoopgeruststelling; geen test geactiveerd.

### Validatie en beperkingen

- `npm ci`, `npm run lint`, `npm run typecheck`, `npm run test` en `npm run build`: geslaagd; **221 tests, 0 failures, 0 skips**, inclusief echte lokale PostgreSQL-tests.
- Nieuwe tests: veilige previewpayload/keuze-antwoorden, historisch onderbouwde matchcopy, prijs/availability/pending, IDOR voor leads/purchases/wallet/assignments, huidige serverprijs, ineligible professional zonder debit, actieve/verlopen/geweigerde/uitgeputte offers, refund/contact/answers/image-revocation, statusupdate en legacy/directe toegang.
- Bestaande tests blijven groen: shared/exclusive concurrentie, exact één purchase/debit, rollback, immutable ledger/reconciliatie, distribution workers, private documenten, onboarding, notifications, analyticsprivacy en Prompts 20–25. Prompt 26 is gecontroleerd via onveranderde lockfile/frameworkversie en dependency-audit.
- `npm audit`: 0 critical, 5 high package entries uit dezelfde dev-only `braces`-keten als Prompt 26; `npm audit --omit=dev`: 0 vulnerabilities. Next.js blijft 16.3.6; dependencies/lockfile niet gewijzigd.
- HTTP-smoke voor dashboard, overzicht/detail, credits en notificaties: 200 op de bestaande configuratiefallback, **geen geauthenticeerde marketplace-QA**. Lokale Supabase-credentials ontbreken.
- Playwright MCP kon niet verbinden (`Transport closed`). Browser-QA op 320/375/430/768/1024/1280, keyboardinteractie, echte low-balance/purchase/contactstates en console/hydration kunnen daarom niet als geslaagd worden geclaimd.
- Statisch: responsive cards, `minmax(0, …)`-detailkolommen, wrapping/break-all voor contact, tekstuele status/expiry/prijs, gekoppelde labels, bestaande globale focusring en minimaal 44px contact-/CTA-targets. Geen horizontale tabel teruggebracht of zware clientlibrary toegevoegd.
- Contrastcontrole van 11 gebruikte tekstkleurparen: alle ≥ 4,5:1; primaire CTA 5,23:1, muted tekst op muted surface 6,92:1. Dit is een tokenberekening, geen volledige browser-accessibilityaudit.
- Securityspecialist bevestigt geen nieuwe kwetsbaarheden in de gerichte reparaties. Secret scan: geen secrets in alle gewijzigde bestanden.
- Geautomatiseerde Code Review: tooling failure door niet-beschikbaar model (`claude-sonnet-4.6`), ondanks de “Success”-wrapper; geen geldige reviewpass. CodeQL JavaScript: **analysis failed**, 0 gerapporteerde alerts is geen securitypass. Deze beperkingen blijven expliciet open voor CI/staging.
- Een afzonderlijke read-only review vond inconsistente grouping/badges na refund; dit is hersteld en met een grouping-regressietest gedekt. De vervolg-review vond geen significante issues. Een vermeende TypeScript-fout bleek een false positive: de werkelijke typecheck én build slagen.

Aanbeveling voor Prompt 28: eerst geauthenticeerde staging-QA en migratie-uitrol verifiëren, daarna een minimale PII-vrije marketplace-eventtaxonomie en afzonderlijke mismatchrapportage ontwerpen op basis van werkelijk cohortvolume.
