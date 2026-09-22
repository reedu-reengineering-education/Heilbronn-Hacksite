import { eq, ne, sql } from "drizzle-orm";
import { db } from "./db";
import { challenges, embeds, liveSessions, quizzes, submissions, votes } from "./db/schema";
import { award } from "./scores";
import type { Locale } from "@/i18n/config";

/**
 * Turns the raw schedule columns on `challenges` and `embeds` into "what's
 * true right now", and builds the "live now" / "next up" lists the games page
 * shows. Nothing here is stored — a game's stage is always derived from its
 * timestamps and the current clock, so it can never drift out of sync with
 * what an organiser actually scheduled.
 */

/* ------------------------------------------------------------- challenges */

export type ChallengeStage = "upcoming" | "submit" | "waiting" | "vote" | "closed";

export function challengeStage(
  c: { submitStartsAt: Date; submitEndsAt: Date; voteStartsAt: Date; voteEndsAt: Date },
  now: Date = new Date(),
): ChallengeStage {
  if (now < c.submitStartsAt) return "upcoming";
  if (now < c.submitEndsAt) return "submit";
  if (now < c.voteStartsAt) return "waiting";
  if (now < c.voteEndsAt) return "vote";
  return "closed";
}

/**
 * Awards `pointsPerVote` for every vote each entry received. Called whenever
 * a challenge is observed to have passed its voting deadline (from the games
 * page, the challenge page itself, or the admin dashboard) — never on a timer,
 * since nothing here runs a background job. Safe to call repeatedly: the vote
 * tally is stable once voting is closed (the vote/unvote actions refuse to run
 * outside the voting window), and the score ledger's unique index makes the
 * insert a no-op the second time around.
 *
 * The idempotency key is the challenge's `slug`, not its title, so renaming a
 * challenge later can never cause a duplicate award.
 */
export async function ensureChallengeAwarded(challenge: {
  id: number;
  slug: string;
  pointsPerVote: number;
}): Promise<void> {
  const tallies = await db
    .select({
      teamId: submissions.teamId,
      voteCount: sql<number>`count(${votes.id})::int`,
    })
    .from(submissions)
    .leftJoin(votes, eq(votes.submissionId, submissions.id))
    .where(eq(submissions.challengeId, challenge.id))
    .groupBy(submissions.teamId);

  for (const tally of tallies) {
    if (tally.voteCount <= 0) continue;
    await award({
      teamId: tally.teamId,
      source: "judge",
      sourceRef: String(challenge.id),
      reason: challenge.slug,
      points: tally.voteCount * challenge.pointsPerVote,
    });
  }
}

/* ----------------------------------------------------------------- embeds */

export type EmbedStage = "upcoming" | "live" | "closed";

export function embedStage(
  e: { startsAt: Date; endsAt: Date },
  now: Date = new Date(),
): EmbedStage {
  if (now < e.startsAt) return "upcoming";
  if (now < e.endsAt) return "live";
  return "closed";
}

/* ------------------------------------------------------------- the board */

export type ScheduleItem = {
  kind: "quiz" | "challenge-submit" | "challenge-vote" | "embed";
  title: string;
  /** Raw label from the database (e.g. an embed's `kind`), if more specific
   *  than the generic kind above. */
  badge?: string;
  href: string;
  startsAt: Date;
  /** Null for a live quiz session: it runs until the host ends it. */
  endsAt: Date | null;
};

export type GameSchedule = {
  liveNow: ScheduleItem[];
  next: ScheduleItem | null;
};

/**
 * Everything the games page needs: what is playable right now, and — if
 * nothing or something else is about to start — the single next thing on the
 * schedule. Also opportunistically finalises any challenge whose voting
 * window just closed, so points show up without anyone having to click a
 * "close" button.
 */
export async function getGameSchedule(locale: Locale): Promise<GameSchedule> {
  const now = new Date();

  const [sessions, challengeRows, embedRows] = await Promise.all([
    db
      .select({
        code: liveSessions.code,
        status: liveSessions.status,
        scheduledAt: liveSessions.scheduledAt,
        quizTitle: quizzes.title,
      })
      .from(liveSessions)
      .innerJoin(quizzes, eq(quizzes.id, liveSessions.quizId))
      .where(ne(liveSessions.status, "ended")),
    db.select().from(challenges),
    db.select().from(embeds),
  ]);

  const liveNow: ScheduleItem[] = [];
  const upcoming: ScheduleItem[] = [];
  const justClosed: typeof challengeRows = [];

  for (const session of sessions) {
    const href = `/${locale}/games/live/${session.code}`;
    const isDue = session.status === "running" || !session.scheduledAt || session.scheduledAt <= now;
    const item: ScheduleItem = {
      kind: "quiz",
      title: session.quizTitle,
      href,
      startsAt: session.scheduledAt ?? now,
      endsAt: null,
    };
    (isDue ? liveNow : upcoming).push(item);
  }

  for (const challenge of challengeRows) {
    const href = `/${locale}/games/judge/${challenge.slug}`;
    switch (challengeStage(challenge, now)) {
      case "submit":
        liveNow.push({
          kind: "challenge-submit",
          title: challenge.title,
          href,
          startsAt: challenge.submitStartsAt,
          endsAt: challenge.submitEndsAt,
        });
        break;
      case "vote":
        liveNow.push({
          kind: "challenge-vote",
          title: challenge.title,
          href,
          startsAt: challenge.voteStartsAt,
          endsAt: challenge.voteEndsAt,
        });
        break;
      case "upcoming":
        upcoming.push({
          kind: "challenge-submit",
          title: challenge.title,
          href,
          startsAt: challenge.submitStartsAt,
          endsAt: challenge.submitEndsAt,
        });
        break;
      case "waiting":
        upcoming.push({
          kind: "challenge-vote",
          title: challenge.title,
          href,
          startsAt: challenge.voteStartsAt,
          endsAt: challenge.voteEndsAt,
        });
        break;
      case "closed":
        justClosed.push(challenge);
        break;
    }
  }

  for (const embed of embedRows) {
    const href = `/${locale}/games/play/${embed.slug}`;
    const item: ScheduleItem = {
      kind: "embed",
      title: embed.title,
      badge: embed.kind,
      href,
      startsAt: embed.startsAt,
      endsAt: embed.endsAt,
    };
    const stage = embedStage(embed, now);
    if (stage === "live") liveNow.push(item);
    else if (stage === "upcoming") upcoming.push(item);
  }

  await Promise.all(justClosed.map((challenge) => ensureChallengeAwarded(challenge)));

  liveNow.sort((a, b) => (a.endsAt?.getTime() ?? Infinity) - (b.endsAt?.getTime() ?? Infinity));
  upcoming.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());

  return { liveNow, next: upcoming[0] ?? null };
}
