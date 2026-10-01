"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { Dictionary } from "@/i18n";

export function MobileNav({
  items,
  d,
}: {
  items: Array<{ href: string; label: string }>;
  d: Dictionary;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close when navigating, otherwise the panel survives the route change.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={d.nav.home}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {open ? (
        <div className="absolute inset-x-0 top-20 border-b border-line bg-surface shadow-lg">
          <nav className="container-page flex flex-col py-3" aria-label="Main">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-3 text-base font-medium text-ink hover:bg-surface-muted"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </div>
  );
}
