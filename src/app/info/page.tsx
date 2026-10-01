import type { Metadata } from "next";
import { schedule } from "@/content/event";
import { dictionary as d } from "@/i18n";
import { Card, Section } from "@/components/ui";

export const metadata: Metadata = { title: d.info.scheduleTitle };

const days = schedule.reduce<Array<{ day: string; entries: typeof schedule }>>((acc, entry) => {
  const last = acc[acc.length - 1];
  if (last?.day === entry.day) last.entries.push(entry);
  else acc.push({ day: entry.day, entries: [entry] });
  return acc;
}, []);

export default function InfoPage() {
  return (
    <>
      <Section title={d.info.scheduleTitle}>
        <ol className="space-y-5">
          {days.map(({ day, entries }) => (
            <Card as="li" key={day}>
              <h3 className="font-mono text-lg font-semibold uppercase text-ink">{day}</h3>
              <ol className="mt-3 divide-y divide-line">
                {entries.map((entry, index) => (
                  <li
                    key={index}
                    className={`flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:gap-6 ${
                      entry.highlight ? "text-brand-strong" : ""
                    }`}
                  >
                    <span className="shrink-0 font-mono text-sm text-ink-muted sm:w-16">
                      {entry.time}
                    </span>
                    <div>
                      <p className="font-semibold text-ink">{entry.title}</p>
                      {entry.detail ? (
                        <p className="mt-0.5 text-sm text-ink-muted">{entry.detail}</p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
          ))}
        </ol>
      </Section>
    </>
  );
}
