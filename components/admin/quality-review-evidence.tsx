import Link from "next/link";
import type { ReviewDetail } from "@/lib/leads/review-queries";
import { leadReachabilityLabels, leadAppointmentStatusLabels, leadQualityLossReasonLabels, leadMismatchReasonLabels } from "@/lib/leads/quality-taxonomy";
import { reviewStatusLabels, reviewResolutionLabels } from "@/lib/leads/review-taxonomy";

export function reviewTimestamp(value: string | null | undefined) {
  return value && Number.isFinite(Date.parse(value)) ? new Date(value).toLocaleString("nl-NL", { timeZone: "Europe/Amsterdam" }) : "Niet vastgelegd / onbekend";
}
function label(labels: Record<string, string>, value: string | null | undefined) {
  return value && Object.hasOwn(labels, value) ? labels[value] : "Niet vastgelegd / onbekend";
}
function timelineLabel(value: string) {
  if (value.startsWith("Review: ")) return `Review: ${label(auditLabels, value.slice(8))}`;
  const financialPrefix = "Financiële audit: ";
  return value.startsWith(financialPrefix) ? `${financialPrefix}${label(financialAuditLabels, value.slice(financialPrefix.length))}` : value;
}
const progressLabels = { new: "Nieuw", contacted: "Contact opgenomen", appointment_scheduled: "Afspraak gepland", quote_sent: "Offerte verstuurd", won: "Gewonnen", lost: "Verloren" };
const assignmentLabels = { pending: "In afwachting", viewed: "Bekeken", accepted: "Geaccepteerd", rejected: "Afgewezen", expired: "Verlopen" };
const purchaseLabels = { purchased: "Gekocht", refunded: "Terugbetaald", cancelled: "Geannuleerd" };
const auditLabels = { created: "Review aangemaakt", status_changed: "Status gewijzigd", note_added: "Notitie toegevoegd", reopened: "Review heropend", resolved: "Review afgehandeld", dismissed: "Review gesloten", updated: "Review bijgewerkt" };
const financialAuditLabels = { wallet_credit: "Credits bijgeschreven", wallet_debit: "Credits afgeschreven", lead_purchase: "Lead gekocht", refund: "Refund uitgevoerd", pricing_change: "Prijs gewijzigd", commercial_type_change: "Commercieel type gewijzigd" };
const ledgerLabels = { credit_purchase: "Creditkoop", lead_purchase: "Leadkoop", refund: "Refund", admin_credit: "Beheerderbijschrijving", admin_debit: "Beheerderafschrijving", promotional_credit: "Promotiecredits", correction: "Correctie" };

export function QualityReviewEvidence({ detail }: { detail: ReviewDetail }) {
  return <>
    <section className="rounded-3xl border bg-surface p-5">
      <h2 className="text-lg font-semibold">Afzonderlijke vakmanuitkomsten</h2>
      <p className="mt-2 text-sm text-muted-foreground">Iedere vakman heeft een eigen uitkomst. Gewonnen en verloren bij dezelfde lead is niet automatisch tegenstrijdig. Contact, bereik en afspraak worden niet uit een status afgeleid; onbekende tijdstippen blijven onbekend.</p>
      {!detail.assignments.length && <p className="mt-3 text-sm">Geen toewijzingen vastgelegd.</p>}
      <ul className="mt-4 space-y-3">{detail.assignments.map((assignment) => <li className="min-w-0 rounded-xl border p-3 text-sm" key={assignment.id}>
        <h3 className="break-all font-medium">Vakman-ID: {assignment.professional_id}</h3>
        <p className="mt-1 break-all text-xs text-muted-foreground">Toewijzing-ID: {assignment.id}</p>
        <p className="mt-2">Toewijzing: {label(assignmentLabels, assignment.status)} · Uitkomst / voortgang: {label(progressLabels, assignment.progress_status)}</p>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          {[["Bereikbaarheid", label(leadReachabilityLabels, assignment.reachability)], ["Afspraakstatus", label(leadAppointmentStatusLabels, assignment.appointment_status)], ["Mismatchreden", label(leadMismatchReasonLabels, assignment.mismatch_reason)], ["Verliesreden", label(leadQualityLossReasonLabels, assignment.loss_reason)]].map(([key, value]) => <div key={key}><dt className="text-muted-foreground">{key}</dt><dd>{value}</dd></div>)}
          {[["Toegewezen", assignment.assigned_at], ["Contact geregistreerd", assignment.contacted_at], ["Bereikt geregistreerd", assignment.reached_at], ["Afspraak geregistreerd (geen bezoekdatum)", assignment.appointment_scheduled_at], ["Uitkomst geregistreerd", assignment.outcome_at], ["Feedback laatst bijgewerkt (geen gebeurtenis)", assignment.quality_updated_at]].map(([key, value]) => <div key={key}><dt className="text-muted-foreground">{key}</dt><dd>{reviewTimestamp(value)}</dd></div>)}
        </dl>
      </li>)}</ul>
    </section>
    <section className="rounded-3xl border bg-surface p-5">
      <h2 className="text-lg font-semibold">Aankopen en financiële context</h2>
      <p className="mt-2 text-sm text-muted-foreground">Een refund of walletcorrectie is context, geen bewezen kwaliteitsfout. Reviewafhandeling voert geen financiële actie uit. Refunds worden uitsluitend via de bestaande aankoopworkflow uitgevoerd.</p>
      <ul className="mt-4 space-y-3">{detail.purchases.map((purchase) => <li className="rounded-xl border p-3 text-sm" key={purchase.id}>
        <p className="break-all">Vakman-ID: {purchase.professional_id}</p><p className="mt-1 break-all text-xs text-muted-foreground">Aankoop-ID: {purchase.id}</p><p className="mt-1">{label(purchaseLabels, purchase.status)} · {purchase.price_credits} credits</p>
        <p>Gekocht: {reviewTimestamp(purchase.purchased_at)} · Refund: {reviewTimestamp(purchase.refunded_at)}</p>
        <Link className="mt-2 inline-block text-primary underline" href={`/admin/leads/${detail.item.lead_id}#purchase-${purchase.id}`}>Bekijk aankoop / refund (bevat klantgegevens)</Link>
      </li>)}</ul>
      {!detail.purchases.length && <p className="mt-3 text-sm">Geen aankopen vastgelegd.</p>}
      <h3 className="mt-5 font-medium">Walletcorrecties</h3>
      <ul className="mt-2 space-y-2 text-sm">{detail.corrections.map((correction) => <li key={correction.id} className="break-all">Vakman-ID: {correction.professional_id} · {correction.amount} credits · {reviewTimestamp(correction.created_at)} · Correctie-ID: {correction.id}</li>)}</ul>
      {!detail.corrections.length && <p className="mt-2 text-sm">Geen gekoppelde walletcorrecties.</p>}
      <Link className="mt-3 inline-block text-sm underline" href="/admin/credits">Open bestaande creditadministratie</Link>
      <h3 className="mt-5 font-medium">Lead- en aankoopgekoppeld grootboek</h3>
      <p className="mt-2 text-xs text-muted-foreground">Bestaande boekingen, inclusief expliciet gekoppelde aankoop- en refundtransacties. Saldo na boeking is historisch, geen huidig walletsaldo. Vrije omschrijvingen en auditmetadata worden niet getoond.</p>
      <ul className="mt-3 space-y-3 text-sm">{detail.ledger.map((entry) => <li key={entry.id} className="rounded-xl border p-3">
        <p>{label(ledgerLabels, entry.type)} · {entry.amount} credits · Saldo na boeking: {entry.balance_after} credits</p>
        <p className="mt-1">{reviewTimestamp(entry.created_at)}</p><p className="mt-1 break-all">Vakman-ID: {entry.professional_id} · Boeking-ID: {entry.id}</p>
        {entry.lead_assignment_id && <p className="break-all text-xs text-muted-foreground">Toewijzing-ID: {entry.lead_assignment_id}</p>}
        <p className="mt-1 break-all text-xs text-muted-foreground">Beheerder-ID: {entry.created_by_admin_id || "Niet vastgelegd / onbekend"}</p>
      </li>)}</ul>
      {!detail.ledger.length && <p className="mt-2 text-sm">Geen gekoppelde boekingen vastgelegd.</p>}
      <h3 className="mt-5 font-medium">Bestaande financiële audit</h3>
      <ol className="mt-3 space-y-3 text-sm">{detail.financial_audit.map((event) => <li key={event.id} className="rounded-xl border p-3">
        <p>{reviewTimestamp(event.created_at)} · {label(financialAuditLabels, event.action)}</p>
        <p className="mt-1 break-all">Object-ID: {event.entity_id}</p>
        <p className="mt-1 break-all text-xs text-muted-foreground">Gebruiker-ID: {event.actor_user_id || "Niet vastgelegd / onbekend"} · Vakman-ID: {event.actor_professional_id || "Niet vastgelegd / onbekend"}</p>
        {event.entity_type === "lead_purchase" && <Link className="mt-2 inline-block text-primary underline" href={`/admin/leads/${detail.item.lead_id}#purchase-${event.entity_id}`}>Open betreffende aankoop (bevat klantgegevens)</Link>}
      </li>)}</ol>
      {!detail.financial_audit.length && <p className="mt-2 text-sm">Geen gekoppelde commerciële auditgebeurtenissen.</p>}
    </section>
    <section className="rounded-3xl border bg-surface p-5">
      <h2 className="text-lg font-semibold">Tijdlijn met vastgelegd bewijs</h2>
      <p className="mt-2 text-sm text-muted-foreground">Alleen geregistreerde gebeurtenissen; geen geschatte contactmomenten of aangevulde historische tijdstippen.</p>
      <ol className="mt-3 space-y-2 text-sm">{detail.timeline.map((event, index) => <li key={`${event.at}-${index}`}><time dateTime={Number.isFinite(Date.parse(event.at)) ? event.at : undefined}>{reviewTimestamp(event.at)}</time> · {timelineLabel(event.label)}{event.assignment_id && <span className="block break-all text-xs text-muted-foreground">Toewijzing-ID: {event.assignment_id}</span>}{event.purchase_id && <span className="block break-all text-xs text-muted-foreground">Aankoop-ID: {event.purchase_id}</span>}</li>)}</ol>
      {!detail.timeline.length && <p className="mt-3 text-sm">Nog geen betrouwbare gebeurtenissen beschikbaar.</p>}
    </section>
    <section className="rounded-3xl border bg-surface p-5">
      <h2 className="text-lg font-semibold">Interne notities</h2>
      <ul className="mt-3 space-y-3">{detail.notes.map((note) => <li className="rounded-xl border p-3 text-sm" key={note.id}><p className="whitespace-pre-wrap break-words">{note.body}</p><p className="mt-2 break-all text-xs text-muted-foreground">{reviewTimestamp(note.created_at)} · Beheerder-ID: {note.actor_user_id}</p></li>)}</ul>
      {!detail.notes.length && <p className="mt-3 text-sm">Nog geen interne notities.</p>}
      <h3 className="mt-5 font-medium">Auditspoor</h3>
      <ol className="mt-3 space-y-3 text-sm">{detail.audit.map((event) => <li key={event.id} className="rounded-xl border p-3">
        <p>{reviewTimestamp(event.created_at)} · {label(auditLabels, event.action)}</p><p>{label(reviewStatusLabels, event.from_status)} → {label(reviewStatusLabels, event.to_status)}{event.resolution && ` · ${label(reviewResolutionLabels, event.resolution)}`}</p><p className="mt-1 break-all text-xs text-muted-foreground">Beheerder-ID: {event.actor_user_id}</p>
      </li>)}</ol>
      {!detail.audit.length && <p className="mt-2 text-sm">Nog geen reviewwijzigingen.</p>}
    </section>
  </>;
}
