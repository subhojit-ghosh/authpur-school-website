"use client";

import { useActionState, useState } from "react";
import { Check, Loader2, Save } from "lucide-react";
import { SavedNote, useJustSaved } from "@/components/admin/pending";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBannerAlt, type BannerActionResult } from "./actions";

export function BannerDescriptionForm({ id, alt }: { id: number; alt: string }) {
  // Controlled so a failed save does not wipe what was typed when React resets the form.
  const [value, setValue] = useState(alt);
  const [state, action, pending] = useActionState<BannerActionResult | null, FormData>((_, fd) => updateBannerAlt(fd), null);
  const saved = state?.ok ? state : null;
  const justSaved = useJustSaved(saved);

  return (
    <form action={action} className="grid gap-1.5">
      <div className="flex items-center gap-2">
        <input type="hidden" name="id" value={id} />
        <Input
          name="alt"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Short description (for accessibility)"
          maxLength={160}
          className="h-9 text-xs"
          aria-label="Image description"
        />
        <Button type="submit" size="icon-sm" variant="outline" disabled={pending} aria-label="Save description" title="Save">
          {pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : justSaved ? (
            <Check className="size-4 text-[oklch(0.5_0.13_150)]" />
          ) : (
            <Save className="size-4" />
          )}
        </Button>
      </div>
      {state && !state.ok ? (
        <p role="alert" className="text-xs font-medium text-destructive">
          {state.error}
        </p>
      ) : (
        <SavedNote trigger={saved} className="text-xs empty:hidden" />
      )}
    </form>
  );
}
