import type { Dictionary } from "@/i18n";
import type { Standing } from "@/lib/live/protocol";
import { Card } from "@/components/ui";

export function Standings({
  title,
  rows,
  d,
  limit = 10,
}: {
  title: string;
  rows: Standing[];
  d: Dictionary;
  limit?: number;
}) {
  if (rows.length === 0) return null;

  return (
    <Card>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">{title}</h2>
      <ol className="mt-3 divide-y divide-line">
        {rows.slice(0, limit).map((row, index) => (
          <li key={row.teamId} className="flex items-center gap-3 py-2.5">
            <span className="w-6 text-sm font-semibold tabular-nums text-ink-muted">
              {index + 1}
            </span>
            <span aria-hidden>{row.emoji}</span>
            <span className="flex-1 truncate font-medium text-ink">{row.name}</span>
            {row.delta > 0 ? (
              <span className="text-sm font-medium text-positive">+{row.delta}</span>
            ) : null}
            <span className="w-16 text-right font-bold tabular-nums text-brand-strong">
              {row.points}
            </span>
          </li>
        ))}
      </ol>
      <p className="sr-only">{d.leaderboard.points}</p>
    </Card>
  );
}
