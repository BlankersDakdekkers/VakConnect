import Link from "next/link";
export default function QualityReviewNotFound() {
  return <section className="rounded-3xl border bg-surface p-5"><h2 className="text-xl font-semibold">Lead niet beschikbaar</h2><p className="mt-2 text-sm">Deze lead bestaat niet of is niet beschikbaar voor onderzoek.</p><Link className="mt-4 inline-block text-sm underline" href="/admin/leadkwaliteit/review">Terug naar de werklijst</Link></section>;
}
