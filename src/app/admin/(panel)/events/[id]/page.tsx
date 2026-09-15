import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { getEvent } from "@/lib/content";
import { updateEvent } from "../actions";
import { EventForm } from "../event-form";

export const metadata: Metadata = { title: "Edit event" };

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const event = Number.isInteger(id) ? await getEvent(id) : undefined;
  if (!event) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow="Events" title="Edit event" description="Changes are published to the website when you save." />
      <div className="max-w-2xl rounded-2xl border bg-card p-6">
        <EventForm
          action={updateEvent.bind(null, event.id)}
          initial={{ title: event.title, date: event.date, venue: event.venue, description: event.description, active: event.active }}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
