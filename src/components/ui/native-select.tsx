import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

function NativeSelect({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <span className="relative block">
      <select
        data-slot="native-select"
        className={cn(
          "flex h-10 w-full appearance-none rounded-lg border border-input bg-background pl-3.5 pr-9 text-sm shadow-xs transition-colors outline-none",
          "focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/20",
          "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </span>
  );
}

export { NativeSelect };
