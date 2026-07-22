import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { GalleryGrid } from "@/components/sections/gallery-grid";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photo gallery of campus life, academics, sports and events at Authpur National Model Higher Secondary School.",
};

export default function GalleryPage() {
  return (
    <>
      <PageBanner
        eyebrow="Campus Life"
        title="Gallery"
        subtitle="Moments from our classrooms, laboratories, sports fields and celebrations."
      />
      <section className="py-16 lg:py-24">
        <GalleryGrid />
      </section>
    </>
  );
}
