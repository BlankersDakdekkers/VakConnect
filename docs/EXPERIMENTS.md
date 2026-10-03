# CRO-experimenten

## Architectuur en veiligheid

- Experimentbeheer breidt de bestaande `analytics_events`-taxonomie en adminanalytics uit; het introduceert geen tweede analyticsprovider.
- `experiments`, `experiment_variants`, `experiment_assignments` en `experiment_audit_log` staan in migration `20261002220000_prompt20_cro_experiments.sql`.
- Experiment-, variant-, assignment- en auditgegevens zijn niet publiek leesbaar of schrijfbaar. `/api/experiments/assignment` gebruikt server-side configuratie en geeft uitsluitend de veilige varianttoewijzing terug. Adminmutaties controleren `requireAdminUser`; status en audit worden transactioneel via `transition_experiment_status` bijgewerkt.
- De bestaande first-party anonieme sessie-UUID uit localStorage identificeert een assignment. Een SHA-256 hash van sessie-ID en experimentkey kiest deterministisch een gewichtsbucket; de gekozen variant wordt daarna in `experiment_assignments` vastgelegd. Er is geen device/browser fingerprint, cross-site ID of nieuwe cookie.
- Assignment valt terug op productie-control als experimentconfiguratie ongeldig is, het target niet matcht of de assignment service faalt. Pauze/completion verwijdert de experimenttoewijzing uit de actieve ervaring; bestaande assignmentregels blijven alleen voor rapportage/audit staan.
- Een actief experiment vereist minimaal twee varianten, exact één control, gewichten met totaal 100, een ondersteund target en eventdoel. Een partial unique index blokkeert meer dan één actief experiment op hetzelfde slot; activering en audit zijn één database-transactie.
- Targetregels zijn beperkt tot publieke route, page type, service/city-slug, devicecategorie, kanaal en funnelstap. SEO H1/body, canonical en metadata, prijzen, matching, validatie, verplichte velden en leadopslag zijn geen experimenteerbare targets.

## Assignment, SSR en preview

Server Components blijven de bron voor publieke pagina's en SEO. De huidige anonieme sessie-ID bestaat alleen in browser-localStorage; de server kan die ID dus niet kennen tijdens de eerste SSR-render zonder een nieuwe cookie of een andere productbeslissing. Daarom renderen experimenteerbare CTA's/progressie eerst de bestaande control, en wordt een actieve variant na hydration opgehaald. Hydration blijft control-consistent, maar een actieve copyvariant kan daardoor na de eerste render wisselen en de tekstbreedte kan wijzigen. Houd experimenten draft totdat dit korte copy-wisselmoment en eventuele kleine layoutverschuiving acceptabel zijn; voor strikt flicker- en CLS-vrije SSR is eerst een expliciete privacy/productkeuze nodig over server-beschikbare assignment-identiteit. Er wordt geen publieke `?variant=` override gebruikt.

De experimentdetailpagina biedt een afgeschermde admin-copypreview zonder analytics-events. Een definitieve permanente control- of variantwijziging blijft een aparte codewijziging.

## Slots en eerste experimenten

| Key | Slot | Target | Control | Variant B | Doel |
| --- | --- | --- | --- | --- | --- |
| `homepage_cta_copy` | `homepage.hero.cta` | Homepage hero | Plaats je klus | Start je aanvraag | CTA → funnelstart → serverbevestigde lead |
| `funnel_progress_copy` | `lead.progress.copy` | `/aanvraag` voortgang | Stap {current} van {total} | Stap {current} van {total} — Vertel wat er moet gebeuren | Progresscopy → serverbevestigde lead |
| `service_mid_cta_copy` | `service.mid_cta` | Dakdekker-servicepagina | Plaats je klus | Beschrijf je dakprobleem | CTA → funnelstart → serverbevestigde lead |

Alle drie worden als `draft` ingevoegd. Gewichten staan op 50/50. Variant B verandert alleen presentatie/copy en behoudt dezelfde bestemming en bestaande formulier-/leadlogica.

## Events en definities

- `cta_impression` wordt via `IntersectionObserver` geregistreerd wanneer een bestaande `TrackedLink` zichtbaar is. Fallback zonder `IntersectionObserver` controleert zichtbaarheid in de viewport. Deduplicatie is per page view + CTA-ID + locatie; idempotency keys voorkomen dubbele opslag bij retries.
- `experiment_exposed` bevat experiment-/variant-ID en -key, slot en veilige page/device/channeldimensies. De exposure-route controleert server-side dat de actieve assignment bij sessie en variant hoort; CTA-impressie en exposure worden alleen bij zichtbaarheid vastgelegd.
- `public_cta_click` bevat variantcontext wanneer een experiment aan die CTA-slot is gekoppeld. Funnelstarts en succesvolle inzendingen zijn downstream op dezelfde anonieme sessie te koppelen.
- `lead_submitted` blijft server-only, idempotent per lead en blijft de bron van waarheid voor succesvolle inzending. CRO-rapportage koppelt de serverbevestigde event-sessie terug aan eerdere exposures; de experimentlaag wijzigt de leadopslag niet.
- Events die parallel worden verstuurd kunnen in de database net vóór de serverbevestigde exposure aankomen; rapportage staat daarom maximaal twee minuten event-volgordemarge toe binnen dezelfde anonieme sessie.
- Formulierstappen rapporteren bekeken, afgerond, terug, validatiefouten per stap, grove duur-buckets (`<10s`, `10–30s`, `30–60s`, `1–3m`, `>3m`) en step drop-off. Validatiefoutcategorieën blijven allowlisted; ingevulde waarden worden nooit gemeten.
- Funnel abandonment is een inferentie: gestart, geen serverbevestigde lead/gekoppelde lead en geen funnelactiviteit gedurende de gekozen drempel (30 minuten of 2 uur). Een verborgen tab of routewijziging wordt niet als betrouwbaar tab-close-event geïnterpreteerd.
- CTA CTR is `unieke click-sessies / unieke exposures`; downstream starts en serverbevestigde inzendingen zijn per anonieme sessie. Service- en lokale pagina's tonen dezelfde impressie/CTR-dimensies.
- Per variant ziet de admin exposures, CTA-clicks/CTR, starts, serverbevestigde leads, conversiepercentage, absoluut verschil in procentpunten t.o.v. control, devicecategorie en sample warnings. Onder 50 exposures, 20 starts of 10 leads wordt een lage-steekproefwaarschuwing getoond.

Events bevatten geen naam, e-mail, telefoon, adres, vrije tekst, formulierantwoord of fingerprint. Er worden geen heatmaps, session replay, externe experiment-SDK's of automatische botdetectie toegevoegd.

## Handmatige workflow

1. Bekijk de control en variant in de adminpreview; test bestemming, responsive gedrag en de reguliere funnel.
2. Activeer alleen wanneer target/slot, control, variantverdeling (totaal 100) en eventdoel geldig zijn. Een ander actief experiment op hetzelfde slot blokkeert activering.
3. Volg `/admin/experimenten/[id]` op 7 dagen of sinds start. Let op device-samplewaarschuwingen. Percentages en verschillen zijn beschrijvend, niet statistisch significant.
4. Pauzeren schakelt terug naar control; hervatten is handmatig. Completeren/archive gebeurt handmatig. Er is geen winnerlabel, automatische allocation-aanpassing of automatische rollout.
5. Kies een eventuele permanente copywijziging expliciet in een aparte codewijziging na menselijke beoordeling.

Startvolgorde voor een latere handmatige activatie: homepage CTA-copy, progresscopy in de funnel, daarna de dakdekker mid-CTA. Niet alle tests tegelijk live zetten.

## Grenzen en vervolg

- Configuratie wordt zonder lange cache gelezen. Open actieve assignments controleren elke 15 seconden op een pause; een nieuw experiment wordt toegepast bij een volgend paginabezoek/navigatie, niet door polling op controlpagina's.
- Analytics-uitval laat de bestaande control/leadflow intact en maakt rapportage als niet-beschikbaar zichtbaar in plaats van een winnaar te suggereren.
- Omdat localStorage niet in SSR beschikbaar is, is een expliciete privacy/productkeuze over een server-beschikbare sessie-identiteit nodig voordat een absolute no-flicker SSR-experimentgarantie kan worden geboden. Geen trackingcookie toevoegen zonder die keuze.
- Vervolg: beslis eerst of actieve variantcopy na hydration is toegestaan of dat een consent-/privacybeoordeelde serverassignment nodig is; daarna eventueel verdere safe targets en page/device diagnostiek uitbreiden.
