"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { flatDiff, recordAudit } from "@/lib/audit";
import { parseRows } from "@/lib/form-rows";
import { revalidateAdmissions } from "@/lib/revalidate";
import { getAdmissionsContent, saveSetting } from "@/lib/settings";
import { SETTING_KEYS, type AdmissionsContent } from "@/lib/settings-types";

export type SaveState = { error?: string; success?: string };

export async function saveAdmissions(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireUser();

  const value: AdmissionsContent = {
    dates: parseRows(formData, "dates", ["event", "date"]),
    eligibility: parseRows(formData, "eligibility", ["level", "criteria"]),
    fees: parseRows(formData, "fees", ["head", "amount"]),
    feeNote: String(formData.get("feeNote") ?? "").trim().slice(0, 600),
    steps: parseRows(formData, "steps", ["title", "text"], 600),
    documents: parseRows(formData, "documents", ["item"], 200),
  };

  const incomplete =
    value.dates.some((r) => !r.event || !r.date) ||
    value.eligibility.some((r) => !r.level || !r.criteria) ||
    value.fees.some((r) => !r.head || !r.amount) ||
    value.steps.some((r) => !r.title || !r.text) ||
    value.documents.some((r) => !r.item);
  if (incomplete) return { error: "Every row needs both fields filled in. Remove rows you do not need." };

  const before = await getAdmissionsContent();
  await saveSetting(SETTING_KEYS.admissions, value);
  await recordAudit("Admissions Content", "updated", "Updated the admission dates, eligibility and fees", {
    details: flatDiff(before, value),
  });
  revalidateAdmissions();
  revalidatePath("/admin/admissions");
  return { success: "Saved. The Admissions page has been updated." };
}
