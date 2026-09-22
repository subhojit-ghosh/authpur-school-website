"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { galleryCategories } from "@/lib/site";
import { cn } from "@/lib/utils";

export type GalleryGridPhoto = { id: number; url: string; thumbUrl: string; caption: string; category: string };

const EASE = [0.22, 1, 0.36, 1] as const;

/** Each category button takes a school colour when chosen. */
const categoryColours: Record<string, string> = {
  All: "bg-brand text-white border-brand",
  Campus: "bg-leaf text-white border-leaf",
  Academics: "bg-sky text-white border-sky",
  Sports: "bg-vermilion text-white border-vermilion",
  Events: "bg-gold text-gold-foreground border-gold",
};

function Filters({ active, onChange }: { active: string; onChange: (c: string) => void }) {
  return (
    <div role="group" aria-label="Show photos from" className="flex flex-wrap gap-2">
      {galleryCategories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          aria-pressed={active === cat}
          className={cn(
            "rounded-full border-2 px-5 py-2 text-[15px] font-semibold transition-colors",
            active === cat ? categoryColours[cat] : "border-border bg-card text-brand hover:border-brand",
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

/**
 * The full-size photo over the page. Arrow keys move between photos, Escape
 * closes, and focus returns to the photo that was opened.
 */
function Viewer({
  photos,
  index,
  onClose,
  onMove,
}: {
  photos: GalleryGridPhoto[];
  index: number;
  onClose: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const photo = photos[index];
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onMove(-1);
      if (e.key === "ArrowRight") onMove(1);
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose, onMove]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={photo.caption || photo.category || "Photo"}
      className="fixed inset-0 z-[60] flex flex-col bg-brand/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Clicking anywhere around the photo closes it. Keyboard users have the
          close button and Escape, so this backdrop stays out of the tab order. */}
      <button type="button" aria-hidden tabIndex={-1} onClick={onClose} className="absolute inset-0 cursor-zoom-out" />

      <div className="relative flex items-center justify-between gap-4 px-5 py-4 text-white sm:px-8">
        <p className="text-[15px] text-white/70">
          {index + 1} of {photos.length}
        </p>
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close photo"
          className="grid size-11 place-items-center rounded-full border border-white/30 transition-colors hover:bg-white hover:text-brand"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="pointer-events-none relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20 [&>*]:pointer-events-auto">
        <AnimatePresence mode="wait" initial={false}>
          <motion.figure
            key={photo.id}
            className="flex max-h-full flex-col items-center"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {/* oxlint-disable-next-line nextjs/no-img-element -- already resized on upload */}
            <img
              src={photo.url}
              alt={photo.caption || photo.category}
              className="max-h-[calc(100svh-11rem)] w-auto rounded-md object-contain"
            />
            <figcaption className="mt-4 text-center text-white">
              {photo.category ? <span className="text-[15px] font-semibold text-gold">{photo.category}</span> : null}
              {photo.caption ? <span className="mt-1 block font-heading text-lg">{photo.caption}</span> : null}
            </figcaption>
          </motion.figure>
        </AnimatePresence>

        {photos.length > 1 ? (
          <>
            <button
              onClick={() => onMove(-1)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-white/30 text-white transition-colors hover:bg-white hover:text-brand sm:left-6"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              onClick={() => onMove(1)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-white/30 text-white transition-colors hover:bg-white hover:text-brand sm:right-6"
            >
              <ChevronRight className="size-6" />
            </button>
          </>
        ) : null}
      </div>
    </motion.div>
  );
}

/** Photographs uploaded through the admin panel, filterable by category. */
function PhotoGrid({ photos, filters = true }: { photos: GalleryGridPhoto[]; filters?: boolean }) {
  const [active, setActive] = useState<string>("All");
  const [open, setOpen] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const shown = active === "All" ? photos : photos.filter((p) => p.category === active);

  const close = useCallback(() => {
    setOpen(null);
    opener.current?.focus();
  }, []);
  const move = useCallback(
    (dir: -1 | 1) => setOpen((i) => (i === null ? i : (i + dir + shown.length) % shown.length)),
    [shown.length],
  );

  return (
    <div className="container-edge">
      {filters ? <Filters active={active} onChange={setActive} /> : null}

      {shown.length ? (
        <motion.ul layout className={cn("grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3", filters && "mt-10")}>
          <AnimatePresence initial={false}>
            {shown.map((p, i) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: EASE, delay: (i % 3) * 0.06 }}
              >
                <button
                  onClick={(e) => {
                    opener.current = e.currentTarget;
                    setOpen(i);
                  }}
                  className="group relative block aspect-4/3 w-full overflow-hidden rounded-lg bg-mist text-left"
                  aria-label={`Open ${p.caption || p.category || "photo"}`}
                >
                  {/* oxlint-disable-next-line nextjs/no-img-element -- already resized on upload */}
                  <img
                    src={p.thumbUrl}
                    alt={p.caption || p.category}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 motion-reduce:transition-none"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-brand/80 via-transparent to-transparent" />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 p-4 text-white">
                    {p.category ? <span className="block text-sm font-semibold text-gold">{p.category}</span> : null}
                    {p.caption ? (
                      <span className="mt-0.5 block font-heading text-base font-semibold sm:text-lg">{p.caption}</span>
                    ) : null}
                  </span>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : (
        <p className="mt-10 rounded-lg bg-mist p-8 text-lg text-muted-foreground">
          No photos in this category yet. Choose another category above.
        </p>
      )}

      <AnimatePresence>
        {open !== null && shown[open] ? <Viewer photos={shown} index={open} onClose={close} onMove={move} /> : null}
      </AnimatePresence>
    </div>
  );
}

/**
 * Before the first gallery photo is uploaded, the banner photographs stand in,
 * so the page shows the school rather than empty boxes.
 */
export function GalleryGrid({ photos, fallback }: { photos: GalleryGridPhoto[]; fallback: GalleryGridPhoto[] }) {
  if (photos.length) return <PhotoGrid photos={photos} />;
  return (
    <>
      <PhotoGrid photos={fallback} filters={false} />
      <p className="container-edge mt-8 text-[17px] text-muted-foreground">
        More photographs from around the school are on their way.
      </p>
    </>
  );
}
