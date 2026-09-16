import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { LeadershipMessage } from "@/components/leadership-message";
import { getIdentity, getLeadership, getPageBanners } from "@/lib/page-content";

export const metadata: Metadata = {
  title: "Principal's Message",
  description:
    "A message from the Principal of Authpur National Model Higher Secondary School.",
};

export const revalidate = 3600;

export default async function PrincipalsMessagePage() {
  const [{ principal }, banners, id] = await Promise.all([getLeadership(), getPageBanners(), getIdentity()]);
  const banner = banners.principalsMessage;

  return (
    <>
      <PageBanner eyebrow={banner.eyebrow} title={banner.title} subtitle={banner.subtitle} />
      <LeadershipMessage
        person={principal}
        motto={id.motto ? `${id.motto} — “${id.mottoMeaning}”` : undefined}
      />
    </>
  );
}
