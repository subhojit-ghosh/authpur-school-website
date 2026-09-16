"use client";

import { IMAGE_PRESETS, MAX_UPLOAD_BYTES, THUMB_QUALITY, type ImageKind } from "@/lib/image-types";

/**
 * Resizes and re-encodes a chosen photograph in the browser.
 *
 * The site runs on a serverless host where a native image library cannot be
 * relied on, so the work happens here instead, using the canvas the browser
 * already has. Staff still simply choose a file: it is shrunk to the preset
 * width, saved as WebP where the browser can encode it and JPEG otherwise, and
 * a thumbnail is produced alongside it. The endpoint checks the result before
 * storing it.
 */

export class ImagePrepareError extends Error {}

export type PreparedImage = {
  full: Blob;
  thumb: Blob;
  width: number;
  height: number;
  type: string;
};

type Source = { draw: CanvasImageSource; width: number; height: number; release: () => void };

async function loadImage(file: File): Promise<Source> {
  if (typeof createImageBitmap === "function") {
    try {
      // "from-image" applies the EXIF orientation, so photographs taken on a
      // phone are not stored sideways.
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      return { draw: bitmap, width: bitmap.width, height: bitmap.height, release: () => bitmap.close() };
    } catch {
      // Fall through to the <img> route below.
    }
  }

  const url = URL.createObjectURL(file);
  const img = new Image();
  img.decoding = "async";
  img.src = url;
  try {
    await img.decode();
  } catch {
    URL.revokeObjectURL(url);
    throw new ImagePrepareError(
      "This browser could not read that file. Please save the photo as JPG or PNG and try again.",
    );
  }
  return {
    draw: img,
    width: img.naturalWidth,
    height: img.naturalHeight,
    release: () => URL.revokeObjectURL(url),
  };
}

function encode(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

async function render(source: Source, targetWidth: number, type: string, quality: number) {
  const scale = Math.min(1, targetWidth / source.width);
  const width = Math.max(1, Math.round(source.width * scale));
  const height = Math.max(1, Math.round(source.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new ImagePrepareError("This browser could not prepare the image.");
  context.drawImage(source.draw, 0, 0, width, height);

  let blob = await encode(canvas, type, quality);
  let used = type;
  // Older browsers cannot encode WebP and quietly hand back a PNG instead.
  if (!blob || (type === "image/webp" && blob.type !== "image/webp")) {
    blob = await encode(canvas, "image/jpeg", quality);
    used = "image/jpeg";
  }
  if (!blob) throw new ImagePrepareError("This browser could not prepare the image.");

  return { blob, width, height, type: used };
}

export async function prepareImage(file: File, kind: ImageKind): Promise<PreparedImage> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new ImagePrepareError("That file is larger than 15 MB. Please use a smaller photo.");
  }
  if (file.type && !file.type.startsWith("image/")) {
    throw new ImagePrepareError("Only JPG, PNG and WebP images can be uploaded.");
  }

  const preset = IMAGE_PRESETS[kind];
  const source = await loadImage(file);
  try {
    const full = await render(source, preset.maxWidth, "image/webp", preset.quality);
    const thumb = await render(source, preset.thumbWidth, full.type, THUMB_QUALITY);
    return { full: full.blob, thumb: thumb.blob, width: full.width, height: full.height, type: full.type };
  } finally {
    source.release();
  }
}
