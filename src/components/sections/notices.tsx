import Link from "next/link";
import { getNotices, getUpcomingEvents } from "@/lib/content";
import { getHomeContent } from "@/lib/page-content";
import { EventList, NoticeList } from "@/components/notice-list";

function MoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-link shrink-0 text-[15px]">
      {children}
    </Link>
  );
}

export async function Notices() {
  const [noticeList, eventList, home] = await Promise.all([
    getNotices({ limit: 5 }),
    getUpcomingEvents({ limit: 3 }),
    getHomeContent(),
  ]);
  const copy = home.notices;

  return (
    <section id="notices" className="scroll-mt-28 py-20 lg:py-28">
      <div className="container-edge grid gap-14 lg:grid-cols-12 lg:gap-16">
        {/* Notice board */}
        <div className="lg:col-span-7">
          {copy.eyebrow ? <p className="kicker">{copy.eyebrow}</p> : null}
          <div className="mt-3 flex items-end justify-between gap-4">
            <h2 className="section-title">{copy.heading}</h2>
            <MoreLink href="/notices">All notices</MoreLink>
          </div>

          {noticeList.length ? (
            <div className="mt-8">
              <NoticeList notices={noticeList} />
            </div>
          ) : (
            <p className="mt-8 border-t-2 border-brand pt-6 text-lg text-muted-foreground">
              No notices have been published yet.
            </p>
          )}
        </div>

        {/* Upcoming events */}
        <div className="lg:col-span-5">
          {copy.eventsEyebrow ? <p className="kicker">{copy.eventsEyebrow}</p> : null}
          <div className="mt-3 flex items-end justify-between gap-4">
            <h2 className="section-title">{copy.eventsHeading}</h2>
            <MoreLink href="/notices#events">All events</MoreLink>
          </div>

          {eventList.length ? (
            <div className="mt-8">
              <EventList events={eventList} />
            </div>
          ) : (
            <p className="mt-8 rounded-lg bg-mist p-6 text-lg text-muted-foreground">
              No events are coming up. New ones appear here as soon as they are announced.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
