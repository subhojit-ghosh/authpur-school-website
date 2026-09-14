// Copies the sample notices and events from src/lib/site.ts into the database,
// but only when those tables are still empty. Safe to run repeatedly.
//
//   npm run db:seed-content

import { createClient } from "@libsql/client";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { notices, events, heroImages } from "../src/lib/site.ts";

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

const MONTHS = { Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06", Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12" };
const year = new Date().getFullYear();

const noticeCount = (await client.execute("select count(*) as n from notices")).rows[0].n;
if (Number(noticeCount) === 0) {
  let order = 0;
  for (const n of notices) {
    await client.execute({
      sql: "insert into notices (title, date, tag, sort_order) values (?, ?, ?, ?)",
      args: [n.title, n.date, n.tag, order++],
    });
  }
  console.log(`✓ Imported ${notices.length} sample notices.`);
} else {
  console.log(`· Notices table already has ${noticeCount} rows — left unchanged.`);
}

const eventCount = (await client.execute("select count(*) as n from events")).rows[0].n;
if (Number(eventCount) === 0) {
  for (const e of events) {
    const date = `${year}-${MONTHS[e.month]}-${e.day}`;
    await client.execute({
      sql: "insert into events (title, date, venue) values (?, ?, ?)",
      args: [e.title, date, e.place],
    });
  }
  console.log(`✓ Imported ${events.length} sample events (dated ${year}).`);
} else {
  console.log(`· Events table already has ${eventCount} rows — left unchanged.`);
}

const bannerCount = (await client.execute("select count(*) as n from banners")).rows[0].n;
if (Number(bannerCount) === 0) {
  let order = 0;
  for (const img of heroImages) {
    await client.execute({
      sql: "insert into banners (url, thumb_url, alt, sort_order) values (?, ?, ?, ?)",
      args: [img.src, img.src, img.alt, order++],
    });
  }
  console.log(`✓ Imported ${heroImages.length} original hero banners.`);
} else {
  console.log(`· Banners table already has ${bannerCount} rows — left unchanged.`);
}
