import { desc, eq, sql } from "drizzle-orm";
import { db } from "./db";
import { scoreEvents, teams } from "./db/schema";

export type LeaderboardRow = {
  teamId: number;
  name: string;
  emoji: string;
  points: number;
  rank: number;
};

/**
 * The leaderboard is a plain aggregate over the points ledger, so a new game
 * type appears here automatically as soon as it writes `scoreEvents` rows.
 * Teams with no points yet are included, so everyone sees themselves.
 */
export async function getLeaderboard(): Promise<LeaderboardRow[]> {
  const rows = await db
    .select({
      teamId: teams.id,
      name: teams.name,
      emoji: teams.emoji,
      points: sql<number>`coalesce(sum(${scoreEvents.points}), 0)::int`,
    })
    .from(teams)
    .leftJoin(scoreEvents, eq(scoreEvents.teamId, teams.id))
    .groupBy(teams.id, teams.name, teams.emoji)
    .orderBy(desc(sql`coalesce(sum(${scoreEvents.points}), 0)`), teams.name);

  // Competition ranking: equal scores share a rank, the next rank skips.
  let lastPoints: number | null = null;
  let lastRank = 0;
  return rows.map((row, index) => {
    const rank = row.points === lastPoints ? lastRank : index + 1;
    lastPoints = row.points;
    lastRank = rank;
    return { ...row, rank };
  });
}

/**
 * Awards points idempotently — the unique index on
 * (team, source, sourceRef, reason) means a repeated call is a no-op.
 */
export async function award(entry: {
  teamId: number;
  source: string;
  sourceRef: string;
  reason: string;
  points: number;
}): Promise<void> {
  await db.insert(scoreEvents).values(entry).onConflictDoNothing();
}
