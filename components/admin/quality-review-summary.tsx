import Link from "next/link";
import type { ReviewQueue } from "@/lib/leads/review-queries";

export function QualityReviewSummary({ counts }: { counts: ReviewQueue["counts"] }) {
  return <section className="rounded-3xl border bg-surface p-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold">Kwaliteitswerklijst</h2><Link className="font-medium text-primary underline" href="/admin/leadkwaliteit/review">Reviews behandelen →</Link></div>
    <p className="mt-2 text-sm text-muted-foreground">Leadcohort van de laatste 28 dagen. Een signaal is aanleiding voor onderzoek, geen bewezen fout. Reviewstatus staat los van verkoopuitkomsten en refunds.</p>
    <dl className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {[["Open", counts.open], ["In onderzoek", counts.in_review], ["Afgehandeld", counts.resolved], ["Hoge prioriteit", counts.high]].map(([label, count]) => <div key={label} className="rounded-xl border p-3"><dt className="text-sm text-muted-foreground">{label}</dt><dd className="text-xl font-semibold">{count}</dd></div>)}
    </dl>
  </section>;
}
