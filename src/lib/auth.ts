import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

const KEY_LEN = 64;

/**
 * Passphrase hashing with Node's built-in scrypt — no native modules, so the
 * Docker image stays a plain `node:*-alpine` with nothing to compile.
 *
 * Format: `scrypt$<salt-hex>$<hash-hex>`
 */
export async function hashPassphrase(passphrase: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scryptAsync(passphrase.normalize("NFKC"), salt, KEY_LEN);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export async function verifyPassphrase(passphrase: string, stored: string): Promise<boolean> {
  const [scheme, saltHex, hashHex] = stored.split("$");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;

  const expected = Buffer.from(hashHex, "hex");
  if (expected.length !== KEY_LEN) return false;

  const actual = await scryptAsync(passphrase.normalize("NFKC"), Buffer.from(saltHex, "hex"), KEY_LEN);
  return timingSafeEqual(actual, expected);
}

/**
 * Normalises a team name for uniqueness and login: case-insensitive and
 * whitespace-insensitive, so nobody is locked out by a stray capital letter.
 */
export function teamNameKey(name: string): string {
  return name.normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
}

export function validateTeamName(name: string): string | null {
  const trimmed = name.trim();
  if (trimmed.length < 2) return "tooShort";
  if (trimmed.length > 40) return "tooLong";
  return null;
}

export function validatePassphrase(passphrase: string): string | null {
  if (passphrase.length < 6) return "tooShort";
  if (passphrase.length > 200) return "tooLong";
  return null;
}
