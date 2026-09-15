"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { hashPassword, passwordProblem, verifyPassword } from "@/lib/password";
import { clearSetupCode, getSetupCodeHash, needsSetup } from "@/lib/setup";

export type SetupState = { error?: string; fieldErrors?: Record<string, string> };

// Brute-force guard for the setup code: 5 attempts per IP per 15 minutes.
const failures = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 15 * 60 * 1000;

export async function completeSetup(_prev: SetupState, formData: FormData): Promise<SetupState> {
  if (!(await needsSetup())) redirect("/admin/login");

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  const f = failures.get(ip);
  if (f && Date.now() - f.first < WINDOW_MS && f.count >= 5) {
    return { error: "Too many attempts. Please wait 15 minutes and try again." };
  }

  const code = String(formData.get("code") ?? "").trim().toUpperCase().replace(/\s+/g, "");
  const username = String(formData.get("username") ?? "admin").trim().toLowerCase();
  const displayName = String(formData.get("displayName") ?? "").trim().slice(0, 80) || "School Office";
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  const fieldErrors: Record<string, string> = {};
  if (!code) fieldErrors.code = "Enter the setup code from the deployment log.";
  if (!/^[a-z0-9_.-]{3,32}$/.test(username)) fieldErrors.username = "3–32 characters: letters, numbers, dot, dash or underscore.";
  const problem = passwordProblem(password);
  if (problem) fieldErrors.password = problem;
  if (password !== confirm) fieldErrors.confirm = "The passwords do not match.";
  if (Object.keys(fieldErrors).length) return { error: "Please correct the highlighted fields.", fieldErrors };

  const hash = await getSetupCodeHash();
  if (!hash || !(await verifyPassword(code, hash))) {
    const cur = failures.get(ip);
    if (!cur || Date.now() - cur.first > WINDOW_MS) failures.set(ip, { count: 1, first: Date.now() });
    else cur.count += 1;
    return { error: "That setup code is not correct. Copy it exactly from the deployment's build log.", fieldErrors: { code: " " } };
  }

  const [created] = await db
    .insert(users)
    .values({ username, displayName, passwordHash: await hashPassword(password) })
    .returning({ id: users.id });

  await clearSetupCode();
  await recordAudit("Staff Accounts", "created", `Created the first staff account ${displayName} (@${username}) during setup`, {
    actor: { id: created.id, name: displayName },
  });
  failures.delete(ip);
  await createSession(created.id);
  redirect("/admin?welcome=1");
}
