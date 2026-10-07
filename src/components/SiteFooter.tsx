import Link from "next/link";
import { event, organisations } from "@/content/event";
import type { Dictionary } from "@/i18n";

export function SiteFooter({ d }: { d: Dictionary }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-line bg-surface-sunken">
      <div className="container-page flex flex-col items-center gap-8 py-12">
        <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {organisations.map((org) => (
            <li key={org.name}>
              <a
                href={org.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={org.name}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={org.logo} alt={org.name} className="h-10 w-auto" />
              </a>
            </li>
          ))}
        </ul>

        <nav
          aria-label="Footer"
          className="flex gap-8 font-mono text-sm uppercase tracking-wide"
        >
          <Link href="/imprint" className="text-ink-muted hover:text-accent">
            {d.footer.imprint}
          </Link>
          <Link href="/privacy" className="text-ink-muted hover:text-accent">
            {d.footer.privacy}
          </Link>
        </nav>

        <p className="w-full border-t border-line pt-6 text-center font-mono text-xs text-ink-muted">
          © {year} {event.legal.organisation}. {d.footer.rights}
        </p>
      </div>
    </footer>
  );
}
