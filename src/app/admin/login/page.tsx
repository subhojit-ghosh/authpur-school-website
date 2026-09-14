import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Crest } from "@/components/crest";
import { getSession } from "@/lib/auth";
import { school } from "@/lib/site";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getSession();
  if (session) redirect("/admin");

  const { next } = await searchParams;

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-brand px-5 py-12 text-brand-foreground">
      <div className="bg-grid absolute inset-0 opacity-[0.08]" />
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
      <div className="absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Crest className="h-16 w-16" />
          <h1 className="mt-4 font-heading text-2xl font-semibold tracking-tight">{school.shortName}</h1>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-gold">Website Admin Panel</p>
        </div>

        <div className="rounded-2xl bg-card p-6 text-card-foreground shadow-2xl shadow-black/30 ring-1 ring-black/5 sm:p-8">
          <h2 className="font-heading text-xl font-semibold text-brand">Staff sign in</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Use the account provided by the school office.
          </p>
          <div className="mt-6">
            <LoginForm next={next} />
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3 text-xs text-brand-foreground/60">
          <p className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-gold" />
            Secure area — for authorised school staff only.
          </p>
          <Link href="/" className="inline-flex items-center gap-1 transition-colors hover:text-gold">
            <ArrowLeft className="size-3.5" />
            Back to the website
          </Link>
        </div>
      </div>
    </div>
  );
}
