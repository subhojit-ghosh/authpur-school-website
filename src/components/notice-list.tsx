import Link from "next/link";
import type { Event, Notice } from "@/db/schema";
import { RevealGroup, RevealItem } from "@/components/motion";
import { noticeTagClass } from "@/lib/content-types";
import { dayMonth, formatDate } from "@/lib/format";
import { eventPath, noticePath } from "@/lib/permalinks";
import { cn } from "@/lib/utils";

/** Event date blocks take the school colours in turn. */
const dateColours = ["bg-vermilion text-white", "bg-gold text-gold-foreground", "bg-leaf text-white", "bg-sky text-white"];

/**
 * Notices as a ruled list: date, tag, title. Used on the home page, the
 * notice board and beside a single notice. `compact` drops the date column
 * for a narrow sidebar.
 */
export function NoticeList({ notices, compact = false }: { notices: Notice[]; compact?: boolean }) {
  return (
    <RevealGroup as="ul" className="border-t-2 border-brand">
      {notices.map((n) => (
        <RevealItem as="li" key={n.id} className="border-b">
          <Link
            href={noticePath(n)}
            className={cn(
              "group grid gap-x-6 gap-y-1.5 py-5",
              !compact && "sm:grid-cols-[8.5rem_1fr] sm:items-baseline",
            )}
          >
            <time dateTime={n.date} className="text-[15px] text-muted-foreground">
              {formatDate(n.date)}
            </time>
            <span>
              <span
                className={`mr-3 inline-flex rounded px-2 py-0.5 align-[2px] text-[13px] font-semibold ${noticeTagClass(n.tag)}`}
              >
                {n.tag}
              </span>
              <span
                className={cn(
                  "font-medium text-foreground group-hover:text-brand group-hover:underline group-hover:underline-offset-4",
                  compact ? "text-[17px]" : "text-lg",
                )}
              >
                {n.title}
              </span>
            </span>
          </Link>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

/** A coloured day-and-month block for an event. */
export function EventDate({ date, index = 0, size = "md" }: { date: string; index?: number; size?: "md" | "lg" }) {
  const { day, month } = dayMonth(date);
  return (
    <time
      dateTime={date}
      className={cn(
        "grid shrink-0 place-content-center rounded-md text-center",
        size === "lg" ? "w-24 py-4" : "w-18 py-2",
        dateColours[index % dateColours.length],
      )}
    >
      <span className={cn("font-heading font-bold leading-none", size === "lg" ? "text-5xl" : "text-3xl")}>{day}</span>
      <span className={cn("mt-1 font-semibold", size === "lg" ? "text-base" : "text-sm")}>{month}</span>
    </time>
  );
}

/** Events as rows of date block, title and venue. */
export function EventList({ events }: { events: Event[] }) {
  return (
    <RevealGroup as="ul" className="space-y-4">
      {events.map((e, i) => (
        <RevealItem as="li" key={e.id}>
          <Link href={eventPath(e)} className="group flex items-stretch gap-5 rounded-lg bg-mist p-4">
            <EventDate date={e.date} index={i} />
            <span className="self-center">
              <span className="block font-heading text-lg font-semibold leading-snug text-brand group-hover:underline group-hover:underline-offset-4">
                {e.title}
              </span>
              {e.venue ? <span className="mt-0.5 block text-[15px] text-muted-foreground">{e.venue}</span> : null}
            </span>
          </Link>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
