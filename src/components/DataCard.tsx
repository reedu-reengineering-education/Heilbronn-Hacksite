"use client";

import Image from "next/image";
import { useState } from "react";
import type { DataSource } from "@/content/data";
import { Badge, cardClass } from "@/components/ui";

const face = "col-start-1 row-start-1 flex flex-col [backface-visibility:hidden]";

/** Flip card: image, summary and measurements on the front, endpoints and docs on the back. */
export function DataCard({ item }: { item: DataSource }) {
  const [flipped, setFlipped] = useState(false);
  const toggle = () => setFlipped((f) => !f);

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
          aria-label={`${item.name}: show endpoints`}
          onClick={toggle}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggle();
            }
          }}
          className={`${face} cursor-pointer overflow-hidden ${cardClass}`}
        >
          <div className="relative aspect-video w-full bg-surface-sunken">
            <Image
              src={item.image}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </div>
          <div className="flex flex-1 flex-col p-5">
            <h3 className="text-lg font-semibold text-ink">{item.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.summary}</p>
            <ul className="mt-4 flex flex-1 flex-wrap content-start gap-1.5">
              {item.measurements.map((m) => (
                <li key={m}>
                  <Badge tone="brand">{m}</Badge>
                </li>
              ))}
            </ul>
            <span className="mt-4 text-xs text-ink-muted">Click to see data endpoints ↻</span>
          </div>
        </div>

        {/* Back */}
        <div
          role="button"
          tabIndex={flipped ? 0 : -1}
          aria-hidden={!flipped}
          aria-label={`${item.name}: back to overview`}
          onClick={toggle}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggle();
            }
          }}
          style={{ transform: "rotateY(180deg)" }}
          className={`${face} cursor-pointer p-5 ${cardClass}`}
        >
          <h3 className="text-lg font-semibold text-ink">{item.name}</h3>
          <h4 className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Data endpoints
          </h4>
          {item.endpoints.length > 0 ? (
            <ul className="mt-2 flex-1 space-y-2">
              {item.endpoints.map((ep) => (
                <li key={ep.url} className="text-sm leading-snug">
                  <a
                    href={ep.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="font-medium text-brand-strong underline-offset-4 hover:underline"
                  >
                    {ep.label} ↗
                  </a>
                  <span className="block text-ink-muted">{ep.description}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 flex-1 text-sm text-ink-muted">Details will follow.</p>
          )}
          {item.docs.length > 0 ? (
            <div className="mt-4 border-t border-line pt-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Documentation
              </h4>
              <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                {item.docs.map((link) => (
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
            </div>
          ) : null}
        </div>
      </div>
    </li>
  );
}
