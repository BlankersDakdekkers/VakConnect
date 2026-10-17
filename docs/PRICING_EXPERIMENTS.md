# Pricing experiments

Pricing experiments are an admin-managed way to compare a bounded credit price with the existing lead price. They reuse Prompt 20's experiment record, variants, status transitions, and audit log; assignments and immutable purchase snapshots are specific to pricing. Every new experiment starts as `draft`. Nothing activates, changes the baseline, or rolls out automatically.

## Lifecycle

1. Create a draft from `/admin/experimenten/pricing`.
2. Choose a service and/or commercial type and, optionally, a control-price band. The only supported targeting fields are service ID, shared/exclusive type, and the resolved baseline credit-price band.
3. Optionally restrict a pilot to a list of professional IDs. This list is an allowlist, not individual price discrimination. Do not enter names, emails, phone numbers, postal codes, or other personal attributes.
4. Review the control, fixed variant price, allocation, primary metric, required guardrails, and preview in the admin screen.
5. Activate explicitly as an admin. Activation checks the segment, prices, metric, guardrails, and allocation. The schema's unique active slot prevents a second pricing experiment from overlapping it.
6. Monitor assignment and purchase counts, refunds, mismatch, reachability, maturity, and reconciliation. Pause manually to stop new assignments. An existing assignment keeps its saved price for its normal offer lifetime.
7. Resume only through the status transition after the database revalidates the configuration. Active/paused pricing configuration and variant prices cannot be edited; create a new draft instead.
8. Complete and archive manually. An admin may record a decision note (keep control, consider a variant later, inconclusive, or stop). A decision note does not modify standard pricing.

The offer/pricing assignment unit is the professional+lead pair, corresponding to that professional's offer context. The first eligible price render snapshots either the experiment assignment or the ordinary baseline, so activating a test later cannot change an already shown offer price. A unique database constraint makes creation idempotent under concurrent requests and prevents that pair from receiving a second experiment price. Assignment data contains only nullable experiment/variant IDs, lead/professional IDs, service ID, commercial type, the control price, the assigned price, and a timestamp.

## Control and bounds

The control is calculated from the existing server-side source in order: lead-specific override, active pricing rule, then the existing default (shared 12 / exclusive 20 credits). The experiment does not copy or mutate that pricing configuration.

Variant prices are integer credits only. The hard bounds are at least 1 credit, at most 100 credits, and no more than 25% above or below that lead's resolved control price. The percentage limit is explicit in the configuration as `max_delta_percent: 25` and is also enforced when an assignment is created. If a segment's baseline price or variant does not fit the bounds, the request safely uses the ordinary baseline.

There is no EUR price, dynamic pricing, individualized professional baseline, region/postal-code targeting, source/query-string targeting, subservice targeting, lead-score targeting, or consumer price. Service and shared/exclusive type are marketplace attributes. The pilot allowlist, when enabled, contains only professional UUIDs.

## Metrics and guardrails

The primary metric is selected from a fixed allowlist: offer-to-purchase, purchase-to-reached, purchase-to-appointment, purchase-to-won, net credits per offer/purchase, or matured credits per won lead. Denominators use assignment or purchase records as appropriate; purchases/refunds and net retained credits come from the Prompt 30 economics and wallet-ledger definitions, not client-calculated events.

Every experiment includes refund rate, mismatch rate, reachability, sample size, and purchase volume guardrails. Percentage metrics are suppressed below `n = 10`. A clear decision sample requires at least 30 assignments and 30 purchases per variant; this is a recommendation threshold, not a statistical-significance claim. Appointment/won outcomes and matured credits use Prompt 30's 28-day maturity window. Recent open purchases are not counted as losses.

The admin view uses descriptive language only: higher/lower, low sample, or insufficient data. It does not select or badge a winner. Any economics/reconciliation failure hides metric conclusions and decision guidance. Guardrail comparisons are warnings for manual review, not automated stop/start actions.

Once a variant has at least 10 purchases, explicit operational warnings are shown at refund rate ≥20%, mismatch rate ≥20%, or reachability <50%. These review thresholds are not statistical claims and never pause an experiment automatically.

## Purchase integrity and privacy

The server resolves eligibility, the normal control, experiment/variant assignment, and final price. The professional's form submits only the lead ID and idempotency key; it cannot submit a trusted price, experiment ID, or variant. The database uses the assigned credit amount for the existing atomic wallet debit and immutable purchase snapshot. The purchase stores the experiment and variant IDs, and refunds continue to credit the actual immutable `price_credits`.

Pricing assignment/config/reporting are private to admins and server-side services. Assignment context excludes contact details, names, email, phone, postal code, free text, and source query parameters. Professionals only see their final credit price and existing shared/exclusive context.

## Safe pilot procedure

Create a draft; define a narrow service/type/price-band segment; optionally enter test-professional UUIDs in the pilot allowlist; review the config and sample requirements; activate manually; monitor the admin guardrails and reconciliation; pause if needed; wait for matured cohorts; then write a manual decision note. The note is not rollout. Changing the baseline remains a separate manual pricing operation and is not part of an experiment.
