"use server";

import { headers } from "next/headers";
import { db } from "@/db";
import { enquiries } from "@/db/schema";
import { LIMITS } from "@/lib/content-types";

export type EnquiryState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string> };

// Light spam protection: at most 5 submissions per IP per 10 minutes.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, number[]>();

function tooMany(ip: string) {
  const now = Date.now();
  const list = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.set(ip, list);
  if (list.length >= MAX_PER_WINDOW) return true;
  list.push(now);
  return false;
}

const clean = (v: FormDataEntryValue | null, max: number) => String(v ?? "").trim().slice(0, max);

export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  // Honeypot: real visitors never fill this hidden field.
  if (String(formData.get("website") ?? "").trim()) return { ok: true };

  const name = clean(formData.get("name"), LIMITS.enquiryName);
  const phone = clean(formData.get("phone"), LIMITS.enquiryPhone);
  const email = clean(formData.get("email"), LIMITS.enquiryEmail);
  const grade = clean(formData.get("grade"), LIMITS.enquiryGrade);
  const message = clean(formData.get("message"), LIMITS.enquiryMessage);

  const fieldErrors: Record<string, string> = {};
  if (name.length < 2) fieldErrors.name = "Please enter your full name.";
  if (!/^[+\d][\d\s\-()]{6,}$/.test(phone)) fieldErrors.phone = "Please enter a valid phone number.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = "Please enter a valid email address.";
  if (Object.keys(fieldErrors).length) {
    return { error: "Please correct the highlighted fields.", fieldErrors };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  if (tooMany(ip)) {
    return { error: "Too many enquiries were sent from this connection. Please try again in a few minutes or call us." };
  }

  await db.insert(enquiries).values({
    name,
    phone,
    email: email || null,
    grade: grade || null,
    message: message || null,
    createdAt: new Date().toISOString(),
  });

  return { ok: true };
}
