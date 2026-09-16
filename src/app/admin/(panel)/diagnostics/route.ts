import { getSession } from "@/lib/auth";
import { storageDriverName } from "@/lib/storage";

export const dynamic = "force-dynamic";

/**
 * Reports whether the pieces an upload depends on are usable on this host.
 *
 * The image library is loaded here on demand rather than at the top of the
 * file, so a missing native binary shows up as a readable message instead of
 * stopping this endpoint from starting at all.
 */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return new Response(JSON.stringify({ error: "Please sign in again." }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let sharpStatus: string;
  try {
    const sharp = (await import("sharp")).default;
    await sharp({ create: { width: 4, height: 4, channels: 3, background: "#000" } })
      .webp()
      .toBuffer();
    sharpStatus = `working (libvips ${sharp.versions?.vips ?? "?"})`;
  } catch (err) {
    sharpStatus = `unavailable: ${(err as Error)?.message ?? String(err)}`;
  }

  return new Response(
    JSON.stringify({
      storage: storageDriverName,
      sharp: sharpStatus,
      commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local",
      node: process.version,
      platform: `${process.platform}-${process.arch}`,
    }),
    { headers: { "Content-Type": "application/json" } },
  );
}
