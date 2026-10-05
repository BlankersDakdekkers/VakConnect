export default function ProfessionalLoading() {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className="space-y-6">
      <span className="sr-only">Je vakmanomgeving wordt geladen.</span>
      <div className="h-8 w-48 animate-pulse rounded-lg bg-surface-muted" />
      <div className="h-40 animate-pulse rounded-3xl bg-surface-muted" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-32 animate-pulse rounded-3xl bg-surface-muted" />
        <div className="h-32 animate-pulse rounded-3xl bg-surface-muted" />
      </div>
    </div>
  );
}
