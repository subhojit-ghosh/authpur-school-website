import { Target, Eye, HeartHandshake, Quote, type LucideIcon } from "lucide-react";
import { getHomeContent, getIdentity } from "@/lib/page-content";
import { fillPlaceholders, toParagraphs } from "@/lib/page-content-types";

const pillarIcons: Record<string, LucideIcon> = { eye: Eye, target: Target, heart: HeartHandshake };

export async function About() {
  const [home, id] = await Promise.all([getHomeContent(), getIdentity()]);
  const about = home.about;
  const vars = { year: id.established, shortName: id.shortName, name: id.name };
  const paragraphs = toParagraphs(about.paragraphs).map((p) => fillPlaceholders(p, vars));

  return (
    <section id="about" className="scroll-mt-24 py-20 lg:py-28">
      <div className="container-edge">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          {/* Welcome */}
          <div>
            <span className="eyebrow">{about.eyebrow}</span>
            <h2 className="mt-4 text-balance font-heading text-3xl font-semibold text-brand sm:text-4xl">
              {about.heading}
            </h2>
            {paragraphs.map((p, i) => (
              <p key={i} className={`${i === 0 ? "mt-5" : "mt-4"} text-pretty leading-relaxed text-muted-foreground`}>
                {p}
              </p>
            ))}

            {about.quote ? (
              <figure className="mt-8 rounded-2xl border bg-card p-6 shadow-sm">
                <Quote className="size-7 text-gold" />
                <blockquote className="mt-3 text-pretty font-heading text-lg italic leading-relaxed text-foreground">
                  “{about.quote}”
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-full bg-brand font-heading text-sm font-semibold text-brand-foreground">
                    {about.quoteName
                      .replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)\s*/, "")
                      .replace(/[()]/g, "")
                      .split(" ")
                      .map((w) => w[0])
                      .filter(Boolean)
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <span className="leading-tight">
                    <span className="block font-semibold text-brand">{about.quoteName}</span>
                    <span className="block text-sm text-muted-foreground">{about.quoteRole}</span>
                  </span>
                </figcaption>
              </figure>
            ) : null}
          </div>

          {/* Pillars */}
          <div className="grid gap-5">
            {about.pillars.map((p) => {
              const Icon = pillarIcons[p.icon] ?? Eye;
              return (
                <div
                  key={p.title}
                  className="group flex gap-5 rounded-2xl border bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/5"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent text-brand transition-colors group-hover:bg-gold group-hover:text-gold-foreground">
                    <Icon className="size-6" />
                  </span>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-brand">{p.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
