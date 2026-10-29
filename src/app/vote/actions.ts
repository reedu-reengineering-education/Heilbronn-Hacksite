"use server";

import { randomUUID } from "node:crypto";
import { and, count, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { VOTES_PER_VOTER, teams, votes } from "@/lib/db/schema";
import { isAdminPassphrase, isVotePassphrase } from "@/lib/auth";
import { getVoterSession, setResultsSession, setVoterSession } from "@/lib/session";

/**
 * Audience voting. Entering VOTE_PASSPHRASE gives the browser an anonymous
 * voter id (in a signed cookie); the votes themselves live in the database so
 * the results page can count them. Each voter gets VOTES_PER_VOTER votes, at
 * most one per team. Errors are dictionary keys, as on /team.
 */

export type VoteFormState = { error: string | null };

export async function enterVoteAction(
  _prev: VoteFormState,
  formData: FormData,
): Promise<VoteFormState> {
  if (!isVotePassphrase(String(formData.get("passphrase") ?? ""))) {
    return { error: "badPassphrase" };
  }

  // Keep the existing id so re-entering the passphrase doesn't orphan a vote.
  const existing = await getVoterSession();
  await setVoterSession({ voterId: existing?.voterId ?? randomUUID() });
  redirect("/vote");
}

export async function castVoteAction(
  _prev: VoteFormState,
  formData: FormData,
): Promise<VoteFormState> {
  const session = await getVoterSession();
  if (!session || !process.env.VOTE_PASSPHRASE) return { error: "noAccess" };

  const teamId = Number(formData.get("teamId"));
  if (!Number.isInteger(teamId)) return { error: "unknownTeam" };

  const [team] = await db.select({ id: teams.id }).from(teams).where(eq(teams.id, teamId));
  if (!team) return { error: "unknownTeam" };

  const [{ used }] = await db
    .select({ used: count() })
    .from(votes)
    .where(eq(votes.voterId, session.voterId));
  if (used >= VOTES_PER_VOTER) return { error: "noVotesLeft" };

  try {
    // A second vote for the same team is a no-op.
    await db.insert(votes).values({ voterId: session.voterId, teamId }).onConflictDoNothing();
  } catch {
    // The team was deleted between the check and here.
    return { error: "unknownTeam" };
  }

  revalidatePath("/vote");
  return { error: null };
}

export async function deleteVoteAction(formData: FormData): Promise<void> {
  const session = await getVoterSession();
  if (!session) return;

  const teamId = Number(formData.get("teamId"));
  if (!Number.isInteger(teamId)) return;

  await db
    .delete(votes)
    .where(and(eq(votes.voterId, session.voterId), eq(votes.teamId, teamId)));
  revalidatePath("/vote");
}

/** The results page is for organisers, so it takes ADMIN_PASSPHRASE. */
export async function enterResultsAction(
  _prev: VoteFormState,
  formData: FormData,
): Promise<VoteFormState> {
  if (!isAdminPassphrase(String(formData.get("passphrase") ?? ""))) {
    return { error: "badPassphrase" };
  }

  await setResultsSession();
  redirect("/results");
}
