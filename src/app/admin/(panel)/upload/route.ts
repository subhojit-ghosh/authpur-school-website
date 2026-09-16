import { max } from "drizzle-orm";
import { db } from "@/db";
import { banners, galleryPhotos } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { checkImage, ImageError, makeStorageKeys, type ImageKind } from "@/lib/images";
import { revalidateGallery, revalidateHome } from "@/lib/revalidate";
import { isGalleryCategory } from "@/lib/settings-types";
import { storage } from "@/lib/storage";

export const dynamic = "force-dynamic";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

/**
 * POST /admin/upload — multipart form with:
 *   kind:     "banner" | "gallery"
 *   file:     the resized image, prepared in the browser
 *   thumb:    its thumbnail
 *   width:    pixel width of `file`
 *   height:   pixel height of `file`
 *   category: gallery category (gallery only)
 *   alt:      optional alt text / caption
 */
export async function POST(request: Request) {
  try {
    return await handleUpload(request);
  } catch (err) {
    console.error("Upload failed", err);
    return json({ error: "The upload failed unexpectedly. Please try again." }, 500);
  }
}

const dimension = (form: FormData, name: string) => {
  const value = Number(form.get(name));
  return Number.isFinite(value) && value > 0 && value < 20000 ? Math.round(value) : null;
};

async function handleUpload(request: Request) {
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
  const thumbFile = form.get("thumb");
  if (!(file instanceof File) || !(thumbFile instanceof File)) {
    return json({ error: "No image was received. Please try again." }, 400);
  }

  const category = String(form.get("category") ?? "");
  if (kind === "gallery" && !isGalleryCategory(category)) return json({ error: "Please choose a category." }, 400);

  const text =
    String(form.get("alt") ?? "").trim().slice(0, 160) ||
    file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");

  let image, thumbImage;
  try {
    [image, thumbImage] = await Promise.all([checkImage(file, "image"), checkImage(thumbFile, "thumbnail")]);
  } catch (err) {
    if (err instanceof ImageError) return json({ error: err.message }, 400);
    throw err;
  }

  const width = dimension(form, "width");
  const height = dimension(form, "height");

  const { key, thumbKey } = makeStorageKeys(kind, image.extension);
  let url: string;
  let thumbUrl: string;
  try {
    [url, thumbUrl] = await Promise.all([
      storage.put(key, image.bytes, image.type),
      storage.put(thumbKey, thumbImage.bytes, thumbImage.type),
    ]);
  } catch (err) {
    console.error("Storing the uploaded image failed", err);
    return json({ error: "The image could not be saved. Please try again in a moment." }, 500);
  }

  if (kind === "banner") {
    const [last] = await db.select({ m: max(banners.sortOrder) }).from(banners);
    const inserted = await db
      .insert(banners)
      .values({ url, thumbUrl, storageKey: key, thumbKey, alt: text, width, height, sortOrder: (last?.m ?? -1) + 1 })
      .returning({ id: banners.id });
    await recordAudit("Hero Banner", "uploaded", `Uploaded the banner image “${text}”`, {
      details: { width, height, originalName: file.name },
    });
    revalidateHome();
    return json({ ok: true, id: inserted[0]?.id, url, thumbUrl });
  }

  const inserted = await db
    .insert(galleryPhotos)
    .values({
      url,
      thumbUrl,
      storageKey: key,
      thumbKey,
      caption: text,
      category,
      width,
      height,
      createdAt: new Date().toISOString(),
    })
    .returning({ id: galleryPhotos.id });
  await recordAudit("Photo Gallery", "uploaded", `Uploaded a ${category} photo${text ? ` (“${text}”)` : ""}`, {
    details: { width, height, originalName: file.name },
  });
  revalidateGallery();
  return json({ ok: true, id: inserted[0]?.id, url, thumbUrl });
}
