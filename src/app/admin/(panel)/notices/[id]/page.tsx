import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { getNotice } from "@/lib/content";
import { updateNotice } from "../actions";
import { NoticeForm } from "../notice-form";

export const metadata: Metadata = { title: "Edit notice" };

export default async function EditNoticePage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const notice = Number.isInteger(id) ? await getNotice(id) : undefined;
  if (!notice) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow="Notice Board" title="Edit notice" description="Changes are published to the website when you save." />
      <div className="max-w-2xl rounded-2xl border bg-card p-6">
        <NoticeForm
          action={updateNotice.bind(null, notice.id)}
          initial={{ title: notice.title, date: notice.date, tag: notice.tag, description: notice.description, active: notice.active }}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
