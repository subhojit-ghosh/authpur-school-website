import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUp, ExternalLink, PanelTop, Trash2 } from "lucide-react";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { EmptyState } from "@/components/admin/empty-state";
import { ImageUploader } from "@/components/admin/image-uploader";
import { AdminPageHeader } from "@/components/admin/page-header";
import { SubmitButton } from "@/components/admin/pending";
import { Button } from "@/components/ui/button";
import { getBanners } from "@/lib/media";
import { deleteBanner, moveBanner } from "./actions";
import { BannerDescriptionForm } from "./banner-description-form";

export const metadata: Metadata = { title: "Hero Banner" };

export default async function BannersPage() {
  const list = await getBanners();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Hero Banner"
        title="Home-page banner images"
        description="These full-width photos rotate in the carousel at the top of the home page, in the order shown here. Landscape photos at least 1600 px wide look best."
        actions={
          <Button asChild variant="outline" className="h-10">
            <Link href="/" target="_blank">
              <ExternalLink className="size-4" />
              View home page
            </Link>
          </Button>
        }
      />

      <ImageUploader kind="banner" hint="JPG, PNG or WebP · up to 15 MB each · resized and optimised automatically" />

      {list.length === 0 ? (
        <EmptyState icon={PanelTop} title="No banner images" description="Upload at least one photo above. Until then the home page shows the original sample banners." />
      ) : (
        <ol className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((b, i) => (
            <li key={b.id} className="overflow-hidden rounded-2xl border bg-card">
              <div className="relative aspect-video bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.thumbUrl} alt={b.alt} className="h-full w-full object-cover" loading="lazy" />
                <span className="absolute left-3 top-3 grid size-7 place-items-center rounded-full bg-brand font-heading text-sm font-semibold text-brand-foreground shadow">
                  {i + 1}
                </span>
                {!b.storageKey ? (
                  <span className="absolute right-3 top-3 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Original
                  </span>
                ) : null}
              </div>
              <div className="space-y-3 p-4">
                <BannerDescriptionForm id={b.id} alt={b.alt} />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <form action={moveBanner}>
                      <input type="hidden" name="id" value={b.id} />
                      <input type="hidden" name="direction" value="up" />
                      <SubmitButton icon={<ArrowUp className="size-4" />} size="icon-sm" variant="ghost" disabled={i === 0} aria-label="Move earlier" />
                    </form>
                    <form action={moveBanner}>
                      <input type="hidden" name="id" value={b.id} />
                      <input type="hidden" name="direction" value="down" />
                      <SubmitButton icon={<ArrowDown className="size-4" />} size="icon-sm" variant="ghost" disabled={i === list.length - 1} aria-label="Move later" />
                    </form>
                    {b.width && b.height ? (
                      <span className="ml-1 text-[11px] text-muted-foreground">
                        {b.width} × {b.height}
                      </span>
                    ) : null}
                  </div>
                  <form action={deleteBanner}>
                    <input type="hidden" name="id" value={b.id} />
                    <ConfirmButton
                      icon={<Trash2 className="size-4" />}
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      message="Remove this banner from the home page?\n\nThis cannot be undone."
                    >
                      Remove
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
