import Link from "next/link";
import { Check } from "lucide-react";
import { getHomeContent } from "@/lib/page-content";
import { toLines } from "@/lib/page-content-types";
import { SectionIntro } from "@/components/section-intro";
import { RevealGroup, RevealItem } from "@/components/motion";

/** One school colour per stage, youngest first. */
const stageColours = [
  { block: "bg-gold text-gold-foreground", tick: "text-gold-ink" },
  { block: "bg-leaf text-white", tick: "text-leaf" },
  { block: "bg-vermilion text-white", tick: "text-vermilion" },
  { block: "bg-sky text-white", tick: "text-sky" },
];

/**
 * "Class I – V" is set as a small "Class" over large numerals, which is the
 * part a parent scans for. Anything not starting with "Class" is shown whole.
 */
function splitGrades(grades: string): { lead: string; range: string } {
  const m = grades.trim().match(/^(class(?:es)?)\s+(.+)$/i);
  return m ? { lead: m[1], range: m[2] } : { lead: "", range: grades.trim() };
}

export async function Academics() {
  const { academics } = await getHomeContent();

  return (
    <section id="academics" className="scroll-mt-28 py-20 lg:py-28">
      <div className="container-edge">
        <SectionIntro split kicker={academics.eyebrow} heading={academics.heading} blurb={academics.blurb} />

        <RevealGroup className="mt-12 grid gap-6 md:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {academics.programmes.map((p, i) => {
            const colour = stageColours[i % stageColours.length];
            const grades = splitGrades(p.grades);
            return (
              <RevealItem as="article" key={p.title} className="flex flex-col overflow-hidden rounded-lg bg-mist">
                {p.grades ? (
                  <div className={`px-7 pb-6 pt-7 ${colour.block}`}>
                    {grades.lead ? <p className="text-lg font-semibold opacity-85">{grades.lead}</p> : null}
                    <p className="font-heading text-6xl font-bold leading-none tracking-tight sm:text-7xl">
                      {grades.range}
                    </p>
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="font-heading text-2xl font-semibold text-brand">{p.title}</h3>
                  <p className="mt-3 flex-1 text-pretty text-[17px] leading-relaxed text-foreground/80">{p.blurb}</p>
                  <ul className="mt-6 space-y-2.5 border-t border-brand/10 pt-5">
                    {toLines(p.points).map((pt) => (
                      <li key={pt} className="flex items-start gap-3 text-[17px] text-foreground">
                        <Check className={`mt-1 size-4 shrink-0 ${colour.tick}`} strokeWidth={3} />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <p className="mt-10">
          <Link
            href="/admissions"
            className="text-link text-lg"
          >
            How admission works for each class
          </Link>
        </p>
      </div>
    </section>
  );
}
