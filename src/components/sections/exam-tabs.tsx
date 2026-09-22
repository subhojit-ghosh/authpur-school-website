"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Printer } from "lucide-react";
import { EXAM_COLUMNS, type ExamGroup, type ExamRow } from "@/lib/exam-pattern-types";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Each group takes a school colour in turn, in the order of the stripe. */
const groupColours = [
  { tab: "bg-vermilion text-white border-vermilion", rule: "border-vermilion", text: "text-vermilion" },
  { tab: "bg-gold text-gold-foreground border-gold", rule: "border-gold", text: "text-gold-ink" },
  { tab: "bg-leaf text-white border-leaf", rule: "border-leaf", text: "text-leaf" },
  { tab: "bg-sky text-white border-sky", rule: "border-sky", text: "text-sky" },
];

const lines = (text: string) => text.split("\n").map((l) => l.trim()).filter(Boolean);

const withPercent = (key: string, value: string) =>
  key === "passPercent" && value && !value.includes("%") ? `${value}%` : value;

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="whitespace-pre-line text-[17px] text-foreground">{value}</dd>
    </div>
  );
}

/**
 * On a phone the lined-up cells of a table cannot be seen side by side, so an
 * examination whose marks differ by class is shown class by class: each value
 * with as many lines as there are classes is split among them, and the rest
 * apply to all.
 */
function MobileDetails({ row, columns }: { row: ExamRow; columns: ReturnType<typeof columnsFor> }) {
  const classes = lines(row.classes);
  const fields = columns.filter((c) => c.key !== "classes" && row[c.key]);
  const perClass = classes.length > 1 ? fields.filter((c) => lines(row[c.key]).length === classes.length) : [];
  const shared = fields.filter((c) => !perClass.includes(c));

  return (
    <div className="mt-4 grid gap-4">
      {perClass.length ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {classes.map((cls, i) => (
            <div key={cls} className="rounded-md bg-card p-4">
              <p className="font-heading font-semibold text-brand">{cls}</p>
              <dl className="mt-2 grid gap-2">
                {perClass.map((c) => (
                  <Field key={c.key} label={c.label} value={withPercent(c.key, lines(row[c.key])[i])} />
                ))}
              </dl>
            </div>
          ))}
        </div>
      ) : null}
      {shared.length || (!perClass.length && row.classes) ? (
        <dl className="grid gap-3 sm:grid-cols-2">
          {!perClass.length && row.classes ? <Field label="Classes" value={row.classes} /> : null}
          {shared.map((c) => (
            <Field key={c.key} label={c.label} value={withPercent(c.key, row[c.key])} />
          ))}
        </dl>
      ) : null}
    </div>
  );
}

/** Only the columns that at least one examination in the group fills in. */
function columnsFor(rows: ExamRow[]) {
  return EXAM_COLUMNS.filter((c) => rows.some((r) => r[c.key]));
}

function GroupPanel({ group, index }: { group: ExamGroup; index: number }) {
  const colour = groupColours[index % groupColours.length];
  const columns = columnsFor(group.rows);
  const conditions = lines(group.conditions);
  const notes = lines(group.notes);

  return (
    <div>
      <div className={cn("border-l-4 pl-5", colour.rule)}>
        <h2 className="font-heading text-3xl font-semibold text-brand sm:text-4xl">{group.title}</h2>
        {group.subtitle ? <p className="mt-1 text-lg text-muted-foreground">{group.subtitle}</p> : null}
      </div>

      <div className={cn("mt-8 grid gap-10", conditions.length && "xl:grid-cols-[1fr_20rem]")}>
        <div className="min-w-0">
          {/* Wide screens and print: the table, as on the school's own sheet */}
          <div className="hidden overflow-x-auto lg:block print:block">
            <table className="w-full border-collapse text-left text-[15px]">
              <thead>
                <tr className="border-b-2 border-brand align-bottom text-sm text-muted-foreground">
                  <th scope="col" className="w-10 py-3 pr-3 font-semibold">
                    <span className="sr-only">Number</span>
                  </th>
                  <th scope="col" className="py-3 pr-5 font-semibold">
                    Examination
                  </th>
                  {columns.map((c) => (
                    <th key={c.key} scope="col" className="whitespace-nowrap py-3 pr-5 font-semibold">
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {group.rows.map((r, i) => (
                  <tr key={`${r.name}-${i}`} className="border-b border-brand/10 align-top">
                    <td className={cn("py-4 pr-3 font-heading text-lg font-bold", colour.text)}>{i + 1}</td>
                    <th scope="row" className="py-4 pr-5 font-heading text-base font-semibold text-brand">
                      {r.name}
                    </th>
                    {columns.map((c) => (
                      <td
                        key={c.key}
                        className={cn(
                          "whitespace-pre-line py-4 pr-5 text-foreground/85",
                          (c.key === "marks" || c.key === "passPercent" || c.key === "passMarks") &&
                            "font-semibold text-foreground tabular-nums",
                        )}
                      >
                        {withPercent(c.key, r[c.key]) || <span className="text-muted-foreground">–</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phones and tablets: one card per examination */}
          <ol className="grid gap-4 lg:hidden print:hidden">
            {group.rows.map((r, i) => (
              <li key={`${r.name}-${i}`} className="rounded-lg bg-mist p-5">
                <p className="flex items-baseline gap-3">
                  <span className={cn("font-heading text-2xl font-bold", colour.text)}>{i + 1}</span>
                  <span className="font-heading text-lg font-semibold leading-snug text-brand">{r.name}</span>
                </p>
                <MobileDetails row={r} columns={columns} />
              </li>
            ))}
          </ol>

          {notes.length ? (
            <ul className="mt-6 space-y-1.5 text-[15px] text-muted-foreground">
              {notes.map((n) => (
                <li key={n} className="flex gap-2">
                  <span aria-hidden>*</span>
                  {n}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {conditions.length ? (
          <aside className="h-fit overflow-hidden rounded-lg bg-brand text-brand-foreground">
            <div className="school-stripe h-1.5" />
            <div className="p-6">
              <h3 className="font-heading text-xl font-semibold text-white">For every examination</h3>
              <ol className="mt-4 space-y-3 text-[17px] leading-relaxed text-white/85">
                {conditions.map((c, i) => (
                  <li key={c} className="flex gap-3">
                    <span className="font-heading font-semibold text-gold">{i + 1}.</span>
                    {c}
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}

/**
 * One tab per group of classes. The chosen tab is kept in the page address
 * (#class-i-v) so a link can open the right group. Printing shows every group.
 */
export function ExamTabs({ groups }: { groups: ExamGroup[] }) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Open the group named in the address, and follow it if it changes.
  useEffect(() => {
    const fromHash = () => {
      const i = groups.findIndex((g) => `#${g.id}` === window.location.hash);
      if (i >= 0) setActive(i);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [groups]);

  const choose = (i: number, focus = false) => {
    setActive(i);
    window.history.replaceState(null, "", `#${groups[i].id}`);
    if (focus) tabRefs.current[i]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const last = groups.length - 1;
    const target =
      e.key === "ArrowRight" ? (i === last ? 0 : i + 1) : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1) : e.key === "Home" ? 0 : e.key === "End" ? last : -1;
    if (target < 0) return;
    e.preventDefault();
    choose(target, true);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div role="tablist" aria-label="Classes" className="flex flex-wrap gap-2">
          {groups.map((g, i) => (
            <button
              key={g.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              id={`tab-${g.id}`}
              role="tab"
              aria-selected={i === active}
              aria-controls={`panel-${g.id}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => choose(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "rounded-full border-2 px-5 py-2.5 font-heading text-base font-semibold transition-colors",
                i === active ? groupColours[i % groupColours.length].tab : "border-border bg-card text-brand hover:border-brand",
              )}
            >
              {g.title}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="text-link inline-flex items-center gap-2 text-[15px]"
        >
          <Printer className="size-4" />
          Print or save as PDF
        </button>
      </div>

      {groups.map((g, i) => (
        <div
          key={g.id}
          id={`panel-${g.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${g.id}`}
          tabIndex={0}
          // A class rather than the hidden attribute, so print can still show every group.
          className={cn("mt-10 outline-none print:mt-12 print:block", i !== active && "hidden")}
        >
          {i === active ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <GroupPanel group={g} index={i} />
            </motion.div>
          ) : (
            <GroupPanel group={g} index={i} />
          )}
        </div>
      ))}
    </div>
  );
}
