import { jwtVerify, SignJWT } from "jose";

/** Token signing and verification. Cookie handling lives in `session.ts`. */

export const TEAM_COOKIE = "hacksite_team";
export const MAX_AGE_SECONDS = 60 * 60 * 24 * 14; // two weeks covers a hackathon week

export type TeamSession = {
  teamId: number;
  name: string;
  emoji: string;
};

function secret(): Uint8Array {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 16) {
    throw new Error(
      "SESSION_SECRET is missing or too short. Set it in .env (32+ random characters).",
    );
  }
  return new TextEncoder().encode(value);
}

export async function signTeamToken(session: TeamSession): Promise<string> {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secret());
}

export async function verifyTeamToken(token: string): Promise<TeamSession | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    if (typeof payload.teamId !== "number" || typeof payload.name !== "string") return null;
    return {
      teamId: payload.teamId,
      name: payload.name,
      emoji: typeof payload.emoji === "string" ? payload.emoji : "🐝",
    };
  } catch {
    return null;
  }
}
