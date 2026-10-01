import type { Metadata } from "next";
import { dictionary as d } from "@/i18n";
import { Section } from "@/components/ui";

export const metadata: Metadata = { title: d.greenCity.title };

const DASHBOARD_URL = "https://greencity.hn/";

export default function GreenCityPage() {
  return (
    <>
      <Section title={d.greenCity.title}>
        <div className="space-y-4 text-lg leading-relaxed text-ink-muted">
          {d.greenCity.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Section>

      <Section title={d.greenCity.whatTitle}>
        <div className="space-y-4 text-ink text-lg">
          <p>{d.greenCity.what}</p>
          <p>
            {d.greenCity.dashboard.before}
            <a
              href={DASHBOARD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent underline underline-offset-2 hover:text-brand"
            >
              {d.greenCity.dashboard.link}
              <span aria-hidden="true" className="ml-0.5 inline-block text-[0.7em] align-super">
                ↗
              </span>
            </a>
            {d.greenCity.dashboard.after}
          </p>
        </div>
      </Section>
    </>
  );
}
