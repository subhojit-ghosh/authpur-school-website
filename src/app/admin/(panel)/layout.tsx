import { AdminShell } from "@/components/admin/admin-shell";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <AdminShell user={{ displayName: user.displayName, username: user.username }}>{children}</AdminShell>
  );
}
