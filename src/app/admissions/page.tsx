import type { Metadata } from "next";
import Link from "next/link";
import {
  ClipboardList,
  CalendarDays,
  IndianRupee,
  FileText,
  Check,
  GraduationCap,
  Phone,
} from "lucide-react";
import { PageBanner } from "@/components/page-banner";
import { Button } from "@/components/ui/button";
import {
  admissionSteps,
  admissionDates,
  eligibility,
  feeStructure,
  admissionDocuments,
  feeNote,
  school,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Admission",
  description:
    "Admission process, important dates, eligibility, fee structure and required documents for Authpur National Model Higher Secondary School.",
};

export default function AdmissionsPage() {
  return (
    <>
      <PageBanner
        eyebrow="Admissions 2026–27"
        title="Admission"
        subtitle="Everything you need to begin your child's journey with us — the process, dates, eligibility and fees."
      />

      <section className="py-16 lg:py-24">
        <div className="container-edge space-y-16">
          {/* Process */}
          <div>
            <h2 className="flex items-center gap-2.5 font-heading text-2xl font-semibold text-brand">
              <ClipboardList className="size-6 text-gold" />
              How to apply
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {admissionSteps.map((step, i) => (
                <div key={step.title} className="relative rounded-2xl border bg-card p-6 shadow-sm">
                  <span className="grid size-11 place-items-center rounded-xl bg-brand font-heading text-lg font-semibold text-brand-foreground">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 font-heading text-base font-semibold text-brand">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Important dates */}
            <div className="rounded-2xl border bg-card p-7 shadow-sm">
              <h2 className="flex items-center gap-2.5 font-heading text-2xl font-semibold text-brand">
                <CalendarDays className="size-6 text-gold" />
                Important dates
              </h2>
              <ul className="mt-6 divide-y">
                {admissionDates.map((d) => (
                  <li key={d.event} className="flex items-center justify-between gap-4 py-3.5">
                    <span className="text-sm font-medium text-foreground">{d.event}</span>
                    <span className="font-heading text-sm font-semibold text-gold-foreground">
                      {d.date}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Eligibility */}
            <div className="rounded-2xl border bg-card p-7 shadow-sm">
              <h2 className="flex items-center gap-2.5 font-heading text-2xl font-semibold text-brand">
                <GraduationCap className="size-6 text-gold" />
                Eligibility
              </h2>
              <ul className="mt-6 divide-y">
                {eligibility.map((e) => (
                  <li key={e.level} className="flex items-center justify-between gap-4 py-3.5">
                    <span className="text-sm font-semibold text-brand">{e.level}</span>
                    <span className="text-right text-sm text-muted-foreground">{e.criteria}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Fees */}
            <div className="rounded-2xl border bg-card p-7 shadow-sm">
              <h2 className="flex items-center gap-2.5 font-heading text-2xl font-semibold text-brand">
                <IndianRupee className="size-6 text-gold" />
                Fee structure
              </h2>
              <ul className="mt-6 divide-y">
                {feeStructure.map((f) => (
                  <li key={f.head} className="flex items-center justify-between gap-4 py-3.5">
                    <span className="text-sm font-medium text-foreground">{f.head}</span>
                    <span className="font-heading text-sm font-semibold text-brand">{f.amount}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 rounded-lg bg-secondary/60 p-3 text-xs leading-relaxed text-muted-foreground">
                {feeNote}
              </p>
            </div>

            {/* Documents */}
            <div className="rounded-2xl border bg-card p-7 shadow-sm">
              <h2 className="flex items-center gap-2.5 font-heading text-2xl font-semibold text-brand">
                <FileText className="size-6 text-gold" />
                Documents required
              </h2>
              <ul className="mt-6 space-y-3">
                {admissionDocuments.map((doc) => (
                  <li key={doc} className="flex items-start gap-3 text-sm text-foreground">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gold-soft text-gold-foreground">
                      <Check className="size-3" />
                    </span>
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="relative overflow-hidden rounded-3xl bg-brand px-6 py-12 text-center shadow-xl shadow-brand/20 sm:px-12">
            <div className="bg-grid absolute inset-0 opacity-[0.08]" />
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/25 blur-3xl" />
            <div className="relative">
              <h2 className="text-balance font-heading text-2xl font-semibold text-brand-foreground sm:text-3xl">
                Ready to take the next step?
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-pretty text-brand-foreground/75">
                Send us an enquiry or call the school office — our admissions team will guide you
                through every step.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-12 bg-gold px-7 text-[15px] font-semibold text-gold-foreground hover:bg-gold/90 [&_svg:not([class*='size-'])]:size-[18px]"
                >
                  <Link href="/admission-enquiry">
                    <ClipboardList />
                    Admission Enquiry
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 border-white/25 bg-transparent px-7 text-[15px] text-brand-foreground hover:bg-white/10 hover:text-brand-foreground [&_svg:not([class*='size-'])]:size-[18px]"
                >
                  <a href={`tel:${school.admissionsPhone.replace(/\s/g, "")}`}>
                    <Phone />
                    {school.admissionsPhone}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
