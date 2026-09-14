"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { events } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { LIMITS } from "@/lib/content-types";
import { isValidISODate } from "@/lib/format";
import { revalidateNoticesAndEvents } from "@/lib/revalidate";

export type EventValues = { title: string; date: string; venue: string };
export type EventFormState = { error?: string; fieldErrors?: Partial<Record<keyof EventValues, string>>; values?: EventValues };

function parseEvent(formData: FormData): { values: EventValues; fieldErrors: EventFormState["fieldErrors"] } {
  const values: EventValues = {
    title: String(formData.get("title") ?? "").trim().slice(0, LIMITS.eventTitle + 1),
    date: String(formData.get("date") ?? "").trim(),
    venue: String(formData.get("venue") ?? "").trim().slice(0, LIMITS.eventVenue + 1),
  };
  const fieldErrors: EventFormState["fieldErrors"] = {};
  if (values.title.length < 3) fieldErrors.title = "Please enter a title (at least 3 characters).";
  else if (values.title.length > LIMITS.eventTitle) fieldErrors.title = `Keep the title under ${LIMITS.eventTitle} characters.`;
  if (!isValidISODate(values.date)) fieldErrors.date = "Please choose a valid date.";
  if (values.venue.length < 2) fieldErrors.venue = "Please enter the venue.";
  else if (values.venue.length > LIMITS.eventVenue) fieldErrors.venue = `Keep the venue under ${LIMITS.eventVenue} characters.`;
  return { values, fieldErrors };
}

function refreshAll() {
  revalidateNoticesAndEvents();
  revalidatePath("/admin");
  revalidatePath("/admin/events");
}

export async function createEvent(_prev: EventFormState, formData: FormData): Promise<EventFormState> {
  await requireUser();
  const { values, fieldErrors } = parseEvent(formData);
  if (fieldErrors && Object.keys(fieldErrors).length) return { error: "Please correct the highlighted fields.", fieldErrors, values };

  await db.insert(events).values(values);
  refreshAll();
  redirect("/admin/events?saved=created");
}

export async function updateEvent(id: number, _prev: EventFormState, formData: FormData): Promise<EventFormState> {
  await requireUser();
  const { values, fieldErrors } = parseEvent(formData);
  if (fieldErrors && Object.keys(fieldErrors).length) return { error: "Please correct the highlighted fields.", fieldErrors, values };

  const updated = await db
    .update(events)
    .set({ ...values, updatedAt: new Date().toISOString() })
    .where(eq(events.id, id))
    .returning({ id: events.id });
  if (updated.length === 0) return { error: "This event no longer exists.", values };

  refreshAll();
  redirect("/admin/events?saved=updated");
}

export async function deleteEvent(formData: FormData) {
  await requireUser();
  const id = Number(formData.get("id"));
  if (Number.isInteger(id)) await db.delete(events).where(eq(events.id, id));
  refreshAll();
  redirect("/admin/events?saved=deleted");
}
