"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword, type ChangePasswordState } from "@/app/admin/(panel)/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="h-10 bg-brand px-5 font-semibold text-brand-foreground hover:bg-brand-muted">
      <KeyRound className="size-4" />
      {pending ? "Saving…" : "Change password"}
    </Button>
  );
}

export function ChangePasswordForm() {
  const [state, action] = useActionState<ChangePasswordState, FormData>(changePassword, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="grid gap-5" noValidate>
      <div className="grid gap-2">
        <Label htmlFor="current">Current password</Label>
        <Input id="current" name="current" type="password" autoComplete="current-password" required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="next">New password</Label>
          <Input id="next" name="next" type="password" autoComplete="new-password" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirm">Repeat new password</Label>
          <Input id="confirm" name="confirm" type="password" autoComplete="new-password" required />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        At least 8 characters, containing both letters and numbers. Other signed-in devices will be signed out.
      </p>

      {state.error ? (
        <p role="alert" className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm font-medium text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p role="status" className="flex items-start gap-2 rounded-lg border border-[oklch(0.8_0.1_150)] bg-[oklch(0.95_0.04_150)] px-3.5 py-2.5 text-sm font-medium text-[oklch(0.35_0.1_150)]">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          {state.success}
        </p>
      ) : null}

      <div>
        <SubmitButton />
      </div>
    </form>
  );
}
