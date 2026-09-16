import "server-only";

import { and, asc, count, desc, eq, gte, ilike, isNull, or } from "drizzle-orm";
import { db } from "@/db";
import { enquiries, events, notices } from "@/db/schema";
import { todayISO } from "@/lib/format";

/**
 * Read-side data access for notices, events and enquiries.
 *
 * Public pages pass nothing and get only **active** items; the admin panel
 * passes `{ includeInactive: true }` to see everything.
 */

type ListOptions = { limit?: number; includeInactive?: boolean };

// ---------- Notices ----------

export async function getNotices({ limit, includeInactive = false }: ListOptions = {}) {
  const q = db
    .select()
    .from(notices)
    .where(includeInactive ? undefined : eq(notices.active, true))
    .orderBy(asc(notices.sortOrder), desc(notices.date), desc(notices.id));
  return limit ? q.limit(limit) : q;
}

export async function getNotice(id: number) {
  const [row] = await db.select().from(notices).where(eq(notices.id, id)).limit(1);
  return row;
}

/** A single notice for the public page. Inactive notices are treated as missing. */
export async function getPublicNotice(id: number) {
  const [row] = await db
    .select()
    .from(notices)
    .where(and(eq(notices.id, id), eq(notices.active, true)))
    .limit(1);
  return row;
}

/** Number of notices shown on the website. */
export async function countNotices(includeInactive = false) {
  const [row] = await db
    .select({ n: count() })
    .from(notices)
    .where(includeInactive ? undefined : eq(notices.active, true));
  return row?.n ?? 0;
}

// ---------- Events ----------

/** Events dated today or later, soonest first. Inactive events are hidden from the website. */
export async function getUpcomingEvents({ limit, includeInactive = false }: ListOptions = {}) {
  const where = includeInactive
    ? gte(events.date, todayISO())
    : and(gte(events.date, todayISO()), eq(events.active, true));
  const q = db.select().from(events).where(where).orderBy(asc(events.date), asc(events.id));
  return limit ? q.limit(limit) : q;
}

/** Every event, newest first — the admin list, including past and inactive ones. */
export async function getAllEvents() {
  return db.select().from(events).orderBy(desc(events.date), desc(events.id));
}

export async function getEvent(id: number) {
  const [row] = await db.select().from(events).where(eq(events.id, id)).limit(1);
  return row;
}

/** A single event for the public page, past or future. Inactive events are treated as missing. */
export async function getPublicEvent(id: number) {
  const [row] = await db
    .select()
    .from(events)
    .where(and(eq(events.id, id), eq(events.active, true)))
    .limit(1);
  return row;
}

export async function countUpcomingEvents(includeInactive = false) {
  const where = includeInactive
    ? gte(events.date, todayISO())
    : and(gte(events.date, todayISO()), eq(events.active, true));
  const [row] = await db.select({ n: count() }).from(events).where(where);
  return row?.n ?? 0;
}

// ---------- Enquiries ----------

export async function getEnquiries(opts: { q?: string; limit?: number } = {}) {
  const term = opts.q?.trim();
  const where = term
    ? or(
        ilike(enquiries.name, `%${term}%`),
        ilike(enquiries.phone, `%${term}%`),
        ilike(enquiries.email, `%${term}%`),
        ilike(enquiries.grade, `%${term}%`),
        ilike(enquiries.message, `%${term}%`),
      )
    : undefined;
  const q = db.select().from(enquiries).where(where).orderBy(desc(enquiries.createdAt), desc(enquiries.id));
  return opts.limit ? q.limit(opts.limit) : q;
}

export async function countEnquiries(onlyUnread = false) {
  const where = onlyUnread ? and(isNull(enquiries.readAt)) : undefined;
  const [row] = await db.select({ n: count() }).from(enquiries).where(where);
  return row?.n ?? 0;
}
