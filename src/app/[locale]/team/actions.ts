"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { teams } from "@/lib/db/schema";
import {
  hashPassphrase,
  teamNameKey,
  validatePassphrase,
  validateTeamName,
  verifyPassphrase,
} from "@/lib/auth";
import { clearTeamSession, setTeamSession } from "@/lib/session";
import { isLocale } from "@/i18n/config";

/**
 * Sign-up and sign-in for teams. Errors are returned as dictionary keys so the
 * page can render them in the visitor's language.
 */

export type TeamFormState = { error: string | null };

function locale(formData: FormData): string {
  const value = String(formData.get("locale") ?? "de");
  return isLocale(value) ? value : "de";
}

/**
 * These forms are embedded on more than one page (the team dashboard and the
 * games page prompt), so where they send you back to is a hidden `next`
 * field rather than a hard-coded path. Only ever redirects within the current
 * locale's section of the site.
 */
function redirectTarget(formData: FormData): string {
  const loc = locale(formData);
  const next = String(formData.get("next") ?? "");
  if (next === `/${loc}` || next.startsWith(`/${loc}/`)) return next;
  return `/${loc}/team`;
}

export async function signUpAction(
  _prev: TeamFormState,
  formData: FormData,
): Promise<TeamFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const passphrase = String(formData.get("passphrase") ?? "");
  const emoji = String(formData.get("emoji") ?? "🐝").slice(0, 8) || "🐝";

  const nameError = validateTeamName(name);
  if (nameError) return { error: nameError === "tooShort" ? "nameTooShort" : "nameTooLong" };

  const passError = validatePassphrase(passphrase);
  if (passError) {
    return { error: passError === "tooShort" ? "passphraseTooShort" : "passphraseTooLong" };
  }

  const key = teamNameKey(name);
  const [existing] = await db.select().from(teams).where(eq(teams.nameKey, key)).limit(1);
  if (existing) return { error: "nameTaken" };

  let created;
  try {
    [created] = await db
      .insert(teams)
      .values({ name, nameKey: key, emoji, passphraseHash: await hashPassphrase(passphrase) })
      .returning();
  } catch {
    // Unique index race: someone claimed the name between the check and here.
    return { error: "nameTaken" };
  }

  await setTeamSession({ teamId: created.id, name: created.name, emoji: created.emoji });
  revalidatePath("/", "layout");
  redirect(redirectTarget(formData));
}

export async function signInAction(
  _prev: TeamFormState,
  formData: FormData,
): Promise<TeamFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const passphrase = String(formData.get("passphrase") ?? "");

  const [team] = await db
    .select()
    .from(teams)
    .where(eq(teams.nameKey, teamNameKey(name)))
    .limit(1);

  if (!team || !(await verifyPassphrase(passphrase, team.passphraseHash))) {
    return { error: "badCredentials" };
  }

  await setTeamSession({ teamId: team.id, name: team.name, emoji: team.emoji });
  revalidatePath("/", "layout");
  redirect(redirectTarget(formData));
}

export async function signOutAction(formData: FormData): Promise<void> {
  await clearTeamSession();
  revalidatePath("/", "layout");
  redirect(redirectTarget(formData));
}
