import { and, asc, eq } from "drizzle-orm";
import type { WebSocket } from "ws";
import { db } from "@/lib/db";
import { liveAnswers, liveSessions, questions, quizzes, scoreEvents } from "@/lib/db/schema";
import type {
  LobbyTeam,
  PublicQuestion,
  RoomPhase,
  ServerMessage,
  Standing,
} from "./protocol";

/**
 * In-memory state for running live quizzes.
 *
 * Deliberately single-process: a room only exists while the app is running, and
 * answers are written to Postgres as each question is revealed so a crash loses
 * at most the question in flight. If you ever run more than one app container,
 * this needs to move to Redis or be pinned to one instance.
 */

type Player = {
  teamId: number;
  name: string;
  emoji: string;
  points: number;
  delta: number;
  sockets: Set<WebSocket>;
};

type LoadedQuestion = {
  id: number;
  kind: "choice" | "text";
  prompt: string;
  imageUrl: string | null;
  options: string[];
  answers: string[];
  timeLimitSeconds: number;
  points: number;
};

type Answer = {
  value: string;
  correct: boolean;
  elapsedMs: number;
  points: number;
};

type Room = {
  code: string;
  sessionId: number;
  quizTitle: string;
  questions: LoadedQuestion[];
  index: number;
  phase: RoomPhase;
  players: Map<number, Player>;
  hosts: Set<WebSocket>;
  answers: Map<number, Answer>;
  questionStartedAt: number;
  timer: ReturnType<typeof setTimeout> | null;
};

const rooms = new Map<string, Room>();

/**
 * In-flight `loadRoom` calls. Without this, two teams tapping "join" at the
 * same moment both miss the `rooms` cache while the other is still awaiting
 * Postgres, and each builds its own Room — so the host ends up controlling a
 * room that half the participants are not in.
 */
const loading = new Map<string, Promise<Room | null>>();

/* ------------------------------------------------------------ utilities */

function send(socket: WebSocket, message: ServerMessage): void {
  if (socket.readyState === socket.OPEN) socket.send(JSON.stringify(message));
}

function broadcast(room: Room, message: ServerMessage, includeHosts = true): void {
  for (const player of room.players.values()) {
    for (const socket of player.sockets) send(socket, message);
  }
  if (includeHosts) for (const socket of room.hosts) send(socket, message);
}

function sendToHosts(room: Room, message: ServerMessage): void {
  for (const socket of room.hosts) send(socket, message);
}

function sendToPlayer(room: Room, teamId: number, message: ServerMessage): void {
  const player = room.players.get(teamId);
  if (!player) return;
  for (const socket of player.sockets) send(socket, message);
}

function lobbyTeams(room: Room): LobbyTeam[] {
  return [...room.players.values()].map((p) => ({
    teamId: p.teamId,
    name: p.name,
    emoji: p.emoji,
  }));
}

function standings(room: Room): Standing[] {
  return [...room.players.values()]
    .map((p) => ({ teamId: p.teamId, name: p.name, emoji: p.emoji, points: p.points, delta: p.delta }))
    .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
}

function publicQuestion(room: Room): PublicQuestion {
  const q = room.questions[room.index];
  return {
    id: q.id,
    index: room.index,
    total: room.questions.length,
    kind: q.kind,
    prompt: q.prompt,
    imageUrl: q.imageUrl,
    // Never leak the correct answer: for text questions the options array is
    // empty anyway, for choice questions the labels are not secret.
    options: q.kind === "choice" ? q.options : [],
    timeLimitSeconds: q.timeLimitSeconds,
    endsAt: room.questionStartedAt + q.timeLimitSeconds * 1000,
  };
}

/** Case- and whitespace-insensitive comparison for free-text answers. */
function normaliseText(value: string): string {
  return value.normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
}

function isCorrect(question: LoadedQuestion, value: string): boolean {
  if (question.kind === "choice") return question.answers.includes(value);
  const given = normaliseText(value);
  return question.answers.some((answer) => normaliseText(answer) === given);
}

/**
 * Speed-weighted scoring, the Kahoot shape: a correct answer is always worth
 * half the points, the other half decays linearly with the time taken.
 */
function scoreFor(question: LoadedQuestion, elapsedMs: number): number {
  const limitMs = question.timeLimitSeconds * 1000;
  const remaining = Math.max(0, Math.min(1, 1 - elapsedMs / limitMs));
  return Math.round(question.points * (0.5 + 0.5 * remaining));
}

/* ------------------------------------------------------- room life cycle */

/** Six characters, no vowels and no look-alikes, so it reads well on a beamer. */
const CODE_ALPHABET = "BCDFGHJKLMNPQRSTVWXZ23456789";

export function generateCode(length = 5): string {
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return out;
}

/**
 * Loads a session from the database into memory. Called lazily, so the app can
 * restart mid-event and rooms come back as soon as someone reconnects.
 */
async function loadRoom(code: string): Promise<Room | null> {
  const existing = rooms.get(code);
  if (existing) return existing;

  const inFlight = loading.get(code);
  if (inFlight) return inFlight;

  const pending = loadRoomUncached(code).finally(() => loading.delete(code));
  loading.set(code, pending);
  return pending;
}

async function loadRoomUncached(code: string): Promise<Room | null> {
  const [session] = await db
    .select()
    .from(liveSessions)
    .where(eq(liveSessions.code, code))
    .limit(1);
  if (!session || session.status === "ended") return null;

  const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, session.quizId)).limit(1);
  const rows = await db
    .select()
    .from(questions)
    .where(eq(questions.quizId, session.quizId))
    .orderBy(asc(questions.position));

  if (rows.length === 0) return null;

  const room: Room = {
    code,
    sessionId: session.id,
    quizTitle: quiz?.title ?? "Quiz",
    questions: rows.map((r) => ({
      id: r.id,
      kind: r.kind === "text" ? "text" : "choice",
      prompt: r.prompt,
      imageUrl: r.imageUrl,
      options: r.options ?? [],
      answers: r.answers ?? [],
      timeLimitSeconds: r.timeLimitSeconds,
      points: r.points,
    })),
    index: 0,
    phase: "lobby",
    players: new Map(),
    hosts: new Set(),
    answers: new Map(),
    questionStartedAt: 0,
    timer: null,
  };

  // Re-check: `hostAction` can create the room while this load was awaiting.
  const cached = rooms.get(code);
  if (cached) return cached;

  rooms.set(code, room);
  return room;
}

export async function roomExists(code: string): Promise<boolean> {
  return (await loadRoom(code)) !== null;
}

/* ----------------------------------------------------------- connections */

export async function joinAsPlayer(
  code: string,
  socket: WebSocket,
  team: { teamId: number; name: string; emoji: string },
): Promise<boolean> {
  const room = await loadRoom(code);
  if (!room) return false;

  let player = room.players.get(team.teamId);
  if (!player) {
    player = { ...team, points: 0, delta: 0, sockets: new Set() };
    room.players.set(team.teamId, player);
  } else {
    // Keep the freshest display name if the team changed it.
    player.name = team.name;
    player.emoji = team.emoji;
  }
  player.sockets.add(socket);

  send(socket, { t: "joined", role: "player", code, quizTitle: room.quizTitle });

  // Bring a late joiner (or a reconnect) straight to whatever is on screen.
  if (room.phase === "lobby") {
    broadcast(room, { t: "lobby", teams: lobbyTeams(room) });
  } else if (room.phase === "question") {
    send(socket, {
      t: "question",
      question: publicQuestion(room),
      answered: room.answers.has(team.teamId),
    });
    sendToHosts(room, {
      t: "answerCount",
      answered: room.answers.size,
      total: room.players.size,
    });
  } else if (room.phase === "reveal") {
    const q = room.questions[room.index];
    const own = room.answers.get(team.teamId);
    send(socket, {
      t: "reveal",
      questionId: q.id,
      correctAnswers: q.answers,
      distribution: distributionFor(room),
      you: own ? { correct: own.correct, points: own.points } : { correct: false, points: 0 },
      standings: standings(room),
      hasNext: room.index + 1 < room.questions.length,
    });
  } else {
    send(socket, { t: "ended", standings: standings(room) });
  }

  return true;
}

export async function joinAsHost(code: string, socket: WebSocket): Promise<boolean> {
  const room = await loadRoom(code);
  if (!room) return false;

  room.hosts.add(socket);
  send(socket, { t: "joined", role: "host", code, quizTitle: room.quizTitle });
  send(socket, { t: "lobby", teams: lobbyTeams(room) });

  if (room.phase === "question") {
    send(socket, { t: "question", question: publicQuestion(room), answered: false });
    send(socket, { t: "answerCount", answered: room.answers.size, total: room.players.size });
  } else if (room.phase === "ended") {
    send(socket, { t: "ended", standings: standings(room) });
  }

  return true;
}

export function leave(socket: WebSocket): void {
  for (const room of rooms.values()) {
    room.hosts.delete(socket);
    for (const player of room.players.values()) {
      if (player.sockets.delete(socket) && player.sockets.size === 0 && room.phase === "lobby") {
        // Only drop teams from the lobby list; mid-game we keep their score.
        room.players.delete(player.teamId);
        broadcast(room, { t: "lobby", teams: lobbyTeams(room) });
      }
    }
  }
}

/* -------------------------------------------------------------- gameplay */

function distributionFor(room: Room): number[] {
  const q = room.questions[room.index];
  if (q.kind !== "choice") return [];
  const counts = new Array<number>(q.options.length).fill(0);
  for (const answer of room.answers.values()) {
    const index = Number(answer.value);
    if (Number.isInteger(index) && index >= 0 && index < counts.length) counts[index] += 1;
  }
  return counts;
}

function clearTimer(room: Room): void {
  if (room.timer) {
    clearTimeout(room.timer);
    room.timer = null;
  }
}

function askCurrent(room: Room): void {
  clearTimer(room);
  room.phase = "question";
  room.answers = new Map();
  room.questionStartedAt = Date.now();
  for (const player of room.players.values()) player.delta = 0;

  const question = publicQuestion(room);
  broadcast(room, { t: "question", question, answered: false });
  sendToHosts(room, { t: "answerCount", answered: 0, total: room.players.size });

  room.timer = setTimeout(() => {
    void revealCurrent(room);
  }, question.timeLimitSeconds * 1000);
}

async function revealCurrent(room: Room): Promise<void> {
  if (room.phase !== "question") return;
  clearTimer(room);
  room.phase = "reveal";

  const q = room.questions[room.index];

  // Persist the round before announcing it, so a crash during the reveal does
  // not lose the answers we already scored.
  const rows = [...room.answers.entries()].map(([teamId, answer]) => ({
    sessionId: room.sessionId,
    questionId: q.id,
    teamId,
    value: answer.value,
    correct: answer.correct,
    elapsedMs: answer.elapsedMs,
    points: answer.points,
  }));
  if (rows.length > 0) {
    await db.insert(liveAnswers).values(rows).onConflictDoNothing();
  }

  const table = standings(room);
  const distribution = distributionFor(room);
  const hasNext = room.index + 1 < room.questions.length;

  for (const player of room.players.values()) {
    const own = room.answers.get(player.teamId);
    sendToPlayer(room, player.teamId, {
      t: "reveal",
      questionId: q.id,
      correctAnswers: q.answers,
      distribution,
      you: own ? { correct: own.correct, points: own.points } : { correct: false, points: 0 },
      standings: table,
      hasNext,
    });
  }

  sendToHosts(room, {
    t: "reveal",
    questionId: q.id,
    correctAnswers: q.answers,
    distribution,
    standings: table,
    hasNext,
  });
}

export function submitAnswer(
  code: string,
  teamId: number,
  questionId: number,
  value: string,
): void {
  const room = rooms.get(code);
  if (!room || room.phase !== "question") return;

  const q = room.questions[room.index];
  if (q.id !== questionId) return;
  if (room.answers.has(teamId)) return; // first answer counts, no changing it

  const elapsedMs = Date.now() - room.questionStartedAt;
  if (elapsedMs > q.timeLimitSeconds * 1000 + 750) return; // grace for latency

  const correct = isCorrect(q, value);
  const points = correct ? scoreFor(q, elapsedMs) : 0;

  room.answers.set(teamId, { value, correct, elapsedMs, points });

  const player = room.players.get(teamId);
  if (player) {
    player.points += points;
    player.delta = points;
  }

  sendToPlayer(room, teamId, { t: "answerAccepted", questionId });
  sendToHosts(room, {
    t: "answerCount",
    answered: room.answers.size,
    total: room.players.size,
  });

  // Everyone has answered — no reason to sit out the clock.
  if (room.answers.size >= room.players.size && room.players.size > 0) {
    void revealCurrent(room);
  }
}

export async function hostAction(
  code: string,
  action: "start" | "next" | "reveal" | "end",
): Promise<void> {
  const room = rooms.get(code) ?? (await loadRoom(code));
  if (!room) return;

  switch (action) {
    case "start": {
      if (room.phase !== "lobby") return;
      room.index = 0;
      await db
        .update(liveSessions)
        .set({ status: "running" })
        .where(eq(liveSessions.id, room.sessionId));
      askCurrent(room);
      return;
    }
    case "reveal": {
      await revealCurrent(room);
      return;
    }
    case "next": {
      if (room.phase === "question") await revealCurrent(room);
      if (room.index + 1 >= room.questions.length) {
        await endRoom(room);
        return;
      }
      room.index += 1;
      askCurrent(room);
      return;
    }
    case "end": {
      if (room.phase === "question") await revealCurrent(room);
      await endRoom(room);
      return;
    }
  }
}

async function endRoom(room: Room): Promise<void> {
  clearTimer(room);
  room.phase = "ended";

  // Fold the session score into the site-wide ledger. The unique index on
  // (team, source, ref, reason) makes this safe to run twice.
  const awards = [...room.players.values()]
    .filter((p) => p.points > 0)
    .map((p) => ({
      teamId: p.teamId,
      source: "live",
      sourceRef: String(room.sessionId),
      reason: "quiz",
      points: p.points,
    }));
  if (awards.length > 0) {
    await db.insert(scoreEvents).values(awards).onConflictDoNothing();
  }

  await db
    .update(liveSessions)
    .set({ status: "ended", endedAt: new Date() })
    .where(eq(liveSessions.id, room.sessionId));

  broadcast(room, { t: "ended", standings: standings(room) });
  rooms.delete(room.code);
}

/** Used by the admin UI to show what is currently live without a socket. */
export function roomSummary(code: string): { phase: RoomPhase; players: number } | null {
  const room = rooms.get(code);
  return room ? { phase: room.phase, players: room.players.size } : null;
}

/** Exported for the admin API: has this team already been scored for a session? */
export async function sessionAlreadyScored(sessionId: number, teamId: number): Promise<boolean> {
  const [row] = await db
    .select({ id: scoreEvents.id })
    .from(scoreEvents)
    .where(
      and(
        eq(scoreEvents.teamId, teamId),
        eq(scoreEvents.source, "live"),
        eq(scoreEvents.sourceRef, String(sessionId)),
      ),
    )
    .limit(1);
  return Boolean(row);
}
