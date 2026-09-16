import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { RowsEditor } from "@/components/admin/rows-editor";
import { Button } from "@/components/ui/button";
import { getLabsContent } from "@/lib/page-content";
import { LAB_ICONS } from "@/lib/page-content-types";
import { saveLabs } from "../actions";
import { ContentForm, Section } from "@/components/admin/content-form";

export const metadata: Metadata = { title: "Laboratories" };

export default async function LabsContentPage() {
  const labs = await getLabsContent();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Website Text"
        title="Laboratories"
        description="The laboratories listed on the Labs page."
        actions={
          <>
            <Button asChild variant="outline" className="h-10">
              <Link href="/labs" target="_blank">
                <ExternalLink className="size-4" />
                View page
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-10">
              <Link href="/admin/content">
                <ArrowLeft className="size-4" />
                All text
              </Link>
            </Button>
          </>
        }
      />

      <ContentForm action={saveLabs}>
        <Section
          title="Laboratories"
          description={`Icon choices: ${LAB_ICONS.join(", ")}. Put each highlight on its own line.`}
        >
          <RowsEditor
            name="labs"
            columns={[
              { key: "icon", label: "Icon", placeholder: LAB_ICONS[0] },
              { key: "name", label: "Name", placeholder: "e.g. Physics Laboratory" },
              { key: "blurb", label: "Description", placeholder: "One or two sentences", multiline: true },
              { key: "points", label: "Highlights (one per line)", placeholder: "Optics kits", multiline: true },
            ]}
            initial={labs.items}
            addLabel="Add laboratory"
          />
        </Section>
      </ContentForm>
    </div>
  );
}
