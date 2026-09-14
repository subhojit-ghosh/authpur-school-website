// Copies the sample notices, events and hero banners from src/lib/site.ts into
// the database, but only when those tables are still empty. Safe to run repeatedly.
//
//   npm run db:seed-content

import { notices, events, heroImages } from "../src/lib/site.ts";
import { openDb } from "./db.mjs";

const db = await openDb();
const count = async (table) => Number((await db.query(`select count(*)::int as n from ${table}`)).rows[0].n);

if ((await count("notices")) === 0) {
  let order = 0;
  for (const n of notices) {
    await db.query("insert into notices (title, date, tag, sort_order) values ($1, $2, $3, $4)", [n.title, n.date, n.tag, order++]);
  }
  console.log(`✓ Imported ${notices.length} sample notices.`);
} else {
  console.log(`· Notices table already has rows — left unchanged.`);
}

const MONTHS = { Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06", Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12" };
const year = new Date().getFullYear();
if ((await count("events")) === 0) {
  for (const e of events) {
    await db.query("insert into events (title, date, venue) values ($1, $2, $3)", [e.title, `${year}-${MONTHS[e.month]}-${e.day}`, e.place]);
  }
  console.log(`✓ Imported ${events.length} sample events (dated ${year}).`);
} else {
  console.log(`· Events table already has rows — left unchanged.`);
}

if ((await count("banners")) === 0) {
  let order = 0;
  for (const img of heroImages) {
    await db.query("insert into banners (url, thumb_url, alt, sort_order) values ($1, $2, $3, $4)", [img.src, img.src, img.alt, order++]);
  }
  console.log(`✓ Imported ${heroImages.length} original hero banners.`);
} else {
  console.log(`· Banners table already has rows — left unchanged.`);
}

console.log(`  Database: ${db.label}`);
await db.close();
