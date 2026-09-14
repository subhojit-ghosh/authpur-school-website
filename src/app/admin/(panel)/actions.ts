"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { destroySession, getSession, revokeOtherSessions } from "@/lib/auth";
import { hashPassword, passwordProblem, verifyPassword } from "@/lib/password";

export async function signOut() {
  await destroySession();
  redirect("/admin/login");
}

export type ChangePasswordState = { error?: string; success?: string };

export async function changePassword(
  _prev: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!current || !next || !confirm) return { error: "Please fill in all three fields." };
  if (!(await verifyPassword(current, session.user.passwordHash)))
    return { error: "The current password is incorrect." };
  if (next !== confirm) return { error: "The new passwords do not match." };
  const problem = passwordProblem(next);
  if (problem) return { error: problem };
  if (await verifyPassword(next, session.user.passwordHash))
    return { error: "The new password must be different from the current one." };

  await db
    .update(users)
    .set({ passwordHash: await hashPassword(next), updatedAt: new Date().toISOString() })
    .where(eq(users.id, session.user.id));

  // Any other browser or device that was signed in must log in again.
  await revokeOtherSessions(session.user.id, session.sessionId);

  return { success: "Password changed. Other devices have been signed out." };
}
