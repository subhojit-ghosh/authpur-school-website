"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  BadgeCheck,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Crest } from "@/components/crest";
import { heroSlides, stats } from "@/lib/site";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 5500;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const count = heroSlides.length;

  const go = useCallback((n: number) => setIndex((i) => (n + count) % count), [count]);
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

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
      aria-label="Highlights"
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[520px] overflow-hidden sm:h-[560px] lg:h-[600px]">
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            aria-hidden={i !== index}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-out",
              i === index ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            {/* Background */}
            <div className={cn("absolute inset-0 bg-linear-to-br", slide.gradient)} />
            {slide.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={slide.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
            <div className="bg-grid absolute inset-0 opacity-[0.12]" />
            <div className="absolute inset-0 bg-linear-to-r from-black/45 via-black/10 to-transparent" />
            <div className="absolute -right-24 top-1/2 hidden -translate-y-1/2 opacity-[0.07] lg:block">
              <Crest className="h-[26rem] w-[26rem]" />
            </div>

            {/* Content */}
            <div className="container-edge relative flex h-full items-center">
              <div
                className={cn(
                  "max-w-2xl transition-all duration-700",
                  i === index ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                )}
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white ring-1 ring-white/20 backdrop-blur">
                  {slide.eyebrow}
                </span>
                <h1 className="mt-5 text-balance font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {slide.title}{" "}
                  {slide.highlight ? (
                    <span className="text-gradient-gold">{slide.highlight}.</span>
                  ) : null}
                </h1>
                <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/85 sm:text-lg">
                  {slide.text}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="h-12 bg-gold px-7 text-[15px] font-semibold text-gold-foreground shadow-lg hover:bg-gold/90 [&_svg:not([class*='size-'])]:size-[18px]"
                  >
                    <a href={slide.cta.href}>
                      {slide.cta.label}
                      <ArrowRight />
                    </a>
                  </Button>
                  {slide.secondary ? (
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="h-12 border-white/30 bg-white/5 px-7 text-[15px] text-white backdrop-blur hover:bg-white/15 hover:text-white"
                    >
                      <a href={slide.secondary.href}>{slide.secondary.label}</a>
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Arrows */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur transition-colors hover:bg-white/25 lg:left-6"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur transition-colors hover:bg-white/25 lg:right-6"
        >
          <ChevronRight className="size-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2.5">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className={cn(
                "h-2 rounded-full transition-all",
                i === index ? "w-7 bg-gold" : "w-2 bg-white/50 hover:bg-white/80",
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
