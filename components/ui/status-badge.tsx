import { Badge } from "@/components/ui/badge";

const variantClasses: Record<string, string> = {
  active: "border-success/20 bg-success/10 text-success",
  accepted: "border-success/20 bg-success/10 text-success",
  available: "border-success/20 bg-success/10 text-success",
  assigned: "border-primary/20 bg-primary/10 text-primary",
  matched: "border-primary/20 bg-primary/10 text-primary",
  new: "border-primary/20 bg-primary/10 text-primary",
  normal: "border-border bg-surface-muted text-foreground",
  paused: "border-accent/20 bg-amber-50 text-amber-700",
  pending: "border-accent/20 bg-amber-50 text-amber-700",
  qualified: "border-sky-200 bg-sky-50 text-sky-700",
  rejected: "border-danger/20 bg-red-50 text-danger",
  refunded: "border-sky-200 bg-sky-50 text-sky-700",
  purchased: "border-success/20 bg-success/10 text-success",
  shared: "border-indigo-200 bg-indigo-50 text-indigo-700",
  exclusive: "border-violet-200 bg-violet-50 text-violet-700",
  partially_sold: "border-sky-200 bg-sky-50 text-sky-700",
  sold_out: "border-border bg-slate-100 text-slate-700",
  unavailable: "border-danger/20 bg-red-50 text-danger",
  suspended: "border-danger/20 bg-red-50 text-danger",
  urgent: "border-danger/20 bg-red-50 text-danger",
  viewed: "border-sky-200 bg-sky-50 text-sky-700",
  won: "border-success/20 bg-success/10 text-success",
  lost: "border-border bg-slate-100 text-slate-700",
  closed: "border-border bg-slate-100 text-slate-700",
  inactive: "border-border bg-slate-100 text-slate-700",
  contacted: "border-sky-200 bg-sky-50 text-sky-700",
  appointment_scheduled: "border-indigo-200 bg-indigo-50 text-indigo-700",
  quote_sent: "border-violet-200 bg-violet-50 text-violet-700",
  verified: "border-success/20 bg-success/10 text-success",
  unverified: "border-border bg-slate-100 text-slate-700",
};

export function StatusBadge({ value }: Readonly<{ value: string }>) {
  return <Badge className={variantClasses[value] ?? "border-border bg-surface-muted text-foreground"}>{value}</Badge>;
}
