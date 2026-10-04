"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { publicNavigation } from "@/lib/content/public-navigation";

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <div
      ref={menuRef}
      className="relative xl:hidden"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Menu sluiten" : "Menu openen"}
        className="flex size-11 items-center justify-center rounded-sm border bg-surface transition-colors hover:bg-surface-muted"
      >
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          {isOpen ? <path d="m5 5 10 10M15 5 5 15" /> : <path d="M3 5h14M3 10h14M3 15h14" />}
        </svg>
      </button>
      <nav
        id="mobile-navigation"
        aria-label="Mobiele navigatie"
        className={`${isOpen ? "grid" : "hidden"} absolute right-0 top-[calc(100%+0.75rem)] z-50 max-h-[calc(100dvh-6rem)] w-72 max-w-[calc(100vw-2rem)] gap-1 overflow-y-auto rounded-lg border bg-surface p-2 text-sm shadow-[var(--shadow-soft)]`}
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
