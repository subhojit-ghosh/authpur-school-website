import type { Metadata } from "next";
import Link from "next/link";
import { Download, History, Search, X } from "lucide-react";
import { EmptyState } from "@/components/admin/empty-state";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { AUDIT_SECTIONS, countAuditEntries, getAuditEntries, getAuditPeople } from "@/lib/audit";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Activity Log" };

const PER_PAGE = 50;

const actionStyles: Record<string, string> = {
  created: "bg-[oklch(0.92_0.05_150)] text-[oklch(0.35_0.1_150)]",
  updated: "bg-accent text-brand",
  deleted: "bg-destructive/10 text-destructive",
  uploaded: "bg-gold-soft text-gold-foreground",
  "re-ordered": "bg-secondary text-secondary-foreground",
  "signed in": "bg-muted text-muted-foreground",
  "signed out": "bg-muted text-muted-foreground",
};

function readable(key: string) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

function short(value: unknown) {
  if (value === null || value === undefined || value === "") return "(empty)";
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return text.length > 120 ? text.slice(0, 120) + "…" : text;
}

function Changes({ json }: { json: string }) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;
  const entries = Object.entries(parsed as Record<string, unknown>);
  if (!entries.length) return null;

  return (
    <details className="mt-1.5">
      <summary className="cursor-pointer text-xs font-medium text-brand hover:underline">What changed</summary>
      <ul className="mt-2 grid gap-1.5 rounded-lg bg-muted/60 p-3 text-xs">
        {entries.map(([key, value]) => {
          const pair = value as { from?: unknown; to?: unknown };
          const isDiff = pair && typeof pair === "object" && ("from" in pair || "to" in pair);
          return (
            <li key={key} className="grid gap-0.5">
              <span className="font-semibold text-foreground">{readable(key)}</span>
              {isDiff ? (
                <span className="text-muted-foreground">
                  <span className="line-through">{short(pair.from)}</span>
                  {" → "}
                  <span className="font-medium text-foreground">{short(pair.to)}</span>
                </span>
              ) : (
                <span className="text-muted-foreground">{short(value)}</span>
              )}
            </li>
          );
        })}
      </ul>
    </details>
  );
}

export default async function ActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; section?: string; person?: string; page?: string }>;
}) {
  const { q = "", section = "", person = "", page = "1" } = await searchParams;
  const current = Math.max(1, Number(page) || 1);
  const filter = { q, section, person };

  const [entries, total, people] = await Promise.all([
    getAuditEntries({ ...filter, limit: PER_PAGE, offset: (current - 1) * PER_PAGE }),
    countAuditEntries(filter),
    getAuditPeople(),
  ]);

  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (section) params.set("section", section);
  if (person) params.set("person", person);
  const pageHref = (n: number) => {
    const p = new URLSearchParams(params);
    if (n > 1) p.set("page", String(n));
    const s = p.toString();
    return s ? `/admin/activity?${s}` : "/admin/activity";
  };
  const exportHref = `/admin/activity/export${params.toString() ? `?${params}` : ""}`;
  const filtered = Boolean(q || section || person);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Activity Log"
        title="Who changed what"
        description={`Every change made in this panel is recorded here: who made it, what changed and when. ${total} entr${total === 1 ? "y" : "ies"}${filtered ? " match your filters" : ""}.`}
        actions={
          <Button asChild className="h-10 bg-brand font-semibold text-brand-foreground hover:bg-brand-muted">
            <a href={exportHref}>
              <Download className="size-4" />
              Export {filtered ? "results" : "all"} (CSV)
            </a>
          </Button>
        }
      />

      {/* Filters */}
      <form method="get" className="flex flex-wrap items-end gap-2">
        <div className="relative min-w-56 flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input name="q" defaultValue={q} placeholder="Search what happened, or a person's name…" className="pl-9" />
        </div>
        <NativeSelect name="section" defaultValue={section} className="w-48" aria-label="Filter by section">
          <option value="">All sections</option>
          {AUDIT_SECTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </NativeSelect>
        <NativeSelect name="person" defaultValue={person} className="w-44" aria-label="Filter by person">
          <option value="">Everyone</option>
          {people.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </NativeSelect>
        <Button type="submit" variant="outline" className="h-10">
          Apply
        </Button>
        {filtered ? (
          <Button asChild variant="ghost" className="h-10">
            <Link href="/admin/activity">
              <X className="size-4" />
              Clear
            </Link>
          </Button>
        ) : null}
      </form>

      {entries.length === 0 ? (
        <EmptyState
          icon={History}
          title={filtered ? "Nothing matches those filters" : "No activity yet"}
          description={filtered ? "Try a different section, person or search word." : "Changes made in the admin panel will be listed here."}
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border bg-card">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-muted/60 text-left text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                <tr>
                  <th className="w-48 px-4 py-3">When</th>
                  <th className="w-40 px-4 py-3">Who</th>
                  <th className="w-44 px-4 py-3">Section</th>
                  <th className="px-4 py-3">What happened</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {entries.map((e) => (
                  <tr key={e.id} className="align-top hover:bg-accent/30">
                    <td className="px-4 py-3 text-muted-foreground tabular-nums">{formatDateTime(e.at)}</td>
                    <td className="px-4 py-3 font-medium">{e.userName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{e.section}</td>
                    <td className="px-4 py-3">
                      <span className="flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            "inline-flex shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                            actionStyles[e.action] ?? "bg-secondary text-secondary-foreground",
                          )}
                        >
                          {e.action}
                        </span>
                        <span>{e.summary}</span>
                      </span>
                      {e.details ? <Changes json={e.details} /> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pages > 1 ? (
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                Page {current} of {pages}
              </p>
              <div className="flex gap-2">
                <Button asChild={current > 1} variant="outline" size="sm" disabled={current <= 1}>
                  {current > 1 ? <Link href={pageHref(current - 1)}>Newer</Link> : <span>Newer</span>}
                </Button>
                <Button asChild={current < pages} variant="outline" size="sm" disabled={current >= pages}>
                  {current < pages ? <Link href={pageHref(current + 1)}>Older</Link> : <span>Older</span>}
                </Button>
              </div>
            </div>
          ) : null}
        </>
      )}

      <p className="text-xs text-muted-foreground">
        Entries are kept permanently and cannot be edited or deleted from the panel, so the record stays trustworthy.
      </p>
    </div>
  );
}
