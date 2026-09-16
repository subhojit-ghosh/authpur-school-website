"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Save } from "lucide-react";
import { Flash } from "@/components/admin/flash";
import { FormError } from "@/components/admin/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import type { ContentState } from "@/app/admin/(panel)/content/actions";

/** Shared building blocks for the "Website Text" forms. */

export function SaveBar({ label = "Save & publish" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="h-10 bg-brand px-5 font-semibold text-brand-foreground hover:bg-brand-muted">
      <Save className="size-4" />
      {pending ? "Saving…" : label}
    </Button>
  );
}

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-card p-5 sm:p-6">
      <h3 className="font-heading text-base font-semibold text-brand">{title}</h3>
      {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
      <div className="mt-4 grid gap-4">{children}</div>
    </section>
  );
}

export function Field({
  name,
  label,
  defaultValue,
  hint,
  ...props
}: { name: string; label: string; defaultValue?: string; hint?: string } & React.ComponentProps<typeof Input>) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} defaultValue={defaultValue} {...props} />
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function TextField({
  name,
  label,
  defaultValue,
  hint,
  rows = 4,
  ...props
}: { name: string; label: string; defaultValue?: string; hint?: string; rows?: number } & React.ComponentProps<
  typeof Textarea
>) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Textarea id={name} name={name} defaultValue={defaultValue} rows={rows} {...props} />
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function SelectField({
  name,
  label,
  defaultValue,
  options,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  options: readonly string[];
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <NativeSelect id={name} name={name} defaultValue={defaultValue}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </NativeSelect>
    </div>
  );
}

/** Eyebrow / heading / blurb trio used by most home-page sections. */
export function HeadingFields({
  prefix,
  value,
  blurbLabel = "Short paragraph under the heading",
}: {
  prefix: string;
  value: { eyebrow: string; heading: string; blurb: string };
  blurbLabel?: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field name={`${prefix}.eyebrow`} label="Small label above the heading" defaultValue={value.eyebrow} />
      <Field name={`${prefix}.heading`} label="Heading" defaultValue={value.heading} />
      <div className="sm:col-span-2">
        <TextField name={`${prefix}.blurb`} label={blurbLabel} defaultValue={value.blurb} rows={2} />
      </div>
    </div>
  );
}

/** Wraps a content form: handles the action state, the message and the save button. */
export function ContentForm({
  action,
  children,
  saveLabel,
}: {
  action: (prev: ContentState, formData: FormData) => Promise<ContentState>;
  children: React.ReactNode;
  saveLabel?: string;
}) {
  const [state, formAction] = useActionState<ContentState, FormData>(action, {});

  return (
    <form action={formAction} className="grid gap-5" noValidate>
      {children}
      <FormError message={state.error} />
      {state.success ? <Flash text={state.success} /> : null}
      <div className="sticky bottom-4 flex justify-start">
        <div className="rounded-xl bg-background/80 p-1 backdrop-blur">
          <SaveBar label={saveLabel} />
        </div>
      </div>
    </form>
  );
}
