import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { RowsEditor } from "@/components/admin/rows-editor";
import { Button } from "@/components/ui/button";
import { getHomeContent } from "@/lib/page-content";
import { CAMPUS_ICONS, FEATURE_ICONS, PILLAR_ICONS } from "@/lib/page-content-types";
import { saveHome } from "../actions";
import { ContentForm, Field, HeadingFields, Section, TextField } from "@/components/admin/content-form";

export const metadata: Metadata = { title: "Home page sections" };

export default async function HomeContentPage() {
  const home = await getHomeContent();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Website Text"
        title="Home page sections"
        description="Every heading and paragraph on the home page, section by section, in the order they appear."
        actions={
          <>
            <Button asChild variant="outline" className="h-10">
              <Link href="/" target="_blank">
                <ExternalLink className="size-4" />
                View home page
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

      <ContentForm action={saveHome}>
        <Section title="Statistics band" description="The four figures shown under the banner photos.">
          <RowsEditor
            name="stats"
            columns={[
              { key: "value", label: "Figure", placeholder: "e.g. 2,400+" },
              { key: "label", label: "Label", placeholder: "e.g. Students" },
              { key: "hint", label: "Small note", placeholder: "e.g. Pre-primary to Class 12" },
            ]}
            initial={home.stats}
            addLabel="Add statistic"
          />
        </Section>

        <Section title="About" description="The welcome section with the quote and the three pillars.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="about.eyebrow" label="Small label" defaultValue={home.about.eyebrow} />
            <Field name="about.heading" label="Heading" defaultValue={home.about.heading} />
          </div>
          <TextField
            name="about.paragraphs"
            label="Paragraphs"
            defaultValue={home.about.paragraphs}
            rows={7}
            hint="One blank line starts a new paragraph. Write {year} for the established year and {shortName} for the short school name."
          />
          <input type="hidden" name="about.blurb" value={home.about.blurb} />
          <TextField name="about.quote" label="Pull quote" defaultValue={home.about.quote} rows={3} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="about.quoteName" label="Quote — name" defaultValue={home.about.quoteName} />
            <Field name="about.quoteRole" label="Quote — role" defaultValue={home.about.quoteRole} />
          </div>
          <div className="grid gap-2">
            <p className="text-sm font-medium">Vision, mission and values</p>
            <RowsEditor
              name="pillars"
              columns={[
                { key: "icon", label: `Icon (${PILLAR_ICONS.join(" / ")})`, placeholder: PILLAR_ICONS[0] },
                { key: "title", label: "Title", placeholder: "e.g. Our Vision" },
                { key: "text", label: "Text", placeholder: "One or two sentences" },
              ]}
              initial={home.about.pillars}
              addLabel="Add pillar"
            />
          </div>
        </Section>

        <Section title="Academics" description="The dark blue section with the three programme cards.">
          <HeadingFields prefix="academics" value={home.academics} />
          <RowsEditor
            name="programmes"
            columns={[
              { key: "title", label: "Programme", placeholder: "e.g. Primary School" },
              { key: "grades", label: "Classes", placeholder: "e.g. Class I – V" },
              { key: "blurb", label: "Description", placeholder: "One or two sentences" },
              { key: "points", label: "Points (one per line)", placeholder: "Play-based learning" },
            ]}
            initial={home.academics.programmes}
            addLabel="Add programme"
          />
        </Section>

        <Section title="Why families choose us">
          <HeadingFields prefix="whyUs" value={home.whyUs} blurbLabel="Paragraph on the right" />
          <RowsEditor
            name="features"
            columns={[
              { key: "icon", label: `Icon (${FEATURE_ICONS.join(" / ")})`, placeholder: FEATURE_ICONS[0] },
              { key: "title", label: "Title", placeholder: "e.g. Modern Science Labs" },
              { key: "text", label: "Text", placeholder: "One or two sentences" },
            ]}
            initial={home.whyUs.features}
            addLabel="Add feature"
          />
        </Section>

        <Section title="Campus life">
          <HeadingFields prefix="campus" value={home.campus} />
          <RowsEditor
            name="tiles"
            columns={[
              { key: "icon", label: `Icon (${CAMPUS_ICONS.join(" / ")})`, placeholder: CAMPUS_ICONS[0] },
              { key: "label", label: "Tile label", placeholder: "e.g. Green Campus" },
            ]}
            initial={home.campus.tiles}
            addLabel="Add tile"
          />
        </Section>

        <Section title="Notice board headings" description="The two headings above the notices and events on the home page.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="notices.eyebrow" label="Notices — small label" defaultValue={home.notices.eyebrow} />
            <Field name="notices.heading" label="Notices heading" defaultValue={home.notices.heading} />
            <Field name="notices.eventsEyebrow" label="Events — small label" defaultValue={home.notices.eventsEyebrow} />
            <Field name="notices.eventsHeading" label="Events heading" defaultValue={home.notices.eventsHeading} />
          </div>
        </Section>

        <Section title="Testimonials">
          <HeadingFields prefix="testimonials" value={home.testimonials} />
          <RowsEditor
            name="testimonials"
            columns={[
              { key: "quote", label: "Quote", placeholder: "What they said" },
              { key: "name", label: "Name", placeholder: "e.g. Mrs. Ananya Sen" },
              { key: "role", label: "Role", placeholder: "e.g. Parent, Class VIII" },
            ]}
            initial={home.testimonials.items}
            addLabel="Add testimonial"
          />
        </Section>

        <Section title="Admissions call to action" description="The gold-and-navy panel near the bottom of the home page.">
          <HeadingFields prefix="admissionsCta" value={home.admissionsCta} />
          <RowsEditor
            name="steps"
            columns={[
              { key: "title", label: "Step", placeholder: "e.g. Enquire & collect form" },
              { key: "text", label: "Text", placeholder: "One short sentence" },
            ]}
            initial={home.admissionsCta.steps}
            addLabel="Add step"
          />
        </Section>

        <Section title="Contact section">
          <HeadingFields prefix="contact" value={home.contact} />
        </Section>
      </ContentForm>
    </div>
  );
}
