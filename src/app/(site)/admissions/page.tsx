import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PageBanner } from "@/components/page-banner";
import { RichText } from "@/components/rich-text";
import { CtaBand } from "@/components/cta-band";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion";
import { getPageBanners } from "@/lib/page-content";
import { getAdmissionsContent, getSchoolInfo } from "@/lib/settings";

/** The steps take the school colours in turn, in the order of the stripe. */
const stepColours = [
  { rule: "border-vermilion", num: "text-vermilion" },
  { rule: "border-gold", num: "text-gold-ink" },
  { rule: "border-leaf", num: "text-leaf" },
  { rule: "border-sky", num: "text-sky" },
];

/** A heading and a ruled two-column list, the shape of every table on this page. */
function RuledList({
  heading,
  rows,
  className,
}: {
  heading: string;
  rows: { left: string; right: string }[];
  className?: string;
}) {
  return (
    <Reveal className={className}>
      <h2 className="page-heading">{heading}</h2>
      <dl className="mt-6 border-t-2 border-brand">
        {rows.map((r) => (
          <div key={`${r.left}-${r.right}`} className="flex items-baseline justify-between gap-6 border-b py-4">
            <dt className="text-[17px] text-foreground">{r.left}</dt>
            <dd className="text-right font-heading text-lg font-semibold text-brand">{r.right}</dd>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}

export const metadata: Metadata = {
  alternates: { canonical: "/admissions" },
  title: "Admission",
  description:
    "Admission process, important dates, eligibility, fee structure and required documents for Authpur National Model Higher Secondary School.",
};

/** Re-rendered on demand when staff save changes in the admin panel. */
export const revalidate = 3600;

export default async function AdmissionsPage() {
  const [content, info, banners] = await Promise.all([getAdmissionsContent(), getSchoolInfo(), getPageBanners()]);
  const banner = banners.admissions;
  const { dates: admissionDates, eligibility, fees: feeStructure, feeNote, steps: admissionSteps, documents } = content;
  return (
    <>
      <PageBanner eyebrow={banner.eyebrow} title={banner.title} subtitle={banner.subtitle} />

      {/* How to apply. The steps really are a sequence, so they are numbered. */}
      <section className="py-16 lg:py-24">
        <div className="container-edge">
          <Reveal>
            <h2 className="page-heading">How to apply</h2>
          </Reveal>
          <RevealGroup as="ol" className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {admissionSteps.map((step, i) => {
              const colour = stepColours[i % stepColours.length];
              return (
                <RevealItem as="li" key={step.title} className={`border-t-4 pt-6 ${colour.rule}`}>
                  <span className={`font-heading text-5xl font-bold leading-none ${colour.num}`}>{i + 1}</span>
                  <h3 className="mt-4 font-heading text-xl font-semibold text-brand">{step.title}</h3>
                  <p className="mt-2 text-pretty text-[17px] leading-relaxed text-foreground/80">{step.text}</p>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-mist py-16 lg:py-24">
        <div className="container-edge grid gap-14 lg:grid-cols-2 lg:gap-16">
          <RuledList heading="Important dates" rows={admissionDates.map((d) => ({ left: d.event, right: d.date }))} />
          <Reveal>
            <h2 className="page-heading">Eligibility</h2>
            <dl className="mt-6 border-t-2 border-brand">
              {eligibility.map((e) => (
                <div key={e.level} className="grid gap-1 border-b py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
                  <dt className="font-heading text-lg font-semibold text-brand">{e.level}</dt>
                  <dd className="text-[17px] text-foreground/85">{e.criteria}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-edge grid gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <RuledList heading="Fee structure" rows={feeStructure.map((f) => ({ left: f.head, right: f.amount }))} />
            <RichText
              html={feeNote}
              className="mt-6 border-l-4 border-gold pl-5 text-[15px] leading-relaxed text-muted-foreground"
            />
          </div>
          <Reveal>
            <h2 className="page-heading">Documents required</h2>
            <ul className="mt-6 grid gap-x-8 border-t-2 border-brand pt-2 sm:grid-cols-2">
              {documents.map(({ item: doc }) => (
                <li key={doc} className="flex items-start gap-3 border-b py-3.5 text-[17px] text-foreground">
                  <Check className="mt-1 size-4 shrink-0 text-leaf" strokeWidth={3} />
                  {doc}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <CtaBand phone={info.admissionsPhone} />
    </>
  );
}
