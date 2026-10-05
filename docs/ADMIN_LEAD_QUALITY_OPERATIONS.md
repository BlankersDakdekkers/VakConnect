# Admin lead quality operations — Prompt 29

## Baseline and operations audit

Inspected current `main` at `1ff86663831ebc70f43e546d17cfff6803c0c7f0`,
the merge of PR #32 / Prompt 28. Work stays on the runtime branch
`copilot/prompt-29-admin-operations-lead-quality-review`.
Main contains Prompts 20–28 (PRs #24–#32): experiments, public design,
funnel, trust, professional UX, activation, dependency hardening,
marketplace access hardening, and assignment outcome intelligence.
Prompt 21 is covered by the public-design/content suites rather than a
dedicated prompt-numbered test; Prompt 26's security baseline is documented
in `SECURITY_HARDENING.md`.

Audit findings reported before implementation:

| Existing screen or mechanism | Signals/actions available | Operator friction or boundary |
| --- | --- | --- |
| `/admin` | Operational and commercial KPIs, recent leads | No actionable quality-review queue |
| `/admin/leadkwaliteit` | Structured mismatch/loss/reachability, purchase cohorts, refunds, corrections, source/service/type breakdowns | Descriptive analytics, not investigation tracking; no notes, resolution, or owner workflow |
| `/admin/leads/[id]` | Intake, assignment status, matching, distribution, purchase/refund forms, activity timeline | Operators must find the lead manually and correlate separate professional outcomes |
| `/admin/credits` | Ledger, correction RPC, cached/ledger reconciliation | Generic corrections are not reliably attributable to a particular lead or purchase |
| Notifications/operations | In-app events, distribution alerts and operational health | Not a dedicated lead-quality case history |
| Financial audit | Commercial audit and immutable wallet transactions | Separate from outcome activity; needs context during review |
| Permissions | Server-side `app_metadata.role === admin`, authenticated RLS | No separate contact-reveal permission or granular admin hierarchy |
| Existing lead detail/list | Customer contact/address, free intake text, attribution | More PII than needed for initial triage; do not copy into review responses |
| Existing lead status action | Manual status update | No explicit audit insertion or stale-write check; not exposed as a review correction tool |
| Existing assignment/distribution/pricing controls | Manual product operations | Can alter allocation or sales state; review resolution must not invoke them |

These are workflow findings, not a claim that every pre-existing control is
insecure. Existing product actions outside this change are not redesigned.
New review actions have their own authenticated, audited, concurrency-safe
boundary.

## Queue and signal definitions

`/admin/leadkwaliteit/review` shows only leads with structured attention
signals or an existing tracked review. Merely having a lead or purchase does
not qualify it. Signal-bearing leads can appear as untracked open work;
tracking is created only by an explicit admin action. One review per lead
prevents duplicate open cases; reopen retains history.

Signals use existing assignment, purchase and lead-linked ledger data:

- Structured mismatch reasons: wrong service, wrong region, incorrect
  information, already completed, duplicate, unreachable, invalid contact,
  profile mismatch and other. Free text is not interpreted.
- Invalid contact combines invalid phone/email and structured invalid-contact
  reasons, without double-counting a professional.
- Unreachable uses recorded no-answer/unreachable responses or structured
  no-contact reasons; absence of a contact timestamp alone is not evidence.
- Repeated complaints require independent professionals with the same
  structured complaint. Negative outcomes require at least three independent
  lost outcomes; a loss is not proof that the lead is invalid.
- Stale open assignments: accepted, non-terminal assignments without a
  quality update for 14 days. This is follow-up attention, not a sanction.
- Refund and correction signals use actual recorded financial states.
  Lead-linked corrections are not assumed to refund a specific purchase.
- Conflicting feedback keeps a won outcome visible alongside another
  professional's negative feedback/refund. No global “bad lead” status.
- Financial/data inconsistencies are only demonstrable relationships or
  states, such as a purchase without its expected assignment, a refunded
  purchase with a won outcome, or a terminal outcome without a recorded
  outcome timestamp. Missing historical evidence is not backfilled.

Counts summarize signals; they are not a risk score or a percentage.
Independent-professional counts are not independent verification of truth.

## Explainable priority

Priority affects ordering only:

- **Hoog**: at least two independent invalid-contact reporters; a financial
  inconsistency; or combined refund, duplicate and unreachable signals.
- **Normaal**: mismatch, unreachable, repeated complaints, negative outcomes,
  stale open work, conflicting feedback or a data-quality issue.
- **Laag**: only an informational refund/correction signal.

The detail shows the rule and underlying counts so an operator can check
counterevidence, including another professional reaching or winning the lead.
No resolution changes priority rules or other professionals' outcomes.

## Status and resolution taxonomy

Statuses: open, in review, resolved, dismissed. Closing is always manual.
Reopening is explicit. A resolution/dismissal requires a reason and an admin
note. Reasons use Dutch UI labels:

| Stored reason | Meaning |
| --- | --- |
| `valid_lead` | Geldige lead |
| `incorrect_contact` | Onjuiste contactgegevens |
| `duplicate` | Dubbele aanvraag |
| `wrong_service` | Verkeerde dienst |
| `wrong_region` | Verkeerde regio |
| `already_completed` | Al uitgevoerd |
| `refund_approved` | Refund goedgekeurd |
| `refund_not_applicable` | Refund niet van toepassing |
| `insufficient_evidence` | Onvoldoende bewijs |
| `data_issue` | Dataprobleem |
| `other` | Overig |

`refund_approved` is an administrative conclusion, **not** a refund command.
None of these conclusions change matching, scoring, pricing, distribution,
contact access, wallet balance or consumer/professional status.

## Operator workflow

1. Filter by status, signal, requested service, safe source group,
   shared/exclusive, refund signal and 7/28/90-day lead creation period.
   Search using a lead reference or lead/assignment/purchase identifier.
2. Review explicit signals and priority rules, then open the lead's review.
   Compare individual assignments, purchases, contact evidence and outcomes.
3. Start investigation and append a note. Avoid copying contact details into
   notes. No professional ranking, consumer scoring or automated decision.
4. For operationally necessary contact/intake inspection, consciously follow
   the authorized existing lead-detail link. The review itself does not fetch
   contact data, free feedback text, addresses or raw attribution.
5. If a financial correction is warranted, follow the existing purchase
   refund or credits-ledger link. Check purchase, amount, previous refunds
   and lead-linked corrections first; do not compensate twice.
6. Resolve/dismiss with a reason and note, or reopen a previous decision.
   The result and actor appear in the review audit. A stale page must be
   refreshed before another change.

## Financial and manual-correction boundaries

There is no new wallet mutation path. Refund links target the purchase in
`/admin/leads/[id]`; that existing form requires a labelled reason and explicit
confirmation stating the purchase ID, credit impact and contact-access loss.
The server verifies admin role, confirmation and current purchase/amount
before invoking the existing atomic `refund_lead_purchase` RPC. The RPC
remains authoritative for locking, ledger writes, refund audit and duplicate
protection, including a concurrent refund after the preview check.

Generic corrections continue to use `apply_wallet_transaction`. They are not
automatically related to a purchase or inferred from feedback. No bulk
refunds, bulk corrections, arbitrary database editor or direct wallet writes.
Review status CAS is not permission to overwrite product statuses: this phase
deliberately adds no assignment/lead-state repair backdoor.

## Privacy, RLS and audit

One targeted migration adds references-only review tracking and append-only
operational history/notes. No lead-data copy or guessed historical backfill.
Reads require admin authorization in both the server layer and DB. New
tables are RLS-protected, and authenticated clients cannot directly mutate
review rows, actors, notes or audit. Professionals, consumers and anonymous
users have no access, including guessed detail IDs.

Controlled RPCs use a fixed search path, explicit authenticated-admin checks,
and scoped grants/revokes. Actors and timestamps come from the database,
never a form field. A locked row and expected `updated_at` protect mutations
from stale writes. Creation races cannot create a second case. Notes are
limited to 2,000 characters and cannot be silently edited or deleted. Review
actions and their audit entry commit together.

Operational audit is separate from public analytics; neither notes nor
sensitive details are sent to analytics. Structured timestamps form the
timeline; null remains unknown. Source groups use an allowlist, not raw UTM
values. Region remains “onvoldoende betrouwbare locatieherkomst” because
there is no independent reliable region provenance. No inferred geography.

## Performance and known limitations

Aggregation, filtering, counts and pagination run server-side in SQL, not
one query per list row. Queue pages contain 25 items with a deterministic
lead-ID tiebreaker. Detail results are bounded. Dynamic server rendering and
post-action revalidation avoid long-lived application caches.

The existing Prompt 28 descriptive trends retain the minimum sample n ≥ 10
for percentages. Smaller samples show counts, and neither source comparisons
nor shared/exclusive comparisons imply causation.

No owner assignment, complex ticketing, materialized view, notifications
provider, ML, fuzzy duplicate detector, text analysis, automatic closing,
rematching, repricing, refunds or sanctions are introduced. Resolved cases
remain historical; new evidence does not silently reopen them. Operators
must reopen explicitly. Queue period uses lead creation, not complaint time;
old leads require a wider period. Contact inspection intentionally navigates
to the pre-existing PII-bearing detail, not an in-place reveal.

## Validation

- `npm ci` completed with the unchanged lockfile.
- Initial `npm audit`: 0 critical, 5 high package entries from the existing
  dev-only `braces` chain, matching Prompt 26. Dependencies are unchanged.
- Refund confirmation's four executable regression tests and targeted ESLint
  passed.
- Final lint/typecheck/full suite/build, DB security results and automated
  review results are recorded in the PR report after implementation.
- Supabase environment variables are absent locally. Authenticated admin
  interactions and 768/1024/1280 authenticated responsive QA cannot be claimed
  as passed; the setup fallback is not evidence for the review UI.
