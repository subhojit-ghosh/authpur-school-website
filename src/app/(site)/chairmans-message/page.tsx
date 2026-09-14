import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { LeadershipMessage } from "@/components/leadership-message";
import { chairman } from "@/lib/site";

export const metadata: Metadata = {
  title: "Chairman's Message",
  description:
    "A message from the Chairman of the Governing Body of Authpur National Model Higher Secondary School.",
};

export default function ChairmansMessagePage() {
  return (
    <>
      <PageBanner
        eyebrow="Leadership"
        title="Chairman's Message"
        subtitle="A few words from the Chairman of our Governing Body on the vision that guides our school."
      />
      <LeadershipMessage person={chairman} />
    </>
  );
}
