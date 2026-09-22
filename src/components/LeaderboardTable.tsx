import type { Dictionary } from "@/i18n";
import type { LeaderboardRow } from "@/lib/scores";
import { EmptyState } from "./ui";

const MEDALS = ["🥇", "🥈", "🥉"];

export function LeaderboardTable({
  rows,
  d,
  yourTeamId,
}: {
  rows: LeaderboardRow[];
  d: Dictionary;
  yourTeamId?: number | null;
}) {
  const hasAnyPoints = rows.some((row) => row.points > 0);
  if (!hasAnyPoints) return <EmptyState>{d.leaderboard.empty}</EmptyState>;

  return (
    <div className="overflow-hidden rounded-card border border-line">
      <table className="w-full">
        <caption className="sr-only">{d.leaderboard.title}</caption>
        <thead className="sticky top-0 bg-surface-sunken text-left text-sm text-ink-muted">
          <tr>
            <th scope="col" className="w-20 px-5 py-3 font-medium">
              {d.leaderboard.rank}
            </th>
            <th scope="col" className="px-5 py-3 font-medium">
              {d.leaderboard.team}
            </th>
            <th scope="col" className="w-32 px-5 py-3 text-right font-medium">
              {d.leaderboard.points}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row) => {
            const isYou = yourTeamId === row.teamId;
            return (
              <tr key={row.teamId} className={isYou ? "bg-brand-soft" : undefined}>
                <td className="px-5 py-4 text-lg font-semibold tabular-nums text-ink-muted">
                  {row.rank <= 3 && row.points > 0 ? (
                    <span aria-label={`${row.rank}`}>{MEDALS[row.rank - 1]}</span>
                  ) : (
                    row.rank
                  )}
                </td>
                <td className="px-5 py-4">
                  <span className="flex items-center gap-2 font-medium text-ink">
                    <span aria-hidden>{row.emoji}</span>
                    {row.name}
                    {isYou ? (
                      <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-semibold text-white">
                        {d.leaderboard.you}
                      </span>
                    ) : null}
                  </span>
                </td>
                <td className="px-5 py-4 text-right text-lg font-bold tabular-nums text-brand-strong">
                  {row.points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
