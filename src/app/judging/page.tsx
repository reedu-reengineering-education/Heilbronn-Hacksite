import type { Metadata } from "next";
import { dictionary as d } from "@/i18n";
import { Card, Section } from "@/components/ui";

export const metadata: Metadata = { title: d.judging.title };

/** "01", "02", … */
const number = (index: number) => String(index + 1).padStart(2, "0");

const linkClass = "font-semibold text-accent underline underline-offset-2 hover:text-brand";

function ExternalMark() {
  return (
    <span aria-hidden="true" className="ml-0.5 inline-block text-[0.7em] align-super">
      ↗
    </span>
  );
}

export default function JudgingPage() {
  return (
    <>
      <Section title={d.judging.title} lead={d.judging.lead} className="pb-4 sm:pb-6">
        <h3 className="font-mono text-xl font-semibold uppercase tracking-tight text-ink">
          {d.judging.timetableTitle}
        </h3>
        <Card className="mt-5 p-0">
          <ol className="divide-y divide-line">
            {d.judging.timetable.map((entry) => (
              <li key={entry.name} className="flex flex-col gap-1 p-5 sm:flex-row sm:gap-6">
                <time className="shrink-0 font-mono text-lg font-semibold text-accent sm:w-44">
                  {entry.time}
                </time>
                <div>
                  <h4 className="font-mono text-lg font-semibold uppercase tracking-tight text-ink">
                    {entry.name}
                  </h4>
                  <p className="mt-1 text-ink-muted">{entry.description}</p>
                  {entry.github ? (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {entry.github.map((handle) => (
                        <li key={handle}>
                          <a
                            href={`https://github.com/${handle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex rounded-full border border-line px-3 py-1 font-mono text-sm text-ink hover:border-accent hover:text-accent"
                          >
                            @{handle}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {entry.highlight ? (
                    <p className="mt-3 rounded-lg border-l-4 border-accent bg-accent/10 px-4 py-3 font-semibold text-ink">
                      {entry.highlight}
                    </p>
                  ) : null}
                  {entry.note ? (
                    <p className="mt-3 text-ink-muted">
                      {entry.note}{" "}
                      <a href="#licenses" className={linkClass}>
                        {d.judging.licensesTitle} ↓
                      </a>
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </Section>

      <Section
        title={d.judging.criteriaTitle}
        lead={d.judging.criteriaLead}
        className="py-4 sm:py-6"
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

      <Section
        id="licenses"
        title={d.judging.licensesTitle}
        lead={d.judging.licensesLead}
        className="scroll-mt-24 pt-4 sm:pt-6"
      >
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {d.judging.licenses.map((license) => (
            <Card as="li" key={license.name}>
              <h3 className="font-mono text-lg font-semibold uppercase tracking-tight">
                <a href={license.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {license.name}
                  <ExternalMark />
                </a>
              </h3>
              <p className="mt-2 text-ink-muted">{license.description}</p>
            </Card>
          ))}
        </ul>
        <p className="mt-6 text-ink-muted">
          {d.judging.licensesHelp.before}
          <a href="https://choosealicense.com/" target="_blank" rel="noopener noreferrer" className={linkClass}>
            {d.judging.licensesHelp.link}
            <ExternalMark />
          </a>
          {d.judging.licensesHelp.after}
        </p>
      </Section>
    </>
  );
}
