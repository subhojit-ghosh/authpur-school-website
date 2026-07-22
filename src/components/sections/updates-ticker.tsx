import Link from "next/link";
import { Megaphone } from "lucide-react";
import { notices } from "@/lib/site";

function TickerItems() {
  return (
    <>
      {notices.map((n, i) => (
        <Link
          key={i}
          href="/notices"
          className="group flex shrink-0 items-center gap-3 whitespace-nowrap px-6 py-3.5 text-sm"
        >
          <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-gold">
            {n.tag}
          </span>
          <span className="font-medium text-brand-foreground/90 transition-colors group-hover:text-gold">
            {n.title}
          </span>
          <span className="text-brand-foreground/30">•</span>
        </Link>
      ))}
    </>
  );
}

export function UpdatesTicker() {
  return (
    <section aria-label="Latest updates" className="border-b bg-brand text-brand-foreground">
      <div className="flex items-stretch">
        {/* Label */}
        <div className="z-10 flex shrink-0 items-center gap-2 bg-gold px-4 text-gold-foreground shadow-md sm:px-5">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-foreground/70 opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-gold-foreground" />
          </span>
          <Megaphone className="hidden size-4 sm:block" />
          <span className="text-xs font-bold uppercase tracking-[0.14em]">Latest Updates</span>
        </div>

        {/* Scrolling track */}
        <div className="marquee-group relative flex-1 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-brand to-transparent" />
          <div className="flex w-max animate-marquee">
            <TickerItems />
            <TickerItems />
          </div>
        </div>
      </div>
    </section>
  );
}
