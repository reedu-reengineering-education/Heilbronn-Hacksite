import Link from "next/link";
import { asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { challenges, embeds, liveSessions, questions, quizzes, submissions, teams } from "@/lib/db/schema";
import { dictionary as d } from "@/i18n";
import { isAdmin } from "@/lib/session";
import { challengeStage, embedStage, ensureChallengeAwarded } from "@/lib/schedule";
import { Badge, Button, Card, Field, Input, Section } from "@/components/ui";
import { AdminLogin } from "./AdminLogin";
import { adminLogoutAction, awardPointsAction, startSessionAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return (
      <Section title={d.admin.title}>
        <AdminLogin d={d} />
      </Section>
    );
  }

  const [quizRows, sessionRows, challengeRows, embedRows, teamRows] = await Promise.all([
    db
      .select({
        id: quizzes.id,
        title: quizzes.title,
        questionCount: sql<number>`(
          select count(*)::int from ${questions} where ${questions.quizId} = ${quizzes.id}
        )`,
      })
      .from(quizzes)
      .orderBy(asc(quizzes.id)),
    db.select().from(liveSessions).orderBy(desc(liveSessions.id)).limit(10),
    db
      .select({
        id: challenges.id,
        slug: challenges.slug,
        title: challenges.title,
        submitStartsAt: challenges.submitStartsAt,
        submitEndsAt: challenges.submitEndsAt,
        voteStartsAt: challenges.voteStartsAt,
        voteEndsAt: challenges.voteEndsAt,
        pointsPerVote: challenges.pointsPerVote,
        submissionCount: sql<number>`(
          select count(*)::int from ${submissions} where ${submissions.challengeId} = ${challenges.id}
        )`,
      })
      .from(challenges)
      .orderBy(asc(challenges.id)),
    db.select().from(embeds).orderBy(asc(embeds.id)),
    db.select({ id: teams.id, name: teams.name, emoji: teams.emoji }).from(teams).orderBy(asc(teams.name)),
  ]);

  // Defensive: award any challenge that closed since the games page was last
  // visited, so the admin dashboard never shows a stale "closed, unpaid" state.
  await Promise.all(
    challengeRows
      .filter((c) => challengeStage(c) === "closed")
      .map((c) => ensureChallengeAwarded(c)),
  );

  const formatDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const stageTone = { upcoming: "neutral", submit: "brand", waiting: "neutral", vote: "brand", closed: "neutral" } as const;
  const stageLabel = {
    upcoming: d.judge.upcomingPhase,
    submit: d.judge.submitPhase,
    waiting: d.judge.waitingPhase,
    vote: d.judge.votePhase,
    closed: d.judge.closedPhase,
  } as const;

  return (
    <Section title={d.admin.title}>
      <form action={adminLogoutAction} className="mb-8">
        <Button type="submit" variant="ghost">
          {d.admin.logOut}
        </Button>
      </form>

      <div className="space-y-8">
        {/* ------------------------------------------------------ quizzes */}
        <Card>
          <h2 className="text-lg font-semibold text-ink">{d.admin.quizzesTitle}</h2>
          <ul className="mt-4 divide-y divide-line">
            {quizRows.map((quiz) => (
              <li key={quiz.id} className="flex flex-wrap items-end gap-3 py-3">
                <span className="flex-1 font-medium text-ink">
                  {quiz.title}{" "}
                  <span className="text-sm font-normal text-ink-muted">
                    · {quiz.questionCount}
                  </span>
                </span>
                <form action={startSessionAction} className="flex flex-wrap items-end gap-2">
                  <input type="hidden" name="quizId" value={quiz.id} />
                  <Field label={d.admin.scheduledAt}>
                    <Input
                      type="datetime-local"
                      name="scheduledAt"
                      className="w-56 py-1.5 text-sm"
                    />
                  </Field>
                  <Button type="submit" variant="secondary">
                    {d.admin.startSession}
                  </Button>
                </form>
              </li>
            ))}
            {quizRows.length === 0 ? (
              <li className="py-3 text-ink-muted">
                Run <code className="rounded bg-surface-sunken px-1.5 py-0.5">npm run db:seed</code>{" "}
                to create an example quiz.
              </li>
            ) : null}
          </ul>

          {sessionRows.length > 0 ? (
            <>
              <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-ink-muted">
                {d.admin.status}
              </h3>
              <ul className="mt-2 divide-y divide-line">
                {sessionRows.map((session) => (
                  <li key={session.id} className="flex flex-wrap items-center gap-3 py-2.5">
                    <span className="font-mono text-lg font-bold tracking-widest text-brand-strong">
                      {session.code}
                    </span>
                    <Badge tone={session.status === "ended" ? "neutral" : "positive"}>
                      {session.status}
                    </Badge>
                    {session.scheduledAt ? (
                      <span className="text-sm text-ink-muted">
                        {formatDate.format(session.scheduledAt)}
                      </span>
                    ) : null}
                    {session.status !== "ended" ? (
                      <Link
                        href={`/admin/live/${session.code}`}
                        className="ml-auto text-sm font-medium text-brand-strong hover:underline"
                      >
                        {d.admin.hostConsole} →
                      </Link>
                    ) : null}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </Card>

        {/* --------------------------------------------------- challenges */}
        <Card>
          <h2 className="text-lg font-semibold text-ink">{d.admin.challengesTitle}</h2>
          <ul className="mt-4 divide-y divide-line">
            {challengeRows.map((challenge) => {
              const stage = challengeStage(challenge);
              return (
                <li key={challenge.id} className="flex flex-wrap items-center gap-3 py-3">
                  <span className="flex-1">
                    <Link
                      href={`/games/judge/${challenge.slug}`}
                      className="font-medium text-ink hover:underline"
                    >
                      {challenge.title}
                    </Link>
                    <span className="ml-2 text-sm text-ink-muted">
                      · {challenge.submissionCount}
                    </span>
                  </span>
                  <Badge tone={stageTone[stage]}>{stageLabel[stage]}</Badge>
                  <span className="text-xs text-ink-muted">
                    {d.admin.submitWindow} {formatDate.format(challenge.submitStartsAt)}–
                    {formatDate.format(challenge.submitEndsAt)} · {d.admin.voteWindow}{" "}
                    {formatDate.format(challenge.voteStartsAt)}–{formatDate.format(challenge.voteEndsAt)}
                  </span>
                </li>
              );
            })}
            {challengeRows.length === 0 ? (
              <li className="py-3 text-ink-muted">No submission rounds yet.</li>
            ) : null}
          </ul>
          <p className="mt-4 text-sm text-ink-muted">
            Challenges are rows in the <code>challenges</code> table, including their four
            schedule timestamps — create and edit them with{" "}
            <code className="rounded bg-surface-sunken px-1.5 py-0.5">npm run db:studio</code>.
          </p>
        </Card>

        {/* -------------------------------------------------------- embeds */}
        <Card>
          <h2 className="text-lg font-semibold text-ink">{d.admin.embedsTitle}</h2>
          <ul className="mt-4 divide-y divide-line">
            {embedRows.map((embed) => {
              const stage = embedStage(embed);
              return (
                <li key={embed.id} className="flex flex-wrap items-center gap-3 py-3">
                  <Link
                    href={`/games/play/${embed.slug}`}
                    className="flex-1 font-medium text-ink hover:underline"
                  >
                    {embed.title}
                  </Link>
                  <Badge>{embed.kind}</Badge>
                  <Badge tone={stage === "live" ? "brand" : "neutral"}>{stage}</Badge>
                  <span className="text-xs text-ink-muted">
                    {formatDate.format(embed.startsAt)}–{formatDate.format(embed.endsAt)}
                  </span>
                </li>
              );
            })}
            {embedRows.length === 0 ? (
              <li className="py-3 text-ink-muted">No embeds yet.</li>
            ) : null}
          </ul>
          <p className="mt-4 text-sm text-ink-muted">
            Embeds are rows in the <code>embeds</code> table — add them, and their scheduled
            window, with{" "}
            <code className="rounded bg-surface-sunken px-1.5 py-0.5">npm run db:studio</code> or
            plain SQL.
          </p>
        </Card>

        {/* ------------------------------------------------- manual points */}
        <Card>
          <h2 className="text-lg font-semibold text-ink">{d.admin.awardPoints}</h2>
          <p className="mt-2 text-sm text-ink-muted">
            For embedded games and anything that happens away from the site.
          </p>
          <form action={awardPointsAction} className="mt-4 flex flex-wrap items-end gap-3">
            <label className="flex-1">
              <span className="mb-1.5 block text-sm font-medium text-ink">
                {d.leaderboard.team}
              </span>
              <select
                name="teamId"
                required
                className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-ink"
              >
                {teamRows.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.emoji} {team.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="w-32">
              <span className="mb-1.5 block text-sm font-medium text-ink">
                {d.leaderboard.points}
              </span>
              <Input name="points" type="number" required defaultValue={100} />
            </label>
            <label className="flex-1">
              <span className="mb-1.5 block text-sm font-medium text-ink">Label</span>
              <Input name="reason" required placeholder="OpenGuessr round 1" />
            </label>
            <Button type="submit">{d.admin.awardPoints}</Button>
          </form>
        </Card>
      </div>
    </Section>
  );
}
