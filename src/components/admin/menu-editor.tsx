"use client";

import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, CornerDownRight, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MAX_MENU_CHILDREN,
  MAX_MENU_ITEMS,
  type MenuChild,
  type MenuItem,
} from "@/lib/page-content-types";

/**
 * Editor for the header menu.
 *
 * A menu is two levels deep, which a row-by-row editor cannot express, so the
 * whole menu is held in state here and posted as one JSON field. The server
 * checks it again before saving.
 *
 * An entry with no dropdown links is a plain link and uses its own address; add
 * one link underneath and it becomes a dropdown instead, at which point its own
 * address is no longer used.
 */

type Row = { id: number; value: MenuItem };

/**
 * Ids also name the inputs, so the saved menu is numbered from 1 on every
 * render; a counter kept at module level would carry on counting on the server
 * across requests and the ids would not match in the browser.
 */
const withIds = (items: MenuItem[]): Row[] => items.map((value, i) => ({ id: i + 1, value }));

const blankItem = (): MenuItem => ({ label: "", href: "/", children: [] });
const blankChild = (): MenuChild => ({ label: "", href: "/", desc: "" });

function move<T>(list: T[], index: number, direction: -1 | 1): T[] {
  const next = [...list];
  const target = index + direction;
  if (target < 0 || target >= next.length) return list;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function MoveButtons({
  index,
  count,
  onMove,
  onRemove,
  removeLabel,
}: {
  index: number;
  count: number;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
  removeLabel: string;
}) {
  return (
    <div className="flex items-center gap-0.5">
      <Button type="button" size="icon-sm" variant="ghost" onClick={() => onMove(-1)} disabled={index === 0} aria-label="Move up">
        <ArrowUp className="size-4" />
      </Button>
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        onClick={() => onMove(1)}
        disabled={index === count - 1}
        aria-label="Move down"
      >
        <ArrowDown className="size-4" />
      </Button>
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={onRemove}
        aria-label={removeLabel}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}

export function MenuEditor({ name, initial }: { name: string; initial: MenuItem[] }) {
  const [rows, setRows] = useState<Row[]>(() => withIds(initial));
  const nextId = useRef(initial.length + 1);

  const setItem = (id: number, patch: Partial<MenuItem>) =>
    setRows((list) => list.map((row) => (row.id === id ? { ...row, value: { ...row.value, ...patch } } : row)));

  const setChild = (id: number, index: number, patch: Partial<MenuChild>) =>
    setRows((list) =>
      list.map((row) =>
        row.id === id
          ? {
              ...row,
              value: {
                ...row.value,
                children: row.value.children.map((child, i) => (i === index ? { ...child, ...patch } : child)),
              },
            }
          : row,
      ),
    );

  const json = JSON.stringify(rows.map((row) => row.value));

  return (
    <div className="grid gap-4">
      <input type="hidden" name={name} value={json} />

      {rows.map((row, index) => {
        const item = row.value;
        const isDropdown = item.children.length > 0;

        return (
          <div key={row.id} className="rounded-2xl border bg-background/60 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="grid flex-1 gap-2">
                <Label htmlFor={`menu-label-${row.id}`}>Menu name</Label>
                <Input
                  id={`menu-label-${row.id}`}
                  value={item.label}
                  placeholder="e.g. Academics"
                  onChange={(e) => setItem(row.id, { label: e.target.value })}
                />
              </div>
              <div className="grid flex-1 gap-2">
                <Label htmlFor={`menu-href-${row.id}`}>
                  {isDropdown ? "Address (not used while it has a dropdown)" : "Address"}
                </Label>
                <Input
                  id={`menu-href-${row.id}`}
                  value={item.href}
                  placeholder="/notices"
                  disabled={isDropdown}
                  onChange={(e) => setItem(row.id, { href: e.target.value })}
                />
              </div>
              <MoveButtons
                index={index}
                count={rows.length}
                removeLabel="Remove menu"
                onMove={(direction) => setRows((list) => move(list, index, direction))}
                onRemove={() => setRows((list) => list.filter((r) => r.id !== row.id))}
              />
            </div>

            {isDropdown ? (
              <div className="mt-4 grid gap-3 border-l-2 border-gold/40 pl-4">
                {item.children.map((child, childIndex) => (
                  <div key={childIndex} className="grid gap-2 sm:grid-cols-[1fr_1fr_1.2fr_6.5rem] sm:items-end">
                    <div className="grid gap-1.5">
                      <span className="text-[11px] font-medium text-muted-foreground">Link name</span>
                      <Input
                        value={child.label}
                        placeholder="e.g. School Labs"
                        aria-label="Link name"
                        onChange={(e) => setChild(row.id, childIndex, { label: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <span className="text-[11px] font-medium text-muted-foreground">Address</span>
                      <Input
                        value={child.href}
                        placeholder="/labs"
                        aria-label="Address"
                        onChange={(e) => setChild(row.id, childIndex, { href: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <span className="text-[11px] font-medium text-muted-foreground">Small line underneath</span>
                      <Input
                        value={child.desc}
                        placeholder="Science & computer labs"
                        aria-label="Small line underneath"
                        onChange={(e) => setChild(row.id, childIndex, { desc: e.target.value })}
                      />
                    </div>
                    <MoveButtons
                      index={childIndex}
                      count={item.children.length}
                      removeLabel="Remove link"
                      onMove={(direction) =>
                        setItem(row.id, { children: move(item.children, childIndex, direction) })
                      }
                      onRemove={() =>
                        setItem(row.id, { children: item.children.filter((_, i) => i !== childIndex) })
                      }
                    />
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={item.children.length >= MAX_MENU_CHILDREN}
                onClick={() => setItem(row.id, { children: [...item.children, blankChild()] })}
              >
                <CornerDownRight className="size-3.5" />
                {isDropdown ? "Add another dropdown link" : "Turn into a dropdown"}
              </Button>
            </div>
          </div>
        );
      })}

      <div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={rows.length >= MAX_MENU_ITEMS}
          onClick={() => setRows((list) => [...list, { id: nextId.current++, value: blankItem() }])}
        >
          <Plus className="size-3.5" />
          Add menu item
        </Button>
      </div>
    </div>
  );
}
