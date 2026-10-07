"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { galleryPhotos } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { getGalleryPhoto } from "@/lib/media";
import { revalidateGallery } from "@/lib/revalidate";
import { isGalleryCategory } from "@/lib/settings-types";
import { storage } from "@/lib/storage";

function refresh() {
  revalidateGallery();
  revalidatePath("/admin");
  revalidatePath("/admin/gallery");
}

export type GalleryActionResult = { ok: true } | { ok: false; error: string };

export async function updateGalleryPhoto(formData: FormData): Promise<GalleryActionResult> {
  await requireUser();
  const id = Number(formData.get("id"));
  const caption = String(formData.get("caption") ?? "").trim().slice(0, 160);
  const category = String(formData.get("category") ?? "");
  if (!Number.isInteger(id) || !isGalleryCategory(category)) return { ok: false, error: "Choose a valid category." };
  const before = await getGalleryPhoto(id);
  if (!before) return { ok: false, error: "This photo no longer exists. Refresh the page." };
  await db.update(galleryPhotos).set({ caption, category }).where(eq(galleryPhotos.id, id));
  await recordAudit("Photo Gallery", "updated", `Updated a ${category} photo${caption ? ` (“${caption}”)` : ""}`, {
    details: { caption: { from: before.caption, to: caption }, category: { from: before.category, to: category } },
  });
  refresh();
  return { ok: true };
}

export async function deleteGalleryPhoto(formData: FormData): Promise<GalleryActionResult> {
  await requireUser();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return { ok: false, error: "Could not delete this photo." };

  const photo = await getGalleryPhoto(id);
  if (!photo) return { ok: false, error: "This photo was already deleted. Refresh the page." };

  await db.delete(galleryPhotos).where(eq(galleryPhotos.id, id));
  if (photo.storageKey) await storage.remove(photo.storageKey);
  if (photo.thumbKey) await storage.remove(photo.thumbKey);
  await recordAudit("Photo Gallery", "deleted", `Deleted a ${photo.category} photo${photo.caption ? ` (“${photo.caption}”)` : ""}`);
  refresh();
  return { ok: true };
}
