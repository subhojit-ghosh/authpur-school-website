"use client";

import { SubmitButton } from "@/components/admin/pending";

/**
 * A submit button that asks for confirmation first. Use inside a <form action={…}>.
 */
export function ConfirmButton({
  message,
  onClick,
  ...props
}: React.ComponentProps<typeof SubmitButton> & { message: string }) {
  return (
    <SubmitButton
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
