import { Bell, CalendarDays, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getNotices, getUpcomingEvents } from "@/lib/content";
import { noticeTagClass } from "@/lib/content-types";
import { dayMonth, formatDate } from "@/lib/format";

export async function Notices() {
  const [noticeList, eventList] = await Promise.all([getNotices(4), getUpcomingEvents(3)]);

  return (
    <section id="notices" className="scroll-mt-24 py-20 lg:py-28">
      <div className="container-edge grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        {/* Notice board */}
        <div>
          <div className="flex items-center justify-between">
            <div>
              <span className="eyebrow">Stay informed</span>
              <h2 className="mt-3 flex items-center gap-2.5 font-heading text-3xl font-semibold text-brand">
                <Bell className="size-6 text-gold" />
                Notice Board
              </h2>
            </div>
          </div>

          {noticeList.length ? (
            <ul className="mt-8 divide-y rounded-2xl border bg-card">
              {noticeList.map((n) => (
                <li
                  key={n.id}
                  className="group flex flex-col gap-2 p-5 transition-colors hover:bg-accent/40 sm:flex-row sm:items-center sm:gap-5"
                >
                  <span className="w-24 shrink-0 text-xs font-medium text-muted-foreground">
                    {formatDate(n.date)}
                  </span>
                  <span
                    className={`inline-flex w-fit shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${noticeTagClass(n.tag)}`}
                  >
                    {n.tag}
                  </span>
                  <span className="flex-1 text-sm font-medium text-foreground transition-colors group-hover:text-brand">
                    {n.title}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-8 rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
              No notices have been published yet.
            </p>
          )}

          <Button variant="ghost" className="mt-5 text-brand hover:text-brand" asChild>
            <a href="/notices">
              View all notices
              <ArrowRight className="size-4" />
            </a>
          </Button>
        </div>

        {/* Upcoming events */}
        <div>
          <span className="eyebrow">What&apos;s next</span>
          <h2 className="mt-3 flex items-center gap-2.5 font-heading text-3xl font-semibold text-brand">
            <CalendarDays className="size-6 text-gold" />
            Upcoming Events
          </h2>

          <div className="mt-8 space-y-4">
            {eventList.length ? (
              eventList.map((e) => {
                const { day, month } = dayMonth(e.date);
                return (
                  <div
                    key={e.id}
                    className="flex items-center gap-4 rounded-2xl border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="grid size-16 shrink-0 flex-col place-items-center rounded-xl bg-brand text-brand-foreground">
                      <span className="font-heading text-xl font-semibold leading-none">{day}</span>
                      <span className="text-[11px] uppercase tracking-wide text-brand-foreground/70">{month}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-brand">{e.title}</p>
                      <p className="text-sm text-muted-foreground">{e.venue}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
                No upcoming events at the moment. Please check back soon.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
