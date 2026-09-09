import Image from "next/image";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { SubmitButton } from "@/components/ui/submit-button";
import { requireProfessionalUser } from "@/lib/auth/helpers";
import { getProfessionalLeadDetail } from "@/lib/leads/queries";
import { respondToAssignmentAction } from "@/lib/leads/actions";
import { formatDate, formatFileSize, formatPostalCode } from "@/lib/utils";

export default async function ProfessionalLeadDetailPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const user = await requireProfessionalUser();
  const { id } = await params;
  const assignment = await getProfessionalLeadDetail(id, user.professional.id);

  if (!assignment) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={assignment.lead.public_reference} title="Aanvraagdetail" description="Je ziet deze lead alleen omdat hij aan jouw account is toegewezen." />
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <StatusBadge value={assignment.assignmentStatus} />
              <StatusBadge value={assignment.lead.urgency} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Dienst</p>
                <p className="mt-1 font-medium">{assignment.lead.service?.name ?? "Onbekend"}</p>
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
        </div>
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Actie</h2>
          <p className="text-sm text-muted-foreground">Accepteer of weiger deze aanvraag. De wijziging wordt server-side geautoriseerd en in de assignment vastgelegd.</p>
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
        </Card>
      </div>
    </div>
  );
}
