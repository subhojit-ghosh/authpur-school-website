import {
  GraduationCap,
  ArrowRight,
  Sparkles,
  BadgeCheck,
  Award,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Crest } from "@/components/crest";
import { school, stats } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-b from-accent/60 via-background to-background" />
        <div className="bg-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute -left-32 top-40 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
      </div>

      <div className="container-edge grid items-center gap-12 pt-12 pb-10 lg:grid-cols-[1.05fr_0.95fr] lg:pt-16 lg:pb-12">
        {/* Copy */}
        <div>
          <span className="eyebrow">
            <Sparkles className="size-3.5 text-gold" />
            Admissions open · 2026–27
          </span>

          <h1 className="mt-5 text-balance font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-brand sm:text-5xl lg:text-6xl">
            Where young minds move from{" "}
            <span className="text-gradient-gold">darkness to light.</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {school.name} is a co-educational institution in Shyamnagar, nurturing
            students from pre-primary through Class 12 with academic excellence, strong
            values and a genuine love of learning.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              className="h-12 bg-gold px-7 text-[15px] font-semibold text-gold-foreground shadow-sm hover:bg-gold/90 [&_svg:not([class*='size-'])]:size-[18px]"
            >
              <a href="/admissions">
                <GraduationCap />
                Apply for Admission
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-brand/20 px-7 text-[15px] [&_svg:not([class*='size-'])]:size-[18px]"
            >
              <a href="#about">
                Discover the School
                <ArrowRight />
              </a>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <BadgeCheck className="size-4 text-brand" />
              Affiliated to WBBSE &amp; WBCHSE
            </span>
            <span className="flex items-center gap-2">
              <Award className="size-4 text-brand" />
              40+ years of trust
            </span>
          </div>
        </div>

        {/* Visual */}
        <div className="relative">
          <div className="relative mx-auto max-w-md">
            {/* Main panel */}
            <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-brand shadow-2xl shadow-brand/25">
              <div className="bg-grid absolute inset-0 opacity-[0.12]" />
              <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/30 blur-2xl" />
              <div className="relative flex flex-col items-center px-8 py-14 text-center text-brand-foreground">
                <div className="grid size-24 place-items-center rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur">
                  <Crest className="h-16 w-16" />
                </div>
                <p className="mt-6 font-heading text-2xl font-semibold">{school.shortName}</p>
                <p className="mt-2 text-sm text-brand-foreground/70">
                  {school.tagline}
                </p>
                <p className="mt-6 font-heading text-lg italic text-gold">“{school.motto}”</p>
                <p className="mt-1 text-xs text-brand-foreground/55">{school.mottoMeaning}</p>
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute -left-6 top-10 hidden rounded-2xl border bg-card p-4 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-gold-soft text-gold-foreground">
                  <Award className="size-5" />
                </span>
                <div className="leading-tight">
                  <p className="font-heading text-xl font-semibold text-brand">98%</p>
                  <p className="text-xs text-muted-foreground">Board pass rate</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-4 hidden rounded-2xl border bg-card p-4 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-accent text-brand">
                  <BookOpen className="size-5" />
                </span>
                <div className="leading-tight">
                  <p className="font-heading text-xl font-semibold text-brand">3 Streams</p>
                  <p className="text-xs text-muted-foreground">Science · Commerce · Arts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="container-edge pb-14 lg:pb-20">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border shadow-lg lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-card px-6 py-7 text-center">
              <p className="font-heading text-3xl font-semibold text-brand sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">{s.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{s.hint}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
