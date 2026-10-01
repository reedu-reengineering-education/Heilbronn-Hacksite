"use client";

import Image from "next/image";
import { useState } from "react";
import type { Mentor } from "@/content/people";
import { cardClass } from "@/components/ui";

const face = "col-start-1 row-start-1 [backface-visibility:hidden]";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

function Avatar({ mentor }: { mentor: Mentor }) {
  if (mentor.avatar) {
    return (
      <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-full border border-line bg-surface-sunken">
        <Image src={mentor.avatar} alt="" fill className="object-cover" sizes="10rem" />
      </div>
    );
  }
  return (
    <div
      aria-hidden
      className="flex h-40 w-40 shrink-0 items-center justify-center rounded-full border border-line bg-surface-sunken font-mono text-4xl font-semibold text-accent"
    >
      {initials(mentor.name)}
    </div>
  );
}

/** Mentor card; flips to the alternative picture on click when one exists. */
export function MentorCard({ mentor }: { mentor: Mentor }) {
  const [flipped, setFlipped] = useState(false);
  const alt = mentor.altAvatar;
  const toggle = () => setFlipped((f) => !f);
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  const front = (
    <>
      <Avatar mentor={mentor} />
      <div>
        <h3 className="text-lg font-semibold text-ink">{mentor.name}</h3>
        <p className="mt-1 text-sm font-medium text-accent">{mentor.interest}</p>
      </div>
    </>
  );

  if (!alt) {
    return (
      <li className={`${cardClass} flex flex-col items-center gap-4 p-5 text-center`}>{front}</li>
    );
  }

  return (
    <li className="[perspective:1200px]">
      <div
        className="grid h-full transition-transform duration-500 [transform-style:preserve-3d] motion-reduce:transition-none"
        style={{ transform: flipped ? "rotateY(180deg)" : undefined }}
      >
        <div
          role="button"
          tabIndex={flipped ? -1 : 0}
          aria-hidden={flipped}
          aria-label={`${mentor.name}: show another picture`}
          onClick={toggle}
          onKeyDown={onKeyDown}
          className={`${face} ${cardClass} flex cursor-pointer flex-col items-center gap-4 p-5 text-center`}
        >
          {front}
        </div>
        <div
          role="button"
          tabIndex={flipped ? 0 : -1}
          aria-hidden={!flipped}
          aria-label={`${mentor.name}: back to overview`}
          onClick={toggle}
          onKeyDown={onKeyDown}
          style={{ transform: "rotateY(180deg)" }}
          className={`${face} ${cardClass} relative cursor-pointer overflow-hidden bg-surface-sunken`}
        >
          <Image
            src={alt}
            alt={`${mentor.name}`}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
      </div>
    </li>
  );
}
