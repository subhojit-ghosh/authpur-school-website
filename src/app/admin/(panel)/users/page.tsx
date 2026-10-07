import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, Plus, Trash2, UsersRound } from "lucide-react";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Flash } from "@/components/admin/flash";
import { FormError } from "@/components/admin/form-message";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { getStaffUsers } from "@/lib/users";
import { deleteStaffUser } from "./actions";

export const metadata: Metadata = { title: "Staff Accounts" };

const messages: Record<string, string> = {
  created: "Account created. Share the password with that person.",
  updated: "Account updated.",
  deleted: "Account removed. That person can no longer sign in.",
};

const errors: Record<string, string> = {
  self: "You cannot remove your own account. Ask another staff member to do it.",
  last: "This is the only account. Create another one before removing it.",
};

export default async function StaffUsersPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const [{ saved, error }, me, list] = await Promise.all([searchParams, requireUser(), getStaffUsers()]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Staff Accounts"
        title="Who can sign in"
        description="Everyone listed here can sign in to this admin panel and change the website. All accounts have the same access."
        actions={
          <Button asChild className="h-10 bg-brand font-semibold text-brand-foreground hover:bg-brand-muted">
            <Link href="/admin/users/new">
              <Plus className="size-4" />
              Add account
            </Link>
          </Button>
        }
      />

      <Flash text={saved ? messages[saved] : undefined} />
      <FormError message={error ? errors[error] : undefined} />

      {/* Below md the accounts are cards; the table needs 680px and a phone has not got it. */}
      <ul className="grid gap-3 md:hidden">
        {list.map((u) => (
          <li key={u.id} className="rounded-2xl border bg-card p-4">
            <div className="flex items-start gap-2">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-brand">
                <UsersRound className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 font-medium">
                  {u.displayName}
                  {u.id === me.id ? (
                    <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-gold-foreground">
                      You
                    </span>
                  ) : null}
                </p>
                <p className="text-sm text-muted-foreground">@{u.username}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Last signed in: {u.lastLoginAt ? formatDateTime(u.lastLoginAt) : "Never"}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-end gap-0.5 border-t pt-3">
              <Button asChild size="icon-sm" variant="ghost" aria-label={`Edit ${u.displayName}`}>
                <Link href={`/admin/users/${u.id}`}>
                  <Pencil className="size-4" />
                </Link>
              </Button>
              <form action={deleteStaffUser}>
                <input type="hidden" name="id" value={u.id} />
                <ConfirmButton
                  icon={<Trash2 className="size-4" />}
                  size="icon-sm"
                  variant="ghost"
                  disabled={u.id === me.id || list.length <= 1}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  aria-label={`Remove ${u.displayName}`}
                  message={`Remove the account for ${u.displayName} (@${u.username})?\n\nThey will no longer be able to sign in.`}
                />
              </form>
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto rounded-2xl border bg-card md:block">
        <table className="w-full min-w-[620px] text-sm">
          <thead className="bg-muted/60 text-left text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="w-40 px-4 py-3">Username</th>
              <th className="w-48 px-4 py-3">Last signed in</th>
              <th className="w-28 px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {list.map((u) => (
              <tr key={u.id} className="align-middle hover:bg-accent/30">
                <td className="px-4 py-2.5">
                  <span className="flex items-center gap-2">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-brand">
                      <UsersRound className="size-4" />
                    </span>
                    <span className="font-medium">{u.displayName}</span>
                    {u.id === me.id ? (
                      <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-gold-foreground">
                        You
                      </span>
                    ) : null}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-muted-foreground">@{u.username}</td>
                <td className="px-4 py-2.5 text-muted-foreground">
                  {u.lastLoginAt ? formatDateTime(u.lastLoginAt) : "Never"}
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-end gap-1">
                    <Button asChild size="icon-sm" variant="ghost" aria-label={`Edit ${u.displayName}`}>
                      <Link href={`/admin/users/${u.id}`}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <form action={deleteStaffUser}>
                      <input type="hidden" name="id" value={u.id} />
                      <ConfirmButton
                        icon={<Trash2 className="size-4" />}
                        size="icon-sm"
                        variant="ghost"
                        disabled={u.id === me.id || list.length <= 1}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Remove ${u.displayName}`}
                        message={`Remove the account for ${u.displayName} (@${u.username})?\n\nThey will no longer be able to sign in.`}
                      />
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        To change your own password, use <Link href="/admin/account" className="font-medium text-brand hover:underline">Account &amp; Password</Link>.
      </p>
    </div>
  );
}
