type FaqItem = Readonly<{
  question: string;
  answer: string;
}>;

export function FaqList({ items }: Readonly<{ items: FaqItem[] }>) {
  return (
    <div className="max-w-4xl space-y-3">
      {items.map((item) => (
        <details key={item.question} className="group rounded-2xl border bg-surface px-5">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 [&::-webkit-details-marker]:hidden">
            <span>{item.question}</span>
            <span aria-hidden="true" className="shrink-0 text-xl font-normal text-primary transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="max-w-prose pb-5 pr-8 text-sm leading-7 text-muted-foreground">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
