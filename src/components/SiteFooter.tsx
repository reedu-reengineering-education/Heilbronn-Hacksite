import Link from "next/link";
import { event } from "@/content/event";
import type { Dictionary } from "@/i18n";
import { Logo } from "./Logo";

export function SiteFooter({ d }: { d: Dictionary }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-line bg-surface-sunken">
      <div className="container-page py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <Logo className="h-7 w-7" />
              <span className="font-semibold text-ink">{event.name}</span>
            </div>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm sm:flex sm:flex-col">
            <Link href="/info" className="text-ink-muted hover:text-ink">
              {d.nav.info}
            </Link>
            <Link href="/resources" className="text-ink-muted hover:text-ink">
              {d.nav.resources}
            </Link>
            <a href={`mailto:${event.contact.email}`} className="text-ink-muted hover:text-ink">
              {d.footer.contact}
            </a>
          </nav>
        </div>

        <p className="mt-10 border-t border-line pt-6 text-xs text-ink-muted">
          © {year} {event.legal.organisation}. {d.footer.rights}
        </p>
      </div>
    </footer>
  );
}
