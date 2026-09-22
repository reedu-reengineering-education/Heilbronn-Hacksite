import type { Metadata } from "next";
import { event, faq, schedule } from "@/content/event";
import { getDictionary } from "@/i18n";
import { isLocale, type Locale } from "@/i18n/config";
import { ButtonLink, Card, Section } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: getDictionary(isLocale(locale) ? locale : "de").info.title };
}

export default async function InfoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "de") as Locale;
  const d = getDictionary(locale);

  return (
    <>
      <Section title={d.info.scheduleTitle} className="bg-surface-sunken">
        <ol className="space-y-3">
          {schedule.map((entry, index) => (
            <li
              key={index}
              className={`flex flex-col gap-1 rounded-card border-l-4 bg-surface p-4 sm:flex-row sm:items-baseline sm:gap-6 ${
                entry.highlight ? "border-brand" : "border-line"
              }`}
            >
              <div className="flex shrink-0 gap-3 font-mono text-sm text-ink-muted sm:w-32">
                <span className="font-semibold text-ink">{entry.day[locale]}</span>
                <span>{entry.time}</span>
              </div>
              <div>
                <p className="font-semibold text-ink">{entry.title[locale]}</p>
                {entry.detail ? (
                  <p className="mt-0.5 text-sm text-ink-muted">{entry.detail[locale]}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
