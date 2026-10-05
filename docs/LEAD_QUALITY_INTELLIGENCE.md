# Leadkwaliteit en marketplace intelligence — Prompt 28

## Baseline-audit (voor wijzigingen)

Baseline: actuele `main`, `a0595452b1fd427aa503bf7171a83e1b3f349eaa`,
met PR #31 / Prompt 27. Gitgeschiedenis bevestigt PR #24–#31:
experimenten (20), publieke UX (21), intake (22), vertrouwen (23),
vakman-UX (24), activatie (25), dependency security (26) en marketplace
authorization (27). Niet iedere prompt heeft een eigen migration.

| Onderwerp | Bestaande bron van waarheid | Datagat |
| --- | --- | --- |
| Aanvraag | `leads`, `lead_answers`, `lead_images` | Globale `leads.status` is geen betrouwbare uitkomst van iedere vakman bij shared leads. |
| Matching | `lead_matches` | Selectie/match is geen bewijs van contact of succes. Bestaande duplicate-signalen worden niet uitgebreid. |
| Aanbod/weigeren | `lead_distribution_candidates` | `decline_reason` bevat bestaande keuzewaarden, maar is een tekstkolom; ontbrekende of onbekende historische redenen zijn geen mismatchbewijs. |
| Toewijzing/opvolging | `lead_assignments` | Progress bestaat: `new`, `contacted`, `appointment_scheduled`, `quote_sent`, `won`, `lost`. Geen expliciete bereikbaarheid of afspraak voltooid/geannuleerd. |
| Verlies | `lead_assignments.loss_reason` | Bestaande Nederlandse redenen; oude tekst is niet noodzakelijk een geldige taxonomywaarde. |
| Contact/afspraak/uitkomsttijd | `progress_updated_at`, `lead_activity` | Eén mutabele timestamp bewijst niet het eerste contact of de eerste afspraak. Geen historische timestamps verzinnen. |
| Aankoop | `lead_purchases` | Betrouwbare acquisitiontijd en relatie met lead, professional en assignment. Refund is financieel, niet operationeel. |
| Wallet/refund/correctie | `wallet_transactions`, `lead_purchases.refund_transaction_id`, `commercial_audit_log` | Redenen/toelichting deels vrije tekst. Alleen expliciet gekoppelde transacties zijn toerekenbaar; geen tekstparsing of automatische refund. |
| Notificaties | Bestaande notification engine en transactionele hooks | Een melding of klik bewijst geen contact. Geen nieuwe reminders of scheduler. |
| Analytics/experimenten | `analytics_events`, bestaande experimenttabellen | Publieke funnel is geen operationele outcome-database. Geen nieuw experiment of analytics-event nodig. |
| Adminrapportage | Bestaande lead/KPI/analytics/distributiepagina’s | Geen geïntegreerde aankoopcohort-funnel, expliciete bereikbaarheid of minimumsteekproef. |

`lead_assignments` blijft de enige operationele outcome-bron per vakman.
`lead_purchases` en het walletledger blijven de financiële bronnen.
`lead_activity` blijft het auditspoor. Er komt geen tweede outcome-database.

## Operationele definities

- **Nieuw**: nog geen expliciet vastgelegd contact.
- **Contact opgenomen**: vakman meldt een werkelijke contactpoging; niet afgeleid
  uit klikken op telefoon/e-mail.
- **Afspraak gepland**: expliciete operationele stap, geen automatisch bewijs
  dat de consument bereikt is.
- **Offerte verstuurd**: bestaande progress-stap.
- **Gewonnen / verloren**: expliciet door de vakman vastgelegd, terminal.
  Geen automatische verliesstatus door tijdsverloop.
- **Nog open**: geen `won` of `lost`; geen afzonderlijke redundante DB-status.

De bestaande volgorde blijft behouden. Verlies mag ook na contact of een
geplande afspraak worden vastgelegd, zonder een fictieve offerte te registreren.
Een rechtstreeks sprong van nieuw naar gewonnen blijft ongeldig.
Een verlies door één vakman maakt een shared lead niet globaal verloren.

### Bereikbaarheid

`reached`, `no_answer`, `invalid_phone`, `invalid_email`,
`unreachable_other`. Onbekend is een ontbrekende waarde, geen onbereikbaarheid.
Een contactpoging is niet hetzelfde als een bereikt contact.

### Afspraak

`not_scheduled`, `scheduled`, `completed`, `cancelled`.
Annulering van een afspraak is **geen** afgeleide consumer cancellation.
Eerste afspraak- en contacttimestamps beschrijven vastlegging door de vakman,
niet onafhankelijk geverifieerde gebeurtenissen.

### Mismatch

`wrong_service` (verkeerde dienst), `wrong_region` (buiten werkgebied),
`incorrect_information` (onjuiste informatie), `already_completed`
(al uitgevoerd), `duplicate` (dubbele aanvraag), `unreachable`
(niet bereikbaar), `invalid_contact` (contactgegevens onjuist),
`profile_mismatch` (past niet bij profiel), `other` (anders).

Redenen zijn feedback, geen vastgestelde fout, fraude of kwaliteitsscore.
Bestaande decline-redenen zoals geen capaciteit, prijs en timing zijn niet
automatisch mismatches. Aanbodfeedback heeft een andere populatie dan aankopen.

### Verliesredenen

Behoud `prijs`, `klant_niet_bereikbaar`, `klant_koos_andere_partij`,
`klus_uitgesteld`, `buiten_scope`, `anders`; voeg `duplicate`,
`already_completed`, `wrong_service`, `wrong_region`, `invalid_contact` toe.
Een reden bij verlies is optioneel. Er is geen automatische classificatie van
historische vrije tekst en geen tweede synoniem voor “anders”.
Ontbrekende en onbekende historische verliesredenen worden als aparte
onbekend-bucket geteld, zonder hun tekst aan het rapport door te geven.

### Vrije tekst

Een korte toelichting bij “anders” is optioneel, maximaal 500 tekens.
Vraag niet om namen, adressen, telefoonnummers of e-mailadressen.
Geen uploads, vrije-tekstanalyse of tekst in analytics/admin quality responses.

## Metingen: uitgangspunten

Gebruik aankoopcohorten van 7, 28 of 90 dagen. Uitkomsten zijn de huidige
vastgelegde stand van die cohorten, niet alleen wijzigingen binnen de periode.
Nieuwe cohorten hebben minder opvolgtijd; vergelijkingen zijn beschrijvend,
niet causaal. Niet-gerapporteerde uitkomsten zijn onbekend, niet verloren.

Refunds blijven in de acquisitionpopulatie zodat de noemer niet kunstmatig
verbetert. Geannuleerde, niet voltooide aankopen horen daar niet in.
Een shared lead kan meerdere aankopen en verschillende uitkomsten hebben:
rapporteer unieke leads en het aantal aangekochte assignments afzonderlijk.
Ontbrekende assignments/mijlpaaltimestamps zijn datakwaliteitsgaten,
geen reden om records stilzwijgend uit de noemer weg te laten.

Alle rates moeten hun noemer vermelden. Een strikte funnel gebruikt de
doorsnede van vastgelegde voorgaande stappen; losse operationele won/lost
tellingen kunnen dus afwijken van de laatste funnelstap.
Geen percentages benadrukken bij minder dan **10** waarnemingen:
toon aantallen en “Beperkte steekproef”. Nul data is geen 0%-kwaliteitsoordeel.

### Exacte noemers

`N` = unieke aankopen met status `purchased` of `refunded`, met
`purchased_at` binnen de gekozen periode en de gekozen filters.
Dit is een aankoop/assignmentpopulatie, niet het aantal unieke consumentleads.

| Metric | Teller / noemer |
| --- | --- |
| Contact rate | Aankopen met expliciete `contacted_at` op/na aankoop / N |
| Reached rate | Aankopen met expliciete `reached_at` op/na aankoop / N |
| Unreachable rate | Aankopen met huidige `reachability` = `no_answer`, `invalid_phone`, `invalid_email` of `unreachable_other` / N |
| Appointment rate | Aankopen met eerste `appointment_scheduled_at` op/na aankoop / N; een later geannuleerde afspraak blijft ooit gepland |
| Won rate | Aankopen waarvan assignment `progress_status = won` / N |
| Lost rate | Aankopen waarvan assignment `progress_status = lost` / N |
| Mismatch rate | Aankopen met een geldige gestructureerde assignment-mismatchreden / N |
| Refund rate | Aankopen met financiële status `refunded` / N |
| Correction rate | Aankopen met minstens één expliciet aan dezelfde lead en professional gekoppelde wallettransactie van type `correction`, op/na aankoop / N |

Een refund en correctie kunnen dezelfde aankoop betreffen: tel percentages niet
bij elkaar op. Meerdere correcties op één aankoop tellen één keer.
Algemene walletcorrecties zonder leadkoppeling worden niet aan leadkwaliteit
toegeschreven. Refundredenen blijven in het bestaande financiële auditspoor;
geen analytics op vrije refundtekst.

Strikte funnel:

1. Purchased: N.
2. Contacted: expliciet eerste contact op/na aankoop.
3. Reached: Contacted én eerste bereikt contact op/na contact.
4. Appointment: Reached én eerste geplande afspraak op/na bereikt contact.
5. Won: Appointment én `won` met uitkomsttijd op/na afspraak.

Alle timestamps moeten uiterlijk op het rapportmoment liggen. Funnelpercentages
vermelden de gebruikte basis (aankopen of vorige stap). Historische gewonnen
opdrachten zonder bewijs van alle mijlpalen tellen wel bij standalone won, maar
niet bij de strikte funnel. Dat is onvolledige registratie, niet bewezen uitval.
Huidige onbereikbaarheid en ooit bereikt contact kunnen naast elkaar bestaan.

Tijdmetingen zijn medianen van aankoop tot expliciet eerste contact, eerste
afspraak of won/lost, uitsluitend bij geldige, niet-negatieve timestamps.
Vermeld het aantal meetbare observaties. Geen terugvulling uit `updated_at`.

### Breakdown en filtering

Dienst, high-level bron en shared/exclusive vergelijken alleen beschrijvend.
Het huidige model heeft geen onafhankelijk gevalideerde regioherkomst voor
`leads.city`: die waarde kan uit adresgegevens komen. Daarom blijft regio
**Onbekend**; de regiosectie meldt onvoldoende betrouwbare regiogegevens.
Er worden geen provincies uit postcodes/adressen afgeleid. Een toekomstige
betrouwbare regio-attributie vereist een afzonderlijke product-/privacybeslissing.

Outcome- en mismatchfilters selecteren aankoop/assignmentobservaties, niet alle
professionals van eenzelfde lead. Een leadtabelrij vat uitsluitend de gefilterde
observaties samen. Aanbod/decline-cijfers gebruiken aangeboden kandidaten als
noemer, niet N; outcome/mismatch-aankoopfilters mogen daar niet als
aanboduitkomsten worden voorgesteld.

Het dashboard haalt uitsluitend noodzakelijke relationele velden op, met
gecontroleerde paginering in plaats van Supabase’s standaardlimiet stilzwijgend
als complete populatie te behandelen. Er is geen query per tabelrij,
materialized view, realtimekanaal of nieuwe cachinglaag. Normaal vernieuwen
is voldoende.

## Gerichte migration

Eén migration: `20261005170000_prompt28_lead_quality.sql`.

- Bestaande tabel `lead_assignments`: `contacted_at`, `reached_at`,
  `appointment_scheduled_at`, `outcome_at`, `reachability`,
  `appointment_status`, `mismatch_reason`, `feedback_note`,
  `quality_updated_at`, `quality_updated_by`.
- Geen nieuwe tabel of enum. Bestaande progress-enum blijft behouden.
  Keuzewaarden en toelichtinglengte worden database-side begrensd.
- Bestaande transitionfunctie staat vroeg verlies na contact/afspraak toe.
- Nieuwe invoker-RPC `update_assignment_quality` met verwachte versie.
- Assignmentguard en atomische audittrigger beschermen servervelden en
  schrijven naar bestaand `lead_activity`; auditguard voorkomt losse
  gefabriceerde outcome-auditrijen.
- Nieuwe functies/triggers: `enforce_assignment_quality`,
  `audit_assignment_quality`, `guard_assignment_quality_audit`.
  Bestaande `is_valid_lead_progress_transition` wordt vervangen.
- Bestaande professional read-policies op `lead_activity`
  (“for assigned leads” en “for unlocked leads”) worden vervangen door één
  policy “professionals can read lead activity for assigned leads”, met
  eigen professional en geldige contacttoegang. Adminpolicy blijft behouden.
- Geen indexes toegevoegd zonder bewezen queryplanbehoefte; bestaande
  aankoop/assignment/lead/transactie-indexes blijven behouden.
- Geen wijziging aan wallet-/purchase-/refundfuncties, matching- of
  distributietriggers. Uitkomstfeedback muteert geen ledger.

## Privacy en beveiliging

Professional schrijft alleen eigen assignmentfeedback. Adminrapportage volgt
bestaande server-side rolcontrole. RLS, Prompt 27 contact-unlock/immutability,
purchase atomicity en walletledger blijven behouden.
Databasewaarden, actor en timestamps moeten ook buiten de UI beschermd zijn;
optimistische concurrency voorkomt overschrijven vanaf een verouderd formulier.
Dubbele identieke updates mogen geen extra mijlpalen/auditrijen creëren.

Auditmetadata bevat uitsluitend gestructureerde waarden, geen toelichting.
Uitkomstfeedback van een andere vakman mag niet via het activiteitenspoor van
een shared lead uitlekken. Het quality dashboard heeft geen consumercontactdata
of ranglijst van professionals nodig.

Bronnen worden uitsluitend op veilig high-level kanaal geaggregeerd.
Geen analyticsdimensies afleiden uit naam, telefoon, e-mail of adres; onbekende
of onveilige bron/regio blijft onbekend. Geen nieuwe tracking of retentieflow.
Vrije toelichting valt onder het bestaande toegangs- en bewaarbeleid; verzamel
geen extra gevoelige tekst.

## Expliciete begrenzing

**Geen automatische optimalisatie.** Feedback verandert geen matching,
scoring, eligibility, distributie, prijs, wallet, refund of correctie.
Refund ≠ slechte lead. Geen automatische credit, blokkade, straf, ML,
predictive scoring of publieke reviewscore. Geen Mollie of externe
e-mail/SMS/WhatsApp. Geen nieuw experiment, export of realtimevereiste.

Latere productbeslissingen kunnen deze beschrijvende data gebruiken voor
intake/matchingverbetering, pricingonderzoek, refundbeleid of coaching.
Daarvoor zijn afzonderlijke besluitvorming, privacycontrole en tests nodig.
Mogelijke latere experimenten: feedbackmoment, redenformulering, een passende
outcome-reminder of adminvisualisatie — niets daarvan is nu geactiveerd.

## Validatie en beperkingen van de omgeving

Voor implementatie: `npm ci`, lint, typecheck en bestaande tests geslaagd
(221 tests, geen failures of skips). PostgreSQL 16 is beschikbaar voor de
bestaande DB-testharness; dit is geen draaiende lokale Supabase Auth/PostgREST.

Supabase URL, anon key en service-role key zijn niet geconfigureerd.
Daarom kan deze omgeving geen geauthenticeerde professional/admin-browser-QA
bewijzen. De gevraagde 320/375/430- en 768/1280-breedtes, echte formulierupdates,
adminfilters en keyboard/screenreader-interactie blijven deployment-QA.
Broncontroles op fieldsets, labels, alerts, pending states en scroll-safe
tabellen zijn niet gelijk aan een volledige accessibility- of browsertest.

Dependencybaseline van Prompt 26 blijft ongewijzigd: productieaudit heeft
geen kwetsbaarheden; volledige `npm audit` rapporteert nog vijf high
packagevermeldingen van dezelfde dev-only `braces`-keten als beschreven in
`docs/SECURITY_HARDENING.md`. Geen nieuwe dependencies of lockfilewijziging.
Dit is geen schone volledige npm-audit.

De beschikbare geautomatiseerde parallel-validatie is aangeroepen:
CodeQL JavaScript-analyse faalde (nul alerts is **geen pass**);
automatische code review kon zijn geconfigureerde model niet starten.
Een afzonderlijke read-only securityreview vond geen kwetsbaarheden in de
beoordeelde wijzigingen. Deze review vervangt geen geslaagde CodeQL-scan.

Na integratie en correcties: lint, typecheck, **271 tests (0 failures,
0 skips)** en production build geslaagd. Dit omvat PostgreSQL-backed
ownership/IDOR, actor- en timestampbescherming, stale writes, terminale
uitkomsten, gedeelde leads, feedbackwaarden, optionele verliesreden,
historische datagaten en legacy refunds; daarnaast Prompt 20–27-regressies,
rapportnoemers/steekproeven/privacy en daadwerkelijk gerenderde formulierpayloads.
Deze tests gebruiken de bestaande PostgreSQL-harness met gesimuleerde Authclaims,
niet een geauthenticeerde browser of een volledige Supabase-installatie.

Prompt 29 kan zich richten op dataverzamelkwaliteit en een gecontroleerde,
geauthenticeerde pilot: valideer mobiele/adminflows, herstel de beschikbare
securitytooling en beoordeel voldoende volwassen cohorten voordat er nieuwe
productregels of experimenten worden overwogen. Regio-attributie blijft een
expliciet datagat; geen automatische georegels of optimalisatie toevoegen.
