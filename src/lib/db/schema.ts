import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * Scheduling model for the minigames: every game type carries its own
 * begin/end time(s) rather than a manually-flipped switch, so the games page
 * can compute what is live right now and what's next without an organiser
 * having to remember to turn anything on or off. See `src/lib/schedule.ts`.
 */

/* ------------------------------------------------------------------ teams */

/**
 * A team is the only account type on the site. There is no email and no
 * per-person login: members share a team name + passphrase. `nameKey` is the
 * normalised (lowercased, whitespace-collapsed) name used for uniqueness and
 * login lookups, so "Team Rocket" and "team  rocket" are the same team.
 */
export const teams = pgTable(
  "teams",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    nameKey: text("name_key").notNull(),
    passphraseHash: text("passphrase_hash").notNull(),
    /** Purely decorative; gives each team a recognisable marker on boards. */
    emoji: text("emoji").notNull().default("🐝"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("teams_name_key_idx").on(t.nameKey)],
);

/* ------------------------------------------------------------- scoreboard */

/**
 * Append-only points ledger. The leaderboard is a SUM over this table, which
 * means any new game type only has to insert rows here to take part — nothing
 * else needs to know the game exists.
 *
 * `source` is a free-form kind ("live", "judge", "manual", ...) and
 * `sourceRef` identifies the thing within that kind (session id, slug, ...).
 */
export const scoreEvents = pgTable(
  "score_events",
  {
    id: serial("id").primaryKey(),
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    source: text("source").notNull(),
    sourceRef: text("source_ref").notNull().default(""),
    reason: text("reason").notNull().default(""),
    points: integer("points").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("score_events_team_idx").on(t.teamId),
    // Lets a game award points idempotently: same source+ref+team only once.
    uniqueIndex("score_events_unique_award_idx").on(t.teamId, t.source, t.sourceRef, t.reason),
  ],
);

/* ------------------------------------------------------------- live quiz */

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * `kind` is "choice" (multiple choice, one correct) or "text" (free text,
 * matched case-insensitively against any of `answers`).
 *
 * For "choice", `options` holds the answer labels and `answers` holds the
 * index of the correct one as a string, e.g. ["2"].
 */
export const questions = pgTable(
  "questions",
  {
    id: serial("id").primaryKey(),
    quizId: integer("quiz_id")
      .notNull()
      .references(() => quizzes.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    kind: text("kind").notNull().default("choice"),
    prompt: text("prompt").notNull(),
    imageUrl: text("image_url"),
    options: jsonb("options").$type<string[]>().notNull().default([]),
    answers: jsonb("answers").$type<string[]>().notNull().default([]),
    timeLimitSeconds: integer("time_limit_seconds").notNull().default(25),
    points: integer("points").notNull().default(1000),
  },
  (t) => [uniqueIndex("questions_quiz_position_idx").on(t.quizId, t.position)],
);

/** One run of a quiz. `code` is what participants type in to join. */
export const liveSessions = pgTable(
  "live_sessions",
  {
    id: serial("id").primaryKey(),
    code: text("code").notNull(),
    quizId: integer("quiz_id")
      .notNull()
      .references(() => quizzes.id, { onDelete: "cascade" }),
    /** "lobby" | "running" | "ended" */
    status: text("status").notNull().default("lobby"),
    /**
     * When the organiser plans to run this. Purely for the countdown on the
     * games page — the session is joinable (shows the waiting lobby) as soon
     * as this time passes, but a host still has to click "Start" to reveal
     * the first question. Null means "no fixed time, live as soon as created".
     */
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    endedAt: timestamp("ended_at", { withTimezone: true }),
  },
  (t) => [uniqueIndex("live_sessions_code_idx").on(t.code)],
);

/** One team's answer to one question. Kept for review and for re-scoring. */
export const liveAnswers = pgTable(
  "live_answers",
  {
    id: serial("id").primaryKey(),
    sessionId: integer("session_id")
      .notNull()
      .references(() => liveSessions.id, { onDelete: "cascade" }),
    questionId: integer("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    value: text("value").notNull(),
    correct: boolean("correct").notNull(),
    elapsedMs: integer("elapsed_ms").notNull(),
    points: integer("points").notNull(),
  },
  (t) => [uniqueIndex("live_answers_unique_idx").on(t.sessionId, t.questionId, t.teamId)],
);

/* -------------------------------------------------- judged (voted) rounds */

/**
 * The "submit, then everyone judges" game. The four timestamps below are the
 * schedule; the current stage (upcoming/submit/waiting/vote/closed) is always
 * computed from them and "now" — see `challengeStage()` in
 * `src/lib/schedule.ts` — rather than stored, so it can never drift out of
 * sync with the clock the organiser actually planned around.
 */
export const challenges = pgTable(
  "challenges",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    prompt: text("prompt").notNull().default(""),
    /** "text" | "image" */
    submissionKind: text("submission_kind").notNull().default("text"),
    submitStartsAt: timestamp("submit_starts_at", { withTimezone: true }).notNull(),
    submitEndsAt: timestamp("submit_ends_at", { withTimezone: true }).notNull(),
    voteStartsAt: timestamp("vote_starts_at", { withTimezone: true }).notNull(),
    voteEndsAt: timestamp("vote_ends_at", { withTimezone: true }).notNull(),
    votesPerTeam: integer("votes_per_team").notNull().default(3),
    /** Points awarded per vote received once the voting window closes. */
    pointsPerVote: integer("points_per_vote").notNull().default(100),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("challenges_slug_idx").on(t.slug)],
);

export const submissions = pgTable(
  "submissions",
  {
    id: serial("id").primaryKey(),
    challengeId: integer("challenge_id")
      .notNull()
      .references(() => challenges.id, { onDelete: "cascade" }),
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    body: text("body").notNull().default(""),
    imagePath: text("image_path"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  // One entry per team per challenge; re-submitting updates the same row.
  (t) => [uniqueIndex("submissions_unique_idx").on(t.challengeId, t.teamId)],
);

export const votes = pgTable(
  "votes",
  {
    id: serial("id").primaryKey(),
    challengeId: integer("challenge_id")
      .notNull()
      .references(() => challenges.id, { onDelete: "cascade" }),
    submissionId: integer("submission_id")
      .notNull()
      .references(() => submissions.id, { onDelete: "cascade" }),
    /** The team casting the vote, not the team being voted for. */
    voterTeamId: integer("voter_team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  // A team may not spend two votes on the same entry.
  (t) => [uniqueIndex("votes_unique_idx").on(t.submissionId, t.voterTeamId)],
);

/* ---------------------------------------------------- embedded activities */

/**
 * Anything that is really "someone else's page in an iframe": OpenGuessr,
 * an H5P activity, a Google Form, a Miro board. Adding one is a DB row, not
 * a deploy. Like the judged challenges, visibility is entirely time-driven —
 * it appears on the games page between `startsAt` and `endsAt` and nowhere
 * else, so there is no permanent "more games" section to maintain.
 */
export const embeds = pgTable(
  "embeds",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    url: text("url").notNull(),
    /** Free-form label shown as a badge, e.g. "OpenGuessr" or "H5P". */
    kind: text("kind").notNull().default("iframe"),
    /** Iframe aspect ratio, width/height. 16/9 = 1.777… */
    aspectRatio: text("aspect_ratio").notNull().default("16 / 9"),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
  },
  (t) => [uniqueIndex("embeds_slug_idx").on(t.slug)],
);
