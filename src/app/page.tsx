import { event } from "@/content/event";
import { dictionary as d } from "@/i18n";
import { AccordionItem, Bracket, ButtonLink, Card, Section } from "@/components/ui";
import { HeroCountdown } from "@/components/HeroCountdown";
import { Logo } from "@/components/Logo";

export default function HomePage() {
  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="border-b border-line">
        <div className="mx-auto flex w-full max-w-[80rem] flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24">
          <Logo className="h-auto w-full max-w-md" />

          <div className="mt-12 flex flex-col items-center justify-center gap-x-12 gap-y-12 lg:flex-row lg:flex-wrap lg:items-start">
            <div className="flex shrink-0 flex-col items-center text-center lg:items-start lg:text-left">
              <dl className="mt-6 space-y-2 text-left font-mono text-lg uppercase tracking-wide sm:text-xl lg:text-lg xl:text-xl">
                <div className="flex items-baseline gap-3 lg:whitespace-nowrap">
                  <dt className="text-accent" aria-hidden>
                    &gt;
                  </dt>
                  <dt className="text-ink-muted">{d.home.heroWhenLabel}:</dt>
                  <dd className="font-bold text-ink"><time dateTime={event.startIso}>{event.dates}</time></dd>
                </div>
                <div className="flex items-baseline gap-3 lg:whitespace-nowrap">
                  <dt className="text-accent" aria-hidden>
                    &gt;
                  </dt>
                  <dt className="text-ink-muted">{d.home.whereTitle}:</dt>
                  <dd className="font-bold text-ink">{event.venue.name}</dd>
                </div>
              </dl>
            </div>

            <div className="shrink-0">
              <HeroCountdown
                target={event.startIso}
                label={d.home.countdownLabel}
                units={{
                  days: d.home.countdownDays,
                  hours: d.home.countdownHours,
                  minutes: d.home.countdownMinutes,
                  seconds: d.home.countdownSeconds,
                }}
                registrationUrl={event.registrationUrl}
                ctaLabel={d.home.heroCta}
              />
            </div>
          </div>

          <p className="mt-14 font-mono text-sm uppercase tracking-wide text-accent/50">
            <Bracket kind="brace" braceClassName="text-accent/50">
              {event.tagline}
            </Bracket>
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------ what */}
      <Section title={d.home.whatTitle}>
        <p className="text-lg leading-relaxed text-ink-muted">{event.about}</p>
      </Section>

      {/* ---------------------------------------------------------- expect */}
      <Section title={d.home.expectTitle}>
        <ul className="space-y-2 text-ink-muted">
          {d.home.expectItems.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="text-accent">&gt;</span>
              <span className="text-lg">{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* ---------------------------------------------------------- prizes */}
      <Section title={d.home.prizesTitle} lead={d.home.prizesLead}>
        <div className="grid gap-5 sm:grid-cols-3">
          <Card className="flex flex-col">
            <h3 className="font-mono text-lg font-semibold uppercase tracking-wide text-accent">
              {d.home.prizeCreditsTitle}
            </h3>
            <p className="mt-2 flex-1 text-lg leading-relaxed text-ink-muted">
              {d.home.prizeCreditsBody}
            </p>
            <ul className="mt-5 flex items-center justify-between gap-2 border-t border-line pt-4">
              {d.home.prizeCreditsTiers.map((tier) => (
                <li key={tier.amount} className="flex flex-col items-center gap-1">
                  <span aria-hidden className="text-xl">
                    {tier.medal}
                  </span>
                  <span className="font-mono text-sm font-bold tabular-nums text-ink">
                    {tier.amount}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="flex flex-col">
            <h3 className="font-mono text-lg font-semibold uppercase tracking-wide text-accent">
              {d.home.prizePitchTitle}
            </h3>
            <p className="mt-2 flex-1 text-lg leading-relaxed text-ink-muted">
              {d.home.prizePitchBody}
            </p>
          </Card>
          <Card className="flex flex-col">
            <h3 className="font-mono text-lg font-semibold uppercase tracking-wide text-accent">
              {d.home.prizeCourseTitle}
            </h3>
            <p className="mt-2 flex-1 text-lg leading-relaxed text-ink-muted">
              {d.home.prizeCourseBody}
            </p>
          </Card>
        </div>
      </Section>

      {/* ------------------------------------------------------------- faq */}
      <Section title={d.home.faqTitle}>
        <div>
          <AccordionItem title={d.home.participantsTitle}>
            <p className="text-lg">{d.home.participantsText}</p>
          </AccordionItem>
          <AccordionItem title={d.home.experienceTitle}>
            <p className="text-lg">{d.home.experienceText}</p>
          </AccordionItem>
          <AccordionItem title={d.home.feeTitle}>
            <p className="text-lg">{d.home.feeText}</p>
          </AccordionItem>
          <AccordionItem title={d.home.bringTitle}>
            <p className="text-lg">{d.home.bringText}</p>
          </AccordionItem>
          <AccordionItem title={d.home.soloTitle}>
            <p className="text-lg">{d.home.soloText}</p>
          </AccordionItem>
        </div>
      </Section>

    </>
  );
}
