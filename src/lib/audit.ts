import "server-only";

import { and, count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { auditLog } from "@/db/schema";
import { getSession } from "@/lib/auth";

/** Writing and reading the activity log. */

export const AUDIT_SECTIONS = [
  "Notice Board",
  "Events",
  "Enquiry Inbox",
  "Hero Banner",
  "Photo Gallery",
  "Admissions Content",
  "School Info",
  "Staff Accounts",
  "Sign in",
] as const;
export type AuditSection = (typeof AUDIT_SECTIONS)[number];

export const AUDIT_ACTIONS = [
  "created",
  "updated",
  "deleted",
  "re-ordered",
  "uploaded",
  "signed in",
  "signed out",
] as const;
export type AuditAction = (typeof AUDIT_ACTIONS)[number];

type RecordOptions = {
  /** Use when there is no session yet (first-time setup) or the actor differs. */
  actor?: { id: number | null; name: string };
  details?: Record<string, unknown>;
};

/**
 * Appends one entry. Never throws: a failed log must not break the action the
 * staff member was performing.
 */
export async function recordAudit(
  section: AuditSection,
  action: AuditAction,
  summary: string,
  options: RecordOptions = {},
) {
  try {
    let actor = options.actor;
    if (!actor) {
      const session = await getSession();
      actor = session ? { id: session.user.id, name: session.user.displayName } : { id: null, name: "Unknown" };
    }
    const row = {
      at: new Date().toISOString(),
      userId: actor.id,
      userName: actor.name,
      action,
      section,
      summary: summary.slice(0, 500),
      details: options.details ? JSON.stringify(options.details).slice(0, 4000) : null,
    };
    try {
      await db.insert(auditLog).values(row);
    } catch (first) {
      // One retry: a cloud database waking from idle can drop the first query.
      console.warn("[audit] first attempt failed, retrying", first);
      await db.insert(auditLog).values(row);
    }
  } catch (err) {
    console.error("[audit] could not record entry", err);
  }
}

/** Describes which fields changed, for the details column. */
export function diff<T extends Record<string, unknown>>(before: T, after: T) {
  const changed: Record<string, { from: unknown; to: unknown }> = {};
  for (const key of Object.keys(after)) {
    const a = before[key];
    const b = after[key];
    if (JSON.stringify(a) !== JSON.stringify(b)) changed[key] = { from: a, to: b };
  }
  return Object.keys(changed).length ? changed : undefined;
}

export type AuditFilter = { q?: string; section?: string; person?: string; limit?: number; offset?: number };

function where(f: AuditFilter): SQL | undefined {
  const parts: (SQL | undefined)[] = [];
  const term = f.q?.trim();
  if (term) {
    parts.push(
      or(ilike(auditLog.summary, `%${term}%`), ilike(auditLog.userName, `%${term}%`), ilike(auditLog.details, `%${term}%`)),
    );
  }
  if (f.section) parts.push(eq(auditLog.section, f.section));
  if (f.person) parts.push(eq(auditLog.userName, f.person));
  const defined = parts.filter(Boolean) as SQL[];
  return defined.length ? and(...defined) : undefined;
}

export async function getAuditEntries(f: AuditFilter = {}) {
  return db
    .select()
    .from(auditLog)
    .where(where(f))
    .orderBy(desc(auditLog.at), desc(auditLog.id))
    .limit(f.limit ?? 50)
    .offset(f.offset ?? 0);
}

export async function countAuditEntries(f: AuditFilter = {}) {
  const [row] = await db.select({ n: count() }).from(auditLog).where(where(f));
  return row?.n ?? 0;
}

/** Distinct names that appear in the log, for the "person" filter. */
export async function getAuditPeople() {
  const rows = await db.selectDistinct({ name: auditLog.userName }).from(auditLog).orderBy(auditLog.userName);
  return rows.map((r) => r.name);
}
