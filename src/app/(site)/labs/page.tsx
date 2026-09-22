import type { Metadata } from "next";
import {
  Atom,
  FlaskConical,
  Microscope,
  Cpu,
  Languages,
  ShieldCheck,
  Check,
} from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion";
import { CtaBand } from "@/components/cta-band";
import { getSchoolInfo } from "@/lib/settings";
import { PageBanner } from "@/components/page-banner";
import { READING_TEXT, RichText } from "@/components/rich-text";
import { cn } from "@/lib/utils";
import { getLabsContent, getPageBanners } from "@/lib/page-content";
import { toLines } from "@/lib/page-content-types";

export const metadata: Metadata = {
  alternates: { canonical: "/labs" },
  title: "School Laboratories",
  description:
    "Modern Physics, Chemistry, Biology, Computer and Language laboratories at Authpur National Model Higher Secondary School.",
};

const iconMap: Record<string, typeof Atom> = {
  atom: Atom,
  flask: FlaskConical,
  microscope: Microscope,
  leaf: Microscope,
  monitor: Cpu,
  cpu: Cpu,
  book: Languages,
  languages: Languages,
  shield: ShieldCheck,
};

/** Each laboratory takes a school colour in turn, in the order of the stripe. */
const labColours = [
  { rule: "border-vermilion", icon: "text-vermilion" },
  { rule: "border-gold", icon: "text-gold-ink" },
  { rule: "border-leaf", icon: "text-leaf" },
  { rule: "border-sky", icon: "text-sky" },
];

export const revalidate = 3600;

export default async function LabsPage() {
  const [{ items }, banners, info] = await Promise.all([getLabsContent(), getPageBanners(), getSchoolInfo()]);
  const banner = banners.labs;

  return (
    <>
      <PageBanner eyebrow={banner.eyebrow} title={banner.title} subtitle={banner.subtitle} />

      <section className="py-16 lg:py-24">
        <RevealGroup className="container-edge grid gap-x-12 gap-y-14 md:grid-cols-2">
          {items.map((lab, i) => {
            const Icon = iconMap[lab.icon] ?? Atom;
            const colour = labColours[i % labColours.length];
            return (
              <RevealItem as="article" key={lab.name} className={`border-t-4 pt-7 ${colour.rule}`}>
                <h2 className="flex items-center gap-3 font-heading text-2xl font-semibold text-brand">
                  <Icon className={`size-7 shrink-0 ${colour.icon}`} strokeWidth={1.6} />
                  {lab.name}
                </h2>
                <RichText html={lab.blurb} className={cn(READING_TEXT, "mt-4")} />
                {toLines(lab.points).length ? (
                  <ul className="mt-6 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                    {toLines(lab.points).map((h) => (
                      <li key={h} className="flex items-start gap-2.5 text-[17px] text-foreground">
                        <Check className={`mt-1 size-4 shrink-0 ${colour.icon}`} strokeWidth={3} />
                        {h}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>

      <CtaBand
        heading="See the laboratories for yourself"
        text="Families are welcome to visit during office hours. Send an enquiry or call the office to arrange a time."
        phone={info.admissionsPhone}
      />
    </>
  );
}
