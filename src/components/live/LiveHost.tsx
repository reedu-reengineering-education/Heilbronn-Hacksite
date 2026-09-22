"use client";

import { useCallback, useState } from "react";
import type { Dictionary } from "@/i18n";
import { t } from "@/i18n";
import type { LobbyTeam, PublicQuestion, ServerMessage, Standing } from "@/lib/live/protocol";
import { Button, Card, Notice } from "@/components/ui";
import { useCountdown, useLiveSocket } from "./useLiveSocket";
import { Standings } from "./Standings";

/**
 * The organiser view, meant for a beamer: big code, big question, and the
 * controls to move the room forward.
 */
export function LiveHost({
  code,
  adminToken,
  d,
}: {
  code: string;
  adminToken: string;
  d: Dictionary;
}) {
  const [teams, setTeams] = useState<LobbyTeam[]>([]);
  const [question, setQuestion] = useState<PublicQuestion | null>(null);
  const [answered, setAnswered] = useState({ answered: 0, total: 0 });
  const [reveal, setReveal] = useState<{
    correct: string[];
    distribution: number[];
    hasNext: boolean;
  } | null>(null);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [ended, setEnded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onMessage = useCallback((message: ServerMessage) => {
    switch (message.t) {
      case "error":
        setError(message.message);
        return;
      case "lobby":
        setTeams(message.teams);
        return;
      case "question":
        setQuestion(message.question);
        setReveal(null);
        setAnswered({ answered: 0, total: 0 });
        return;
      case "answerCount":
        setAnswered({ answered: message.answered, total: message.total });
        return;
      case "reveal":
        setReveal({
          correct: message.correctAnswers,
          distribution: message.distribution,
          hasNext: message.hasNext,
        });
        setStandings(message.standings);
        return;
      case "ended":
        setEnded(true);
        setStandings(message.standings);
        setQuestion(null);
        return;
    }
  }, []);

  const { connected, send } = useLiveSocket({ code, role: "host", adminToken, onMessage });
  const secondsLeft = useCountdown(question && !reveal ? question.endsAt : null);

  const act = (action: "start" | "next" | "reveal" | "end") => send({ t: "host", action });

  return (
    <div className="space-y-5">
      {!connected ? <Notice tone="error">{d.live.disconnected}</Notice> : null}
      {error ? <Notice tone="error">{error}</Notice> : null}

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-ink-muted">{d.admin.code}</p>
            <p className="font-mono text-4xl font-bold tracking-[0.2em] text-brand-strong">
              {code}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-ink-muted">{d.live.playersHere}</p>
            <p className="text-3xl font-bold tabular-nums text-ink">{teams.length}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {!question && !ended ? <Button onClick={() => act("start")}>{d.admin.start}</Button> : null}
          {question && !reveal ? (
            <Button variant="secondary" onClick={() => act("reveal")}>
              {d.admin.reveal}
            </Button>
          ) : null}
          {question || reveal ? (
            <Button onClick={() => act("next")} disabled={ended}>
              {d.admin.next}
            </Button>
          ) : null}
          {!ended ? (
            <Button variant="danger" onClick={() => act("end")}>
              {d.admin.end}
            </Button>
          ) : null}
        </div>
      </Card>

      {question ? (
        <Card>
          <div className="flex items-center justify-between text-sm text-ink-muted">
            <span>{t(d.live.questionOf, { current: question.index + 1, total: question.total })}</span>
            <span className="flex items-center gap-4">
              <span className="font-medium">
                {answered.answered}/{answered.total}
              </span>
              {!reveal ? (
                <span className="text-2xl font-bold tabular-nums text-brand-strong">
                  {secondsLeft}
                </span>
              ) : null}
            </span>
          </div>

          <h2 className="mt-4 text-2xl font-bold leading-snug text-ink sm:text-3xl">
            {question.prompt}
          </h2>

          {question.imageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={question.imageUrl}
              alt=""
              className="mt-5 max-h-96 w-full rounded-lg object-contain"
            />
          ) : null}

          {question.kind === "choice" ? (
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {question.options.map((option, index) => {
                const isCorrect = reveal?.correct.includes(String(index));
                const count = reveal?.distribution[index] ?? 0;
                return (
                  <li
                    key={index}
                    className={`flex items-center justify-between gap-3 rounded-lg border-2 px-4 py-4 text-lg font-semibold ${
                      reveal
                        ? isCorrect
                          ? "border-positive bg-positive/10 text-ink"
                          : "border-line text-ink-muted opacity-60"
                        : "border-line text-ink"
                    }`}
                  >
                    <span>{option}</span>
                    {reveal ? <span className="tabular-nums text-ink-muted">{count}</span> : null}
                  </li>
                );
              })}
            </ul>
          ) : reveal ? (
            <p className="mt-6 text-lg">
              <span className="text-ink-muted">{d.live.correctAnswerWas} </span>
              <strong className="text-ink">{reveal.correct.join(", ")}</strong>
            </p>
          ) : null}
        </Card>
      ) : null}

      {ended ? (
        <Card className="text-center">
          <h2 className="text-2xl font-bold text-ink">{d.live.finished}</h2>
        </Card>
      ) : null}

      <Standings
        title={ended ? d.live.finalStandings : d.live.standings}
        rows={standings}
        d={d}
        limit={20}
      />
    </div>
  );
}
