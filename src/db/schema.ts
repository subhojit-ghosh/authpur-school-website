import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Admin panel data model.
 * Phase 1: users, sessions.
 * Phase 2: notices, events, enquiries.
 * Phase 3 will add banners, gallery, admissions content and school-info settings.
 */

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const sessions = sqliteTable("sessions", {
  /** SHA-256 hash of the random token stored in the browser cookie. */
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  /** Unix epoch milliseconds. */
  expiresAt: integer("expires_at").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  userAgent: text("user_agent"),
});

/** Notice board entries shown on the home page, the ticker and /notices. */
export const notices = sqliteTable("notices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  /** Calendar date as YYYY-MM-DD. */
  date: text("date").notNull(),
  /** One of: Admissions, Result, Event, Notice. */
  tag: text("tag").notNull(),
  /** Display order; lower numbers appear first. */
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

/** Upcoming events shown next to the notice board. */
export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  /** Calendar date as YYYY-MM-DD. */
  date: text("date").notNull(),
  venue: text("venue").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

/** Admission-enquiry form submissions from the public website. */
export const enquiries = sqliteTable("enquiries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
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

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Notice = typeof notices.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Enquiry = typeof enquiries.$inferSelect;

/** Key/value store for editable site content (school info, timings, admissions). Values are JSON. */
export const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: text("updated_at").notNull(),
});

/** Home-page hero carousel images. */
export const banners = sqliteTable("banners", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  url: text("url").notNull(),
  thumbUrl: text("thumb_url").notNull(),
  /** Storage keys; null for the original static banners shipped with the site. */
  storageKey: text("storage_key"),
  thumbKey: text("thumb_key"),
  alt: text("alt").notNull().default(""),
  width: integer("width"),
  height: integer("height"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

/** Photo gallery. */
export const galleryPhotos = sqliteTable("gallery_photos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  url: text("url").notNull(),
  thumbUrl: text("thumb_url").notNull(),
  storageKey: text("storage_key"),
  thumbKey: text("thumb_key"),
  caption: text("caption").notNull().default(""),
  /** One of: Campus, Academics, Sports, Events. */
  category: text("category").notNull(),
  width: integer("width"),
  height: integer("height"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type Banner = typeof banners.$inferSelect;
export type GalleryPhoto = typeof galleryPhotos.$inferSelect;
