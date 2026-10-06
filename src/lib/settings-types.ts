import {
  admissionDates,
  admissionDocuments,
  admissionSteps,
  dailySchedule,
  eligibility,
  feeNote,
  feeStructure,
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

export const GALLERY_CATEGORIES = ["Campus", "Academics", "Sports", "Events"] as const;
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];
export function isGalleryCategory(v: string): v is GalleryCategory {
  return (GALLERY_CATEGORIES as readonly string[]).includes(v);
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

/** A phone can ring only one number, so a tap-to-call link uses the first. */
export function telHref(phone: string) {
  const first = phoneParts(phone)[0] ?? phone;
  return `tel:${first.replace(/[^\d+]/g, "")}`;
}

export function fullAddress(info: SchoolInfo) {
  const a = info.address;
  return `${a.line1}, ${a.line2}, ${a.city} – ${a.pin}`;
}

export function mapQuery(info: SchoolInfo) {
  const a = info.address;
  return `${school.name}, ${a.line1}, ${a.line2}, ${a.state} ${a.pin}`;
}
