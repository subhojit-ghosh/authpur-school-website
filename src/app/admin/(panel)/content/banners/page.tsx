import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { getPageBanners } from "@/lib/page-content";
import { PAGE_BANNER_LABELS, type PageBanners } from "@/lib/page-content-types";
import { savePageBanners } from "../actions";
import { ContentForm, Field, Section, TextField } from "@/components/admin/content-form";

export const metadata: Metadata = { title: "Page headings" };

export default async function PageBannersPage() {
  const banners = await getPageBanners();
  const keys = Object.keys(PAGE_BANNER_LABELS) as (keyof PageBanners)[];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Website Text"
        title="Page headings"
        description="The blue band at the top of each interior page: a small label, the page title and one introductory sentence."
        actions={
          <Button asChild variant="outline" className="h-10">
            <Link href="/admin/content">
              <ArrowLeft className="size-4" />
              All text
            </Link>
          </Button>
        }
      />

      <ContentForm action={savePageBanners}>
        {keys.map((key) => (
          <Section key={key} title={PAGE_BANNER_LABELS[key]}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name={`${key}.eyebrow`} label="Small label" defaultValue={banners[key].eyebrow} />
              <Field name={`${key}.title`} label="Page title" defaultValue={banners[key].title} />
            </div>
            <TextField name={`${key}.subtitle`} label="Introduction" defaultValue={banners[key].subtitle} rows={2} />
          </Section>
        ))}
      </ContentForm>
    </div>
  );
}
