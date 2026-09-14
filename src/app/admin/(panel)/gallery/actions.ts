"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { galleryPhotos } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { getGalleryPhoto } from "@/lib/media";
import { revalidateGallery } from "@/lib/revalidate";
import { isGalleryCategory } from "@/lib/settings-types";
import { storage } from "@/lib/storage";

function refresh() {
  revalidateGallery();
  revalidatePath("/admin");
  revalidatePath("/admin/gallery");
}

export async function updateGalleryPhoto(formData: FormData) {
  await requireUser();
  const id = Number(formData.get("id"));
  const caption = String(formData.get("caption") ?? "").trim().slice(0, 160);
  const category = String(formData.get("category") ?? "");
  if (!Number.isInteger(id) || !isGalleryCategory(category)) return;
  await db.update(galleryPhotos).set({ caption, category }).where(eq(galleryPhotos.id, id));
  refresh();
}

export async function deleteGalleryPhoto(formData: FormData) {
  await requireUser();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  const photo = await getGalleryPhoto(id);
  if (!photo) return;

  await db.delete(galleryPhotos).where(eq(galleryPhotos.id, id));
  if (photo.storageKey) await storage.remove(photo.storageKey);
  if (photo.thumbKey) await storage.remove(photo.thumbKey);
  refresh();
}
