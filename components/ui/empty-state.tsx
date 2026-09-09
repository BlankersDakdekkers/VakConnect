import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function EmptyState({ title, description, action }: Readonly<{ title: string; description: string; action?: ReactNode }>) {
  return (
    <Card className="space-y-3 text-center">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
      {action ? <div className="flex justify-center">{action}</div> : null}
    </Card>
  );
}
