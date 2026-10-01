import Image from "next/image";
import { mentors } from "@/content/people";
import { dictionary as d } from "@/i18n";
import { MentorCard } from "@/components/MentorCard";
import { Section } from "@/components/ui";

function MentorGrid() {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {mentors.map((mentor) => (
        <MentorCard key={mentor.name} mentor={mentor} />
      ))}
    </ul>
  );
}

export default function MentorsJuryPage() {
  return (
    <>
      <Section
        title={d.mentorsJury.mentorsTitle}
        lead={d.mentorsJury.mentorsLead}
        className="pt-10"
      >
        <MentorGrid />
      </Section>

      <Section title={d.mentorsJury.juryTitle}>
        <div className="relative aspect-[2000/1204] w-full overflow-hidden rounded-card border border-line bg-surface-muted">
          <Image
            src="/data/Jury.png"
            alt={d.mentorsJury.juryTitle}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 72rem, 100vw"
          />
        </div>
      </Section>
    </>
  );
}
