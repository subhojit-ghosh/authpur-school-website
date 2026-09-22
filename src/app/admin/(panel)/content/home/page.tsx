import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { RowsEditor } from "@/components/admin/rows-editor";
import { Button } from "@/components/ui/button";
import { getHomeContent } from "@/lib/page-content";
import { FEATURE_ICONS, MAX_QUICK_LINKS, PILLAR_ICONS, QUICK_LINK_ICONS } from "@/lib/page-content-types";
import { getPhotoChoices } from "@/lib/photo-choices";
import { saveHome } from "../actions";
import { ContentForm, Field, HeadingFields, RichField, Section, TextField } from "@/components/admin/content-form";
import { toRichHtml } from "@/lib/rich-text";

export const metadata: Metadata = { title: "Home page sections" };

const quickIconLabels: Record<(typeof QUICK_LINK_ICONS)[number], string> = {
  apply: "Graduation cap",
  notices: "Megaphone",
  timings: "Clock and calendar",
  gallery: "Photos",
  events: "Calendar",
  phone: "Telephone",
  book: "Open book",
  map: "Map pin",
};

export default async function HomeContentPage() {
  const [home, photos] = await Promise.all([getHomeContent(), getPhotoChoices()]);
  const photoOptions = photos.map((p) => ({ value: p.ref, label: p.label, thumbUrl: p.thumbUrl }));
  const iconOptions = QUICK_LINK_ICONS.map((icon) => ({ value: icon, label: quickIconLabels[icon] }));

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
        <Section
          title="Quick links"
          description={`The coloured boxes over the foot of the banner photos, in order from left to right. There is room for ${MAX_QUICK_LINKS}. An address can be a page on this site, such as /notices, or a full web address.`}
        >
          <RowsEditor
            name="quickLinks"
            columns={[
              { key: "icon", label: "Icon", options: iconOptions, blankLabel: "Choose an icon" },
              { key: "label", label: "Title", placeholder: "e.g. Notice board" },
              { key: "text", label: "Short line", placeholder: "e.g. Circulars, results and holidays." },
              { key: "href", label: "Address", placeholder: "e.g. /notices" },
            ]}
            initial={home.quickLinks}
            addLabel="Add quick link"
          />
        </Section>

        <Section title="Figures" description="The four large figures under the vision, mission and values.">
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

        <Section title="About" description="The welcome section with the photo and the quote, then the navy band with the vision, mission and values.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="about.eyebrow" label="Small label" defaultValue={home.about.eyebrow} />
            <Field name="about.heading" label="Heading" defaultValue={home.about.heading} />
          </div>
          <RichField
            name="about.paragraphs"
            label="Paragraphs"
            defaultValue={toRichHtml(home.about.paragraphs)}
            placeholder="Write the welcome paragraphs here…"
            hint="Write {year} for the established year and {shortName} for the short school name."
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

        <Section title="Academics" description="The school stages, each in its own colour with the classes set large.">
          <HeadingFields prefix="academics" value={home.academics} />
          <RowsEditor
            name="programmes"
            columns={[
              { key: "title", label: "Programme", placeholder: "e.g. Primary School" },
              { key: "grades", label: "Classes", placeholder: "e.g. Class I – V" },
              { key: "blurb", label: "Description", placeholder: "One or two sentences" },
              { key: "points", label: "Points (one per line)", placeholder: "Play-based learning", multiline: true },
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

        <Section
          title="Campus life"
          description="The photo tiles; the first one is shown large. Pick a photo from the gallery or the banners for each tile. Left on automatic, a tile takes the next gallery photo not already used."
        >
          <HeadingFields prefix="campus" value={home.campus} />
          <RowsEditor
            name="tiles"
            columns={[
              { key: "label", label: "Tile label", placeholder: "e.g. Green Campus" },
              { key: "photo", label: "Photo", options: photoOptions, blankLabel: "Automatic" },
            ]}
            initial={home.campus.tiles.map((t) => ({ label: t.label, photo: t.photo ?? "" }))}
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

        <Section title="Admissions call to action" description="The navy band over a photo near the bottom of the home page, with its numbered steps.">
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
