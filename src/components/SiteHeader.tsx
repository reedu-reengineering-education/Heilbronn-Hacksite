import Link from "next/link";
import type { Dictionary } from "@/i18n";
import { MobileNav } from "./MobileNav";
import { Logo } from "./Logo";

export function navItems(d: Dictionary) {
  return [
    { href: "/info", label: d.nav.info },
    { href: "/topics", label: d.nav.topics },
    { href: "/resources", label: d.nav.resources },
    { href: "/mentors-jury", label: d.nav.mentors },
    { href: "/teams", label: d.nav.teams },
    { href: "/green-city", label: d.nav.greenCity },
  ];
}

export function SiteHeader({ d }: { d: Dictionary }) {
  const items = navItems(d);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/85 backdrop-blur">
      <div className="container-page flex h-20 items-center gap-4">
        <Link href="/" className="flex h-14 shrink-0 items-center">
          <Logo className="h-full w-auto" />
        </Link>

        <nav aria-label="Main" className="hidden flex-1 items-center justify-evenly md:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 font-mono text-sm uppercase tracking-wide text-ink-muted transition-colors hover:bg-surface-muted hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <MobileNav items={items} d={d} />
        </div>
      </div>
    </header>
  );
}
