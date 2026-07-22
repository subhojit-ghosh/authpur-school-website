import type { Metadata } from "next";
import { Bell, CalendarDays, ArrowRight } from "lucide-react";
import { PageBanner } from "@/components/page-banner";
import { notices, events } from "@/lib/site";

export const metadata: Metadata = {
  title: "Notice Board",
  description:
    "Latest notices, announcements and upcoming events at Authpur National Model Higher Secondary School.",
};

const tagStyles: Record<string, string> = {
  Admissions: "bg-gold-soft text-gold-foreground",
  Result: "bg-[oklch(0.92_0.05_150)] text-[oklch(0.35_0.1_150)]",
  Event: "bg-accent text-brand",
  Notice: "bg-secondary text-secondary-foreground",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function NoticesPage() {
  return (
    <>
      <PageBanner
        eyebrow="Stay informed"
        title="Notice Board"
        subtitle="Announcements, circulars and upcoming events — everything happening at our school, in one place."
      />

      <section className="py-16 lg:py-24">
        <div className="container-edge grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          {/* Notices */}
          <div>
            <h2 className="flex items-center gap-2.5 font-heading text-2xl font-semibold text-brand">
              <Bell className="size-6 text-gold" />
              Latest Notices
            </h2>

            <ul className="mt-6 space-y-4">
              {notices.map((n) => (
                <li
                  key={n.title}
                  className="group flex flex-col gap-3 rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        tagStyles[n.tag] ?? "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {n.tag}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground sm:hidden">
                      {formatDate(n.date)}
                    </span>
                  </div>
                  <span className="flex-1 text-sm font-medium text-foreground transition-colors group-hover:text-brand">
                    {n.title}
                  </span>
                  <span className="hidden shrink-0 text-xs font-medium text-muted-foreground sm:block">
                    {formatDate(n.date)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Events */}
          <div>
            <h2 className="flex items-center gap-2.5 font-heading text-2xl font-semibold text-brand">
              <CalendarDays className="size-6 text-gold" />
              Upcoming Events
            </h2>

            <div className="mt-6 space-y-4">
              {events.map((e) => (
                <div
                  key={e.title}
                  className="flex items-center gap-4 rounded-2xl border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="grid size-16 shrink-0 place-items-center rounded-xl bg-brand text-brand-foreground">
                    <span className="font-heading text-xl font-semibold leading-none">{e.day}</span>
                    <span className="text-[11px] uppercase tracking-wide text-brand-foreground/70">
                      {e.month}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-brand">{e.title}</p>
                    <p className="text-sm text-muted-foreground">{e.place}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="/admission-enquiry"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-gold-foreground"
            >
              Have a question? Get in touch
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
