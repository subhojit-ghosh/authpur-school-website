import type { Metadata } from "next";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion";
import { PageBanner } from "@/components/page-banner";
import { RichText } from "@/components/rich-text";
import { getPageBanners } from "@/lib/page-content";
import { getSchoolInfo, getTimings } from "@/lib/settings";

export const metadata: Metadata = {
  alternates: { canonical: "/school-timings" },
  title: "School Timings",
  description:
    "Daily schedule, section-wise class hours and office timings at Authpur National Model Higher Secondary School.",
};

/** Timeline dots take the school colours in turn, in the order of the stripe. */
const dotColours = ["bg-vermilion", "bg-gold", "bg-leaf", "bg-sky"];

/** Re-rendered on demand when staff save changes in the admin panel. */
export const revalidate = 3600;

export default async function SchoolTimingsPage() {
  const [timings, info, banners] = await Promise.all([getTimings(), getSchoolInfo(), getPageBanners()]);
  const banner = banners.schoolTimings;
  const { dailySchedule, sectionTimings, timingsNote } = timings;
  const officeHours = info.officeHours;
  return (
    <>
      <PageBanner eyebrow={banner.eyebrow} title={banner.title} subtitle={banner.subtitle} />

      <section className="py-16 lg:py-24">
        <div className="container-edge grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* The day in order, as a timeline */}
          <div className="lg:col-span-7">
            <Reveal>
              <h2 className="page-heading">A day at school</h2>
            </Reveal>
            <RevealGroup as="ol" className="relative mt-8">
              {dailySchedule.map((item, i) => (
                <RevealItem
                  as="li"
                  key={item.label}
                  className="group/step relative grid grid-cols-[7.5rem_1fr] gap-5 sm:grid-cols-[11rem_1fr] sm:gap-6"
                >
                  <span className="pt-0.5 text-right font-heading text-base font-semibold tabular-nums text-brand sm:text-lg">
                    {item.time}
                  </span>
                  {/* The line runs the full height of each step, so it reads as one line down the day. */}
                  <span className="relative border-l-2 border-brand/15 pb-8 pl-7 text-lg text-foreground group-last/step:border-transparent group-last/step:pb-0">
                    <span
                      aria-hidden
                      className={`absolute -left-[7px] top-2 size-3 rounded-full ring-4 ring-background ${dotColours[i % dotColours.length]}`}
                    />
                    {item.label}
                  </span>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <Reveal className="space-y-8 lg:col-span-5" delay={0.1}>
            <div className="overflow-hidden rounded-lg bg-brand text-brand-foreground">
              <div className="school-stripe h-1.5" />
              <div className="p-7 sm:p-8">
                <h2 className="font-heading text-2xl font-semibold text-white">Office hours</h2>
                <p className="mt-3 font-heading text-xl text-gold">{officeHours}</p>
                <p className="mt-3 text-[17px] leading-relaxed text-white/75">
                  The school office handles admissions, fee payments and general enquiries during these hours.
                </p>
              </div>
            </div>
            <RichText
              html={timingsNote}
              className="border-l-4 border-gold pl-5 text-[17px] leading-relaxed text-foreground/85"
            />
          </Reveal>
        </div>
      </section>

      {/* Section-wise timings */}
      <section className="bg-mist py-16 lg:py-24">
        <Reveal className="container-edge">
          <h2 className="page-heading">Class hours by section</h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[34rem] text-left text-[17px]">
              <thead>
                <tr className="border-b-2 border-brand text-[15px] text-muted-foreground">
                  <th className="py-3 pr-6 font-semibold">Section</th>
                  <th className="py-3 pr-6 font-semibold">Days</th>
                  <th className="py-3 font-semibold">Timing</th>
                </tr>
              </thead>
              <tbody>
                {sectionTimings.map((row) => (
                  <tr key={row.section} className="border-b border-brand/10">
                    <td className="py-4 pr-6 font-heading text-lg font-semibold text-brand">{row.section}</td>
                    <td className="py-4 pr-6 text-foreground/80">{row.days}</td>
                    <td className="py-4 font-heading text-lg font-semibold tabular-nums text-foreground">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>
    </>
  );
}
