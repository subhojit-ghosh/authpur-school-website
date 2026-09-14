import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { LeadershipMessage } from "@/components/leadership-message";
import { principal } from "@/lib/site";

export const metadata: Metadata = {
  title: "Principal's Message",
  description:
    "A message from the Principal of Authpur National Model Higher Secondary School.",
};

export default function PrincipalsMessagePage() {
  return (
    <>
      <PageBanner
        eyebrow="Leadership"
        title="Principal's Message"
        subtitle="A warm welcome from our Principal, on the values and everyday care that shape life at our school."
      />
      <LeadershipMessage person={principal} />
    </>
  );
}
