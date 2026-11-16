import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Images } from "lucide-react";
import { EmptyState } from "@/components/admin/empty-state";
import { ImageUploader } from "@/components/admin/image-uploader";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { countGalleryPhotos, getGalleryPhotos } from "@/lib/media";
import { getGalleryCategories } from "@/lib/settings";
import { cn } from "@/lib/utils";
import { CategoriesEditor } from "./categories-editor";
import { GalleryPhotoCard } from "./gallery-photo-card";

export const metadata: Metadata = { title: "Photo Gallery" };

export default async function GalleryAdminPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category = "" } = await searchParams;
  const categories = await getGalleryCategories();
  const active = categories.includes(category) ? category : undefined;
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
        categories={categories}
        defaultCategory={active}
        hint="JPG, PNG or WebP · up to 15 MB each · you can select several at once"
      />

      <CategoriesEditor initial={categories} />

      {/* Category filter */}
      <nav aria-label="Filter by category" className="flex flex-wrap gap-2">
        {["All", ...categories].map((c) => {
          const isActive = c === "All" ? !active : active === c;
          return (
            <Link
              key={c}
              href={c === "All" ? "/admin/gallery" : `/admin/gallery?category=${encodeURIComponent(c)}`}
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
            <GalleryPhotoCard key={p.id} photo={p} categories={categories} />
          ))}
        </ul>
      )}
    </div>
  );
}
