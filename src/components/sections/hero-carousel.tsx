"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type HeroImage = { src: string; alt: string };
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 5000;

export function HeroCarousel({ images }: { images: HeroImage[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const count = Math.max(images.length, 1);

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
      {/*
        The band's height follows its width rather than being a fixed number of
        pixels. Banners keep whatever shape staff upload (the browser only
        scales them to 1920px wide), so a fixed height made the slot far wider
        than the photographs on a large screen and `object-cover` answered that
        by cutting the top and bottom off. These ratios stay near the shape of
        an ordinary photograph, and the cap stops the hero from swallowing the
        page on a very wide monitor.
      */}
      <div className="relative aspect-4/3 max-h-[720px] w-full overflow-hidden bg-brand sm:aspect-16/9 lg:aspect-2/1">
        {images.map((img, i) => (
          // Deliberately a plain <img>: banners are already resized to 1920px
          // and re-encoded as WebP in the browser before upload, and they are
          // served from Blob storage, so next/image would re-optimise work that
          // is already done.
          // oxlint-disable-next-line nextjs/no-img-element
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
          {images.map((_, i) => (
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
