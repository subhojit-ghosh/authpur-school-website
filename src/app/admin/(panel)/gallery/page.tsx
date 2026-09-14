import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Images, Save, Trash2 } from "lucide-react";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { EmptyState } from "@/components/admin/empty-state";
import { ImageUploader } from "@/components/admin/image-uploader";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { countGalleryPhotos, getGalleryPhotos } from "@/lib/media";
import { GALLERY_CATEGORIES, isGalleryCategory } from "@/lib/settings-types";
import { cn } from "@/lib/utils";
import { deleteGalleryPhoto, updateGalleryPhoto } from "./actions";

export const metadata: Metadata = { title: "Photo Gallery" };

export default async function GalleryAdminPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category = "" } = await searchParams;
  const active = isGalleryCategory(category) ? category : undefined;
  const [list, total] = await Promise.all([getGalleryPhotos(active), countGalleryPhotos()]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Photo Gallery"
        title="Gallery photographs"
        description={`${total} photo${total === 1 ? "" : "s"} on the website's Gallery page. Visitors can filter by category.`}
        actions={
          <Button asChild variant="outline" className="h-10">
            <Link href="/gallery" target="_blank">
              <ExternalLink className="size-4" />
              View gallery
            </Link>
          </Button>
        }
      />

      <ImageUploader
        kind="gallery"
        categories={GALLERY_CATEGORIES}
        defaultCategory={active}
        hint="JPG, PNG, WebP or HEIC · up to 15 MB each · you can select several at once"
      />

      {/* Category filter */}
      <nav aria-label="Filter by category" className="flex flex-wrap gap-2">
        {["All", ...GALLERY_CATEGORIES].map((c) => {
          const isActive = c === "All" ? !active : active === c;
          return (
            <Link
              key={c}
              href={c === "All" ? "/admin/gallery" : `/admin/gallery?category=${c}`}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                isActive ? "bg-brand text-brand-foreground" : "border bg-card text-foreground/70 hover:bg-accent hover:text-brand",
              )}
            >
              {c}
            </Link>
          );
        })}
      </nav>

      {list.length === 0 ? (
        <EmptyState
          icon={Images}
          title={active ? `No photos in ${active} yet` : "No photos yet"}
          description="Upload photographs above. Until the first photo is added, the website's Gallery page shows placeholder tiles."
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((p) => (
            <li key={p.id} className="overflow-hidden rounded-2xl border bg-card">
              <a href={p.url} target="_blank" rel="noreferrer" className="block aspect-4/3 bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.thumbUrl} alt={p.caption || p.category} className="h-full w-full object-cover" loading="lazy" />
              </a>
              <form action={updateGalleryPhoto} className="grid gap-2 p-4">
                <input type="hidden" name="id" value={p.id} />
                <Input name="caption" defaultValue={p.caption} placeholder="Caption (optional)" maxLength={160} className="h-9 text-xs" aria-label="Caption" />
                <div className="flex items-center gap-2">
                  <NativeSelect name="category" defaultValue={p.category} className="h-9 text-xs" aria-label="Category">
                    {GALLERY_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </NativeSelect>
                  <Button type="submit" size="icon-sm" variant="outline" aria-label="Save caption and category">
                    <Save className="size-4" />
                  </Button>
                  <ConfirmButton
                    size="icon-sm"
                    variant="ghost"
                    formAction={deleteGalleryPhoto}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Delete photo"
                    message="Delete this photo from the gallery?\n\nThis cannot be undone."
                  >
                    <Trash2 className="size-4" />
                  </ConfirmButton>
                </div>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
