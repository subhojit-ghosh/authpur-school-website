import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq, lt, ne } from "drizzle-orm";
import { db } from "@/db";
import { sessions, users, type User } from "@/db/schema";
import { verifyPassword } from "@/lib/password";

export const SESSION_COOKIE = "anm_admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const RENEW_AFTER_MS = SESSION_TTL_MS / 2;

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

function cookieOptions(expires: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  };
}

/** Creates a DB-backed session for the user and sets the cookie. */
export async function createSession(userId: number) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const ua = (await headers()).get("user-agent")?.slice(0, 255) ?? null;

  await db.insert(sessions).values({ id: hashToken(token), userId, expiresAt, userAgent: ua });
  (await cookies()).set(SESSION_COOKIE, token, cookieOptions(new Date(expiresAt)));

  // Opportunistic cleanup of expired sessions.
  await db.delete(sessions).where(lt(sessions.expiresAt, Date.now()));
}

export type CurrentSession = { user: User; sessionId: string; expiresAt: number };

/** Returns the signed-in user for this request, or null. De-duplicated per request. */
export const getSession = cache(async (): Promise<CurrentSession | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const id = hashToken(token);
  const row = await db
    .select({ session: sessions, user: users })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(eq(sessions.id, id))
    .get();

  if (!row) return null;
  if (row.session.expiresAt <= Date.now()) {
    await db.delete(sessions).where(eq(sessions.id, id));
    return null;
  }

  // Sliding expiry: extend the session once it is past the halfway point.
  let expiresAt = row.session.expiresAt;
  if (expiresAt - Date.now() < SESSION_TTL_MS - RENEW_AFTER_MS) {
    expiresAt = Date.now() + SESSION_TTL_MS;
    await db.update(sessions).set({ expiresAt }).where(eq(sessions.id, id));
    try {
      (await cookies()).set(SESSION_COOKIE, token, cookieOptions(new Date(expiresAt)));
    } catch {
      // cookies() is read-only during rendering; renewal then happens on the next action.
    }
  }

  return { user: row.user, sessionId: id, expiresAt };
});

/** Use in admin layouts/pages: redirects to the login page when signed out. */
export async function requireUser(): Promise<User> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session.user;
}

/** Ends the current session (if any) and clears the cookie. */
export async function destroySession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await db.delete(sessions).where(eq(sessions.id, hashToken(token)));
  store.delete(SESSION_COOKIE);
}

/** Signs out every other device/browser for this user, keeping the current session. */
export async function revokeOtherSessions(userId: number, keepSessionId: string) {
  await db.delete(sessions).where(and(eq(sessions.userId, userId), ne(sessions.id, keepSessionId)));
}

// ---------- Login with basic brute-force protection ----------

const MAX_FAILURES = 5;
const LOCK_WINDOW_MS = 15 * 60 * 1000;
const failures = new Map<string, { count: number; first: number }>();

function attemptKey(username: string, ip: string) {
  return `${username.toLowerCase()}|${ip}`;
}

function isLocked(key: string) {
  const f = failures.get(key);
  if (!f) return false;
  if (Date.now() - f.first > LOCK_WINDOW_MS) {
    failures.delete(key);
    return false;
  }
  return f.count >= MAX_FAILURES;
}

function recordFailure(key: string) {
  const f = failures.get(key);
  if (!f || Date.now() - f.first > LOCK_WINDOW_MS) failures.set(key, { count: 1, first: Date.now() });
  else f.count += 1;
}

export type LoginResult = { ok: true; user: User } | { ok: false; error: string };

export async function attemptLogin(username: string, password: string): Promise<LoginResult> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  const key = attemptKey(username, ip);

  if (isLocked(key)) {
    return { ok: false, error: "Too many failed attempts. Please wait 15 minutes and try again." };
  }

  const user = await db.select().from(users).where(eq(users.username, username.trim().toLowerCase())).get();
  const valid = user ? await verifyPassword(password, user.passwordHash) : false;

  if (!user || !valid) {
    recordFailure(key);
    return { ok: false, error: "Incorrect username or password." };
  }

  failures.delete(key);
  await createSession(user.id);
  return { ok: true, user };
}
