"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { KeyRound, Save } from "lucide-react";
import { FieldError, FormError } from "@/components/admin/form-message";
import { Flash } from "@/components/admin/flash";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { USERNAME_HINT } from "@/lib/user-rules";
import type { ResetState, UserFormState, UserValues } from "./actions";

function SubmitButton({ label, icon: Icon = Save }: { label: string; icon?: typeof Save }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="h-10 bg-brand px-5 font-semibold text-brand-foreground hover:bg-brand-muted">
      <Icon className="size-4" />
      {pending ? "Saving…" : label}
    </Button>
  );
}

/** Add a new staff account (name, username and first password). */
export function NewUserForm({
  action,
}: {
  action: (prev: UserFormState, formData: FormData) => Promise<UserFormState>;
}) {
  const [state, formAction] = useActionState<UserFormState, FormData>(action, {});
  const values = state.values ?? { displayName: "", username: "" };
  const fe = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="grid gap-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="displayName">Name</Label>
          <Input id="displayName" name="displayName" defaultValue={values.displayName} placeholder="e.g. Mrs. Sen (Office)" maxLength={80} aria-invalid={fe.displayName ? true : undefined} autoFocus />
          <FieldError message={fe.displayName} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" name="username" defaultValue={values.username} placeholder="e.g. office" autoCapitalize="none" spellCheck={false} aria-invalid={fe.username ? true : undefined} />
          <FieldError message={fe.username} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="password">First password</Label>
          <Input id="password" name="password" type="password" autoComplete="new-password" aria-invalid={fe.password ? true : undefined} />
          <FieldError message={fe.password} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirm">Repeat password</Label>
          <Input id="confirm" name="confirm" type="password" autoComplete="new-password" aria-invalid={fe.confirm ? true : undefined} />
          <FieldError message={fe.confirm} />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        At least 8 characters with letters and numbers. {USERNAME_HINT} Share the password with that person and ask them to change
        it from <span className="font-medium">Account &amp; Password</span> after their first sign-in.
      </p>

      <FormError message={state.error} />

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton label="Create account" />
        <Button asChild variant="ghost" className="h-10">
          <Link href="/admin/users">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}

/** Edit an existing account's name and username. */
export function EditUserForm({
  action,
  initial,
}: {
  action: (prev: UserFormState, formData: FormData) => Promise<UserFormState>;
  initial: UserValues;
}) {
  const [state, formAction] = useActionState<UserFormState, FormData>(action, {});
  const values = state.values ?? initial;
  const fe = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="grid gap-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="displayName">Name</Label>
          <Input id="displayName" name="displayName" defaultValue={values.displayName} maxLength={80} aria-invalid={fe.displayName ? true : undefined} />
          <FieldError message={fe.displayName} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" name="username" defaultValue={values.username} autoCapitalize="none" spellCheck={false} aria-invalid={fe.username ? true : undefined} />
          <FieldError message={fe.username} />
        </div>
      </div>

      <FormError message={state.error} />

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton label="Save changes" />
        <Button asChild variant="ghost" className="h-10">
          <Link href="/admin/users">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}

/** Set a new password for an account. */
export function ResetPasswordForm({
  action,
}: {
  action: (prev: ResetState, formData: FormData) => Promise<ResetState>;
}) {
  const [state, formAction] = useActionState<ResetState, FormData>(action, {});

  return (
    <form action={formAction} className="grid gap-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="password">New password</Label>
          <Input id="password" name="password" type="password" autoComplete="new-password" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirm">Repeat new password</Label>
          <Input id="confirm" name="confirm" type="password" autoComplete="new-password" />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">At least 8 characters with letters and numbers. The person is signed out everywhere and must use the new password.</p>

      <FormError message={state.error} />
      {state.success ? <Flash text={state.success} /> : null}

      <div>
        <SubmitButton label="Set new password" icon={KeyRound} />
      </div>
    </form>
  );
}
