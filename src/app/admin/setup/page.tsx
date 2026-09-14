import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Crest } from "@/components/crest";
import { needsSetup } from "@/lib/setup";
import { school } from "@/lib/site";
import { SetupForm } from "./setup-form";

export const metadata: Metadata = { title: "First-time setup" };
export const dynamic = "force-dynamic";

export default async function AdminSetupPage() {
  if (!(await needsSetup())) redirect("/admin/login");

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-brand px-5 py-12 text-brand-foreground">
      <div className="bg-grid absolute inset-0 opacity-[0.08]" />
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />

      <div className="relative w-full max-w-lg">
        <div className="mb-8 flex flex-col items-center text-center">
          <Crest className="h-16 w-16" />
          <h1 className="mt-4 font-heading text-2xl font-semibold tracking-tight">{school.shortName}</h1>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-gold">Website Admin Panel · First-time setup</p>
        </div>

        <div className="rounded-2xl bg-card p-6 text-card-foreground shadow-2xl shadow-black/30 ring-1 ring-black/5 sm:p-8">
          <h2 className="font-heading text-xl font-semibold text-brand">Create the staff account</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This page appears only once, before any staff account exists. Enter the setup code from the deployment and choose the
            school&apos;s login details.
          </p>
          <div className="mt-6">
            <SetupForm />
          </div>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-brand-foreground/60">
          <ShieldCheck className="size-3.5 text-gold" />
          The setup code stops working as soon as the account is created.
        </p>
      </div>
    </div>
  );
}
