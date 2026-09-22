import { getHomeContent } from "@/lib/page-content";
import { SectionIntro } from "@/components/section-intro";
import { RevealGroup, RevealItem } from "@/components/motion";

/** Each quotation mark takes a school colour in turn. */
const markColours = ["text-vermilion", "text-gold", "text-leaf", "text-sky"];

export async function Testimonials() {
  const { testimonials } = await getHomeContent();
  if (!testimonials.items.length) return null;

  return (
    <section className="bg-mist py-20 lg:py-28">
      <div className="container-edge">
        <SectionIntro kicker={testimonials.eyebrow} heading={testimonials.heading} blurb={testimonials.blurb} />

        <RevealGroup className="mt-12 grid gap-12 lg:mt-14 lg:grid-cols-3 lg:gap-14">
          {testimonials.items.map((t, i) => (
            <RevealItem as="figure" key={t.name} className="flex flex-col">
              <span
                aria-hidden
                className={`font-heading text-7xl font-bold leading-[0.6] ${markColours[i % markColours.length]}`}
              >
                “
              </span>
              <blockquote className="mt-5 flex-1 text-pretty text-xl leading-relaxed text-foreground">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 border-t pt-4 text-[15px]">
                <span className="block font-semibold text-brand">{t.name}</span>
                <span className="block text-muted-foreground">{t.role}</span>
              </figcaption>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
