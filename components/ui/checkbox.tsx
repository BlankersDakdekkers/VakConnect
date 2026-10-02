import type { InputHTMLAttributes } from "react";

export function Checkbox(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} type="checkbox" className="size-5 shrink-0 rounded border-border accent-primary" />;
}
