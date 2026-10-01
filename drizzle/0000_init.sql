CREATE TABLE "teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"name_key" text NOT NULL,
	"passphrase_hash" text NOT NULL,
	"emoji" text DEFAULT '🐝' NOT NULL,
	"idea" text DEFAULT '' NOT NULL,
	"members" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"looking_for_members" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "teams_name_key_idx" ON "teams" USING btree ("name_key");