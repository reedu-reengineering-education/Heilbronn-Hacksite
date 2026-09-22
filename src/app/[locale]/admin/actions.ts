"use server";

import { and, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import { db } from "@/lib/db";
import { liveSessions, submissions } from "@/lib/db/schema";
import { clearAdminSession, isAdmin, setAdminSession } from "@/lib/session";
import { generateCode } from "@/lib/live/engine";
import { award } from "@/lib/scores";
import { isLocale } from "@/i18n/config";

export type AdminState = { error: string | null };

function locale(formData: FormData): string {
  const value = String(formData.get("locale") ?? "de");
  return isLocale(value) ? value : "de";
}

async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new Error("Not authorised");
}

/* ----------------------------------------------------------------- login */

export async function adminLoginAction(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const given = String(formData.get("passphrase") ?? "");
  const expected = process.env.ADMIN_PASSPHRASE ?? "";

  if (!expected) return { error: "notConfigured" };

  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return { error: "badPassphrase" };

  await setAdminSession();
  revalidatePath("/", "layout");
  redirect(`/${locale(formData)}/admin`);
}

export async function adminLogoutAction(formData: FormData): Promise<void> {
  await clearAdminSession();
  revalidatePath("/", "layout");
  redirect(`/${locale(formData)}/admin`);
}

/* ------------------------------------------------------------ live quiz */

/**
 * Creates a session for a quiz and sends the organiser to the host console.
 * `scheduledAt` is optional — leave it blank to make the session joinable
 * (showing the waiting lobby) immediately, or set a time so it only appears
 * on the games page once that time arrives. Either way, revealing the first
 * question is still a manual step in the host console.
 */
export async function startSessionAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const quizId = Number(formData.get("quizId"));
  if (!Number.isInteger(quizId)) return;

  const scheduledRaw = String(formData.get("scheduledAt") ?? "").trim();
  const scheduledAt = scheduledRaw ? new Date(scheduledRaw) : null;
  if (scheduledAt && Number.isNaN(scheduledAt.getTime())) return;

  // Retry on the very unlikely code collision.
  let code = generateCode();
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const [existing] = await db
      .select({ id: liveSessions.id })
      .from(liveSessions)
      .where(eq(liveSessions.code, code))
      .limit(1);
    if (!existing) break;
    code = generateCode();
  }

  await db.insert(liveSessions).values({ code, quizId, status: "lobby", scheduledAt });
  redirect(`/${locale(formData)}/admin/live/${code}`);
}

/* --------------------------------------------------------- manual points */

/**
 * Manual awards, for embedded games and anything that happens off-site.
 * `reason` doubles as the idempotency key, so give each award its own label.
 */
export async function awardPointsAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const teamId = Number(formData.get("teamId"));
  const points = Number(formData.get("points"));
  const reason = String(formData.get("reason") ?? "").trim() || "manual";
  if (!Number.isInteger(teamId) || !Number.isFinite(points) || points === 0) return;

  await award({
    teamId,
    source: "manual",
    sourceRef: new Date().toISOString().slice(0, 16),
    reason,
    points: Math.trunc(points),
  });

  revalidatePath("/", "layout");
}

/* ------------------------------------------------------------- helpers */

export async function countSubmissions(challengeId: number): Promise<number> {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(submissions)
    .where(and(eq(submissions.challengeId, challengeId)));
  return row?.count ?? 0;
}
