import type { Metadata } from "next";
import Link from "next/link";
import { CheckCheck, Download, Inbox, Mail, MailOpen, Phone, Search, Trash2, X } from "lucide-react";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { EmptyState } from "@/components/admin/empty-state";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { countEnquiries, getEnquiries } from "@/lib/content";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { deleteEnquiry, markAllEnquiriesRead, markEnquiryRead } from "./actions";

export const metadata: Metadata = { title: "Enquiry Inbox" };

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const [list, total, unread] = await Promise.all([getEnquiries({ q }), countEnquiries(), countEnquiries(true)]);
  const exportHref = `/admin/enquiries/export${q ? `?q=${encodeURIComponent(q)}` : ""}`;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Enquiry Inbox"
        title="Admission enquiries"
        description={`${total} received in total${unread ? `, ${unread} new` : ""}. Every submission of the website's enquiry form lands here.`}
        actions={
          <>
            {unread > 0 ? (
              <form action={markAllEnquiriesRead}>
                <Button type="submit" variant="outline" className="h-10">
                  <CheckCheck className="size-4" />
                  Mark all as read
                </Button>
              </form>
            ) : null}
            <Button asChild className="h-10 bg-brand font-semibold text-brand-foreground hover:bg-brand-muted">
              <a href={exportHref}>
                <Download className="size-4" />
                Export {q ? "results" : "all"} (CSV)
              </a>
            </Button>
          </>
        }
      />

      {/* Search */}
      <form method="get" className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-64 flex-1 sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input name="q" defaultValue={q} placeholder="Search by name, phone, email, class or message…" className="pl-9" />
        </div>
        <Button type="submit" variant="outline" className="h-10">
          Search
        </Button>
        {q ? (
          <Button asChild variant="ghost" className="h-10">
            <Link href="/admin/enquiries">
              <X className="size-4" />
              Clear
            </Link>
          </Button>
        ) : null}
        {q ? (
          <p className="w-full text-xs text-muted-foreground sm:w-auto">
            {list.length} result{list.length === 1 ? "" : "s"} for “{q}”
          </p>
        ) : null}
      </form>

      {list.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={q ? "No enquiries match your search" : "No enquiries yet"}
          description={
            q
              ? "Try a shorter word or a different spelling."
              : "When a parent submits the Admission Enquiry form on the website, it will appear here."
          }
        />
      ) : (
        <ul className="grid gap-3">
          {list.map((e) => {
            const isNew = !e.readAt;
            return (
              <li
                key={e.id}
                className={cn(
                  "rounded-2xl border bg-card p-5 transition-colors",
                  isNew && "border-l-4 border-l-gold",
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading text-base font-semibold text-brand">{e.name}</h3>
                      {isNew ? (
                        <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-gold-foreground">
                          New
                        </span>
                      ) : null}
                      {e.grade ? (
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">{e.grade}</span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Received {formatDateTime(e.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <form action={markEnquiryRead}>
                      <input type="hidden" name="id" value={e.id} />
                      {!isNew ? <input type="hidden" name="unread" value="1" /> : null}
                      <Button type="submit" size="sm" variant="ghost" className="text-muted-foreground">
                        {isNew ? <MailOpen className="size-4" /> : <Mail className="size-4" />}
                        {isNew ? "Mark as read" : "Mark as new"}
                      </Button>
                    </form>
                    <form action={deleteEnquiry}>
                      <input type="hidden" name="id" value={e.id} />
                      <ConfirmButton
                        size="icon-sm"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Delete enquiry from ${e.name}`}
                        message={`Delete the enquiry from ${e.name}?\n\nThis cannot be undone.`}
                      >
                        <Trash2 className="size-4" />
                      </ConfirmButton>
                    </form>
                  </div>
                </div>

                <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 shrink-0 text-gold" />
                    <a href={`tel:${e.phone.replace(/\s/g, "")}`} className="font-medium hover:text-brand hover:underline">
                      {e.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 shrink-0 text-gold" />
                    {e.email ? (
                      <a href={`mailto:${e.email}`} className="font-medium hover:text-brand hover:underline">
                        {e.email}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">No email given</span>
                    )}
                  </div>
                </dl>
                {e.message ? (
                  <p className="mt-3 whitespace-pre-line rounded-xl bg-muted/60 px-4 py-3 text-sm leading-relaxed">{e.message}</p>
                ) : (
                  <p className="mt-3 text-sm italic text-muted-foreground">No message.</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
