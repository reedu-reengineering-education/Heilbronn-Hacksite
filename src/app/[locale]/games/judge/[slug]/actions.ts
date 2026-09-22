"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { challenges, submissions, votes } from "@/lib/db/schema";
import { getTeamSession } from "@/lib/session";
import { challengeStage } from "@/lib/schedule";
import { saveUpload } from "@/lib/uploads";

export type JudgeState = { error: string | null; ok: boolean };

/** Submit (or replace) this team's entry while the challenge is in "submit". */
export async function submitEntryAction(
  _prev: JudgeState,
  formData: FormData,
): Promise<JudgeState> {
  const team = await getTeamSession();
  if (!team) return { error: "needTeam", ok: false };

  const slug = String(formData.get("slug") ?? "");
  const [challenge] = await db.select().from(challenges).where(eq(challenges.slug, slug)).limit(1);
  if (!challenge) return { error: "notFound", ok: false };
  if (challengeStage(challenge) !== "submit") return { error: "wrongPhase", ok: false };

  const body = String(formData.get("body") ?? "").trim().slice(0, 2000);
  let imagePath: string | null = null;

  if (challenge.submissionKind === "image") {
    const file = formData.get("image");
    if (file instanceof File && file.size > 0) {
      const result = await saveUpload(file);
      if (!result.ok) return { error: result.error, ok: false };
      imagePath = result.publicPath;
    }
  }

  if (!body && !imagePath) return { error: "empty", ok: false };

  await db
    .insert(submissions)
    .values({ challengeId: challenge.id, teamId: team.teamId, body, imagePath })
    .onConflictDoUpdate({
      target: [submissions.challengeId, submissions.teamId],
      // Keep the previous image if this submit was text-only.
      set: { body, ...(imagePath ? { imagePath } : {}) },
    });

  revalidatePath(`/[locale]/games/judge/${slug}`, "page");
  return { error: null, ok: true };
}

/** Cast one vote. Enforces the per-team budget and the no-self-vote rule. */
export async function voteAction(formData: FormData): Promise<void> {
  const team = await getTeamSession();
  if (!team) return;

  const slug = String(formData.get("slug") ?? "");
  const submissionId = Number(formData.get("submissionId"));
  if (!Number.isInteger(submissionId)) return;

  const [challenge] = await db.select().from(challenges).where(eq(challenges.slug, slug)).limit(1);
  if (!challenge || challengeStage(challenge) !== "vote") return;

  const [target] = await db
    .select()
    .from(submissions)
    .where(and(eq(submissions.id, submissionId), eq(submissions.challengeId, challenge.id)))
    .limit(1);
  if (!target || target.teamId === team.teamId) return;

  const [spent] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(votes)
    .where(and(eq(votes.challengeId, challenge.id), eq(votes.voterTeamId, team.teamId)));
  if ((spent?.count ?? 0) >= challenge.votesPerTeam) return;

  await db
    .insert(votes)
    .values({ challengeId: challenge.id, submissionId, voterTeamId: team.teamId })
    .onConflictDoNothing();

  revalidatePath(`/[locale]/games/judge/${slug}`, "page");
}

/** Take a vote back, so a team can redistribute before the phase closes. */
export async function unvoteAction(formData: FormData): Promise<void> {
  const team = await getTeamSession();
  if (!team) return;

  const slug = String(formData.get("slug") ?? "");
  const submissionId = Number(formData.get("submissionId"));
  if (!Number.isInteger(submissionId)) return;

  const [challenge] = await db.select().from(challenges).where(eq(challenges.slug, slug)).limit(1);
  if (!challenge || challengeStage(challenge) !== "vote") return;

  await db
    .delete(votes)
    .where(and(eq(votes.submissionId, submissionId), eq(votes.voterTeamId, team.teamId)));

  revalidatePath(`/[locale]/games/judge/${slug}`, "page");
}
