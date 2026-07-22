import type { Metadata } from "next";
import { Clock, Sun, Building2, Info } from "lucide-react";
import { PageBanner } from "@/components/page-banner";
import {
  dailySchedule,
  sectionTimings,
  officeHours,
  timingsNote,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "School Timings",
  description:
    "Daily schedule, section-wise class hours and office timings at Authpur National Model Higher Secondary School.",
};

export default function SchoolTimingsPage() {
  return (
    <>
      <PageBanner
        eyebrow="Academics"
        title="School Timings"
        subtitle="Our daily rhythm — from the morning assembly to the final bell — and section-wise hours."
      />

      <section className="py-16 lg:py-24">
        <div className="container-edge grid gap-8 lg:grid-cols-2">
          {/* Daily schedule */}
          <div className="rounded-2xl border bg-card p-7 shadow-sm">
            <h2 className="flex items-center gap-2.5 font-heading text-2xl font-semibold text-brand">
              <Sun className="size-6 text-gold" />
              A day at school
            </h2>
            <ul className="mt-6 space-y-1">
              {dailySchedule.map((item, i) => (
                <li
                  key={item.label}
                  className="flex items-center justify-between gap-4 rounded-lg px-3 py-3 odd:bg-secondary/60"
                >
                  <span className="flex items-center gap-3 text-sm font-medium text-foreground">
                    <span className="grid size-7 place-items-center rounded-full bg-brand text-xs font-semibold text-brand-foreground">
                      {i + 1}
                    </span>
                    {item.label}
                  </span>
                  <span className="font-heading text-sm font-semibold text-brand">{item.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Office hours + note */}
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border bg-card p-7 shadow-sm">
              <h2 className="flex items-center gap-2.5 font-heading text-2xl font-semibold text-brand">
                <Building2 className="size-6 text-gold" />
                Office hours
              </h2>
              <p className="mt-4 text-lg font-medium text-foreground">{officeHours}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                The school office handles admissions, fee payments and general enquiries during
                these hours.
              </p>
            </div>

            <div className="flex gap-4 rounded-2xl border border-gold/30 bg-gold-soft/40 p-6">
              <Info className="size-5 shrink-0 text-gold-foreground" />
              <p className="text-sm leading-relaxed text-foreground">{timingsNote}</p>
            </div>
          </div>
        </div>

        {/* Section-wise timings */}
        <div className="container-edge mt-8">
          <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="flex items-center gap-2.5 border-b bg-secondary/50 px-7 py-5">
              <Clock className="size-5 text-gold-foreground" />
              <h2 className="font-heading text-xl font-semibold text-brand">
                Section-wise class hours
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-7 py-4 font-semibold">Section</th>
                    <th className="px-7 py-4 font-semibold">Days</th>
                    <th className="px-7 py-4 font-semibold">Timing</th>
                  </tr>
                </thead>
                <tbody>
                  {sectionTimings.map((row) => (
                    <tr key={row.section} className="border-b last:border-0 hover:bg-accent/40">
                      <td className="px-7 py-4 font-medium text-brand">{row.section}</td>
                      <td className="px-7 py-4 text-muted-foreground">{row.days}</td>
                      <td className="px-7 py-4 font-heading font-semibold text-foreground">
                        {row.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
