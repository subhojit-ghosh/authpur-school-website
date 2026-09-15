import sanitizeHtml from "sanitize-html";

/**
 * Rich-text descriptions are authored in the admin panel and rendered on the
 * public site, so the HTML is sanitised on the way in with a strict allowlist.
 * Safe to import from both server and client code.
 */

export const RICH_TEXT_LIMIT = 8000;

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ["p", "br", "strong", "b", "em", "i", "u", "s", "ul", "ol", "li", "a", "h3", "h4", "blockquote"],
  allowedAttributes: { a: ["href", "target", "rel"] },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  transformTags: {
    // Links always open safely in a new tab.
    a: (tagName, attribs) => ({
      tagName,
      attribs: { ...attribs, target: "_blank", rel: "noopener noreferrer nofollow" },
    }),
    b: "strong",
    i: "em",
  },
  nonTextTags: ["style", "script", "textarea", "option", "noscript"],
};

/** Cleans editor HTML before it is stored. Returns "" when there is no real content. */
export function sanitizeRichText(html: string): string {
  const cleaned = sanitizeHtml(html.slice(0, RICH_TEXT_LIMIT * 2), OPTIONS).trim();
  return isEmptyRichText(cleaned) ? "" : cleaned.slice(0, RICH_TEXT_LIMIT);
}

/** True when the HTML has no text and no list items — e.g. "<p></p>" from an empty editor. */
export function isEmptyRichText(html: string): boolean {
  if (!html) return true;
  const withoutTags = html
    .replace(/<(br|hr)\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .trim();
  return withoutTags.length === 0;
}

/** Plain-text version, for previews and search. */
export function richTextToPlain(html: string, max = 200): string {
  const text = html
    .replace(/<\/(p|li|h3|h4|blockquote)>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}
