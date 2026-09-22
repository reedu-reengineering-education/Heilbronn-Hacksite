import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Stores participant images on a mounted volume rather than in Postgres, and
 * serves them back through /uploads/<name> (see app/uploads/[...path]/route.ts).
 */

export const UPLOAD_DIR = process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads");

const ALLOWED = new Map<string, string>([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
]);

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export type UploadResult = { ok: true; publicPath: string } | { ok: false; error: string };

export async function saveUpload(file: File): Promise<UploadResult> {
  if (file.size === 0) return { ok: false, error: "empty" };
  if (file.size > MAX_UPLOAD_BYTES) return { ok: false, error: "tooLarge" };

  const extension = ALLOWED.get(file.type);
  if (!extension) return { ok: false, error: "badType" };

  await mkdir(UPLOAD_DIR, { recursive: true });

  const name = `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, name), buffer);

  return { ok: true, publicPath: `/uploads/${name}` };
}
