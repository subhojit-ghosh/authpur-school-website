"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { getSession, requireUser } from "@/lib/auth";
import { hashPassword, passwordProblem } from "@/lib/password";
import { diff, recordAudit } from "@/lib/audit";
import { USERNAME_HINT, USERNAME_RULE } from "@/lib/user-rules";
import { countStaffUsers, getStaffUser, usernameTaken } from "@/lib/users";

export type UserValues = { displayName: string; username: string };
export type UserFormState = {
  error?: string;
  fieldErrors?: Partial<Record<"displayName" | "username" | "password" | "confirm", string>>;
  values?: UserValues;
};

function refresh() {
  revalidatePath("/admin/users");
  revalidatePath("/admin");
}

/** Postgres unique-violation (23505); drizzle wraps the driver error in `cause`. */
function isDuplicate(err: unknown): boolean {
  for (let e: unknown = err, depth = 0; e && depth < 5; depth++) {
    if (typeof e !== "object") break;
    if ((e as { code?: string }).code === "23505") return true;
    e = (e as { cause?: unknown }).cause;
  }
  return false;
}

function parse(formData: FormData) {
  const values: UserValues = {
    displayName: String(formData.get("displayName") ?? "").trim().slice(0, 80),
    username: String(formData.get("username") ?? "").trim().toLowerCase(),
  };
  const fieldErrors: UserFormState["fieldErrors"] = {};
  if (values.displayName.length < 2) fieldErrors.displayName = "Please enter the person's name.";
  if (!USERNAME_RULE.test(values.username)) fieldErrors.username = USERNAME_HINT;
  return { values, fieldErrors };
}

export async function createStaffUser(_prev: UserFormState, formData: FormData): Promise<UserFormState> {
  await requireUser();
  const { values, fieldErrors } = parse(formData);

  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const problem = passwordProblem(password);
  if (problem) fieldErrors!.password = problem;
  if (password !== confirm) fieldErrors!.confirm = "The passwords do not match.";
  if (Object.keys(fieldErrors!).length) return { error: "Please correct the highlighted fields.", fieldErrors, values };

  if (await usernameTaken(values.username)) {
    return { error: "That username is already taken.", fieldErrors: { username: "Choose a different username." }, values };
  }

  try {
    await db.insert(users).values({ ...values, passwordHash: await hashPassword(password) });
    await recordAudit("Staff Accounts", "created", `Created the staff account ${values.displayName} (@${values.username})`);
  } catch (err) {
    if (isDuplicate(err)) {
      return { error: "That username is already taken.", fieldErrors: { username: "Choose a different username." }, values };
    }
    throw err;
  }

  refresh();
  redirect("/admin/users?saved=created");
}

export async function updateStaffUser(id: number, _prev: UserFormState, formData: FormData): Promise<UserFormState> {
  await requireUser();
  const { values, fieldErrors } = parse(formData);
  if (Object.keys(fieldErrors!).length) return { error: "Please correct the highlighted fields.", fieldErrors, values };

  if (await usernameTaken(values.username, id)) {
    return { error: "That username is already taken.", fieldErrors: { username: "Choose a different username." }, values };
  }

  const before = await getStaffUser(id);
  try {
    const updated = await db.update(users).set({ ...values, updatedAt: new Date().toISOString() }).where(eq(users.id, id)).returning({ id: users.id });
    if (updated.length === 0) return { error: "That account no longer exists.", values };
    await recordAudit("Staff Accounts", "updated", `Updated the staff account ${values.displayName} (@${values.username})`, {
      details: before ? diff({ displayName: before.displayName, username: before.username }, values) : undefined,
    });
  } catch (err) {
    if (isDuplicate(err)) {
      return { error: "That username is already taken.", fieldErrors: { username: "Choose a different username." }, values };
    }
    throw err;
  }

  refresh();
  redirect("/admin/users?saved=updated");
}

export type ResetState = { error?: string; success?: string };

export async function resetStaffPassword(id: number, _prev: ResetState, formData: FormData): Promise<ResetState> {
  const me = await requireUser();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  const problem = passwordProblem(password);
  if (problem) return { error: problem };
  if (password !== confirm) return { error: "The passwords do not match." };

  const target = await getStaffUser(id);
  if (!target) return { error: "That account no longer exists." };

  await db.update(users).set({ passwordHash: await hashPassword(password), updatedAt: new Date().toISOString() }).where(eq(users.id, id));

  // Sign the other person out everywhere so the new password takes effect.
  if (id !== me.id) await db.delete(sessions).where(eq(sessions.userId, id));
  else {
    const current = await getSession();
    if (current) await db.delete(sessions).where(ne(sessions.id, current.sessionId));
  }

  await recordAudit("Staff Accounts", "updated", id === me.id ? "Changed their own password" : `Reset the password for ${target.displayName} (@${target.username})`);
  refresh();
  return { success: `Password changed for ${target.displayName}. They will need to sign in again.` };
}

export async function deleteStaffUser(formData: FormData) {
  const me = await requireUser();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  if (id === me.id) redirect("/admin/users?error=self");
  if ((await countStaffUsers()) <= 1) redirect("/admin/users?error=last");

  const target = await getStaffUser(id);
  await db.delete(users).where(eq(users.id, id));
  if (target) await recordAudit("Staff Accounts", "deleted", `Removed the staff account ${target.displayName} (@${target.username})`);
  refresh();
  redirect("/admin/users?saved=deleted");
}
