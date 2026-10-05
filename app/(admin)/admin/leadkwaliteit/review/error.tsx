"use client";

import Link from "next/link";
export default function QualityReviewError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <section className="rounded-3xl border bg-surface p-5" role="alert"><h2 className="text-xl font-semibold">Kwaliteitsreviews konden niet worden geladen</h2><p className="mt-2 text-sm text-muted-foreground">Er worden geen onvolledige resultaten getoond. Probeer opnieuw; blijft dit gebeuren, laat de reviewconfiguratie controleren.</p><div className="mt-4 flex flex-wrap gap-4"><button type="button" className="rounded-xl bg-primary px-4 py-2 text-white" onClick={retry}>Opnieuw proberen</button><Link className="self-center text-sm underline" href="/admin/leadkwaliteit/review">Naar werklijst</Link></div></section>;
}
