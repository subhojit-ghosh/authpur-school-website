import { notFound, redirect } from "next/navigation";
import { getLeaders } from "@/lib/page-content";

/**
 * Kept for links already shared. The address is resolved against the list
 * rather than hard-coded, because staff can rename it, and the redirect is
 * temporary so a later rename is not cached in anyone's browser for good.
 */
export default async function PrincipalsMessageRedirect() {
  const { people } = await getLeaders();
  const target = people.find((p) => p.slug === "principal" || /principal/i.test(p.role));
  if (!target) notFound();
  redirect(`/leadership/${target.slug}`);
}
