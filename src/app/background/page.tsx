import type { Metadata } from "next";
import { dictionary as d } from "@/i18n";
import { Section } from "@/components/ui";

export const metadata: Metadata = { title: d.background.title };

const DASHBOARD_URL = "https://greencity.hn/";

export default function BackgroundPage() {
  return (
    <>
      <Section title={d.background.title}>
        <div className="space-y-4 text-lg leading-relaxed">
          {d.background.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Section>

      <Section title={d.background.whatTitle}>
        <div className="space-y-4 text-lg leading-relaxed">
          <p>{d.background.what}</p>
          <p>
            {d.background.dashboard.before}
            <a
              href={DASHBOARD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent underline underline-offset-2 hover:text-brand"
            >
              {d.background.dashboard.link}
              <span aria-hidden="true" className="ml-0.5 inline-block text-[0.7em] align-super">
                ↗
              </span>
            </a>
            {d.background.dashboard.after}
          </p>
        </div>
      </Section>
    </>
  );
}
