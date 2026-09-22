"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { flatDiff, recordAudit } from "@/lib/audit";
import { sanitizeRichText } from "@/lib/rich-text";
import { revalidateExamPattern } from "@/lib/revalidate";
import { getExamPattern, saveSetting } from "@/lib/settings";
import { SETTING_KEYS } from "@/lib/settings-types";
import {
  EXAM_ROW_KEYS,
  examGroupId,
  MAX_EXAM_GROUPS,
  MAX_EXAM_ROWS,
  type ExamGroup,
  type ExamPattern,
  type ExamRow,
} from "@/lib/exam-pattern-types";

export type SaveState = { error?: string; success?: string };

/** Trims a value, keeps its line breaks, and caps its length. */
const clean = (value: unknown, max: number) =>
  String(value ?? "")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim()
    .slice(0, max);

/**
 * Rebuilds the class groups from the editor's JSON field. Everything is
 * treated as untrusted: only the known fields are kept and every count and
 * length is capped.
 */
function parseGroups(raw: string): { groups: ExamGroup[] } | { error: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { error: "The tables could not be read. Please reload the page and try again." };
  }
  if (!Array.isArray(parsed)) return { error: "The tables could not be read. Please reload the page and try again." };
  if (parsed.length > MAX_EXAM_GROUPS) return { error: `There can be at most ${MAX_EXAM_GROUPS} class groups.` };

  const groups: ExamGroup[] = [];
  const usedIds = new Set<string>();
  for (const entry of parsed) {
    const source = (entry ?? {}) as Record<string, unknown>;
    const title = clean(source.title, 80);
    if (!title) return { error: "Every class group needs a title, such as Class I – V." };

    const rawRows = Array.isArray(source.rows) ? source.rows : [];
    if (rawRows.length > MAX_EXAM_ROWS) return { error: `“${title}” can have at most ${MAX_EXAM_ROWS} examinations.` };

    const rows: ExamRow[] = [];
    for (const rawRow of rawRows) {
      const rowSource = (rawRow ?? {}) as Record<string, unknown>;
      const row = Object.fromEntries(EXAM_ROW_KEYS.map((k) => [k, clean(rowSource[k], 400)])) as ExamRow;
      // A row left completely empty is dropped rather than refused.
      if (EXAM_ROW_KEYS.every((k) => !row[k])) continue;
      if (!row.name) return { error: `Every examination in “${title}” needs a name.` };
      rows.push(row);
    }

    // The address fragment follows the title, kept unique across groups.
    let id = examGroupId(title);
    for (let n = 2; usedIds.has(id); n++) id = `${examGroupId(title)}-${n}`;
    usedIds.add(id);

    groups.push({
      id,
      title,
      subtitle: clean(source.subtitle, 120),
      rows,
      conditions: clean(source.conditions, 2000),
      notes: clean(source.notes, 2000),
    });
  }

  if (!groups.length) return { error: "Add at least one class group." };
  return { groups };
}

export async function saveExamPattern(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireUser();

  const parsed = parseGroups(String(formData.get("groups") ?? ""));
  if ("error" in parsed) return { error: parsed.error };

  const value: ExamPattern = {
    session: clean(formData.get("session"), 40),
    intro: sanitizeRichText(String(formData.get("intro") ?? "")),
    key: clean(formData.get("key"), 1000),
    groups: parsed.groups,
  };

  const before = await getExamPattern();
  await saveSetting(SETTING_KEYS.examPattern, value);
  await recordAudit("Examination Pattern", "updated", "Updated the examination pattern", {
    details: flatDiff(before, value),
  });
  revalidateExamPattern();
  revalidatePath("/admin/exam-pattern");
  return { success: "Saved. The Examination Pattern page has been updated." };
}
