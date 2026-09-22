import { getHomeContent } from "@/lib/page-content";
import { CountUp, RevealGroup, RevealItem } from "@/components/motion";

/** Each figure is capped by one of the school colours, in the order of the stripe. */
const ruleColours = ["border-vermilion", "border-gold", "border-leaf", "border-sky"];

/** The four headline figures: year founded, students, teachers, results. */
export async function StatsBand() {
  const home = await getHomeContent();
  if (!home.stats.length) return null;

  return (
    <section aria-label="The school in figures" className="container-edge pt-16 lg:pt-20">
      <RevealGroup as="dl" className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-x-10">
        {home.stats.map((s, i) => (
          <RevealItem key={s.label} className={`border-t-4 pt-5 ${ruleColours[i % ruleColours.length]}`}>
            <dt className="sr-only">{s.label}</dt>
            <dd className="font-heading text-5xl font-semibold tracking-tight text-brand tabular-nums sm:text-6xl">
              <CountUp value={s.value} />
            </dd>
            <dd className="mt-2 text-lg font-semibold text-foreground">{s.label}</dd>
            {s.hint ? <dd className="text-[15px] text-muted-foreground">{s.hint}</dd> : null}
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
