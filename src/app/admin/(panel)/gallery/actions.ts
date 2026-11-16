"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { galleryPhotos } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { flatDiff, recordAudit } from "@/lib/audit";
import { countGalleryPhotosIn, getGalleryPhoto } from "@/lib/media";
import { revalidateGallery } from "@/lib/revalidate";
import { getGalleryCategories, saveSetting } from "@/lib/settings";
import {
  cleanCategoryName,
  MAX_GALLERY_CATEGORIES,
  sameCategory,
  SETTING_KEYS,
} from "@/lib/settings-types";
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
  const categories = await getGalleryCategories();
  if (!Number.isInteger(id) || !categories.includes(category)) {
    return { ok: false, error: "Choose a valid category." };
  }
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

export type CategoriesState = {
  error?: string;
  success?: string;
  /** The list as saved, so the editor can forget the names it started with. */
  items?: string[];
};

/**
 * Rebuilds the list of sections from the editor.
 *
 * A photograph stores the name of its section and nothing else, so a rename is
 * only half done until every photograph filed under the old name is carried
 * across; each row therefore says which name it started as. A section that
 * still holds photographs is not deleted — the save stops and says how many
 * there are, because the alternative is photographs that no filter can reach.
 */
export async function saveGalleryCategories(
  _prev: CategoriesState,
  formData: FormData,
): Promise<CategoriesState> {
  await requireUser();

  let rows: { was: string | null; name: string }[];
  try {
    const parsed: unknown = JSON.parse(String(formData.get("categories") ?? "[]"));
    if (!Array.isArray(parsed)) throw new Error("not a list");
    rows = parsed.map((row) => {
      const source = (row ?? {}) as Record<string, unknown>;
      const was = typeof source.was === "string" ? cleanCategoryName(source.was) : null;
      return { was: was || null, name: cleanCategoryName(String(source.name ?? "")) };
    });
  } catch {
    return { error: "Those sections could not be read. Please reload the page and try again." };
  }

  if (!rows.length) return { error: "Keep at least one section." };
  if (rows.length > MAX_GALLERY_CATEGORIES) {
    return { error: `Keep to ${MAX_GALLERY_CATEGORIES} sections or fewer.` };
  }
  if (rows.some((row) => !row.name)) return { error: "Every section needs a name." };

  const clash = rows.find((row, i) => rows.findIndex((other) => sameCategory(other.name, row.name)) !== i);
  if (clash) return { error: `There is more than one section called “${clash.name}”.` };

  const reserved = rows.find((row) => sameCategory(row.name, "All"));
  if (reserved) return { error: "“All” is the button that shows every photo, so it cannot be a section." };

  const before = await getGalleryCategories();
  const kept = new Set(rows.map((row) => row.was).filter((was): was is string => Boolean(was)));
  const dropped = before.filter((name) => !kept.has(name));

  for (const name of dropped) {
    const used = await countGalleryPhotosIn(name);
    if (used) {
      return {
        error: `“${name}” still holds ${used} photo${used === 1 ? "" : "s"}. Move ${used === 1 ? "it" : "them"} to another section first, then remove it.`,
      };
    }
  }

  // Carry the photographs across before the list changes: if the rename is
  // saved and this fails, their section no longer exists.
  for (const row of rows) {
    if (row.was && row.was !== row.name) {
      await db.update(galleryPhotos).set({ category: row.name }).where(eq(galleryPhotos.category, row.was));
    }
  }

  const value = { items: rows.map((row) => row.name) };
  await saveSetting(SETTING_KEYS.galleryCategories, value);
  await recordAudit("Photo Gallery", "updated", `Updated the gallery sections (${value.items.length})`, {
    details: flatDiff({ items: before }, value),
  });
  refresh();
  return { success: "Saved. The gallery sections have been updated.", items: value.items };
}
