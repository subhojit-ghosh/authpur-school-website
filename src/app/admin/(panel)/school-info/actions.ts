"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { diff, recordAudit } from "@/lib/audit";
import { parseRows } from "@/lib/form-rows";
import { revalidateWholeSite } from "@/lib/revalidate";
import { getSchoolInfo, getTimings, saveSetting } from "@/lib/settings";
import { SETTING_KEYS, type SchoolInfo, type Timings } from "@/lib/settings-types";

export type SaveState = { error?: string; success?: string; fieldErrors?: Record<string, string> };

const field = (fd: FormData, name: string, max = 160) => String(fd.get(name) ?? "").trim().slice(0, max);

export async function saveSchoolInfo(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireUser();

  const value: SchoolInfo = {
    phone: field(formData, "phone", 30),
    admissionsPhone: field(formData, "admissionsPhone", 30),
    email: field(formData, "email", 120),
    address: {
      line1: field(formData, "line1"),
      line2: field(formData, "line2"),
      city: field(formData, "city", 80),
      state: field(formData, "state", 80),
      pin: field(formData, "pin", 10),
    },
    officeHours: field(formData, "officeHours", 200),
  };

  const fieldErrors: Record<string, string> = {};
  if (!/^[+\d][\d\s\-()]{6,}$/.test(value.phone)) fieldErrors.phone = "Enter a valid phone number.";
  if (!/^[+\d][\d\s\-()]{6,}$/.test(value.admissionsPhone)) fieldErrors.admissionsPhone = "Enter a valid phone number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) fieldErrors.email = "Enter a valid email address.";
  if (!value.address.line1) fieldErrors.line1 = "Address line 1 is required.";
  if (!value.address.city) fieldErrors.city = "City is required.";
  if (!/^\d{6}$/.test(value.address.pin)) fieldErrors.pin = "PIN code must be 6 digits.";
  if (!value.officeHours) fieldErrors.officeHours = "Office hours are required.";
  if (Object.keys(fieldErrors).length) return { error: "Please correct the highlighted fields.", fieldErrors };

  const before = await getSchoolInfo();
  await saveSetting(SETTING_KEYS.schoolInfo, value);
  await recordAudit("School Info", "updated", "Updated the contact details and address", {
    details: diff(before as unknown as Record<string, unknown>, value as unknown as Record<string, unknown>),
  });
  revalidateWholeSite();
  revalidatePath("/admin/school-info");
  return { success: "Saved. Contact details have been updated across the website." };
}

export async function saveTimings(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireUser();

  const value: Timings = {
    dailySchedule: parseRows(formData, "daily", ["label", "time"]),
    sectionTimings: parseRows(formData, "sections", ["section", "days", "time"]),
    timingsNote: field(formData, "timingsNote", 600),
  };

  const incomplete =
    value.dailySchedule.some((r) => !r.label || !r.time) ||
    value.sectionTimings.some((r) => !r.section || !r.days || !r.time);
  if (incomplete) return { error: "Every row needs all its fields filled in. Remove rows you do not need." };

  const before = await getTimings();
  await saveSetting(SETTING_KEYS.timings, value);
  await recordAudit("School Info", "updated", "Updated the school timings", {
    details: diff(before as unknown as Record<string, unknown>, value as unknown as Record<string, unknown>),
  });
  revalidatePath("/school-timings");
  revalidatePath("/admin/school-info");
  return { success: "Saved. The School Timings page has been updated." };
}
