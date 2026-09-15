import { max } from "drizzle-orm";
import { db } from "@/db";
import { banners, galleryPhotos } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { ImageError, makeStorageKeys, processImage, type ImageKind } from "@/lib/images";
import { revalidateGallery, revalidateHome } from "@/lib/revalidate";
import { isGalleryCategory } from "@/lib/settings-types";
import { storage } from "@/lib/storage";

export const dynamic = "force-dynamic";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

/**
 * POST /admin/upload — multipart form with:
 *   kind:     "banner" | "gallery"
 *   file:     the image
 *   category: gallery category (gallery only)
 *   alt:      optional alt text / caption
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return json({ error: "Please sign in again." }, 401);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: "The upload could not be read. Please try again." }, 400);
  }

  const kind = String(form.get("kind") ?? "") as ImageKind;
  if (kind !== "banner" && kind !== "gallery") return json({ error: "Unknown upload type." }, 400);

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) return json({ error: "No file was received." }, 400);

  const category = String(form.get("category") ?? "");
  if (kind === "gallery" && !isGalleryCategory(category)) return json({ error: "Please choose a category." }, 400);

  const text = String(form.get("alt") ?? "").trim().slice(0, 160) || file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");

  let processed;
  try {
    processed = await processImage(Buffer.from(await file.arrayBuffer()), kind);
  } catch (err) {
    if (err instanceof ImageError) return json({ error: err.message }, 400);
    console.error("Image processing failed", err);
    return json({ error: "The image could not be processed. Please try a different file." }, 500);
  }

  const { key, thumbKey } = makeStorageKeys(kind);
  const [url, thumbUrl] = await Promise.all([
    storage.put(key, processed.full, "image/webp"),
    storage.put(thumbKey, processed.thumb, "image/webp"),
  ]);

  if (kind === "banner") {
    const [last] = await db.select({ m: max(banners.sortOrder) }).from(banners);
    const inserted = await db
      .insert(banners)
      .values({ url, thumbUrl, storageKey: key, thumbKey, alt: text, width: processed.width, height: processed.height, sortOrder: (last?.m ?? -1) + 1 })
      .returning({ id: banners.id });
    await recordAudit("Hero Banner", "uploaded", `Uploaded the banner image “${text}”`, {
      details: { width: processed.width, height: processed.height, originalName: file.name },
    });
    revalidateHome();
    return json({ ok: true, id: inserted[0]?.id, url, thumbUrl });
  }

  const inserted = await db
    .insert(galleryPhotos)
    .values({ url, thumbUrl, storageKey: key, thumbKey, caption: text, category, width: processed.width, height: processed.height, createdAt: new Date().toISOString() })
    .returning({ id: galleryPhotos.id });
  await recordAudit("Photo Gallery", "uploaded", `Uploaded a ${category} photo${text ? ` (“${text}”)` : ""}`, {
    details: { width: processed.width, height: processed.height, originalName: file.name },
  });
  revalidateGallery();
  return json({ ok: true, id: inserted[0]?.id, url, thumbUrl });
}
