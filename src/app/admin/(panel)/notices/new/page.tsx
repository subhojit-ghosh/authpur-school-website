import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { createNotice } from "../actions";
import { NoticeForm } from "../notice-form";

export const metadata: Metadata = { title: "Add notice" };

export default function NewNoticePage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow="Notice Board" title="Add notice" description="The notice goes live on the website as soon as you save it." />
      <div className="max-w-2xl rounded-2xl border bg-card p-6">
        <NoticeForm action={createNotice} submitLabel="Publish notice" />
      </div>
    </div>
  );
}
