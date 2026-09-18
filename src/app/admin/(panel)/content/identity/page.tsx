import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { RowsEditor } from "@/components/admin/rows-editor";
import { Button } from "@/components/ui/button";
import { getIdentity } from "@/lib/page-content";
import { saveIdentity } from "../actions";
import { ContentForm, Field, RichField, Section } from "@/components/admin/content-form";
import { toRichHtml } from "@/lib/rich-text";
import { SOCIAL_ICONS } from "@/lib/page-content-types";

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
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              name="footerCrestLine"
              label="Line under the name beside the crest"
              defaultValue={id.footerCrestLine}
              hint="Leave empty to hide it."
            />
            <Field
              name="footerRightsNote"
              label="Wording after the year"
              defaultValue={id.footerRightsNote}
              hint="Follows “© 2026 School name.”"
            />
          </div>
          <RichField
            name="footerBlurb"
            label="Short paragraph under the crest"
            defaultValue={toRichHtml(id.footerBlurb)}
            hint="Write {year} where the established year should appear."
          />
          <Field name="footerCopyrightNote" label="Note beside the copyright line" defaultValue={id.footerCopyrightNote} />

          <div className="grid gap-4 sm:grid-cols-3">
            <Field name="footerExploreHeading" label="First column heading" defaultValue={id.footerExploreHeading} />
            <Field name="footerNavigateHeading" label="Second column heading" defaultValue={id.footerNavigateHeading} />
            <Field name="footerContactHeading" label="Contact column heading" defaultValue={id.footerContactHeading} />
          </div>

          <div className="grid gap-2">
            <p className="text-sm font-medium">First column links</p>
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
            <p className="text-sm font-medium">Second column links</p>
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

          <div className="grid gap-2">
            <p className="text-sm font-medium">Round buttons at the bottom</p>
            <p className="text-xs text-muted-foreground">
              Icon choices: {SOCIAL_ICONS.join(", ")}. Paste the full address of the school&rsquo;s page, for example
              https://facebook.com/yourschool or https://wa.me/919830000000. Remove every row to hide the buttons.
            </p>
            <RowsEditor
              name="social"
              columns={[
                { key: "icon", label: "Icon", placeholder: SOCIAL_ICONS[0] },
                { key: "label", label: "Name", placeholder: "e.g. Facebook" },
                { key: "href", label: "Address", placeholder: "https://facebook.com/yourschool" },
              ]}
              initial={id.footerSocial}
              addLabel="Add button"
            />
          </div>
        </Section>
      </ContentForm>
    </div>
  );
}
