import { Quote } from "lucide-react";
import { RichText } from "@/components/rich-text";


type Person = {
  name: string;
  role: string;
  initials: string;
  /** Formatted message written in the admin panel. */
  message: string;
};

export function LeadershipMessage({ person, motto }: { person: Person; motto?: string }) {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-edge grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* Portrait card */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
            <div className="relative flex aspect-4/5 items-center justify-center bg-linear-to-br from-brand via-brand-muted to-brand">
              <div className="bg-grid absolute inset-0 opacity-10" />
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/25 blur-2xl" />
              <span className="relative grid size-28 place-items-center rounded-full bg-white/10 font-heading text-4xl font-semibold text-brand-foreground ring-1 ring-white/20 backdrop-blur">
                {person.initials}
              </span>
            </div>
            <div className="p-6 text-center">
              <p className="font-heading text-xl font-semibold text-brand">{person.name}</p>
              <p className="mt-1 text-sm font-medium text-gold-foreground">{person.role}</p>
            </div>
          </div>
        </div>

        {/* Message */}
        <div>
          <Quote className="size-10 text-gold" />
          <RichText
            html={person.message}
            className="mt-4 text-base [&>p:first-child]:text-pretty [&>p:first-child]:font-heading [&>p:first-child]:text-xl [&>p:first-child]:leading-relaxed [&>p:first-child]:text-foreground [&>p:first-child]:first-letter:float-left [&>p:first-child]:first-letter:mr-2 [&>p:first-child]:first-letter:font-heading [&>p:first-child]:first-letter:text-6xl [&>p:first-child]:first-letter:font-semibold [&>p:first-child]:first-letter:leading-[0.8] [&>p:first-child]:first-letter:text-brand [&_p]:my-5 [&_p]:text-pretty [&_p]:leading-relaxed"
          />

          <div className="mt-10 border-t pt-6">
            <p className="font-heading text-2xl italic text-brand">{person.name}</p>
            <p className="text-sm text-muted-foreground">{person.role}</p>
            <p className="mt-4 font-heading text-sm italic text-gold-foreground">
              {motto}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
