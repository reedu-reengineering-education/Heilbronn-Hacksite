import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

/**
 * Applies the SQL in ./drizzle. Run on every container start so a deploy never
 * needs a manual migration step.
 */

// Next.js loads .env for the app, but plain scripts don't. Docker has no .env
// file (the variables come from the environment), so a missing file is fine.
try {
  process.loadEnvFile();
} catch {}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

// `max: 1` because migrations must run on a single connection.
const sql = postgres(url, { max: 1 });

try {
  await migrate(drizzle(sql), { migrationsFolder: "./drizzle" });
  console.log("Migrations applied.");
} catch (error) {
  console.error("Migration failed:", error);
  process.exit(1);
} finally {
  await sql.end();
}
