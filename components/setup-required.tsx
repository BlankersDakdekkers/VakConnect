import { Card } from "@/components/ui/card";

export function SetupRequired({ title, description }: Readonly<{ title: string; description: string }>) {
  return (
    <Card className="space-y-3 border-dashed bg-surface-muted/50">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  );
}
