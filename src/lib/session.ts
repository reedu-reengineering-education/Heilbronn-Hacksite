import { cookies } from "next/headers";
import {
  MAX_AGE_SECONDS,
  TEAM_COOKIE,
  signTeamToken,
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

export { TEAM_COOKIE };
export type { TeamSession };
