/** Date helpers shared by the public site and the admin panel. Safe on server and client. */

const IST = "Asia/Kolkata";

/** Parse YYYY-MM-DD as a local calendar date (no timezone shift). */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/** Today's date in India as YYYY-MM-DD. */
export function todayISO(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: IST }).format(new Date());
}

export function isValidISODate(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const d = parseISODate(iso);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) !== "Invalid Date" && iso === toISODate(d);
}

export function toISODate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** e.g. "18 Jul 2026" (short) or "18 July 2026" (long). */
export function formatDate(iso: string, month: "short" | "long" = "short"): string {
  return parseISODate(iso).toLocaleDateString("en-IN", { day: "numeric", month, year: "numeric" });
}

/** Day number and short month for the event tiles, e.g. { day: "05", month: "Aug" }. */
export function dayMonth(iso: string): { day: string; month: string } {
  const d = parseISODate(iso);
  return {
    day: String(d.getDate()).padStart(2, "0"),
    month: d.toLocaleDateString("en-IN", { month: "short" }),
  };
}

/** e.g. "14 Sep 2026, 1:05 pm" in Indian time, from an ISO timestamp. */
export function formatDateTime(isoTimestamp: string): string {
  return new Date(isoTimestamp).toLocaleString("en-IN", {
    timeZone: IST,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
