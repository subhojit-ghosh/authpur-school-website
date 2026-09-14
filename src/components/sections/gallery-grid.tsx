"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import { gallery, galleryCategories } from "@/lib/site";
import { cn } from "@/lib/utils";

export type GalleryGridPhoto = { id: number; url: string; thumbUrl: string; caption: string; category: string };

function Filters({ active, onChange }: { active: string; onChange: (c: string) => void }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {galleryCategories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-colors",
            active === cat ? "bg-brand text-brand-foreground" : "border bg-card text-foreground/70 hover:bg-accent hover:text-brand",
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

/** Real photographs uploaded through the admin panel. */
function PhotoGrid({ photos }: { photos: GalleryGridPhoto[] }) {
  const [active, setActive] = useState<string>("All");
  const shown = active === "All" ? photos : photos.filter((p) => p.category === active);

  return (
    <div className="container-edge">
      <Filters active={active} onChange={setActive} />

      {shown.length ? (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {shown.map((p) => (
            <figure key={p.id} className="group relative aspect-4/3 overflow-hidden rounded-2xl bg-muted shadow-md ring-1 ring-black/5">
              <a href={p.url} target="_blank" rel="noreferrer" aria-label={p.caption || `${p.category} photo`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.thumbUrl}
                  alt={p.caption || p.category}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </a>
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-black/0 to-transparent" />
              <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                {p.category}
              </span>
              {p.caption ? (
                <figcaption className="pointer-events-none absolute bottom-4 left-4 right-4 font-heading text-base font-semibold text-white drop-shadow sm:text-lg">
                  {p.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      ) : (
        <p className="mt-10 rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground">
          No photos in this category yet.
        </p>
      )}
    </div>
  );
}

/** Styled placeholders shown until the first real photo is uploaded. */
function PlaceholderGrid() {
  const [active, setActive] = useState<string>("All");
  const tiles = active === "All" ? gallery : gallery.filter((g) => g.category === active);

  return (
    <div className="container-edge">
      <Filters active={active} onChange={setActive} />

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {tiles.map((tile) => (
          <figure
            key={tile.label}
            className={cn("group relative aspect-4/3 overflow-hidden rounded-2xl bg-linear-to-br shadow-md ring-1 ring-black/5", tile.gradient)}
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
        Photographs are coming soon.
      </p>
    </div>
  );
}

export function GalleryGrid({ photos }: { photos: GalleryGridPhoto[] }) {
  return photos.length ? <PhotoGrid photos={photos} /> : <PlaceholderGrid />;
}
