/** Which delivery phase of the admin panel is currently live. */
export const CURRENT_PHASE = 3;

export type AdminIcon =
  | "dashboard"
  | "bell"
  | "calendar"
  | "inbox"
  | "panel"
  | "images"
  | "graduation"
  | "building"
  | "users"
  | "history"
  | "key";

export type AdminNavItem = {
  href: string;
  label: string;
  short: string;
  description: string;
  icon: AdminIcon;
  /** Phase in which this section becomes functional. */
  phase: 1 | 2 | 3;
};

export const adminNav: AdminNavItem[] = [
  {
    href: "/admin",
    label: "Dashboard",
    short: "Dashboard",
    description: "Overview of recent notices, enquiries and quick links.",
    icon: "dashboard",
    phase: 1,
  },
  {
    href: "/admin/notices",
    label: "Notice Board",
    short: "Notices",
    description: "Add, edit, delete and re-order notices with a date and category.",
    icon: "bell",
    phase: 2,
  },
  {
    href: "/admin/events",
    label: "Events",
    short: "Events",
    description: "Add, edit and delete upcoming events (date, title, venue).",
    icon: "calendar",
    phase: 2,
  },
  {
    href: "/admin/enquiries",
    label: "Enquiry Inbox",
    short: "Enquiries",
    description: "View, search and export admission-enquiry form submissions.",
    icon: "inbox",
    phase: 2,
  },
  {
    href: "/admin/banners",
    label: "Hero Banner",
    short: "Banners",
    description: "Upload, re-order and remove the home-page carousel images.",
    icon: "panel",
    phase: 3,
  },
  {
    href: "/admin/gallery",
    label: "Photo Gallery",
    short: "Gallery",
    description: "Upload, categorise and delete gallery photographs.",
    icon: "images",
    phase: 3,
  },
  {
    href: "/admin/admissions",
    label: "Admissions Content",
    short: "Admissions",
    description: "Edit admission dates, fee structure and eligibility.",
    icon: "graduation",
    phase: 3,
  },
  {
    href: "/admin/school-info",
    label: "School Info",
    short: "School Info",
    description: "Update contact details, address, phone, email and timings.",
    icon: "building",
    phase: 3,
  },
  {
    href: "/admin/users",
    label: "Staff Accounts",
    short: "Staff",
    description: "Add or remove the people who can sign in to this panel.",
    icon: "users",
    phase: 1,
  },
  {
    href: "/admin/activity",
    label: "Activity Log",
    short: "Activity",
    description: "See who created, changed or deleted anything, and when.",
    icon: "history",
    phase: 1,
  },
  {
    href: "/admin/account",
    label: "Account & Password",
    short: "Account",
    description: "Change the staff account password.",
    icon: "key",
    phase: 1,
  },
];

export const phaseWeek: Record<AdminNavItem["phase"], string> = {
  1: "Week 1",
  2: "Week 2",
  3: "Week 3",
};

export function isLive(item: AdminNavItem) {
  return item.phase <= CURRENT_PHASE;
}
