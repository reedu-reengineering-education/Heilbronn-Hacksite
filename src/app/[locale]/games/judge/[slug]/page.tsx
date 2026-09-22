import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { challenges, submissions, teams, votes } from "@/lib/db/schema";
import { getDictionary, t } from "@/i18n";
import { isLocale, type Locale } from "@/i18n/config";
import { getTeamSession } from "@/lib/session";
import { challengeStage } from "@/lib/schedule";
import { Badge, Button, Card, EmptyState, Notice, Section } from "@/components/ui";
import { CountdownTimer } from "@/components/CountdownTimer";
import { SubmitForm } from "./SubmitForm";
import { unvoteAction, voteAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function JudgePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "de") as Locale;
  const d = getDictionary(locale);

  const [challenge] = await db.select().from(challenges).where(eq(challenges.slug, slug)).limit(1);
  if (!challenge) notFound();

  const team = await getTeamSession();
  const stage = challengeStage(challenge);

  // Entries with their author and vote count. Author names stay hidden while
  // voting is open so the vote is about the entry, not the team.
  const entries = await db
    .select({
      id: submissions.id,
      teamId: submissions.teamId,
      body: submissions.body,
      imagePath: submissions.imagePath,
      teamName: teams.name,
      teamEmoji: teams.emoji,
      voteCount: sql<number>`(
        select count(*)::int from ${votes} where ${votes.submissionId} = ${submissions.id}
      )`,
    })
    .from(submissions)
    .innerJoin(teams, eq(teams.id, submissions.teamId))
    .where(eq(submissions.challengeId, challenge.id));

  const own = team ? entries.find((entry) => entry.teamId === team.teamId) : undefined;

  const myVotes = team
    ? await db
        .select({ submissionId: votes.submissionId })
        .from(votes)
        .where(and(eq(votes.challengeId, challenge.id), eq(votes.voterTeamId, team.teamId)))
    : [];
  const votedFor = new Set(myVotes.map((vote) => vote.submissionId));
  const votesLeft = challenge.votesPerTeam - myVotes.length;

  const stageLabel: Record<typeof stage, string> = {
    upcoming: d.judge.upcomingPhase,
    submit: d.judge.submitPhase,
    waiting: d.judge.waitingPhase,
    vote: d.judge.votePhase,
    closed: d.judge.closedPhase,
  };

  const showEntries = stage === "vote" || stage === "closed";
  const ranked = stage === "closed" ? [...entries].sort((a, b) => b.voteCount - a.voteCount) : entries;

  return (
    <Section>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {challenge.title}
        </h1>
        <Badge tone={stage === "submit" || stage === "vote" ? "brand" : "neutral"}>
          {stageLabel[stage]}
        </Badge>
      </div>
      {challenge.prompt ? (
        <p className="mt-3 max-w-2xl text-ink-muted">{challenge.prompt}</p>
      ) : null}

      {!team ? (
        <div className="mt-6 max-w-2xl">
          <Notice>
            {d.games.needTeam}{" "}
            <Link href={`/${locale}/team`} className="font-semibold underline">
              {d.games.needTeamCta}
            </Link>
          </Notice>
        </div>
      ) : null}

      {/* ------------------------------------------------------- upcoming */}
      {stage === "upcoming" ? (
        <Notice>
          {d.judge.notOpenYet}{" "}
          <CountdownTimer
            target={challenge.submitStartsAt.toISOString()}
            refreshOnZero
            className="font-mono font-semibold text-ink"
          />
        </Notice>
      ) : null}

      {/* -------------------------------------------------- submit phase */}
      {stage === "submit" && team ? (
        <Card className="mt-8 max-w-2xl">
          <h2 className="text-lg font-semibold text-ink">{d.judge.yourSubmission}</h2>
          <div className="mt-4">
            <SubmitForm
              slug={slug}
              kind={challenge.submissionKind}
              d={d}
              hasExisting={Boolean(own)}
              existingBody={own?.body ?? ""}
            />
          </div>
          {own?.imagePath ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={own.imagePath}
              alt=""
              className="mt-5 max-h-64 rounded-lg border border-line object-contain"
            />
          ) : null}
        </Card>
      ) : null}

      {/* ------------------------------------------------------- waiting */}
      {stage === "waiting" ? (
        <Notice>
          {d.judge.waitingForVote}{" "}
          <CountdownTimer
            target={challenge.voteStartsAt.toISOString()}
            refreshOnZero
            className="font-mono font-semibold text-ink"
          />
        </Notice>
      ) : null}

      {/* ---------------------------------------------------- vote phase */}
      {showEntries ? (
        <div className="mt-8">
          {stage === "vote" && team ? (
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <p className="text-ink-muted">
                {t(d.judge.voteIntro, { count: challenge.votesPerTeam })}
              </p>
              <Badge tone="brand">{t(d.judge.votesLeft, { count: votesLeft })}</Badge>
            </div>
          ) : null}

          {ranked.length === 0 ? (
            <EmptyState>{d.judge.noSubmissions}</EmptyState>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2">
              {ranked.map((entry, index) => {
                const isOwn = team?.teamId === entry.teamId;
                const hasVoted = votedFor.has(entry.id);
                return (
                  <Card as="li" key={entry.id} className="flex flex-col">
                    {stage === "closed" ? (
                      <div className="mb-3 flex items-center justify-between">
                        <span className="flex items-center gap-2 font-medium text-ink">
                          <span aria-hidden>{entry.teamEmoji}</span>
                          {entry.teamName}
                        </span>
                        <Badge tone={index === 0 ? "positive" : "neutral"}>
                          {t(d.judge.votesReceived, { count: entry.voteCount })}
                        </Badge>
                      </div>
                    ) : null}

                    {entry.imagePath ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={entry.imagePath}
                        alt=""
                        className="mb-3 max-h-64 w-full rounded-lg bg-surface-sunken object-contain"
                      />
                    ) : null}

                    {entry.body ? (
                      <p className="flex-1 whitespace-pre-wrap text-ink">{entry.body}</p>
                    ) : null}

                    {stage === "vote" && team && !isOwn ? (
                      <form
                        action={hasVoted ? unvoteAction : voteAction}
                        className="mt-4 self-start"
                      >
                        <input type="hidden" name="slug" value={slug} />
                        <input type="hidden" name="submissionId" value={entry.id} />
                        <Button
                          type="submit"
                          variant={hasVoted ? "secondary" : "primary"}
                          disabled={!hasVoted && votesLeft <= 0}
                        >
                          {hasVoted ? `✓ ${d.judge.voted}` : d.judge.vote}
                        </Button>
                      </form>
                    ) : null}

                    {stage === "vote" && isOwn ? (
                      <p className="mt-4 text-sm text-ink-muted">{d.judge.yourSubmission}</p>
                    ) : null}
                  </Card>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}
    </Section>
  );
}
