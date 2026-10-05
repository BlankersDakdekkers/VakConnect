"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { reviewStatuses, reviewStatusLabels, reviewResolutions, reviewResolutionLabels } from "@/lib/leads/review-taxonomy";

function SaveButton() {
  const { pending } = useFormStatus();
  return <button className="rounded-xl bg-primary px-4 py-2 text-white disabled:opacity-60" type="submit" disabled={pending}>{pending ? "Review opslaan…" : "Review opslaan"}</button>;
}
export function QualityReviewForm({ leadId, updatedAt, currentStatus, action }: {
  leadId: string; updatedAt: string | null; currentStatus: (typeof reviewStatuses)[number]; action: (formData: FormData) => Promise<void>;
}) {
  const [status, setStatus] = useState(currentStatus);
  const closing = status === "resolved" || status === "dismissed";
  return <form action={action} className="space-y-4">
    <input type="hidden" name="lead_id" value={leadId} />
    <input type="hidden" name="expected_updated_at" value={updatedAt ?? ""} />
    <label className="grid gap-1 text-sm">Reviewstatus<select name="status" value={status} onChange={(event) => setStatus(event.target.value as typeof status)} className="rounded-xl border bg-surface p-2">{reviewStatuses.map((value) => <option key={value} value={value}>{reviewStatusLabels[value]}</option>)}</select></label>
    {closing ? <label className="grid gap-1 text-sm">Afhandelreden (verplicht)<select required name="resolution" defaultValue="" className="rounded-xl border bg-surface p-2"><option value="">Kies een reden</option>{reviewResolutions.map((value) => <option key={value} value={value}>{reviewResolutionLabels[value]}</option>)}</select></label> : <input type="hidden" name="resolution" value="" />}
    <label className="grid gap-1 text-sm">Interne notitie {closing ? "(verplicht)" : "(optioneel)"}<textarea name="note" required={closing} maxLength={2000} rows={4} className="rounded-xl border bg-surface p-2" aria-describedby="review-note-help" /></label>
    <p id="review-note-help" className="text-xs text-muted-foreground">Maximaal 2000 tekens. Alleen relevante onderzoeksinformatie; geen contactgegevens of intake kopiëren. Notities worden toegevoegd, nooit overschreven.</p>
    {closing && <label className="flex items-start gap-2 text-sm"><input type="checkbox" name="confirmed" required className="mt-1" />Ik bevestig deze administratieve afhandeling. Deze wordt geaudit en voert geen refund, walletcorrectie of uitkomstwijziging uit.</label>}
    {!closing && <p className="text-sm text-muted-foreground">Open heropent een afgesloten review; de eerdere notities en audit blijven behouden.</p>}
    <SaveButton />
  </form>;
}
