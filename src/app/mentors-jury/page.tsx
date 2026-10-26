import Image from "next/image";
import { mentors, orgaTeam, type Mentor, type OrgaMember } from "@/content/people";
import { dictionary as d } from "@/i18n";
import { MentorCard, OrgaCard } from "@/components/MentorCard";
import { Section } from "@/components/ui";

/** Regular mentors first, then the awareness team and remote mentors on one row. */
const rows: Array<Array<Mentor["team"]>> = [[undefined], ["awareness", "remote"]];

/** Same column widths as a 1/2/4-column grid, but incomplete rows are centered. */
const rowClass =
  "flex flex-wrap justify-center gap-5 [&>li]:w-full sm:[&>li]:w-[calc((100%_-_1.25rem)/2)] lg:[&>li]:w-[calc((100%_-_3.75rem)/4)]";

const mentors42 = orgaTeam.filter((member) => member.organization === "42Heilbronn");
const orga = orgaTeam.filter((member) => member.organization !== "42Heilbronn");

function OrgaRow({ members }: { members: OrgaMember[] }) {
  return (
    <ul className={rowClass}>
      {members.map((member, i) => (
        <OrgaCard key={`${member.name}-${i}`} member={member} />
      ))}
    </ul>
  );
}

function MentorRow({ members }: { members: Mentor[] }) {
  return (
    <ul className={rowClass}>
      {members.map((mentor, i) => (
        <MentorCard key={`${mentor.name}-${i}`} mentor={mentor} />
      ))}
    </ul>
  );
}

function MentorGrid() {
  return (
    <div className="flex flex-col gap-5">
      {rows.map((teams) => {
        const members = mentors.filter((mentor) => teams.includes(mentor.team));
        return members.length > 0 ? <MentorRow key={teams.join("-") || "standard"} members={members} /> : null;
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

      <Section title={d.mentorsJury.mentors42Title}>
        <OrgaRow members={mentors42} />
      </Section>

      <Section title={d.mentorsJury.orgaTitle} lead={d.mentorsJury.orgaLead}>
        <OrgaRow members={orga} />
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
