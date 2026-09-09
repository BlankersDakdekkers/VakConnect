"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

type SubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "default" | "sm" | "lg";
  className?: string;
  disabled?: boolean;
};

export function SubmitButton({ children, pendingLabel = "Opslaan...", disabled, ...props }: Readonly<SubmitButtonProps>) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" {...props} aria-disabled={pending} disabled={pending || disabled}>
      {pending ? pendingLabel : children}
    </Button>
  );
}
