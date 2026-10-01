"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

/** Changing the playback rate (not the duration) keeps the current angle, so
 * the arcs speed up without jumping. */
function setSpinRate(button: HTMLButtonElement, rate: number) {
  for (const animation of button.querySelector("svg")?.getAnimations() ?? []) {
    animation.updatePlaybackRate(rate);
  }
}

export type TopicRing = {
  id: string;
  name: string;
  description: string;
  color: string;
};

/**
 * Seven interlocking, spinning rings. Each one flips on click to show its
 * description. Positions come from `.topic-ring` in globals.css.
 */
export function TopicRings({
  topics,
  flipHint,
  flipBack,
}: {
  topics: TopicRing[];
  flipHint: string;
  flipBack: string;
}) {
  const [flipped, setFlipped] = useState<ReadonlySet<string>>(new Set());

  function toggle(id: string) {
    setFlipped((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }

  return (
    <ul className="topic-rings">
      {topics.map((topic, index) => {
        const isFlipped = flipped.has(topic.id);
        return (
          <li
            key={topic.id}
            className="topic-ring"
            data-flipped={isFlipped}
            style={
              {
                "--i": index,
                "--ring": topic.color,
                "--spin": "30s",
                "--dir": index % 2 === 0 ? "normal" : "reverse",
              } as CSSProperties
            }
          >
            <button
              type="button"
              className="topic-ring__button"
              aria-pressed={isFlipped}
              aria-label={`${topic.name}: ${isFlipped ? flipBack : flipHint}`}
              onClick={() => toggle(topic.id)}
              onPointerEnter={(event) => setSpinRate(event.currentTarget, 3)}
              onPointerLeave={(event) => setSpinRate(event.currentTarget, 1)}
            >
              <span className="topic-ring__inner">
                <span className="topic-ring__face topic-ring__front">
                  <svg viewBox="0 0 100 100" className="topic-ring__svg" aria-hidden="true">
                    <circle cx="50" cy="50" r="45" />
                  </svg>
                  <span className="topic-ring__label">{topic.name}</span>
                </span>
                <span
                  className="topic-ring__face topic-ring__back"
                  aria-hidden={!isFlipped}
                >
                  <span className="topic-ring__title">{topic.name}</span>
                  <span className="topic-ring__text">{topic.description}</span>
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
