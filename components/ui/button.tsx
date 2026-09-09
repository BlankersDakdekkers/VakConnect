import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "default" | "sm" | "lg";

export function buttonClassName({
  variant = "primary",
  size = "default",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center rounded-full font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-60",
    variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary/90",
    variant === "secondary" && "border border-border bg-surface text-foreground hover:bg-surface-muted",
    variant === "ghost" && "text-foreground hover:bg-surface-muted",
    variant === "danger" && "bg-danger text-white hover:bg-danger/90",
    size === "default" && "min-h-11 px-5 text-sm",
    size === "sm" && "min-h-9 px-4 text-sm",
    size === "lg" && "min-h-12 px-6 text-base",
    className,
  );
}

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

type ButtonProps = BaseProps &
  (
    | ({ as?: "button" } & ButtonHTMLAttributes<HTMLButtonElement>)
    | { as: "link"; href: string }
  );

export function Button(props: ButtonProps) {
  const { children, variant, size, className } = props;
  const classes = buttonClassName({ variant, size, className });

  if (props.as === "link") {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button {...props} className={classes}>
      {children}
    </button>
  );
}
