import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, ExternalLink, FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { EmptyState } from "@/components/admin/empty-state";
import { Flash } from "@/components/admin/flash";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/lib/content";
import { formatDate, todayISO } from "@/lib/format";
import { richTextToPlain } from "@/lib/rich-text";
import { cn } from "@/lib/utils";
import { deleteEvent } from "./actions";

export const metadata: Metadata = { title: "Events" };

export default async function EventsAdminPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [{ saved }, list] = await Promise.all([searchParams, getAllEvents()]);
  const today = todayISO();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Events"
        title="Upcoming Events"
        description="Events dated today or later are shown on the home page and the Notices page, soonest first."
        actions={
          <>
            <Button asChild variant="outline" className="h-10">
              <Link href="/notices" target="_blank">
                <ExternalLink className="size-4" />
                View on website
              </Link>
            </Button>
            <Button asChild className="h-10 bg-brand font-semibold text-brand-foreground hover:bg-brand-muted">
              <Link href="/admin/events/new">
                <Plus className="size-4" />
                Add event
              </Link>
            </Button>
          </>
        }
      />

      <Flash kind={saved} />

      {list.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No events yet"
          description="Add an upcoming event and it will appear on the website immediately."
          action={
            <Button asChild className="bg-brand text-brand-foreground hover:bg-brand-muted">
              <Link href="/admin/events/new">
                <Plus className="size-4" />
                Add event
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border bg-card">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-muted/60 text-left text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              <tr>
                <th className="w-40 px-4 py-3">Date</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Venue</th>
                <th className="w-28 px-4 py-3">Status</th>
                <th className="w-28 px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {list.map((e) => {
                const past = e.date < today;
                return (
                  <tr key={e.id} className={cn("align-middle hover:bg-accent/30", past && "text-muted-foreground")}>
                    <td className="px-4 py-2.5 tabular-nums">{formatDate(e.date)}</td>
                    <td className={cn("px-4 py-2.5 font-medium", !past && "text-foreground")}>
                      {e.title}
                      {e.description ? (
                        <span className="mt-0.5 flex items-center gap-1 text-xs font-normal text-muted-foreground">
                          <FileText className="size-3" />
                          {richTextToPlain(e.description, 70)}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-2.5">{e.venue}</td>
                    <td className="px-4 py-2.5">
                      {past ? (
                        <span className="inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">Past</span>
                      ) : (
                        <span className="inline-flex rounded-full bg-[oklch(0.92_0.05_150)] px-2.5 py-0.5 text-xs font-semibold text-[oklch(0.35_0.1_150)]">
                          On website
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-end gap-1">
                        <Button asChild size="icon-sm" variant="ghost" aria-label={`Edit "${e.title}"`}>
                          <Link href={`/admin/events/${e.id}`}>
                            <Pencil className="size-4" />
                          </Link>
                        </Button>
                        <form action={deleteEvent}>
                          <input type="hidden" name="id" value={e.id} />
                          <ConfirmButton
                            size="icon-sm"
                            variant="ghost"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            aria-label={`Delete "${e.title}"`}
                            message={`Delete the event "${e.title}"?\n\nIt will be removed from the website immediately.`}
                          >
                            <Trash2 className="size-4" />
                          </ConfirmButton>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
