"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Save } from "lucide-react";
import { FieldError, FormError } from "@/components/admin/form-message";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LIMITS } from "@/lib/content-types";
import { todayISO } from "@/lib/format";
import type { EventFormState, EventValues } from "./actions";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="h-10 bg-brand px-5 font-semibold text-brand-foreground hover:bg-brand-muted">
      <Save className="size-4" />
      {pending ? "Saving…" : label}
    </Button>
  );
}

export function EventForm({
  action,
  initial,
  submitLabel,
}: {
  action: (prev: EventFormState, formData: FormData) => Promise<EventFormState>;
  initial?: EventValues;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState<EventFormState, FormData>(action, {});
  const values = state.values ?? initial ?? { title: "", date: todayISO(), venue: "", description: "" };
  const fe = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="grid gap-5" noValidate>
      <div className="grid gap-2">
        <Label htmlFor="title">Event title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={values.title}
          maxLength={LIMITS.eventTitle}
          placeholder="e.g. Annual Sports Day"
          aria-invalid={fe.title ? true : undefined}
          autoFocus
        />
        <FieldError message={fe.title} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" name="date" type="date" defaultValue={values.date} aria-invalid={fe.date ? true : undefined} />
          <FieldError message={fe.date} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="venue">Venue</Label>
          <Input
            id="venue"
            name="venue"
            defaultValue={values.venue}
            maxLength={LIMITS.eventVenue}
            placeholder="e.g. Main Auditorium"
            aria-invalid={fe.venue ? true : undefined}
          />
          <FieldError message={fe.venue} />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description <span className="font-normal text-muted-foreground">(optional)</span></Label>
        <RichTextEditor
          name="description"
          defaultValue={values.description}
          ariaLabel="Event description"
          placeholder="Add the full details — you can use bold, lists and links."
        />
        <p className="text-xs text-muted-foreground">Shown under the event on the website&apos;s Notices page.</p>
        <FieldError message={fe.description} />
      </div>

      <p className="text-xs text-muted-foreground">
        Only events dated today or later are shown on the website. Past events stay in this list so you can re-use them.
      </p>

      <FormError message={state.error} />

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton label={submitLabel} />
        <Button asChild variant="ghost" className="h-10">
          <Link href="/admin/events">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
