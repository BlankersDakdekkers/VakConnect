import Link from "next/link";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { requireProfessionalUser } from "@/lib/auth/helpers";
import { getProfessionalAssignments } from "@/lib/leads/queries";
import { formatDate, formatPostalCode } from "@/lib/utils";

export default async function ProfessionalAssignmentsPage() {
  const user = await requireProfessionalUser();
  const assignments = await getProfessionalAssignments(user.professional.id);

  return (
    <div className="space-y-6">
      <PageHeader title="Mijn aanvragen" description="Alleen leads met een geldige toewijzing aan jouw professional-account zijn zichtbaar." />
      {assignments.length ? (
        <Card className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="py-3">Referentie</th>
                <th className="py-3">Dienst</th>
                <th className="py-3">Locatie</th>
                <th className="py-3">Urgentie</th>
                <th className="py-3">Status</th>
                <th className="py-3">Datum</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment.id} className="border-t">
                  <td className="py-4">
                    <Link href={`/vakman/aanvragen/${assignment.lead.id}`} className="font-medium text-primary hover:underline">
                      {assignment.lead.public_reference}
                    </Link>
                  </td>
                  <td className="py-4">{assignment.lead.service?.name ?? "Onbekend"}</td>
                  <td className="py-4">{assignment.lead.city ?? formatPostalCode(assignment.lead.postal_code)}</td>
                  <td className="py-4"><StatusBadge value={assignment.lead.urgency} /></td>
                  <td className="py-4"><StatusBadge value={assignment.status} /></td>
                  <td className="py-4 text-muted-foreground">{formatDate(assignment.assigned_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <EmptyState title="Nog geen toegewezen aanvragen" description="Nieuwe leads verschijnen hier zodra een beheerder ze aan jou toewijst." />
      )}
    </div>
  );
}
