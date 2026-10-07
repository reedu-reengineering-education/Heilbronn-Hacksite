import type { Metadata } from "next";
import type { ReactNode } from "react";
import { dictionary as d } from "@/i18n";
import { Section } from "@/components/ui";

export const metadata: Metadata = { title: d.footer.imprint };

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="font-mono text-sm font-semibold uppercase tracking-wide text-ink">{title}</h3>
      {children}
    </div>
  );
}

const link = "text-accent hover:underline";

export default function ImprintPage() {
  return (
    <Section title={d.footer.imprint}>
      <div className="max-w-2xl space-y-8 text-ink-muted">
        <Block title="Information provided according to Sec. 5 DDG (Digitale-Dienste-Gesetz)">
          <p>
            Reedu GmbH &amp; Co. KG
            <br />
            Johann-Krane-Weg 23
            <br />
            48149 Münster
          </p>
        </Block>

        <Block title="Represented by">
          <p>
            Reedu Verwaltungs GmbH, represented by the managing directors Dr. Thomas Bartoschek
            &amp; Umut Tas
          </p>
        </Block>

        <Block title="Contact">
          <p>
            Telephone: +49 251 98119797
            <br />
            Email:{" "}
            <a href="mailto:kontakt@reedu.de" className={link}>
              kontakt@reedu.de
            </a>
          </p>
        </Block>

        <Block title="Register entry">
          <p>
            Entry in the Handelsregister.
            <br />
            Registering court: Amtsgericht Münster
            <br />
            Registration number: HRA 10639
          </p>
        </Block>

        <Block title="VAT">
          <p>
            VAT Id number according to Sec. 27 a German Value Added Tax Act:
            <br />
            DE317828779
          </p>
        </Block>

        <Block title="Responsible for contents acc. to Sec. 18 para. 2 German Federal Media Agreement (MStV)">
          <p>
            Umut Tas
            <br />
            Johann-Krane-Weg 23
            <br />
            48149, Münster
          </p>
        </Block>

        <Block title="Dispute resolution">
          <p>
            The European Commission provides a platform for online dispute resolution (OS):{" "}
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              https://ec.europa.eu/consumers/odr
            </a>
            .
          </p>
          <p>Please find our email in the impressum/legal notice.</p>
          <p>We do not take part in online dispute resolutions at consumer arbitration boards.</p>
        </Block>

        <Block title="Liability for Contents">
          <p>
            As service providers, we are liable for own contents of these websites according to
            Sec. 7, paragraph 1 DDG. However, according to Sec. 8 to 10
            DDG, service providers are not obligated to permanently monitor
            submitted or stored information or to search for evidences that indicate illegal
            activities.
          </p>
          <p>
            Legal obligations to removing information or to blocking the use of information remain
            unchallenged. In this case, liability is only possible at the time of knowledge about a
            specific violation of law. Illegal contents will be removed immediately at the time we
            get knowledge of them.
          </p>
        </Block>

        <Block title="Liability for Links">
          <p>
            Our offer includes links to external third party websites. We have no influence on the
            contents of those websites, therefore we cannot guarantee for those contents. Providers
            or administrators of linked websites are always responsible for their own contents.
          </p>
          <p>
            The linked websites had been checked for possible violations of law at the time of the
            establishment of the link. Illegal contents were not detected at the time of the
            linking. A permanent monitoring of the contents of linked websites cannot be imposed
            without reasonable indications that there has been a violation of law. Illegal links
            will be removed immediately at the time we get knowledge of them.
          </p>
        </Block>

        <Block title="Copyright">
          <p>
            Contents and compilations published on these websites by the providers are subject to
            German copyright laws. Reproduction, editing, distribution as well as the use of any
            kind outside the scope of the copyright law require a written permission of the author
            or originator. Downloads and copies of these websites are permitted for private use
            only.
          </p>
          <p>The commercial use of our contents without permission of the originator is prohibited.</p>
          <p>
            Copyright laws of third parties are respected as long as the contents on these websites
            do not originate from the provider. Contributions of third parties on this site are
            indicated as such. However, if you notice any violations of copyright law, please
            inform us. Such contents will be removed immediately.
          </p>
        </Block>
      </div>
    </Section>
  );
}
