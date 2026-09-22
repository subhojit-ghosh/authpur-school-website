import type { Metadata } from "next";
import { HeroCarousel, type HeroImage } from "@/components/sections/hero-carousel";
import { StatsBand } from "@/components/sections/stats-band";
import { UpdatesTicker } from "@/components/sections/updates-ticker";
import { About } from "@/components/sections/about";
import { Academics } from "@/components/sections/academics";
import { WhyUs } from "@/components/sections/why-us";
import { Campus } from "@/components/sections/campus";
import { Notices } from "@/components/sections/notices";
import { Testimonials } from "@/components/sections/testimonials";
import { Admissions } from "@/components/sections/admissions";
import { Contact } from "@/components/sections/contact";
import { getHomeContent, getIdentity } from "@/lib/page-content";
import { getPhotoChoices, type PhotoChoice } from "@/lib/photo-choices";
import { heroImages } from "@/lib/site";

export const metadata: Metadata = { alternates: { canonical: "/" } };

/** Re-rendered on demand when staff save changes in the admin panel, and at least hourly. */
export const revalidate = 3600;

const toImage = (p: PhotoChoice): HeroImage => ({ src: p.url, alt: p.alt });

export default async function Home() {
  const [choices, identity, home] = await Promise.all([getPhotoChoices(), getIdentity(), getHomeContent()]);
  const banners = choices.filter((c) => c.ref.startsWith("banner:"));
  const images: HeroImage[] = banners.length ? banners.map(toImage) : [...heroImages];

  // Photographs for the sections further down, in the order they are handed
  // out: gallery first, then the banners, starting from the second so the
  // first banner (already in view at the top) comes last.
  const pool: PhotoChoice[] = [
    ...choices.filter((c) => c.ref.startsWith("gallery:")),
    ...banners.slice(1),
    ...banners.slice(0, 1),
  ];
  const photos: HeroImage[] = pool.length ? pool.map(toImage) : [...heroImages.slice(1), heroImages[0]];

  // A campus tile shows the photo staff chose for it. Tiles left on automatic
  // take the next photo from the pool that no tile has claimed.
  const byRef = new Map(choices.map((c) => [c.ref, c]));
  const claimed = new Set(home.campus.tiles.map((t) => t.photo).filter((ref) => ref && byRef.has(ref)));
  const spare = pool.filter((p) => !claimed.has(p.ref)).map(toImage);
  let next = 0;
  const campusTiles = home.campus.tiles.map((t) => {
    const chosen = t.photo ? byRef.get(t.photo) : undefined;
    if (chosen) return { label: t.label, photo: toImage(chosen) };
    const auto = spare.length ? spare[next++ % spare.length] : photos[next++ % photos.length];
    return { label: t.label, photo: auto };
  });

  return (
    <>
      <HeroCarousel
        images={images}
        name={identity.name}
        lines={[identity.affiliationLine, identity.trustLine]}
        quickLinks={home.quickLinks}
      />
      <UpdatesTicker />
      <About photo={photos[1] ?? photos[0]} />
      <StatsBand />
      <Academics />
      <Campus tiles={campusTiles} />
      <WhyUs />
      <Notices />
      <Testimonials />
      <Admissions photo={photos[2] ?? photos[0]} />
      <Contact />
    </>
  );
}
