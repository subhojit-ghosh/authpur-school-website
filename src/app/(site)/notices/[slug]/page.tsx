import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageBanner } from "@/components/page-banner";
import { READING_TEXT, RichText } from "@/components/rich-text";
import { NoticeList } from "@/components/notice-list";
import { Reveal } from "@/components/motion";
import { getNotices, getPublicNotice } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { idFromSlug, noticePath } from "@/lib/permalinks";
import { richTextToPlain } from "@/lib/rich-text";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const id = idFromSlug(slug);
  const notice = id ? await getPublicNotice(id) : undefined;
  if (!notice) return { title: "Notice not found" };

  return {
    title: notice.title,
    alternates: { canonical: noticePath(notice) },
    description: richTextToPlain(notice.description, 160) || `Notice published on ${formatDate(notice.date, "long")}.`,
  };
}

export default async function NoticePage({ params }: Props) {
  const { slug } = await params;
  const id = idFromSlug(slug);
  if (!id) notFound();

  const notice = await getPublicNotice(id);
  if (!notice) notFound();

  // Keep one address per notice: a stale or hand-typed slug goes to the current one.
  const canonical = noticePath(notice);
  if (canonical !== `/notices/${slug}`) redirect(canonical);

  const others = (await getNotices({ limit: 5 })).filter((n) => n.id !== notice.id).slice(0, 4);

  return (
    <>
      <PageBanner eyebrow={notice.tag} title={notice.title} subtitle={formatDate(notice.date, "long")} />

      <section className="py-16 lg:py-24">
        <div className="container-edge grid gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <article>
              {notice.description ? (
                <RichText html={notice.description} className={READING_TEXT} />
              ) : (
                <p className="rounded-lg bg-mist p-6 text-lg text-muted-foreground">
                  There is no further detail for this notice. Please contact the school office if you need more
                  information.
                </p>
              )}

              <p className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t pt-6 text-[17px]">
                <Link href="/notices" className="text-link">
                  Back to all notices
                </Link>
                <Link href="/admission-enquiry" className="text-link">
                  Ask the office a question
                </Link>
              </p>
            </article>
          </Reveal>

          {others.length ? (
            <aside className="lg:col-span-5">
              <h2 className="font-heading text-xl font-semibold text-brand">Other notices</h2>
              <div className="mt-5">
                <NoticeList notices={others} compact />
              </div>
            </aside>
          ) : null}
        </div>
      </section>
    </>
  );
}
