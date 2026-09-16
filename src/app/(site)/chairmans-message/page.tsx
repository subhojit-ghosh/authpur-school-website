import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { LeadershipMessage } from "@/components/leadership-message";
import { getIdentity, getLeadership, getPageBanners } from "@/lib/page-content";

export const metadata: Metadata = {
  title: "Chairman's Message",
  description:
    "A message from the Chairman of the Governing Body of Authpur National Model Higher Secondary School.",
};

export const revalidate = 3600;

export default async function ChairmansMessagePage() {
  const [{ chairman }, banners, id] = await Promise.all([getLeadership(), getPageBanners(), getIdentity()]);
  const banner = banners.chairmansMessage;

  return (
    <>
      <PageBanner eyebrow={banner.eyebrow} title={banner.title} subtitle={banner.subtitle} />
      <LeadershipMessage
        person={chairman}
        motto={id.motto ? `${id.motto} — “${id.mottoMeaning}”` : undefined}
      />
    </>
  );
}
