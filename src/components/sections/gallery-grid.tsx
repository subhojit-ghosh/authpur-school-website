"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import { gallery, galleryCategories } from "@/lib/site";
import { cn } from "@/lib/utils";

export function GalleryGrid() {
  const [active, setActive] = useState<string>("All");
  const tiles = active === "All" ? gallery : gallery.filter((g) => g.category === active);

  return (
    <div className="container-edge">
      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-2">
        {galleryCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              active === cat
                ? "bg-brand text-brand-foreground"
                : "border bg-card text-foreground/70 hover:bg-accent hover:text-brand",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {tiles.map((tile) => (
          <figure
            key={tile.label}
            className={cn(
              "group relative aspect-4/3 overflow-hidden rounded-2xl bg-linear-to-br shadow-md ring-1 ring-black/5",
              tile.gradient,
            )}
          >
            <div className="bg-grid absolute inset-0 opacity-10" />
            <div className="absolute inset-0 bg-linear-to-t from-black/55 to-transparent" />
            <span className="absolute left-4 top-4 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
              {tile.category}
            </span>
            <figcaption className="absolute bottom-4 left-4 right-4 font-heading text-base font-semibold text-white drop-shadow sm:text-lg">
              {tile.label}
            </figcaption>
          </figure>
        ))}
      </div>

      <p className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Camera className="size-3.5" />
        Placeholder gallery — real photographs from the school can be dropped in here.
      </p>
    </div>
  );
}
