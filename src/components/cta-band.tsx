import Link from "next/link";
import { GraduationCap, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion";
import { telHref } from "@/lib/settings-types";

/**
 * The navy closing band on inner pages: a line of encouragement, the enquiry
 * button and the admissions phone number.
 */
export function CtaBand({
  heading = "Ready to take the next step?",
  text = "Send us an enquiry or call the school office. Our admissions team will guide you through every step.",
  phone,
}: {
  heading?: string;
  text?: string;
  phone: string;
}) {
  return (
    <section className="bg-brand text-brand-foreground">
      <div className="school-stripe h-1.5" />
      <Reveal className="container-edge flex flex-col gap-8 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-20">
        <div className="max-w-2xl">
          <h2 className="text-balance font-heading text-3xl font-semibold leading-tight text-white sm:text-4xl">{heading}</h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-white/80">{text}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Button
            asChild
            size="lg"
            className="h-12 rounded-md bg-gold px-7 text-base font-semibold text-gold-foreground hover:bg-gold/90 [&_svg:not([class*='size-'])]:size-[18px]"
          >
            <Link href="/admission-enquiry">
              <GraduationCap />
              Start an enquiry
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 rounded-md border-2 border-white/60 bg-transparent px-7 text-base font-semibold text-white hover:bg-white hover:text-brand [&_svg:not([class*='size-'])]:size-[18px]"
          >
            <a href={telHref(phone)}>
              <Phone />
              Call {phone}
            </a>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
