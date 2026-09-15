import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { KeyRound, UserRound } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { requireUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { getStaffUser } from "@/lib/users";
import { resetStaffPassword, updateStaffUser } from "../actions";
import { EditUserForm, ResetPasswordForm } from "../user-form";

export const metadata: Metadata = { title: "Edit staff account" };

export default async function EditStaffUserPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const [me, user] = await Promise.all([requireUser(), Number.isInteger(id) ? getStaffUser(id) : undefined]);
  if (!user) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Staff Accounts"
        title={user.displayName}
        description={
          user.id === me.id
            ? "This is your own account."
            : `Last signed in: ${user.lastLoginAt ? formatDateTime(user.lastLoginAt) : "never"}.`
        }
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border bg-card p-6">
          <h3 className="flex items-center gap-2 font-heading text-base font-semibold text-brand">
            <UserRound className="size-4 text-gold" />
            Account details
          </h3>
          <div className="mt-4">
            <EditUserForm
              action={updateStaffUser.bind(null, user.id)}
              initial={{ displayName: user.displayName, username: user.username }}
            />
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-6">
          <h3 className="flex items-center gap-2 font-heading text-base font-semibold text-brand">
            <KeyRound className="size-4 text-gold" />
            {user.id === me.id ? "Set a new password" : `Reset password for ${user.displayName}`}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {user.id === me.id
              ? "You stay signed in here; your other devices are signed out."
              : "Use this when someone forgets their password. Tell them the new one and ask them to change it."}
          </p>
          <div className="mt-4">
            <ResetPasswordForm action={resetStaffPassword.bind(null, user.id)} />
          </div>
        </section>
      </div>
    </div>
  );
}
