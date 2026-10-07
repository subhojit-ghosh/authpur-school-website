import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The school's crest, from the artwork the school supplied. public/crest.png
 * is a 512px copy made by scripts/build-logo.mjs from scripts/logo-source.png;
 * next/image serves each visitor a WebP resized to what the page shows, so a
 * 40px crest downloads a few kilobytes. The favicon and home-screen icons are
 * made by the same script.
 */
export function Crest({ className, preload = false }: { className?: string; preload?: boolean }) {
  return (
    <Image
      src="/crest.png"
      alt="Authpur National Model Higher Secondary School crest"
      // The largest crest on the site is 64px across; 128 covers it on
      // high-density screens.
      width={128}
      height={128}
      preload={preload}
      className={cn("h-10 w-10 object-contain", className)}
    />
  );
}
