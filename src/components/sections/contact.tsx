import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { ContactForm } from "@/components/sections/contact-form";
import { SectionIntro } from "@/components/section-intro";
import { getSchoolInfo } from "@/lib/settings";
import { getHomeContent, getIdentity } from "@/lib/page-content";
import { fullAddress, mapQuery, telHref } from "@/lib/settings-types";
import { Reveal } from "@/components/motion";

export async function Contact() {
  const [info, home, id] = await Promise.all([getSchoolInfo(), getHomeContent(), getIdentity()]);
  const copy = home.contact;

  const details = [
    { icon: MapPin, label: "Address", value: fullAddress(info) },
    { icon: Phone, label: "Phone", value: info.phone, href: telHref(info.phone) },
    { icon: Mail, label: "Email", value: info.email, href: `mailto:${info.email}` },
    { icon: Clock, label: "Office hours", value: info.officeHours },
  ];

  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery(info))}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <section id="contact" className="scroll-mt-28 py-20 lg:py-28">
      <div className="container-edge grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionIntro kicker={copy.eyebrow} heading={copy.heading} blurb={copy.blurb} />

          <Reveal>
          <dl className="mt-10 space-y-6">
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

          <div className="mt-10 overflow-hidden rounded-lg border">
            <iframe
              title={`Map to ${id.name}`}
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-64 w-full"
            />
          </div>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-7" delay={0.1}>
          <div className="overflow-hidden rounded-lg bg-mist">
            <div className="school-stripe h-1.5" />
            <div className="p-6 sm:p-10">
              <h3 className="font-heading text-2xl font-semibold text-brand">Send us an enquiry</h3>
              <p className="mb-8 mt-2 text-[17px] text-muted-foreground">
                Fill in the form and the school office will get back to you.
              </p>
              <ContactForm admissionsPhone={info.admissionsPhone} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
