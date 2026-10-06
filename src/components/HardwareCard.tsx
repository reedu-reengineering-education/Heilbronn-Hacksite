"use client";

import Image from "next/image";
import { useState } from "react";
import type { ResourceItem } from "@/content/resources";
import { Badge, cardClass } from "@/components/ui";

const face = "col-start-1 row-start-1 flex flex-col [backface-visibility:hidden]";

/** Flip card: image and name on the front, description and links on the back. */
export function HardwareCard({ item }: { item: ResourceItem }) {
  const [flipped, setFlipped] = useState(false);
  const toggle = () => setFlipped((f) => !f);
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <li className="[perspective:1200px]">
      <div
        className="grid h-full transition-transform duration-500 [transform-style:preserve-3d] motion-reduce:transition-none"
        style={{ transform: flipped ? "rotateY(180deg)" : undefined }}
      >
        {/* Front */}
        <div
          role="button"
          tabIndex={flipped ? -1 : 0}
          aria-hidden={flipped}
          aria-label={`${item.name}: show details`}
          onClick={toggle}
          onKeyDown={onKeyDown}
          className={`${face} cursor-pointer overflow-hidden ${cardClass}`}
        >
          <div className="relative aspect-video w-full bg-surface-sunken">
            {item.image ? (
              <Image
                src={item.image}
                alt=""
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            ) : null}
          </div>
          <div className="p-5">
            <h3 className="text-lg font-semibold text-ink">{item.name}</h3>
            <span className="mt-2 block text-xs text-ink-muted">Click for details ↻</span>
          </div>
        </div>

        {/* Back */}
        <div
          role="button"
          tabIndex={flipped ? 0 : -1}
          aria-hidden={!flipped}
          aria-label={`${item.name}: back to image`}
          onClick={toggle}
          onKeyDown={onKeyDown}
          style={{ transform: "rotateY(180deg)" }}
          className={`${face} cursor-pointer p-5 ${cardClass}`}
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold text-ink">{item.name}</h3>
            {item.badge ? <Badge tone="brand">{item.badge}</Badge> : null}
          </div>
          <p className="mt-2 flex-1 whitespace-pre-line text-sm leading-relaxed text-ink-muted">{item.summary}</p>
          {item.links.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
              {item.links.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm font-medium text-brand-strong underline-offset-4 hover:underline"
                  >
                    {link.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </li>
  );
}
