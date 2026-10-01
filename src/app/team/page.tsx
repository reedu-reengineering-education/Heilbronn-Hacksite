import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { teams } from "@/lib/db/schema";
import { dictionary as d, t } from "@/i18n";
import { getTeamSession } from "@/lib/session";
import { Button, ButtonLink, Notice, Section } from "@/components/ui";
import { DeleteTeamForm } from "./DeleteTeamForm";
import { EditTeamForm, SignInForm, SignUpForm } from "./TeamForms";
import { signOutAction } from "./actions";

export const metadata: Metadata = { title: d.team.title };
export const dynamic = "force-dynamic";

export default async function TeamPage({
  searchParams,
}: {
  searchParams: Promise<{ team?: string }>;
}) {
  const [session, { team: requested }] = await Promise.all([getTeamSession(), searchParams]);
  const requestedId = Number(requested);

  const [team] = session
    ? await db.select().from(teams).where(eq(teams.id, session.teamId))
    : [];

  // "Manage" on the overview links here with ?team=<id>. Unless already signed
  // in as that team, ask for the passphrase with the name filled in.
  if (Number.isInteger(requestedId) && requested && (!team || team.id !== requestedId)) {
    const [target] = await db.select().from(teams).where(eq(teams.id, requestedId));
    if (target) {
      return (
        <Section title={d.team.title}>
          <div className="max-w-md space-y-4">
            <Notice tone="info">{t(d.team.signInToManage, { team: target.name })}</Notice>
            <SignInForm d={d} teamName={target.name} />
          </div>
        </Section>
      );
    }
  }

  // A cookie for a team that has since been deleted counts as signed out.
  if (!session || !team) {
    return (
      <Section title={d.team.title}>
        <div className="grid max-w-4xl gap-5 md:grid-cols-2">
          <SignUpForm d={d} />
          <SignInForm d={d} />
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <div className="max-w-2xl space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <ButtonLink href="/teams" variant="secondary">
            {d.team.viewOverview}
          </ButtonLink>
          <form action={signOutAction}>
            <Button type="submit" variant="ghost">
              {d.team.logOutButton}
            </Button>
          </form>
        </div>

        <EditTeamForm
          key={`${team.id}-${team.name}-${team.emoji}-${team.idea}-${team.members.join("|")}-${team.lookingForMembers}`}
          d={d}
          team={team}
        />

        <DeleteTeamForm d={d} />
      </div>
    </Section>
  );
}
