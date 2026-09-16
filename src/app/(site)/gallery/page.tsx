import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { getPageBanners } from "@/lib/page-content";
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
  const [rows, banners] = await Promise.all([getGalleryPhotos(), getPageBanners()]);
  const photos = rows.map((p) => ({ id: p.id, url: p.url, thumbUrl: p.thumbUrl, caption: p.caption, category: p.category }));
  const banner = banners.gallery;
  return (
    <>
      <PageBanner eyebrow={banner.eyebrow} title={banner.title} subtitle={banner.subtitle} />
      <section className="py-16 lg:py-24">
        <GalleryGrid photos={photos} />
      </section>
    </>
  );
}
