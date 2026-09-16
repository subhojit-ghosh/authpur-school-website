"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { flatDiff, recordAudit } from "@/lib/audit";
import { parseRows } from "@/lib/form-rows";
import { isEmptyRichText, RICH_TEXT_LIMIT, sanitizeRichText } from "@/lib/rich-text";
import { revalidateWholeSite } from "@/lib/revalidate";
import { getHomeContent, getIdentity, getLabsContent, getLeadership, getPageBanners } from "@/lib/page-content";
import {
  CONTENT_KEYS,
  PAGE_BANNER_LABELS,
  type HomeContent,
  type Identity,
  type LabsContent,
  type Leadership,
  type PageBanners,
} from "@/lib/page-content-types";
import { saveSetting } from "@/lib/settings";

export type ContentState = { error?: string; success?: string };

const text = (fd: FormData, name: string, max = 400) => String(fd.get(name) ?? "").trim().slice(0, max);
const long = (fd: FormData, name: string, max = 4000) => String(fd.get(name) ?? "").trim().slice(0, max);
/** Formatted wording from the rich-text editor. Sanitised here, never truncated mid-tag. */
const rich = (fd: FormData, name: string) => sanitizeRichText(String(fd.get(name) ?? ""));

function done(what: string): ContentState {
  revalidateWholeSite();
  revalidatePath("/admin/content", "layout");
  return { success: `Saved. ${what} updated on the website.` };
}

// ------------------------------------------------------------- identity

export async function saveIdentity(_prev: ContentState, formData: FormData): Promise<ContentState> {
  await requireUser();
  const before = await getIdentity();

  const value: Identity = {
    name: text(formData, "name", 160),
    shortName: text(formData, "shortName", 80),
    established: text(formData, "established", 8),
    tagline: text(formData, "tagline", 160),
    motto: text(formData, "motto", 120),
    mottoMeaning: text(formData, "mottoMeaning", 200),
    footerBlurb: rich(formData, "footerBlurb"),
    affiliationLine: text(formData, "affiliationLine", 120),
    trustLine: text(formData, "trustLine", 120),
    footerCopyrightNote: text(formData, "footerCopyrightNote", 200),
    footerExplore: parseRows(formData, "explore", ["label", "href"]),
    footerNavigate: parseRows(formData, "navigate", ["label", "href"]),
  };

  if (!value.name || !value.shortName) return { error: "The school name and short name are both required." };
  if (value.footerExplore.some((l) => !l.label || !l.href) || value.footerNavigate.some((l) => !l.label || !l.href)) {
    return { error: "Every footer link needs both a label and an address." };
  }

  await saveSetting(CONTENT_KEYS.identity, value);
  await recordAudit("Website Text", "updated", "Updated the school identity and footer", {
    details: flatDiff(before, value),
  });
  return done("School identity and footer");
}

// --------------------------------------------------------- page banners

export async function savePageBanners(_prev: ContentState, formData: FormData): Promise<ContentState> {
  await requireUser();
  const before = await getPageBanners();

  const value = { ...before } as PageBanners;
  for (const key of Object.keys(PAGE_BANNER_LABELS) as (keyof PageBanners)[]) {
    value[key] = {
      eyebrow: text(formData, `${key}.eyebrow`, 80),
      title: text(formData, `${key}.title`, 120),
      subtitle: long(formData, `${key}.subtitle`, 500),
    };
    if (!value[key].title) return { error: `“${PAGE_BANNER_LABELS[key]}” needs a title.` };
  }

  await saveSetting(CONTENT_KEYS.pageBanners, value);
  await recordAudit("Website Text", "updated", "Updated the page headings", {
    details: flatDiff(before, value),
  });
  return done("Page headings");
}

// ----------------------------------------------------------- leadership

export async function saveLeadership(_prev: ContentState, formData: FormData): Promise<ContentState> {
  await requireUser();

  const person = (prefix: string) => ({
    name: text(formData, `${prefix}.name`, 120),
    role: text(formData, `${prefix}.role`, 120),
    initials: text(formData, `${prefix}.initials`, 4).toUpperCase(),
    photoTag: text(formData, `${prefix}.photoTag`, 40),
    message: rich(formData, `${prefix}.message`),
  });

  const value: Leadership = { chairman: person("chairman"), principal: person("principal") };
  if (!value.chairman.name || !value.principal.name) return { error: "Both names are required." };
  if (isEmptyRichText(value.chairman.message) || isEmptyRichText(value.principal.message)) {
    return { error: "Both messages are required." };
  }

  const before = await getLeadership();
  await saveSetting(CONTENT_KEYS.leadership, value);
  await recordAudit("Website Text", "updated", "Updated the Chairman's and Principal's messages", {
    details: flatDiff(before, value),
  });
  return done("Leadership messages");
}

// ----------------------------------------------------------------- labs

export async function saveLabs(_prev: ContentState, formData: FormData): Promise<ContentState> {
  await requireUser();

  const rows = parseRows(formData, "labs", ["icon", "name", "blurb", "points"], RICH_TEXT_LIMIT).map((r) => ({
    ...r,
    icon: r.icon.slice(0, 40),
    name: r.name.slice(0, 120),
    blurb: sanitizeRichText(r.blurb),
    points: r.points.slice(0, 2000),
  }));
  if (rows.some((r) => !r.name || isEmptyRichText(r.blurb))) {
    return { error: "Every laboratory needs a name and a description." };
  }

  const value: LabsContent = { items: rows };
  const before = await getLabsContent();
  await saveSetting(CONTENT_KEYS.labs, value);
  await recordAudit("Website Text", "updated", `Updated the laboratories page (${rows.length} laboratories)`, {
    details: flatDiff(before, value),
  });
  return done("Laboratories");
}

// ----------------------------------------------------------------- home

export async function saveHome(_prev: ContentState, formData: FormData): Promise<ContentState> {
  await requireUser();
  const before = await getHomeContent();

  const heading = (prefix: string) => ({
    eyebrow: text(formData, `${prefix}.eyebrow`, 80),
    heading: text(formData, `${prefix}.heading`, 160),
    blurb: long(formData, `${prefix}.blurb`, 600),
  });

  const value: HomeContent = {
    stats: parseRows(formData, "stats", ["value", "label", "hint"]),
    about: {
      ...heading("about"),
      paragraphs: rich(formData, "about.paragraphs"),
      quote: long(formData, "about.quote", 600),
      quoteName: text(formData, "about.quoteName", 120),
      quoteRole: text(formData, "about.quoteRole", 120),
      pillars: parseRows(formData, "pillars", ["icon", "title", "text"], 600),
    },
    academics: {
      ...heading("academics"),
      programmes: parseRows(formData, "programmes", ["title", "grades", "blurb", "points"], 1200),
    },
    whyUs: { ...heading("whyUs"), features: parseRows(formData, "features", ["icon", "title", "text"], 600) },
    campus: { ...heading("campus"), tiles: parseRows(formData, "tiles", ["icon", "label"]) },
    testimonials: {
      ...heading("testimonials"),
      items: parseRows(formData, "testimonials", ["quote", "name", "role"], 800),
    },
    notices: {
      eyebrow: text(formData, "notices.eyebrow", 80),
      heading: text(formData, "notices.heading", 120),
      eventsEyebrow: text(formData, "notices.eventsEyebrow", 80),
      eventsHeading: text(formData, "notices.eventsHeading", 120),
    },
    admissionsCta: { ...heading("admissionsCta"), steps: parseRows(formData, "steps", ["title", "text"], 600) },
    contact: heading("contact"),
  };

  if (!value.about.heading || !value.academics.heading) return { error: "Section headings cannot be empty." };
  if (value.stats.some((s) => !s.value || !s.label)) return { error: "Every statistic needs a number and a label." };
  if (value.testimonials.items.some((t) => !t.quote || !t.name)) {
    return { error: "Every testimonial needs a quote and a name." };
  }

  await saveSetting(CONTENT_KEYS.home, value);
  await recordAudit("Website Text", "updated", "Updated the home page sections", {
    details: flatDiff(before, value),
  });
  return done("Home page sections");
}
