import type { Metadata } from "next";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { VOTES_PER_VOTER, teams, votes } from "@/lib/db/schema";
import { dictionary as d, t } from "@/i18n";
import { getVoterSession } from "@/lib/session";
import { Badge, Button, Card, EmptyState, Notice, Section, cx } from "@/components/ui";
import { PassphraseGate, VoteButton } from "./VoteForms";
import { deleteVoteAction, enterVoteAction } from "./actions";

// Not linked from the nav, and kept out of search engines.
export const metadata: Metadata = { title: d.vote.title, robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function VotePage() {
  // Unsetting VOTE_PASSPHRASE closes voting, even for browsers already let in.
  if (!process.env.VOTE_PASSPHRASE) {
    return (
      <Section title={d.vote.title}>
        <Notice tone="info" className="max-w-md">
          {d.vote.closed}
        </Notice>
      </Section>
    );
  }

  const session = await getVoterSession();
  if (!session) {
    return (
      <Section title={d.vote.title}>
        <PassphraseGate d={d} intro={d.vote.gateIntro} action={enterVoteAction} />
      </Section>
    );
  }

  const [rows, ownVotes] = await Promise.all([
    db.select().from(teams).orderBy(asc(teams.name)),
    db.select({ teamId: votes.teamId }).from(votes).where(eq(votes.voterId, session.voterId)),
  ]);
  const votedIds = new Set(ownVotes.map((vote) => vote.teamId));
  const left = Math.max(VOTES_PER_VOTER - votedIds.size, 0);

  return (
    <Section title={d.vote.title} lead={t(d.vote.lead, { total: VOTES_PER_VOTER })}>
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <Badge tone={left > 0 ? "brand" : "neutral"}>
          {t(d.vote.votesLeft, { left, total: VOTES_PER_VOTER })}
        </Badge>
        {left === 0 ? <span className="text-sm text-ink-muted">{d.vote.noVotesLeft}</span> : null}
      </div>

      {rows.length === 0 ? (
        <EmptyState>{d.vote.empty}</EmptyState>
      ) : (
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((team) => {
            const chosen = votedIds.has(team.id);
            return (
              <Card
                as="li"
                key={team.id}
                className={cx("flex flex-col", chosen && "ring-4 ring-accent ring-offset-4 ring-offset-surface")}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl leading-none" aria-hidden>
                    {team.emoji}
                  </span>
                  <h2 className="flex-1 break-words text-lg font-semibold text-ink">{team.name}</h2>
                  {chosen ? <Badge tone="brand">{d.vote.yourVote}</Badge> : null}
                </div>
                <p className="mt-4 line-clamp-4 flex-1 whitespace-pre-line break-words text-sm text-ink-muted">
                  {team.idea}
                </p>
                <div className="mt-5">
                  {chosen ? (
                    <form action={deleteVoteAction}>
                      <input type="hidden" name="teamId" value={team.id} />
                      <Button type="submit" variant="secondary" className="w-full">
                        {d.vote.deleteButton}
                      </Button>
                    </form>
                  ) : (
                    <VoteButton d={d} teamId={team.id} disabled={left === 0} />
                  )}
                </div>
              </Card>
            );
          })}
        </ul>
      )}
    </Section>
  );
}
