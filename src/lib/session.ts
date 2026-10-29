import { cookies } from "next/headers";
import {
  MAX_AGE_SECONDS,
  RESULTS_COOKIE,
  TEAM_COOKIE,
  VOTER_COOKIE,
  signResultsToken,
  signTeamToken,
  signVoterToken,
  verifyResultsToken,
  verifyTeamToken,
  verifyVoterToken,
  type TeamSession,
  type VoterSession,
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

/* ---------------------------------------------------------------- voting */

export async function setVoterSession(session: VoterSession): Promise<void> {
  const store = await cookies();
  store.set(VOTER_COOKIE, await signVoterToken(session), cookieOptions);
}

export async function getVoterSession(): Promise<VoterSession | null> {
  const store = await cookies();
  const token = store.get(VOTER_COOKIE)?.value;
  if (!token) return null;
  return verifyVoterToken(token);
}

export async function setResultsSession(): Promise<void> {
  const store = await cookies();
  store.set(RESULTS_COOKIE, await signResultsToken(), cookieOptions);
}

export async function hasResultsSession(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(RESULTS_COOKIE)?.value;
  if (!token) return false;
  return verifyResultsToken(token);
}

export { TEAM_COOKIE };
export type { TeamSession, VoterSession };
