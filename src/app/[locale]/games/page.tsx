import type { Metadata } from "next";
import { getDictionary, type Dictionary } from "@/i18n";
import { isLocale, type Locale } from "@/i18n/config";
import { getTeamSession } from "@/lib/session";
import { getLeaderboard } from "@/lib/scores";
import { getGameSchedule, type ScheduleItem } from "@/lib/schedule";
import { Badge, Button, ButtonLink, Card, EmptyState, Section } from "@/components/ui";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { CountdownTimer } from "@/components/CountdownTimer";
import { SignInForm, SignUpForm } from "../team/TeamForms";
import { signOutAction } from "../team/actions";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: getDictionary(isLocale(locale) ? locale : "de").games.title };
}

export default async function GamesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "de") as Locale;
  const d = getDictionary(locale);

  const team = await getTeamSession();

  // Signed out: this page's whole job is to get you signed in, so the forms
  // live right here instead of behind a link.
  if (!team) {
    return (
      <Section title={d.games.title} lead={d.games.intro}>
        <div className="grid max-w-4xl gap-5 md:grid-cols-2">
          <SignUpForm locale={locale} d={d} redirectTo={`/${locale}/games`} />
          <SignInForm locale={locale} d={d} redirectTo={`/${locale}/games`} />
        </div>
      </Section>
    );
  }

  const [board, schedule] = await Promise.all([getLeaderboard(), getGameSchedule(locale)]);
  const yourRow = board.find((row) => row.teamId === team.teamId);

  return (
    <Section>
      {/* --------------------------------------------------- your team --- */}
      <Card className="mb-8 flex flex-wrap items-center gap-x-8 gap-y-4">
        <div>
          <p className="text-sm text-ink-muted">{d.team.loggedInAs}</p>
          <p className="mt-0.5 flex items-center gap-2 text-xl font-bold text-ink">
            <span aria-hidden>{team.emoji}</span>
            {team.name}
          </p>
        </div>
        <div className="flex gap-8">
          <div>
            <p className="text-sm text-ink-muted">{d.team.points}</p>
            <p className="text-xl font-bold tabular-nums text-brand-strong">
              {yourRow?.points ?? 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-ink-muted">{d.team.rank}</p>
            <p className="text-xl font-bold tabular-nums text-ink">#{yourRow?.rank ?? board.length}</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <form action={signOutAction}>
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="next" value={`/${locale}/games`} />
            <Button type="submit" variant="ghost" className="px-3 py-1.5 text-sm">
              {d.team.logOutButton}
            </Button>
          </form>
        </div>
      </Card>

      {/* --------------------------------------------------- leaderboard --- */}
      <div className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-ink">{d.leaderboard.title}</h2>
        <div className="max-h-96 overflow-y-auto rounded-card">
          <LeaderboardTable rows={board} d={d} yourTeamId={team.teamId} />
        </div>
      </div>

      {/* ---------------------------------------------------- live now --- */}
      {schedule.liveNow.length > 0 ? (
        <div className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-ink">{d.games.liveNowTitle}</h2>
          <ul className="grid gap-5 sm:grid-cols-2">
            {schedule.liveNow.map((item) => (
              <GameCard key={item.href} item={item} d={d} />
            ))}
          </ul>
        </div>
      ) : null}

      {/* ---------------------------------------------------- next up --- */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-ink">{d.games.nextTitle}</h2>
        {schedule.next ? (
          <Card className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Badge tone="brand">{kindLabel(schedule.next, d)}</Badge>
              <p className="mt-2 text-lg font-semibold text-ink">{schedule.next.title}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-ink-muted">{d.games.startsIn}</p>
              <CountdownTimer
                target={schedule.next.startsAt.toISOString()}
                refreshOnZero
                className="text-2xl font-bold tabular-nums text-brand-strong"
              />
            </div>
          </Card>
        ) : (
          <EmptyState>{d.games.noneYet}</EmptyState>
        )}
      </div>
    </Section>
  );
}

function kindLabel(item: ScheduleItem, d: Dictionary): string {
  if (item.badge) return item.badge;
  switch (item.kind) {
    case "quiz":
      return d.games.liveTitle;
    case "challenge-submit":
      return d.judge.submitPhase;
    case "challenge-vote":
      return d.judge.votePhase;
    case "embed":
      return d.games.kindEmbed;
  }
}

function GameCard({ item, d }: { item: ScheduleItem; d: Dictionary }) {
  return (
    <Card as="li" className="flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
        <Badge tone="brand">{kindLabel(item, d)}</Badge>
      </div>
      {item.endsAt ? (
        <p className="mt-2 text-sm text-ink-muted">
          {d.games.endsIn}{" "}
          <CountdownTimer
            target={item.endsAt.toISOString()}
            refreshOnZero
            className="font-mono font-semibold text-ink"
          />
        </p>
      ) : null}
      <ButtonLink href={item.href} className="mt-5 self-start">
        {item.kind === "quiz" ? d.games.liveCta : d.games.judgeCta}
      </ButtonLink>
    </Card>
  );
}
