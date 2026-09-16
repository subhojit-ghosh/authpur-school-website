"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

export type RowsColumn = {
  key: string;
  label: string;
  placeholder?: string;
  className?: string;
  /** Renders a textarea instead of a single-line box. Required for any value that holds line breaks — a single-line input silently drops them. */
  multiline?: boolean;
  /** Renders the formatting editor (bold, lists, links). The column then holds HTML. */
  richText?: boolean;
};

/**
 * Editable list of rows for a form. Inputs are named `${name}[i][key]` so the
 * server action can rebuild the array with parseRows() from lib/form-rows.
 *
 * On a phone each row stacks into a labelled card; from the `sm` breakpoint up
 * it becomes a table-like grid with one header row.
 */
export function RowsEditor({
  name,
  columns,
  initial,
  addLabel = "Add row",
  min = 0,
}: {
  name: string;
  columns: RowsColumn[];
  initial: Record<string, string>[];
  addLabel?: string;
  min?: number;
}) {
  const blank = () => Object.fromEntries(columns.map((c) => [c.key, ""]));
  const [rows, setRows] = useState<{ id: number; values: Record<string, string> }[]>(() =>
    initial.map((values, i) => ({ id: i + 1, values: { ...values } })),
  );
  const [nextId, setNextId] = useState(initial.length + 1);

  const gridVars = { "--rows-cols": `repeat(${columns.length}, minmax(0, 1fr)) 6.5rem` } as React.CSSProperties;

  const update = (id: number, key: string, value: string) =>
    setRows((r) => r.map((row) => (row.id === id ? { ...row, values: { ...row.values, [key]: value } } : row)));
  const remove = (id: number) => setRows((r) => r.filter((row) => row.id !== id));
  const move = (index: number, dir: -1 | 1) =>
    setRows((r) => {
      const next = [...r];
      const j = index + dir;
      if (j < 0 || j >= next.length) return r;
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });
  const add = () => {
    setRows((r) => [...r, { id: nextId, values: blank() }]);
    setNextId((n) => n + 1);
  };

  return (
    <div className="grid gap-3 sm:gap-2">
      {/* Column headings — only where there is room for them */}
      <div
        className="hidden gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:grid sm:grid-cols-[var(--rows-cols)]"
        style={gridVars}
      >
        {columns.map((c) => (
          <span key={c.key}>{c.label}</span>
        ))}
        <span />
      </div>

      {rows.map((row, i) => (
        <div
          key={row.id}
          style={gridVars}
          className="grid gap-2 rounded-xl border bg-background/60 p-3 sm:grid-cols-[var(--rows-cols)] sm:items-start sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0"
        >
          {columns.map((c) => (
            <div key={c.key} className="grid gap-1">
              <span className="text-[11px] font-medium text-muted-foreground sm:hidden">{c.label}</span>
              {c.richText ? (
                <RichTextEditor
                  name={`${name}[${i}][${c.key}]`}
                  defaultValue={row.values[c.key] ?? ""}
                  placeholder={c.placeholder}
                  ariaLabel={c.label}
                />
              ) : c.multiline ? (
                <Textarea
                  name={`${name}[${i}][${c.key}]`}
                  value={row.values[c.key] ?? ""}
                  placeholder={c.placeholder}
                  onChange={(e) => update(row.id, c.key, e.target.value)}
                  className={c.className}
                  rows={3}
                  aria-label={c.label}
                />
              ) : (
                <Input
                  name={`${name}[${i}][${c.key}]`}
                  value={row.values[c.key] ?? ""}
                  placeholder={c.placeholder}
                  onChange={(e) => update(row.id, c.key, e.target.value)}
                  className={c.className}
                  aria-label={c.label}
                />
              )}
            </div>
          ))}

          <div className="flex items-center justify-end gap-0.5">
            <Button type="button" size="icon-sm" variant="ghost" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
              <ArrowUp className="size-4" />
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={() => move(i, 1)}
              disabled={i === rows.length - 1}
              aria-label="Move down"
            >
              <ArrowDown className="size-4" />
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => remove(row.id)}
              disabled={rows.length <= min}
              aria-label="Remove row"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      ))}

      <div>
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="size-3.5" />
          {addLabel}
        </Button>
      </div>
    </div>
  );
}
