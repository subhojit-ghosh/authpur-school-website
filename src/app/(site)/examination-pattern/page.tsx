import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { READING_TEXT, RichText } from "@/components/rich-text";
import { ExamTabs } from "@/components/sections/exam-tabs";
import { Reveal } from "@/components/motion";
import { getPageBanners } from "@/lib/page-content";
import { getExamPattern } from "@/lib/settings";

export const metadata: Metadata = {
  alternates: { canonical: "/examination-pattern" },
  title: "Examination Pattern",
  description:
    "Tests, marks, syllabus dates and pass criteria for every class at Authpur National Model Higher Secondary School.",
};

/** Re-rendered on demand when staff save changes in the admin panel. */
export const revalidate = 3600;

export default async function ExaminationPatternPage() {
  const [pattern, banners] = await Promise.all([getExamPattern(), getPageBanners()]);
  const banner = banners.examPattern;
  const key = pattern.key
    .split("\n")
    .map((line) => line.split(":").map((part) => part.trim()))
    .filter(([short, meaning]) => short && meaning);

  return (
    <>
      <div className="print:hidden">
        <PageBanner eyebrow={banner.eyebrow} title={banner.title} subtitle={banner.subtitle} />
      </div>

      <section className="py-16 lg:py-24 print:py-0">
        <div className="container-edge">
          <Reveal className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-8">
              {pattern.session ? <p className="kicker">Session {pattern.session}</p> : null}
              <h1 className="mt-2 hidden font-heading text-3xl font-bold text-brand print:block">{banner.title}</h1>
              <RichText html={pattern.intro} className={`${READING_TEXT} mt-3`} />
            </div>
            {key.length ? (
              <div className="lg:col-span-4">
                <h2 className="font-heading text-lg font-semibold text-brand">What the short forms mean</h2>
                <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 border-t-2 border-brand pt-4 text-[17px]">
                  {key.map(([short, meaning]) => (
                    <div key={short} className="flex gap-2">
                      <dt className="min-w-10 font-heading font-bold text-brand">{short}</dt>
                      <dd className="text-foreground/85">{meaning}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
          </Reveal>

          <div className="mt-14 lg:mt-16">
            {pattern.groups.length ? (
              <ExamTabs groups={pattern.groups} />
            ) : (
              <p className="rounded-lg bg-mist p-6 text-lg text-muted-foreground">
                The examination pattern for this session will be published here soon.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
