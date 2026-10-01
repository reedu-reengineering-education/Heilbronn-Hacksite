import {
  boolean,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

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
    /** Purely decorative; gives each team a recognisable marker on the overview. */
    emoji: text("emoji").notNull().default("🐝"),
    /** What the team is building. Free text, shown on the overview. */
    idea: text("idea").notNull().default(""),
    /** Display names of the people on the team, in the order the team set. */
    members: jsonb("members").$type<string[]>().notNull().default([]),
    /** Shown as an "open spots" badge so solo participants can find a team. */
    lookingForMembers: boolean("looking_for_members").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("teams_name_key_idx").on(t.nameKey)],
);

export type Team = typeof teams.$inferSelect;
