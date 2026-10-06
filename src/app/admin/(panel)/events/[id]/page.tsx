import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { getEvent } from "@/lib/content";
import { eventPath } from "@/lib/permalinks";
import { updateEvent } from "../actions";
import { EventForm } from "../event-form";

export const metadata: Metadata = { title: "Edit event" };

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const event = Number.isInteger(id) ? await getEvent(id) : undefined;
  if (!event) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Events"
        title="Edit event"
        description="Changes are published to the website when you save."
        actions={
          <Button asChild variant="outline" className="h-10">
            <Link href={eventPath(event)} target="_blank">
              <ExternalLink className="size-4" />
              View this event
            </Link>
          </Button>
        }
      />
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
