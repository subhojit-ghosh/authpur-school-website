import { Quote, Star } from "lucide-react";
import { testimonials } from "@/lib/site";

export function Testimonials() {
  return (
    <section className="bg-secondary py-20 lg:py-28">
      <div className="container-edge">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center">In their words</span>
          <h2 className="mt-4 text-balance font-heading text-3xl font-semibold text-brand sm:text-4xl">
            Loved by students, trusted by parents
          </h2>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl border bg-card p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-brand/5"
            >
              <div className="flex items-center gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <Quote className="mt-4 size-7 text-gold/40" />
              <blockquote className="mt-3 flex-1 text-pretty leading-relaxed text-foreground">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t pt-5">
                <span className="grid size-11 place-items-center rounded-full bg-brand font-heading text-sm font-semibold text-brand-foreground">
                  {t.name
                    .replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)\s*/, "")
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <span className="leading-tight">
                  <span className="block font-semibold text-brand">{t.name}</span>
                  <span className="block text-sm text-muted-foreground">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
