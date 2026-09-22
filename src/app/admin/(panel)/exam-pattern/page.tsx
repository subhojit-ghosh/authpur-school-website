import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { getExamPattern } from "@/lib/settings";
import { ExamPatternForm } from "./exam-pattern-form";

export const metadata: Metadata = { title: "Examination Pattern" };

export default async function ExamPatternAdminPage() {
  const pattern = await getExamPattern();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Examination Pattern"
        title="Tests, marks and pass criteria"
        description="Edit what parents see on the Examination Pattern page, one group of classes at a time. Changes are published when you save."
        actions={
          <Button asChild variant="outline" className="h-10">
            <Link href="/examination-pattern" target="_blank">
              <ExternalLink className="size-4" />
              View Examination Pattern page
            </Link>
          </Button>
        }
      />
      <ExamPatternForm initial={pattern} />
    </div>
  );
}
