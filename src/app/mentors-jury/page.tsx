import Image from "next/image";
import { mentors, orgaTeam, type Mentor } from "@/content/people";
import { dictionary as d } from "@/i18n";
import { MentorCard } from "@/components/MentorCard";
import { Section } from "@/components/ui";

/** Regular mentors first, then the awareness team, then remote mentors. */
const groups: Array<Mentor["team"]> = [undefined, "awareness", "remote"];

/** Same column widths as a 1/2/4-column grid, but incomplete rows are centered. */
function MentorRow({ members }: { members: Mentor[] }) {
  return (
    <ul className="flex flex-wrap justify-center gap-5 [&>li]:w-full sm:[&>li]:w-[calc((100%_-_1.25rem)/2)] lg:[&>li]:w-[calc((100%_-_3.75rem)/4)]">
      {members.map((mentor, i) => (
        <MentorCard key={`${mentor.name}-${i}`} mentor={mentor} />
      ))}
    </ul>
  );
}

function MentorGrid() {
  return (
    <div className="flex flex-col gap-5">
      {groups.map((team) => {
        const members = mentors.filter((mentor) => mentor.team === team);
        return members.length > 0 ? <MentorRow key={team ?? "standard"} members={members} /> : null;
      })}
    </div>
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

      <Section title={d.mentorsJury.orgaTitle} lead={d.mentorsJury.orgaLead}>
        <MentorRow
          members={orgaTeam.map((m) => ({ name: m.name, interest: m.organization, avatar: m.avatar }))}
        />
      </Section>
    </>
  );
}
