import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { ContactForm } from "@/components/sections/contact-form";
import { school } from "@/lib/site";

const details = [
  {
    icon: MapPin,
    label: "Visit us",
    value: `${school.address.line1}, ${school.address.line2}, ${school.address.city} – ${school.address.pin}`,
  },
  { icon: Phone, label: "Call us", value: school.phone, href: school.phoneHref },
  { icon: Mail, label: "Email us", value: school.email, href: `mailto:${school.email}` },
  { icon: Clock, label: "Office hours", value: "Monday – Saturday · 8:00 AM – 4:00 PM" },
];

const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
  school.mapQuery,
)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 bg-secondary py-20 lg:py-28">
      <div className="container-edge">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center">Get in touch</span>
          <h2 className="mt-4 text-balance font-heading text-3xl font-semibold text-brand sm:text-4xl">
            We&apos;d love to hear from you
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Have a question about admissions or our programmes? Reach out and our team will
            be happy to help.
          </p>
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
                title={`Map to ${school.name}`}
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
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
