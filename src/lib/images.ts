import "server-only";

import { randomBytes } from "node:crypto";
import { MAX_STORED_BYTES, STORED_TYPES, sniffImageType, type ImageKind } from "@/lib/image-types";

/**
 * Server-side checks for an uploaded image.
 *
 * The resizing and re-encoding happen in the browser (see lib/image-client),
 * because the serverless host this site runs on cannot be relied on to load a
 * native image library. What arrives here is therefore treated as untrusted:
 * the leading bytes must match a format the site serves, and the size must be
 * within the stored limit.
 */

export class ImageError extends Error {}

export type CheckedImage = { bytes: Buffer; type: string; extension: string };

export async function checkImage(file: File, label: string): Promise<CheckedImage> {
  if (file.size === 0) throw new ImageError(`No ${label} was received. Please try again.`);
  if (file.size > MAX_STORED_BYTES) throw new ImageError("That photo is too large even after resizing.");

  const bytes = Buffer.from(await file.arrayBuffer());
  const type = sniffImageType(bytes);
  if (!type) throw new ImageError("Only JPG, PNG and WebP images can be uploaded.");

  return { bytes, type, extension: STORED_TYPES[type] };
}

/** Unique, URL-safe storage keys for an upload and its thumbnail. */
export function makeStorageKeys(kind: ImageKind, extension: string) {
  const id = `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}`;
  const folder = kind === "banner" ? "banners" : "gallery";
  return { key: `${folder}/${id}.${extension}`, thumbKey: `${folder}/${id}-thumb.${extension}` };
}

export type { ImageKind };
