import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { MapPin } from "lucide-react";
import { PageBanner } from "@/components/page-banner";
import { READING_TEXT, RichText } from "@/components/rich-text";
import { cn } from "@/lib/utils";
import { EventDate, EventList } from "@/components/notice-list";
import { Reveal } from "@/components/motion";
import { getPublicEvent, getUpcomingEvents } from "@/lib/content";
import { formatDate, todayISO } from "@/lib/format";
import { eventPath, idFromSlug } from "@/lib/permalinks";
import { richTextToPlain } from "@/lib/rich-text";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const id = idFromSlug(slug);
  const event = id ? await getPublicEvent(id) : undefined;
  if (!event) return { title: "Event not found" };

  return {
    title: event.title,
    alternates: { canonical: eventPath(event) },
    description:
      richTextToPlain(event.description, 160) ||
      `${event.title} at ${event.venue} on ${formatDate(event.date, "long")}.`,
  };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const id = idFromSlug(slug);
  if (!id) notFound();

  const event = await getPublicEvent(id);
  if (!event) notFound();

  const canonical = eventPath(event);
  if (canonical !== `/events/${slug}`) redirect(canonical);

  const past = event.date < todayISO();
  const others = (await getUpcomingEvents({ limit: 4 })).filter((e) => e.id !== event.id).slice(0, 3);

  return (
    <>
      <PageBanner eyebrow="Events" title={event.title} subtitle={formatDate(event.date, "long")} />

      <section className="py-16 lg:py-24">
        <div className="container-edge grid gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <article>
              <div className="flex items-center gap-5">
                <EventDate date={event.date} size="lg" />
                <div className="text-[17px]">
                  <p className="font-heading text-xl font-semibold text-brand">{formatDate(event.date, "long")}</p>
                  {event.venue ? (
                    <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="size-4 text-gold-ink" />
                      {event.venue}
                    </p>
                  ) : null}
                  {past ? (
                    <p className="mt-2 inline-flex rounded bg-mist px-2 py-0.5 text-sm font-semibold text-muted-foreground">
                      This event has taken place
                    </p>
                  ) : null}
                </div>
              </div>

              {event.description ? (
                <RichText html={event.description} className={cn(READING_TEXT, "mt-10")} />
              ) : (
                <p className="mt-10 rounded-lg bg-mist p-6 text-lg text-muted-foreground">
                  There is no further detail for this event. Please contact the school office if you need more
                  information.
                </p>
              )}

              <p className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t pt-6 text-[17px]">
                <Link href="/notices#events" className="text-link">
                  Back to notices and events
                </Link>
                <Link href="/admission-enquiry" className="text-link">
                  Ask the office a question
                </Link>
              </p>
            </article>
          </Reveal>

          {others.length ? (
            <aside className="lg:col-span-5">
              <h2 className="font-heading text-xl font-semibold text-brand">Other events</h2>
              <div className="mt-5">
                <EventList events={others} />
              </div>
            </aside>
          ) : null}
        </div>
      </section>
    </>
  );
}
