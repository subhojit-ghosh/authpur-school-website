/**
 * The public address of the website, for links that must be absolute: search
 * engine tags, the sitemap and pages shared on social media.
 *
 * Set NEXT_PUBLIC_SITE_URL once the school's own domain is connected. Until
 * then Vercel's production domain is used, and on a developer's machine the
 * local server.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
  "http://localhost:3000"
).replace(/\/+$/, "");
