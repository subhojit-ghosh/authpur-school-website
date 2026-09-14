"use server";

import { revalidatePath } from "next/cache";
import { eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { enquiries } from "@/db/schema";
import { requireUser } from "@/lib/auth";

function refresh() {
  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
}

export async function markEnquiryRead(formData: FormData) {
  await requireUser();
  const id = Number(formData.get("id"));
  const unread = formData.get("unread") === "1";
  if (Number.isInteger(id)) {
    await db
      .update(enquiries)
      .set({ readAt: unread ? null : new Date().toISOString() })
      .where(eq(enquiries.id, id));
  }
  refresh();
}

export async function markAllEnquiriesRead() {
  await requireUser();
  await db.update(enquiries).set({ readAt: new Date().toISOString() }).where(isNull(enquiries.readAt));
  refresh();
}

export async function deleteEnquiry(formData: FormData) {
  await requireUser();
  const id = Number(formData.get("id"));
  if (Number.isInteger(id)) await db.delete(enquiries).where(eq(enquiries.id, id));
  refresh();
}
