"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Building2, Clock, Plus, Save, Trash2 } from "lucide-react";
import { FieldError, FormError } from "@/components/admin/form-message";
import { Flash } from "@/components/admin/flash";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { RowsEditor } from "@/components/admin/rows-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { phoneParts, type SchoolInfo, type Timings } from "@/lib/settings-types";
import { saveSchoolInfo, saveTimings, type SaveState } from "./actions";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="h-10 bg-brand px-5 font-semibold text-brand-foreground hover:bg-brand-muted">
      <Save className="size-4" />
      {pending ? "Saving…" : label}
    </Button>
  );
}

function Field({
  id,
  label,
  defaultValue,
  error,
  ...props
}: { id: string; label: string; defaultValue: string; error?: string } & React.ComponentProps<typeof Input>) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} defaultValue={defaultValue} aria-invalid={error ? true : undefined} {...props} />
      <FieldError message={error} />
    </div>
  );
}

/**
 * One or more telephone numbers for a single field.
 *
 * A school usually publishes several lines, so numbers can be added and
 * removed here. They are posted as one field joined with " / ", which is how
 * the website shows them, and a tap-to-call link uses the first.
 */
function PhoneField({
  id,
  label,
  defaultValue,
  error,
}: {
  id: string;
  label: string;
  defaultValue: string;
  error?: string;
}) {
  const [numbers, setNumbers] = useState<string[]>(() => {
    const parts = phoneParts(defaultValue);
    return parts.length ? parts : [""];
  });

  const update = (index: number, value: string) =>
    setNumbers((list) => list.map((n, i) => (i === index ? value : n)));

  return (
    <div className="grid content-start gap-2">
      <Label htmlFor={`${id}-0`}>{label}</Label>
      <input type="hidden" name={id} value={numbers.map((n) => n.trim()).filter(Boolean).join(" / ")} />

      <div className="grid gap-2">
        {numbers.map((number, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <Input
              id={`${id}-${index}`}
              value={number}
              type="tel"
              placeholder={index === 0 ? "033 2581 4044" : "Another number"}
              aria-label={index === 0 ? label : `${label}, number ${index + 1}`}
              aria-invalid={error ? true : undefined}
              onChange={(e) => update(index, e.target.value)}
            />
            {index === numbers.length - 1 ? (
              <Button
                type="button"
                size="icon-sm"
                variant="outline"
                aria-label={`Add another number to ${label}`}
                title="Add another number"
                onClick={() => setNumbers((list) => [...list, ""])}
              >
                <Plus className="size-4" />
              </Button>
            ) : null}
            {numbers.length > 1 ? (
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                aria-label={`Remove number ${index + 1} from ${label}`}
                onClick={() => setNumbers((list) => list.filter((_, i) => i !== index))}
              >
                <Trash2 className="size-4" />
              </Button>
            ) : null}
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        {numbers.filter((n) => n.trim()).length > 1
          ? "Shown on the website separated by a slash. Tapping it calls the first."
          : "Press + to add another line."}
      </p>
      <FieldError message={error} />
    </div>
  );
}

export function SchoolInfoForm({ initial }: { initial: SchoolInfo }) {
  const [state, action] = useActionState<SaveState, FormData>(saveSchoolInfo, {});
  const fe = state.fieldErrors ?? {};

  return (
    <form action={action} className="rounded-2xl border bg-card p-6">
      <h3 className="flex items-center gap-2 font-heading text-base font-semibold text-brand">
        <Building2 className="size-4 text-gold" />
        Contact details & address
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Used in the top bar, footer, Contact section, Admission Enquiry page and the Admissions page.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <PhoneField id="phone" label="School office phone" defaultValue={initial.phone} error={fe.phone} />
        <PhoneField id="admissionsPhone" label="Admissions helpline" defaultValue={initial.admissionsPhone} error={fe.admissionsPhone} />
        <div className="sm:col-span-2">
          <Field id="email" label="Email address" defaultValue={initial.email} error={fe.email} type="email" />
        </div>
        <Field id="line1" label="Address line 1" defaultValue={initial.address.line1} error={fe.line1} />
        <Field id="line2" label="Address line 2" defaultValue={initial.address.line2} error={fe.line2} />
        <Field id="city" label="City" defaultValue={initial.address.city} error={fe.city} />
        <Field id="state" label="State" defaultValue={initial.address.state} error={fe.state} />
        <Field id="pin" label="PIN code" defaultValue={initial.address.pin} error={fe.pin} inputMode="numeric" maxLength={6} />
        <Field id="officeHours" label="Office hours" defaultValue={initial.officeHours} error={fe.officeHours} placeholder="e.g. Monday – Saturday · 8:00 AM – 4:00 PM" />
      </div>

      <div className="mt-5 grid gap-3">
        <FormError message={state.error} />
        {state.success ? <Flash text={state.success} /> : null}
        <div>
          <SubmitButton label="Save contact details" />
        </div>
      </div>
    </form>
  );
}

export function TimingsForm({ initial }: { initial: Timings }) {
  const [state, action] = useActionState<SaveState, FormData>(saveTimings, {});

  return (
    <form action={action} className="rounded-2xl border bg-card p-6">
      <h3 className="flex items-center gap-2 font-heading text-base font-semibold text-brand">
        <Clock className="size-4 text-gold" />
        School timings
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">Shown on the School Timings page.</p>

      <div className="mt-5 grid gap-6">
        <div>
          <p className="mb-2 text-sm font-medium">A day at school</p>
          <RowsEditor
            name="daily"
            columns={[
              { key: "label", label: "Item", placeholder: "e.g. Morning assembly" },
              { key: "time", label: "Time", placeholder: "e.g. 7:50 AM" },
            ]}
            initial={initial.dailySchedule}
            addLabel="Add item"
          />
        </div>
        <div>
          <p className="mb-2 text-sm font-medium">Section-wise class hours</p>
          <RowsEditor
            name="sections"
            columns={[
              { key: "section", label: "Section", placeholder: "e.g. Primary (Class I – V)" },
              { key: "days", label: "Days", placeholder: "e.g. Mon – Sat" },
              { key: "time", label: "Timing", placeholder: "e.g. 8:00 AM – 1:30 PM" },
            ]}
            initial={initial.sectionTimings}
            addLabel="Add section"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="timingsNote">Note shown on the page</Label>
          <RichTextEditor
            name="timingsNote"
            defaultValue={initial.timingsNote}
            placeholder="e.g. Gates open fifteen minutes before assembly."
            ariaLabel="Note shown on the page"
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        <FormError message={state.error} />
        {state.success ? <Flash text={state.success} /> : null}
        <div>
          <SubmitButton label="Save timings" />
        </div>
      </div>
    </form>
  );
}
