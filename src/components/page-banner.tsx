import Link from "next/link";
import { ChevronRight } from "lucide-react";

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
    <section className="bg-brand text-brand-foreground">
      <div className="container-edge py-14 lg:py-20">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[15px] text-brand-foreground/65">
          <Link href="/" className="transition-colors hover:text-white hover:underline hover:underline-offset-4">
            Home
          </Link>
          <ChevronRight className="size-4" />
          <span className="text-brand-foreground/90">{title}</span>
        </nav>

        {eyebrow ? <p className="kicker mt-8 text-gold">{eyebrow}</p> : null}
        <h1
          className={`max-w-4xl text-balance font-heading text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl ${eyebrow ? "mt-3" : "mt-8"}`}
        >
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-brand-foreground/80">{subtitle}</p>
        ) : null}
      </div>
    </section>
  );
}
