import type { Metadata } from "next";
import "./globals.css";
import { buildMetadata } from "@/lib/config/site";

export const metadata: Metadata = buildMetadata();

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl">
      <body className="min-h-screen bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
