"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { publicNavigation } from "@/lib/content/public-navigation";

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <div className="relative lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        onClick={() => setIsOpen((open) => !open)}
        className="flex min-h-11 items-center rounded-full border border-border bg-surface px-4 text-sm font-medium transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        {isOpen ? "Sluit menu" : "Menu"}
      </button>
      <nav
        id="mobile-navigation"
        aria-label="Mobiele navigatie"
        className={`${isOpen ? "grid" : "hidden"} absolute right-0 top-[calc(100%+0.75rem)] z-50 min-w-64 gap-1 rounded-2xl border bg-surface p-2 text-sm shadow-lg`}
      >
        {publicNavigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={closeMenu}
            className="flex min-h-11 items-center rounded-xl px-3 text-foreground transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            {item.label}
          </Link>
        ))}
        <Link href="/aanmelden-vakman" onClick={closeMenu} className="flex min-h-11 items-center rounded-xl px-3 text-foreground transition hover:bg-surface-muted">
          Aanmelden als vakman
        </Link>
        <Link href="/login" onClick={closeMenu} className="flex min-h-11 items-center rounded-xl px-3 text-foreground transition hover:bg-surface-muted">
          Inloggen
        </Link>
      </nav>
    </div>
  );
}
