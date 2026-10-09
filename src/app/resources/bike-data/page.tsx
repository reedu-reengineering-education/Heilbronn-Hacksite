import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { BIKE_API_URL, bikeGuide as g } from "@/content/bike-guide";
import { Section } from "@/components/ui";

export const metadata: Metadata = { title: g.title };

const codeClass = "rounded bg-surface-sunken px-1.5 py-0.5 font-mono text-[0.85em] text-ink";
const linkClass = "font-semibold text-accent underline underline-offset-2 hover:text-brand";
const subheading = "font-mono text-sm font-semibold uppercase tracking-wide text-ink";

/** Renders `code`, **bold** and [links](https://…) inside a content string. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/).map((part, i) => {
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link)
          return (
            <a key={i} href={link[2]} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {link[1]} ↗
            </a>
          );
        if (part.startsWith("`")) return <code key={i} className={codeClass}>{part.slice(1, -1)}</code>;
        if (part.startsWith("**")) return <strong key={i} className="font-semibold text-ink">{part.slice(2, -2)}</strong>;
        return part;
      })}
    </>
  );
}

/** A full-width table that scrolls sideways on narrow screens instead of the page. */
function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-card border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-muted font-mono text-xs uppercase tracking-wide text-ink-muted">
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line align-top text-ink-muted">{children}</tbody>
      </table>
    </div>
  );
}

const td = "px-4 py-3";

/** A subsection that starts closed; the arrow turns when it's open. */
function Collapsible({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="group mt-10">
      <summary className={`cursor-pointer font-mono text-lg font-semibold uppercase tracking-wide text-ink sm:text-xl select-none list-none hover:text-accent [&::-webkit-details-marker]:hidden`}>
        <span aria-hidden className="mr-2 inline-block transition-transform group-open:rotate-90">
          ▸
        </span>
        {title}
      </summary>
      {children}
    </details>
  );
}

export default function BikeDataPage() {
  return (
    <>
      <Section title={g.title} className="pb-0">
        <Link href="/resources" className="font-mono text-sm uppercase tracking-wide text-ink-muted hover:text-accent">
          ← Back to material
        </Link>
        <div className="mt-6 max-w-3xl space-y-4 text-lg leading-relaxed">
          {g.intro.map((p, i) => (
            <div key={p} className="space-y-4">
              <p>
                <Rich text={p} />
              </p>
              {/* The campaigns table follows the paragraph about the campaigns. */}
              {i === 1 ? (
                <div className="max-w-xl">
                  <Table head={["Tag", "City"]}>
                    {g.campaigns.map((c) => (
                      <tr key={c.tag}>
                        <td className={td}>
                          <code className={codeClass}>{c.tag}</code>
                        </td>
                        <td className={td}>{c.city}</td>
                      </tr>
                    ))}
                  </Table>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </Section>

      <Section title={g.apiTitle} className="pb-0 pt-0 sm:pt-0">
        <p className="text-lg">
          Base URL:{" "}
          <a href={`${BIKE_API_URL}/collections`} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {BIKE_API_URL}
          </a>
        </p>
        <div className="mt-6">
          <Table head={["Endpoint", "What you get"]}>
            {g.endpoints.map((ep) => (
              <tr key={ep.path}>
                <td className={`${td} whitespace-nowrap`}>
                  <code className={codeClass}>{ep.path}</code>
                </td>
                <td className={td}>
                  <Rich text={ep.what} />
                </td>
              </tr>
            ))}
          </Table>
        </div>

        <h3 className={`mt-10 ${subheading}`}>{g.paramsTitle}</h3>
        <div className="mt-3">
          <Table head={["Parameter", "Default", "Meaning"]}>
            {g.params.map((p) => (
              <tr key={p.name}>
                <td className={td}>
                  <code className={codeClass}>{p.name}</code>
                </td>
                <td className={td}>
                  <code className={codeClass}>{p.default}</code>
                </td>
                <td className={td}>
                  <Rich text={p.meaning} />
                </td>
              </tr>
            ))}
          </Table>
        </div>

        <Collapsible title={g.examplesTitle}>
          <ul className="mt-3 space-y-3">
            {g.examples.map((ex) => (
              <li key={ex.path} className="text-sm leading-snug">
                <a
                  href={`${BIKE_API_URL}${ex.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all font-mono text-brand-strong underline-offset-4 hover:underline"
                >
                  {ex.path} ↗
                </a>
                <span className="block text-ink-muted">
                  <Rich text={ex.what} />
                </span>
              </li>
            ))}
          </ul>
        </Collapsible>
      </Section>

      <Section title={g.datasetsTitle} className="pb-0 pt-0 sm:pt-0">
        <p className="max-w-3xl text-lg leading-relaxed">
          <Rich text={g.datasetsLead} />
        </p>
        <div className="mt-6">
          <Table head={["Dataset", "Geometry", "One row =", "Key fields", "How it's calculated"]}>
            {g.datasets.map((ds) => (
              <tr key={ds.name}>
                <td className={`${td} whitespace-nowrap`}>
                  <code className={codeClass}>{ds.name}</code>
                </td>
                <td className={td}>{ds.geometry}</td>
                <td className={td}>{ds.row}</td>
                <td className={`${td} min-w-48`}>
                  <span className="flex flex-wrap gap-1">
                    {ds.fields.map((f) => (
                      <code key={f} className={codeClass}>
                        {f}
                      </code>
                    ))}
                  </span>
                </td>
                <td className={`${td} min-w-72`}>
                  <Rich text={ds.how} />
                </td>
              </tr>
            ))}
          </Table>
        </div>
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          {g.links.map((link) => (
            <li key={link.url}>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {link.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
