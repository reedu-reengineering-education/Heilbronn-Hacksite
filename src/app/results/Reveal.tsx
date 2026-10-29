"use client";

import { useEffect, useState } from "react";
import { t, type Dictionary } from "@/i18n";
import { EmptyState, cardClass, cx } from "@/components/ui";

type Entry = { id: number; name: string; emoji: string; votes: number };

/**
 * Countdown reveal for the stage: the ranking starts hidden, then each click
 * (or Space / →) uncovers the next place, from the last one up to first.
 */
export function Reveal({ d, ranking }: { d: Dictionary; ranking: Entry[] }) {
  const [revealed, setRevealed] = useState(0);
  const done = revealed >= ranking.length;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === " " || event.key === "ArrowRight" || event.key === "Enter") {
        event.preventDefault();
        setRevealed((value) => Math.min(value + 1, ranking.length));
      } else if (event.key === "ArrowLeft") {
        setRevealed((value) => Math.max(value - 1, 0));
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [ranking.length]);

  if (ranking.length === 0) return <EmptyState>{d.results.empty}</EmptyState>;

  const nextPlace = ranking.length - revealed;

  return (
    <div
      onClick={() => setRevealed((value) => Math.min(value + 1, ranking.length))}
      className={cx("mx-auto max-w-3xl select-none", !done && "cursor-pointer")}
    >
      <ol className={cx(cardClass, "divide-y divide-line overflow-hidden")}>
          {ranking.map((entry, index) => {
            const place = index + 1;
            const shown = place > nextPlace;
            const first = place === 1;
            return (
              <li
                key={entry.id}
                className={cx(
                  "flex items-center gap-4 px-5 py-4 transition-colors duration-500 sm:gap-6 sm:px-6",
                  first && "py-6",
                  first && shown && "bg-accent/10",
                )}
              >
                <span
                  className={cx(
                    "w-12 shrink-0 font-mono font-semibold sm:w-16",
                    first ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl",
                    shown ? "text-accent" : "text-ink-muted",
                  )}
                >
                  {place}.
                </span>
                {shown ? (
                  <>
                    <span className={first ? "text-5xl" : "text-3xl"} aria-hidden>
                      {entry.emoji}
                    </span>
                    <span
                      className={cx(
                        "min-w-0 flex-1 break-words font-semibold text-ink",
                        first ? "text-2xl sm:text-4xl" : "text-xl sm:text-2xl",
                      )}
                    >
                      {entry.name}
                    </span>
                    <span className="shrink-0 font-mono text-sm uppercase tracking-wide text-ink-muted">
                      {t(entry.votes === 1 ? d.results.oneVote : d.results.votes, { count: entry.votes })}
                    </span>
                  </>
                ) : (
                  <span className="flex-1 font-mono text-2xl tracking-[0.3em] text-ink-muted/50">
                    ???
                  </span>
                )}
              </li>
            );
          })}
      </ol>

      <p className="mt-8 text-center font-mono text-sm uppercase tracking-wide text-ink-muted">
        {done ? d.results.done : t(d.results.revealButton, { place: nextPlace })}
      </p>
      {revealed === 0 ? (
        <p className="mt-2 text-center text-sm text-ink-muted">{d.results.hint}</p>
      ) : null}
    </div>
  );
}
