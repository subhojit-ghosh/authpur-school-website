import {
  FlaskConical,
  BookOpen,
  MonitorSmartphone,
  Trophy,
  Palette,
  Bus,
} from "lucide-react";
import { features } from "@/lib/site";

const iconMap = {
  flask: FlaskConical,
  book: BookOpen,
  monitor: MonitorSmartphone,
  trophy: Trophy,
  palette: Palette,
  bus: Bus,
} as const;

export function WhyUs() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-edge">
        <div className="flex flex-col items-end justify-between gap-6 md:flex-row">
          <div className="max-w-2xl">
            <span className="eyebrow">Why families choose us</span>
            <h2 className="mt-4 text-balance font-heading text-3xl font-semibold text-brand sm:text-4xl">
              Everything a growing child needs — under one roof
            </h2>
          </div>
          <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground md:text-right">
            Facilities and care thoughtfully built around learning, safety and the joy of
            childhood.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = iconMap[f.icon];
            return (
              <div
                key={f.title}
                className="group relative overflow-hidden rounded-2xl border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/5"
              >
                <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-gold/10 blur-2xl transition-opacity group-hover:opacity-100 md:opacity-0" />
                <span className="grid size-13 place-items-center rounded-2xl bg-accent text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
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
