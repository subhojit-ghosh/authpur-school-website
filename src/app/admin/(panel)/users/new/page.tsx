import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { createStaffUser } from "../actions";
import { NewUserForm } from "../user-form";

export const metadata: Metadata = { title: "Add staff account" };

export default function NewStaffUserPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Staff Accounts"
        title="Add account"
        description="The new account can sign in straight away and has the same access as yours."
      />
      <div className="max-w-2xl rounded-2xl border bg-card p-6">
        <NewUserForm action={createStaffUser} />
      </div>
    </div>
  );
}
