import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { createEvent } from "../actions";
import { EventForm } from "../event-form";

export const metadata: Metadata = { title: "Add event" };

export default function NewEventPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow="Events" title="Add event" description="The event goes live on the website as soon as you save it." />
      <div className="max-w-2xl rounded-2xl border bg-card p-6">
        <EventForm action={createEvent} submitLabel="Publish event" />
      </div>
    </div>
  );
}
