import { sanitizeRichText } from "@/lib/rich-text";
import { cn } from "@/lib/utils";

/**
 * Renders a description written in the admin panel. The HTML is sanitised when
 * it is saved and again here, so a stored value can never inject markup.
 */
export function RichText({ html, className }: { html: string; className?: string }) {
  const safe = sanitizeRichText(html);
  if (!safe) return null;

  return (
    <div
      className={cn(
        "text-sm leading-relaxed text-muted-foreground",
        "[&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0",
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5",
        "[&_a]:font-medium [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-gold-foreground",
        "[&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-gold [&_blockquote]:pl-3 [&_blockquote]:italic",
        "[&_h3]:mt-3 [&_h3]:font-heading [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-brand",
        "[&_h4]:mt-3 [&_h4]:font-semibold [&_h4]:text-foreground",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
