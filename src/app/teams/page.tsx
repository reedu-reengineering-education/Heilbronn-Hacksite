import type { Metadata } from "next";
import { asc, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { teams } from "@/lib/db/schema";
import { dictionary as d, t } from "@/i18n";
import { getTeamSession } from "@/lib/session";
import { Badge, ButtonLink, Card, EmptyState, Section } from "@/components/ui";

export const metadata: Metadata = { title: d.teams.title };
export const dynamic = "force-dynamic";

export default async function TeamsPage() {
  const [session, rows] = await Promise.all([
    getTeamSession(),
    // Teams that still have room come first so they are easy to find.
    db.select().from(teams).orderBy(desc(teams.lookingForMembers), asc(teams.createdAt)),
  ]);

  const ownTeam = session ? rows.find((team) => team.id === session.teamId) : undefined;

  return (
    <Section title={d.teams.title}>
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <ButtonLink href="/team">{ownTeam ? d.teams.manage : d.teams.register}</ButtonLink>
      </div>

      {rows.length === 0 ? (
        <EmptyState>{d.teams.empty}</EmptyState>
      ) : (
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((team) => (
            <Card as="li" key={team.id} className="flex flex-col">
              <div className="flex items-start gap-3">
                <span className="text-3xl leading-none" aria-hidden>
                  {team.emoji}
                </span>
                <h2 className="flex-1 break-words text-lg font-semibold text-ink">{team.name}</h2>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {team.lookingForMembers && team.members.length < 6 ? (
                  <Badge tone="positive">{d.teams.lookingBadge}</Badge>
                ) : null}
              </div>

              <p className="mt-4 flex-1 whitespace-pre-line break-words text-ink-muted">
                {team.idea || d.teams.noIdea}
              </p>

              <div className="mt-5 border-t border-line pt-4">
                <h3 className="font-mono text-xs uppercase tracking-wide text-ink-muted">
                  {d.teams.membersLabel}
                </h3>
                {team.members.length > 0 ? (
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {team.members.map((member) => (
                      <li key={member}>
                        <Badge>{member}</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-ink-muted">{d.teams.noMembers}</p>
                )}
              </div>
            </Card>
          ))}
        </ul>
      )}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <span className="font-mono text-sm text-ink-muted">
          {t(d.teams.count, { count: rows.length })}
        </span>
      </div>
    </Section>
  );
}
