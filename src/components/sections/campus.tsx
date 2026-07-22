import { Building2, FlaskConical, Library, Medal, Music, Camera } from "lucide-react";

const tiles = [
  {
    label: "Green Campus",
    icon: Building2,
    className: "sm:col-span-2 sm:row-span-2 min-h-64 sm:min-h-full",
    gradient: "from-brand via-brand-muted to-brand",
  },
  {
    label: "Science Labs",
    icon: FlaskConical,
    className: "min-h-40",
    gradient: "from-[oklch(0.55_0.11_200)] to-[oklch(0.42_0.1_220)]",
  },
  {
    label: "Library",
    icon: Library,
    className: "min-h-40",
    gradient: "from-[oklch(0.62_0.13_30)] to-[oklch(0.5_0.12_20)]",
  },
  {
    label: "Sports & Athletics",
    icon: Medal,
    className: "min-h-40",
    gradient: "from-[oklch(0.5_0.12_150)] to-[oklch(0.42_0.1_160)]",
  },
  {
    label: "Music & Arts",
    icon: Music,
    className: "min-h-40",
    gradient: "from-gold to-[oklch(0.62_0.13_60)]",
  },
];

export function Campus() {
  return (
    <section id="campus" className="scroll-mt-24 bg-secondary py-20 lg:py-28">
      <div className="container-edge">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center">Campus life</span>
          <h2 className="mt-4 text-balance font-heading text-3xl font-semibold text-brand sm:text-4xl">
            A campus that comes alive every single day
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Beyond the classroom, students explore, create, compete and celebrate together.
          </p>
        </div>

        <div className="mt-12 grid auto-rows-[10rem] grid-cols-2 gap-4 sm:grid-cols-4">
          {tiles.map((t) => (
            <figure
              key={t.label}
              className={`group relative overflow-hidden rounded-2xl bg-linear-to-br ${t.gradient} ${t.className} shadow-md ring-1 ring-black/5`}
            >
              <div className="bg-grid absolute inset-0 opacity-10" />
              <div className="absolute inset-0 bg-linear-to-t from-black/45 to-transparent" />
              <t.icon className="absolute right-4 top-4 size-6 text-white/80 transition-transform duration-300 group-hover:scale-110" />
              <figcaption className="absolute bottom-4 left-4 font-heading text-lg font-semibold text-white drop-shadow">
                {t.label}
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Camera className="size-3.5" />
          Photo gallery — real campus images can be added here.
        </p>
      </div>
    </section>
  );
}
