import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { getSchoolInfo, getTimings } from "@/lib/settings";
import { SchoolInfoForm, TimingsForm } from "./school-info-forms";

export const metadata: Metadata = { title: "School Info" };

export default async function SchoolInfoPage() {
  const [info, timings] = await Promise.all([getSchoolInfo(), getTimings()]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="School Info"
        title="Contact details, address & timings"
        description="One place to update the details shown across the whole website."
        actions={
          <Button asChild variant="outline" className="h-10">
            <Link href="/school-timings" target="_blank">
              <ExternalLink className="size-4" />
              View School Timings
            </Link>
          </Button>
        }
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <SchoolInfoForm initial={info} />
        <TimingsForm initial={timings} />
      </div>
    </div>
  );
}
