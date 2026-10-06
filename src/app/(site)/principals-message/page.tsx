import { permanentRedirect } from "next/navigation";

/**
 * The leadership pages moved under /leadership/<role>. This address was in the
 * menu and may be in someone's bookmarks, so it is kept and forwarded.
 */
export default function PrincipalsMessageRedirect() {
  permanentRedirect("/leadership/principal");
}
