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
import { mainNav, school } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header id="home" className="sticky top-0 z-50">
      {/* Announcement bar */}
      <div className="bg-brand text-brand-foreground/90">
        <div className="container-edge flex h-9 items-center justify-between gap-4 text-xs">
          <p className="flex items-center gap-2 truncate">
            <MapPin className="hidden size-3.5 shrink-0 text-gold sm:block" />
            <span className="truncate">
              {school.address.line1}, {school.address.line2} — {school.address.pin}
            </span>
          </p>
          <a
            href={school.phoneHref}
            className="flex shrink-0 items-center gap-1.5 font-medium transition-colors hover:text-gold"
          >
            <Phone className="size-3.5" />
            <span className="hidden sm:inline">{school.phone}</span>
            <span className="sm:hidden">Call</span>
          </a>
        </div>
      </div>

      {/* Main nav */}
      <div
        className={cn(
          "border-b transition-all duration-300",
          scrolled
            ? "border-border/70 bg-background/85 backdrop-blur-md shadow-sm"
            : "border-transparent bg-background/70 backdrop-blur-sm",
        )}
      >
        <nav className="container-edge flex h-18 items-center justify-between gap-4 py-2">
          <Link href="/" className="flex items-center gap-3">
            <Crest className="h-11 w-11 shrink-0" />
            <span className="flex flex-col leading-none">
              <span className="font-heading text-[15px] font-semibold tracking-tight text-brand sm:text-base">
                {school.shortName}
              </span>
              <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Higher Secondary · Est. {school.established}
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center xl:flex">
            {mainNav.map((item) =>
              item.children ? (
                <div key={item.label} className="group relative">
                  <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground/75 transition-colors group-hover:bg-accent group-hover:text-brand">
                    {item.label}
                    <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <div className="min-w-64 rounded-xl border bg-popover p-2 shadow-xl shadow-brand/5">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-accent"
                        >
                          <span className="block text-sm font-medium text-brand">{child.label}</span>
                          {child.desc ? (
                            <span className="block text-xs text-muted-foreground">{child.desc}</span>
                          ) : null}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  className="rounded-md px-3 py-2 text-sm font-medium text-foreground/75 transition-colors hover:bg-accent hover:text-brand"
                >
                  {item.label}
                </Link>
              ),
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              asChild
              className="hidden h-10 bg-gold px-5 font-semibold text-gold-foreground shadow-sm hover:bg-gold/90 sm:inline-flex"
            >
              <Link href="/admissions">
                <GraduationCap className="size-4" />
                Apply Now
              </Link>
            </Button>

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="xl:hidden" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Crest className="h-8 w-8" />
                    <span className="font-heading text-base text-brand">{school.shortName}</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1 px-4 pb-6">
                  {mainNav.map((item) =>
                    item.children ? (
                      <div key={item.label} className="py-1">
                        <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          {item.label}
                        </p>
                        {item.children.map((child) => (
                          <SheetClose asChild key={child.href}>
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
                          href={item.href!}
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
                      <Link href="/admissions">
                        <GraduationCap className="size-4" />
                        Apply for Admission
                      </Link>
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}
