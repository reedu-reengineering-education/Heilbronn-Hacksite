import type { Metadata } from "next";
import type { ReactNode } from "react";
import { dictionary as d } from "@/i18n";
import { Section } from "@/components/ui";

export const metadata: Metadata = { title: d.footer.privacy };

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="font-mono text-sm font-semibold uppercase tracking-wide text-ink">{title}</h3>
      {children}
    </div>
  );
}

const link = "text-accent hover:underline";

export default function PrivacyPage() {
  return (
    <Section title={d.footer.privacy}>
      <div className="max-w-2xl space-y-8 text-ink-muted">
        <Block title="1) Information on the collection of personal data and contact details of the controller">
          <p>
            1.1 We are pleased that you are visiting our website and thank you for your interest.
            In the following, we inform you about how we handle your personal data when you use our
            website. Personal data is any data by which you can be personally identified.
          </p>
          <p>
            1.2 The controller responsible for data processing on this website within the meaning
            of the General Data Protection Regulation (GDPR) is Reedu GmbH &amp; Co. KG,
            Johann-Krane-Weg 23, 48149 Münster, Germany, Tel.: +49 (0) 251 98119797, Email:{" "}
            <a href="mailto:kontakt@reedu.de" className={link}>
              kontakt@reedu.de
            </a>
            . The controller responsible for the processing of personal data is the natural or
            legal person who, alone or jointly with others, determines the purposes and means of
            the processing of personal data.
          </p>
          <p>
            1.3 For security reasons and to protect the transmission of personal data and other
            confidential content (e.g. orders or enquiries to the controller), this website uses
            SSL or TLS encryption. You can recognise an encrypted connection by the character
            string &ldquo;https://&rdquo; and the lock symbol in your browser&rsquo;s address bar.
          </p>
        </Block>

        <Block title="2) Data collection when you visit our website">
          <p>
            When you use our website for information purposes only, i.e. if you do not register or
            otherwise transmit information to us, we only collect data that your browser transmits
            to our server (so-called &ldquo;server log files&rdquo;). When you visit our website,
            we collect the following data, which is technically necessary for us to display the
            website to you:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>The page of our website you visited</li>
            <li>Date and time of access</li>
            <li>Amount of data sent in bytes</li>
            <li>Source/referrer from which you reached the page</li>
            <li>Browser used</li>
            <li>Operating system used</li>
            <li>IP address used (where applicable: in anonymised form)</li>
          </ul>
          <p>
            Processing is carried out in accordance with Art. 6 (1) (f) GDPR on the basis of our
            legitimate interest in improving the stability and functionality of our website. The
            data is not passed on or used in any other way. However, we reserve the right to
            check the server log files retrospectively should there be concrete indications of
            unlawful use.
          </p>
        </Block>

        <Block title="3) Your rights">
          <p>Under the GDPR, you have the following rights regarding your personal data:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Right of access (Art. 15 GDPR)</li>
            <li>Right to rectification (Art. 16 GDPR)</li>
            <li>Right to erasure (Art. 17 GDPR)</li>
            <li>Right to restriction of processing (Art. 18 GDPR)</li>
            <li>Right to data portability (Art. 20 GDPR)</li>
            <li>
              Right to object to processing based on Art. 6 (1) (f) GDPR, on grounds relating to
              your particular situation (Art. 21 GDPR)
            </li>
          </ul>
          <p>
            To exercise these rights, simply contact us using the details in section 1.2. You
            also have the right to lodge a complaint with a data protection supervisory
            authority. The authority responsible for us is the State Commissioner for Data
            Protection and Freedom of Information of North Rhine-Westphalia (LDI NRW).
          </p>
        </Block>
      </div>
    </Section>
  );
}
