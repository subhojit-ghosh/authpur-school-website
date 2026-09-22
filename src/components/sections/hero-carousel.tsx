"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import {
  BookOpen,
  CalendarClock,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Images,
  MapPin,
  Megaphone,
  Phone,
  type LucideIcon,
} from "lucide-react";
import type { QuickLink } from "@/lib/page-content-types";
import { cn } from "@/lib/utils";

export type HeroImage = { src: string; alt: string };

const AUTOPLAY_MS = 6000;

/** Keys match QUICK_LINK_ICONS, the choices offered in the admin panel. */
const quickIcons: Record<string, LucideIcon> = {
  apply: GraduationCap,
  notices: Megaphone,
  timings: CalendarClock,
  gallery: Images,
  events: CalendarDays,
  phone: Phone,
  book: BookOpen,
  map: MapPin,
};

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fewer than four quick links still fill the row. */
const quickColumns = ["", "lg:grid-cols-1", "lg:grid-cols-2", "lg:grid-cols-3", "lg:grid-cols-4"];

/** One school colour per quick link, in the order of the stripe. */
const quickColours = [
  { bar: "bg-vermilion", icon: "text-vermilion" },
  { bar: "bg-gold", icon: "text-gold-ink" },
  { bar: "bg-leaf", icon: "text-leaf" },
  { bar: "bg-sky", icon: "text-sky" },
];

export function HeroCarousel({
  images,
  name,
  lines,
  quickLinks,
}: {
  images: HeroImage[];
  /** The school's full name, set as the banner headline. */
  name: string;
  /** Short facts under the name, such as the board affiliation. Empty ones are skipped. */
  lines: string[];
  quickLinks: QuickLink[];
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = Math.max(images.length, 1);

  const go = useCallback((n: number) => setIndex((n + count) % count), [count]);

  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, count]);

  const facts = lines.filter(Boolean);
  const words = name.split(/\s+/).filter(Boolean);

  // As the page scrolls away, the photograph drifts down more slowly than the
  // page and the words rise and fade, so the banner reads as a deep layer.
  const bannerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: bannerRef, offset: ["start start", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 160]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -80]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0.2]);

  return (
    <section id="home-hero" aria-label="Welcome" className="relative">
      <div
        ref={bannerRef}
        aria-roledescription="carousel"
        className="relative h-[520px] w-full overflow-hidden bg-brand sm:h-[580px] lg:h-[clamp(560px,76vh,760px)]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <motion.div className="absolute inset-0" style={{ y: photoY }}>
        {images.map((img, i) => (
          // Deliberately a plain <img>: banners are already resized to 1920px
          // and re-encoded as WebP in the browser before upload, so next/image
          // would re-optimise work that is already done.
          // oxlint-disable-next-line nextjs/no-img-element
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            loading="eager"
            fetchPriority={i === 0 ? "high" : "low"}
            aria-hidden={i !== index}
            // Each photograph eases out of a slight zoom while it is showing.
            style={{ transition: "opacity 1.2s ease-out, transform 7s ease-out" }}
            className={cn(
              "absolute inset-0 h-full w-full object-cover object-[center_40%] motion-reduce:scale-100!",
              i === index ? "scale-100 opacity-100" : "scale-110 opacity-0",
            )}
          />
        ))}
        </motion.div>

        {/* Navy from the left so the name reads over any photograph, and from
            the foot so the quick links sit on a settled edge. */}
        <div className="absolute inset-0 bg-linear-to-r from-brand/90 via-brand/55 to-brand/5" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-brand/60 to-transparent" />

        <motion.div
          className="container-edge relative flex h-full flex-col justify-center pb-24 lg:pb-32"
          style={{ y: copyY, opacity: copyOpacity }}
        >
          <motion.p
            className="font-heading text-lg font-medium text-gold sm:text-xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            Welcome to
          </motion.p>
          {/* The name rises into place word by word, each from behind its own mask. */}
          <h1
            aria-label={name}
            className="mt-3 max-w-4xl text-balance font-heading text-[2.6rem] font-bold leading-[1.08] text-white sm:text-6xl lg:text-7xl"
          >
            {words.map((w, i) => (
              <Fragment key={`${w}-${i}`}>
                <span aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <motion.span
                    className="inline-block"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.15 + i * 0.07 }}
                  >
                    {w}
                  </motion.span>
                </span>
                {i < words.length - 1 ? " " : null}
              </Fragment>
            ))}
          </h1>
          {facts.length ? (
            <motion.ul
              className="mt-6 flex flex-col gap-1 text-lg text-white/85 sm:flex-row sm:flex-wrap sm:gap-x-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.45 + words.length * 0.07 }}
            >
              {facts.map((f, i) => (
                <li key={f} className="flex items-center gap-5">
                  {i > 0 ? <span aria-hidden className="hidden h-4 w-px bg-white/40 sm:block" /> : null}
                  {f}
                </li>
              ))}
            </motion.ul>
          ) : null}
          <motion.div
            className="mt-9"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.6 + words.length * 0.07 }}
          >
            <Link
              href="#about"
              className="inline-flex h-12 items-center rounded-md border-2 border-white/70 px-6 text-[15px] font-semibold text-white transition-colors hover:border-white hover:bg-white hover:text-brand"
            >
              About our school
            </Link>
          </motion.div>
        </motion.div>

        {count > 1 ? (
          <div className="absolute bottom-6 right-5 z-10 flex items-center gap-3 sm:right-8 lg:bottom-32 lg:right-10">
            <button
              onClick={() => go(index - 1)}
              aria-label="Previous photograph"
              className="grid size-10 place-items-center rounded-full border border-white/40 text-white transition-colors hover:bg-white hover:text-brand"
            >
              <ChevronLeft className="size-5" />
            </button>
            <div className="flex items-center gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Show photograph ${i + 1}`}
                  aria-current={i === index}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === index ? "w-8 bg-gold" : "w-3 bg-white/50 hover:bg-white",
                  )}
                />
              ))}
            </div>
            <button
              onClick={() => go(index + 1)}
              aria-label="Next photograph"
              className="grid size-10 place-items-center rounded-full border border-white/40 text-white transition-colors hover:bg-white hover:text-brand"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        ) : null}
      </div>

      {/* Quick links, lifted over the foot of the photograph on wide screens */}
      {quickLinks.length ? (
        <div className="container-edge relative z-10 mt-6 lg:-mt-20">
          <ul className={cn("grid grid-cols-2 gap-3 sm:gap-4", quickColumns[Math.min(quickLinks.length, 4)])}>
            {quickLinks.map((q, i) => {
              const Icon = quickIcons[q.icon] ?? GraduationCap;
              const colour = quickColours[i % quickColours.length];
              return (
                <motion.li
                  key={`${q.label}-${q.href}`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.5 + i * 0.1 }}
                >
                  <Link
                    href={q.href}
                    className="group flex h-full flex-col overflow-hidden rounded-lg border bg-card shadow-lg shadow-brand/10 transition-[box-shadow,translate] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/15 motion-reduce:hover:translate-y-0"
                  >
                    <span className={cn("h-1.5", colour.bar)} />
                    <span className="flex flex-1 flex-col gap-3 p-4 sm:flex-row sm:items-start sm:gap-4 sm:p-6">
                      <Icon className={cn("size-8 shrink-0", colour.icon)} strokeWidth={1.6} />
                      <span>
                        <span className="block font-heading text-lg font-semibold leading-tight text-brand group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
                          {q.label}
                        </span>
                        <span className="mt-1 hidden text-[15px] leading-snug text-muted-foreground sm:block">
                          {q.text}
                        </span>
                      </span>
                    </span>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
