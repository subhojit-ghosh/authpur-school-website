import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bell, Inbox, Sparkles } from "lucide-react";
import { AdminIcon } from "@/components/admin/admin-icon";
import { AdminPageHeader } from "@/components/admin/page-header";
import { adminNav, isLive } from "@/lib/admin-nav";
import { requireUser } from "@/lib/auth";
import { countEnquiries, countNotices, countUpcomingEvents, getEnquiries, getNotices } from "@/lib/content";
import { noticeTagClass } from "@/lib/content-types";
import { formatDate, formatDateTime } from "@/lib/format";
import { countBanners, countGalleryPhotos } from "@/lib/media";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

function greeting() {
  const hour = Number(new Date().toLocaleString("en-IN", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" }));
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function SampleBadge({ phase }: { phase: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
      <Sparkles className="size-3" />
      Sample · live in Phase {phase}
    </span>
  );
}

export default async function AdminDashboardPage() {
  const user = await requireUser();
  const [noticeCount, eventCount, unreadCount, recentNotices, recentEnquiries, bannerCount, photoCount] = await Promise.all([
    countNotices(),
    countUpcomingEvents(),
    countEnquiries(true),
    getNotices({ limit: 5, includeInactive: true }),
    getEnquiries({ limit: 5 }),
    countBanners(),
    countGalleryPhotos(),
  ]);
  const quickLinks = adminNav.filter((i) => i.href !== "/admin");

  const stats = [
    { label: "Notices", value: noticeCount, hint: "on the notice board", href: "/admin/notices" },
    { label: "Upcoming events", value: eventCount, hint: "shown on the website", href: "/admin/events" },
    { label: "New enquiries", value: unreadCount, hint: unreadCount ? "waiting to be read" : "all caught up", href: "/admin/enquiries" },
    { label: "Banner images", value: bannerCount, hint: `+ ${photoCount} gallery photo${photoCount === 1 ? "" : "s"}`, href: "/admin/banners" },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Dashboard"
        title={`${greeting()}, ${user.displayName}`}
        description="Here is what is happening on the school website. Use the quick links to manage each section."
      />

      {/* Stats */}
      <section aria-label="Overview" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{s.label}</p>
            <p className="mt-2 font-heading text-3xl font-semibold text-brand">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>
          </Link>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Recent notices */}
        <section className="flex flex-col rounded-2xl border bg-card">
          <header className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-4">
            <h3 className="flex items-center gap-2 font-heading text-base font-semibold text-brand">
              <Bell className="size-4 text-gold" />
              Recent notices
            </h3>
          </header>
          {recentNotices.length ? (
            <ul className="flex-1 divide-y">
              {recentNotices.map((n) => (
                <li key={n.id} className="flex items-start gap-3 px-5 py-3.5">
                  <span className={cn("mt-0.5 inline-flex shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold", noticeTagClass(n.tag))}>
                    {n.tag}
                  </span>
                  <Link href={`/admin/notices/${n.id}`} className="min-w-0 flex-1 text-sm hover:text-brand hover:underline">
                    {n.title}
                  </Link>
                  <span className="shrink-0 text-xs text-muted-foreground">{formatDate(n.date)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center px-5 py-10 text-center">
              <p className="text-sm font-medium">No notices yet</p>
              <p className="mt-1 text-xs text-muted-foreground">Add one from the Notice Board section.</p>
            </div>
          )}
          <footer className="border-t px-5 py-3">
            <Link href="/admin/notices" className="inline-flex items-center gap-1 text-sm font-medium text-brand transition-colors hover:text-gold-foreground">
              Manage notices
              <ArrowRight className="size-3.5" />
            </Link>
          </footer>
        </section>

        {/* Recent enquiries */}
        <section className="flex flex-col rounded-2xl border bg-card">
          <header className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-4">
            <h3 className="flex items-center gap-2 font-heading text-base font-semibold text-brand">
              <Inbox className="size-4 text-gold" />
              Recent enquiries
            </h3>
            {unreadCount ? (
              <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-gold-foreground">
                {unreadCount} new
              </span>
            ) : null}
          </header>
          {recentEnquiries.length ? (
            <ul className="flex-1 divide-y">
              {recentEnquiries.map((e) => (
                <li key={e.id} className="flex items-start gap-3 px-5 py-3.5">
                  <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", e.readAt ? "bg-border" : "bg-gold")} aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{e.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {e.phone}
                      {e.grade ? ` · ${e.grade}` : ""}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">{formatDateTime(e.createdAt)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center px-5 py-10 text-center">
              <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
                <Inbox className="size-5" />
              </span>
              <p className="mt-3 text-sm font-medium">No enquiries yet</p>
              <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                Every submission of the website&apos;s Admission Enquiry form will appear here.
              </p>
            </div>
          )}
          <footer className="border-t px-5 py-3">
            <Link href="/admin/enquiries" className="inline-flex items-center gap-1 text-sm font-medium text-brand transition-colors hover:text-gold-foreground">
              Open the inbox
              <ArrowRight className="size-3.5" />
            </Link>
          </footer>
        </section>
      </div>

      {/* Quick links */}
      <section aria-labelledby="quick-links">
        <h3 id="quick-links" className="font-heading text-base font-semibold text-brand">
          Quick links
        </h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickLinks.map((item) => {
            const live = isLive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-start gap-3 rounded-2xl border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md"
              >
                <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", live ? "bg-brand text-brand-foreground" : "bg-gold-soft text-gold-foreground")}>
                  <AdminIcon name={item.icon} className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-foreground group-hover:text-brand">{item.label}</span>
                    {!live ? <SampleBadge phase={item.phase} /> : null}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{item.description}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
