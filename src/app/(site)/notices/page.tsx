import type { Metadata } from "next";
import Link from "next/link";
import { PageBanner } from "@/components/page-banner";
import { EventList, NoticeList } from "@/components/notice-list";
import { Reveal } from "@/components/motion";
import { getHomeContent, getPageBanners } from "@/lib/page-content";
import { getNotices, getUpcomingEvents } from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "/notices" },
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
        <div className="container-edge grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <h2 className="page-heading">{home.notices.heading}</h2>
            </Reveal>
            {noticeList.length ? (
              <div className="mt-6">
                <NoticeList notices={noticeList} />
              </div>
            ) : (
              <p className="mt-6 border-t-2 border-brand pt-6 text-lg text-muted-foreground">
                No notices have been published yet.
              </p>
            )}
          </div>

          <div id="events" className="scroll-mt-28 lg:col-span-5">
            <Reveal>
              <h2 className="page-heading">{home.notices.eventsHeading}</h2>
            </Reveal>
            <div className="mt-6">
              {eventList.length ? (
                <EventList events={eventList} />
              ) : (
                <p className="rounded-lg bg-mist p-6 text-lg text-muted-foreground">
                  No events are coming up. New ones appear here as soon as they are announced.
                </p>
              )}
            </div>

            <p className="mt-8 text-[17px] text-muted-foreground">
              Have a question about a notice?{" "}
              <Link href="/admission-enquiry" className="text-link">
                Get in touch with the office
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
