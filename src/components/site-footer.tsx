import Link from "next/link";
import {
  AtSign,
  Camera,
  Clock,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  Video,
} from "lucide-react";
import { FacebookIcon, WhatsAppIcon, YouTubeIcon } from "@/components/brand-icons";
import { cn } from "@/lib/utils";
import { RichText } from "@/components/rich-text";
import { Crest } from "@/components/crest";
import { defaultIdentity, type Identity } from "@/lib/page-content-types";
import { defaultSchoolInfo, telHref, type SchoolInfo } from "@/lib/settings-types";

/** Icon names offered in the admin panel, mapped to the icons themselves. */
const socialIcons: Record<string, (props: { className?: string }) => React.ReactNode> = {
  facebook: FacebookIcon,
  youtube: YouTubeIcon,
  whatsapp: WhatsAppIcon,
  website: Globe,
  share: Share2,
  photos: Camera,
  video: Video,
  message: MessageCircle,
  email: AtSign,
};

/** Each brand's own colour fills its button on hover. */
const socialHover: Record<string, string> = {
  facebook: "hover:border-[#1877f2] hover:bg-[#1877f2] hover:text-white",
  youtube: "hover:border-[#ff0000] hover:bg-[#ff0000] hover:text-white",
  whatsapp: "hover:border-[#25d366] hover:bg-[#25d366] hover:text-white",
};

export function SiteFooter({
  info = defaultSchoolInfo,
  identity = defaultIdentity,
}: {
  info?: SchoolInfo;
  identity?: Identity;
}) {
  return (
    <footer className="bg-brand text-brand-foreground print:hidden">
      <div className="school-stripe h-1.5" />
      <div className="container-edge grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4 lg:py-20">
        {/* Identity */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3">
            <Crest className="h-12 w-12" />
            <div className="leading-tight">
              <p className="font-heading text-lg font-semibold">{identity.shortName}</p>
              {identity.footerCrestLine ? (
                <p className="text-sm text-brand-foreground/65">
                  {identity.footerCrestLine}
                </p>
              ) : null}
            </div>
          </div>
          <RichText
            html={identity.footerBlurb.replaceAll("{year}", identity.established)}
            className="mt-5 max-w-xs text-base leading-relaxed text-brand-foreground/75 [&_a]:text-gold [&_blockquote]:border-gold [&_strong]:text-brand-foreground"
          />
          <p className="mt-5 font-heading text-base font-medium text-gold">
            {identity.motto}
          </p>
          {identity.mottoMeaning ? (
            <p className="text-sm text-brand-foreground/60">“{identity.mottoMeaning}”</p>
          ) : null}
        </div>

        {/* Quick links */}
        <div>
          <h3 className="font-heading text-lg font-semibold text-white">
            {identity.footerExploreHeading}
          </h3>
          <ul className="mt-5 space-y-3 text-base">
            {identity.footerExplore.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-brand-foreground/75 transition-colors hover:text-white hover:underline hover:underline-offset-4"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Menu */}
        <div>
          <h3 className="font-heading text-lg font-semibold text-white">
            {identity.footerNavigateHeading}
          </h3>
          <ul className="mt-5 space-y-3 text-base">
            {identity.footerNavigate.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-brand-foreground/75 transition-colors hover:text-white hover:underline hover:underline-offset-4"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-heading text-lg font-semibold text-white">
            {identity.footerContactHeading}
          </h3>
          <ul className="mt-5 space-y-4 text-base text-brand-foreground/75">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
              <span>
                {info.address.line1}, {info.address.line2}, {info.address.city} –{" "}
                {info.address.pin}
              </span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-gold" />
              <a href={telHref(info.phone)} className="hover:text-gold">
                {info.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-gold" />
              <a href={`mailto:${info.email}`} className="break-all hover:text-gold">
                {info.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-gold" />
              <span>{info.officeHours}</span>
            </li>
          </ul>

          {identity.footerSocial.length ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {identity.footerSocial.map((link) => {
                const Icon = socialIcons[link.icon] ?? Globe;
                return (
                  <a
                    key={`${link.label}-${link.href}`}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    title={link.label}
                    className={cn(
                      "grid size-11 place-items-center rounded-full border border-brand-foreground/25 text-white transition-colors",
                      socialHover[link.icon] ?? "hover:border-gold hover:bg-gold hover:text-gold-foreground",
                    )}
                  >
                    <Icon className="size-5" />
                  </a>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      <div className="border-t border-brand-foreground/15">
        <div className="container-edge flex flex-col items-center justify-between gap-2 py-6 text-sm text-brand-foreground/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {identity.name}. {identity.footerRightsNote}
          </p>
          <p>{identity.footerCopyrightNote}</p>
        </div>
      </div>
    </footer>
  );
}
