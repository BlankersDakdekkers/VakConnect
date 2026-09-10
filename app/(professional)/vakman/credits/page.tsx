import Link from "next/link";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCredits, getWalletTransactionLabel } from "@/lib/commercial/labels";
import { requireProfessionalUser } from "@/lib/auth/helpers";
import { getProfessionalWalletOverview } from "@/lib/commercial/queries";
import { formatDate } from "@/lib/utils";

export default async function ProfessionalCreditsPage() {
  const user = await requireProfessionalUser();
  const wallet = await getProfessionalWalletOverview(user.professional.id);

  return (
    <div className="space-y-6">
      <PageHeader title="Credits" description="Bekijk saldo, aankopen, refunds en je immutable transactielog." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="space-y-2">
          <p className="text-sm text-muted-foreground">Huidig saldo</p>
          <p className="text-4xl font-semibold tracking-tight">{formatCredits(wallet.cachedBalance)}</p>
        </Card>
        <Card className="space-y-2">
          <p className="text-sm text-muted-foreground">Besteed aan leads</p>
          <p className="text-4xl font-semibold tracking-tight">{formatCredits(wallet.totals.spentOnLeads)}</p>
        </Card>
        <Card className="space-y-2">
          <p className="text-sm text-muted-foreground">Refunds ontvangen</p>
          <p className="text-4xl font-semibold tracking-tight">{formatCredits(wallet.totals.refunds)}</p>
        </Card>
        <Card className="space-y-2">
          <p className="text-sm text-muted-foreground">Credits kopen</p>
          <p className="text-sm text-muted-foreground">Binnenkort beschikbaar.</p>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-4 overflow-x-auto">
          <h2 className="text-lg font-semibold tracking-tight">Recente transacties</h2>
          {wallet.transactions.length ? (
            <table className="min-w-full text-left text-sm">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="py-3">Type</th>
                  <th className="py-3">Bedrag</th>
                  <th className="py-3">Saldo na mutatie</th>
                  <th className="py-3">Omschrijving</th>
                  <th className="py-3">Datum</th>
                </tr>
              </thead>
              <tbody>
                {wallet.transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-t align-top">
                    <td className="py-4"><StatusBadge value={transaction.type} /></td>
                    <td className="py-4 font-medium">{transaction.amount > 0 ? "+" : ""}{formatCredits(transaction.amount)}</td>
                    <td className="py-4">{formatCredits(transaction.balanceAfter)}</td>
                    <td className="py-4 text-muted-foreground">{transaction.description ?? getWalletTransactionLabel(transaction.type)}</td>
                    <td className="py-4 text-muted-foreground">{formatDate(transaction.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState title="Nog geen transacties" description="Nieuwe creditmutaties verschijnen hier zodra er saldo wordt toegevoegd of gebruikt." />
          )}
        </Card>
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Lead purchases</h2>
          {wallet.purchases.length ? (
            <div className="space-y-3">
              {wallet.purchases.map((purchase) => (
                <div key={purchase.id} className="rounded-3xl bg-surface-muted p-4 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link href={`/vakman/aanvragen/${purchase.leadId}`} className="font-medium text-primary hover:underline">
                        {purchase.publicReference}
                      </Link>
                      <p className="text-muted-foreground">{formatCredits(purchase.priceCredits)} · {formatDate(purchase.purchasedAt)}</p>
                    </div>
                    <StatusBadge value={purchase.status} />
                  </div>
                  {purchase.refundedAt ? <p className="mt-2 text-muted-foreground">Refunded op {formatDate(purchase.refundedAt)}</p> : null}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="Nog geen purchases" description="Gekochte leads verschijnen hier zodra je je eerste lead accepteert." />
          )}
        </Card>
      </div>
    </div>
  );
}
