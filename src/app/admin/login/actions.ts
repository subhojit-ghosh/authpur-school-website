"use server";

import { redirect } from "next/navigation";
import { attemptLogin } from "@/lib/auth";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  if (!username || !password) {
    return { error: "Please enter your username and password." };
  }

  const result = await attemptLogin(username, password);
  if (!result.ok) return { error: result.error };

  // Only allow redirects back into the admin area.
  const safeNext = next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";
  redirect(safeNext);
}
