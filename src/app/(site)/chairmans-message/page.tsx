import { notFound, redirect } from "next/navigation";
import { getLeaders } from "@/lib/page-content";

/**
 * Kept for links already shared. Sends the visitor to the chairman's entry if
 * the school still has one; with no such person there is nothing truthful to
 * show, so the page is simply not found rather than silently landing them on
 * somebody else. Temporary, so a later rename is not cached for good.
 */
export default async function ChairmansMessageRedirect() {
  const { people } = await getLeaders();
  const target = people.find((p) => p.slug === "chairman" || /chairman/i.test(p.role));
  if (!target) notFound();
  redirect(`/leadership/${target.slug}`);
}
