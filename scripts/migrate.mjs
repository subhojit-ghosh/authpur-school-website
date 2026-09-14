// Applies pending SQL migrations from ./drizzle to the database in DATABASE_URL
// (Neon in production) or to the local PGlite folder.
import { openDb } from "./db.mjs";

const db = await openDb();
await db.migrate();
console.log(`✓ Database is up to date — ${db.label}.`);
await db.close();
