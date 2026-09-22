CREATE TABLE "challenges" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"prompt" text DEFAULT '' NOT NULL,
	"submission_kind" text DEFAULT 'text' NOT NULL,
	"submit_starts_at" timestamp with time zone NOT NULL,
	"submit_ends_at" timestamp with time zone NOT NULL,
	"vote_starts_at" timestamp with time zone NOT NULL,
	"vote_ends_at" timestamp with time zone NOT NULL,
	"votes_per_team" integer DEFAULT 3 NOT NULL,
	"points_per_vote" integer DEFAULT 100 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "embeds" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"url" text NOT NULL,
	"kind" text DEFAULT 'iframe' NOT NULL,
	"aspect_ratio" text DEFAULT '16 / 9' NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "live_answers" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" integer NOT NULL,
	"question_id" integer NOT NULL,
	"team_id" integer NOT NULL,
	"value" text NOT NULL,
	"correct" boolean NOT NULL,
	"elapsed_ms" integer NOT NULL,
	"points" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "live_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"quiz_id" integer NOT NULL,
	"status" text DEFAULT 'lobby' NOT NULL,
	"scheduled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ended_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"quiz_id" integer NOT NULL,
	"position" integer NOT NULL,
	"kind" text DEFAULT 'choice' NOT NULL,
	"prompt" text NOT NULL,
	"image_url" text,
	"options" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"answers" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"time_limit_seconds" integer DEFAULT 25 NOT NULL,
	"points" integer DEFAULT 1000 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quizzes" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "score_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"team_id" integer NOT NULL,
	"source" text NOT NULL,
	"source_ref" text DEFAULT '' NOT NULL,
	"reason" text DEFAULT '' NOT NULL,
	"points" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"challenge_id" integer NOT NULL,
	"team_id" integer NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"image_path" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"name_key" text NOT NULL,
	"passphrase_hash" text NOT NULL,
	"emoji" text DEFAULT '🐝' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "votes" (
	"id" serial PRIMARY KEY NOT NULL,
	"challenge_id" integer NOT NULL,
	"submission_id" integer NOT NULL,
	"voter_team_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "live_answers" ADD CONSTRAINT "live_answers_session_id_live_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."live_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "live_answers" ADD CONSTRAINT "live_answers_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "live_answers" ADD CONSTRAINT "live_answers_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "live_sessions" ADD CONSTRAINT "live_sessions_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "score_events" ADD CONSTRAINT "score_events_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_voter_team_id_teams_id_fk" FOREIGN KEY ("voter_team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "challenges_slug_idx" ON "challenges" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "embeds_slug_idx" ON "embeds" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "live_answers_unique_idx" ON "live_answers" USING btree ("session_id","question_id","team_id");--> statement-breakpoint
CREATE UNIQUE INDEX "live_sessions_code_idx" ON "live_sessions" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX "questions_quiz_position_idx" ON "questions" USING btree ("quiz_id","position");--> statement-breakpoint
CREATE INDEX "score_events_team_idx" ON "score_events" USING btree ("team_id");--> statement-breakpoint
CREATE UNIQUE INDEX "score_events_unique_award_idx" ON "score_events" USING btree ("team_id","source","source_ref","reason");--> statement-breakpoint
CREATE UNIQUE INDEX "submissions_unique_idx" ON "submissions" USING btree ("challenge_id","team_id");--> statement-breakpoint
CREATE UNIQUE INDEX "teams_name_key_idx" ON "teams" USING btree ("name_key");--> statement-breakpoint
CREATE UNIQUE INDEX "votes_unique_idx" ON "votes" USING btree ("submission_id","voter_team_id");