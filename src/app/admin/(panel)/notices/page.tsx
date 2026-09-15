import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUp, Bell, ExternalLink, FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { EmptyState } from "@/components/admin/empty-state";
import { Flash } from "@/components/admin/flash";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { getNotices } from "@/lib/content";
import { noticeTagClass } from "@/lib/content-types";
import { formatDate } from "@/lib/format";
import { richTextToPlain } from "@/lib/rich-text";
import { deleteNotice, moveNotice } from "./actions";

export const metadata: Metadata = { title: "Notice Board" };

export default async function NoticesAdminPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [{ saved }, list] = await Promise.all([searchParams, getNotices()]);

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
        <div className="overflow-x-auto rounded-2xl border bg-card">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-muted/60 text-left text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              <tr>
                <th className="w-24 px-4 py-3">Order</th>
                <th className="px-4 py-3">Title</th>
                <th className="w-32 px-4 py-3">Category</th>
                <th className="w-36 px-4 py-3">Date</th>
                <th className="w-32 px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {list.map((n, i) => (
                <tr key={n.id} className="align-middle hover:bg-accent/30">
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
      )}
    </div>
  );
}
