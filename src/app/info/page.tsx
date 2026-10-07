import type { Metadata } from "next";
import { schedule } from "@/content/event";
import { dictionary as d } from "@/i18n";
import { Section } from "@/components/ui";
import { ScheduleCard } from "@/components/ScheduleCard";

export const metadata: Metadata = { title: d.info.scheduleTitle };

export default function InfoPage() {
  return (
    <>
      <Section title={d.info.scheduleTitle}>
        <ol className="space-y-5">
          {schedule.map((day) => (
            <ScheduleCard key={day.day} day={day} />
          ))}
        </ol>
      </Section>
    </>
  );
}
