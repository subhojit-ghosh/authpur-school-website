import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname } from "node:path";
import { Readable } from "node:stream";
import { readStoredFile, safeUploadPath } from "@/lib/storage";

/**
 * Serves uploaded images at /uploads/<key>.
 *
 * Uploads are stored in the database, which is the only place a serverless host
 * can write to. Files put on disk by an earlier build are still served, so
 * nothing uploaded before this change is lost on a machine that kept them.
 * Keys are unique, so the response can be cached forever.
 */

const TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

const CACHE = "public, max-age=31536000, immutable";

export async function GET(_request: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const key = path.map(decodeURIComponent).join("/");
  const type = TYPES[extname(key).toLowerCase()];
  if (!type) return new Response("Not found", { status: 404 });

  const stored = await readStoredFile(key);
  if (stored) {
    return new Response(new Uint8Array(stored.data), {
      headers: {
        "Content-Type": stored.contentType || type,
        "Content-Length": String(stored.size),
        "Cache-Control": CACHE,
      },
    });
  }

  const file = safeUploadPath(key);
  if (!file) return new Response("Not found", { status: 404 });

  let size: number;
  try {
    const s = await stat(file);
    if (!s.isFile()) return new Response("Not found", { status: 404 });
    size = s.size;
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const stream = Readable.toWeb(createReadStream(file)) as ReadableStream;
  return new Response(stream, {
    headers: { "Content-Type": type, "Content-Length": String(size), "Cache-Control": CACHE },
  });
}
