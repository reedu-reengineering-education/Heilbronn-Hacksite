ALTER TABLE "votes" DROP CONSTRAINT "votes_pkey";--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_voter_id_team_id_pk" PRIMARY KEY("voter_id","team_id");
