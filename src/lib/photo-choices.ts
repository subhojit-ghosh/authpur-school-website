import "server-only";

import { getBanners, getGalleryPhotos } from "@/lib/media";

/** A photograph that a section of the website can be pointed at. */
export type PhotoChoice = {
  /** Stored in content settings, e.g. "gallery:12" or "banner:3". */
  ref: string;
  url: string;
  thumbUrl: string;
  alt: string;
  /** How the photo is named in the admin panel's picker. */
  label: string;
};

/**
 * Every photograph staff can choose from: the gallery first, then the banner
 * photos. A reference names the table and the row, so deleting a photo leaves
 * a reference that simply no longer resolves, and the page picks another.
 */
export async function getPhotoChoices(): Promise<PhotoChoice[]> {
  const [gallery, banners] = await Promise.all([getGalleryPhotos(), getBanners()]);
  return [
    ...gallery.map((g) => ({
      ref: `gallery:${g.id}`,
      url: g.url,
      thumbUrl: g.thumbUrl,
      alt: g.caption,
      label: `Gallery (${g.category}): ${g.caption || "untitled photo"}`,
    })),
    ...banners.map((b, i) => ({
      ref: `banner:${b.id}`,
      url: b.url,
      thumbUrl: b.thumbUrl,
      alt: b.alt,
      label: `Banner photo ${i + 1}${b.alt ? `: ${b.alt}` : ""}`,
    })),
  ];
}
