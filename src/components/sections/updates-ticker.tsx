import Link from "next/link";
import { getNotices } from "@/lib/content";
import type { Notice } from "@/db/schema";
import { noticePath } from "@/lib/permalinks";

function TickerItems({ items, hidden }: { items: Notice[]; hidden?: boolean }) {
  return (
    <>
      {items.map((n) => (
        <Link
          key={n.id}
          href={noticePath(n)}
          tabIndex={hidden ? -1 : undefined}
          aria-hidden={hidden}
          className="group flex shrink-0 items-center gap-3 whitespace-nowrap px-6 py-3 text-[15px]"
        >
          <span className="font-semibold text-gold-ink">{n.tag}</span>
          <span className="text-foreground transition-colors group-hover:text-brand group-hover:underline group-hover:underline-offset-4">
            {n.title}
          </span>
        </Link>
      ))}
    </>
  );
}

export async function UpdatesTicker() {
  const items = await getNotices({ limit: 6 });
  if (!items.length) return null;

  return (
    <section aria-label="Latest updates" className="container-edge mt-8 lg:mt-10">
      <div className="flex items-stretch overflow-hidden rounded-lg border bg-card">
        <p className="z-10 flex shrink-0 items-center bg-vermilion px-4 font-heading text-[15px] font-semibold text-white sm:px-5">
          Latest
        </p>
        {/* The list is doubled so the scroll loops without a gap; the copy is
            hidden from screen readers and the keyboard. */}
        <div className="marquee-group relative flex-1 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-card to-transparent" />
          <div className="flex w-max animate-marquee">
            <TickerItems items={items} />
            <TickerItems items={items} hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
