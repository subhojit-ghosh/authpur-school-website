import Link from "next/link";
import { Mail, Phone, MapPin, Clock, Globe, MessageCircle, AtSign } from "lucide-react";
import { Crest } from "@/components/crest";
import { footerExplore, footerNavigate, school } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-brand text-brand-foreground">
      <div className="container-edge grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        {/* Identity */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3">
            <Crest className="h-12 w-12" />
            <div className="leading-tight">
              <p className="font-heading text-lg font-semibold">{school.shortName}</p>
              <p className="text-xs uppercase tracking-[0.15em] text-brand-foreground/60">
                Higher Secondary School
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-brand-foreground/70">
            Nurturing curious minds with knowledge, character and service since {school.established}.
          </p>
          <p className="mt-5 font-heading text-sm italic text-gold">
            {school.motto}
          </p>
          <p className="text-xs text-brand-foreground/55">“{school.mottoMeaning}”</p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">
            Explore
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            {footerExplore.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-brand-foreground/75 transition-colors hover:text-gold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Menu */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">
            Navigate
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            {footerNavigate.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-brand-foreground/75 transition-colors hover:text-gold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">
            Reach Us
          </h3>
          <ul className="mt-5 space-y-4 text-sm text-brand-foreground/75">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
              <span>
                {school.address.line1}, {school.address.line2}, {school.address.city} –{" "}
                {school.address.pin}
              </span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-gold" />
              <a href={school.phoneHref} className="hover:text-gold">
                {school.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-gold" />
              <a href={`mailto:${school.email}`} className="break-all hover:text-gold">
                {school.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-gold" />
              <span>Mon – Sat · 8:00 AM – 4:00 PM</span>
            </li>
          </ul>

          <div className="mt-6 flex gap-3">
            {[Globe, MessageCircle, AtSign].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social media"
                className="grid size-9 place-items-center rounded-full border border-brand-foreground/20 text-brand-foreground/80 transition-colors hover:border-gold hover:bg-gold hover:text-gold-foreground"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-brand-foreground/15">
        <div className="container-edge flex flex-col items-center justify-between gap-2 py-5 text-xs text-brand-foreground/55 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {school.name}. All rights reserved.
          </p>
          <p>Affiliated to WBBSE &amp; WBCHSE · Recognised by the Govt. of West Bengal</p>
        </div>
      </div>
    </footer>
  );
}
