import { getSession } from "@/lib/auth";
import { getEnquiries } from "@/lib/content";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

/** Escapes a value for CSV: wraps in quotes and doubles inner quotes. */
function csv(value: string | null | undefined) {
  const s = (value ?? "").replace(/\r?\n/g, " ");
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const q = new URL(request.url).searchParams.get("q") ?? "";
  const rows = await getEnquiries({ q });

  const header = ["Received", "Name", "Phone", "Email", "Class of interest", "Message", "Status"];
  const lines = rows.map((e) =>
    [
      formatDateTime(e.createdAt),
      e.name,
      e.phone,
      e.email ?? "",
      e.grade ?? "",
      e.message ?? "",
      e.readAt ? "Read" : "New",
    ]
      .map(csv)
      .join(","),
  );

  // UTF-8 BOM so Excel opens the file with the right encoding.
  const body = "﻿" + [header.map(csv).join(","), ...lines].join("\r\n") + "\r\n";
  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="admission-enquiries-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
