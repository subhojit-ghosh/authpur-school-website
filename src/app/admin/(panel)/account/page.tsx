import type { Metadata } from "next";
import { ShieldCheck, UserRound } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { requireUser } from "@/lib/auth";
import { ChangePasswordForm } from "./change-password-form";

export const metadata: Metadata = { title: "Account & Password" };

export default async function AccountPage() {
  const user = await requireUser();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Account"
        title="Account & Password"
        description="The staff account used to sign in to this admin panel."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
        <section className="rounded-2xl border bg-card p-6">
          <h3 className="flex items-center gap-2 font-heading text-base font-semibold text-brand">
            <UserRound className="size-4 text-gold" />
            Staff account
          </h3>
          <dl className="mt-4 grid gap-3 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Name</dt>
              <dd className="mt-0.5 font-medium">{user.displayName}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Username</dt>
              <dd className="mt-0.5 font-medium">@{user.username}</dd>
            </div>
          </dl>
          <p className="mt-5 flex items-start gap-2 rounded-lg bg-muted px-3 py-2.5 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-gold" />
            Keep the password private. If it is ever shared or forgotten, change it here — or ask another staff member to reset it from Staff Accounts.
          </p>
        </section>

        <section className="rounded-2xl border bg-card p-6">
          <h3 className="font-heading text-base font-semibold text-brand">Change password</h3>
          <div className="mt-4">
            <ChangePasswordForm />
          </div>
        </section>
      </div>
    </div>
  );
}
