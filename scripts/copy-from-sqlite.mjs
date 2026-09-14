// One-off: copies everything from the old SQLite database (data/school.db) into
// the Postgres database (local PGlite, or Neon when DATABASE_URL is set).
// Existing rows in the target are left alone; rows are inserted by id.
//
//   npm run db:copy-from-sqlite
//   DATABASE_URL=postgres://... npm run db:copy-from-sqlite

import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@libsql/client";
import { openDb } from "./db.mjs";

const sqlitePath = resolve(process.cwd(), process.env.SQLITE_PATH || "./data/school.db");
if (!existsSync(sqlitePath)) {
  console.error(`✗ No SQLite database at ${sqlitePath}`);
  process.exit(1);
}

const sqlite = createClient({ url: `file:${sqlitePath}` });
const db = await openDb();

const TABLES = [
  { name: "users", cols: ["id", "username", "display_name", "password_hash", "created_at", "updated_at"], serial: true },
  { name: "notices", cols: ["id", "title", "date", "tag", "sort_order", "created_at", "updated_at"], serial: true },
  { name: "events", cols: ["id", "title", "date", "venue", "created_at", "updated_at"], serial: true },
  { name: "enquiries", cols: ["id", "name", "phone", "email", "grade", "message", "created_at", "read_at"], serial: true },
  { name: "site_settings", cols: ["key", "value", "updated_at"], serial: false },
  { name: "banners", cols: ["id", "url", "thumb_url", "storage_key", "thumb_key", "alt", "width", "height", "sort_order", "created_at"], serial: true },
  { name: "gallery_photos", cols: ["id", "url", "thumb_url", "storage_key", "thumb_key", "caption", "category", "width", "height", "created_at"], serial: true },
];

for (const t of TABLES) {
  let rows;
  try {
    rows = (await sqlite.execute(`select ${t.cols.join(", ")} from ${t.name}`)).rows;
  } catch {
    console.log(`· ${t.name}: not present in SQLite — skipped.`);
    continue;
  }
  let inserted = 0;
  for (const r of rows) {
    const values = t.cols.map((c) => (r[c] === undefined ? null : r[c]));
    const placeholders = t.cols.map((_, i) => `$${i + 1}`).join(", ");
    const res = await db.query(
      `insert into ${t.name} (${t.cols.join(", ")}) values (${placeholders}) on conflict do nothing`,
      values,
    );
    inserted += res.rowCount ?? res.affectedRows ?? 0;
  }
  if (t.serial) {
    await db.query(`select setval(pg_get_serial_sequence('${t.name}', 'id'), coalesce((select max(id) from ${t.name}), 0) + 1, false)`);
  }
  console.log(`✓ ${t.name}: ${inserted} of ${rows.length} rows copied.`);
}

console.log(`  Target: ${db.label}`);
await db.close();
