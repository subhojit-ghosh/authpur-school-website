import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Academics } from "@/components/sections/academics";
import { WhyUs } from "@/components/sections/why-us";
import { Campus } from "@/components/sections/campus";
import { Notices } from "@/components/sections/notices";
import { Testimonials } from "@/components/sections/testimonials";
import { Admissions } from "@/components/sections/admissions";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Academics />
      <WhyUs />
      <Campus />
      <Notices />
      <Testimonials />
      <Admissions />
      <Contact />
    </>
  );
}
