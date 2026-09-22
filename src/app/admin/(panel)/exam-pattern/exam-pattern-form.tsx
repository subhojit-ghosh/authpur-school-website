"use client";

import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Plus, Save, Trash2 } from "lucide-react";
import { FormError } from "@/components/admin/form-message";
import { Flash } from "@/components/admin/flash";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  blankExamRow,
  MAX_EXAM_GROUPS,
  MAX_EXAM_ROWS,
  type ExamGroup,
  type ExamPattern,
  type ExamRow,
} from "@/lib/exam-pattern-types";
import { cn } from "@/lib/utils";
import { saveExamPattern, type SaveState } from "./actions";

/**
 * Editor for the examination pattern.
 *
 * Each class group holds a list of examinations, which a row-by-row editor
 * cannot express, so the groups are held in state and posted as one JSON
 * field; the server checks everything again before saving. One group is shown
 * at a time, chosen from the tabs along the top.
 */

type Keyed<T> = { key: number; value: T };
type GroupState = Omit<ExamGroup, "rows"> & { rows: Keyed<ExamRow>[] };

/**
 * Keys also name the form fields' ids, so the saved content is numbered from
 * 1 on every render: a counter kept at module level would carry on counting on
 * the server across requests and the ids would not match in the browser.
 * Anything added later counts on from where the saved content stopped.
 */
function toState(groups: ExamGroup[]): { groups: Keyed<GroupState>[]; next: number } {
  let n = 1;
  const keyed = <T,>(value: T): Keyed<T> => ({ key: n++, value });
  return { groups: groups.map((g) => keyed({ ...g, rows: g.rows.map(keyed) })), next: n };
}

function move<T>(list: T[], index: number, direction: -1 | 1): T[] {
  const next = [...list];
  const target = index + direction;
  if (target < 0 || target >= next.length) return list;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

/** The fields of one examination, in the order of the table's columns. */
const rowFields: { key: keyof ExamRow; label: string; placeholder: string; lines?: boolean; hint?: string }[] = [
  { key: "classes", label: "Classes", placeholder: "L.Nur\nNur, Prep", lines: true, hint: "Only if the marks differ by class: one class per line, lined up with the lines of the other boxes." },
  { key: "marks", label: "Marks", placeholder: "Total 100 (W-80, P-20)", lines: true },
  { key: "syllabus", label: "Syllabus", placeholder: "Syllabus covered till 14th August 2026", lines: true },
  { key: "when", label: "When", placeholder: "In the month of September 2026", lines: true },
  { key: "project", label: "Project / oral", placeholder: "Project: 20 marks", lines: true },
  { key: "passPercent", label: "Pass %", placeholder: "40" },
  { key: "passMarks", label: "Pass marks", placeholder: "50\n40", lines: true },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="h-10 bg-brand px-5 font-semibold text-brand-foreground hover:bg-brand-muted">
      <Save className="size-4" />
      {pending ? "Saving…" : "Save & publish"}
    </Button>
  );
}

function Card({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-card p-5 sm:p-6">
      <h3 className="font-heading text-base font-semibold text-brand">{title}</h3>
      {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
      <div className="mt-4 grid gap-4">{children}</div>
    </section>
  );
}

export function ExamPatternForm({ initial }: { initial: ExamPattern }) {
  const [state, action] = useActionState<SaveState, FormData>(saveExamPattern, {});
  const [start] = useState(() => toState(initial.groups));
  const [groups, setGroups] = useState(start.groups);
  const [active, setActive] = useState(0);
  const nextKey = useRef(start.next);
  const keyed = <T,>(value: T): Keyed<T> => ({ key: nextKey.current++, value });
  const blankGroup = (): GroupState => ({
    id: "",
    title: "",
    subtitle: "",
    rows: [keyed(blankExamRow())],
    conditions: "",
    notes: "",
  });
  const current = groups[Math.min(active, groups.length - 1)];

  const setGroup = (key: number, patch: Partial<GroupState>) =>
    setGroups((list) => list.map((g) => (g.key === key ? { ...g, value: { ...g.value, ...patch } } : g)));
  const setRow = (groupKey: number, rowKey: number, patch: Partial<ExamRow>) =>
    setGroups((list) =>
      list.map((g) =>
        g.key === groupKey
          ? {
              ...g,
              value: {
                ...g.value,
                rows: g.value.rows.map((r) => (r.key === rowKey ? { ...r, value: { ...r.value, ...patch } } : r)),
              },
            }
          : g,
      ),
    );

  const json = JSON.stringify(groups.map((g) => ({ ...g.value, rows: g.value.rows.map((r) => r.value) })));

  return (
    <form action={action} className="grid gap-6">
      <input type="hidden" name="groups" value={json} />

      <Card title="Session and introduction" description="Shown above the tables on the Examination Pattern page.">
        <div className="grid gap-2 sm:max-w-xs">
          <Label htmlFor="session">Session</Label>
          <Input id="session" name="session" defaultValue={initial.session} placeholder="e.g. 2026–27" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="intro">Introduction</Label>
          <RichTextEditor name="intro" defaultValue={initial.intro} ariaLabel="Introduction" placeholder="How the school assesses students through the session…" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="key">What the short forms mean</Label>
          <Textarea id="key" name="key" defaultValue={initial.key} rows={4} placeholder={"W: Written\nO: Oral"} />
          <p className="text-xs text-muted-foreground">One per line, as the short form, a colon, then its meaning.</p>
        </div>
      </Card>

      <Card
        title="Class groups"
        description="Each group has its own tab on the website. A column appears there only if at least one examination in the group fills it in."
      >
        {/* Group tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {groups.map((g, i) => (
            <button
              key={g.key}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              className={cn(
                "rounded-lg border px-3.5 py-2 text-sm font-semibold transition-colors",
                i === active ? "border-brand bg-brand text-brand-foreground" : "bg-background text-brand hover:border-brand",
              )}
            >
              {g.value.title || "Untitled group"}
            </button>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={groups.length >= MAX_EXAM_GROUPS}
            onClick={() => {
              setGroups((list) => [...list, keyed(blankGroup())]);
              setActive(groups.length);
            }}
          >
            <Plus className="size-3.5" />
            Add class group
          </Button>
        </div>

        {current ? (
          <div className="grid gap-5 rounded-xl border bg-background/60 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="grid flex-1 gap-2">
                <Label htmlFor={`g-title-${current.key}`}>Group title</Label>
                <Input
                  id={`g-title-${current.key}`}
                  value={current.value.title}
                  placeholder="e.g. Class I – V"
                  onChange={(e) => setGroup(current.key, { title: e.target.value })}
                />
              </div>
              <div className="grid flex-1 gap-2">
                <Label htmlFor={`g-sub-${current.key}`}>Line under the title (optional)</Label>
                <Input
                  id={`g-sub-${current.key}`}
                  value={current.value.subtitle}
                  placeholder="e.g. Science, Commerce & Arts"
                  onChange={(e) => setGroup(current.key, { subtitle: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-0.5">
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Move group left"
                  disabled={active === 0}
                  onClick={() => {
                    setGroups((list) => move(list, active, -1));
                    setActive(active - 1);
                  }}
                >
                  <ArrowLeft className="size-4" />
                </Button>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Move group right"
                  disabled={active === groups.length - 1}
                  onClick={() => {
                    setGroups((list) => move(list, active, 1));
                    setActive(active + 1);
                  }}
                >
                  <ArrowRight className="size-4" />
                </Button>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Remove this class group"
                  disabled={groups.length <= 1}
                  onClick={() => {
                    if (!window.confirm(`Remove “${current.value.title || "this group"}” and all its examinations?`)) return;
                    setGroups((list) => list.filter((g) => g.key !== current.key));
                    setActive(Math.max(0, active - 1));
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>

            {/* Examinations */}
            <div className="grid gap-4">
              {current.value.rows.map((r, i) => (
                <div key={r.key} className="rounded-xl border bg-card p-4">
                  <div className="flex items-end gap-3">
                    <div className="grid flex-1 gap-2">
                      <Label htmlFor={`r-name-${r.key}`}>
                        Examination {i + 1}
                      </Label>
                      <Input
                        id={`r-name-${r.key}`}
                        value={r.value.name}
                        placeholder="e.g. Half Yearly Examination"
                        onChange={(e) => setRow(current.key, r.key, { name: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center gap-0.5">
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        aria-label="Move examination up"
                        disabled={i === 0}
                        onClick={() => setGroup(current.key, { rows: move(current.value.rows, i, -1) })}
                      >
                        <ArrowUp className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        aria-label="Move examination down"
                        disabled={i === current.value.rows.length - 1}
                        onClick={() => setGroup(current.key, { rows: move(current.value.rows, i, 1) })}
                      >
                        <ArrowDown className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Remove examination"
                        onClick={() => setGroup(current.key, { rows: current.value.rows.filter((x) => x.key !== r.key) })}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {rowFields.map((f) => (
                      <div key={f.key} className={cn("grid content-start gap-1.5", f.key === "classes" && "sm:col-span-2 lg:col-span-3")}>
                        <span className="text-xs font-medium text-muted-foreground">{f.label}</span>
                        {f.lines ? (
                          <Textarea
                            value={r.value[f.key]}
                            placeholder={f.placeholder}
                            rows={2}
                            aria-label={`${f.label}, examination ${i + 1}`}
                            onChange={(e) => setRow(current.key, r.key, { [f.key]: e.target.value })}
                          />
                        ) : (
                          <Input
                            value={r.value[f.key]}
                            placeholder={f.placeholder}
                            aria-label={`${f.label}, examination ${i + 1}`}
                            onChange={(e) => setRow(current.key, r.key, { [f.key]: e.target.value })}
                          />
                        )}
                        {f.hint ? <span className="text-[11px] text-muted-foreground">{f.hint}</span> : null}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={current.value.rows.length >= MAX_EXAM_ROWS}
                  onClick={() => setGroup(current.key, { rows: [...current.value.rows, keyed(blankExamRow())] })}
                >
                  <Plus className="size-3.5" />
                  Add examination
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid content-start gap-2">
                <Label htmlFor={`g-cond-${current.key}`}>Conditions for every examination (optional)</Label>
                <Textarea
                  id={`g-cond-${current.key}`}
                  value={current.value.conditions}
                  rows={4}
                  placeholder="75% attendance is a must."
                  onChange={(e) => setGroup(current.key, { conditions: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">One per line. Shown in a box beside the table.</p>
              </div>
              <div className="grid content-start gap-2">
                <Label htmlFor={`g-notes-${current.key}`}>Notes under the table (optional)</Label>
                <Textarea
                  id={`g-notes-${current.key}`}
                  value={current.value.notes}
                  rows={4}
                  placeholder="All dates are tentative and subject to change."
                  onChange={(e) => setGroup(current.key, { notes: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">One per line.</p>
              </div>
            </div>
          </div>
        ) : null}
      </Card>

      <FormError message={state.error} />
      {state.success ? <Flash text={state.success} /> : null}

      <div>
        <SubmitButton />
      </div>
    </form>
  );
}
