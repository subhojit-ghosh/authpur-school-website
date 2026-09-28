import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUp, Bell, Eye, EyeOff, ExternalLink, FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { EmptyState } from "@/components/admin/empty-state";
import { Flash } from "@/components/admin/flash";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { getNotices } from "@/lib/content";
import { noticeTagClass } from "@/lib/content-types";
import { formatDate } from "@/lib/format";
import { richTextToPlain } from "@/lib/rich-text";
import { cn } from "@/lib/utils";
import { deleteNotice, moveNotice, toggleNoticeActive } from "./actions";

export const metadata: Metadata = { title: "Notice Board" };

export default async function NoticesAdminPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [{ saved }, list] = await Promise.all([searchParams, getNotices({ includeInactive: true })]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Notice Board"
        title="Notices"
        description="Notices appear on the home page, in the Latest Updates ticker and on the Notices page, in the order shown here."
        actions={
          <>
            <Button asChild variant="outline" className="h-10">
              <Link href="/notices" target="_blank">
                <ExternalLink className="size-4" />
                View on website
              </Link>
            </Button>
            <Button asChild className="h-10 bg-brand font-semibold text-brand-foreground hover:bg-brand-muted">
              <Link href="/admin/notices/new">
                <Plus className="size-4" />
                Add notice
              </Link>
            </Button>
          </>
        }
      />

      <Flash kind={saved} />

      {list.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notices yet"
          description="Add your first notice and it will appear on the website immediately."
          action={
            <Button asChild className="bg-brand text-brand-foreground hover:bg-brand-muted">
              <Link href="/admin/notices/new">
                <Plus className="size-4" />
                Add notice
              </Link>
            </Button>
          }
        />
      ) : (
        <>
        {/*
          A table squeezed into a phone becomes a column of single words, so
          below md the same notices are shown as cards instead. Both lists run
          the same actions.
        */}
        <ul className="grid gap-3 md:hidden">
          {list.map((n, i) => (
            <li key={n.id} className={cn("rounded-2xl border bg-card p-4", !n.active && "text-muted-foreground")}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${noticeTagClass(n.tag)}`}>
                    {n.tag}
                  </span>
                  <p className="mt-2 font-medium text-foreground">{n.title}</p>
                  {n.description ? (
                    <span className="mt-1 flex items-start gap-1 text-xs text-muted-foreground">
                      <FileText className="mt-0.5 size-3 shrink-0" />
                      {richTextToPlain(n.description, 90)}
                    </span>
                  ) : null}
                  <p className="mt-1.5 text-xs text-muted-foreground">{formatDate(n.date, "long")}</p>
                </div>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">#{i + 1}</span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t pt-3">
                <form action={toggleNoticeActive}>
                  <input type="hidden" name="id" value={n.id} />
                  <button
                    type="submit"
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
                      n.active
                        ? "bg-[oklch(0.92_0.05_150)] text-[oklch(0.35_0.1_150)]"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {n.active ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                    {n.active ? "Active" : "Inactive"}
                  </button>
                </form>

                <span className="ml-auto flex items-center gap-0.5">
                  <form action={moveNotice}>
                    <input type="hidden" name="id" value={n.id} />
                    <input type="hidden" name="direction" value="up" />
                    <Button type="submit" size="icon-sm" variant="ghost" disabled={i === 0} aria-label={`Move "${n.title}" up`}>
                      <ArrowUp className="size-4" />
                    </Button>
                  </form>
                  <form action={moveNotice}>
                    <input type="hidden" name="id" value={n.id} />
                    <input type="hidden" name="direction" value="down" />
                    <Button
                      type="submit"
                      size="icon-sm"
                      variant="ghost"
                      disabled={i === list.length - 1}
                      aria-label={`Move "${n.title}" down`}
                    >
                      <ArrowDown className="size-4" />
                    </Button>
                  </form>
                  <Button asChild size="icon-sm" variant="ghost" aria-label={`Edit "${n.title}"`}>
                    <Link href={`/admin/notices/${n.id}`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <form action={deleteNotice}>
                    <input type="hidden" name="id" value={n.id} />
                    <ConfirmButton
                      size="icon-sm"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      aria-label={`Delete "${n.title}"`}
                      message={`Delete the notice "${n.title}"?\n\nIt will be removed from the website immediately.`}
                    >
                      <Trash2 className="size-4" />
                    </ConfirmButton>
                  </form>
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div className="hidden overflow-x-auto rounded-2xl border bg-card md:block">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-muted/60 text-left text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              <tr>
                <th className="w-24 px-4 py-3">Order</th>
                <th className="px-4 py-3">Title</th>
                <th className="w-32 px-4 py-3">Category</th>
                <th className="w-36 px-4 py-3">Date</th>
                <th className="w-32 px-4 py-3">Status</th>
                <th className="w-32 px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {list.map((n, i) => (
                <tr key={n.id} className={cn("align-middle hover:bg-accent/30", !n.active && "text-muted-foreground")}>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1">
                      <form action={moveNotice}>
                        <input type="hidden" name="id" value={n.id} />
                        <input type="hidden" name="direction" value="up" />
                        <Button type="submit" size="icon-sm" variant="ghost" disabled={i === 0} aria-label={`Move "${n.title}" up`}>
                          <ArrowUp className="size-4" />
                        </Button>
                      </form>
                      <form action={moveNotice}>
                        <input type="hidden" name="id" value={n.id} />
                        <input type="hidden" name="direction" value="down" />
                        <Button
                          type="submit"
                          size="icon-sm"
                          variant="ghost"
                          disabled={i === list.length - 1}
                          aria-label={`Move "${n.title}" down`}
                        >
                          <ArrowDown className="size-4" />
                        </Button>
                      </form>
                      <span className="ml-1 w-5 text-xs tabular-nums text-muted-foreground">{i + 1}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 font-medium">
                    {n.title}
                    {n.description ? (
                      <span className="mt-0.5 flex items-center gap-1 text-xs font-normal text-muted-foreground">
                        <FileText className="size-3" />
                        {richTextToPlain(n.description, 70)}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${noticeTagClass(n.tag)}`}>{n.tag}</span>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{formatDate(n.date)}</td>
                  <td className="px-4 py-2.5">
                    <form action={toggleNoticeActive}>
                      <input type="hidden" name="id" value={n.id} />
                      <button
                        type="submit"
                        title={n.active ? "Hide from the website" : "Show on the website"}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
                          n.active
                            ? "bg-[oklch(0.92_0.05_150)] text-[oklch(0.35_0.1_150)] hover:bg-[oklch(0.88_0.06_150)]"
                            : "bg-muted text-muted-foreground hover:bg-secondary",
                        )}
                      >
                        {n.active ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                        {n.active ? "Active" : "Inactive"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild size="icon-sm" variant="ghost" aria-label={`Edit "${n.title}"`}>
                        <Link href={`/admin/notices/${n.id}`}>
                          <Pencil className="size-4" />
                        </Link>
                      </Button>
                      <form action={deleteNotice}>
                        <input type="hidden" name="id" value={n.id} />
                        <ConfirmButton
                          size="icon-sm"
                          variant="ghost"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          aria-label={`Delete "${n.title}"`}
                          message={`Delete the notice "${n.title}"?\n\nIt will be removed from the website immediately.`}
                        >
                          <Trash2 className="size-4" />
                        </ConfirmButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  );
}
