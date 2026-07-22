"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, BadgeCheck, Award } from "lucide-react";
import { heroImages, stats } from "@/lib/site";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 5000;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const count = heroImages.length;

  const go = useCallback((n: number) => setIndex((n + count) % count), [count]);

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, count]);

  return (
    <section
      id="home-hero"
      aria-roledescription="carousel"
      aria-label="School highlights"
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[190px] w-full overflow-hidden bg-brand sm:h-[240px] lg:h-[320px] xl:h-[360px]">
        {heroImages.map((img, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            loading="eager"
            fetchPriority={i === 0 ? "high" : "low"}
            aria-hidden={i !== index}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out",
              i === index ? "opacity-100" : "opacity-0",
            )}
          />
        ))}

        {/* Arrows */}
        <button
          onClick={() => go(index - 1)}
          aria-label="Previous image"
          className="absolute left-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/25 text-white ring-1 ring-white/30 backdrop-blur transition-colors hover:bg-black/45 lg:left-5 lg:size-11"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          onClick={() => go(index + 1)}
          aria-label="Next image"
          className="absolute right-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/25 text-white ring-1 ring-white/30 backdrop-blur transition-colors hover:bg-black/45 lg:right-5 lg:size-11"
        >
          <ChevronRight className="size-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 lg:bottom-6">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to image ${i + 1}`}
              aria-current={i === index}
              className={cn(
                "h-2 rounded-full ring-1 ring-black/10 transition-all",
                i === index ? "w-7 bg-gold" : "w-2 bg-white/70 hover:bg-white",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function StatsBand() {
  return (
    <section className="border-b bg-background py-10 lg:py-12">
      <div className="container-edge">
        <div className="mb-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <BadgeCheck className="size-4 text-brand" />
            Affiliated to WBBSE &amp; WBCHSE
          </span>
          <span className="hidden h-4 w-px bg-border sm:block" />
          <span className="flex items-center gap-2">
            <Award className="size-4 text-brand" />
            40+ years of trust
          </span>
        </div>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border shadow-sm lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-card px-6 py-7 text-center">
              <p className="font-heading text-3xl font-semibold text-brand sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm font-medium text-foreground">{s.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{s.hint}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
