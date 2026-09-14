import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { getAdmissionsContent } from "@/lib/settings";
import { AdmissionsForm } from "./admissions-form";

export const metadata: Metadata = { title: "Admissions Content" };

export default async function AdmissionsAdminPage() {
  const content = await getAdmissionsContent();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Admissions Content"
        title="Admission dates, eligibility & fees"
        description="Edit what parents see on the Admissions page. Changes are published when you save."
        actions={
          <Button asChild variant="outline" className="h-10">
            <Link href="/admissions" target="_blank">
              <ExternalLink className="size-4" />
              View Admissions page
            </Link>
          </Button>
        }
      />
      <AdmissionsForm initial={content} />
    </div>
  );
}
