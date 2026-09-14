import { CheckCircle2 } from "lucide-react";

const messages: Record<string, string> = {
  created: "Saved. The new item is now live on the website.",
  updated: "Changes saved and published to the website.",
  deleted: "Deleted. It has been removed from the website.",
};

/** One-line success banner driven by a `?saved=` search param after a redirect. */
export function Flash({ kind, text }: { kind?: string; text?: string }) {
  const message = text ?? (kind ? messages[kind] : undefined);
  if (!message) return null;
  return (
    <p
      role="status"
      className="flex items-center gap-2 rounded-xl border border-[oklch(0.8_0.1_150)] bg-[oklch(0.95_0.04_150)] px-4 py-3 text-sm font-medium text-[oklch(0.35_0.1_150)]"
    >
      <CheckCircle2 className="size-4 shrink-0" />
      {message}
    </p>
  );
}
