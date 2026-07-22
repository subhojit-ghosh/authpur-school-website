import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Crest } from "@/components/crest";

export function PageBanner({
  title,
  subtitle,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-brand text-brand-foreground">
      <div className="bg-grid absolute inset-0 opacity-[0.1]" />
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
      <div className="absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 opacity-10 lg:block">
        <Crest className="h-48 w-48" />
      </div>

      <div className="container-edge relative py-14 lg:py-20">
        <nav className="flex items-center gap-1.5 text-sm text-brand-foreground/60">
          <Link href="/" className="transition-colors hover:text-gold">
            Home
          </Link>
          <ChevronRight className="size-4" />
          <span className="text-brand-foreground/90">{title}</span>
        </nav>

        {eyebrow ? (
          <p className="eyebrow mt-6 text-gold">{eyebrow}</p>
        ) : null}
        <h1 className="mt-3 max-w-3xl text-balance font-heading text-3xl font-semibold sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-brand-foreground/75">
            {subtitle}
          </p>
        ) : null}
      </div>
    </section>
  );
}
