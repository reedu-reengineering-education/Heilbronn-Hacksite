import type { Metadata } from "next";
import { furtherReading, hardware, software, type ResourceItem } from "@/content/resources";
import { getDictionary } from "@/i18n";
import { isLocale, type Locale } from "@/i18n/config";
import { Badge, Card, Section } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: getDictionary(isLocale(locale) ? locale : "de").resources.title };
}

function ResourceGrid({ items, locale }: { items: ResourceItem[]; locale: Locale }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2">
      {items.map((item) => (
        <Card as="li" key={item.name} className="flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold text-ink">{item.name}</h3>
            {item.badge ? <Badge tone="brand">{item.badge[locale]}</Badge> : null}
          </div>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
            {item.summary[locale]}
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
                    {link.label[locale]} ↗
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

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "de") as Locale;
  const d = getDictionary(locale);

  return (
    <>
      <Section title={d.resources.hardwareTitle} className="pt-0">
        <ResourceGrid items={hardware} locale={locale} />
      </Section>

      <Section title={d.resources.softwareTitle} className="bg-surface-sunken">
        <ResourceGrid items={software} locale={locale} />
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
                <span className="font-medium text-ink">{link.label[locale]}</span>
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
