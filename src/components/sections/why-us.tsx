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

const iconMap: Record<string, LucideIcon> = {
  flask: FlaskConical,
  book: BookOpen,
  monitor: MonitorSmartphone,
  trophy: Trophy,
  palette: Palette,
  bus: Bus,
};

export async function WhyUs() {
  const { whyUs } = await getHomeContent();

  return (
    <section className="py-20 lg:py-28">
      <div className="container-edge">
        <div className="flex flex-col items-end justify-between gap-6 md:flex-row">
          <div className="max-w-2xl">
            <span className="eyebrow">{whyUs.eyebrow}</span>
            <h2 className="mt-4 text-balance font-heading text-3xl font-semibold text-brand sm:text-4xl">
              {whyUs.heading}
            </h2>
          </div>
          {whyUs.blurb ? (
            <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground md:text-right">
              {whyUs.blurb}
            </p>
          ) : null}
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyUs.features.map((f) => {
            const Icon = iconMap[f.icon] ?? FlaskConical;
            return (
              <div
                key={f.title}
                className="group rounded-2xl border bg-card p-7 transition-all hover:-translate-y-1 hover:border-brand/20 hover:shadow-xl hover:shadow-brand/5"
              >
                <span className="grid size-12 place-items-center rounded-xl bg-accent text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-5 font-heading text-lg font-semibold text-brand">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
