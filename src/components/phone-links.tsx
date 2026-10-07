import { phoneEntries } from "@/lib/settings-types";
import { cn } from "@/lib/utils";

/**
 * A school's telephone numbers, each one its own tap-to-call link.
 *
 * The numbers are kept in a single field separated by a slash and are shown
 * that way. Linking the whole string would let a visitor ring only the first
 * number, so each is linked on its own and the slash sits between them as
 * plain text.
 */
export function PhoneLinks({
  value,
  className,
  linkClassName,
}: {
  value: string;
  className?: string;
  linkClassName?: string;
}) {
  const numbers = phoneEntries(value);
  if (!numbers.length) return null;

  return (
    <span className={className}>
      {numbers.map((number, index) => (
        <span key={`${number.display}-${index}`}>
          {index > 0 ? <span aria-hidden className="px-1.5 opacity-60">/</span> : null}
          <a href={`tel:${number.dial}`} className={cn("whitespace-nowrap", linkClassName)}>
            {number.display}
          </a>
        </span>
      ))}
    </span>
  );
}
