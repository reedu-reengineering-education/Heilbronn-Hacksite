"use client";

import { useEffect, useRef, useState } from "react";
import type { ScheduleDay, ScheduleEntry } from "@/content/event";
import { cardClass } from "@/components/ui";

/** Flip duration in ms; matches duration-500 on the card. */
const FLIP_MS = 500;

const face = "w-full cursor-pointer p-5 [backface-visibility:hidden]";
const hint = "mt-4 text-xs text-ink-muted underline-offset-4 hover:underline";

/**
 * Flip card for one day: summary on the front, full timetable on the back.
 * Unlike FlipCard, the faces aren't stacked in a grid (which would size both
 * to the taller one); the hidden face is taken out of flow and the wrapper
 * animates between the measured heights of the two faces. Outside of a flip
 * the hidden face is display:none, otherwise the long, out-of-flow back would
 * still overhang the card and stretch the page below the footer.
 */
export function ScheduleCard({ day }: { day: ScheduleDay }) {
  const [flipped, setFlipped] = useState(false);
  const [heights, setHeights] = useState<{ front: number; back: number } | null>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  // True while the card is turning, so both faces are rendered.
  const [turning, setTurning] = useState(false);
  const turnTimer = useRef<number | undefined>(undefined);
  const toggle = () => {
    setFlipped((f) => !f);
    setTurning(true);
    window.clearTimeout(turnTimer.current);
    turnTimer.current = window.setTimeout(() => setTurning(false), FLIP_MS);
  };
  useEffect(() => () => window.clearTimeout(turnTimer.current), []);

  useEffect(() => {
    const front = frontRef.current;
    const back = backRef.current;
    if (!front || !back) return;
    // A face reports 0 while display:none; keep its last known height then.
    const measure = () =>
      setHeights((prev) => ({
        front: front.offsetHeight || prev?.front || 0,
        back: back.offsetHeight || prev?.back || 0,
      }));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(front);
    observer.observe(back);
    return () => observer.disconnect();
  }, []);

  const heading = (
    <>
      <p className="font-mono text-lg font-semibold uppercase text-ink">
        {day.day} · {day.date}
      </p>
      <h3 className="mt-1 text-lg font-semibold text-ink/75">{day.title}</h3>
    </>
  );

  return (
    <li
      className="[perspective:1600px] transition-[height] duration-500 motion-reduce:transition-none"
      // The back is unmeasured (0) until its first flip; hold the front height for that frame.
      style={heights ? { height: flipped ? heights.back || heights.front : heights.front } : undefined}
    >
      <div
        className="relative transition-transform duration-500 [transform-style:preserve-3d] motion-reduce:transition-none"
        style={{ transform: flipped ? "rotateY(180deg)" : undefined }}
      >
        {/* Front: in flow, so it alone sets the height before JS has measured. */}
        <div
          ref={frontRef}
          onClick={toggle}
          inert={flipped}
          aria-hidden={flipped}
          className={`${face} ${cardClass} ${flipped && !turning ? "hidden" : ""}`}
        >
          {heading}
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{day.summary}</p>
          <button type="button" className={hint}>
            Show timetable ↻
          </button>
        </div>

        {/* Back: out of flow, so its length doesn't stretch the front. */}
        <div
          ref={backRef}
          onClick={toggle}
          inert={!flipped}
          aria-hidden={!flipped}
          style={{ transform: "rotateY(180deg)" }}
          className={`${face} ${cardClass} absolute inset-x-0 top-0 ${!flipped && !turning ? "hidden" : ""}`}
        >
          {heading}
          <DayCalendar entries={day.entries} />
          <button type="button" className={hint}>
            Back to summary ↻
          </button>
        </div>
      </div>
    </li>
  );
}

/* -------------------------------------------------------------- calendar */

/** Vertical scale of the calendar: 30 minutes ≈ 54px. */
const PX_PER_MIN = 1.8;
/** Entries shorter than this only show their detail on hover/focus — there's no room for it. */
const MIN_DETAIL_MIN = 45;
/** How long an entry without an end time ("open end") is drawn. */
const OPEN_END_MIN = 60;

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

type Placed = { entry: ScheduleEntry; start: number; end: number; lane: number; lanes: number };

/**
 * Lays entries out like a calendar day: overlapping entries form a cluster and
 * share its width in side-by-side lanes.
 */
function layout(entries: ScheduleEntry[]): Placed[] {
  const items = entries
    .map((entry) => {
      const start = toMin(entry.start);
      return { entry, start, end: entry.end ? toMin(entry.end) : start + OPEN_END_MIN, lane: 0, lanes: 1 };
    })
    .sort((a, b) => a.start - b.start || b.end - a.end);

  let cluster: Placed[] = [];
  let clusterEnd = -1;
  const close = () => {
    const lanes = Math.max(...cluster.map((p) => p.lane)) + 1;
    cluster.forEach((p) => (p.lanes = lanes));
  };
  for (const item of items) {
    if (cluster.length && item.start >= clusterEnd) {
      close();
      cluster = [];
    }
    const laneEnds: number[] = [];
    cluster.forEach((p) => (laneEnds[p.lane] = Math.max(laneEnds[p.lane] ?? 0, p.end)));
    const free = laneEnds.findIndex((end) => end <= item.start);
    item.lane = free === -1 ? laneEnds.length : free;
    cluster.push(item);
    clusterEnd = Math.max(clusterEnd, item.end);
  }
  if (cluster.length) close();
  return items;
}

function DayCalendar({ entries }: { entries: ScheduleEntry[] }) {
  const placed = layout(entries);
  const first = Math.floor(Math.min(...placed.map((p) => p.start)) / 60) * 60;
  const last = Math.ceil(Math.max(...placed.map((p) => p.end)) / 60) * 60;
  const hours = Array.from({ length: (last - first) / 60 + 1 }, (_, i) => first + i * 60);
  const y = (min: number) => (min - first) * PX_PER_MIN;

  return (
    <div className="relative mt-4 ml-12" style={{ height: y(last) }}>
      {/* Hour lines */}
      {hours.map((min) => (
        <div key={min} className="absolute inset-x-0 border-t border-line" style={{ top: y(min) }} aria-hidden>
          <span className="absolute -top-2.5 -left-12 font-mono text-xs text-ink-muted">
            {String(min / 60).padStart(2, "0")}:00
          </span>
        </div>
      ))}

      {/* Entries */}
      <ol>
        {placed.map(({ entry, start, end, lane, lanes }, index) => {
          const height = y(end) - y(start) - 2;
          const time = entry.end ? `${entry.start}–${entry.end}` : `from ${entry.start}`;
          return (
            <li
              key={index}
              tabIndex={0}
              // Tapping an entry focuses (and expands) it instead of flipping the card.
              onClick={(e) => e.stopPropagation()}
              style={{
                top: y(start) + 1,
                height,
                minHeight: height,
                left: `calc(${(lane / lanes) * 100}% + 2px)`,
                width: `calc(${100 / lanes}% - 4px)`,
              }}
              className={`group absolute flex cursor-default flex-col overflow-hidden rounded-md border-l-4 px-2 py-1 outline-none transition-shadow hover:z-10 hover:h-auto! hover:shadow-card focus:z-10 focus:h-auto! focus:shadow-card focus-visible:ring-2 focus-visible:ring-brand ${
                entry.isBreak ? "border-brand bg-brand-soft" : "border-ink-muted bg-surface-sunken"
              } ${entry.end ? "" : "[mask-image:linear-gradient(to_bottom,black_50%,transparent)]"}`}
            >
              <p className="font-mono text-[11px] leading-tight text-ink-muted">{time}</p>
              <p className={`text-sm font-semibold leading-snug ${entry.isBreak ? "text-brand-strong" : "text-ink"}`}>
                {entry.title}
              </p>
              {entry.detail ? (
                // Fills the rest of the box and fades out if it doesn't fit; hover/focus shows it all.
                <p
                  className={`${end - start < MIN_DETAIL_MIN ? "hidden group-hover:block group-focus:block" : ""} mt-0.5 min-h-0 flex-1 overflow-hidden text-xs leading-snug text-ink-muted [mask-image:linear-gradient(to_bottom,black_calc(100%-14px),transparent)] group-hover:[mask-image:none] group-focus:[mask-image:none]`}
                >
                  {entry.detail}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
