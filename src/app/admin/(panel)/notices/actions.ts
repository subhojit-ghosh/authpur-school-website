"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, min } from "drizzle-orm";
import { db } from "@/db";
import { notices } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { getNotices } from "@/lib/content";
import { isNoticeTag, LIMITS, NOTICE_TAGS } from "@/lib/content-types";
import { isValidISODate } from "@/lib/format";
import { revalidateNoticesAndEvents } from "@/lib/revalidate";

export type NoticeValues = { title: string; date: string; tag: string };
export type NoticeFormState = { error?: string; fieldErrors?: Partial<Record<keyof NoticeValues, string>>; values?: NoticeValues };

function parseNotice(formData: FormData): { values: NoticeValues; fieldErrors: NoticeFormState["fieldErrors"] } {
  const values: NoticeValues = {
    title: String(formData.get("title") ?? "").trim().slice(0, LIMITS.noticeTitle + 1),
    date: String(formData.get("date") ?? "").trim(),
    tag: String(formData.get("tag") ?? "").trim(),
  };
  const fieldErrors: NoticeFormState["fieldErrors"] = {};
  if (values.title.length < 3) fieldErrors.title = "Please enter a title (at least 3 characters).";
  else if (values.title.length > LIMITS.noticeTitle) fieldErrors.title = `Keep the title under ${LIMITS.noticeTitle} characters.`;
  if (!isValidISODate(values.date)) fieldErrors.date = "Please choose a valid date.";
  if (!isNoticeTag(values.tag)) fieldErrors.tag = `Choose one of: ${NOTICE_TAGS.join(", ")}.`;
  return { values, fieldErrors };
}

function refreshAll() {
  revalidateNoticesAndEvents();
  revalidatePath("/admin");
  revalidatePath("/admin/notices");
}

export async function createNotice(_prev: NoticeFormState, formData: FormData): Promise<NoticeFormState> {
  await requireUser();
  const { values, fieldErrors } = parseNotice(formData);
  if (fieldErrors && Object.keys(fieldErrors).length) return { error: "Please correct the highlighted fields.", fieldErrors, values };

  // New notices go to the top of the board.
  const top = await db.select({ m: min(notices.sortOrder) }).from(notices).get();
  await db.insert(notices).values({ ...values, sortOrder: (top?.m ?? 0) - 1 });

  refreshAll();
  redirect("/admin/notices?saved=created");
}

export async function updateNotice(id: number, _prev: NoticeFormState, formData: FormData): Promise<NoticeFormState> {
  await requireUser();
  const { values, fieldErrors } = parseNotice(formData);
  if (fieldErrors && Object.keys(fieldErrors).length) return { error: "Please correct the highlighted fields.", fieldErrors, values };

  const result = await db
    .update(notices)
    .set({ ...values, updatedAt: new Date().toISOString() })
    .where(eq(notices.id, id));
  if (result.rowsAffected === 0) return { error: "This notice no longer exists.", values };

  refreshAll();
  redirect("/admin/notices?saved=updated");
}

export async function deleteNotice(formData: FormData) {
  await requireUser();
  const id = Number(formData.get("id"));
  if (Number.isInteger(id)) await db.delete(notices).where(eq(notices.id, id));
  refreshAll();
  redirect("/admin/notices?saved=deleted");
}

/** Moves a notice one step up or down in the display order. */
export async function moveNotice(formData: FormData) {
  await requireUser();
  const id = Number(formData.get("id"));
  const direction = formData.get("direction") === "up" ? -1 : 1;

  const ordered = await getNotices();
  const index = ordered.findIndex((n) => n.id === id);
  const swapWith = index + direction;
  if (index === -1 || swapWith < 0 || swapWith >= ordered.length) return;

  // Normalise to 0..n-1 so imported rows with equal sort_order behave, then swap.
  const ids = ordered.map((n) => n.id);
  [ids[index], ids[swapWith]] = [ids[swapWith], ids[index]];
  await db.transaction(async (tx) => {
    for (const [position, noticeId] of ids.entries()) {
      await tx.update(notices).set({ sortOrder: position }).where(eq(notices.id, noticeId));
    }
  });

  refreshAll();
}
