import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  MAX_AGE_SECONDS,
  TEAM_COOKIE,
  signAdminToken,
  signTeamToken,
  verifyAdminToken,
  verifyTeamToken,
  type TeamSession,
} from "./session-core";

/** Cookie-backed sessions for Next.js server components and route handlers. */

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE_SECONDS,
} as const;

/* ------------------------------------------------------------------ team */

export async function setTeamSession(session: TeamSession): Promise<void> {
  const store = await cookies();
  store.set(TEAM_COOKIE, await signTeamToken(session), cookieOptions);
}

export async function clearTeamSession(): Promise<void> {
  const store = await cookies();
  store.delete(TEAM_COOKIE);
}

export async function getTeamSession(): Promise<TeamSession | null> {
  const store = await cookies();
  const token = store.get(TEAM_COOKIE)?.value;
  if (!token) return null;
  return verifyTeamToken(token);
}

/**
 * The raw token, handed to the browser so the live-quiz client can authenticate
 * its WebSocket. Cookies are not readable from JS (httpOnly), so the page
 * passes the token down as a prop instead.
 */
export async function getTeamToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(TEAM_COOKIE)?.value ?? null;
}

/* ----------------------------------------------------------------- admin */

export async function setAdminSession(): Promise<void> {
  const store = await cookies();
  store.set(ADMIN_COOKIE, await signAdminToken(), cookieOptions);
}

export async function clearAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}

export async function getAdminToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value ?? null;
}

export { TEAM_COOKIE, ADMIN_COOKIE };
export type { TeamSession };
