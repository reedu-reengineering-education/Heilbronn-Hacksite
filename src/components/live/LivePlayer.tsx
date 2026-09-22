"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import type { Dictionary } from "@/i18n";
import { t } from "@/i18n";
import type { Locale } from "@/i18n/config";
import type { LobbyTeam, PublicQuestion, ServerMessage, Standing } from "@/lib/live/protocol";
import { Button, Card, Input, Notice } from "@/components/ui";
import { useCountdown, useLiveSocket } from "./useLiveSocket";
import { Standings } from "./Standings";

/** Kahoot-style colours so answers are distinguishable across the room. */
const OPTION_STYLES = [
  "bg-[oklch(0.55_0.20_25)] hover:bg-[oklch(0.48_0.20_25)]",
  "bg-[oklch(0.55_0.17_250)] hover:bg-[oklch(0.48_0.17_250)]",
  "bg-[oklch(0.60_0.16_145)] hover:bg-[oklch(0.53_0.16_145)]",
  "bg-[oklch(0.65_0.16_75)] hover:bg-[oklch(0.58_0.16_75)]",
  "bg-[oklch(0.52_0.18_310)] hover:bg-[oklch(0.45_0.18_310)]",
  "bg-[oklch(0.58_0.13_200)] hover:bg-[oklch(0.51_0.13_200)]",
];

const OPTION_SHAPES = ["▲", "◆", "●", "■", "★", "⬟"];

type View =
  | { kind: "lobby"; teams: LobbyTeam[] }
  | { kind: "question"; question: PublicQuestion; answered: boolean }
  | {
      kind: "reveal";
      question: PublicQuestion;
      correct: string[];
      you: { correct: boolean; points: number };
      standings: Standing[];
    }
  | { kind: "ended"; standings: Standing[] };

export function LivePlayer({
  code,
  token,
  locale,
  d,
}: {
  code: string;
  token: string;
  locale: Locale;
  d: Dictionary;
}) {
  const [view, setView] = useState<View>({ kind: "lobby", teams: [] });
  const [error, setError] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState("");

  const onMessage = useCallback((message: ServerMessage) => {
    switch (message.t) {
      case "error":
        setError(message.code === "notFound" ? "notFound" : message.message);
        return;
      case "lobby":
        setView({ kind: "lobby", teams: message.teams });
        return;
      case "question":
        setTextAnswer("");
        setView({ kind: "question", question: message.question, answered: message.answered });
        return;
      case "answerAccepted":
        setView((current) =>
          current.kind === "question" ? { ...current, answered: true } : current,
        );
        return;
      case "reveal":
        setView((current) => {
          if (current.kind !== "question" && current.kind !== "reveal") return current;
          const question = current.kind === "question" ? current.question : current.question;
          return {
            kind: "reveal",
            question,
            correct: message.correctAnswers,
            you: message.you ?? { correct: false, points: 0 },
            standings: message.standings,
          };
        });
        return;
      case "ended":
        setView({ kind: "ended", standings: message.standings });
        return;
    }
  }, []);

  const { connected, send } = useLiveSocket({ code, role: "player", token, onMessage });

  const question = view.kind === "question" || view.kind === "reveal" ? view.question : null;
  const secondsLeft = useCountdown(view.kind === "question" ? view.question.endsAt : null);

  function answer(value: string) {
    if (view.kind !== "question" || view.answered) return;
    send({ t: "answer", questionId: view.question.id, value });
    setView({ ...view, answered: true });
  }

  if (error === "notFound") {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <p className="text-lg font-semibold text-ink">{d.live.notFound}</p>
        <Link
          href={`/${locale}/games`}
          className="mt-4 inline-block font-medium text-brand-strong hover:underline"
        >
          {d.common.back}
        </Link>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {!connected ? <Notice tone="error">{d.live.disconnected}</Notice> : null}

      {/* ----------------------------------------------------------- lobby */}
      {view.kind === "lobby" ? (
        <Card className="text-center">
          <p className="font-mono text-sm uppercase tracking-widest text-ink-muted">{code}</p>
          <h1 className="mt-3 text-2xl font-bold text-ink">{d.live.waitingTitle}</h1>
          <p className="mt-2 text-ink-muted">{d.live.waitingBody}</p>

          <p className="mt-8 text-sm font-medium text-ink-muted">
            {d.live.playersHere} · {view.teams.length}
          </p>
          <ul className="mt-3 flex flex-wrap justify-center gap-2">
            {view.teams.map((team) => (
              <li
                key={team.teamId}
                className="rounded-full bg-surface-sunken px-3 py-1.5 text-sm font-medium text-ink"
              >
                <span aria-hidden>{team.emoji}</span> {team.name}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {/* -------------------------------------------------------- question */}
      {question ? (
        <Card>
          <div className="flex items-center justify-between text-sm text-ink-muted">
            <span>
              {t(d.live.questionOf, {
                current: question.index + 1,
                total: question.total,
              })}
            </span>
            {view.kind === "question" ? (
              <span
                className="text-2xl font-bold tabular-nums text-brand-strong"
                aria-label={d.live.timeLeft}
              >
                {secondsLeft}
              </span>
            ) : null}
          </div>

          <h1 className="mt-4 text-xl font-bold leading-snug text-ink sm:text-2xl">
            {question.prompt}
          </h1>

          {question.imageUrl ? (
            <div className="relative mt-5 aspect-video w-full overflow-hidden rounded-lg bg-surface-sunken">
              <Image
                src={question.imageUrl}
                alt=""
                fill
                unoptimized
                className="object-contain"
                sizes="(max-width: 640px) 100vw, 640px"
              />
            </div>
          ) : null}

          {/* Multiple choice */}
          {question.kind === "choice" ? (
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {question.options.map((option, index) => {
                const isCorrect = view.kind === "reveal" && view.correct.includes(String(index));
                const dimmed = view.kind === "reveal" && !isCorrect;
                return (
                  <li key={index}>
                    <button
                      type="button"
                      onClick={() => answer(String(index))}
                      disabled={view.kind !== "question" || view.answered}
                      className={[
                        "flex w-full items-center gap-3 rounded-lg px-4 py-5 text-left text-lg font-semibold text-white transition",
                        OPTION_STYLES[index % OPTION_STYLES.length],
                        dimmed ? "opacity-30" : "",
                        isCorrect ? "ring-4 ring-white/70" : "",
                        view.kind === "question" && view.answered
                          ? "cursor-not-allowed opacity-60"
                          : "",
                      ].join(" ")}
                    >
                      <span aria-hidden className="text-xl">
                        {OPTION_SHAPES[index % OPTION_SHAPES.length]}
                      </span>
                      {option}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}

          {/* Free text */}
          {question.kind === "text" && view.kind === "question" ? (
            <form
              className="mt-6 flex gap-2"
              onSubmit={(formEvent) => {
                formEvent.preventDefault();
                if (textAnswer.trim()) answer(textAnswer);
              }}
            >
              <Input
                value={textAnswer}
                onChange={(inputEvent) => setTextAnswer(inputEvent.target.value)}
                placeholder={d.live.typeAnswer}
                disabled={view.answered}
                autoFocus
              />
              <Button type="submit" disabled={view.answered || !textAnswer.trim()}>
                {d.live.submit}
              </Button>
            </form>
          ) : null}

          {view.kind === "question" && view.answered ? (
            <p className="mt-4 text-center font-medium text-ink-muted">{d.live.answerSubmitted}</p>
          ) : null}

          {/* Reveal */}
          {view.kind === "reveal" ? (
            <div className="mt-6 space-y-3">
              <div
                className={`rounded-lg px-4 py-4 text-center text-lg font-bold ${
                  view.you.correct
                    ? "bg-positive/15 text-positive"
                    : "bg-negative/15 text-negative"
                }`}
              >
                {view.you.correct ? d.live.correct : d.live.wrong}
                {view.you.points > 0 ? (
                  <span className="ml-2">{t(d.live.pointsEarned, { points: view.you.points })}</span>
                ) : null}
              </div>
              {question.kind === "text" ? (
                <p className="text-center text-sm text-ink-muted">
                  {d.live.correctAnswerWas} <strong className="text-ink">{view.correct[0]}</strong>
                </p>
              ) : null}
            </div>
          ) : null}
        </Card>
      ) : null}

      {/* ------------------------------------------------------- standings */}
      {view.kind === "reveal" ? (
        <Standings title={d.live.standings} rows={view.standings} d={d} />
      ) : null}

      {view.kind === "ended" ? (
        <>
          <Card className="text-center">
            <h1 className="text-2xl font-bold text-ink">{d.live.finished}</h1>
          </Card>
          <Standings title={d.live.finalStandings} rows={view.standings} d={d} />
          <div className="text-center">
            <Link
              href={`/${locale}/games`}
              className="font-medium text-brand-strong hover:underline"
            >
              {d.live.backToGames}
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
}
