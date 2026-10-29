"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { t, type Dictionary } from "@/i18n";
import { EmptyState, cardClass, cx } from "@/components/ui";
import { confetti, drumRain, drumroll } from "./effects";

type Entry = { id: number; name: string; emoji: string; votes: number };

function votesLabel(d: Dictionary, votes: number): string {
  return t(votes === 1 ? d.results.oneVote : d.results.votes, { count: votes });
}

/**
 * Countdown reveal for the stage: the ranking starts hidden, then each click
 * (or Space / →) plays a drumroll and uncovers the next place, from the last
 * one up to first. `rest` (places after the top ones) sits behind a discreet
 * toggle.
 */
export function Reveal({
  d,
  ranking,
  rest,
}: {
  d: Dictionary;
  ranking: Entry[];
  rest: Entry[];
}) {
  const [revealed, setRevealed] = useState(0);
  const [rolling, setRolling] = useState(false);
  const [showAll, setShowAll] = useState(false);
  // A ref as well as state, so a second click during the roll is ignored.
  const busy = useRef(false);
  const done = revealed >= ranking.length;
  const nextPlace = ranking.length - revealed;

  const revealNext = useCallback(async () => {
    if (busy.current || revealed >= ranking.length) return;
    busy.current = true;
    setRolling(true);

    const first = ranking.length - revealed === 1;
    const seconds = first ? 4 : 2.2;
    drumRain(seconds);
    await drumroll(seconds, first);

    setRevealed((value) => value + 1);
    setRolling(false);
    busy.current = false;
    confetti(first);
  }, [revealed, ranking.length]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (
        event.key === " " ||
        event.key === "ArrowRight" ||
        event.key === "Enter"
      ) {
        event.preventDefault();
        void revealNext();
      } else if (event.key === "ArrowLeft" && !busy.current) {
        setRevealed((value) => Math.max(value - 1, 0));
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [revealNext]);

  if (ranking.length === 0) return <EmptyState>{d.results.empty}</EmptyState>;

  return (
    <div className="mx-auto max-w-5xl">
      <div
        onClick={() => void revealNext()}
        className={cx("select-none", !done && !rolling && "cursor-pointer")}
      >
        <ol className={cx(cardClass, "divide-y divide-line overflow-hidden")}>
          {ranking.map((entry, index) => {
            const place = index + 1;
            const shown = place > nextPlace;
            const first = place === 1;
            const drumming = rolling && place === nextPlace;
            return (
              <li
                key={entry.id}
                className={cx(
                  "flex items-center gap-5 px-6 transition-colors duration-500 sm:gap-8 sm:px-10",
                  first ? "py-8 sm:py-10" : "py-5 sm:py-7",
                  first && shown && "bg-accent/10",
                  drumming && "bg-surface-muted",
                )}
              >
                <span
                  className={cx(
                    "w-16 shrink-0 font-mono font-semibold sm:w-24",
                    first ? "text-5xl sm:text-7xl" : "text-3xl sm:text-5xl",
                    shown || drumming ? "text-accent" : "text-ink-muted",
                  )}
                >
                  {place}.
                </span>
                {shown ? (
                  <>
                    <span
                      className={
                        first ? "text-6xl sm:text-8xl" : "text-4xl sm:text-6xl"
                      }
                      aria-hidden
                    >
                      {entry.emoji}
                    </span>
                    <span
                      className={cx(
                        "min-w-0 flex-1 break-words font-semibold text-ink",
                        first ? "text-3xl sm:text-6xl" : "text-2xl sm:text-4xl",
                      )}
                    >
                      {entry.name}
                    </span>
                    <span className="shrink-0 font-mono text-base uppercase tracking-wide text-ink-muted sm:text-xl">
                      {votesLabel(d, entry.votes)}
                    </span>
                  </>
                ) : (
                  <span
                    className={cx(
                      "flex-1 font-mono text-3xl tracking-[0.3em] sm:text-5xl",
                      drumming
                        ? "animate-pulse text-accent"
                        : "text-ink-muted/50",
                    )}
                  >
                    {drumming ? "🥁" : "???"}
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        <p className="mt-10 text-center font-mono text-lg uppercase tracking-wide text-ink-muted sm:text-xl">
          {rolling
            ? d.results.rolling
            : done
              ? d.results.done
              : t(d.results.revealButton, { place: nextPlace })}
        </p>
        {revealed === 0 && !rolling ? (
          <p className="mt-2 text-center text-ink-muted">{d.results.hint}</p>
        ) : null}
      </div>

      {rest.length > 0 ? (
        <div className="mt-24 text-center">
          <button
            type="button"
            onClick={() => setShowAll((value) => !value)}
            className="font-mono text-xs text-ink-muted/30 hover:text-ink-muted"
          >
            {t(showAll ? d.results.hideAll : d.results.showAll, {
              from: ranking.length + 1,
            })}
          </button>
        </div>
      ) : null}

      {showAll ? (
        <ol className="mx-auto mt-4 max-w-xl divide-y divide-line text-sm text-ink-muted">
          {rest.map((entry, index) => (
            <li key={entry.id} className="flex items-center gap-3 py-2">
              <span className="w-8 font-mono">
                {ranking.length + index + 1}.
              </span>
              <span aria-hidden>{entry.emoji}</span>
              <span className="min-w-0 flex-1 break-words">{entry.name}</span>
              <span className="font-mono">{votesLabel(d, entry.votes)}</span>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
