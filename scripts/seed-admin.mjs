// Creates (or resets) the staff admin account.
//
//   npm run db:seed                       -> username "admin", random password printed once
//   ADMIN_PASSWORD=... npm run db:seed    -> username "admin", chosen password
//   ADMIN_USERNAME=... ADMIN_PASSWORD=... npm run db:seed
//
// Run `npm run db:migrate` first so the tables exist.

import { randomBytes } from "node:crypto";
import { hashPassword, passwordProblem } from "../src/lib/password.ts";
import { openDb } from "./db.mjs";

const username = (process.env.ADMIN_USERNAME || "admin").trim().toLowerCase();
const displayName = process.env.ADMIN_DISPLAY_NAME || "School Office";
let password = process.env.ADMIN_PASSWORD;
let generated = false;

if (!password) {
  // e.g. "anm-7Kq2mX9pLw1" — letters and digits, easy to type.
  password = "anm-" + randomBytes(9).toString("base64url").replace(/[-_]/g, "x").slice(0, 10) + "1";
  generated = true;
}

const problem = passwordProblem(password);
if (problem) {
  console.error(`✗ ${problem}`);
  process.exit(1);
}

const db = await openDb();
const passwordHash = await hashPassword(password);
const existing = await db.query("select id from users where username = $1", [username]);

if (existing.rows.length) {
  await db.query("update users set password_hash = $1, display_name = $2, updated_at = now()::text where username = $3", [
    passwordHash,
    displayName,
    username,
  ]);
  await db.query("delete from sessions where user_id = $1", [existing.rows[0].id]);
  console.log(`✓ Password reset for existing account "${username}" (all its sessions signed out).`);
} else {
  await db.query("insert into users (username, display_name, password_hash) values ($1, $2, $3)", [username, displayName, passwordHash]);
  console.log(`✓ Admin account "${username}" created.`);
}
console.log(`  Database: ${db.label}`);

if (generated) {
  console.log("");
  console.log("  Temporary password (shown once — change it after first login):");
  console.log(`  ${password}`);
  console.log("");
}
await db.close();
