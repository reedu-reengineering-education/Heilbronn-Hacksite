import Link from "next/link";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { LocaleSwitch } from "./LocaleSwitch";
import { MobileNav } from "./MobileNav";
import { Logo } from "./Logo";

export function navItems(locale: Locale, d: Dictionary) {
  return [
    { href: `/${locale}/info`, label: d.nav.info },
    { href: `/${locale}/resources`, label: d.nav.resources },
    { href: `/${locale}/games`, label: d.nav.games },
  ];
}

/**
 * No team sign-in/sign-up here on purpose: that prompt lives on /games, right
 * where it's needed, instead of as a permanent header fixture.
 */
export function SiteHeader({ locale, d }: { locale: Locale; d: Dictionary }) {
  const items = navItems(locale, d);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/85 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-4">
        <Link
          href={`/${locale}`}
          className="flex shrink-0 items-center gap-2.5 font-semibold tracking-tight text-ink"
        >
          <Logo className="h-8 w-8" />
          <span className="hidden sm:inline">{d.meta.title}</span>
        </Link>

        <nav aria-label="Main" className="ml-auto hidden items-center gap-1 md:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <LocaleSwitch locale={locale} />
          <MobileNav items={items} d={d} />
        </div>
      </div>
    </header>
  );
}
