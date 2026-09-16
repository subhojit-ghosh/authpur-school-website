import {
  chairman,
  features,
  footerExplore,
  footerNavigate,
  labs,
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
} as const;

/** Icon choices offered in the admin forms. Keys map to lucide icons at render time. */
export const FEATURE_ICONS = ["flask", "book", "monitor", "trophy", "palette", "bus"] as const;
export const PILLAR_ICONS = ["eye", "target", "heart"] as const;
export const CAMPUS_ICONS = ["building", "flask", "library", "medal", "music"] as const;
export const LAB_ICONS = ["atom", "flask", "leaf", "monitor", "book"] as const;

export type LinkItem = { label: string; href: string };

// ---------------------------------------------------------------- identity

export type Identity = {
  name: string;
  shortName: string;
  established: string;
  tagline: string;
  motto: string;
  mottoMeaning: string;
  footerBlurb: string;
  affiliationLine: string;
  trustLine: string;
  footerCopyrightNote: string;
  footerExplore: LinkItem[];
  footerNavigate: LinkItem[];
};

export const defaultIdentity: Identity = {
  name: school.name,
  shortName: school.shortName,
  established: String(school.established),
  tagline: school.tagline,
  motto: school.motto,
  mottoMeaning: school.mottoMeaning,
  footerBlurb: "Nurturing curious minds with knowledge, character and service since {year}.",
  affiliationLine: "Affiliated to WBBSE & WBCHSE",
  trustLine: "40+ years of trust",
  footerCopyrightNote: "Affiliated to WBBSE & WBCHSE · Recognised by the Govt. of West Bengal",
  footerExplore: footerExplore.map((l) => ({ ...l })),
  footerNavigate: footerNavigate.map((l) => ({ ...l })),
};

// ------------------------------------------------------------------- home

export type SectionHeading = { eyebrow: string; heading: string; blurb: string };

export type HomeContent = {
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
  campus: SectionHeading & { tiles: { icon: string; label: string }[] };
  testimonials: SectionHeading & { items: { quote: string; name: string; role: string }[] };
  notices: { eyebrow: string; heading: string; eventsEyebrow: string; eventsHeading: string };
  admissionsCta: SectionHeading & { steps: { title: string; text: string }[] };
  contact: SectionHeading;
};

export const defaultHome: HomeContent = {
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
      { icon: "building", label: "Green Campus" },
      { icon: "flask", label: "Science Labs" },
      { icon: "library", label: "Library" },
      { icon: "medal", label: "Sports & Athletics" },
      { icon: "music", label: "Music & Arts" },
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
