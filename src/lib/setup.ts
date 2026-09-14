import "server-only";

import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { siteSettings, users } from "@/db/schema";

/** True while no staff account exists — the one-time /admin/setup page is then available. */
export async function needsSetup() {
  const [row] = await db.select({ n: count() }).from(users);
  return (row?.n ?? 0) === 0;
}

/** Hash of the one-time setup code written by scripts/migrate.mjs during the build. */
export async function getSetupCodeHash(): Promise<string | null> {
  const [row] = await db.select().from(siteSettings).where(eq(siteSettings.key, "setup_code")).limit(1);
  if (!row) return null;
  try {
    return (JSON.parse(row.value) as { hash?: string }).hash ?? null;
  } catch {
    return null;
  }
}

export async function clearSetupCode() {
  await db.delete(siteSettings).where(eq(siteSettings.key, "setup_code"));
}
