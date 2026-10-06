"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Plus, Trash2, UserRound } from "lucide-react";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePrepareError, prepareImage } from "@/lib/image-client";
import { leaderSlug, MAX_LEADERS, type Leader } from "@/lib/page-content-types";
import { cn } from "@/lib/utils";

/**
 * Editor for the people on the leadership pages.
 *
 * The list is held here and posted as one JSON field, which the server checks
 * again before saving. Each person's own message is a formatting box, so those
 * are posted as ordinary named fields and matched back up by slug.
 */

type Row = { key: number; value: Leader };

let nextKey = 1;

function PhotoField({ leader, onChange }: { leader: Leader; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  async function choose(file: File) {
    setBusy(true);
    setError(undefined);
    try {
      const ready = await prepareImage(file, "portrait");
      const extension = ready.type === "image/webp" ? "webp" : "jpg";
      const base = file.name.replace(/\.[^.]+$/, "");
      const fd = new FormData();
      fd.set("kind", "portrait");
      fd.set("file", new File([ready.full], `${base}.${extension}`, { type: ready.type }));
      fd.set("thumb", new File([ready.thumb], `${base}-thumb.${extension}`, { type: ready.type }));
      fd.set("width", String(ready.width));
      fd.set("height", String(ready.height));
      fd.set("alt", leader.name || leader.role);

      const res = await fetch("/admin/upload", { method: "POST", body: fd });
      const body = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !body.url) {
        setError(body.error ?? "The photograph could not be uploaded.");
      } else {
        onChange(body.url);
      }
    } catch (err) {
      setError(err instanceof ImagePrepareError ? err.message : "Network problem — please try again.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="grid gap-2">
      <Label>Photograph</Label>
      <div className="flex items-center gap-3">
        <span className="relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-lg border bg-muted text-muted-foreground">
          {leader.photoUrl ? (
            <Image src={leader.photoUrl} alt="" fill sizes="80px" className="object-cover" unoptimized />
          ) : (
            <UserRound className="size-7" />
          )}
        </span>
        <div className="grid gap-1.5">
          <label
            className={cn(
              "inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:border-brand hover:text-brand",
              busy && "pointer-events-none opacity-60",
            )}
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
            {busy ? "Uploading…" : leader.photoUrl ? "Replace photograph" : "Choose photograph"}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={busy}
              onChange={(e) => e.target.files?.[0] && void choose(e.target.files[0])}
            />
          </label>
          {leader.photoUrl ? (
            <Button type="button" variant="ghost" size="sm" className="w-fit text-destructive" onClick={() => onChange("")}>
              Remove photograph
            </Button>
          ) : (
            <p className="text-xs text-muted-foreground">JPG, PNG or WebP. A head-and-shoulders photo works best.</p>
          )}
        </div>
      </div>
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}

export function LeadersEditor({ name, initial }: { name: string; initial: Leader[] }) {
  const [rows, setRows] = useState<Row[]>(() => initial.map((value) => ({ key: nextKey++, value })));

  const set = (key: number, patch: Partial<Leader>) =>
    setRows((list) => list.map((r) => (r.key === key ? { ...r, value: { ...r.value, ...patch } } : r)));

  const move = (index: number, direction: -1 | 1) =>
    setRows((list) => {
      const next = [...list];
      const target = index + direction;
      if (target < 0 || target >= next.length) return list;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  // The message of each person travels as its own field, keyed by slug, so the
  // formatting editor can post HTML the way it does everywhere else.
  const json = JSON.stringify(rows.map((r) => ({ ...r.value, message: "" })));

  return (
    <div className="grid gap-5">
      <input type="hidden" name={name} value={json} />

      {rows.map((row, index) => {
        const leader = row.value;
        return (
          <div key={row.key} className="grid gap-4 rounded-2xl border bg-background/60 p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <span className="min-w-0 flex-1 truncate font-heading text-sm font-semibold text-brand">
                {leader.role || "New person"}
                {leader.name ? <span className="font-normal text-muted-foreground"> — {leader.name}</span> : null}
              </span>
              <span className="flex shrink-0 items-center gap-0.5">
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Move up"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                >
                  <ArrowUp className="size-4" />
                </Button>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Move down"
                  disabled={index === rows.length - 1}
                  onClick={() => move(index, 1)}
                >
                  <ArrowDown className="size-4" />
                </Button>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  aria-label={`Remove ${leader.role || "this person"}`}
                  disabled={rows.length <= 1}
                  onClick={() => {
                    if (!window.confirm(`Remove ${leader.name || leader.role || "this person"} and their page?`)) return;
                    setRows((list) => list.filter((r) => r.key !== row.key));
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor={`l-role-${row.key}`}>Role</Label>
                <Input
                  id={`l-role-${row.key}`}
                  value={leader.role}
                  placeholder="e.g. Founder"
                  onChange={(e) => set(row.key, { role: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`l-name-${row.key}`}>Name</Label>
                <Input
                  id={`l-name-${row.key}`}
                  value={leader.name}
                  placeholder="e.g. Sri Bimal Krishna Ghosh"
                  onChange={(e) => set(row.key, { name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`l-title-${row.key}`}>Heading on the page</Label>
                <Input
                  id={`l-title-${row.key}`}
                  value={leader.pageTitle}
                  placeholder="e.g. Founder's Message"
                  onChange={(e) => set(row.key, { pageTitle: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`l-intro-${row.key}`}>Line under that heading</Label>
                <Input
                  id={`l-intro-${row.key}`}
                  value={leader.pageIntro}
                  placeholder="A few words from our founder."
                  onChange={(e) => set(row.key, { pageIntro: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`l-initials-${row.key}`}>Initials</Label>
                <Input
                  id={`l-initials-${row.key}`}
                  value={leader.initials}
                  maxLength={4}
                  placeholder="e.g. BG"
                  onChange={(e) => set(row.key, { initials: e.target.value.toUpperCase() })}
                />
                <p className="text-xs text-muted-foreground">Shown when there is no photograph.</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`l-slug-${row.key}`}>Web address</Label>
                <Input
                  id={`l-slug-${row.key}`}
                  value={leader.slug}
                  placeholder="founder"
                  onChange={(e) => set(row.key, { slug: leaderSlug(e.target.value) })}
                />
                <p className="text-xs text-muted-foreground">/leadership/{leader.slug || "…"} — changing it breaks old links.</p>
              </div>
            </div>

            <PhotoField leader={leader} onChange={(photoUrl) => set(row.key, { photoUrl })} />

            <div className="grid gap-2">
              <Label>Message</Label>
              <RichTextEditor
                name={`message-${leader.slug}`}
                defaultValue={leader.message}
                ariaLabel={`Message from the ${leader.role || "person"}`}
                placeholder="Write the message here…"
              />
            </div>
          </div>
        );
      })}

      <div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={rows.length >= MAX_LEADERS}
          onClick={() =>
            setRows((list) => [
              ...list,
              {
                key: nextKey++,
                value: {
                  slug: leaderSlug(`person-${list.length + 1}`),
                  name: "",
                  role: "",
                  pageTitle: "",
                  pageIntro: "",
                  initials: "",
                  photoUrl: "",
                  message: "",
                },
              },
            ])
          }
        >
          <Plus className="size-3.5" />
          Add a person
        </Button>
      </div>
    </div>
  );
}
