import Link from "next/link";
import { buttonClassName } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md space-y-4 rounded-3xl border bg-surface p-8 text-center shadow-sm">
        <p className="text-sm font-medium text-primary">404</p>
        <h1 className="text-3xl font-semibold tracking-tight">Pagina niet gevonden</h1>
        <p className="text-sm text-muted-foreground">
          De pagina die je zoekt bestaat niet of is verplaatst.
        </p>
        <Link href="/" className={buttonClassName({ variant: "primary" })}>
          Terug naar de homepage
        </Link>
      </div>
    </div>
  );
}
