"use client";

import { useState, type ReactNode } from "react";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  leadReachabilityValues as reachabilityValues,
  leadReachabilityLabels as reachabilityLabels,
  leadAppointmentStatusValues as appointmentStatusValues,
  leadAppointmentStatusLabels as appointmentStatusLabels,
  leadMismatchReasonValues as mismatchReasonValues,
  leadMismatchReasonLabels as mismatchReasonLabels,
} from "@/lib/leads/quality-taxonomy";

interface QualityFeedbackFormProps {
  action: (formData: FormData) => Promise<void>;
  mode: "progress" | "rejection";
  leadId: string;
  expectedUpdatedAt: string | null;
  currentProgress?: string;
  reachability?: string | null;
  appointmentStatus?: string | null;
  mismatchReason?: string | null;
  feedbackNote?: string | null;
  lossReason?: string | null;
  lossReasonField?: ReactNode;
  children: ReactNode;
}

function RadioChoices({
  name,
  legend,
  values,
  labels,
  value,
  onChange,
  optional = true,
  emptyChoice = true,
}: {
  name: string;
  legend: string;
  values: readonly string[];
  labels: Readonly<Record<string, string>>;
  value: string;
  onChange: (value: string) => void;
  optional?: boolean;
  emptyChoice?: boolean;
}) {
  return (
    <fieldset className="min-w-0 space-y-2">
      <legend className="text-sm font-medium">{legend} {optional ? <span className="font-normal text-muted-foreground">(optioneel)</span> : null}</legend>
      <div className="grid min-w-0 gap-2">
        {[...(emptyChoice ? [{ value: "", label: "Nog niet vastleggen" }] : []), ...values.map((option) => ({ value: option, label: labels[option] }))].map((option) => (
          <label key={option.value} className="flex min-h-11 min-w-0 cursor-pointer items-center gap-3 rounded-2xl border px-3 py-2 text-sm has-checked:border-primary has-checked:bg-surface-muted focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary">
            <input type="radio" name={name} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} className="size-4 shrink-0 accent-primary" />
            <span className="min-w-0 break-words">{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function QualityFeedbackForm({
  action, mode, leadId, expectedUpdatedAt, currentProgress = "new", reachability,
  appointmentStatus, mismatchReason, feedbackNote, lossReason, lossReasonField, children,
}: QualityFeedbackFormProps) {
  const [progress, setProgress] = useState(currentProgress);
  const [contact, setContact] = useState(reachability ?? "");
  const [appointment, setAppointment] = useState(appointmentStatus ?? "not_scheduled");
  const [mismatch, setMismatch] = useState(mismatchReason ?? "");
  const [loss, setLoss] = useState(lossReason ?? "");
  const [note, setNote] = useState(feedbackNote ?? "");
  const terminal = mode === "progress" && ["won", "lost"].includes(currentProgress);
  const showContact = mode === "progress" && ["contacted", "appointment_scheduled", "quote_sent", "lost"].includes(progress);
  const showAppointment = mode === "progress" && ["appointment_scheduled", "quote_sent"].includes(progress);
  const showLoss = mode === "progress" && progress === "lost";
  const showMismatch = mode === "rejection" || showContact;
  const showNote = showMismatch && (mismatch === "other" || (showLoss && loss === "anders"));
  const noteAllowed = mismatch === "other" || (showLoss && loss === "anders");
  const needsReached = showContact && (["appointment_scheduled", "quote_sent"].includes(progress) || ["scheduled", "completed"].includes(appointment));
  const contactMissing = needsReached && contact !== "reached";

  if (terminal) {
    return <p className="text-sm text-muted-foreground">Deze uitkomst is definitief. Er zijn geen extra vragen.</p>;
  }

  return (
    <form
      action={action}
      className="min-w-0 space-y-3"
      onChange={(event) => {
        const field = event.target;
        if (!(field instanceof HTMLSelectElement)) return;
        if (field.name === "progress_status") {
          setProgress(field.value);
          if (field.value === "appointment_scheduled" && appointment === "not_scheduled") setAppointment("scheduled");
        }
        if (field.name === "loss_reason") setLoss(field.value);
      }}
    >
      <input type="hidden" name="lead_id" value={leadId} />
      <input type="hidden" name="redirect_to" value={`/vakman/aanvragen/${leadId}`} />
      <input type="hidden" name="expected_updated_at" value={expectedUpdatedAt ?? ""} />
      {mode === "progress" && !showContact ? <input type="hidden" name="reachability" value={contact} /> : null}
      {mode === "progress" && !showAppointment ? <input type="hidden" name="appointment_status" value={appointment} /> : null}
      {!showMismatch ? <input type="hidden" name="mismatch_reason" value={mismatch} /> : null}
      {!showNote ? <input type="hidden" name="feedback_note" value={noteAllowed ? note : ""} /> : null}
      {children}
      {showContact ? (
        <details open={contactMissing || undefined} className="min-w-0 rounded-2xl border p-3">
          <summary className="min-h-11 cursor-pointer text-sm font-medium">Klant bereikt? {needsReached ? "" : "(optioneel)"}</summary>
          <RadioChoices name="reachability" legend="Bereikbaarheid" values={reachabilityValues} labels={reachabilityLabels} value={contact} onChange={setContact} optional={!needsReached} />
          {contactMissing ? <p id="contact-needed" className="mt-2 text-sm text-muted-foreground">Leg eerst vast dat je de klant daadwerkelijk hebt bereikt voordat je een afspraak of offerte opslaat. Er wordt niets automatisch ingevuld.</p> : null}
        </details>
      ) : null}
      {showAppointment ? (
        <details className="min-w-0 rounded-2xl border p-3">
          <summary className="min-h-11 cursor-pointer text-sm font-medium">Afspraak bijwerken (optioneel)</summary>
          <RadioChoices name="appointment_status" legend="Afspraakstatus" values={appointmentStatusValues.filter((value) => progress !== "appointment_scheduled" || value !== "not_scheduled")} labels={appointmentStatusLabels} value={appointment} onChange={setAppointment} emptyChoice={false} />
        </details>
      ) : null}
      {showLoss ? lossReasonField : null}
      {showMismatch ? (
        <details className="min-w-0 rounded-2xl border p-3">
          <summary className="min-h-11 cursor-pointer text-sm font-medium">Past de aanvraag niet? (optioneel)</summary>
          <div className="space-y-2">
            <label htmlFor="mismatch-reason" className="block text-sm font-medium">Wat past niet?</label>
            <Select id="mismatch-reason" name="mismatch_reason" value={mismatch} onChange={(event) => setMismatch(event.target.value)}>
              <option value="">Geen reden opgeven</option>
              {mismatchReasonValues.map((value) => <option key={value} value={value}>{mismatchReasonLabels[value]}</option>)}
            </Select>
          </div>
        </details>
      ) : null}
      {showNote ? (
        <div className="space-y-2">
          <label htmlFor="feedback-note" className="block text-sm font-medium">Korte toelichting (optioneel)</label>
          <textarea id="feedback-note" name="feedback_note" rows={3} maxLength={500} value={note} onChange={(event) => setNote(event.target.value)} aria-describedby="feedback-note-help" className="form-control w-full min-w-0" />
          <p id="feedback-note-help" className="text-sm text-muted-foreground">Maximaal 500 tekens. Vermeld geen contactgegevens of andere persoonsgegevens.</p>
        </div>
      ) : null}
      <p className="text-sm text-muted-foreground">Feedback helpt ons de kwaliteit te beoordelen. Dit verandert niets aan je credits of aankooprecht en is geen refundverzoek.</p>
      <SubmitButton className="w-full" variant="secondary" disabled={contactMissing} aria-describedby={contactMissing ? "contact-needed" : undefined} pendingLabel={mode === "rejection" ? "Assignment wordt geweigerd..." : "Voortgang wordt bijgewerkt..."}>
        {mode === "rejection" ? "Weigeren" : "Voortgang bijwerken"}
      </SubmitButton>
    </form>
  );
}
