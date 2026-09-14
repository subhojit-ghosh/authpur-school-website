/** Constants shared between the public site, the admin panel and its forms. */

export const NOTICE_TAGS = ["Admissions", "Result", "Event", "Notice"] as const;
export type NoticeTag = (typeof NOTICE_TAGS)[number];

export function isNoticeTag(value: string): value is NoticeTag {
  return (NOTICE_TAGS as readonly string[]).includes(value);
}

/** Tailwind classes for the coloured category pill, used on the site and in the panel. */
export const noticeTagStyles: Record<NoticeTag, string> = {
  Admissions: "bg-gold-soft text-gold-foreground",
  Result: "bg-[oklch(0.92_0.05_150)] text-[oklch(0.35_0.1_150)]",
  Event: "bg-accent text-brand",
  Notice: "bg-secondary text-secondary-foreground",
};

export function noticeTagClass(tag: string) {
  return isNoticeTag(tag) ? noticeTagStyles[tag] : "bg-secondary text-secondary-foreground";
}

export const LIMITS = {
  noticeTitle: 200,
  eventTitle: 150,
  eventVenue: 120,
  enquiryName: 100,
  enquiryPhone: 20,
  enquiryEmail: 120,
  enquiryGrade: 100,
  enquiryMessage: 2000,
} as const;
