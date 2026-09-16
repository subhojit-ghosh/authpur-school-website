import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { ContactForm } from "@/components/sections/contact-form";
import { getSchoolInfo } from "@/lib/settings";
import { getHomeContent } from "@/lib/page-content";
import { fullAddress, mapQuery, telHref } from "@/lib/settings-types";
import { getIdentity } from "@/lib/page-content";

export async function Contact() {
  const [info, home, id] = await Promise.all([getSchoolInfo(), getHomeContent(), getIdentity()]);
  const copy = home.contact;

  const details = [
    { icon: MapPin, label: "Visit us", value: fullAddress(info) },
    { icon: Phone, label: "Call us", value: info.phone, href: telHref(info.phone) },
    { icon: Mail, label: "Email us", value: info.email, href: `mailto:${info.email}` },
    { icon: Clock, label: "Office hours", value: info.officeHours },
  ];

  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery(info))}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <section id="contact" className="scroll-mt-24 bg-secondary py-20 lg:py-28">
      <div className="container-edge">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center">{copy.eyebrow}</span>
          <h2 className="mt-4 text-balance font-heading text-3xl font-semibold text-brand sm:text-4xl">
            {copy.heading}
          </h2>
          {copy.blurb ? (
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{copy.blurb}</p>
          ) : null}
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {/* Left: details + map */}
          <div className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {details.map((d) => (
                <div key={d.label} className="rounded-2xl border bg-card p-5">
                  <span className="grid size-10 place-items-center rounded-xl bg-accent text-brand">
                    <d.icon className="size-5" />
                  </span>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {d.label}
                  </p>
                  {d.href ? (
                    <a
                      href={d.href}
                      className="mt-1 block text-sm font-medium text-foreground hover:text-brand"
                    >
                      {d.value}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm font-medium text-foreground">{d.value}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="overflow-hidden rounded-2xl border shadow-sm">
              <iframe
                title={`Map to ${id.name}`}
                src={mapSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-64 w-full grayscale-[0.2]"
              />
            </div>
          </div>

          {/* Right: form */}
          <div className="rounded-2xl border bg-card p-7 shadow-sm sm:p-8">
            <h3 className="font-heading text-xl font-semibold text-brand">Send us an enquiry</h3>
            <p className="mt-1 mb-6 text-sm text-muted-foreground">
              Fill in the form and we&apos;ll get back to you soon.
            </p>
            <ContactForm admissionsPhone={info.admissionsPhone} />
          </div>
        </div>
      </div>
    </section>
  );
}
