import Image from "next/image";
import { RichText } from "@/components/rich-text";
import { Reveal } from "@/components/motion";

type Person = {
  name: string;
  role: string;
  initials: string;
  /** Uploaded photograph; the initials stand in when there is none. */
  photoUrl?: string;
  /** Formatted message written in the admin panel. */
  message: string;
};

export function LeadershipMessage({ person, motto }: { person: Person; motto?: string }) {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-edge grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Name card, with the photograph when one has been uploaded. */}
        <Reveal className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
          <div className="overflow-hidden rounded-lg bg-brand text-brand-foreground">
            <div className="school-stripe h-1.5" />
            {person.photoUrl ? (
              <div className="relative aspect-4/5 w-full">
                <Image
                  src={person.photoUrl}
                  alt={`${person.name}, ${person.role}`}
                  fill
                  sizes="(min-width: 1024px) 32vw, 100vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : null}
            <div className="px-7 pb-8 pt-10">
              {person.photoUrl ? null : (
                <span aria-hidden className="block font-heading text-8xl font-bold leading-none tracking-tight text-gold">
                  {person.initials}
                </span>
              )}
              <p className={person.photoUrl ? "font-heading text-2xl font-semibold text-white" : "mt-8 font-heading text-2xl font-semibold text-white"}>
                {person.name}
              </p>
              <p className="mt-1 text-[17px] text-white/75">{person.role}</p>
            </div>
          </div>
        </Reveal>

        {/* Message; the first paragraph is set larger as the opening */}
        <Reveal className="lg:col-span-8" delay={0.1}>
          <RichText
            html={person.message}
            className="text-lg leading-relaxed lg:max-w-[66ch] text-foreground/85 [&>p:first-child]:mb-8 [&>p:first-child]:text-pretty [&>p:first-child]:font-heading [&>p:first-child]:text-2xl [&>p:first-child]:font-medium [&>p:first-child]:leading-snug [&>p:first-child]:text-brand sm:[&>p:first-child]:text-[1.7rem] [&_p]:my-5 [&_p]:text-pretty"
          />

          <div className="mt-12 border-t pt-6 lg:max-w-[66ch]">
            <p className="font-heading text-xl font-semibold text-brand">{person.name}</p>
            <p className="text-[17px] text-muted-foreground">{person.role}</p>
            {motto ? <p className="mt-5 font-heading text-lg text-gold-ink">{motto}</p> : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
