import { Award, BadgeCheck } from "lucide-react";
import { getHomeContent, getIdentity } from "@/lib/page-content";

/** The trust lines and four figures shown directly under the banner carousel. */
export async function StatsBand() {
  const [home, id] = await Promise.all([getHomeContent(), getIdentity()]);

  return (
    <section className="border-b bg-background py-10 lg:py-12">
      <div className="container-edge">
        {id.affiliationLine || id.trustLine ? (
          <div className="mb-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {id.affiliationLine ? (
              <span className="flex items-center gap-2">
                <BadgeCheck className="size-4 text-brand" />
                {id.affiliationLine}
              </span>
            ) : null}
            {id.affiliationLine && id.trustLine ? <span className="hidden h-4 w-px bg-border sm:block" /> : null}
            {id.trustLine ? (
              <span className="flex items-center gap-2">
                <Award className="size-4 text-brand" />
                {id.trustLine}
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border shadow-sm lg:grid-cols-4">
          {home.stats.map((s) => (
            <div key={s.label} className="bg-card px-6 py-7 text-center">
              <p className="font-heading text-3xl font-semibold text-brand sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm font-medium text-foreground">{s.label}</p>
              {s.hint ? <p className="mt-0.5 text-xs text-muted-foreground">{s.hint}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
