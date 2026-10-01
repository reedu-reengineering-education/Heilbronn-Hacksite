"use server";

import { and, eq, ne } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { teams } from "@/lib/db/schema";
import {
  MAX_IDEA_LENGTH,
  MAX_MEMBERS,
  hashPassphrase,
  isAdminPassphrase,
  parseMembers,
  teamNameKey,
  validatePassphrase,
  validateTeamName,
  verifyPassphrase,
} from "@/lib/auth";
import { clearTeamSession, getTeamSession, setTeamSession } from "@/lib/session";
import { TEAM_EMOJIS } from "@/content/team-emojis";

/**
 * Sign-up, sign-in and team management. Errors are returned as dictionary keys
 * so the page can render them from the dictionary.
 */

export type TeamFormState = { error: string | null; saved?: boolean };

function nameErrorKey(name: string): string | null {
  const error = validateTeamName(name);
  if (!error) return null;
  return error === "tooShort" ? "nameTooShort" : "nameTooLong";
}

function passphraseErrorKey(passphrase: string): string | null {
  const error = validatePassphrase(passphrase);
  if (!error) return null;
  return error === "tooShort" ? "passphraseTooShort" : "passphraseTooLong";
}

function pickEmoji(formData: FormData): string {
  const emoji = String(formData.get("emoji") ?? "");
  return TEAM_EMOJIS.includes(emoji) ? emoji : TEAM_EMOJIS[0];
}

function revalidateTeams(): void {
  revalidatePath("/teams");
  revalidatePath("/team");
}

export async function signUpAction(
  _prev: TeamFormState,
  formData: FormData,
): Promise<TeamFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const passphrase = String(formData.get("passphrase") ?? "");

  const error = nameErrorKey(name) ?? passphraseErrorKey(passphrase);
  if (error) return { error };

  const key = teamNameKey(name);
  const [existing] = await db.select({ id: teams.id }).from(teams).where(eq(teams.nameKey, key));
  if (existing) return { error: "nameTaken" };

  let created;
  try {
    [created] = await db
      .insert(teams)
      .values({
        name,
        nameKey: key,
        emoji: pickEmoji(formData),
        passphraseHash: await hashPassphrase(passphrase),
      })
      .returning();
  } catch {
    // Unique index race: someone claimed the name between the check and here.
    return { error: "nameTaken" };
  }

  await setTeamSession({ teamId: created.id, name: created.name, emoji: created.emoji });
  revalidateTeams();
  redirect("/team");
}

/** The organiser passphrase (ADMIN_PASSPHRASE) works for every team. */
export async function signInAction(
  _prev: TeamFormState,
  formData: FormData,
): Promise<TeamFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const passphrase = String(formData.get("passphrase") ?? "");

  const [team] = await db.select().from(teams).where(eq(teams.nameKey, teamNameKey(name)));

  if (!team || !(isAdminPassphrase(passphrase) || (await verifyPassphrase(passphrase, team.passphraseHash)))) {
    return { error: "badCredentials" };
  }

  await setTeamSession({ teamId: team.id, name: team.name, emoji: team.emoji });
  redirect("/team");
}

export async function signOutAction(): Promise<void> {
  await clearTeamSession();
  redirect("/team");
}

export async function updateTeamAction(
  _prev: TeamFormState,
  formData: FormData,
): Promise<TeamFormState> {
  const session = await getTeamSession();
  if (!session) return { error: "notSignedIn" };

  const name = String(formData.get("name") ?? "").trim();
  const idea = String(formData.get("idea") ?? "").trim();
  const members = parseMembers(String(formData.get("members") ?? ""));
  const newPassphrase = String(formData.get("newPassphrase") ?? "");

  const error =
    nameErrorKey(name) ??
    (newPassphrase ? passphraseErrorKey(newPassphrase) : null) ??
    (idea.length > MAX_IDEA_LENGTH ? "ideaTooLong" : null) ??
    (members.length > MAX_MEMBERS ? "tooManyMembers" : null);
  if (error) return { error };

  const key = teamNameKey(name);
  const [clash] = await db
    .select({ id: teams.id })
    .from(teams)
    .where(and(eq(teams.nameKey, key), ne(teams.id, session.teamId)));
  if (clash) return { error: "nameTaken" };

  const emoji = pickEmoji(formData);
  let updated;
  try {
    [updated] = await db
      .update(teams)
      .set({
        name,
        nameKey: key,
        emoji,
        idea,
        members,
        // A full team cannot be looking for more people.
        lookingForMembers:
          members.length < MAX_MEMBERS && formData.get("lookingForMembers") === "on",
        ...(newPassphrase ? { passphraseHash: await hashPassphrase(newPassphrase) } : {}),
      })
      .where(eq(teams.id, session.teamId))
      .returning({ id: teams.id });
  } catch {
    return { error: "nameTaken" };
  }
  // The team was deleted (by an organiser) while this session was still open.
  if (!updated) return { error: "notSignedIn" };

  await setTeamSession({ teamId: session.teamId, name, emoji });
  revalidateTeams();
  return { error: null, saved: true };
}

export async function deleteTeamAction(): Promise<void> {
  const session = await getTeamSession();
  if (!session) return;

  await db.delete(teams).where(eq(teams.id, session.teamId));
  await clearTeamSession();
  revalidateTeams();
  redirect("/teams");
}
