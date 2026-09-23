import type { Metadata } from "next";
import { schedule } from "@/content/event";
import { dictionary as d } from "@/i18n";
import { Section } from "@/components/ui";

export const metadata: Metadata = { title: d.info.title };

export default function InfoPage() {
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
                <span className="font-semibold text-ink">{entry.day}</span>
                <span>{entry.time}</span>
              </div>
              <div>
                <p className="font-semibold text-ink">{entry.title}</p>
                {entry.detail ? (
                  <p className="mt-0.5 text-sm text-ink-muted">{entry.detail}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
