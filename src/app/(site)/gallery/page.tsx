import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { GalleryGrid } from "@/components/sections/gallery-grid";
import { getGalleryPhotos } from "@/lib/media";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photo gallery of campus life, academics, sports and events at Authpur National Model Higher Secondary School.",
};

/** Re-rendered on demand when staff upload or delete photos. */
export const revalidate = 3600;

export default async function GalleryPage() {
  const photos = (await getGalleryPhotos()).map((p) => ({ id: p.id, url: p.url, thumbUrl: p.thumbUrl, caption: p.caption, category: p.category }));
  return (
    <>
      <PageBanner
        eyebrow="Campus Life"
        title="Gallery"
        subtitle="Moments from our classrooms, laboratories, sports fields and celebrations."
      />
      <section className="py-16 lg:py-24">
        <GalleryGrid photos={photos} />
      </section>
    </>
  );
}
