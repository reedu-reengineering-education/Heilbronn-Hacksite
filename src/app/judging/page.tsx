import type { Metadata } from "next";
import { dictionary as d } from "@/i18n";
import { Card, Section } from "@/components/ui";

export const metadata: Metadata = { title: d.judging.title };

/** "01", "02", … */
const number = (index: number) => String(index + 1).padStart(2, "0");

export default function JudgingPage() {
  return (
    <>
      <Section title={d.judging.title} lead={d.judging.lead} className="pb-4 sm:pb-6">
        <h3 className="font-mono text-xl font-semibold uppercase tracking-tight text-ink">
          {d.judging.processTitle}
        </h3>
        <ol className="mt-5 grid gap-5 sm:grid-cols-3">
          {d.judging.steps.map((step, index) => (
            <Card as="li" key={step.name}>
              <span className="font-mono text-sm text-accent">{index + 1} /</span>
              <h4 className="mt-1 font-mono text-lg font-semibold uppercase tracking-tight text-ink">
                {step.name}
              </h4>
              <p className="mt-2 text-ink-muted">{step.description}</p>
            </Card>
          ))}
        </ol>
      </Section>

      <Section
        title={d.judging.criteriaTitle}
        lead={d.judging.criteriaLead}
        className="pt-4 sm:pt-6"
      >
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {d.judging.criteria.map((criterion, index) => (
            <Card as="li" key={criterion.name}>
              <span className="font-mono text-4xl font-semibold text-accent">{number(index)}</span>
              <h3 className="mt-2 font-mono text-lg font-semibold uppercase tracking-tight text-ink">
                {criterion.name}
              </h3>
              <p className="mt-2 text-ink-muted">{criterion.description}</p>
            </Card>
          ))}
        </ol>
      </Section>
    </>
  );
}
