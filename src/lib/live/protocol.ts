/**
 * Message shapes shared by the WebSocket server and the browser clients.
 * Keep this file free of imports so both sides can use it unchanged.
 */

export type QuestionKind = "choice" | "text";

/** What a player is allowed to see while a question is open. */
export type PublicQuestion = {
  id: number;
  index: number;
  total: number;
  kind: QuestionKind;
  prompt: string;
  imageUrl: string | null;
  options: string[];
  timeLimitSeconds: number;
  /** Epoch milliseconds; the client counts down to this. */
  endsAt: number;
};

export type Standing = {
  teamId: number;
  name: string;
  emoji: string;
  points: number;
  /** Points gained on the question just revealed. */
  delta: number;
};

export type LobbyTeam = { teamId: number; name: string; emoji: string };

export type RoomPhase = "lobby" | "question" | "reveal" | "ended";

/* ------------------------------------------------------- client -> server */

export type ClientMessage =
  | {
      t: "hello";
      code: string;
      /** Team session JWT; required for role "player". */
      token?: string;
      /** Admin session JWT; required for role "host". */
      adminToken?: string;
      role: "player" | "host";
    }
  | { t: "answer"; questionId: number; value: string }
  | { t: "host"; action: "start" | "next" | "reveal" | "end" }
  | { t: "ping" };

/* ------------------------------------------------------- server -> client */

export type ServerMessage =
  | { t: "joined"; role: "player" | "host"; code: string; quizTitle: string }
  | { t: "error"; code: "notFound" | "unauthorized" | "badRequest"; message: string }
  | { t: "lobby"; teams: LobbyTeam[] }
  | {
      t: "question";
      question: PublicQuestion;
      /** True if this client already answered (e.g. after a reconnect). */
      answered: boolean;
    }
  | { t: "answerCount"; answered: number; total: number }
  | { t: "answerAccepted"; questionId: number }
  | {
      t: "reveal";
      questionId: number;
      /** For "choice": the correct option index as a string. */
      correctAnswers: string[];
      /** How many teams picked each option; choice questions only. */
      distribution: number[];
      /** Only sent to the player it concerns. */
      you?: { correct: boolean; points: number };
      standings: Standing[];
      hasNext: boolean;
    }
  | { t: "ended"; standings: Standing[] }
  | { t: "pong" };

/** Narrowing helper so client code can `switch` without casts. */
export function parseServerMessage(raw: string): ServerMessage | null {
  try {
    const value = JSON.parse(raw) as ServerMessage;
    return typeof value?.t === "string" ? value : null;
  } catch {
    return null;
  }
}
