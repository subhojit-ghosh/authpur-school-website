// Shared database access for the maintenance scripts (migrate, seed, copy).
//
// Order of preference:
//   1. DATABASE_URL (Neon in production, or the URL injected by `pglite-server --run`)
//   2. The local dev database server started by `bun run dev` (127.0.0.1:54329)
//   3. Open the local PGlite folder (./data/pg) directly — only when nothing else is using it.
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { connect } from "node:net";

export const LOCAL_DB_PORT = 54329;
export const LOCAL_DATABASE_URL = `postgres://postgres:postgres@127.0.0.1:${LOCAL_DB_PORT}/postgres`;
export const pgliteDir = resolve(process.cwd(), process.env.PGLITE_DIR?.trim() || "./data/pg");

function portOpen(port, host = "127.0.0.1", timeoutMs = 700) {
  return new Promise((done) => {
    const socket = connect({ port, host });
    const finish = (ok) => {
      socket.destroy();
      done(ok);
    };
    socket.once("connect", () => finish(true));
    socket.once("error", () => finish(false));
    socket.setTimeout(timeoutMs, () => finish(false));
  });
}

/**
 * `pg` treats sslmode=require (and prefer, and verify-ca) as verify-full today
 * and warns that a coming major will give them their weaker libpq meaning.
 * Neon presents a valid certificate, so naming verify-full explicitly keeps the
 * strict check and silences the warning. Kept in step with pinSslMode() in
 * src/db/index.ts; it is repeated rather than imported because importing that
 * module would open a connection pool as a side effect.
 */
const ALIASED_SSL_MODES = new Set(["require", "prefer", "verify-ca"]);

function pinSslMode(url) {
  try {
    const parsed = new URL(url);
    const mode = parsed.searchParams.get("sslmode");
    if (!mode || !ALIASED_SSL_MODES.has(mode)) return url;
    parsed.searchParams.set("sslmode", "verify-full");
    return parsed.toString();
  } catch {
    return url;
  }
}

async function viaPg(url, label) {
  const { Pool } = await import("pg");
  const { drizzle } = await import("drizzle-orm/node-postgres");
  const { migrate } = await import("drizzle-orm/node-postgres/migrator");
  const pool = new Pool({ connectionString: pinSslMode(url), max: 1 });
  const orm = drizzle(pool);
  return {
    label,
    query: async (sql, params = []) => pool.query(sql, params),
    migrate: () => migrate(orm, { migrationsFolder: "./drizzle" }),
    close: () => pool.end(),
  };
}

/** Returns { query(sql, params) -> { rows }, migrate, close, label }. */
export async function openDb() {
  const envUrl = process.env.DATABASE_URL?.trim();
  if (envUrl) {
    return viaPg(envUrl, "database from DATABASE_URL (" + envUrl.replace(/\/\/([^@]+)@/, "//***@") + ")");
  }

  if (await portOpen(LOCAL_DB_PORT)) {
    return viaPg(LOCAL_DATABASE_URL, `local dev database server (127.0.0.1:${LOCAL_DB_PORT})`);
  }

  // Nothing is serving the local database: open the folder directly.
  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  const { migrate } = await import("drizzle-orm/pglite/migrator");
  mkdirSync(pgliteDir, { recursive: true });
  const client = new PGlite(pgliteDir);
  await client.waitReady;
  const orm = drizzle(client);
  return {
    label: `local database folder (${pgliteDir})`,
    query: async (sql, params = []) => client.query(sql, params),
    migrate: () => migrate(orm, { migrationsFolder: "./drizzle" }),
    close: () => client.close(),
  };
}
