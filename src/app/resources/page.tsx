import type { Metadata } from "next";
import { furtherReading, hardware, software, type ResourceItem } from "@/content/resources";
import { dictionary as d } from "@/i18n";
import { Badge, Card, Section } from "@/components/ui";

export const metadata: Metadata = { title: d.resources.title };

function ResourceGrid({ items }: { items: ResourceItem[] }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2">
      {items.map((item) => (
        <Card as="li" key={item.name} className="flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold text-ink">{item.name}</h3>
            {item.badge ? <Badge tone="brand">{item.badge}</Badge> : null}
          </div>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
            {item.summary}
          </p>
          {item.links.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
              {item.links.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-brand-strong underline-offset-4 hover:underline"
                  >
                    {link.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </Card>
      ))}
    </ul>
  );
}

export default function ResourcesPage() {
  return (
    <>
      <Section title={d.resources.hardwareTitle} className="pt-0">
        <ResourceGrid items={hardware} />
      </Section>

      <Section title={d.resources.softwareTitle} className="bg-surface-sunken">
        <ResourceGrid items={software} />
      </Section>

      <Section title={d.resources.linksTitle}>
        <ul className="max-w-2xl divide-y divide-line rounded-card border border-line">
          {furtherReading.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-surface-muted"
              >
                <span className="font-medium text-ink">{link.label}</span>
                <span aria-hidden className="text-ink-muted">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
