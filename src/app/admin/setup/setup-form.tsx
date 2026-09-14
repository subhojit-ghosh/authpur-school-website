"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { KeyRound } from "lucide-react";
import { FieldError, FormError } from "@/components/admin/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { completeSetup, type SetupState } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="h-11 w-full bg-brand text-base font-semibold text-brand-foreground hover:bg-brand-muted">
      <KeyRound className="size-4" />
      {pending ? "Creating account…" : "Create the staff account"}
    </Button>
  );
}

export function SetupForm() {
  const [state, action] = useActionState<SetupState, FormData>(completeSetup, {});
  const fe = state.fieldErrors ?? {};

  return (
    <form action={action} className="grid gap-5" noValidate>
      <div className="grid gap-2">
        <Label htmlFor="code">One-time setup code</Label>
        <Input
          id="code"
          name="code"
          placeholder="XXXX-XXXX-XXXX"
          autoComplete="off"
          spellCheck={false}
          className="font-mono uppercase tracking-widest"
          aria-invalid={fe.code ? true : undefined}
          autoFocus
        />
        <p className="text-xs text-muted-foreground">
          Printed in the deployment&apos;s build log (Vercel → Deployments → the latest build → Build Logs, look for “FIRST-TIME SETUP”).
        </p>
        <FieldError message={fe.code?.trim() ? fe.code : undefined} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="displayName">Name shown in the panel</Label>
          <Input id="displayName" name="displayName" defaultValue="School Office" maxLength={80} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" name="username" defaultValue="admin" autoCapitalize="none" spellCheck={false} aria-invalid={fe.username ? true : undefined} />
          <FieldError message={fe.username} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" autoComplete="new-password" aria-invalid={fe.password ? true : undefined} />
          <FieldError message={fe.password} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirm">Repeat password</Label>
          <Input id="confirm" name="confirm" type="password" autoComplete="new-password" aria-invalid={fe.confirm ? true : undefined} />
          <FieldError message={fe.confirm} />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">At least 8 characters, containing both letters and numbers.</p>

      <FormError message={state.error} />
      <SubmitButton />
    </form>
  );
}
