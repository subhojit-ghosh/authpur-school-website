import { Reveal } from "@/components/motion";
import { cn } from "@/lib/utils";

/**
 * The kicker, heading and blurb that open a homepage section. Every piece is
 * staff-edited wording, so any of them may be empty and is then left out.
 * `split` puts the blurb in a column beside the heading on wide screens.
 */
export function SectionIntro({
  kicker,
  heading,
  blurb,
  tone = "light",
  split = false,
  className,
}: {
  kicker?: string;
  heading: string;
  blurb?: string;
  tone?: "light" | "dark";
  split?: boolean;
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <Reveal
      className={cn(
        split ? "grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-10" : "max-w-3xl",
        className,
      )}
    >
      <div className={split ? "lg:col-span-7" : undefined}>
        {kicker ? <p className={cn("kicker", dark && "text-gold")}>{kicker}</p> : null}
        <h2 className={cn("section-title mt-3", dark && "text-brand-foreground")}>{heading}</h2>
      </div>
      {blurb ? (
        <p
          className={cn(
            "text-pretty text-lg leading-relaxed",
            dark ? "text-brand-foreground/75" : "text-muted-foreground",
            split ? "lg:col-span-5 lg:pb-1" : "mt-5",
          )}
        >
          {blurb}
        </p>
      ) : null}
    </Reveal>
  );
}
