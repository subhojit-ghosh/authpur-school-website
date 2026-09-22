import {
  FlaskConical,
  BookOpen,
  MonitorSmartphone,
  Trophy,
  Palette,
  Bus,
  type LucideIcon,
} from "lucide-react";
import { getHomeContent } from "@/lib/page-content";
import { SectionIntro } from "@/components/section-intro";
import { RevealGroup, RevealItem } from "@/components/motion";

const iconMap: Record<string, LucideIcon> = {
  flask: FlaskConical,
  book: BookOpen,
  monitor: MonitorSmartphone,
  trophy: Trophy,
  palette: Palette,
  bus: Bus,
};

/** Icons take the school colours in turn, in the order of the stripe. */
const iconColours = ["text-vermilion", "text-gold-ink", "text-leaf", "text-sky"];

export async function WhyUs() {
  const { whyUs } = await getHomeContent();

  return (
    <section className="bg-mist py-20 lg:py-28">
      <div className="container-edge grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-36">
            <SectionIntro kicker={whyUs.eyebrow} heading={whyUs.heading} blurb={whyUs.blurb} />
          </div>
        </div>

        <RevealGroup as="ul" className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-8">
          {whyUs.features.map((f, i) => {
            const Icon = iconMap[f.icon] ?? FlaskConical;
            return (
              <RevealItem as="li" key={f.title} className="border-t border-brand/15 pt-6">
                <Icon className={`size-8 ${iconColours[i % iconColours.length]}`} strokeWidth={1.6} />
                <h3 className="mt-4 font-heading text-xl font-semibold text-brand">{f.title}</h3>
                <p className="mt-2 text-pretty text-[17px] leading-relaxed text-foreground/80">{f.text}</p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
