"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function SubmitButton({
  children,
  pendingLabel = "Opslaan...",
  ...props
}: Readonly<React.ComponentProps<typeof Button> & { pendingLabel?: string }>) {
  const { pending } = useFormStatus();

  return (
    <Button {...props} aria-disabled={pending} disabled={pending || props.disabled}>
      {pending ? pendingLabel : children}
    </Button>
  );
}
