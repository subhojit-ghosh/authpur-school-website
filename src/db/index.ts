import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import * as schema from "./schema";

/**
 * Database connection.
 *
 * Locally this is a SQLite file (DATABASE_URL=file:./data/school.db).
 * In the cloud the same code talks to a hosted libSQL/Turso database
 * (DATABASE_URL=libsql://... plus DATABASE_AUTH_TOKEN) with no code change.
 */

export const DEFAULT_DATABASE_URL = "file:./data/school.db";

function makeClient(): Client {
  const url = process.env.DATABASE_URL?.trim() || DEFAULT_DATABASE_URL;
  const authToken = process.env.DATABASE_AUTH_TOKEN?.trim() || undefined;

  if (url.startsWith("file:")) {
    // Make sure the folder for the SQLite file exists before opening it.
    const filePath = resolve(process.cwd(), url.slice("file:".length));
    mkdirSync(dirname(filePath), { recursive: true });
    return createClient({ url: `file:${filePath}` });
  }

  return createClient({ url, authToken });
}

const globalForDb = globalThis as unknown as { __anmDbClient?: Client };

const client = globalForDb.__anmDbClient ?? makeClient();
if (process.env.NODE_ENV !== "production") globalForDb.__anmDbClient = client;

export const db = drizzle(client, { schema });
export { schema };
