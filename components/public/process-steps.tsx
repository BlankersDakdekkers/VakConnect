type ProcessStep = Readonly<{
  title: string;
  description: string;
}>;

export function ProcessSteps({
  steps,
  columns = 3,
}: Readonly<{ steps: ProcessStep[]; columns?: 3 | 4 }>) {
  return (
    <ol className={`grid gap-4 sm:grid-cols-2 ${columns === 4 ? "xl:grid-cols-4" : "lg:grid-cols-3"}`}>
      {steps.map((step, index) => (
        <li key={step.title} className="rounded-2xl border bg-surface p-5">
          <span
            aria-hidden="true"
            className="mb-4 flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
          >
            {index + 1}
          </span>
          <h3 className="text-lg font-semibold tracking-tight">{step.title}</h3>
          <p className="mt-2 max-w-prose text-sm leading-6 text-muted-foreground">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
