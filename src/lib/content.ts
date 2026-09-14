import "server-only";

import { and, asc, count, desc, eq, gte, isNull, like, or } from "drizzle-orm";
import { db } from "@/db";
import { enquiries, events, notices } from "@/db/schema";
import { todayISO } from "@/lib/format";

/** Read-side data access for notices, events and enquiries. */

// ---------- Notices ----------

export async function getNotices(limit?: number) {
  const q = db.select().from(notices).orderBy(asc(notices.sortOrder), desc(notices.date), desc(notices.id));
  return limit ? q.limit(limit) : q;
}

export async function getNotice(id: number) {
  return db.select().from(notices).where(eq(notices.id, id)).get();
}

export async function countNotices() {
  return (await db.select({ n: count() }).from(notices).get())?.n ?? 0;
}

// ---------- Events ----------

/** Events dated today or later, soonest first. */
export async function getUpcomingEvents(limit?: number) {
  const q = db.select().from(events).where(gte(events.date, todayISO())).orderBy(asc(events.date), asc(events.id));
  return limit ? q.limit(limit) : q;
}

/** Every event, soonest first (past events included, for the admin list). */
export async function getAllEvents() {
  return db.select().from(events).orderBy(desc(events.date), desc(events.id));
}

export async function getEvent(id: number) {
  return db.select().from(events).where(eq(events.id, id)).get();
}

export async function countUpcomingEvents() {
  return (await db.select({ n: count() }).from(events).where(gte(events.date, todayISO())).get())?.n ?? 0;
}

// ---------- Enquiries ----------

export async function getEnquiries(opts: { q?: string; limit?: number } = {}) {
  const term = opts.q?.trim();
  const where = term
    ? or(
        like(enquiries.name, `%${term}%`),
        like(enquiries.phone, `%${term}%`),
        like(enquiries.email, `%${term}%`),
        like(enquiries.grade, `%${term}%`),
        like(enquiries.message, `%${term}%`),
      )
    : undefined;
  const q = db.select().from(enquiries).where(where).orderBy(desc(enquiries.createdAt), desc(enquiries.id));
  return opts.limit ? q.limit(opts.limit) : q;
}

export async function countEnquiries(onlyUnread = false) {
  const where = onlyUnread ? and(isNull(enquiries.readAt)) : undefined;
  return (await db.select({ n: count() }).from(enquiries).where(where).get())?.n ?? 0;
}
