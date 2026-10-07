import type { Metadata } from "next";
import { furtherReading, hardware, software, type ResourceItem } from "@/content/resources";
import { dataSources } from "@/content/data";
import { dictionary as d } from "@/i18n";
import { Section } from "@/components/ui";
import { DataCard } from "@/components/DataCard";
import { FlipCard } from "@/components/FlipCard";

export const metadata: Metadata = { title: d.resources.title };

function DataGrid() {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {dataSources.map((item) => (
        <DataCard key={item.name} item={item} />
      ))}
    </ul>
  );
}

function FlipGrid({ items }: { items: ResourceItem[] }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <FlipCard key={item.name} item={item} />
      ))}
    </ul>
  );
}

export default function ResourcesPage() {
  return (
    <>
      <Section title={d.resources.dataTitle} className="pt-0">
        <DataGrid />
      </Section>

      <Section title={d.resources.hardwareTitle}>
        <FlipGrid items={hardware} />
      </Section>

      <Section title={d.resources.softwareTitle}>
        <FlipGrid items={software} />
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
