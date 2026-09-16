import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

/**
 * Database connection (PostgreSQL, via the `pg` driver in every environment).
 *
 * Production: DATABASE_URL=postgres://… (Neon).
 * Local development: `bun run dev` wraps Next.js in a small local Postgres
 * server (PGlite, files in ./data/pg) and injects DATABASE_URL automatically.
 * If DATABASE_URL is missing we fall back to that local server's address so
 * `next build` / `next start` also work locally while it is running.
 */

export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

export const LOCAL_DB_PORT = 54329;
export const LOCAL_DATABASE_URL = `postgres://postgres:postgres@127.0.0.1:${LOCAL_DB_PORT}/postgres`;

/**
 * `pg` currently treats sslmode=require (and prefer, and verify-ca) as
 * verify-full, and warns on every connection that a coming major version will
 * give them their weaker libpq meaning instead. Neon presents a valid
 * certificate, so the strict check is what we want; saying so explicitly keeps
 * today's behaviour after that change rather than quietly dropping to an
 * unverified connection, and it takes the warning out of the build log.
 */
const ALIASED_SSL_MODES = new Set(["require", "prefer", "verify-ca"]);

export function pinSslMode(url: string): string {
  try {
    const parsed = new URL(url);
    const mode = parsed.searchParams.get("sslmode");
    if (!mode || !ALIASED_SSL_MODES.has(mode)) return url;
    parsed.searchParams.set("sslmode", "verify-full");
    return parsed.toString();
  } catch {
    // Not a URL we can parse — hand it to the driver unchanged.
    return url;
  }
}

export function databaseUrl() {
  return pinSslMode(process.env.DATABASE_URL?.trim() || LOCAL_DATABASE_URL);
}

export function isLocalDatabase(url = databaseUrl()) {
  return url.includes(`127.0.0.1:${LOCAL_DB_PORT}`) || url.includes(`localhost:${LOCAL_DB_PORT}`);
}

function makeDb(): Db {
  const url = databaseUrl();
  const pool = new Pool({ connectionString: url, max: isLocalDatabase(url) ? 4 : 5, idleTimeoutMillis: 30_000 });
  pool.on("error", (err) => console.error("[db] pool error", err.message));
  return drizzle(pool, { schema }) as unknown as Db;
}

const globalForDb = globalThis as unknown as { __anmDb?: Db };

export const db: Db = globalForDb.__anmDb ?? makeDb();
if (process.env.NODE_ENV !== "production") globalForDb.__anmDb = db;

export { schema };
