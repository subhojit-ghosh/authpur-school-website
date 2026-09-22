import { Target, Eye, HeartHandshake, type LucideIcon } from "lucide-react";
import { getHomeContent, getIdentity } from "@/lib/page-content";
import { fillPlaceholders } from "@/lib/page-content-types";
import { RichText } from "@/components/rich-text";
import { SectionIntro } from "@/components/section-intro";
import type { HeroImage } from "@/components/sections/hero-carousel";
import { Parallax, Reveal, RevealGroup, RevealItem } from "@/components/motion";

const pillarIcons: Record<string, LucideIcon> = { eye: Eye, target: Target, heart: HeartHandshake };

/** Vision, mission and values take the first three school colours in turn. */
const pillarColours = [
  { rule: "border-vermilion", icon: "text-vermilion" },
  { rule: "border-gold", icon: "text-gold" },
  { rule: "border-leaf", icon: "text-leaf" },
];

export async function About({ photo }: { photo?: HeroImage }) {
  const [home, id] = await Promise.all([getHomeContent(), getIdentity()]);
  const about = home.about;
  const vars = { year: id.established, shortName: id.shortName, name: id.name };
  const paragraphs = fillPlaceholders(about.paragraphs, vars);

  return (
    <section id="about" className="scroll-mt-28">
      <div className="container-edge grid gap-12 py-20 lg:grid-cols-12 lg:gap-16 lg:py-28">
        <div className="lg:col-span-6">
          <SectionIntro kicker={about.eyebrow} heading={about.heading} blurb={about.blurb} />
          <Reveal delay={0.1}>
          <RichText
            html={paragraphs}
            className="mt-6 max-w-[62ch] text-lg text-foreground/85 [&_p]:my-4 [&_p]:text-pretty [&_p]:leading-relaxed"
          />

          {about.quote ? (
            <figure className="mt-10 max-w-[60ch] border-l-4 border-gold pl-6">
              <blockquote className="text-pretty font-heading text-xl font-medium leading-snug text-brand sm:text-[1.4rem]">
                “{about.quote}”
              </blockquote>
              <figcaption className="mt-4 text-[15px]">
                <span className="font-semibold text-brand">{about.quoteName}</span>
                {about.quoteRole ? <span className="text-muted-foreground">, {about.quoteRole}</span> : null}
              </figcaption>
            </figure>
          ) : null}
          </Reveal>
        </div>

        {photo ? (
          <Reveal className="lg:col-span-6" y={40}>
            <Parallax className="aspect-[4/3] w-full rounded-lg lg:aspect-auto lg:h-full lg:min-h-[32rem]" strength={50}>
              {/* oxlint-disable-next-line nextjs/no-img-element -- already resized on upload */}
              <img src={photo.src} alt={photo.alt} loading="lazy" className="h-full w-full object-cover" />
            </Parallax>
          </Reveal>
        ) : null}
      </div>

      {/* Vision, mission and values */}
      {about.pillars.length ? (
        <div className="bg-brand text-brand-foreground">
          <RevealGroup className="container-edge grid gap-10 py-16 md:grid-cols-3 lg:gap-14 lg:py-20">
            {about.pillars.map((p, i) => {
              const Icon = pillarIcons[p.icon] ?? Eye;
              const colour = pillarColours[i % pillarColours.length];
              return (
                <RevealItem key={p.title} className={`border-t-4 pt-6 ${colour.rule}`}>
                  <h3 className="flex items-center gap-3 font-heading text-2xl font-semibold text-white">
                    <Icon className={`size-6 ${colour.icon}`} strokeWidth={1.8} />
                    {p.title}
                  </h3>
                  <p className="mt-4 text-pretty text-lg leading-relaxed text-white/80">{p.text}</p>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      ) : null}
    </section>
  );
}
