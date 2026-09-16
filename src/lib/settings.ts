import "server-only";

import { cache } from "react";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import {
  defaultAdmissions,
  defaultSchoolInfo,
  defaultTimings,
  SETTING_KEYS,
  type AdmissionsContent,
  type SchoolInfo,
  type Timings,
} from "@/lib/settings-types";

/** Reads one JSON settings row, merged over the supplied defaults. */
export async function getSetting<T extends object>(key: string, defaults: T): Promise<T> {
  const [row] = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
  if (!row) return defaults;
  try {
    const parsed = JSON.parse(row.value) as Partial<T>;
    // Shallow merge so newly added fields fall back to defaults.
    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
}

export async function saveSetting<T extends object>(key: string, value: T) {
  const updatedAt = new Date().toISOString();
  await db
    .insert(siteSettings)
    .values({ key, value: JSON.stringify(value), updatedAt })
    .onConflictDoUpdate({ target: siteSettings.key, set: { value: JSON.stringify(value), updatedAt } });
}

/** Contact details, address and office hours. De-duplicated per request. */
export const getSchoolInfo = cache(() => getSetting<SchoolInfo>(SETTING_KEYS.schoolInfo, defaultSchoolInfo));

export const getTimings = cache(() => getSetting<Timings>(SETTING_KEYS.timings, defaultTimings));

export const getAdmissionsContent = cache(() =>
  getSetting<AdmissionsContent>(SETTING_KEYS.admissions, defaultAdmissions),
);
