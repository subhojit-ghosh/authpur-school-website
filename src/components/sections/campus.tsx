import { Building2, FlaskConical, Library, Medal, Music, type LucideIcon } from "lucide-react";
import { getHomeContent } from "@/lib/page-content";

const iconMap: Record<string, LucideIcon> = {
  building: Building2,
  flask: FlaskConical,
  library: Library,
  medal: Medal,
  music: Music,
};

const gradients = [
  "from-brand via-brand-muted to-brand",
  "from-[oklch(0.55_0.11_200)] to-[oklch(0.42_0.1_220)]",
  "from-[oklch(0.62_0.13_30)] to-[oklch(0.5_0.12_20)]",
  "from-[oklch(0.5_0.12_150)] to-[oklch(0.42_0.1_160)]",
  "from-gold to-[oklch(0.62_0.13_60)]",
];

export async function Campus() {
  const { campus } = await getHomeContent();

  return (
    <section id="campus" className="scroll-mt-24 bg-secondary py-20 lg:py-28">
      <div className="container-edge">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center">{campus.eyebrow}</span>
          <h2 className="mt-4 text-balance font-heading text-3xl font-semibold text-brand sm:text-4xl">
            {campus.heading}
          </h2>
          {campus.blurb ? (
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{campus.blurb}</p>
          ) : null}
        </div>

        <div className="mt-12 grid auto-rows-[10rem] grid-cols-2 gap-4 sm:grid-cols-4">
          {campus.tiles.map((t, i) => {
            const Icon = iconMap[t.icon] ?? Building2;
            const large = i === 0;
            return (
              <figure
                key={t.label}
                className={`group relative overflow-hidden rounded-2xl bg-linear-to-br ${gradients[i % gradients.length]} ${
                  large ? "sm:col-span-2 sm:row-span-2 min-h-64 sm:min-h-full" : "min-h-40"
                } shadow-md ring-1 ring-black/5`}
              >
                <div className="bg-grid absolute inset-0 opacity-10" />
                <div className="absolute inset-0 bg-linear-to-t from-black/45 to-transparent" />
                <Icon className="absolute right-4 top-4 size-6 text-white/80 transition-transform duration-300 group-hover:scale-110" />
                <figcaption className="absolute bottom-4 left-4 font-heading text-lg font-semibold text-white drop-shadow">
                  {t.label}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
