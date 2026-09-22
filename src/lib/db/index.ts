import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ?? "postgres://hacksite:hacksite@localhost:5432/hacksite";

// Next.js hot-reloads modules in dev, which would otherwise open a new pool on
// every edit until Postgres runs out of connections.
const globalForDb = globalThis as unknown as { __sql?: ReturnType<typeof postgres> };

const sql = globalForDb.__sql ?? postgres(connectionString, { max: 10 });
if (process.env.NODE_ENV !== "production") globalForDb.__sql = sql;

export const db = drizzle(sql, { schema });
export { schema, sql };
