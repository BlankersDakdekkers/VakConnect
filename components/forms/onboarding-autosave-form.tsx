"use client";

import { useRef, useState, useTransition } from "react";
import type { ReactNode } from "react";
import { autosaveProfessionalOnboardingStepAction } from "@/lib/professionals/actions";
import { cn } from "@/lib/utils";

export function OnboardingAutosaveForm({
  action,
  children,
  className,
}: Readonly<{
  action: (formData: FormData) => void;
  children: ReactNode;
  className?: string;
}>) {
  const formRef = useRef<HTMLFormElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [status, setStatus] = useState<string>("Autosave actief");
  const [isPending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      action={action}
      className={cn("space-y-4", className)}
      onChange={(event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement)) {
          return;
        }
        if (target instanceof HTMLInputElement && target.type === "file") {
          return;
        }
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        setStatus("Wijzigingen worden opgeslagen...");
        timerRef.current = setTimeout(() => {
          if (!formRef.current) return;
          startTransition(async () => {
            const result = await autosaveProfessionalOnboardingStepAction(new FormData(formRef.current!));
            setStatus(result.ok ? "Wijzigingen opgeslagen" : result.message ?? "Autosave mislukt");
          });
        }, 800);
      }}
    >
      <p className="text-xs text-muted-foreground">{isPending ? "Autosave bezig..." : status}</p>
      {children}
    </form>
  );
}
