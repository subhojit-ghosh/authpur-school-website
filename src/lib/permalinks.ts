/**
 * Addresses for the notice and event pages.
 *
 * A link looks like `/notices/12-admissions-open-for-2026`: the leading number
 * is what the page looks up, and the words after it are only there so the
 * address reads well and search engines can index it. Renaming a notice
 * therefore changes its address without breaking the old one.
 */

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
}

export function noticePath(notice: { id: number; title: string }): string {
  const slug = slugify(notice.title);
  return `/notices/${notice.id}${slug ? `-${slug}` : ""}`;
}

export function eventPath(event: { id: number; title: string }): string {
  const slug = slugify(event.title);
  return `/events/${event.id}${slug ? `-${slug}` : ""}`;
}

/** The id at the front of a slug, or null when the address is not one of ours. */
export function idFromSlug(slug: string): number | null {
  const match = /^(\d+)(?:-|$)/.exec(slug);
  if (!match) return null;
  const id = Number(match[1]);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}
