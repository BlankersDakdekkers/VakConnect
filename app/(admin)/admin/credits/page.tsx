import Link from "next/link";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { SubmitButton } from "@/components/ui/submit-button";
import { applyAdminWalletMutationAction } from "@/lib/commercial/actions";
import { formatCredits } from "@/lib/commercial/labels";
import { getAdminWalletOverview } from "@/lib/commercial/queries";
import { getAdminProfessionals } from "@/lib/professionals/queries";
import { formatDate } from "@/lib/utils";

export default async function AdminCreditsPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const query = await searchParams;
  const success = typeof query.success === "string" ? query.success : undefined;
  const error = typeof query.error === "string" ? query.error : undefined;
  const [wallets, professionals] = await Promise.all([getAdminWalletOverview(), getAdminProfessionals()]);

  return (
    <div className="space-y-6">
      <PageHeader title="Credits" description="Beheer walletsaldo uitsluitend via nieuwe immutable ledgertransacties." />
      {success ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-success">{success}</p> : null}
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-danger">{error}</p> : null}
      <Card className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Walletmutatie toevoegen</h2>
        <form action={applyAdminWalletMutationAction} className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <input type="hidden" name="redirect_to" value="/admin/credits" />
          <FormField id="professional_id" label="Vakman">
            <Select id="professional_id" name="professional_id" defaultValue="">
              <option value="">Selecteer een vakman</option>
              {professionals.map((professional) => (
                <option key={professional.id} value={professional.id}>{professional.company_name}</option>
              ))}
            </Select>
          </FormField>
          <FormField id="type" label="Type">
            <Select id="type" name="type" defaultValue="admin_credit">
              <option value="admin_credit">admin_credit</option>
              <option value="admin_debit">admin_debit</option>
              <option value="promotional_credit">promotional_credit</option>
              <option value="correction">correction</option>
            </Select>
          </FormField>
          <FormField id="amount" label="Credits">
            <Input id="amount" name="amount" type="number" min="1" required />
          </FormField>
          <FormField id="reference" label="Referentie">
            <Input id="reference" name="reference" placeholder="optioneel" />
          </FormField>
          <FormField id="reason" label="Reden">
            <Input id="reason" name="reason" required />
          </FormField>
          <div className="flex items-end">
            <SubmitButton className="w-full" pendingLabel="Mutatie wordt geboekt...">Boeken</SubmitButton>
          </div>
        </form>
      </Card>
      <Card className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-muted-foreground">
            <tr>
              <th className="py-3">Vakman</th>
              <th className="py-3">Status</th>
              <th className="py-3">Saldo</th>
              <th className="py-3">Totaal in</th>
              <th className="py-3">Totaal uit</th>
              <th className="py-3">Laatste transactie</th>
            </tr>
          </thead>
          <tbody>
            {wallets.map((wallet) => (
              <tr key={wallet.professionalId} className="border-t">
                <td className="py-4">
                  <Link href={`/admin/vakmannen/${wallet.professionalId}`} className="font-medium text-primary hover:underline">{wallet.companyName}</Link>
                  <p className="text-xs text-muted-foreground">{wallet.contactName}</p>
                </td>
                <td className="py-4"><StatusBadge value={wallet.status} /></td>
                <td className="py-4 font-medium">{formatCredits(wallet.cachedBalance)}</td>
                <td className="py-4">{formatCredits(wallet.totalIn)}</td>
                <td className="py-4">{formatCredits(wallet.totalOut)}</td>
                <td className="py-4 text-muted-foreground">{wallet.lastTransactionAt ? formatDate(wallet.lastTransactionAt) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
