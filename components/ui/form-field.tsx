import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function FormField({
  id,
  label,
  description,
  error,
  children,
  className,
  group = false,
}: Readonly<{
  id: string;
  label: string;
  description?: string;
  error?: string;
  children: ReactNode;
  className?: string;
  group?: boolean;
}>) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;
  const content = (
    <>
      {description ? <p id={descriptionId} className="text-sm leading-6 text-muted-foreground">{description}</p> : null}
      {group ? children : Children.map(children, (child) => {
        if (!isValidElement<{ id?: string; "aria-describedby"?: string; "aria-invalid"?: boolean }>(child) || child.props.id !== id) {
          return child;
        }
        return cloneElement(child, {
          "aria-describedby": [child.props["aria-describedby"], describedBy].filter(Boolean).join(" ") || undefined,
          "aria-invalid": error ? true : child.props["aria-invalid"],
        });
      })}
      {error ? <p id={errorId} role="alert" className="text-sm font-medium text-danger">{error}</p> : null}
    </>
  );

  if (group) {
    return (
      <fieldset className={cn("min-w-0 space-y-2", className)} aria-describedby={describedBy} aria-invalid={error ? true : undefined}>
        <legend className="mb-2 text-sm font-medium text-foreground">{label}</legend>
        {content}
      </fieldset>
    );
  }

  return (
    <div className={cn("min-w-0 space-y-2", className)}>
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      {content}
    </div>
  );
}
