import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { PageBanner } from "@/components/page-banner";
import { RichText } from "@/components/rich-text";
import { Button } from "@/components/ui/button";
import { getPublicEvent, getUpcomingEvents } from "@/lib/content";
import { dayMonth, formatDate, todayISO } from "@/lib/format";
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

  const { day, month } = dayMonth(event.date);
  const past = event.date < todayISO();
  const others = (await getUpcomingEvents({ limit: 4 })).filter((e) => e.id !== event.id).slice(0, 3);

  return (
    <>
      <PageBanner eyebrow="Events" title={event.title} subtitle={`${formatDate(event.date, "long")} · ${event.venue}`} />

      <section className="py-16 lg:py-24">
        <div className="container-edge grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <article>
            <div className="flex flex-wrap items-center gap-4">
              <div className="grid size-16 shrink-0 place-items-center rounded-xl bg-brand text-brand-foreground">
                <span className="font-heading text-xl font-semibold leading-none">{day}</span>
                <span className="text-[11px] uppercase tracking-wide text-brand-foreground/70">{month}</span>
              </div>
              <div>
                <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CalendarDays className="size-4 text-gold" />
                  {formatDate(event.date, "long")}
                  {past ? <span className="ml-1 rounded-full bg-secondary px-2 py-0.5 text-xs">Past event</span> : null}
                </p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-4 text-gold" />
                  {event.venue}
                </p>
              </div>
            </div>

            <h2 className="mt-6 text-balance font-heading text-2xl font-semibold text-brand sm:text-3xl">
              {event.title}
            </h2>

            {event.description ? (
              <RichText html={event.description} className="mt-6 text-base" />
            ) : (
              <p className="mt-6 rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
                There is no further detail for this event. Please contact the school office if you need more
                information.
              </p>
            )}

            <div className="mt-10 flex flex-wrap gap-3 border-t pt-6">
              <Button asChild variant="outline">
                <Link href="/notices">
                  <ArrowLeft className="size-4" />
                  Notices & events
                </Link>
              </Button>
              <Button asChild className="bg-brand text-brand-foreground hover:bg-brand-muted">
                <Link href="/admission-enquiry">
                  Ask a question
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </article>

          {others.length ? (
            <aside>
              <h2 className="flex items-center gap-2.5 font-heading text-xl font-semibold text-brand">
                <CalendarDays className="size-5 text-gold" />
                Other events
              </h2>
              <ul className="mt-5 space-y-3">
                {others.map((e) => {
                  const d = dayMonth(e.date);
                  return (
                    <li key={e.id}>
                      <Link
                        href={eventPath(e)}
                        className="group flex items-center gap-4 rounded-2xl border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-brand text-brand-foreground">
                          <span className="font-heading text-lg font-semibold leading-none">{d.day}</span>
                          <span className="text-[10px] uppercase tracking-wide text-brand-foreground/70">
                            {d.month}
                          </span>
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-foreground transition-colors group-hover:text-brand">
                            {e.title}
                          </span>
                          <span className="block text-xs text-muted-foreground">{e.venue}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </aside>
          ) : null}
        </div>
      </section>
    </>
  );
}
