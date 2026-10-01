import type { Metadata } from "next";
import { dictionary as d } from "@/i18n";
import { Section } from "@/components/ui";

export const metadata: Metadata = { title: d.footer.privacy };

export default function PrivacyPage() {
  return (
    <Section title={d.footer.privacy}>
      <div className="max-w-2xl space-y-4 text-ink-muted">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur. Excepteur sint occaecat cupidatat non proident.
        </p>
      </div>
    </Section>
  );
}
