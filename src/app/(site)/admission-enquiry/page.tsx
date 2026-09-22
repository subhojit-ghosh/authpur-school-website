import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, Check } from "lucide-react";
import { Reveal } from "@/components/motion";
import { PageBanner } from "@/components/page-banner";
import { getPageBanners } from "@/lib/page-content";
import { ContactForm } from "@/components/sections/contact-form";
import { getSchoolInfo } from "@/lib/settings";
import { telHref } from "@/lib/settings-types";

export const metadata: Metadata = {
  alternates: { canonical: "/admission-enquiry" },
  title: "Admission Enquiry",
  description:
    "Send an admission enquiry to Authpur National Model Higher Secondary School and our team will get back to you.",
};

const reasons = [
  "Personalised guidance for your child's class and stream",
  "Clear information on fees, dates and documents",
  "A friendly campus visit at your convenience",
];


export default async function AdmissionEnquiryPage() {
  const [info, banners] = await Promise.all([getSchoolInfo(), getPageBanners()]);
  const banner = banners.admissionEnquiry;
  const details = [
    { icon: Phone, label: "Admissions helpline", value: info.admissionsPhone, href: telHref(info.admissionsPhone) },
    { icon: Mail, label: "Email", value: info.email, href: `mailto:${info.email}` },
    { icon: MapPin, label: "Address", value: `${info.address.line1}, ${info.address.line2} – ${info.address.pin}` },
    { icon: Clock, label: "Office hours", value: info.officeHours },
  ];

  return (
    <>
      <PageBanner eyebrow={banner.eyebrow} title={banner.title} subtitle={banner.subtitle} />

      <section className="py-16 lg:py-24">
        <div className="container-edge grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <h2 className="page-heading">We&apos;re here to help you decide</h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              Fill in the enquiry form and a member of our admissions team will reach out to you. You are also
              warmly welcome to call or visit the school.
            </p>

            <ul className="mt-8 space-y-3">
              {reasons.map((r) => (
                <li key={r} className="flex items-start gap-3 text-[17px] text-foreground">
                  <Check className="mt-1 size-4 shrink-0 text-leaf" strokeWidth={3} />
                  {r}
                </li>
              ))}
            </ul>

            <dl className="mt-10 space-y-6 border-t pt-8">
              {details.map((d) => (
                <div key={d.label} className="flex gap-4">
                  <d.icon className="mt-1 size-5 shrink-0 text-gold-ink" />
                  <div>
                    <dt className="text-[15px] text-muted-foreground">{d.label}</dt>
                    <dd className="text-lg font-medium text-foreground">
                      {d.href ? (
                        <a href={d.href} className="break-words hover:text-brand hover:underline hover:underline-offset-4">
                          {d.value}
                        </a>
                      ) : (
                        d.value
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal className="lg:col-span-7 lg:sticky lg:top-28 lg:self-start" delay={0.1}>
            <div className="overflow-hidden rounded-lg bg-mist">
              <div className="school-stripe h-1.5" />
              <div className="p-6 sm:p-10">
                <h2 className="font-heading text-2xl font-semibold text-brand">Enquiry form</h2>
                <p className="mb-8 mt-2 text-[17px] text-muted-foreground">Fields marked * must be filled in.</p>
                <ContactForm admissionsPhone={info.admissionsPhone} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
