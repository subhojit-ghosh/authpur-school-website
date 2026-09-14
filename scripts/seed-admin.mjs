// Creates (or resets) the staff admin account.
//
//   npm run db:seed                       -> username "admin", random password printed once
//   ADMIN_PASSWORD=... npm run db:seed    -> username "admin", chosen password
//   ADMIN_USERNAME=... ADMIN_PASSWORD=... npm run db:seed
//
// Run `npm run db:push` first so the tables exist.

import { createClient } from "@libsql/client";
import { randomBytes } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { hashPassword, passwordProblem } from "../src/lib/password.ts";

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

const username = (process.env.ADMIN_USERNAME || "admin").trim().toLowerCase();
const displayName = process.env.ADMIN_DISPLAY_NAME || "School Office";
let password = process.env.ADMIN_PASSWORD;
let generated = false;

if (!password) {
  // e.g. "anm-7Kq2mX9pLw" — letters and digits, easy to type.
  password = "anm-" + randomBytes(9).toString("base64url").replace(/[-_]/g, "x").slice(0, 10) + "1";
  generated = true;
}

const problem = passwordProblem(password);
if (problem) {
  console.error(`✗ ${problem}`);
  process.exit(1);
}

const passwordHash = await hashPassword(password);

const existing = await client.execute({ sql: "select id from users where username = ?", args: [username] });

if (existing.rows.length) {
  await client.execute({
    sql: "update users set password_hash = ?, display_name = ?, updated_at = current_timestamp where username = ?",
    args: [passwordHash, displayName, username],
  });
  await client.execute({ sql: "delete from sessions where user_id = ?", args: [existing.rows[0].id] });
  console.log(`✓ Password reset for existing account "${username}" (all its sessions signed out).`);
} else {
  await client.execute({
    sql: "insert into users (username, display_name, password_hash) values (?, ?, ?)",
    args: [username, displayName, passwordHash],
  });
  console.log(`✓ Admin account "${username}" created.`);
}

if (generated) {
  console.log("");
  console.log("  Temporary password (shown once — change it after first login):");
  console.log(`  ${password}`);
  console.log("");
}
