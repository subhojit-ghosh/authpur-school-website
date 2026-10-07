import {
  chairman,
  features,
  footerExplore,
  footerNavigate,
  labs,
  mainNav,
  principal,
  programmes,
  school,
  stats,
  testimonials,
} from "@/lib/site";

/**
 * Editable wording for the public website.
 *
 * Every group is stored as one JSON row in `site_settings`; the defaults below
 * are the copy the site shipped with, so nothing is ever blank before staff
 * edit it. Client-safe: forms import the types and the icon lists from here.
 */

export const CONTENT_KEYS = {
  identity: "identity",
  home: "home_content",
  leadership: "leadership",
  pageBanners: "page_banners",
  labs: "labs_content",
  navigation: "navigation",
  /** The leaders list. A new key: the old `leadership` row is left untouched. */
  leaders: "leaders",
} as const;

/** Icon choices offered in the admin forms. Keys map to lucide icons at render time. */
export const FEATURE_ICONS = ["flask", "book", "monitor", "trophy", "palette", "bus"] as const;
export const PILLAR_ICONS = ["eye", "target", "heart"] as const;
/** Icons for the quick links over the foot of the home page banner. */
export const QUICK_LINK_ICONS = ["apply", "notices", "timings", "gallery", "events", "phone", "book", "map"] as const;
/** The banner has room for four quick links in a row. */
export const MAX_QUICK_LINKS = 4;
export const LAB_ICONS = ["atom", "flask", "leaf", "monitor", "book"] as const;
/** Icons offered for the round buttons at the bottom of the footer. */
export const SOCIAL_ICONS = [
  "facebook",
  "youtube",
  "whatsapp",
  "website",
  "share",
  "photos",
  "video",
  "message",
  "email",
] as const;

/** How each choice is named in the admin panel's dropdown. */
export const SOCIAL_ICON_LABELS: Record<(typeof SOCIAL_ICONS)[number], string> = {
  facebook: "Facebook logo",
  youtube: "YouTube logo",
  whatsapp: "WhatsApp logo",
  website: "Globe (any website)",
  share: "Share",
  photos: "Camera",
  video: "Video",
  message: "Speech bubble",
  email: "Email",
};

export type LinkItem = { label: string; href: string };

// -------------------------------------------------------------- navigation

/** One entry in a dropdown. The description is the small grey line under the label. */
export type MenuChild = { label: string; href: string; desc: string };

/**
 * A top-level header menu entry. With no dropdown links it is a plain link and
 * uses `href`; with one or more it becomes a dropdown and `href` is ignored.
 */
export type MenuItem = { label: string; href: string; children: MenuChild[] };

export type Navigation = {
  items: MenuItem[];
  /** The gold button at the right of the header. */
  applyLabel: string;
  applyHref: string;
  /** The same button inside the phone menu, where there is room for more words. */
  applyLabelMobile: string;
};

export const MAX_MENU_ITEMS = 12;
export const MAX_MENU_CHILDREN = 10;

export const defaultNavigation: Navigation = {
  items: mainNav.map((item) => ({
    label: item.label,
    href: item.href ?? "",
    children: (item.children ?? []).map((child) => ({
      label: child.label,
      href: child.href,
      desc: child.desc ?? "",
    })),
  })),
  applyLabel: "Apply Now",
  applyHref: "/admissions",
  applyLabelMobile: "Apply for Admission",
};

/**
 * Addresses staff may enter. A path stays on the site; a full web address, an
 * email link or a telephone link leaves it. Anything else is rejected, so a
 * menu can never carry a script address.
 */
export function isAllowedHref(href: string): boolean {
  const value = href.trim();
  if (!value) return false;
  if (value.startsWith("/") || value.startsWith("#")) return true;
  return /^(https?:\/\/|mailto:|tel:)/i.test(value);
}

// ---------------------------------------------------------------- identity

/** One round button at the bottom of the footer. */
export type SocialLink = { icon: string; label: string; href: string };

export type Identity = {
  name: string;
  shortName: string;
  /** The name as set beside the crest in the header and footer: large on top. */
  crestName: string;
  /** The smaller line under it. {year} becomes the established year. */
  crestLine: string;
  established: string;
  tagline: string;
  motto: string;
  mottoMeaning: string;
  footerBlurb: string;
  affiliationLine: string;
  trustLine: string;
  footerCopyrightNote: string;
  /** The three gold column headings in the footer. */
  footerExploreHeading: string;
  footerNavigateHeading: string;
  footerContactHeading: string;
  /** The wording after the year in the copyright line. */
  footerRightsNote: string;
  footerExplore: LinkItem[];
  footerNavigate: LinkItem[];
  /** The round buttons at the foot of the page; the row is hidden when there are none. */
  footerSocial: SocialLink[];
};

export const defaultIdentity: Identity = {
  name: school.name,
  shortName: school.shortName,
  crestName: "Authpur National Model",
  crestLine: "Higher Secondary School · Est. {year}",
  established: String(school.established),
  tagline: school.tagline,
  motto: school.motto,
  mottoMeaning: school.mottoMeaning,
  footerBlurb: "Nurturing curious minds with knowledge, character and service since {year}.",
  affiliationLine: "Affiliated to CISCE (ICSE & ISC), code WB173",
  trustLine: "40+ years of trust",
  footerCopyrightNote: "Affiliated to the Council for the Indian School Certificate Examinations (CISCE), New Delhi. Affiliation code WB173.",
  footerExploreHeading: "Explore",
  footerNavigateHeading: "Navigate",
  footerContactHeading: "Reach Us",
  footerRightsNote: "All rights reserved.",
  footerExplore: footerExplore.map((l) => ({ ...l })),
  footerNavigate: footerNavigate.map((l) => ({ ...l })),
  // The school's pages as linked from its previous website.
  footerSocial: [
    { icon: "facebook", label: "Facebook", href: "https://www.facebook.com/authpurnationalmodelschool/" },
    { icon: "youtube", label: "YouTube", href: "https://www.youtube.com/channel/UCbMbdtNf7FgCOYCJI6qvaEg" },
    { icon: "whatsapp", label: "WhatsApp", href: "https://wa.me/918274887550" },
  ],
};

// ------------------------------------------------------------------- home

export type SectionHeading = { eyebrow: string; heading: string; blurb: string };

/** One of the coloured links lifted over the foot of the home page banner. */
export type QuickLink = { icon: string; label: string; text: string; href: string };

/**
 * A campus tile's photograph is a reference such as "gallery:12" or
 * "banner:3", resolved against the photos that exist when the page renders.
 * Empty, or pointing at a deleted photo, means "pick one automatically".
 */
export type CampusTile = { label: string; photo?: string };

export type HomeContent = {
  quickLinks: QuickLink[];
  stats: { value: string; label: string; hint: string }[];
  about: SectionHeading & {
    paragraphs: string;
    quote: string;
    quoteName: string;
    quoteRole: string;
    pillars: { icon: string; title: string; text: string }[];
  };
  academics: SectionHeading & {
    programmes: { title: string; grades: string; blurb: string; points: string }[];
  };
  whyUs: SectionHeading & { features: { icon: string; title: string; text: string }[] };
  campus: SectionHeading & { tiles: CampusTile[] };
  testimonials: SectionHeading & { items: { quote: string; name: string; role: string }[] };
  notices: { eyebrow: string; heading: string; eventsEyebrow: string; eventsHeading: string };
  admissionsCta: SectionHeading & { steps: { title: string; text: string }[] };
  contact: SectionHeading;
};

export const defaultHome: HomeContent = {
  quickLinks: [
    {
      icon: "apply",
      label: "Apply for admission",
      text: "Send an enquiry for the coming session.",
      href: "/admission-enquiry",
    },
    { icon: "notices", label: "Notice board", text: "Circulars, results and holidays.", href: "/notices" },
    { icon: "timings", label: "School timings", text: "Class hours for every section.", href: "/school-timings" },
    { icon: "gallery", label: "Photo gallery", text: "Life on campus through the year.", href: "/gallery" },
  ],
  stats: stats.map((s) => ({ ...s })),
  about: {
    eyebrow: "Welcome to our school",
    heading: "A tradition of learning, a future full of possibility",
    blurb: "",
    paragraphs: [
      "Since {year}, {shortName} has been a trusted name in Shyamnagar. What began as a small neighbourhood school has grown into a vibrant community of over 2,400 students — yet our promise remains unchanged: to know each child by name and to help them flourish.",
      "We believe education is more than examinations. It is curiosity in the classroom, courage on the sports field, and kindness in the corridors.",
    ].join("\n\n"),
    quote:
      "Our purpose is not merely to fill minds, but to light them. Every student who walks through our gates carries our hope for a brighter tomorrow.",
    quoteName: principal.name,
    quoteRole: principal.role,
    pillars: [
      {
        icon: "eye",
        title: "Our Vision",
        text: "To be a centre of learning where every child discovers their potential and grows into a responsible, compassionate citizen.",
      },
      {
        icon: "target",
        title: "Our Mission",
        text: "To deliver quality education that balances academic rigour with values, creativity and physical well-being.",
      },
      {
        icon: "heart",
        title: "Our Values",
        text: "Integrity, discipline, empathy and service — the foundations on which we build character for life.",
      },
    ],
  },
  academics: {
    eyebrow: "Academics",
    heading: "A continuous journey from first steps to final year",
    blurb:
      "Our curriculum is designed as one connected path — each stage building on the last, so students grow with confidence at every level.",
    programmes: programmes.map((p) => ({
      title: p.title,
      grades: p.grades,
      blurb: p.blurb,
      points: p.points.join("\n"),
    })),
  },
  whyUs: {
    eyebrow: "Why families choose us",
    heading: "Everything a growing child needs — under one roof",
    blurb: "Facilities and care thoughtfully built around learning, safety and the joy of childhood.",
    features: features.map((f) => ({ icon: f.icon, title: f.title, text: f.text })),
  },
  campus: {
    eyebrow: "Campus life",
    heading: "A campus that comes alive every single day",
    blurb: "Beyond the classroom, students explore, create, compete and celebrate together.",
    tiles: [
      { label: "Green Campus", photo: "" },
      { label: "Science Labs", photo: "" },
      { label: "Library", photo: "" },
      { label: "Sports & Athletics", photo: "" },
      { label: "Music & Arts", photo: "" },
    ],
  },
  testimonials: {
    eyebrow: "In their words",
    heading: "Loved by students, trusted by parents",
    blurb: "",
    items: testimonials.map((t) => ({ quote: t.quote, name: t.name, role: t.role })),
  },
  notices: {
    eyebrow: "Stay informed",
    heading: "Notice Board",
    eventsEyebrow: "What's next",
    eventsHeading: "Upcoming Events",
  },
  admissionsCta: {
    eyebrow: "Admissions 2026–27",
    heading: "Give your child a school that feels like a second home",
    blurb:
      "Applications are now open for Nursery through Class XI. Seats are limited — begin your child's journey with us today.",
    steps: [
      { title: "Enquire & collect form", text: "Visit the school office or request a form online." },
      { title: "Interaction", text: "A friendly meeting with the child and parents." },
      { title: "Confirm admission", text: "Complete the formalities and welcome aboard." },
    ],
  },
  contact: {
    eyebrow: "Get in touch",
    heading: "We'd love to hear from you",
    blurb: "Have a question about admissions or our programmes? Reach out and our team will be happy to help.",
  },
};

// -------------------------------------------------------------- leadership

export type Person = { name: string; role: string; initials: string; photoTag: string; message: string };
export type Leadership = { chairman: Person; principal: Person };

// ---------------------------------------------------------------- leaders

/**
 * One person on a leadership page.
 *
 * `slug` is the last part of the address, so /leadership/principal. It is set
 * when the person is added and then left alone, because changing it breaks any
 * link already shared.
 */
export type Leader = {
  slug: string;
  name: string;
  /** Shown under the name, e.g. "Founder". */
  role: string;
  /** The heading at the top of the page, e.g. "Founder's Message". */
  pageTitle: string;
  /** The line under that heading. */
  pageIntro: string;
  /** Stands in for the photograph when there is none. */
  initials: string;
  /** Address of the uploaded photograph; empty means show the initials. */
  photoUrl: string;
  message: string;
};

export type Leaders = { people: Leader[] };

export const MAX_LEADERS = 8;

export const defaultLeaders: Leaders = {
  people: [
    {
      slug: "founder",
      name: "",
      role: "Founder",
      pageTitle: "Founder's Message",
      pageIntro: "A few words from the founder of our school.",
      initials: "",
      photoUrl: "",
      message: "",
    },
    {
      slug: "secretary",
      name: "",
      role: "Secretary",
      pageTitle: "Secretary's Message",
      pageIntro: "A message from the Secretary of our Governing Body.",
      initials: "",
      photoUrl: "",
      message: "",
    },
    {
      slug: "principal",
      name: principal.name,
      role: principal.role,
      pageTitle: "Principal's Message",
      pageIntro: "A warm welcome from our Principal, on the values and everyday care that shape life at our school.",
      initials: principal.initials,
      photoUrl: "",
      message: principal.message.join("\n\n"),
    },
  ],
};

/** A slug made from a person's role, used when a new person is added. */
export function leaderSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    // Trimming again after the cut keeps this idempotent: the server re-runs it
    // on what the browser sent and must arrive at the same string.
    .replace(/-+$/g, "");
}

/**
 * Carries the two people from the older shape into the list.
 *
 * The site used to hold exactly a chairman and a principal. Their wording is
 * kept rather than thrown away: each becomes an entry in the list, after the
 * empty Founder and Secretary slots the school asked for.
 */
export function leadersFromLegacy(old: Leadership | undefined): Leaders {
  if (!old?.principal?.name && !old?.chairman?.name) return defaultLeaders;

  const carried: Leader[] = [];
  const add = (person: Person | undefined, slug: string) => {
    if (!person?.name) return;
    carried.push({
      slug,
      name: person.name,
      role: person.role,
      pageTitle: `${person.role.split(",")[0].trim()}'s Message`,
      pageIntro: "",
      initials: person.initials,
      photoUrl: "",
      message: person.message,
    });
  };

  const people = defaultLeaders.people.map((p) => ({ ...p }));
  const principalSlot = people.find((p) => p.slug === "principal");
  if (principalSlot && old?.principal?.name) {
    principalSlot.name = old.principal.name;
    principalSlot.role = old.principal.role;
    principalSlot.initials = old.principal.initials;
    principalSlot.message = old.principal.message;
  }
  add(old?.chairman, "chairman");
  return { people: [...people, ...carried] };
}

export const defaultLeadership: Leadership = {
  chairman: {
    name: chairman.name,
    role: chairman.role,
    initials: chairman.initials,
    photoTag: chairman.photoTag,
    message: chairman.message.join("\n\n"),
  },
  principal: {
    name: principal.name,
    role: principal.role,
    initials: principal.initials,
    photoTag: principal.photoTag,
    message: principal.message.join("\n\n"),
  },
};

// ------------------------------------------------------------ page banners

export type Banner = { eyebrow: string; title: string; subtitle: string };
export type PageBanners = {
  admissions: Banner;
  admissionEnquiry: Banner;
  notices: Banner;
  gallery: Banner;
  schoolTimings: Banner;
  labs: Banner;
  examPattern: Banner;
  chairmansMessage: Banner;
  principalsMessage: Banner;
};

export const PAGE_BANNER_LABELS: Record<keyof PageBanners, string> = {
  admissions: "Admission",
  admissionEnquiry: "Admission Enquiry",
  notices: "Notice Board",
  gallery: "Gallery",
  schoolTimings: "School Timings",
  labs: "Laboratories",
  examPattern: "Examination Pattern",
  chairmansMessage: "Chairman's Message",
  principalsMessage: "Principal's Message",
};

export const defaultPageBanners: PageBanners = {
  admissions: {
    eyebrow: "Admissions 2026–27",
    title: "Admission",
    subtitle: "Everything you need to begin your child's journey with us — the process, dates, eligibility and fees.",
  },
  admissionEnquiry: {
    eyebrow: "Admissions 2026–27",
    title: "Admission Enquiry",
    subtitle: "Tell us a little about your child and we'll get back to you with everything you need to know.",
  },
  notices: {
    eyebrow: "Stay informed",
    title: "Notice Board",
    subtitle: "Announcements, circulars and upcoming events — everything happening at our school, in one place.",
  },
  gallery: {
    eyebrow: "Campus Life",
    title: "Gallery",
    subtitle: "Moments from our classrooms, laboratories, sports fields and celebrations.",
  },
  schoolTimings: {
    eyebrow: "Academics",
    title: "School Timings",
    subtitle: "Our daily rhythm — from the morning assembly to the final bell — and section-wise hours.",
  },
  labs: {
    eyebrow: "Facilities",
    title: "Laboratories",
    subtitle: "Well-equipped laboratories where lessons become experiments and ideas take shape.",
  },
  examPattern: {
    eyebrow: "Academics",
    title: "Examination Pattern",
    subtitle: "How and when each class is assessed through the session, how the marks are made up, and what it takes to pass.",
  },
  chairmansMessage: {
    eyebrow: "Leadership",
    title: "Chairman's Message",
    subtitle: "A few words from the Chairman of our Governing Body on the vision that guides our school.",
  },
  principalsMessage: {
    eyebrow: "Leadership",
    title: "Principal's Message",
    subtitle: "A warm welcome from our Principal, on the values and everyday care that shape life at our school.",
  },
};

// ------------------------------------------------------------------- labs

export type LabsContent = { items: { icon: string; name: string; blurb: string; points: string }[] };

export const defaultLabs: LabsContent = {
  items: labs.map((l) => ({
    icon: l.icon,
    name: l.name,
    blurb: l.text,
    points: [...l.highlights].join("\n"),
  })),
};

// ----------------------------------------------------------------- helpers

/** The two lines set beside the crest, with the fallbacks filled in. */
export function crestLines(identity: Identity) {
  return {
    name: identity.crestName.trim() || identity.name,
    line: identity.crestLine.replaceAll("{year}", identity.established).trim(),
  };
}

/** Replaces {year} and {shortName} placeholders so copy can mention them. */
export function fillPlaceholders(text: string, vars: { year: string; shortName: string; name: string }) {
  return text
    .replaceAll("{year}", vars.year)
    .replaceAll("{shortName}", vars.shortName)
    .replaceAll("{name}", vars.name);
}

export function toLines(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}
