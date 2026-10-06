import type { MetadataRoute } from "next";
import { getAllEvents, getNotices } from "@/lib/content";
import { getLeaders } from "@/lib/page-content";
import { eventPath, noticePath } from "@/lib/permalinks";
import { siteUrl } from "@/lib/site-url";

/** Rebuilt at least daily, so new notices and events reach search engines. */
export const revalidate = 86400;

/** Every public page, plus each published notice and event. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [notices, events, { people }] = await Promise.all([getNotices(), getAllEvents(), getLeaders()]);

  const pages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/admissions", priority: 0.9, changeFrequency: "monthly" },
    { path: "/admission-enquiry", priority: 0.8, changeFrequency: "yearly" },
    { path: "/examination-pattern", priority: 0.8, changeFrequency: "monthly" },
    { path: "/notices", priority: 0.8, changeFrequency: "weekly" },
    { path: "/school-timings", priority: 0.6, changeFrequency: "yearly" },
    { path: "/labs", priority: 0.6, changeFrequency: "yearly" },
    { path: "/gallery", priority: 0.6, changeFrequency: "monthly" },
  ];

  return [
    ...pages.map((p) => ({ url: `${siteUrl}${p.path}`, changeFrequency: p.changeFrequency, priority: p.priority })),
    ...people.map((p) => ({ url: `${siteUrl}/leadership/${p.slug}`, changeFrequency: "yearly" as const, priority: 0.5 })),
    ...notices.map((n) => ({ url: `${siteUrl}${noticePath(n)}`, lastModified: n.date, priority: 0.4 })),
    ...events
      .filter((e) => e.active)
      .map((e) => ({ url: `${siteUrl}${eventPath(e)}`, lastModified: e.date, priority: 0.4 })),
  ];
}
