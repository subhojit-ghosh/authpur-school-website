import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBanner } from "@/components/page-banner";
import { LeadershipMessage } from "@/components/leadership-message";
import { getIdentity, getLeaders } from "@/lib/page-content";
import { richTextToPlain } from "@/lib/rich-text";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

async function findLeader(slug: string) {
  const { people } = await getLeaders();
  return people.find((p) => p.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const leader = await findLeader(slug);
  if (!leader) return { title: "Page not found" };

  return {
    alternates: { canonical: `/leadership/${leader.slug}` },
    title: leader.pageTitle || `${leader.role}'s Message`,
    description:
      leader.pageIntro || richTextToPlain(leader.message, 160) || `A message from the ${leader.role}.`,
  };
}

export default async function LeaderPage({ params }: Props) {
  const { slug } = await params;
  const [leader, id] = await Promise.all([findLeader(slug), getIdentity()]);
  if (!leader) notFound();

  return (
    <>
      <PageBanner
        eyebrow="Leadership"
        title={leader.pageTitle || `${leader.role}'s Message`}
        subtitle={leader.pageIntro}
      />
      <LeadershipMessage
        person={leader}
        motto={id.motto ? `${id.motto} — “${id.mottoMeaning}”` : undefined}
      />
    </>
  );
}
