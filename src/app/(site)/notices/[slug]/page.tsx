import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, Bell, CalendarDays } from "lucide-react";
import { PageBanner } from "@/components/page-banner";
import { RichText } from "@/components/rich-text";
import { Button } from "@/components/ui/button";
import { getNotices, getPublicNotice } from "@/lib/content";
import { noticeTagClass } from "@/lib/content-types";
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
        <div className="container-edge grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <article>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${noticeTagClass(notice.tag)}`}
              >
                {notice.tag}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <CalendarDays className="size-4 text-gold" />
                {formatDate(notice.date, "long")}
              </span>
            </div>

            <h2 className="mt-5 text-balance font-heading text-2xl font-semibold text-brand sm:text-3xl">
              {notice.title}
            </h2>

            {notice.description ? (
              <RichText html={notice.description} className="mt-6 text-base" />
            ) : (
              <p className="mt-6 rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
                There is no further detail for this notice. Please contact the school office if you need more
                information.
              </p>
            )}

            <div className="mt-10 flex flex-wrap gap-3 border-t pt-6">
              <Button asChild variant="outline">
                <Link href="/notices">
                  <ArrowLeft className="size-4" />
                  All notices
                </Link>
              </Button>
              <Button asChild className="bg-brand text-brand-foreground hover:bg-brand-muted">
                <Link href="/admission-enquiry">
                  Ask a question
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </article>

          {others.length ? (
            <aside>
              <h2 className="flex items-center gap-2.5 font-heading text-xl font-semibold text-brand">
                <Bell className="size-5 text-gold" />
                Other notices
              </h2>
              <ul className="mt-5 space-y-3">
                {others.map((n) => (
                  <li key={n.id}>
                    <Link
                      href={noticePath(n)}
                      className="group block rounded-2xl border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <span className="text-xs font-medium text-muted-foreground">{formatDate(n.date, "long")}</span>
                      <span className="mt-1 block text-sm font-medium text-foreground transition-colors group-hover:text-brand">
                        {n.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </div>
      </section>
    </>
  );
}
