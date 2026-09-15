import { getSession } from "@/lib/auth";
import { getAuditEntries } from "@/lib/audit";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

function csv(value: string | null | undefined) {
  const s = (value ?? "").replace(/\r?\n/g, " ");
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const sp = new URL(request.url).searchParams;
  const rows = await getAuditEntries({
    q: sp.get("q") ?? "",
    section: sp.get("section") ?? "",
    person: sp.get("person") ?? "",
    limit: 5000,
  });

  const header = ["When", "Who", "Section", "Action", "What happened", "What changed"];
  const lines = rows.map((e) =>
    [formatDateTime(e.at), e.userName, e.section, e.action, e.summary, e.details ?? ""].map(csv).join(","),
  );

  const body = "﻿" + [header.map(csv).join(","), ...lines].join("\r\n") + "\r\n";
  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="activity-log-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
