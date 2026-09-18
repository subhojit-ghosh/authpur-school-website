import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, FlaskConical, Home, Menu, Quote, Type } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";

export const metadata: Metadata = { title: "Website Text" };

const areas = [
  {
    href: "/admin/content/menu",
    icon: Menu,
    title: "Header menu",
    description:
      "The menu across the top of every page: add or rename an item, change where it goes, reorder it, or give it a dropdown. Includes the gold apply button.",
  },
  {
    href: "/admin/content/home",
    icon: Home,
    title: "Home page sections",
    description:
      "The statistics band, About, Academics, Why Us, Campus Life, Testimonials, the notice headings, the admissions call to action and the contact intro.",
  },
  {
    href: "/admin/content/leadership",
    icon: Quote,
    title: "Chairman & Principal",
    description: "Names, roles and the full message shown on each leadership page.",
  },
  {
    href: "/admin/content/banners",
    icon: Type,
    title: "Page headings",
    description: "The label, title and introduction at the top of each interior page.",
  },
  {
    href: "/admin/content/labs",
    icon: FlaskConical,
    title: "Laboratories",
    description: "The laboratories listed on the Labs page, with their descriptions and highlights.",
  },
  {
    href: "/admin/content/identity",
    icon: Building2,
    title: "School identity & footer",
    description: "School name, established year, tagline, motto, the footer blurb and the footer link lists.",
  },
];

export default function WebsiteTextPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Website Text"
        title="Wording on the website"
        description="Everything written on the public site can be edited here, including the header menu. Notices, events, photos, admission dates and contact details have their own sections in the menu."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {areas.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="group flex items-start gap-4 rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand text-brand-foreground">
              <a.icon className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5 font-heading text-base font-semibold text-brand">
                {a.title}
                <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{a.description}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
