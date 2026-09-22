import { GraduationCap, Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSchoolInfo } from "@/lib/settings";
import { getHomeContent } from "@/lib/page-content";
import { telHref } from "@/lib/settings-types";
import type { HeroImage } from "@/components/sections/hero-carousel";
import { Parallax, Reveal, RevealGroup, RevealItem } from "@/components/motion";

export async function Admissions({ photo }: { photo?: HeroImage }) {
  const [info, home] = await Promise.all([getSchoolInfo(), getHomeContent()]);
  const cta = home.admissionsCta;

  return (
    <section id="admissions" className="relative scroll-mt-28 overflow-hidden bg-brand text-brand-foreground">
      {photo ? (
        <Parallax className="absolute! inset-0" strength={90}>
          {/* oxlint-disable-next-line nextjs/no-img-element -- already resized on upload */}
          <img src={photo.src} alt="" loading="lazy" className="h-full w-full object-cover" />
        </Parallax>
      ) : null}
      <div className="absolute inset-0 bg-brand/85" />

      <div className="container-edge relative py-20 lg:py-28">
        <Reveal className="max-w-3xl">
          {cta.eyebrow ? <p className="kicker text-gold">{cta.eyebrow}</p> : null}
          <h2 className="section-title mt-3 text-white sm:text-5xl">{cta.heading}</h2>
          {cta.blurb ? (
            <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-white/80">{cta.blurb}</p>
          ) : null}
        </Reveal>

        {/* The steps really are a sequence, so they are numbered. */}
        {cta.steps.length ? (
          <RevealGroup as="ol" className="mt-12 grid gap-8 md:grid-cols-3 lg:mt-14">
            {cta.steps.map((s, i) => (
              <RevealItem as="li" key={s.title} className="border-t border-white/25 pt-6">
                <span className="font-heading text-5xl font-bold leading-none text-gold">{i + 1}</span>
                <p className="mt-4 font-heading text-xl font-semibold text-white">{s.title}</p>
                <p className="mt-1.5 text-[17px] leading-relaxed text-white/75">{s.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        ) : null}

        <Reveal className="mt-12 flex flex-wrap gap-3">
          <Button
            size="lg"
            className="h-12 rounded-md bg-gold px-7 text-base font-semibold text-gold-foreground hover:bg-gold/90 [&_svg:not([class*='size-'])]:size-[18px]"
            asChild
          >
            <Link href="/admission-enquiry">
              <GraduationCap />
              Start an enquiry
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 rounded-md border-2 border-white/60 bg-transparent px-7 text-base font-semibold text-white hover:bg-white hover:text-brand [&_svg:not([class*='size-'])]:size-[18px]"
            asChild
          >
            <a href={telHref(info.admissionsPhone)}>
              <Phone />
              Call {info.admissionsPhone}
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
