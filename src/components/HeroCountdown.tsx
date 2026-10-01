"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Countdown display + registration button wrapper.
 * Both hide once the start time passes; if that moment happens while the
 * visitor has the page open, the countdown triggers a confetti burst.
 */
export function HeroCountdown({
  target,
  label,
  units,
  registrationUrl,
  ctaLabel,
}: {
  target: string;
  label: string;
  units: { days: string; hours: string; minutes: string; seconds: string };
  registrationUrl: string;
  ctaLabel: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <CountdownDisplay target={target} label={label} units={units} />
      <RegistrationButton registrationUrl={registrationUrl} ctaLabel={ctaLabel} target={target} />
    </div>
  );
}

/**
 * Countdown display. Disappears once the start time passes; if that moment
 * happens while the visitor has the page open, it triggers a confetti burst
 * instead of just quietly vanishing.
 */
function CountdownDisplay({
  target,
  label,
  units,
}: {
  target: string;
  label: string;
  units: { days: string; hours: string; minutes: string; seconds: string };
}) {
  const [now, setNow] = useState<number | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const wasCountingRef = useRef(false);

  const targetMs = new Date(target).getTime();

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= targetMs) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  const diff = now === null ? null : targetMs - now;

  useEffect(() => {
    if (diff === null) return;
    if (diff > 0) {
      wasCountingRef.current = true;
    } else if (wasCountingRef.current) {
      wasCountingRef.current = false;
      setCelebrate(true);
    }
  }, [diff]);

  const stopCelebrating = useCallback(() => setCelebrate(false), []);

  if (diff === null || diff <= 0) {
    return celebrate ? <ConfettiBurst onDone={stopCelebrating} /> : null;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [
    { value: days, label: units.days },
    { value: hours, label: units.hours },
    { value: minutes, label: units.minutes },
    { value: seconds, label: units.seconds },
  ];

  return (
    <div className="mb-6">
      <p className="font-mono text-sm uppercase tracking-wide text-ink-muted">{label}</p>
      <div className="mt-2 flex gap-3">
        {parts.map((part) => (
          <div
            key={part.label}
            className="flex w-16 flex-col items-center rounded-lg border border-line bg-surface px-2 py-3"
          >
            <span className="font-mono text-2xl font-bold tabular-nums text-accent sm:text-3xl">
              {String(part.value).padStart(2, "0")}
            </span>
            <span className="mt-1 font-mono text-[11px] uppercase tracking-wide text-ink-muted">
              {part.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RegistrationButton({
  registrationUrl,
  ctaLabel,
  target,
}: {
  registrationUrl: string;
  ctaLabel: string;
  target: string;
}) {
  const [now, setNow] = useState<number | null>(null);
  const targetMs = new Date(target).getTime();

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= targetMs) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  const hasStarted = now !== null && now >= targetMs;

  if (hasStarted) return null;

  return (
    <a
      href={registrationUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-8 py-4 font-mono text-lg font-semibold uppercase tracking-wide text-surface transition-colors hover:bg-white"
    >
      {ctaLabel}
    </a>
  );
}

const CONFETTI_COLORS = [
  "oklch(0.72 0.14 160)",
  "oklch(0.78 0.15 75)",
  "oklch(0.64 0.15 142)",
  "oklch(0.6 0.19 25)",
  "oklch(0.55 0.2 260)",
];

function ConfettiBurst({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const pieceCount = 160;
    const pieces = Array.from({ length: pieceCount }, () => ({
      x: Math.random() * width,
      y: -20 - Math.random() * height * 0.5,
      size: 6 + Math.random() * 6,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      speedY: 2 + Math.random() * 3,
      speedX: (Math.random() - 0.5) * 2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
    }));

    const durationMs = 4000;
    const startedAt = performance.now();
    let frame: number;

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const piece of pieces) {
        piece.x += piece.speedX;
        piece.y += piece.speedY;
        piece.rotation += piece.rotationSpeed;
        if (piece.y > height + 20) piece.y = -20;

        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate(piece.rotation);
        ctx.fillStyle = piece.color;
        ctx.fillRect(-piece.size / 2, -piece.size / 4, piece.size, piece.size / 2);
        ctx.restore();
      }

      if (time - startedAt < durationMs) {
        frame = requestAnimationFrame(draw);
      } else {
        onDone();
      }
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
    };
  }, [onDone]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50"
    />
  );
}
