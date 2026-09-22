"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Phone, GraduationCap, MapPin, ChevronDown } from "lucide-react";
import { Crest } from "@/components/crest";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { defaultIdentity, defaultNavigation, type Identity, type Navigation } from "@/lib/page-content-types";
import { defaultSchoolInfo, telHref, type SchoolInfo } from "@/lib/settings-types";
import { cn } from "@/lib/utils";

export function SiteHeader({
  info = defaultSchoolInfo,
  identity = defaultIdentity,
  nav = defaultNavigation,
}: {
  info?: SchoolInfo;
  identity?: Identity;
  nav?: Navigation;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    // Once the page scrolls, the address bar slides up out of view and only
    // the menu stays; moving the sticky header does not shift the layout.
    <header
      id="home"
      className={cn(
        "sticky top-0 z-50 transition-transform duration-300 ease-out print:hidden",
        scrolled && "-translate-y-9",
      )}
    >
      {/* Address and phone */}
      <div className="bg-brand text-brand-foreground/85">
        <div className="container-edge flex h-9 items-center justify-between gap-4 text-sm">
          <p className="flex items-center gap-2 truncate">
            <MapPin className="hidden size-3.5 shrink-0 text-gold sm:block" />
            <span className="truncate">
              {info.address.line1}, {info.address.line2}, {info.address.pin}
            </span>
          </p>
          <a
            href={telHref(info.phone)}
            className="flex shrink-0 items-center gap-1.5 font-semibold transition-colors hover:text-gold"
          >
            <Phone className="size-3.5" />
            <span className="hidden sm:inline">{info.phone}</span>
            <span className="sm:hidden">Call</span>
          </a>
        </div>
      </div>

      {/* Main nav */}
      <div className={cn("bg-background transition-shadow duration-300", scrolled && "shadow-md shadow-brand/8")}>
        <nav className="container-edge flex h-20 items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <Crest className="h-14 w-14 shrink-0" />
            <span className="flex flex-col leading-none">
              <span className="font-heading text-base font-semibold tracking-tight text-brand sm:text-lg">
                {identity.shortName}
              </span>
              <span className="mt-1.5 text-[13px] text-muted-foreground">
                Higher Secondary School, since {identity.established}
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center lg:flex">
            {nav.items.map((item) =>
              item.children.length ? (
                <div key={item.label} className="group relative">
                  <button className="flex items-center gap-1 whitespace-nowrap px-2.5 py-2 text-[15px] font-semibold text-brand/80 transition-colors group-hover:text-brand xl:px-3.5">
                    {item.label}
                    <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="invisible absolute left-0 top-full z-50 pt-3 opacity-0 transition-all duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <div className="min-w-64 overflow-hidden rounded-lg border bg-popover shadow-xl shadow-brand/10">
                      <div className="school-stripe h-1" />
                      <div className="p-2">
                        {item.children.map((child) => (
                          <Link
                            key={`${child.label}-${child.href}`}
                            href={child.href}
                            className="block rounded-md px-3 py-2.5 transition-colors hover:bg-mist"
                          >
                            <span className="block text-[15px] font-semibold text-brand">{child.label}</span>
                            {child.desc ? (
                              <span className="block text-sm text-muted-foreground">{child.desc}</span>
                            ) : null}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="whitespace-nowrap px-2.5 py-2 text-[15px] font-semibold text-brand/80 transition-colors hover:text-brand xl:px-3.5"
                >
                  {item.label}
                </Link>
              ),
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              asChild
              className="hidden h-11 rounded-md bg-gold px-5 text-[15px] font-semibold text-gold-foreground hover:bg-gold/90 sm:inline-flex lg:hidden xl:inline-flex"
            >
              <Link href={nav.applyHref}>
                <GraduationCap className="size-4" />
                {nav.applyLabel}
              </Link>
            </Button>

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Crest className="h-8 w-8" />
                    <span className="font-heading text-base text-brand">{identity.shortName}</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1 px-4 pb-6">
                  {nav.items.map((item) =>
                    item.children.length ? (
                      <div key={item.label} className="py-1">
                        <p className="px-3 pb-1 pt-3 text-sm font-semibold text-gold-ink">
                          {item.label}
                        </p>
                        {item.children.map((child) => (
                          <SheetClose asChild key={`${child.label}-${child.href}`}>
                            <Link
                              href={child.href}
                              className="block rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-brand"
                            >
                              {child.label}
                            </Link>
                          </SheetClose>
                        ))}
                      </div>
                    ) : (
                      <SheetClose asChild key={item.label}>
                        <Link
                          href={item.href}
                          className="rounded-md px-3 py-2.5 text-sm font-semibold text-foreground/85 transition-colors hover:bg-accent hover:text-brand"
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    ),
                  )}
                  <SheetClose asChild>
                    <Button
                      asChild
                      className="mt-4 w-full bg-gold font-semibold text-gold-foreground hover:bg-gold/90"
                    >
                      <Link href={nav.applyHref}>
                        <GraduationCap className="size-4" />
                        {nav.applyLabelMobile}
                      </Link>
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
        <div className="school-stripe h-1" />
      </div>
    </header>
  );
}
