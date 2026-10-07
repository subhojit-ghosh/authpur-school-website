"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Swaps the icon for a spinner while the surrounding form is submitting. */
export function PendingIcon({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return pending ? <Loader2 className="size-4 animate-spin" /> : children;
}

/**
 * A submit button for one-click actions (move, show/hide, delete…): it shows a
 * spinner in place of its icon and cannot be pressed again until the action finishes.
 */
export function SubmitButton({
  icon,
  children,
  disabled,
  ...props
}: React.ComponentProps<typeof Button> & { icon: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={disabled || pending} {...props}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : icon}
      {children}
    </Button>
  );
}

/**
 * True for a moment after each save. Pass something that is a new object on every
 * successful save (the action state, say) and null otherwise.
 */
export function useJustSaved(trigger: object | null) {
  const [expired, setExpired] = useState<object | null>(null);
  useEffect(() => {
    if (!trigger) return;
    const t = setTimeout(() => setExpired(trigger), 2500);
    return () => clearTimeout(t);
  }, [trigger]);
  return trigger !== null && expired !== trigger;
}

/** The "Saved!" that appears beside a save button and fades after a moment. */
export function SavedNote({ trigger, className }: { trigger: object | null; className?: string }) {
  const show = useJustSaved(trigger);
  return (
    <span role="status" className={cn("inline-flex items-center gap-1 text-sm font-medium text-[oklch(0.45_0.12_150)]", className)}>
      {show ? (
        <>
          <Check className="size-4" />
          Saved!
        </>
      ) : null}
    </span>
  );
}
