"use server";

import { revalidatePath } from "next/cache";
import { eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { enquiries } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";

function refresh() {
  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
}

export async function markEnquiryRead(formData: FormData) {
  await requireUser();
  const id = Number(formData.get("id"));
  const unread = formData.get("unread") === "1";
  if (Number.isInteger(id)) {
    const [row] = await db.select({ name: enquiries.name }).from(enquiries).where(eq(enquiries.id, id)).limit(1);
    await db
      .update(enquiries)
      .set({ readAt: unread ? null : new Date().toISOString() })
      .where(eq(enquiries.id, id));
    if (row) {
      await recordAudit("Enquiry Inbox", "updated", `Marked the enquiry from ${row.name} as ${unread ? "new" : "read"}`);
    }
  }
  refresh();
}

export async function markAllEnquiriesRead() {
  await requireUser();
  const marked = await db
    .update(enquiries)
    .set({ readAt: new Date().toISOString() })
    .where(isNull(enquiries.readAt))
    .returning({ id: enquiries.id });
  if (marked.length) await recordAudit("Enquiry Inbox", "updated", `Marked ${marked.length} enquir${marked.length === 1 ? "y" : "ies"} as read`);
  refresh();
}

export async function deleteEnquiry(formData: FormData) {
  await requireUser();
  const id = Number(formData.get("id"));
  if (Number.isInteger(id)) {
    const [row] = await db.select({ name: enquiries.name }).from(enquiries).where(eq(enquiries.id, id)).limit(1);
    await db.delete(enquiries).where(eq(enquiries.id, id));
    if (row) await recordAudit("Enquiry Inbox", "deleted", `Deleted the enquiry from ${row.name}`);
  }
  refresh();
}
