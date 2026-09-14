// Applies pending SQL migrations from ./drizzle to the database in DATABASE_URL.
// Works for the local SQLite file and for a hosted libSQL/Turso database.
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const url = process.env.DATABASE_URL?.trim() || "file:./data/school.db";
const authToken = process.env.DATABASE_AUTH_TOKEN?.trim() || undefined;

let client;
if (url.startsWith("file:")) {
  const filePath = resolve(process.cwd(), url.slice("file:".length));
  mkdirSync(dirname(filePath), { recursive: true });
  client = createClient({ url: `file:${filePath}` });
} else {
  client = createClient({ url, authToken });
}

await migrate(drizzle(client), { migrationsFolder: "./drizzle" });
console.log(`✓ Database is up to date (${url.startsWith("file:") ? url : "remote database"}).`);
