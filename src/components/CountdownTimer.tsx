"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * A live countdown to an ISO timestamp, for "next game in 02:14:33". Starts
 * blank and fills in after mount to avoid a server/client clock mismatch,
 * and can optionally refresh the page once it hits zero so a "next" game
 * moves itself into "live now" without the visitor reloading by hand.
 */
export function CountdownTimer({
  target,
  refreshOnZero = false,
  className,
}: {
  target: string;
  refreshOnZero?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [now, setNow] = useState<number | null>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = now === null ? null : Math.max(0, new Date(target).getTime() - now);

  useEffect(() => {
    if (diff === 0 && refreshOnZero && !firedRef.current) {
      firedRef.current = true;
      router.refresh();
    }
  }, [diff, refreshOnZero, router]);

  if (diff === null) {
    return (
      <span className={className} aria-hidden>
        &nbsp;
      </span>
    );
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value: number) => String(value).padStart(2, "0");

  return (
    <span className={className}>
      {days > 0 ? `${days}d ` : ""}
      {pad(hours)}:{pad(minutes)}:{pad(seconds)}
    </span>
  );
}
