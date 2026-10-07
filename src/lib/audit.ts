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
  "Examination Pattern",
  "School Info",
  "Staff Accounts",
  "Website Text",
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

/**
 * A field-level diff for nested content objects.
 *
 * `diff` compares top-level keys, so a change to one laboratory name shows up as
 * the whole array. `flatDiff` walks into objects and arrays and reports dotted
 * paths (`about.heading`, `labs[2].name`) with just the values that moved, which
 * is what the activity log shows staff under “What changed”.
 */
export function flatDiff(before: unknown, after: unknown, limit = 25) {
  const changed: Record<string, { from: unknown; to: unknown }> = {};
  let truncated = false;

  const text = (v: unknown) => {
    try {
      return JSON.stringify(v);
    } catch {
      // A value that cannot be described — a cycle, a BigInt — is treated as
      // different from everything, which is the safe answer here. This must
      // never throw: the diff is built as an argument to recordAudit, so a
      // throw would escape its guard and fail the save that has already run.
      return undefined;
    }
  };

  const walk = (a: unknown, b: unknown, path: string) => {
    if (Object.keys(changed).length >= limit) {
      truncated = true;
      return;
    }

    const missing = (v: unknown) => v === undefined || v === null;
    // Nothing to report when both sides are empty: a field that went from
    // absent to blank would otherwise be logged as "(empty) → (empty)".
    if ((missing(a) || a === "") && (missing(b) || b === "")) return;

    const sa = text(a);
    const sb = text(b);
    if (sa !== undefined && sa === sb) return;

    const isArray = (v: unknown) => Array.isArray(v);
    const isPlainObject = (v: unknown) => v !== null && typeof v === "object" && !Array.isArray(v);

    const bothArrays = (isArray(a) && (isArray(b) || missing(b))) || (missing(a) && isArray(b));
    const bothObjects =
      !bothArrays &&
      ((isPlainObject(a) && (isPlainObject(b) || missing(b))) || (missing(a) && isPlainObject(b)));

    if (bothArrays) {
      const arrA = (isArray(a) ? a : []) as unknown[];
      const arrB = (isArray(b) ? b : []) as unknown[];

      // Rows are matched by their contents, not by their position. Pairing by
      // position alone turns moving one row up into a change to every field of
      // every row below it, which both buries the real edit and uses up the
      // limit before the walk reaches it.
      const keysB = arrB.map(text);
      const takenB = new Set<number>();
      const restA: number[] = [];
      for (let i = 0; i < arrA.length; i++) {
        const key = text(arrA[i]);
        const j = key === undefined ? -1 : keysB.findIndex((k, idx) => !takenB.has(idx) && k === key);
        if (j >= 0) takenB.add(j);
        else restA.push(i);
      }
      const restB = arrB.map((_, i) => i).filter((i) => !takenB.has(i));

      if (!restA.length && !restB.length) {
        // Every row still exists; only the order moved.
        if (arrA.length) changed[path || "value"] = { from: "the previous order", to: "a new order" };
        return;
      }

      for (let i = 0; i < Math.max(restA.length, restB.length); i++) {
        const ai = restA[i];
        const bi = restB[i];
        const position = (bi ?? ai ?? 0) + 1;
        walk(ai === undefined ? undefined : arrA[ai], bi === undefined ? undefined : arrB[bi], `${path}[${position}]`);
      }
      return;
    }

    if (bothObjects) {
      const objA = (isPlainObject(a) ? a : {}) as Record<string, unknown>;
      const objB = (isPlainObject(b) ? b : {}) as Record<string, unknown>;
      for (const key of new Set([...Object.keys(objA), ...Object.keys(objB)])) {
        walk(objA[key], objB[key], path ? `${path}.${key}` : key);
      }
      return;
    }

    changed[path || "value"] = { from: a, to: b };
  };

  try {
    walk(before, after, "");
  } catch (err) {
    console.error("[audit] could not describe the change", err);
    return undefined;
  }

  if (!Object.keys(changed).length) return undefined;
  // Say so rather than letting the list end as though it were complete.
  if (truncated) changed["and more"] = { from: `the first ${limit} changes`, to: "more were not listed" };
  return changed;
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
