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
import { NativeSelect } from "@/components/ui/native-select";
import { LIMITS, NOTICE_TAGS } from "@/lib/content-types";
import { todayISO } from "@/lib/format";
import type { NoticeFormState, NoticeValues } from "./actions";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="h-10 bg-brand px-5 font-semibold text-brand-foreground hover:bg-brand-muted">
      <Save className="size-4" />
      {pending ? "Saving…" : label}
    </Button>
  );
}

export function NoticeForm({
  action,
  initial,
  submitLabel,
}: {
  action: (prev: NoticeFormState, formData: FormData) => Promise<NoticeFormState>;
  initial?: NoticeValues;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState<NoticeFormState, FormData>(action, {});
  const values = state.values ?? initial ?? { title: "", date: todayISO(), tag: "Notice", description: "" };
  const fe = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="grid gap-5" noValidate>
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={values.title}
          maxLength={LIMITS.noticeTitle}
          placeholder="e.g. Admissions open for the 2026–27 session"
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
          <Label htmlFor="tag">Category</Label>
          <NativeSelect id="tag" name="tag" defaultValue={values.tag} aria-invalid={fe.tag ? true : undefined}>
            {NOTICE_TAGS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </NativeSelect>
          <FieldError message={fe.tag} />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description <span className="font-normal text-muted-foreground">(optional)</span></Label>
        <RichTextEditor
          name="description"
          defaultValue={values.description}
          ariaLabel="Notice description"
          placeholder="Add the full details — you can use bold, lists and links."
        />
        <p className="text-xs text-muted-foreground">Shown under the notice on the website&apos;s Notices page.</p>
        <FieldError message={fe.description} />
      </div>

      <FormError message={state.error} />

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton label={submitLabel} />
        <Button asChild variant="ghost" className="h-10">
          <Link href="/admin/notices">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
