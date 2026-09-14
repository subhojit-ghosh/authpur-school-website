import "server-only";

import { randomBytes } from "node:crypto";
import sharp, { type Metadata } from "sharp";

/** Upload rules and automatic optimisation for banner and gallery images. */

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 MB per file

const ACCEPTED_FORMATS = new Set(["jpeg", "png", "webp", "heif", "avif", "tiff", "gif"]);

export const IMAGE_PRESETS = {
  banner: { maxWidth: 1920, thumbWidth: 480, quality: 82 },
  gallery: { maxWidth: 1600, thumbWidth: 640, quality: 82 },
} as const;

export type ImageKind = keyof typeof IMAGE_PRESETS;

export type ProcessedImage = {
  full: Buffer;
  thumb: Buffer;
  width: number;
  height: number;
};

export class ImageError extends Error {}

/**
 * Validates the file really is an image, fixes EXIF rotation, resizes it to the
 * preset width and re-encodes both a full-size and a thumbnail WebP.
 */
export async function processImage(input: Buffer, kind: ImageKind): Promise<ProcessedImage> {
  if (input.byteLength > MAX_UPLOAD_BYTES) {
    throw new ImageError("That file is larger than 15 MB. Please use a smaller photo.");
  }

  let meta: Metadata;
  try {
    meta = await sharp(input).metadata();
  } catch {
    throw new ImageError("Only image files (JPG, PNG, WebP or HEIC) can be uploaded.");
  }
  if (!meta.format || !ACCEPTED_FORMATS.has(meta.format)) {
    throw new ImageError("Only image files (JPG, PNG, WebP or HEIC) can be uploaded.");
  }

  const preset = IMAGE_PRESETS[kind];
  const base = sharp(input, { animated: false }).rotate();

  const fullImage = base.clone().resize({ width: preset.maxWidth, withoutEnlargement: true });
  const { data: full, info } = await fullImage.webp({ quality: preset.quality }).toBuffer({ resolveWithObject: true });

  const thumb = await base
    .clone()
    .resize({ width: preset.thumbWidth, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toBuffer();

  return { full, thumb, width: info.width, height: info.height };
}

/** Unique, URL-safe storage keys for an upload and its thumbnail. */
export function makeStorageKeys(kind: ImageKind) {
  const id = `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}`;
  const folder = kind === "banner" ? "banners" : "gallery";
  return { key: `${folder}/${id}.webp`, thumbKey: `${folder}/${id}-thumb.webp` };
}
