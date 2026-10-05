import { reviewSignalLabels, reviewPriorityExplanation } from "@/lib/leads/review-taxonomy";
import type { ReviewItem } from "@/lib/leads/review-queries";

export function QualityReviewSignals({ item }: { item: ReviewItem }) {
  const signals = Object.entries(item.signals).filter(([key, count]) => Object.hasOwn(reviewSignalLabels, key) && count > 0);
  return <div className="space-y-2">
    <span className={`inline-block rounded-lg border px-2 py-1 text-xs font-semibold ${item.priority === "high" ? "border-red-300 bg-red-50 text-red-900" : item.priority === "medium" ? "border-amber-300 bg-amber-50 text-amber-900" : "border-slate-300 bg-slate-50 text-slate-800"}`}>
      Prioriteit: {({ high: "hoog", medium: "middel", low: "laag" })[item.priority]}
    </span>
    {signals.length ? <ul className="flex flex-wrap gap-2 text-xs">{signals.map(([key, count]) => <li key={key} className="rounded-lg border px-2 py-1">{reviewSignalLabels[key]}: {count}</li>)}</ul> : <p className="text-sm text-muted-foreground">Geen geselecteerde kwaliteitssignalen.</p>}
    <p className="text-xs text-muted-foreground">{reviewPriorityExplanation(item.signals, item.priority)}</p>
  </div>;
}
