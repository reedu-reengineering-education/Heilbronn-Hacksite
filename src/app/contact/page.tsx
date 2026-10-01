import type { Metadata } from "next";
import { dictionary as d } from "@/i18n";
import { Section } from "@/components/ui";

export const metadata: Metadata = { title: d.footer.contact };

export default function ContactPage() {
  return (
    <Section title={d.footer.contact}>
      <div className="max-w-2xl space-y-4 text-ink-muted">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua.
        </p>
        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
          ea commodo consequat.
        </p>
      </div>
    </Section>
  );
}
