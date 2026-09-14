"use client";

import { Button } from "@/components/ui/button";

/**
 * A submit button that asks for confirmation first. Use inside a <form action={…}>.
 */
export function ConfirmButton({
  message,
  onClick,
  ...props
}: React.ComponentProps<typeof Button> & { message: string }) {
  return (
    <Button
      type="submit"
      {...props}
      onClick={(e) => {
        if (!window.confirm(message)) {
          e.preventDefault();
          return;
        }
        onClick?.(e);
      }}
    />
  );
}
