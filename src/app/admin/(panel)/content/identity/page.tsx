import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { RowsEditor } from "@/components/admin/rows-editor";
import { Button } from "@/components/ui/button";
import { getIdentity } from "@/lib/page-content";
import { saveIdentity } from "../actions";
import { ContentForm, Field, Section, TextField } from "@/components/admin/content-form";

export const metadata: Metadata = { title: "School identity & footer" };

export default async function IdentityContentPage() {
  const id = await getIdentity();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Website Text"
        title="School identity & footer"
        description="The school's name and motto, and everything written in the footer at the bottom of every page."
        actions={
          <Button asChild variant="outline" className="h-10">
            <Link href="/admin/content">
              <ArrowLeft className="size-4" />
              All text
            </Link>
          </Button>
        }
      />

      <ContentForm action={saveIdentity}>
        <Section title="Identity" description="Used in the header, the footer and the browser tab.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="name" label="Full school name" defaultValue={id.name} />
            <Field name="shortName" label="Short name" defaultValue={id.shortName} hint="Shown next to the crest." />
            <Field name="established" label="Established year" defaultValue={id.established} inputMode="numeric" maxLength={4} />
            <Field name="tagline" label="Tagline" defaultValue={id.tagline} />
            <Field name="motto" label="Motto" defaultValue={id.motto} />
            <Field name="mottoMeaning" label="What the motto means" defaultValue={id.mottoMeaning} />
          </div>
        </Section>

        <Section title="Trust lines" description="The two short lines above the statistics on the home page.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="affiliationLine" label="Affiliation line" defaultValue={id.affiliationLine} />
            <Field name="trustLine" label="Years-of-trust line" defaultValue={id.trustLine} />
          </div>
        </Section>

        <Section title="Footer">
          <TextField
            name="footerBlurb"
            label="Short paragraph under the crest"
            defaultValue={id.footerBlurb}
            rows={2}
            hint="Write {year} where the established year should appear."
          />
          <Field name="footerCopyrightNote" label="Note beside the copyright line" defaultValue={id.footerCopyrightNote} />
          <div className="grid gap-2">
            <p className="text-sm font-medium">“Explore” links</p>
            <RowsEditor
              name="explore"
              columns={[
                { key: "label", label: "Label", placeholder: "e.g. Admission" },
                { key: "href", label: "Address", placeholder: "e.g. /admissions" },
              ]}
              initial={id.footerExplore}
              addLabel="Add link"
            />
          </div>
          <div className="grid gap-2">
            <p className="text-sm font-medium">“Navigate” links</p>
            <RowsEditor
              name="navigate"
              columns={[
                { key: "label", label: "Label", placeholder: "e.g. Notice Board" },
                { key: "href", label: "Address", placeholder: "e.g. /notices" },
              ]}
              initial={id.footerNavigate}
              addLabel="Add link"
            />
          </div>
        </Section>
      </ContentForm>
    </div>
  );
}
