import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { PageBanner } from "@/components/page-banner";
import { ContactForm } from "@/components/sections/contact-form";
import { school } from "@/lib/site";

export const metadata: Metadata = {
  title: "Admission Enquiry",
  description:
    "Send an admission enquiry to Authpur National Model Higher Secondary School and our team will get back to you.",
};

const reasons = [
  "Personalised guidance for your child's class and stream",
  "Clear information on fees, dates and documents",
  "A friendly campus visit at your convenience",
];

const details = [
  { icon: Phone, label: "Admissions helpline", value: school.admissionsPhone, href: `tel:${school.admissionsPhone.replace(/\s/g, "")}` },
  { icon: Mail, label: "Email", value: school.email, href: `mailto:${school.email}` },
  {
    icon: MapPin,
    label: "Address",
    value: `${school.address.line1}, ${school.address.line2} – ${school.address.pin}`,
  },
  { icon: Clock, label: "Office hours", value: "Mon – Sat · 8:00 AM – 4:00 PM" },
];

export default function AdmissionEnquiryPage() {
  return (
    <>
      <PageBanner
        eyebrow="Admissions 2026–27"
        title="Admission Enquiry"
        subtitle="Tell us a little about your child and we'll get back to you with everything you need to know."
      />

      <section className="py-16 lg:py-24">
        <div className="container-edge grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          {/* Info */}
          <div>
            <h2 className="font-heading text-2xl font-semibold text-brand">
              We're here to help you decide
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Fill in the enquiry form and a member of our admissions team will reach out to you.
              You are also warmly welcome to call or visit the school.
            </p>

            <ul className="mt-6 space-y-3">
              {reasons.map((r) => (
                <li key={r} className="flex items-start gap-3 text-sm text-foreground">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-gold-foreground" />
                  {r}
                </li>
              ))}
            </ul>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {details.map((d) => (
                <div key={d.label} className="rounded-2xl border bg-card p-5">
                  <span className="grid size-10 place-items-center rounded-xl bg-accent text-brand">
                    <d.icon className="size-5" />
                  </span>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {d.label}
                  </p>
                  {d.href ? (
                    <a href={d.href} className="mt-1 block text-sm font-medium text-foreground hover:text-brand">
                      {d.value}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm font-medium text-foreground">{d.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border bg-card p-7 shadow-sm sm:p-8 lg:sticky lg:top-32 lg:self-start">
            <h2 className="font-heading text-xl font-semibold text-brand">Enquiry form</h2>
            <p className="mt-1 mb-6 text-sm text-muted-foreground">
              All fields marked as required must be filled in.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
