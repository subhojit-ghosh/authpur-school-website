import { permanentRedirect } from "next/navigation";
import { getLeaders } from "@/lib/page-content";

/**
 * Kept for links already shared. The chairman's entry is carried into the
 * leaders list, so this forwards to whichever address it now has; if that
 * person has been removed it falls back to the first person on the list.
 */
export default async function ChairmansMessageRedirect() {
  const { people } = await getLeaders();
  const target = people.find((p) => p.slug === "chairman") ?? people[0];
  permanentRedirect(target ? `/leadership/${target.slug}` : "/");
}
