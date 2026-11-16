"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowDown, ArrowUp, FolderTree, Plus, Save, Trash2 } from "lucide-react";
import { FormError } from "@/components/admin/form-message";
import { SavedNote } from "@/components/admin/pending";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MAX_CATEGORY_NAME, MAX_GALLERY_CATEGORIES } from "@/lib/settings-types";
import { saveGalleryCategories, type CategoriesState } from "./actions";

/**
 * Editor for the gallery's own sections.
 *
 * Each row remembers the name it was loaded with. A photograph is filed under
 * the name of its section and nothing more, so the server needs both names to
 * carry the photographs across when the office renames one.
 *
 * Row keys also name the inputs, so saved rows are numbered from 1 on every
 * render: a counter kept at module level would go on counting on the server
 * from one request to the next and the ids would not match in the browser.
 */

type Row = { key: number; was: string | null; name: string };

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-10 bg-brand px-5 font-semibold text-brand-foreground hover:bg-brand-muted"
    >
      <Save className="size-4" />
      {pending ? "Saving…" : "Save sections"}
    </Button>
  );
}

export function CategoriesEditor({ initial }: { initial: string[] }) {
  const [state, action] = useActionState<CategoriesState, FormData>(saveGalleryCategories, {});
  const [rows, setRows] = useState<Row[]>(() =>
    initial.map((name, index) => ({ key: index + 1, was: name, name })),
  );
  // Once a rename is saved, those photographs carry the new name. The rows have
  // to forget the names they were loaded with, or a second rename would be
  // measured from a name nothing is filed under any more. React's own way of
  // taking in a new value: adjust while rendering, not in an effect afterwards.
  const [syncedWith, setSyncedWith] = useState<string[] | undefined>(undefined);
  if (state.items && state.items !== syncedWith) {
    setSyncedWith(state.items);
    setRows(state.items.map((name, index) => ({ key: index + 1, was: name, name })));
  }

  const move = (index: number, direction: -1 | 1) =>
    setRows((list) => {
      const next = [...list];
      const target = index + direction;
      if (target < 0 || target >= next.length) return list;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const json = JSON.stringify(rows.map((row) => ({ was: row.was, name: row.name })));

  return (
    <details className="group rounded-2xl border bg-card">
      <summary className="flex cursor-pointer list-none items-center gap-3 p-4 sm:p-5">
        <FolderTree className="size-5 shrink-0 text-brand" />
        <span className="min-w-0 flex-1">
          <span className="block font-heading text-base font-semibold text-brand">Sections</span>
          <span className="block text-xs text-muted-foreground">
            {rows.length} section{rows.length === 1 ? "" : "s"} — {initial.join(", ")}
          </span>
        </span>
        <span className="shrink-0 text-sm font-medium text-brand/70 group-open:hidden">Manage</span>
        <span className="hidden shrink-0 text-sm font-medium text-brand/70 group-open:inline">Close</span>
      </summary>

      <form action={action} className="grid gap-4 border-t p-4 sm:p-5">
        <input type="hidden" name="categories" value={json} />

        <p className="text-xs text-muted-foreground">
          Add a section, rename one, or change the order visitors see. Renaming a section moves its
          photographs with it. A section still holding photographs cannot be removed — move those
          photographs to another section first.
        </p>

        <ul className="grid gap-2">
          {rows.map((row, index) => (
            <li key={row.key} className="flex items-center gap-2">
              <Input
                id={`category-${row.key}`}
                value={row.name}
                maxLength={MAX_CATEGORY_NAME}
                placeholder="e.g. Laboratories"
                aria-label={`Section ${index + 1}`}
                className="h-10"
                onChange={(e) =>
                  setRows((list) =>
                    list.map((r) => (r.key === row.key ? { ...r, name: e.target.value } : r)),
                  )
                }
              />
              <span className="flex shrink-0 items-center gap-0.5">
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  aria-label={`Move ${row.name || "this section"} up`}
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                >
                  <ArrowUp className="size-4" />
                </Button>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  aria-label={`Move ${row.name || "this section"} down`}
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
                  aria-label={`Remove ${row.name || "this section"}`}
                  disabled={rows.length <= 1}
                  onClick={() => {
                    // A section that is only on screen has no photographs yet,
                    // so only one already saved is worth asking about.
                    if (row.was && !window.confirm(`Remove the “${row.was}” section?`)) return;
                    setRows((list) => list.filter((r) => r.key !== row.key));
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={rows.length >= MAX_GALLERY_CATEGORIES}
            onClick={() =>
              setRows((list) => [...list, { key: Math.max(0, ...list.map((r) => r.key)) + 1, was: null, name: "" }])
            }
          >
            <Plus className="size-3.5" />
            Add a section
          </Button>
          <SaveButton />
          <SavedNote trigger={state.success ? state : null} className="text-sm" />
        </div>

        <FormError message={state.error} />
      </form>
    </details>
  );
}
