import { Check, ArrowUpRight, Baby, School, GraduationCap, type LucideIcon } from "lucide-react";
import { getHomeContent } from "@/lib/page-content";
import { toLines } from "@/lib/page-content-types";

/** Programme cards get a stage icon by position: first, middle, last. */
const stageIcons: LucideIcon[] = [Baby, School, GraduationCap];

export async function Academics() {
  const { academics } = await getHomeContent();

  return (
    <section id="academics" className="scroll-mt-24 bg-brand py-20 lg:py-28">
      <div className="container-edge">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center text-gold">{academics.eyebrow}</span>
          <h2 className="mt-4 text-balance font-heading text-3xl font-semibold text-brand-foreground sm:text-4xl">
            {academics.heading}
          </h2>
          {academics.blurb ? (
            <p className="mt-4 text-pretty leading-relaxed text-brand-foreground/70">{academics.blurb}</p>
          ) : null}
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {academics.programmes.map((p, i) => {
            const Icon = stageIcons[Math.min(i, stageIcons.length - 1)];
            const featured = i === academics.programmes.length - 1 && academics.programmes.length > 1;
            return (
              <div
                key={p.title}
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
                  {p.grades ? (
                    <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-brand-foreground/70">
                      {p.grades}
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-6 font-heading text-xl font-semibold text-brand-foreground">{p.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-foreground/70">{p.blurb}</p>

                <ul className="mt-5 space-y-2.5">
                  {toLines(p.points).map((pt) => (
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
