import { Target, Eye, HeartHandshake, Quote } from "lucide-react";
import { school } from "@/lib/site";

const pillars = [
  {
    icon: Eye,
    title: "Our Vision",
    text: "To be a centre of learning where every child discovers their potential and grows into a responsible, compassionate citizen.",
  },
  {
    icon: Target,
    title: "Our Mission",
    text: "To deliver quality education that balances academic rigour with values, creativity and physical well-being.",
  },
  {
    icon: HeartHandshake,
    title: "Our Values",
    text: "Integrity, discipline, empathy and service — the foundations on which we build character for life.",
  },
];

export function About() {
  return (
    <section id="about" className="scroll-mt-24 py-20 lg:py-28">
      <div className="container-edge">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          {/* Principal / welcome */}
          <div>
            <span className="eyebrow">Welcome to our school</span>
            <h2 className="mt-4 text-balance font-heading text-3xl font-semibold text-brand sm:text-4xl">
              A tradition of learning, a future full of possibility
            </h2>
            <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">
              Since {school.established}, {school.shortName} has been a trusted name in
              Shyamnagar. What began as a small neighbourhood school has grown into a
              vibrant community of over 2,400 students — yet our promise remains
              unchanged: to know each child by name and to help them flourish.
            </p>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              We believe education is more than examinations. It is curiosity in the
              classroom, courage on the sports field, and kindness in the corridors.
            </p>

            <figure className="mt-8 rounded-2xl border bg-card p-6 shadow-sm">
              <Quote className="size-7 text-gold" />
              <blockquote className="mt-3 text-pretty font-heading text-lg italic leading-relaxed text-foreground">
                “Our purpose is not merely to fill minds, but to light them. Every student
                who walks through our gates carries our hope for a brighter tomorrow.”
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-brand font-heading text-sm font-semibold text-brand-foreground">
                  DR
                </span>
                <span className="leading-tight">
                  <span className="block font-semibold text-brand">Dr. (Mrs.) Rina Bhattacharya</span>
                  <span className="block text-sm text-muted-foreground">Principal</span>
                </span>
              </figcaption>
            </figure>
          </div>

          {/* Pillars */}
          <div className="grid gap-5">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="group flex gap-5 rounded-2xl border bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/5"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent text-brand transition-colors group-hover:bg-gold group-hover:text-gold-foreground">
                  <p.icon className="size-6" />
                </span>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-brand">{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
