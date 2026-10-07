"use client";

import { useEffect, useState, useTransition } from "react";
import { Check, Loader2, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import type { GalleryCategory } from "@/lib/settings-types";
import { deleteGalleryPhoto, updateGalleryPhoto, type GalleryActionResult } from "./actions";

type Photo = { id: number; url: string; thumbUrl: string; caption: string; category: string };

export function GalleryPhotoCard({ photo, categories }: { photo: Photo; categories: readonly GalleryCategory[] }) {
  // Controlled fields: an uncontrolled <select> snaps back to its first-render value
  // when React resets the form after the save, even though the save went through.
  const [caption, setCaption] = useState(photo.caption);
  const [category, setCategory] = useState(photo.category);
  const [busy, setBusy] = useState<"save" | "delete" | null>(null);
  const [status, setStatus] = useState<{ saved: true } | { error: string } | null>(null);
  const [, startTransition] = useTransition();

  // "Saved" fades away on its own; errors stay until the next attempt.
  useEffect(() => {
    if (!status || !("saved" in status)) return;
    const t = setTimeout(() => setStatus(null), 2500);
    return () => clearTimeout(t);
  }, [status]);

  function run(kind: "save" | "delete", action: (fd: FormData) => Promise<GalleryActionResult>) {
    const fd = new FormData();
    fd.set("id", String(photo.id));
    fd.set("caption", caption);
    fd.set("category", category);
    setBusy(kind);
    setStatus(null);
    startTransition(async () => {
      try {
        const result = await action(fd);
        // A deleted photo drops out of the list on its own, so only a save needs confirming.
        if (!result.ok) setStatus({ error: result.error });
        else if (kind === "save") setStatus({ saved: true });
      } catch {
        setStatus({ error: "Something went wrong. Please try again." });
      } finally {
        setBusy(null);
      }
    });
  }

  return (
    <li className="overflow-hidden rounded-2xl border bg-card">
      <a href={photo.url} target="_blank" rel="noreferrer" className="block aspect-4/3 bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.thumbUrl} alt={photo.caption || photo.category} className="h-full w-full object-cover" loading="lazy" />
      </a>
      <form
        className="grid gap-2 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          run("save", updateGalleryPhoto);
        }}
      >
        <Input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Caption (optional)"
          maxLength={160}
          className="h-9 text-xs"
          aria-label="Caption"
        />
        <div className="flex items-center gap-2">
          <NativeSelect value={category} onChange={(e) => setCategory(e.target.value)} className="h-9 text-xs" aria-label="Category">
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </NativeSelect>
          <Button type="submit" size="icon-sm" variant="outline" disabled={busy !== null} aria-label="Save caption and category" title="Save">
            {busy === "save" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : status && "saved" in status ? (
              <Check className="size-4 text-[oklch(0.5_0.13_150)]" />
            ) : (
              <Save className="size-4" />
            )}
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            disabled={busy !== null}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            aria-label="Delete photo"
            title="Delete"
            onClick={() => {
              if (window.confirm("Delete this photo from the gallery?\n\nThis cannot be undone.")) {
                run("delete", deleteGalleryPhoto);
              }
            }}
          >
            {busy === "delete" ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
          </Button>
          <span role="status" className="ml-auto text-xs font-medium text-[oklch(0.45_0.12_150)]">
            {status && "saved" in status ? "Saved!" : busy === "save" ? <span className="text-muted-foreground">Saving…</span> : null}
          </span>
        </div>
        {status && "error" in status ? (
          <p role="alert" className="text-xs font-medium text-destructive">
            {status.error}
          </p>
        ) : null}
      </form>
    </li>
  );
}
