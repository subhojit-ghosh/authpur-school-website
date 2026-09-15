import { sql } from "drizzle-orm";
import { bigint, integer, pgTable, serial, text } from "drizzle-orm/pg-core";

/**
 * Admin panel data model (PostgreSQL — Neon in production, embedded PGlite locally).
 * Phase 1: users, sessions.
 * Phase 2: notices, events, enquiries.
 * Phase 3: site_settings, banners, gallery_photos.
 */

/** Timestamps are stored as text (ISO-like) to keep the schema simple and portable. */
const nowText = () => sql`now()::text`;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  passwordHash: text("password_hash").notNull(),
  /** ISO 8601 timestamp of the most recent successful sign-in; null = never. */
  lastLoginAt: text("last_login_at"),
  createdAt: text("created_at").notNull().default(nowText()),
  updatedAt: text("updated_at").notNull().default(nowText()),
});

export const sessions = pgTable("sessions", {
  /** SHA-256 hash of the random token stored in the browser cookie. */
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  /** Unix epoch milliseconds. */
  expiresAt: bigint("expires_at", { mode: "number" }).notNull(),
  createdAt: text("created_at").notNull().default(nowText()),
  userAgent: text("user_agent"),
});

/** Notice board entries shown on the home page, the ticker and /notices. */
export const notices = pgTable("notices", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  /** Calendar date as YYYY-MM-DD. */
  date: text("date").notNull(),
  /** One of: Admissions, Result, Event, Notice. */
  tag: text("tag").notNull(),
  /** Display order; lower numbers appear first. */
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull().default(nowText()),
  updatedAt: text("updated_at").notNull().default(nowText()),
});

/** Upcoming events shown next to the notice board. */
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  /** Calendar date as YYYY-MM-DD. */
  date: text("date").notNull(),
  venue: text("venue").notNull(),
  createdAt: text("created_at").notNull().default(nowText()),
  updatedAt: text("updated_at").notNull().default(nowText()),
});

/** Admission-enquiry form submissions from the public website. */
export const enquiries = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  grade: text("grade"),
  message: text("message"),
  /** ISO 8601 timestamp (UTC). */
  createdAt: text("created_at").notNull(),
  /** ISO 8601 timestamp when a staff member marked it as read; null = new. */
  readAt: text("read_at"),
});

/** Key/value store for editable site content (school info, timings, admissions). Values are JSON. */
export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: text("updated_at").notNull(),
});

/** Home-page hero carousel images. */
export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  thumbUrl: text("thumb_url").notNull(),
  /** Storage keys; null for the original static banners shipped with the site. */
  storageKey: text("storage_key"),
  thumbKey: text("thumb_key"),
  alt: text("alt").notNull().default(""),
  width: integer("width"),
  height: integer("height"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull().default(nowText()),
});

/** Photo gallery. */
export const galleryPhotos = pgTable("gallery_photos", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  thumbUrl: text("thumb_url").notNull(),
  storageKey: text("storage_key"),
  thumbKey: text("thumb_key"),
  caption: text("caption").notNull().default(""),
  /** One of: Campus, Academics, Sports, Events. */
  category: text("category").notNull(),
  width: integer("width"),
  height: integer("height"),
  createdAt: text("created_at").notNull().default(nowText()),
});

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Notice = typeof notices.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Enquiry = typeof enquiries.$inferSelect;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type Banner = typeof banners.$inferSelect;
export type GalleryPhoto = typeof galleryPhotos.$inferSelect;

/**
 * Activity log: who created, changed or deleted what, and when.
 * `userName` is stored alongside the id so entries stay readable after an
 * account is removed.
 */
export const auditLog = pgTable("audit_log", {
  id: serial("id").primaryKey(),
  /** ISO 8601 timestamp (UTC). */
  at: text("at").notNull(),
  userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  userName: text("user_name").notNull(),
  /** created | updated | deleted | reordered | uploaded | signed in | signed out … */
  action: text("action").notNull(),
  /** Which part of the panel: Notice Board, Events, Hero Banner … */
  section: text("section").notNull(),
  /** One human-readable sentence, e.g. 'Added the notice "Sports Day"'. */
  summary: text("summary").notNull(),
  /** Optional JSON with the fields that changed. */
  details: text("details"),
});

export type AuditEntry = typeof auditLog.$inferSelect;
