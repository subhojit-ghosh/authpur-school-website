import Link from "next/link";
import { getHomeContent } from "@/lib/page-content";
import { SectionIntro } from "@/components/section-intro";
import type { HeroImage } from "@/components/sections/hero-carousel";
import { cn } from "@/lib/utils";
import { RevealGroup, RevealItem } from "@/components/motion";

/**
 * Campus life as a mosaic of captioned photographs. Staff set each tile's
 * label and photo in the admin panel; the home page resolves the photos.
 */
export async function Campus({ tiles }: { tiles: { label: string; photo?: HeroImage }[] }) {
  const { campus } = await getHomeContent();
  // The first tile is the large one. Five fill the mosaic exactly; more wrap
  // onto further rows.
  if (!tiles.length) return null;

  return (
    <section id="campus" className="scroll-mt-28 pb-20 lg:pb-28">
      <div className="container-edge">
        <SectionIntro split kicker={campus.eyebrow} heading={campus.heading} blurb={campus.blurb} />

        <RevealGroup className="mt-12 grid auto-rows-[11rem] grid-cols-2 gap-3 sm:auto-rows-[13rem] sm:gap-4 lg:mt-14 lg:grid-cols-4">
          {tiles.map((t, i) => {
            const photo = t.photo;
            return (
              <RevealItem
                as="figure"
                key={`${t.label}-${i}`}
                className={cn(
                  "group relative overflow-hidden rounded-lg bg-brand",
                  i === 0 && "col-span-2 row-span-2",
                )}
              >
                {photo ? (
                  // oxlint-disable-next-line nextjs/no-img-element -- already resized on upload
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 motion-reduce:transition-none"
                  />
                ) : null}
                <div className="absolute inset-0 bg-linear-to-t from-brand/85 via-brand/10 to-transparent" />
                <figcaption
                  className={cn(
                    "absolute bottom-0 left-0 p-4 font-heading font-semibold text-white sm:p-5",
                    i === 0 ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl",
                  )}
                >
                  {t.label}
                </figcaption>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <p className="mt-10">
          <Link
            href="/gallery"
            className="text-link text-lg"
          >
            See more in the photo gallery
          </Link>
        </p>
      </div>
    </section>
  );
}
