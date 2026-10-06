# Marketplace Economics & Pricing Intelligence — Prompt 30

## Audit vóór implementatie

Base: actuele `main` op `2eb10d3c769acbee584c882d983a2783c5b6cac5`,
merge van PR #35. De taskbranch bevat exact die basis. Prompt 20–29D is
aanwezig: experimenten, publieke/intake/professional UX, dependency- en
marketplacehardening, quality outcomes, admin review, admin-bootstrap,
Data API grants en de 29D metadata-validator. De baseline draait **328 tests
zonder failures of skips**, inclusief de volledige PostgreSQL-migrationketen.
De oude validatorblocker uit de PR-beschrijving is dus niet de actuele baseline.
Dat is lokale regressievalidatie, niet zelfstandig bewijs van hosted deployment.

| Auditonderwerp | Bron en betrouwbaarheid |
| --- | --- |
| Prijs / credits | `lead_purchases.price_credits` is de immutable betaalde prijs. Huidige `leads.price_credits` en `lead_pricing_rules` bepalen nieuwe prijzen, niet historie. |
| Aankopen / type | `lead_purchases`: unieke lead/professional-paar, immutable `purchased_at`, `commercial_type`, debitkoppeling. Shared heeft meerdere afzonderlijke aankopen. |
| Wallet | `wallet_transactions` is append-only; `professional_wallets.cached_balance` is de gecontroleerde cache, geen omzet. |
| Refund | Bestaande admin-RPC boekt de volledige purchaseprijs terug en koppelt `refund_transaction_id`. Status en werkelijk ledgerbedrag moeten overeenkomen. |
| Correcties | `correction` kan positief of negatief zijn; niet iedere walletcorrectie betreft een aankoop. Alleen lead/professional-koppeling met tijd op/na aankoop wordt toegerekend. |
| Outcomes | `lead_assignments`: professional-specifiek `won`/`lost`, reachability, afspraakstatus en eerste mijlpaaltijden. Zelfrapportage; oudere opdrachten kunnen bewijs missen. |
| Match / distributie | `lead_matches` is selectie, geen aankoop of outcome. `lead_distribution_candidates` heeft echte offer-, purchase- en expiry-timestamps; run bevat type-snapshot. |
| Dienst / subdienst | `leads.service_id → services`; `leads.subservice_slug` is optioneel, geen gecontroleerde taxonomy en niet onafhankelijk historisch gesnapshot. Dienst gebruikt huidig cataloguslabel; geen subdienst-economics bij deze onvoldoende betrouwbare data. |
| Regio / stad | Nog steeds geen onafhankelijk gevalideerde locatieherkomst. Geen regio-economics, geen afleiding uit city/adres/postcode. |
| Bron / UTM | `leads.utm_source` is optioneel en zelf aangeleverd, geen onafhankelijke attributie. Alleen vaste kanaalgroepen; onbekende waarden blijven onbekend. |
| Professionalactiviteit | Bestaande assignment-, purchase-, offer- en professionalgegevens maken operationele context mogelijk; geen ranglijst of persoonlijke contactinformatie in dit rapport. |
| Bestaande rapportage | `lib/commercial/queries.ts` heeft wallet/prijs-overzichten, `lib/leads/quality-*` qualitycohorten en `lib/distribution/queries.ts` distributiestatistiek. Economics vult die aan, vervangt geen financiële bron. |

### Ontbrekende of onvoldoende betrouwbare data

Geen bevestigde vaste credit/euroconversie, betaalprovidertransacties of
betrouwbare betaalde creditpackadministratie. Mollie blijft uitgesteld.
Een ledger-type `credit_purchase` alleen bewijst geen eurobetaling.
Geen orderwaarde/professionalrevenue, cost model of advertentiekosten.
Daarom **geen euro-omzet, GMV, ROI, take rate, marge, winst, CAC of
prijselasticiteit**. Credits blijven credits.

Ontbrekende timestamps worden niet uit status, `updated_at`, kliks of
notificaties aangevuld. Niet-gerapporteerde feedback betekent onbekend,
niet mislukt. Service-/sourcelabels zijn huidige leadkenmerken; subdienst wordt niet opgehaald;
aankoopprijs en shared/exclusive zijn echte financiële snapshots.

### Prijshistorie

`commercial_audit_log` bevat bestaande `pricing_change` en
`commercial_type_change` acties voor handmatige wijzigingen. Dat is geen
volledig tijdreeksmodel voor alle denkbare historische configuraties.
Een extra historytabel is niet nodig: economics gebruikt uitsluitend de
immutable purchaseprijs, nooit de huidige prijs of multiplier.
De bestaande prijsconfiguratie is alleen gelinkt.

## Centrale definities en noemers

`lib/economics/metrics.ts` bevat definities, minimum sample, maturity,
formules en zuivere aggregatie voor UI en tests.

`N` = aantal afzonderlijke aankopen met `purchased_at` in de laatste
7, 28 of 90 × 24 uur, tot het serverrapportmoment (UTC), status
`purchased` **of** `refunded`. Refunds blijven in N. Cancelled is geen
voltooide aankoop; een cancelled record met debit wordt een inconsistentie.
Unieke leads = distinct lead-ID in die populatie; dat is een andere metric.

| Metric | Definitie |
| --- | --- |
| Gross credits charged | Som immutable `price_credits`, inclusief later refunded aankopen. |
| Refunded credits | Som werkelijk geboekte, expliciet gekoppelde `refund`-entries. Elke ledger-ID telt eenmaal. |
| Credits corrected | Som positieve aan cohortaankopen toerekenbare `correction`-entries. Geen status-only schatting. |
| Extra charges | Absolute som negatieve toerekenbare `correction`-entries, apart zichtbaar. |
| Net credits retained | Gross − refunds − positieve correcties + extra charges. |
| Purchased leads / purchases | N; steeds per aankoop, niet automatisch unieke consumentleads. |
| Refunded purchases / refund rate | Aantal status `refunded` / N = refunded / (purchased + refunded). |
| Partial corrections | Aankopen zonder full refund, met totaal positieve correcties > 0 en < purchaseprijs / N. |
| Gemiddelde credits / aankoop | Gross / N, niet net en niet huidige prijs. |
| Price distribution | Min, p25, median, p75, max van snapshotprijzen; lineair geïnterpoleerde kwantielen. |
| Reached rate | Geldig eerste `reached_at` op/na aankoop en uiterlijk rapportmoment / N. |
| Appointment rate | Geldig eerste `appointment_scheduled_at` / N; ooit geregistreerd, ook als later geannuleerd. Geen bevestiging van bezoek. |
| Won rate | Assignment `progress_status = won` / N; los van ontbrekende historische funnelmijlpalen. |
| Open / lost | Open is niet won/lost. Lost telt alleen expliciete operationele status; een refund is geen lost. |
| Credits / reached, appointment, won | Net cohortcredits / aantal zelfstandige vastgelegde uitkomsten van datzelfde cohort. Bij nul uitkomsten: niet beschikbaar, nooit divide-by-zero. |
| Quality signals / mismatch | Aankopen met erkende gestructureerde feedback / N. Invalid-contact/unreachable combineert mismatch en reachability als union, niet als som. |
| Shared multiplier | Shared purchases / unieke shared leads binnen het aankoopcohort. |
| Wallet stock / credit liability | Som gecontroleerde huidige walletsaldos van alle wallets, niet periode-inkomsten en geen euroliability. |

Full refund gebruikt de bestaande status en koppeling. Een positieve
correctie ter grootte van de prijs zonder refundstatus blijft een **correctie**,
niet een fictieve full refund. Refunds en correcties worden niet dubbel
opgeteld: ieder ledgerrecord heeft één type en unieke ID. Negatieve correcties
zijn geen negatieve refunds. Algemene walletcredits/admincredits/promocredits
zijn geen cohortopbrengst; algemene correcties zonder leadkoppeling veranderen
alleen de walletvoorraad. Vrije references, metadata en descriptions worden
niet geparsed of opgehaald. Ambigue assignmentkoppelingen of negatieve
netcredits blokkeren financiële totalen; er is geen auto-fix.

### Funnel versus zelfstandige rates

De strikte funnel is Aankoop → Bereikt → Afspraak → Gewonnen.
Bereikt vereist ook eerste contact; afspraak vereist bereikt; gewonnen
vereist afspraak en geldig outcome-tijdstip. Alle eerdere stappen moeten
chronologisch vastgelegd zijn, op/na aankoop en uiterlijk rapportmoment.
Elke funnelrate gebruikt **N**, niet de vorige stap. Kosten bij iedere stap
zijn net cohortcredits / strikt gerealiseerde stap. Standalone rates tellen
onafhankelijk vastgelegd bewijs en kunnen hoger zijn dan de strikte funnel.
Een historisch won zonder complete mijlpalen is geen bewezen uitval.

### Maturity, samples en trend

Matured = aankoop minstens **28 dagen** oud. Recent = jonger dan 28 dagen.
Dit is een conservatieve **voorlopige observatiegrens**, geen bewezen typische
salescyclus: er is nog geen voldoende empirische cohort-/lagbasis. Een
14-dagengrens zou bij diensten met langere opvolging te snel verwachtingen
wekken; 28 dagen sluit aan op bestaande rapportperiodes. Herbeoordeling
vereist daadwerkelijke voldoende complete outcome-laggegevens.
De 7- en 28-dagencohorten hebben daardoor normaal geen volwassen aankopen.

Alle/matured/recent hebben ieder hun eigen aankoopnoemer. Toon altijd:
“Resultaten kunnen nog veranderen door openstaande leads.”
Trend groepeert aankopen per aankoopdag (UTC) en toont **huidige** credits,
refunds en won van die aankoopcohorten; dit is geen cashflow per boekingsdag.
Late refunds/correcties buiten de aankoopperiode worden meegenomen.

Percentages worden uitsluitend getoond bij **n ≥ 10**. Daaronder aantallen,
noemer en “Beperkte data”; nul data is geen 0%-kwaliteitsconclusie.
Descriptieve creditsratio's zijn geen ROI. Geen conclusies bij kleine samples.
Prijsoutliers: buiten [p25 − 1,5 IQR, p75 + 1,5 IQR], alleen bij n ≥ 10.
Dat is geen bewijs dat een prijs onjuist is.

### Offers → purchases en unsold

Afzonderlijk aanbodcohort: kandidaat met echt `offered_at` in de gekozen
periode. Conversie = kandidaten met geldig `purchased_at` op/na aangeboden
en uiterlijk rapportmoment / aangeboden kandidaten. Ook uitgesplitst naar
dienst en run-type. Geen “take rate”; geen aankoopnoemer.
Expired gebruikt werkelijke `offer_expires_at` ≤ rapportmoment zonder aankoop,
niet een aangenomen looptijd of uitsluitend status. Open expiry >
rapportmoment zonder aankoop; ontbrekende expiry is geen bewezen expiry.

Unsold = unieke aangeboden leads zonder **enige** purchase/refunded-aankoop
tot rapportmoment, ook vóór het aanbodcohort gecontroleerd via batched
existence-reads. Een refund wist eerdere verkoop niet uit.
Een nog open aanbieding zonder aankoop is “nog niet verkocht”, geen mislukking.
Legacy purchases zonder distributieaanbod vallen buiten offerconversie.

## Reconciliatie en fail closed

Lichte read-only controle:

- unieke purchase-/ledger-/wallet-/offer-ID's en aankoopparen;
- geldige prijs/type/status, lead-, professional- en assignmentrelaties;
- debit-ID, type, bedrag = −purchaseprijs, professional, lead, assignment
  en transactioneel aankoopmoment;
- refund-ID/status/timestamp en werkelijk bedrag/professional/lead/assignment;
- extra ongekoppelde debits/refunds in de geselecteerde aankooppopulatie;
- globale debit-/refund-ID-koppelingen met een minimale projectie van alle
  aankopen, zodat orphan-ledgerboekingen buiten het cohort ook blokkeren;
- geldige ledgerbedragen/signs/walletkoppelingen;
- per wallet som **volledig** ledger = cached balance;
- onmogelijke mijlpaaltijden, ambigue correcties en te grote terugboekingen.

Bij inconsistency is financiële consistentie “aandacht nodig” en zijn **alle**
financiële totalen/ratio's/distributies/voorraad niet beschikbaar, ook in
uitsplitsingen. Aantallen en gerapporteerde outcomes blijven beschikbaar,
maar zijn geen gecontroleerde financiële waarheid. Geen automatische
reparatie, refund, sanctie of directe ledgereditor.

Meerdere HTTP-reads hebben geen gezamenlijke Postgres-snapshot. Paginering
controleert exacte aantallen, ontbrekende pagina's en een cap van 50.000
rijen per dataset/batch. Ledger stopt op rapportmoment; walletwijzigingen
daarna en afwijkende purchase/refundkoppelingen blokkeren cijfers. Reload
is dan de veilige vervolgstap. Dit is lichte reconciliatie, geen externe
accountantscontrole of garantie tegen alle mutaties met onveranderde rowcount.

## Implementatie, security en performance

Route `/admin/economie`, bestaande adminnavigatie. Page én query vereisen
`requireAdminUser`; rolcontrole vindt plaats **vóór** service-role clientgebruik.
Geen nieuwe API, write path, prijsactie, bulkeditor, export, tracking,
experimentactivatie, matching/distributionwijziging of professionalranking.
Bestaande RLS en 29C privileges blijven ongewijzigd.

Queries lezen alleen noodzakelijke kolommen; geen klantnaam, telefoon,
e-mail, adres, omschrijving, professionalcontactinfo of feedbacknotities.
IDs blijven serverintern en ontbreken in het gerapporteerde aggregate.
Bronnen zijn uitsluitend vaste kanaallabels, nooit URLs/querystrings.
React rendert labels als tekst, geen HTML. Geen nieuwe databasetabel.

Aggregatie gebeurt server-side; geen client-side raw datasets of queries per
UI-rij. Vijf gepagineerde datasets (waarvan één minimale globale purchase-
koppelingprojectie), plus batched purchase-existence reads
van maximaal 100 aangeboden lead-ID's per query. Het volledige ledger is
nodig voor betrouwbare creditstock; capoverschrijding geeft een menselijke
melding in plaats van een gedeeltelijk totaal. Geen nieuwe indexes zonder
queryplanbewijs, materialized views of chartdependency.
Normale request-time refresh; geen seconde-realtime of cross-user cache.
Bij latere schaalproblemen eerst queryplannen meten en afzonderlijk een
transactionele SQL-aggregate overwegen, niet stilzwijgend trunceren.

Geen migrations of gewijzigde dependencies. Lege DB geeft nul aantallen en
credits, ontbrekende gemiddelden/ratio's en onvoldoende data. Loading,
menselijke error/retry, gelabelde filters, tabelcaptions, header scopes en
horizontale overflow ondersteunen tablet/desktop en toegankelijkheid.
Deze bronpatronen vervangen geen authenticated browser-/screenreader-QA.

## Latere pricingtests — alleen draft candidates

- Shared price bands op voldoende volwassen, complete cohorten.
- Exclusive premium met vergelijkbare service-/qualitypopulaties.
- Service-specifieke prijsvarianten.
- Quality-adjusted price test na review van feedbackbetrouwbaarheid.

Geen kandidaat is geactiveerd; geen “prijs moet naar X”.
Een segment met relatief veel credits per uitkomst én refunds/qualitysignalen
kan aanleiding zijn voor **handmatige review**, niet een causale conclusie.
Een later GA4/Ads/ad-spend-koppelvlak kan acquisitiekosten helpen onderzoeken,
maar wordt nu niet gebouwd. Prompt 31: eerst een gecontroleerde adminpilot,
datavolledigheid en maturity/lag valideren voordat een experiment wordt ontworpen.

## Validatie

Baseline: `npm ci`, 328 bestaande tests en production `npm audit --omit=dev`
slagen (0 production vulnerabilities). Volledige audit meldt de bestaande
vijf high dev-only vermeldingen; geen dependencywijziging in Prompt 30.
Gerichte tests dekken accounting, noemers, partial corrections, shared,
exclusive, maturity, lege data, PII-grenzen, adminautorisatie en read-only queries.
De bestaande DB-regressies blijven de atomische purchase/refund-, grants-,
29D-validator-, RLS-, quality- en distributiegrenzen bewaken.
De finale lint/typecheck/test/build- en securitytoolresultaten staan in het
PR/eindrapport; een toolfailure geldt nooit als pass.

Geen Supabase-credentials/adminsessie beschikbaar in deze sandbox:
authenticated browser-QA, echte productiecohorten en responsive interactie
op 768/1024/1280 blijven deploymentchecks. Geen productieseeds.
