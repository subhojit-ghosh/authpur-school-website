import "server-only";

import { asc, count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { banners, galleryPhotos } from "@/db/schema";

/** Read-side access for banners and gallery photos. */

export async function getBanners() {
  return db.select().from(banners).orderBy(asc(banners.sortOrder), asc(banners.id));
}

export async function getBanner(id: number) {
  const [row] = await db.select().from(banners).where(eq(banners.id, id)).limit(1);
  return row;
}

export async function countBanners() {
  const [row] = await db.select({ n: count() }).from(banners);
  return row?.n ?? 0;
}

export async function getGalleryPhotos(category?: string) {
  const q = db.select().from(galleryPhotos).orderBy(desc(galleryPhotos.createdAt), desc(galleryPhotos.id));
  return category ? q.where(eq(galleryPhotos.category, category)) : q;
}

export async function getGalleryPhoto(id: number) {
  const [row] = await db.select().from(galleryPhotos).where(eq(galleryPhotos.id, id)).limit(1);
  return row;
}

export async function countGalleryPhotos() {
  const [row] = await db.select({ n: count() }).from(galleryPhotos);
  return row?.n ?? 0;
}
