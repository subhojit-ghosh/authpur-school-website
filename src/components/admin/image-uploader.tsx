"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, ImagePlus, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { cn } from "@/lib/utils";

type Item = { name: string; status: "uploading" | "done" | "error"; message?: string };

/**
 * Drag-and-drop / click-to-choose uploader. Sends one request per file to
 * /admin/upload, shows progress per file and refreshes the page when finished.
 */
export function ImageUploader({
  kind,
  categories,
  defaultCategory,
  hint,
}: {
  kind: "banner" | "gallery";
  categories?: readonly string[];
  defaultCategory?: string;
  hint: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState(defaultCategory ?? categories?.[0] ?? "");
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  async function upload(files: FileList | File[]) {
    const list = Array.from(files);
    if (!list.length) return;
    setBusy(true);
    const start = items.length;
    setItems((prev) => [...prev, ...list.map((f) => ({ name: f.name, status: "uploading" as const }))]);

    for (const [i, file] of list.entries()) {
      const fd = new FormData();
      fd.set("kind", kind);
      fd.set("file", file);
      if (categories) fd.set("category", category);
      let result: Item;
      try {
        const res = await fetch("/admin/upload", { method: "POST", body: fd });
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        result = res.ok
          ? { name: file.name, status: "done" }
          : { name: file.name, status: "error", message: body.error ?? "Upload failed." };
      } catch {
        result = { name: file.name, status: "error", message: "Network problem — please try again." };
      }
      setItems((prev) => prev.map((it, idx) => (idx === start + i ? result : it)));
    }

    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  }

  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (!busy) void upload(e.dataTransfer.files);
          }}
          className={cn(
            "flex flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors",
            dragging ? "border-brand bg-accent/60" : "border-border hover:border-brand/50 hover:bg-accent/30",
            busy && "pointer-events-none opacity-60",
          )}
        >
          <span className="grid size-11 place-items-center rounded-full bg-gold-soft text-gold-foreground">
            {busy ? <Loader2 className="size-5 animate-spin" /> : <ImagePlus className="size-5" />}
          </span>
          <span className="text-sm font-semibold text-brand">{busy ? "Uploading…" : "Click to choose photos, or drag them here"}</span>
          <span className="text-xs text-muted-foreground">{hint}</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            disabled={busy}
            onChange={(e) => e.target.files && void upload(e.target.files)}
          />
        </label>

        {categories ? (
          <div className="grid w-full gap-2 sm:w-48">
            <Label htmlFor="upload-category">Category for new photos</Label>
            <NativeSelect id="upload-category" value={category} onChange={(e) => setCategory(e.target.value)} disabled={busy}>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </NativeSelect>
          </div>
        ) : null}
      </div>

      {items.length ? (
        <ul className="mt-4 grid gap-1.5 text-sm">
          {items.map((it, i) => (
            <li key={`${it.name}-${i}`} className="flex items-center gap-2">
              {it.status === "uploading" ? (
                <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
              ) : it.status === "done" ? (
                <CheckCircle2 className="size-4 shrink-0 text-[oklch(0.45_0.12_150)]" />
              ) : (
                <AlertCircle className="size-4 shrink-0 text-destructive" />
              )}
              <span className="truncate">{it.name}</span>
              <span className={cn("ml-auto shrink-0 text-xs", it.status === "error" ? "font-medium text-destructive" : "text-muted-foreground")}>
                {it.status === "uploading" ? "Uploading…" : it.status === "done" ? "Uploaded & optimised" : it.message}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
