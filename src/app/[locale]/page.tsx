import { event, schedule } from "@/content/event";
import { getDictionary } from "@/i18n";
import { isLocale, type Locale } from "@/i18n/config";
import { AccordionItem, ButtonLink, Card, Section } from "@/components/ui";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "de") as Locale;
  const d = getDictionary(locale);

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="border-b border-line bg-gradient-to-b from-brand-soft to-surface">
        <div className="container-page py-20 sm:py-28">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-strong">
                {d.home.heroKicker}
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-ink sm:text-6xl">
                {event.name[locale]}
              </h1>

              <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-4">
                <div>
                  <dt className="text-sm font-medium text-ink-muted">{d.home.whenTitle}</dt>
                  <dd className="mt-1 text-lg font-semibold text-ink">
                    <time dateTime={event.startIso}>{event.dates[locale]}</time>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-ink-muted">{d.home.whereTitle}</dt>
                  <dd className="mt-1 text-lg font-semibold text-ink">{event.venue.name[locale]}</dd>
                </div>
              </dl>
            </div>

            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-brand-strong"
            >
              {d.home.heroCta}
            </a>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ what */}
      <Section title={d.home.whatTitle}>
        <p className="text-lg leading-relaxed text-ink-muted">{event.about[locale]}</p>
        <br />
        <div>
          <AccordionItem title={d.home.expectTitle}>
            <ul className="space-y-2">
              {d.home.expectItems.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </AccordionItem>
          <AccordionItem title={d.home.prizeTitle}>
            <p>{d.home.prizeText}</p>
          </AccordionItem>
          <AccordionItem title={d.home.participantsTitle}>
            <div className="space-y-3">
              <p>{d.home.participantsText}</p>
              <p>{d.home.teamText}</p>
            </div>
          </AccordionItem>
          <AccordionItem title={d.home.bringTitle}>
            <p>{d.home.bringText}</p>
          </AccordionItem>
        </div>
      </Section>

    </>
  );
}
