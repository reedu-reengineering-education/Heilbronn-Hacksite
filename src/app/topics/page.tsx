import type { Metadata } from "next";
import { topics } from "@/content/topics";
import { dictionary as d } from "@/i18n";
import { Section } from "@/components/ui";
import { TopicRings } from "@/components/TopicRings";

export const metadata: Metadata = { title: d.topics.title };

export default function TopicsPage() {
  const rings = topics.map(({ id, color }) => ({
    id,
    color,
    ...d.topics.items[id],
  }));

  return (
    <>
      <Section title={d.topics.title} lead={d.topics.lead} className="pb-4 sm:pb-6">
        <TopicRings topics={rings} flipHint={d.topics.flipHint} flipBack={d.topics.flipBack} />
        <div className="mt-10 space-y-4 text-lg leading-relaxed text-ink-muted">{d.topics.source}</div>
      </Section>

      <Section
        title={d.topics.solutionsTitle}
        lead={d.topics.solutionsLead}
        className="pt-4 sm:pt-6"
      >
        <ul className="list-inside list-disc space-y-1.5 text-ink marker:text-accent">
          {d.topics.solutions.map((solution) => (
            <li key={solution}>{solution}</li>
          ))}
        </ul>
        <p className="mt-6 font-mono text-sm text-ink-muted">{d.topics.otherIdea}</p>
      </Section>
    </>
  );
}
