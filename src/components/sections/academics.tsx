import { Check, ArrowUpRight, Baby, School, GraduationCap } from "lucide-react";
import { programmes } from "@/lib/site";

const icons = {
  primary: Baby,
  secondary: School,
  "higher-secondary": GraduationCap,
} as const;

export function Academics() {
  return (
    <section id="academics" className="scroll-mt-24 bg-brand py-20 lg:py-28">
      <div className="container-edge">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center text-gold">Academics</span>
          <h2 className="mt-4 text-balance font-heading text-3xl font-semibold text-brand-foreground sm:text-4xl">
            A continuous journey from first steps to final year
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-brand-foreground/70">
            Our curriculum is designed as one connected path — each stage building on the
            last, so students grow with confidence at every level.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {programmes.map((p, i) => {
            const Icon = icons[p.key];
            const featured = i === 2;
            return (
              <div
                key={p.key}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border p-7 transition-all hover:-translate-y-1 ${
                  featured
                    ? "border-gold/40 bg-brand-muted shadow-xl ring-1 ring-gold/30"
                    : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-xl bg-gold text-gold-foreground">
                    <Icon className="size-6" />
                  </span>
                  <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-brand-foreground/70">
                    {p.grades}
                  </span>
                </div>

                <h3 className="mt-6 font-heading text-xl font-semibold text-brand-foreground">
                  {p.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-foreground/70">
                  {p.blurb}
                </p>

                <ul className="mt-5 space-y-2.5">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2.5 text-sm text-brand-foreground/85">
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-gold/20 text-gold">
                        <Check className="size-3" />
                      </span>
                      {pt}
                    </li>
                  ))}
                </ul>

                <a
                  href="#admissions"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-colors hover:text-gold/80"
                >
                  Learn more
                  <ArrowUpRight className="size-4" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
