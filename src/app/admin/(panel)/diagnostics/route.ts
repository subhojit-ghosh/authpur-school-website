import { getSession } from "@/lib/auth";
import { storageDriverName } from "@/lib/storage";

export const dynamic = "force-dynamic";

/** Reports which storage the site is using and which build is deployed. Signed-in staff only. */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return new Response(JSON.stringify({ error: "Please sign in again." }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      storage: storageDriverName,
      commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local",
      node: process.version,
      platform: `${process.platform}-${process.arch}`,
    }),
    { headers: { "Content-Type": "application/json" } },
  );
}
