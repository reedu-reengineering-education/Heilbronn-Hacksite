import type { Metadata } from "next";
import { asc, count, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { teams, votes } from "@/lib/db/schema";
import { dictionary as d } from "@/i18n";
import { hasResultsSession } from "@/lib/session";
import { Section } from "@/components/ui";
import { PassphraseGate } from "../vote/VoteForms";
import { enterResultsAction } from "../vote/actions";
import { Reveal } from "./Reveal";

export const metadata: Metadata = { title: d.results.title, robots: { index: false } };
export const dynamic = "force-dynamic";

const PLACES = 5;

export default async function ResultsPage() {
  if (!(await hasResultsSession())) {
    return (
      <Section title={d.results.title}>
        <PassphraseGate d={d} intro={d.results.gateIntro} action={enterResultsAction} />
      </Section>
    );
  }

  const votesCount = count(votes.voterId);
  // Left join so teams without votes still fill up the places.
  const ranking = await db
    .select({ id: teams.id, name: teams.name, emoji: teams.emoji, votes: votesCount })
    .from(teams)
    .leftJoin(votes, eq(votes.teamId, teams.id))
    .groupBy(teams.id)
    .orderBy(desc(votesCount), asc(teams.name))
    .limit(PLACES);

  return (
    <Section title={d.results.title}>
      <Reveal d={d} ranking={ranking} />
    </Section>
  );
}
