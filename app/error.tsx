"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    void error;
  }, [error]);

  return (
    <html lang="nl">
      <body>
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="max-w-md space-y-4 rounded-3xl border bg-surface p-8 text-center shadow-sm">
            <p className="text-sm font-medium text-primary">Er ging iets mis</p>
            <h1 className="text-3xl font-semibold tracking-tight">Probeer het opnieuw</h1>
            <p className="text-sm text-muted-foreground">
              De pagina kon niet correct worden geladen. Probeer het opnieuw of ga terug naar de homepage.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button type="button" onClick={reset}>
                Opnieuw proberen
              </Button>
              <Button as="link" href="/" variant="secondary">
                Naar homepage
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
