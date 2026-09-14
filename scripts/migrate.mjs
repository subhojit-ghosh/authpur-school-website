// Applies pending SQL migrations from ./drizzle to the database in DATABASE_URL
// (Neon in production) or to the local dev database.
//
// First-run setup: if no staff account exists yet, a one-time setup code is
// generated, its hash stored in site_settings, and the code printed here (the
// build log). The live site's /admin/setup page asks for that code to create
// the first admin account, so no terminal access is needed to go live.
import { randomBytes } from "node:crypto";
import { hashPassword } from "../src/lib/password.ts";
import { openDb } from "./db.mjs";

const db = await openDb();
await db.migrate();
console.log(`✓ Database is up to date — ${db.label}.`);

const users = Number((await db.query("select count(*)::int as n from users")).rows[0].n);
if (users === 0) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(12);
  const raw = [...bytes].map((b) => alphabet[b % alphabet.length]).join("");
  const code = `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}`;
  const hash = await hashPassword(code);
  await db.query(
    `insert into site_settings (key, value, updated_at) values ('setup_code', $1, now()::text)
     on conflict (key) do update set value = excluded.value, updated_at = excluded.updated_at`,
    [JSON.stringify({ hash })],
  );
  console.log("");
  console.log("┌──────────────────────────────────────────────────────────────┐");
  console.log("│  FIRST-TIME SETUP                                            │");
  console.log("│  No staff account exists yet. Open <your site>/admin/setup   │");
  console.log(`│  and enter this one-time setup code:   ${code}        │`);
  console.log("│  The code stops working as soon as the account is created.  │");
  console.log("└──────────────────────────────────────────────────────────────┘");
  console.log("");
} else {
  await db.query("delete from site_settings where key = 'setup_code'");
}

await db.close();
