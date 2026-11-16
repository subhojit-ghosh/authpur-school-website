import {
  admissionDates,
  admissionDocuments,
  admissionSteps,
  dailySchedule,
  eligibility,
  feeNote,
  feeStructure,
  galleryCategories,
  officeHours,
  school,
  sectionTimings,
  timingsNote,
} from "@/lib/site";

/** Editable site content. Types are shared by server code, client forms and the public site. */

export type SchoolInfo = {
  phone: string;
  admissionsPhone: string;
  email: string;
  address: { line1: string; line2: string; city: string; state: string; pin: string };
  officeHours: string;
};

export type Timings = {
  dailySchedule: { label: string; time: string }[];
  sectionTimings: { section: string; days: string; time: string }[];
  timingsNote: string;
};

export type AdmissionsContent = {
  dates: { event: string; date: string }[];
  eligibility: { level: string; criteria: string }[];
  fees: { head: string; amount: string }[];
  feeNote: string;
  steps: { title: string; text: string }[];
  documents: { item: string }[];
};

export const SETTING_KEYS = {
  schoolInfo: "school_info",
  timings: "timings",
  admissions: "admissions",
  examPattern: "exam_pattern",
  galleryCategories: "gallery_categories",
} as const;

/** Defaults come from the content the site shipped with, so nothing is blank before staff edit it. */
export const defaultSchoolInfo: SchoolInfo = {
  phone: school.phone,
  admissionsPhone: school.admissionsPhone,
  email: school.email,
  address: { ...school.address },
  officeHours,
};

export const defaultTimings: Timings = {
  dailySchedule: dailySchedule.map((d) => ({ ...d })),
  sectionTimings: sectionTimings.map((s) => ({ ...s })),
  timingsNote,
};

export const defaultAdmissions: AdmissionsContent = {
  dates: admissionDates.map((d) => ({ ...d })),
  eligibility: eligibility.map((e) => ({ ...e })),
  fees: feeStructure.map((f) => ({ ...f })),
  feeNote,
  steps: admissionSteps.map((s) => ({ ...s })),
  documents: admissionDocuments.map((item) => ({ item })),
};

/**
 * The sections a photograph can be filed under.
 *
 * The school builds this list themselves in the panel; the list in site.ts is
 * only what the site starts with. A section has no identity beyond its name —
 * that name is what each photograph carries — so renaming one has to take its
 * photographs with it, and a section still holding photographs cannot simply
 * be dropped. Both are the save action's job.
 */
export type GalleryCategories = { items: string[] };

export const defaultGalleryCategories: GalleryCategories = { items: [...galleryCategories] };

export const MAX_GALLERY_CATEGORIES = 10;
export const MAX_CATEGORY_NAME = 24;

/** A typed name reduced to what may be stored: one line, single spaces. */
export function cleanCategoryName(value: string) {
  return value.replace(/\s+/g, " ").trim().slice(0, MAX_CATEGORY_NAME);
}

/** Two names are the same section if they differ only in case or spacing. */
export function sameCategory(a: string, b: string) {
  return cleanCategoryName(a).toLowerCase() === cleanCategoryName(b).toLowerCase();
}

/**
 * The separate numbers inside one field.
 *
 * A school often publishes two or three lines. They are kept in one field,
 * written as "033 2581 4044 / 2580 1092", and shown on the site exactly like
 * that; this splits them apart where only one will do.
 */
export function phoneParts(phone: string): string[] {
  return phone
    .split(/\s*(?:\/|,| or )\s*/i)
    .map((part) => part.trim())
    .filter(Boolean);
}

/**
 * Each number with the digits a phone should actually dial.
 *
 * A school writes its lines the way they appear on a letterhead, sharing the
 * area code: "033 2581 4044 / 2580 1092". Dialling the second as written fails
 * from a mobile. How many digits are missing is simply the difference in
 * length, so those are taken from the front of the first number. A number that
 * already carries its own code, starting with 0 or +, and a pair of equal
 * length such as two mobiles, are left exactly as written.
 */
export function phoneEntries(phone: string): { display: string; dial: string }[] {
  const parts = phoneParts(phone);
  const digitsOf = (value: string) => value.replace(/[^\d+]/g, "");
  const first = digitsOf(parts[0] ?? "");

  // Only a landline has an area code to lend. Strip a leading + country code or
  // a trunk 0 and look at the ten national digits: an Indian mobile starts 6 to
  // 9, so anything else is a landline whose leading digits are its area code.
  const national = first.startsWith("+")
    ? first.slice(1).startsWith("91")
      ? first.slice(3)
      : first.slice(1)
    : first.startsWith("0")
      ? first.slice(1)
      : first;
  const firstCarriesCode =
    (first.startsWith("0") || first.startsWith("+")) && national.length === 10 && !/^[6-9]/.test(national);

  return parts.map((part, index) => {
    const digits = digitsOf(part);
    const missing = first.length - digits.length;
    // Only a local subscriber number, six to eight digits, borrows the code.
    // Ten digits is already a complete number and must be left alone.
    const bare = !digits.startsWith("+") && !digits.startsWith("0");
    const localLength = digits.length >= 6 && digits.length <= 8;
    const shareCode = index > 0 && missing > 0 && localLength && bare && firstCarriesCode;
    return { display: part, dial: shareCode ? first.slice(0, missing) + digits : digits };
  });
}

/** A phone can ring only one number, so a tap-to-call link uses the first. */
export function telHref(phone: string) {
  return `tel:${phoneEntries(phone)[0]?.dial ?? phone.replace(/[^\d+]/g, "")}`;
}

export function fullAddress(info: SchoolInfo) {
  const a = info.address;
  return `${a.line1}, ${a.line2}, ${a.city} – ${a.pin}`;
}

export function mapQuery(info: SchoolInfo) {
  const a = info.address;
  return `${school.name}, ${a.line1}, ${a.line2}, ${a.state} ${a.pin}`;
}
