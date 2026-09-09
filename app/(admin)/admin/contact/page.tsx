import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { updateContactSubmissionStatusAction } from "@/lib/contact/actions";
import { getAdminContactSubmissions } from "@/lib/contact/queries";
import { contactSubmissionStatusValues } from "@/lib/validation";
import { formatDate } from "@/lib/utils";

export default async function AdminContactPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const params = await searchParams;
  const success = typeof params.success === "string" ? params.success : undefined;
  const error = typeof params.error === "string" ? params.error : undefined;
  const submissions = await getAdminContactSubmissions();

  return (
    <div className="space-y-6">
      <PageHeader title="Contact" description="Beheer binnengekomen contactberichten en volg de afhandeling op." />
      {success ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-success">{success}</p> : null}
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-danger">{error}</p> : null}
      {submissions.length ? (
        <Card className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="py-3">Naam</th>
                <th className="py-3">Reden</th>
                <th className="py-3">E-mail</th>
                <th className="py-3">Telefoon</th>
                <th className="py-3">Datum</th>
                <th className="py-3">Bericht</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.id} className="border-t align-top">
                  <td className="py-4 font-medium">{submission.name}</td>
                  <td className="py-4">{submission.reason}</td>
                  <td className="py-4">{submission.email}</td>
                  <td className="py-4">{submission.phone ?? "-"}</td>
                  <td className="py-4 text-muted-foreground">{formatDate(submission.created_at)}</td>
                  <td className="py-4 whitespace-pre-wrap">{submission.message}</td>
                  <td className="py-4">
                    <form action={updateContactSubmissionStatusAction} className="flex min-w-44 items-center gap-2">
                      <input type="hidden" name="submission_id" value={submission.id} />
                      <input type="hidden" name="redirect_to" value="/admin/contact" />
                      <Select name="status" defaultValue={submission.status}>
                        {contactSubmissionStatusValues.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </Select>
                      <SubmitButton variant="secondary" pendingLabel="Opslaan...">Opslaan</SubmitButton>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <EmptyState title="Nog geen contactberichten" description="Nieuwe berichten verschijnen hier zodra ze via het contactformulier zijn opgeslagen." />
      )}
    </div>
  );
}
