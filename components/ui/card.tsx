import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div {...props} className={cn("min-w-0 rounded-lg border bg-surface p-5 shadow-[var(--shadow-soft)] sm:p-6", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children }: Readonly<{ children: ReactNode }>) {
  return <h2 className="text-lg font-semibold tracking-tight">{children}</h2>;
}
