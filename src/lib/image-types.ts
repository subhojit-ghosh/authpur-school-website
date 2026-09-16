/** Upload rules shared by the browser, the upload endpoint and the admin forms. */

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 MB per chosen file
/** A prepared image is already resized and re-encoded, so it is far smaller than the original. */
export const MAX_STORED_BYTES = 6 * 1024 * 1024;

export const IMAGE_PRESETS = {
  banner: { maxWidth: 1920, thumbWidth: 480, quality: 0.82 },
  gallery: { maxWidth: 1600, thumbWidth: 640, quality: 0.82 },
} as const;

export type ImageKind = keyof typeof IMAGE_PRESETS;

export const THUMB_QUALITY = 0.78;

/** Formats the browser may produce, and the file extension each is stored under. */
export const STORED_TYPES: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
};

/**
 * Checks the leading bytes really belong to one of the accepted formats, so a
 * renamed file cannot be stored and served as an image.
 */
export function sniffImageType(bytes: Uint8Array): string | null {
  if (bytes.length < 12) return null;
  const ascii = (from: number, to: number) => String.fromCharCode(...bytes.subarray(from, to));

  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "image/webp";
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes[0] === 0x89 && ascii(1, 4) === "PNG") return "image/png";
  return null;
}
