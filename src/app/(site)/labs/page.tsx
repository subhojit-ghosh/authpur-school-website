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
import { PageBanner } from "@/components/page-banner";
import { getLabsContent, getPageBanners } from "@/lib/page-content";
import { toLines } from "@/lib/page-content-types";

export const metadata: Metadata = {
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

export const revalidate = 3600;

export default async function LabsPage() {
  const [{ items }, banners] = await Promise.all([getLabsContent(), getPageBanners()]);
  const banner = banners.labs;

  return (
    <>
      <PageBanner eyebrow={banner.eyebrow} title={banner.title} subtitle={banner.subtitle} />

      <section className="py-16 lg:py-24">
        <div className="container-edge grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((lab) => {
            const Icon = iconMap[lab.icon] ?? Atom;
            return (
              <div
                key={lab.name}
                className="group flex flex-col rounded-2xl border bg-card p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/5"
              >
                <span className="grid size-13 place-items-center rounded-2xl bg-accent text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                  <Icon className="size-6" />
                </span>
                <h2 className="mt-5 font-heading text-lg font-semibold text-brand">{lab.name}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {lab.blurb}
                </p>
                <ul className="mt-5 space-y-2 border-t pt-4">
                  {toLines(lab.points).map((h) => (
                    <li key={h} className="flex items-center gap-2.5 text-sm text-foreground">
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-gold-soft text-gold-foreground">
                        <Check className="size-3" />
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
