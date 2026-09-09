import Image from "next/image";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { SubmitButton } from "@/components/ui/submit-button";
import { requireProfessionalUser } from "@/lib/auth/helpers";
import { getProfessionalLeadDetail } from "@/lib/leads/queries";
import { respondToAssignmentAction, updateLeadProgressAction } from "@/lib/leads/actions";
import { formatDate, formatFileSize, formatPostalCode } from "@/lib/utils";
import { leadLossReasonValues, leadProgressStatusValues } from "@/lib/validation";

export default async function ProfessionalLeadDetailPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const user = await requireProfessionalUser();
  const { id } = await params;
  const query = await searchParams;
  const success = typeof query.success === "string" ? query.success : undefined;
  const error = typeof query.error === "string" ? query.error : undefined;
  const assignment = await getProfessionalLeadDetail(id, user.professional.id, user.id);

  if (!assignment) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={assignment.lead.public_reference} title="Aanvraagdetail" description="Je ziet deze lead alleen omdat hij aan jouw account is toegewezen." />
      {success ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-success">{success}</p> : null}
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-danger">{error}</p> : null}
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <StatusBadge value={assignment.assignmentStatus} />
              <StatusBadge value={assignment.assignmentProgressStatus} />
              <StatusBadge value={assignment.lead.urgency} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Dienst</p>
                <p className="mt-1 font-medium">{assignment.lead.service?.name ?? "Onbekend"}</p>
                <p className="text-sm text-muted-foreground">Leadscore: {assignment.lead.lead_score ?? "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Locatie</p>
                <p className="mt-1 font-medium">
                  {formatPostalCode(assignment.lead.postal_code)} {assignment.lead.house_number}
                  {assignment.lead.house_number_addition ? ` ${assignment.lead.house_number_addition}` : ""}
                </p>
              </div>
            </div>
            <p className="text-sm leading-7 text-muted-foreground">{assignment.lead.description}</p>
            <p className="text-sm text-muted-foreground">Klant: {assignment.lead.first_name} {assignment.lead.last_name} · {assignment.lead.phone} · {assignment.lead.email}</p>
            <p className="text-sm text-muted-foreground">Toegewezen op {formatDate(assignment.assignedAt)}</p>
            {assignment.lossReason ? <p className="text-sm text-muted-foreground">Verliesreden: {assignment.lossReason}</p> : null}
          </Card>

          <Card className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Intake-antwoorden</h2>
            {assignment.lead.answers.length ? (
              <div className="space-y-3">
                {assignment.lead.answers.map((answer) => (
                  <div key={answer.id} className="rounded-3xl bg-surface-muted p-4">
                    <p className="font-medium">{answer.question.question}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{answer.displayValue}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="Geen extra intake-antwoorden" description="Voor deze lead zijn geen dynamische intake-antwoorden opgeslagen." />
            )}
          </Card>

          <Card className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Foto’s</h2>
            {assignment.lead.images.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {assignment.lead.images.map((image) => (
                  <a key={image.path} href={image.url ?? "#"} target="_blank" rel="noreferrer" className="overflow-hidden rounded-3xl border bg-surface-muted">
                    {image.url ? (
                      <Image src={image.url} alt="Lead upload" width={960} height={720} unoptimized className="h-56 w-full object-cover" />
                    ) : (
                      <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">Geen preview beschikbaar</div>
                    )}
                    <div className="px-4 py-3 text-sm text-muted-foreground">
                      {image.mimeType ?? "bestand"} · {image.fileSize ? formatFileSize(image.fileSize) : "onbekend"}
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <EmptyState title="Geen foto's toegevoegd" description="Voor deze lead zijn geen foto's geüpload." />
            )}
          </Card>

          <Card className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Activiteiten</h2>
            {assignment.lead.activity.length ? (
              <div className="space-y-3">
                {assignment.lead.activity.map((event) => (
                  <div key={event.id} className="rounded-3xl bg-surface-muted p-4 text-sm">
                    <p className="font-medium">{event.activityType}</p>
                    <p className="text-muted-foreground">{formatDate(event.createdAt)}</p>
                  </div>
                ))}
              </div>
            ) : <EmptyState title="Nog geen activiteiten" description="Voortgang verschijnt hier zodra updates worden gedaan." />}
          </Card>
        </div>
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Actie</h2>
          <p className="text-sm text-muted-foreground">Accepteer of weiger de lead en werk daarna de operationele voortgang bij.</p>
          <div className="flex flex-col gap-3">
            <form action={respondToAssignmentAction}>
              <input type="hidden" name="lead_id" value={assignment.lead.id} />
              <input type="hidden" name="decision" value="accepted" />
              <input type="hidden" name="redirect_to" value={`/vakman/aanvragen/${assignment.lead.id}`} />
              <SubmitButton className="w-full" pendingLabel="Aanvraag wordt geaccepteerd...">Accepteren</SubmitButton>
            </form>
            <form action={respondToAssignmentAction}>
              <input type="hidden" name="lead_id" value={assignment.lead.id} />
              <input type="hidden" name="decision" value="rejected" />
              <input type="hidden" name="redirect_to" value={`/vakman/aanvragen/${assignment.lead.id}`} />
              <SubmitButton className="w-full" variant="secondary" pendingLabel="Aanvraag wordt geweigerd...">Weigeren</SubmitButton>
            </form>
          </div>

          <form action={updateLeadProgressAction} className="space-y-3">
            <input type="hidden" name="lead_id" value={assignment.lead.id} />
            <input type="hidden" name="redirect_to" value={`/vakman/aanvragen/${assignment.lead.id}`} />
            <Select name="progress_status" defaultValue={assignment.assignmentProgressStatus}>
              {leadProgressStatusValues.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </Select>
            <Select name="loss_reason" defaultValue={assignment.lossReason ?? ""}>
              <option value="">Geen verliesreden</option>
              {leadLossReasonValues.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </Select>
            <SubmitButton className="w-full" variant="secondary" pendingLabel="Voortgang wordt bijgewerkt...">Voortgang bijwerken</SubmitButton>
          </form>
        </Card>
      </div>
    </div>
  );
}
