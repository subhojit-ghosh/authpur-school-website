import "server-only";

import { asc, count, eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

/** Read-side access for staff accounts. Password hashes are never selected. */

const columns = {
  id: users.id,
  username: users.username,
  displayName: users.displayName,
  lastLoginAt: users.lastLoginAt,
  createdAt: users.createdAt,
};

export type StaffUser = {
  id: number;
  username: string;
  displayName: string;
  lastLoginAt: string | null;
  createdAt: string;
};

export async function getStaffUsers(): Promise<StaffUser[]> {
  return db.select(columns).from(users).orderBy(asc(users.id));
}

export async function getStaffUser(id: number): Promise<StaffUser | undefined> {
  const [row] = await db.select(columns).from(users).where(eq(users.id, id)).limit(1);
  return row;
}

export async function countStaffUsers() {
  const [row] = await db.select({ n: count() }).from(users);
  return row?.n ?? 0;
}

/** True when another account already uses this username. */
export async function usernameTaken(username: string, exceptId?: number) {
  const rows = await db.select({ id: users.id }).from(users).where(eq(users.username, username)).limit(1);
  return rows.length > 0 && rows[0].id !== exceptId;
}
