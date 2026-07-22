import { GraduationCap, Phone, CalendarCheck, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { school } from "@/lib/site";

const steps = [
  { icon: FileText, title: "Enquire & collect form", text: "Visit the school office or request a form online." },
  { icon: Users, title: "Interaction", text: "A friendly meeting with the child and parents." },
  { icon: CalendarCheck, title: "Confirm admission", text: "Complete the formalities and welcome aboard." },
];

export function Admissions() {
  return (
    <section id="admissions" className="scroll-mt-24 py-20 lg:py-28">
      <div className="container-edge">
        <div className="relative overflow-hidden rounded-[2rem] bg-brand px-6 py-14 shadow-2xl shadow-brand/20 sm:px-12 lg:px-16">
          <div className="bg-grid absolute inset-0 opacity-[0.08]" />
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/25 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

          <div className="relative grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <span className="eyebrow text-gold">Admissions 2026–27</span>
              <h2 className="mt-4 text-balance font-heading text-3xl font-semibold text-brand-foreground sm:text-4xl">
                Give your child a school that feels like a second home
              </h2>
              <p className="mt-4 max-w-lg text-pretty leading-relaxed text-brand-foreground/75">
                Applications are now open for Nursery through Class XI. Seats are limited —
                begin your child&apos;s journey with us today.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="h-12 bg-gold px-7 text-[15px] font-semibold text-gold-foreground hover:bg-gold/90 [&_svg:not([class*='size-'])]:size-[18px]"
                  asChild
                >
                  <a href="/admission-enquiry">
                    <GraduationCap />
                    Start Application
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 border-white/25 bg-transparent px-7 text-[15px] text-brand-foreground hover:bg-white/10 hover:text-brand-foreground [&_svg:not([class*='size-'])]:size-[18px]"
                  asChild
                >
                  <a href={`tel:${school.admissionsPhone.replace(/\s/g, "")}`}>
                    <Phone />
                    {school.admissionsPhone}
                  </a>
                </Button>
              </div>
            </div>

            {/* Steps */}
            <div className="grid gap-4">
              {steps.map((s, i) => (
                <div
                  key={s.title}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-gold/15 font-heading text-lg font-semibold text-gold">
                    {i + 1}
                  </span>
                  <div>
                    <p className="flex items-center gap-2 font-semibold text-brand-foreground">
                      <s.icon className="size-4 text-gold" />
                      {s.title}
                    </p>
                    <p className="mt-0.5 text-sm text-brand-foreground/70">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
