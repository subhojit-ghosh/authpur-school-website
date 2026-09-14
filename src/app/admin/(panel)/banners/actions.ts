"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { banners } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { getBanner, getBanners } from "@/lib/media";
import { revalidateHome } from "@/lib/revalidate";
import { storage } from "@/lib/storage";

function refresh() {
  revalidateHome();
  revalidatePath("/admin");
  revalidatePath("/admin/banners");
}

export async function updateBannerAlt(formData: FormData) {
  await requireUser();
  const id = Number(formData.get("id"));
  const alt = String(formData.get("alt") ?? "").trim().slice(0, 160);
  if (Number.isInteger(id)) await db.update(banners).set({ alt }).where(eq(banners.id, id));
  refresh();
}

export async function moveBanner(formData: FormData) {
  await requireUser();
  const id = Number(formData.get("id"));
  const direction = formData.get("direction") === "up" ? -1 : 1;

  const ordered = await getBanners();
  const index = ordered.findIndex((b) => b.id === id);
  const swapWith = index + direction;
  if (index === -1 || swapWith < 0 || swapWith >= ordered.length) return;

  const ids = ordered.map((b) => b.id);
  [ids[index], ids[swapWith]] = [ids[swapWith], ids[index]];
  await db.transaction(async (tx) => {
    for (const [position, bannerId] of ids.entries()) {
      await tx.update(banners).set({ sortOrder: position }).where(eq(banners.id, bannerId));
    }
  });
  refresh();
}

export async function deleteBanner(formData: FormData) {
  await requireUser();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  const banner = await getBanner(id);
  if (!banner) return;

  await db.delete(banners).where(eq(banners.id, id));
  if (banner.storageKey) await storage.remove(banner.storageKey);
  if (banner.thumbKey) await storage.remove(banner.thumbKey);
  refresh();
}
