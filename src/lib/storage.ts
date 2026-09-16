import "server-only";

import { mkdir, unlink, writeFile } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";
import { del as blobDelete, put as blobPut } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { uploadedFiles } from "@/db/schema";

/**
 * File storage for uploaded images.
 *
 * - Database driver (default): the bytes live in the `uploaded_files` table and
 *   are served by src/app/uploads/[...path]/route.ts at /uploads/<key>. This is
 *   the only option that works out of the box on a serverless host, whose
 *   filesystem is read-only, and it keeps photographs across deployments
 *   without any extra account.
 * - Vercel Blob driver: used automatically when BLOB_READ_WRITE_TOKEN is set
 *   (Vercel adds it when a Blob store is connected to the project). Files are
 *   served from Vercel's CDN; the upload and admin code is unchanged.
 *
 * Files written by an older build still sit in UPLOADS_DIR on a machine with a
 * writable disk, so the serving route falls back to reading from there.
 */

export interface StorageDriver {
  /** Stores the bytes and returns the public URL. */
  put(key: string, data: Buffer, contentType: string): Promise<string>;
  remove(key: string): Promise<void>;
}

export const UPLOADS_DIR = resolve(process.cwd(), process.env.UPLOADS_DIR?.trim() || "./data/uploads");

/** Resolves a storage key to an absolute path inside UPLOADS_DIR, or null if it escapes it. */
export function safeUploadPath(key: string): string | null {
  const full = resolve(UPLOADS_DIR, key);
  return full === UPLOADS_DIR || full.startsWith(UPLOADS_DIR + sep) ? full : null;
}

const localDriver: StorageDriver = {
  async put(key, data) {
    const path = safeUploadPath(key);
    if (!path) throw new Error("Invalid storage key");
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, data);
    return `/uploads/${key}`;
  },
  async remove(key) {
    const path = safeUploadPath(key);
    if (!path) return;
    try {
      await unlink(path);
    } catch {
      // Already gone — nothing to do.
    }
  },
};

const BLOB_PREFIX = "school-site/";

const blobDriver: StorageDriver = {
  async put(key, data, contentType) {
    const blob = await blobPut(BLOB_PREFIX + key, data, {
      access: "public",
      contentType,
      addRandomSuffix: false,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    });
    return blob.url;
  },
  async remove(key) {
    try {
      await blobDelete(BLOB_PREFIX + key);
    } catch {
      // Already gone — nothing to do.
    }
  },
};

const databaseDriver: StorageDriver = {
  async put(key, data, contentType) {
    await db
      .insert(uploadedFiles)
      .values({ key, contentType, data, size: data.byteLength })
      .onConflictDoUpdate({
        target: uploadedFiles.key,
        set: { contentType, data, size: data.byteLength },
      });
    return `/uploads/${key}`;
  },
  async remove(key) {
    await db.delete(uploadedFiles).where(eq(uploadedFiles.key, key));
  },
};

/** Reads a stored file back. Returns null when the key is not in the database. */
export async function readStoredFile(key: string) {
  const [row] = await db
    .select({ data: uploadedFiles.data, contentType: uploadedFiles.contentType, size: uploadedFiles.size })
    .from(uploadedFiles)
    .where(eq(uploadedFiles.key, key))
    .limit(1);
  return row ?? null;
}

export const storageDriverName = process.env.BLOB_READ_WRITE_TOKEN ? "vercel-blob" : "database";

export const storage: StorageDriver = storageDriverName === "vercel-blob" ? blobDriver : databaseDriver;

/** Kept for files written to disk by an earlier build. */
export const legacyLocalDriver = localDriver;
