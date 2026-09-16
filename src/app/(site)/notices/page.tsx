import type { Metadata } from "next";
import Link from "next/link";
import { Bell, CalendarDays, ArrowRight, ChevronRight } from "lucide-react";
import { PageBanner } from "@/components/page-banner";
import { getHomeContent, getPageBanners } from "@/lib/page-content";
import { getNotices, getUpcomingEvents } from "@/lib/content";
import { noticeTagClass } from "@/lib/content-types";
import { eventPath, noticePath } from "@/lib/permalinks";
import { dayMonth, formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Notice Board",
  description:
    "Latest notices, announcements and upcoming events at Authpur National Model Higher Secondary School.",
};

/** Re-rendered on demand when staff save changes, and at least hourly. */
export const revalidate = 3600;

export default async function NoticesPage() {
  const [noticeList, eventList, banners, home] = await Promise.all([
    getNotices(),
    getUpcomingEvents(),
    getPageBanners(),
    getHomeContent(),
  ]);
  const banner = banners.notices;

  return (
    <>
      <PageBanner eyebrow={banner.eyebrow} title={banner.title} subtitle={banner.subtitle} />

      <section className="py-16 lg:py-24">
        <div className="container-edge grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          {/* Notices */}
          <div>
            <h2 className="flex items-center gap-2.5 font-heading text-2xl font-semibold text-brand">
              <Bell className="size-6 text-gold" />
              {home.notices.heading}
            </h2>

            {noticeList.length ? (
              <ul className="mt-6 space-y-4">
                {noticeList.map((n) => (
                  <li key={n.id}>
                    <Link
                      href={noticePath(n)}
                      className="group block rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${noticeTagClass(n.tag)}`}
                          >
                            {n.tag}
                          </span>
                          <span className="text-xs font-medium text-muted-foreground sm:hidden">
                            {formatDate(n.date, "long")}
                          </span>
                        </div>
                        <span className="flex-1 text-sm font-medium text-foreground transition-colors group-hover:text-brand">
                          {n.title}
                        </span>
                        <span className="hidden shrink-0 text-xs font-medium text-muted-foreground sm:block">
                          {formatDate(n.date, "long")}
                        </span>
                        <ChevronRight className="hidden size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand sm:block" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
                No notices have been published yet.
              </p>
            )}
          </div>

          {/* Events */}
          <div>
            <h2 className="flex items-center gap-2.5 font-heading text-2xl font-semibold text-brand">
              <CalendarDays className="size-6 text-gold" />
              {home.notices.eventsHeading}
            </h2>

            <div className="mt-6 space-y-4">
              {eventList.length ? (
                eventList.map((e) => {
                  const { day, month } = dayMonth(e.date);
                  return (
                    <Link
                      key={e.id}
                      href={eventPath(e)}
                      className="group block rounded-2xl border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md"
                    >
                      <div className="flex items-center gap-4">
                        <div className="grid size-16 shrink-0 place-items-center rounded-xl bg-brand text-brand-foreground">
                          <span className="font-heading text-xl font-semibold leading-none">{day}</span>
                          <span className="text-[11px] uppercase tracking-wide text-brand-foreground/70">{month}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-brand">{e.title}</p>
                          <p className="text-sm text-muted-foreground">{e.venue}</p>
                        </div>
                        <ChevronRight className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
                  No upcoming events at the moment.
                </p>
              )}
            </div>

            <Link
              href="/admission-enquiry"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-gold-foreground"
            >
              Have a question? Get in touch
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
