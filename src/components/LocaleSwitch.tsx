"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, localeNames, type Locale } from "@/i18n/config";

/**
 * Swaps the locale segment of the current path and remembers the choice, so a
 * visitor who picks English is not sent back to German on the next visit.
 */
export function LocaleSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: Locale) {
    if (next === locale) return;
    document.cookie = `hacksite_locale=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    const rest = pathname.replace(new RegExp(`^/(${locales.join("|")})`), "");
    router.push(`/${next}${rest || ""}`);
    router.refresh();
  }

  return (
    <div
      className="flex items-center rounded-lg border border-line p-0.5"
      role="group"
      aria-label="Language"
    >
      {locales.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => switchTo(item)}
          aria-current={item === locale ? "true" : undefined}
          title={localeNames[item]}
          className={
            item === locale
              ? "rounded-md bg-brand px-2 py-1 text-xs font-semibold uppercase text-white"
              : "rounded-md px-2 py-1 text-xs font-semibold uppercase text-ink-muted hover:text-ink"
          }
        >
          {item}
        </button>
      ))}
    </div>
  );
}
