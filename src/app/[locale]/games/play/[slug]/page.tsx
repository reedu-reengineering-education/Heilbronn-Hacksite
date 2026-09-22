import { notFound } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { embeds } from "@/lib/db/schema";
import { getDictionary } from "@/i18n";
import { isLocale, type Locale } from "@/i18n/config";
import { embedStage } from "@/lib/schedule";
import { Badge, Notice } from "@/components/ui";
import { CountdownTimer } from "@/components/CountdownTimer";

export const dynamic = "force-dynamic";

/**
 * Generic host page for third-party activities: OpenGuessr, H5P, a form, a
 * board. Adding one is a row in the `embeds` table — no code change.
 *
 * Only reachable while it's within its scheduled window; outside it, this
 * shows a countdown or a "this has ended" notice instead of the iframe.
 *
 * Note that points from these are awarded by hand in the admin area, since we
 * cannot see inside someone else's iframe.
 */
export default async function EmbedPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "de") as Locale;
  const d = getDictionary(locale);

  const [embed] = await db.select().from(embeds).where(eq(embeds.slug, slug)).limit(1);
  if (!embed) notFound();

  const stage = embedStage(embed);

  return (
    <div className="container-page py-8 sm:py-12">
      <div className="flex flex-wrap items-center gap-3">
        <Link href={`/${locale}/games`} className="text-sm text-ink-muted hover:text-ink">
          ← {d.nav.games}
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-ink">{embed.title}</h1>
        <Badge tone="brand">{embed.kind}</Badge>
      </div>
      {embed.description ? <p className="mt-2 text-ink-muted">{embed.description}</p> : null}

      {stage === "upcoming" ? (
        <Notice className="mt-6">
          {d.games.startsIn}{" "}
          <CountdownTimer
            target={embed.startsAt.toISOString()}
            refreshOnZero
            className="font-mono font-semibold text-ink"
          />
        </Notice>
      ) : stage === "closed" ? (
        <Notice tone="info" className="mt-6">
          {d.games.activityClosed}
        </Notice>
      ) : (
        <>
          <div
            className="mt-6 w-full overflow-hidden rounded-card border border-line bg-surface-sunken"
            style={{ aspectRatio: embed.aspectRatio }}
          >
            <iframe
              src={embed.url}
              title={embed.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
            />
          </div>

          <p className="mt-4 text-sm text-ink-muted">
            <a
              href={embed.url}
              target="_blank"
              rel="noreferrer"
              className="text-brand-strong hover:underline"
            >
              {embed.url} ↗
            </a>
          </p>
        </>
      )}
    </div>
  );
}
